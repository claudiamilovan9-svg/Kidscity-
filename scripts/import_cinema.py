"""Daily conservative Cinema City / CineMagia import for a rolling 60-day window.

Only confirmed showtimes from source pages are published. No guessed screenings.
"""
import datetime as dt
import json
import os
import re
import sys
import time
import urllib.parse
import urllib.error
import urllib.request
from zoneinfo import ZoneInfo

from bs4 import BeautifulSoup

TZ = ZoneInfo("Europe/Bucharest")
CINEMAS = [
    ("Cinema City Iulius Mall", "cinema-city-iulius-mall-timisoara",
     "https://www.cinemacity.ro/cinemas/timisoara-iulius-mall/1802"),
    ("Cinema City Shopping City", "cinema-city-shopping-city-timisoara",
     "https://www.cinemacity.ro/cinemas/timisoara-shopping-city/1823"),
]
# Conservative selection: animation/family genre AND no known adult rating.
FAMILY_GENRES = ("anima", "familie", "family")
EXCLUDE = ("interzis", "im-18", "n-15", "nc-17", "18+")
TIME = re.compile(r"(?<!\\d)([01]\\d|2[0-3]):([0-5]\\d)(?!\\d)")
HEADERS = {"User-Agent": "KidsCityCinemaSchedule/1.0 (contact: repository GitHub claudiamilovan9-svg/Kidscity-)"}


def get(url):
    req = urllib.request.Request(url, headers=HEADERS)
    with urllib.request.urlopen(req, timeout=18) as response:
        if response.status != 200:
            raise RuntimeError(f"HTTP {response.status}")
        return response.read().decode("utf-8", "replace")


def parse_films(html):
    """Parse mobile CineMagia's per-film list conservatively; fail closed if layout changes."""
    soup = BeautifulSoup(html, "html.parser")
    for node in soup(["script", "style", "nav", "footer", "header"]):
        node.decompose()
    lines = [re.sub(r"\\s+", " ", t).strip() for t in soup.get_text("\\n").splitlines()]
    lines = [t for t in lines if t]
    results = []
    for i, line in enumerate(lines):
        if not (line.startswith("Gen:") or line.startswith("Gen film:")):
            continue
        genre = line.split(":", 1)[-1].lower()
        if not any(x in genre for x in FAMILY_GENRES):
            continue
        # The mobile listing shows title, original title, rating, genre, then Bilete and times.
        preceding = lines[max(0, i - 8):i]
        title = next((x for x in preceding if len(x) > 3 and
                      not re.search(r"^(Nota|Imdb|premiera|Gen:|Bilete|Cinema City|Schimbă)", x, re.I)
                      and not TIME.search(x) and not x.startswith("Afişează")), "")
        # Prefer first text line in a compact film block, not ratings or the original title.
        for j in range(i - 1, max(-1, i - 9), -1):
            if lines[j].lower() in ("premiera", "premieră") or "imdb" in lines[j].lower():
                title = lines[j - 1] if j > 0 else title
                if j > 1 and len(lines[j - 2]) > 3 and not TIME.search(lines[j - 2]):
                    title = lines[j - 2]
                break
        if not title or len(title) > 160:
            continue
        next_genre = next((j for j in range(i + 1, min(len(lines), i + 70))
                          if lines[j].startswith(("Gen:", "Gen film:"))), len(lines))
        section = lines[i + 1:next_genre]
        if not any("Bilete" in x or "Cumpără bilete" in x for x in section):
            continue
        section_text = " ".join(section)
        ticket_pos = section_text.find("Bilete")
        if ticket_pos < 0:
            continue
        times_text = section_text[ticket_pos + len("Bilete"):]
        # Limit the extraction to the showtime block, not the following movie title.
        times_text = re.split(r"\\b(?:Nota|Imdb|premiera|Gen:|Cinema City)\\b", times_text)[0]
        times = sorted(set(m.group(0) for m in TIME.finditer(times_text)))
        if not times or len(times) > 25 or any(x in section_text.lower() for x in EXCLUDE):
            continue
        results.append((title, times, genre))
    # Duplicate film blocks can occur in mobile pages; merge by normalized title.
    merged = {}
    for title, times, genre in results:
        key = title.casefold()
        if key not in merged:
            merged[key] = [title, set(), genre]
        merged[key][1].update(times)
    return [(v[0], sorted(v[1]), v[2]) for v in merged.values()]


def api(url, key, path, method="GET", payload=None):
    data = json.dumps(payload).encode() if payload is not None else None
    headers = {"apikey": key, "Authorization": "Bearer " + key}
    if data is not None:
        headers["Content-Type"] = "application/json"
        headers["Prefer"] = "return=minimal"
    request = urllib.request.Request(url.rstrip("/") + "/rest/v1/" + path,
                                     headers=headers, data=data, method=method)
    with urllib.request.urlopen(request, timeout=20) as response:
        body = response.read()
        return json.loads(body) if body else None


def main():
    days = int(os.getenv("CINEMA_LOOKAHEAD_DAYS", "60"))
    if not 1 <= days <= 90:
        sys.exit("Invalid lookahead")
    dry = os.getenv("CINEMA_DRY_RUN", "false").lower() == "true"
    base = os.getenv("SUPABASE_URL", "")
    key = os.getenv("SUPABASE_SERVICE_ROLE_KEY", "")
    if not dry and (not base or not key):
        sys.exit("Missing Supabase GitHub Actions secrets")
    today = dt.datetime.now(TZ).date()
    published = 0
    scanned = 0
    errors = 0
    existing = set()
    blocked_sources = set()
    if not dry:
        params = urllib.parse.urlencode({
            "select": "title,venue,starts_at",
            "category": "eq.Cinema pentru copii",
            "starts_at": "gte." + today.isoformat() + "T00:00:00+02:00",
            "limit": "10000",
        })
        for item in api(base, key, "kidscity_events?" + params) or []:
            timestamp = dt.datetime.fromisoformat(item["starts_at"].replace("Z", "+00:00")).astimezone(TZ)
            existing.add((item["title"].casefold(), item["venue"], timestamp.strftime("%Y-%m-%d %H:%M")))
    for offset in range(days):
        date = today + dt.timedelta(days=offset)
        for venue, slug, tickets in CINEMAS:
            if slug in blocked_sources:
                continue
            url = "https://m.cinemagia.ro/program-cinema/" + slug + "/?" + urllib.parse.urlencode({
                "from_date": date.strftime("%d.%m.%Y")
            })
            try:
                html = get(url)
                # Guard against the source silently falling back to another day.
                page_text = BeautifulSoup(html, "html.parser").get_text(" ", strip=True).lower()
                if not (date.strftime("%d.%m.%Y") in page_text or
                        f"{date.day} {['ianuarie','februarie','martie','aprilie','mai','iunie','iulie','august','septembrie','octombrie','noiembrie','decembrie'][date.month - 1]}" in page_text):
                    print(f"Unconfirmed date: {venue} {date}")
                    continue
                films = parse_films(html)
                scanned += 1
                for title, times, genre in films:
                    for hour in times:
                        signature = (title.casefold(), venue, f"{date} {hour}")
                        if signature in existing:
                            continue
                        start = dt.datetime.combine(date, dt.time.fromisoformat(hour), TZ)
                        if start < dt.datetime.now(TZ):
                            continue
                        row = {
                            "title": title, "organizer": "Cinema City", "locality": "Timișoara",
                            "venue": venue, "category": "Cinema pentru copii",
                            "starts_at": start.isoformat(),
                            "description": "Program CineMagia · " + genre[:180],
                            "source_url": url, "ticket_url": tickets,
                            "verification_status": "verified",
                            "verified_at": dt.datetime.now(dt.timezone.utc).isoformat()
                        }
                        if not dry:
                            api(base, key, "kidscity_events", method="POST", payload=[row])
                        existing.add(signature)
                        published += 1
                print(f"{date} {venue}: {len(films)} family titles")
            except urllib.error.HTTPError as exc:
                errors += 1
                if exc.code in (401, 403, 429):
                    blocked_sources.add(slug)
                    print(f"ACCESS BLOCKED {venue}: HTTP {exc.code}. Skipping remaining dates for this source; do not retry or bypass access controls.", file=sys.stderr)
                else:
                    print(f"ERROR {date} {venue}: HTTP {exc.code}", file=sys.stderr)
            except Exception as exc:
                errors += 1
                print(f"ERROR {date} {venue}: {type(exc).__name__}: {exc}", file=sys.stderr)
            time.sleep(0.4)
        if len(blocked_sources) == len(CINEMAS):
            print("All sources blocked; stopping early.", file=sys.stderr)
            break
    print(f"Days={days}; source pages scanned={scanned}; new screenings={'would publish' if dry else 'published'}={published}; errors={errors}")
    if scanned == 0:
        sys.exit("No verified source pages parsed. Check CineMagia layout/network before publishing.")


if __name__ == "__main__":
    main()
