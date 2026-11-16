"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { createClient } from "@supabase/supabase-js";
import { ArrowLeft, ArrowRight, CalendarDays, MapPin, ExternalLink } from "lucide-react";

type EventItem = {
  id: string; title: string; organizer: string; locality: string; venue: string | null;
  category: string; starts_at: string; ends_at: string | null; age_label: string | null;
  price_label: string | null; description: string | null; source_url: string; ticket_url: string | null;
};
const zone = "Europe/Bucharest";
const dayKey = (date: Date) => new Intl.DateTimeFormat("en-CA", { timeZone: zone, year: "numeric", month: "2-digit", day: "2-digit" }).format(date);
const localTime = (iso: string) => new Intl.DateTimeFormat("ro-RO", { timeZone: zone, hour: "2-digit", minute: "2-digit" }).format(new Date(iso));
const todayKey = () => dayKey(new Date());
const monthTitle = (year: number, month: number) => new Intl.DateTimeFormat("ro-RO", { month: "long", year: "numeric" }).format(new Date(Date.UTC(year, month, 1)));
const mondayOffset = (year: number, month: number) => (new Date(Date.UTC(year, month, 1)).getUTCDay() + 6) % 7;

export default function EventsCalendar({ compact = false }: { compact?: boolean }) {
  const [today] = useState(todayKey);
  const [selected, setSelected] = useState(today);
  const [year, setYear] = useState(Number(today.slice(0, 4)));
  const [month, setMonth] = useState(Number(today.slice(5, 7)) - 1);
  const [locality, setLocality] = useState("");
  const [events, setEvents] = useState<EventItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  useEffect(() => {
    let mounted = true;
    async function load() {
      setLoading(true); setError("");
      try {
        const client = createClient("https://nwjbqulxdzjsswrbkbsh.supabase.co", "sb_publishable_evfql3aND0_BiIfzP5R6Nw_hOa0jy_r", { auth: { persistSession: false, autoRefreshToken: false } });
        const start = new Date(Date.UTC(year, month, 1) - 2 * 86400000).toISOString();
        const end = new Date(Date.UTC(year, month + 1, 3)).toISOString();
        const result = await client.from("kidscity_events")
          .select("id,title,organizer,locality,venue,category,starts_at,ends_at,age_label,price_label,description,source_url,ticket_url")
          .eq("verification_status", "verified").gte("starts_at", start).lt("starts_at", end)
          .order("starts_at", { ascending: true });
        if (result.error) throw result.error;
        if (mounted) setEvents((result.data ?? []) as EventItem[]);
      } catch (cause) {
        if (mounted) setError(cause instanceof Error ? cause.message : "Nu am putut încărca evenimentele.");
      } finally { if (mounted) setLoading(false); }
    }
    load();
    return () => { mounted = false; };
  }, [year, month]);
  const visible = useMemo(() => events.filter(event => !locality || event.locality === locality), [events, locality]);
  const days = useMemo(() => {
    const count = new Date(Date.UTC(year, month + 1, 0)).getUTCDate();
    return [...Array(mondayOffset(year, month)).fill(null), ...Array.from({ length: count }, (_, i) => i + 1)] as (number | null)[];
  }, [year, month]);
  const dateOf = (day: number) => `${year}-${String(month + 1).padStart(2, "0")}-${String(day).padStart(2, "0")}`;
  const onDay = (key: string) => { setSelected(key); setYear(Number(key.slice(0, 4))); setMonth(Number(key.slice(5, 7)) - 1); };
  const shiftMonth = (delta: number) => {
    const date = new Date(Date.UTC(year, month + delta, 1));
    const y = date.getUTCFullYear(), m = date.getUTCMonth();
    setYear(y); setMonth(m); setSelected(`${y}-${String(m + 1).padStart(2, "0")}-01`);
  };
  const todayDate = new Date(`${today}T12:00:00Z`);
  const weekday = todayDate.getUTCDay();
  const saturday = new Date(todayDate.getTime() + ((6 - weekday + 7) % 7) * 86400000);
  const selectedEvents = visible.filter(event => dayKey(new Date(event.starts_at)) === selected);
  const eventsByDay = new Set(visible.map(event => dayKey(new Date(event.starts_at))));
  const upcoming = visible.filter(event => { const date = dayKey(new Date(event.starts_at)); return date >= today && date !== selected; }).slice(0, 12);
  return (
    <section id="calendar-evenimente" className={compact ? "section" : "directory-section directory-full"} style={{ maxWidth: 1120, margin: "32px auto", padding: "24px 18px" }}>
      <div className="section-heading">
        <div><span className="eyebrow">KIDSCITY · ÎN ORAȘUL TĂU</span><h2>{compact ? <>Ce facem cu copiii <span>în acest weekend?</span></> : <>Evenimente <span>în oraș</span></>}</h2><p>{compact ? "Evenimente în oraș · Timișoara, Dumbrăvița și împrejurimi. Alege o zi și descoperă ce se întâmplă." : "Calendarul evenimentelor pentru copii din Timișoara, Dumbrăvița și împrejurimi, cu surse publice verificate."}</p></div>
        {compact && <Link className="text-link" href="/evenimente">Calendar complet <ArrowRight size={16}/></Link>}
      </div>
      <div style={{ display: "flex", gap: 9, flexWrap: "wrap", margin: "18px 0" }}>
        <button className="filter-reset" onClick={() => onDay(today)}>Astăzi</button>
        <button className="filter-reset" onClick={() => { const d = new Date(todayDate.getTime() + 86400000); onDay(dayKey(d)); }}>Mâine</button>
        <button className="filter-reset" onClick={() => onDay(dayKey(saturday))}>Weekend</button>
        <label style={{ display: "flex", alignItems: "center", gap: 8 }}>Localitate <select aria-label="Filtrează localitatea" value={locality} onChange={e => setLocality(e.target.value)} style={{ padding: 9, borderRadius: 10, border: "1px solid #ddd5e8", background: "white" }}><option value="">Toate</option><option>Timișoara</option><option>Dumbrăvița</option><option>Giroc</option><option>Moșnița Nouă</option><option>Ghiroda</option></select></label>
      </div>
      <div style={{ background: "#fbf5ff", border: "1px solid #eee4f5", borderRadius: 22, padding: 16 }}>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 16 }}>
          <button aria-label="Luna anterioară" onClick={() => shiftMonth(-1)} className="filter-reset"><ArrowLeft size={18}/></button>
          <h3 style={{ textTransform: "capitalize", margin: 0 }}>{monthTitle(year, month)}</h3>
          <button aria-label="Luna următoare" onClick={() => shiftMonth(1)} className="filter-reset"><ArrowRight size={18}/></button>
        </div>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(7,minmax(0,1fr))", gap: 5, textAlign: "center" }}>
          {["Lu","Ma","Mi","Jo","Vi","Sâ","Du"].map(d => <span key={d} style={{ fontSize: 12, color: "#7a718c" }}>{d}</span>)}
          {days.map((d, i) => d === null ? <span key={`empty-${i}`}/> : <button key={d} onClick={() => setSelected(dateOf(d))} aria-pressed={selected === dateOf(d)} style={{ minHeight: 43, border: selected === dateOf(d) ? "2px solid #7356d5" : "1px solid #e5d9f3", borderRadius: 11, background: selected === dateOf(d) ? "#7356d5" : "white", color: selected === dateOf(d) ? "white" : "#28324b", fontWeight: eventsByDay.has(dateOf(d)) ? 800 : 400, cursor: "pointer" }}>{d}{eventsByDay.has(dateOf(d)) ? " •" : ""}</button>)}
        </div>
      </div>
      <div style={{ marginTop: 20 }}>
        <h3 style={{ marginBottom: 12, display: "flex", alignItems: "center", gap: 8 }}><CalendarDays size={20}/> {new Intl.DateTimeFormat("ro-RO", { day: "numeric", month: "long", year: "numeric", timeZone: "UTC" }).format(new Date(`${selected}T12:00:00Z`))}</h3>
        {loading ? <p>Se încarcă evenimentele...</p> : error ? <p role="alert">Nu am putut încărca evenimentele: {error}</p> : selectedEvents.length === 0 ? <p>Nu avem evenimente confirmate pentru această zi și localitate. Încearcă o altă dată.</p> :
          <div style={{ display: "grid", gap: 12 }}>
            {selectedEvents.map(event => <article key={event.id} style={{ background: "white", border: "1px solid #e9e3ed", borderRadius: 17, padding: 17 }}>
              <span style={{ color: "#7557d5", fontWeight: 700 }}>{localTime(event.starts_at)} · {event.category}</span>
              <h3 style={{ margin: "8px 0" }}>{event.title}</h3>
              <p>{event.organizer}</p>
              <p style={{ display: "flex", alignItems: "center", gap: 6 }}><MapPin size={16}/>{event.venue ? `${event.venue}, ` : ""}{event.locality}</p>
              <p>{[event.age_label, event.price_label].filter(Boolean).join(" · ")}</p>
              {event.description && <p>{event.description}</p>}
              <a href={event.source_url} target="_blank" rel="noopener noreferrer" style={{ color: "#7356d5", fontWeight: 700, display: "inline-flex", alignItems: "center", gap: 5 }}>Verifică la organizator <ExternalLink size={15}/></a>
            </article>)}
          </div>}
      </div>
      <div style={{ marginTop: 28 }}>
        <h3 style={{ marginBottom: 14 }}>Următoarele evenimente confirmate</h3>
        {loading ? <p>Se încarcă...</p> : error ? <p role="alert">Nu am putut încărca lista: {error}</p> : upcoming.length === 0 ? <p>Nu sunt încă evenimente confirmate pentru perioada următoare.</p> :
          <div style={{ display: "grid", gap: 12 }}>
            {upcoming.map(event => <article key={event.id} style={{ border: "1px solid #e9e3ed", background: "#fff", borderRadius: 16, padding: 16 }}>
              <strong style={{ color: "#7456d8" }}>{new Intl.DateTimeFormat("ro-RO", { timeZone: zone, day: "numeric", month: "long", hour: "2-digit", minute: "2-digit" }).format(new Date(event.starts_at))}</strong>
              <h4 style={{ margin: "7px 0" }}>{event.title}</h4>
              <p>{event.organizer} · {event.locality}{event.venue ? ` · ${event.venue}` : ""}</p>
              <a href={event.source_url} target="_blank" rel="noopener noreferrer" style={{ color: "#7456d8", fontWeight: 700 }}>Sursa organizatorului ↗</a>
            </article>)}
          </div>}
      </div>
      <p style={{ marginTop: 14, fontSize: 13, color: "#767181" }}>Afișăm numai evenimente cu sursă și dată verificate. Programul, biletele și disponibilitatea pot suferi modificări: confirmă direct cu organizatorul.</p>
    </section>
  );
}
