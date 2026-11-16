"""Conservative, daily JSON-LD event discovery. New records require human verification."""
import datetime as dt
import html
import json
import os
import re
import sys
import urllib.error
import urllib.parse
import urllib.request
from html.parser import HTMLParser
from zoneinfo import ZoneInfo

SOURCES = (
    "https://www.teatrul-merlin.ro/",
    "https://funmonkey.ro/evenimente",
    "https://fitt.ro/",
    "https://institutfrancais.ro/timisoara/",
    "https://www.tntm.ro/",
    "https://visit-timisoara.com/ro/evenimente-si-activitati/",
    "https://haiundeva.ro/timisoara/copii",
    "https://mic-tm.ro/activitati/",
    "https://kiddiopass.ro/ghid/timisoara/evenimente/",
    "https://www.timisoreni.ro/info/evenimente_parinti_copii/o--data_eveniment/",
    "https://www.onevent.ro/timisoara/copii-si-parinti/",
    "https://zilesinopti.ro/evenimente-copii-timisoara/",
    "https://cefacemcucopiii.ro/",
    "https://www.fest.ro/ro/timisoara/evenimente/",
    "https://eventbook.ro/",
    "https://fundatiajecza.ro/",
    "https://sotroncupovesti.ro/",
    "https://www.iuliustown.ro/ro/evenimente",
    "https://www.cinemacity.ro/cinemas/timisoara-iulius-mall/1802",
    "https://www.cinemagia.ro/program-cinema/cinema-city-iulius-mall-timisoara/?genre=animatie",
    "https://zilesinopti.ro/filme-copii-timisoara/",
)
LOCALITIES = ("timișoara", "timisoara", "dumbrăvița", "dumbravita", "giroc",
              "moșnița", "mosnita", "ghiroda")
TZ = ZoneInfo("Europe/Bucharest")
HEADERS = {"User-Agent": "KidsCityEventDiscovery/1.0 (public event metadata)"}

class JSONLDParser(HTMLParser):
    def __init__(self):
        super().__init__()
        self.active = False
        self.blocks = []
    def handle_starttag(self, tag, attrs):
        if tag == "script":
            self.active = dict(attrs).get("type", "").lower() == "application/ld+json"
    def handle_data(self, data):
        if self.active:
            self.blocks.append(data)
    def handle_endtag(self, tag):
        if tag == "script":
            self.active = False

def request(url, payload=None, method="GET"):
    data = None if payload is None else json.dumps(payload).encode()
    headers = dict(HEADERS)
    if data is not None:
        headers["Content-Type"] = "application/json"
    if url.startswith(os.environ.get("SUPABASE_URL", "__not_configured__") + "/rest/v1/"):
        key = os.environ["SUPABASE_SERVICE_ROLE_KEY"]
        headers.update({"apikey": key, "Authorization": "Bearer " + key})
    req = urllib.request.Request(url, data=data, headers=headers, method=method)
    with urllib.request.urlopen(req, timeout=20) as response:
        return response.read().decode("utf-8", errors="replace")

def walk(value):
    if isinstance(value, list):
        for item in value:
            yield from walk(item)
    elif isinstance(value, dict):
        types = value.get("@type", [])
        if isinstance(types, str):
            types = [types]
        if "Event" in types:
            yield value
        for key in ("@graph", "itemListElement"):
            if key in value:
                yield from walk(value[key])

def parse_date(value):
    if not isinstance(value, str):
        return None
    try:
        value = value.replace("Z", "+00:00")
        date = dt.datetime.fromisoformat(value)
        return date.replace(tzinfo=TZ) if date.tzinfo is None else date.astimezone(TZ)
    except ValueError:
        return None

def plain(value):
    return re.sub(r"\\s+", " ", html.unescape(re.sub(r"<[^>]*>", " ", str(value or "")))).strip()

def place_info(event):
    location = event.get("location") or {}
    if isinstance(location, list):
        location = location[0] if location else {}
    if isinstance(location, str):
        location = {"name": location}
    address = location.get("address") or {}
    if isinstance(address, str):
        address = {"addressLocality": address}
    place = plain(address.get("addressLocality", ""))
    full = " ".join((place, plain(location.get("name", "")), plain(address.get("streetAddress", "")))).lower()
    if not any(x in full for x in LOCALITIES):
        return None
    for name in ("Timișoara", "Dumbrăvița", "Giroc", "Moșnița Nouă", "Ghiroda"):
        if name.lower() in full or (name == "Timișoara" and "timisoara" in full) or (name == "Dumbrăvița" and "dumbravita" in full):
            return name, plain(location.get("name", "")) or None
    return None

def normalize(event, page, now, end):
    title = plain(event.get("name"))
    date = parse_date(event.get("startDate"))
    place = place_info(event)
    if not title or not date or not place or not now <= date <= end:
        return None
    organizer = event.get("organizer") or {}
    if isinstance(organizer, list):
        organizer = organizer[0] if organizer else {}
    if isinstance(organizer, dict):
        organizer = organizer.get("name", "")
    organizer = plain(organizer)
    if not organizer:
        return None
    source = event.get("url") or page
    if not isinstance(source, str) or urllib.parse.urlparse(source).scheme not in ("http", "https"):
        source = page
    description = plain(event.get("description"))[:800] or None
    return dict(title=title[:250], organizer=organizer[:250], locality=place[0],
                venue=place[1], category="Evenimente", starts_at=date.isoformat(),
                description=description, source_url=source,
                verification_status="pending")

def main():
    base = os.environ.get("SUPABASE_URL", "").rstrip("/")
    key = os.environ.get("SUPABASE_SERVICE_ROLE_KEY")
    if not base or not key:
        sys.exit("Missing SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY GitHub secrets.")
    days = int(os.environ.get("EVENT_LOOKAHEAD_DAYS", "90"))
    if not 1 <= days <= 365:
        sys.exit("Invalid EVENT_LOOKAHEAD_DAYS")
    now = dt.datetime.now(TZ)
    end = now + dt.timedelta(days=days)
    candidates = {}
    for page in SOURCES:
        try:
            parser = JSONLDParser()
            parser.feed(request(page))
            for block in parser.blocks:
                try:
                    obj = json.loads(block)
                except ValueError:
                    continue
                for item in walk(obj):
                    row = normalize(item, page, now, end)
                    if row:
                        signature = (row["title"].casefold(), row["starts_at"], row["locality"].casefold())
                        candidates[signature] = row
        except (urllib.error.URLError, TimeoutError, ValueError) as exc:
            print(f"Skipped {page}: {type(exc).__name__}")
    # Fetch existing rows in the same date window, including pending/verified records.
    endpoint = base + "/rest/v1/kidscity_events"
    params = urllib.parse.urlencode({"select": "title,starts_at,locality",
        "starts_at": "gte." + now.astimezone(dt.timezone.utc).isoformat()})
    existing = json.loads(request(endpoint + "?" + params))
    known = {(str(r["title"]).casefold(), parse_date(r["starts_at"]).isoformat(),
              str(r["locality"]).casefold()) for r in existing if parse_date(r.get("starts_at"))}
    added = 0
    for signature, row in candidates.items():
        if signature in known:
            continue
        try:
            request(endpoint, [row], method="POST")
            known.add(signature)
            added += 1
        except urllib.error.HTTPError as exc:
            if exc.code == 409:  # unique index prevents duplicate source/date/title
                continue
            raise
    print(f"Found {len(candidates)} dated JSON-LD candidates; inserted {added} pending-review events.")

if __name__ == "__main__":
    main()
