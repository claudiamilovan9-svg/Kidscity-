import Link from "next/link";
import EventsCalendar from "@/components/events-calendar";

export const metadata = {
  title: "Cinema pentru copii în Timișoara | KidsCity",
  description: "Programul filmelor pentru copii la Cinema City Iulius Mall, cu surse CineMagia și link pentru bilete."
};

const source = "https://m.cinemagia.ro/program-cinema/cinema-city-iulius-mall-timisoara/?from_date=17.11.2026";
const cinema = "https://www.cinemacity.ro/cinemas/timisoara-iulius-mall/1802";
const films = [
  { title: "Micul mamut: Aventuri în Africa", age: "AG", duration: "73 min", language: "Dublat în română", times: ["12:30", "14:15", "16:00", "17:50"] },
  { title: "Mia și școala de monștri", age: "AG", duration: "81 min", language: "Dublat în română", times: ["15:40"] },
  { title: "Wildwood: Tărâmul fantastic", age: "Verifică clasificarea", duration: null, language: "Subtitrat în română", times: ["16:10"] }
];

export default function KidsCinemaPage() {
  return (
    <main style={{ minHeight: "100vh", background: "#fffaf4" }}>
      <header className="site-header">
        <Link className="brand" href="/"><span className="brand-mark">K</span><span>kids<span className="brand-city">city</span><small>CREȘTEM ÎMPREUNĂ</small></span></Link>
        <nav className="desktop-nav"><Link href="/">Acasă</Link><Link href="/evenimente">Evenimente</Link><Link href="/cinema-pentru-copii">Cinema pentru copii</Link><Link href="/activitati">Activități</Link></nav>
      </header>
      <section className="directory-section" style={{ maxWidth: 1050, margin: "auto" }}>
        <span className="eyebrow">TIMIȘOARA · CINEMA CITY IULIUS MALL</span>
        <h1 style={{ font: "900 clamp(30px,5vw,46px)/1.15 Nunito,sans-serif", margin: "14px 0" }}>Filme pentru copii la cinema</h1>
        <p style={{ color: "#69758a", lineHeight: 1.7 }}>Program verificat pentru marți, 17 noiembrie 2026, din CineMagia. Aceasta este o listă datată, nu o sincronizare automată. Pentru alte zile, consultă programul actualizat din sursă.</p>
        <div style={{ display: "grid", gap: 16, marginTop: 28 }}>
          {films.map(film => (
            <article key={film.title} style={{ background: "#fff", border: "1px solid #eee9e3", borderRadius: 20, padding: 24 }}>
              <h2 style={{ font: "800 23px Nunito,sans-serif", margin: "0 0 10px" }}>{film.title}</h2>
              <p style={{ color: "#69758a" }}>{film.age} · {film.language}{film.duration ? ` · ${film.duration}` : ""}</p>
              <div style={{ display: "flex", flexWrap: "wrap", gap: 9, margin: "18px 0" }}>
                {film.times.map(time => <span key={time} style={{ padding: "10px 15px", borderRadius: 10, background: "#fff0e6", color: "#a85625", fontWeight: 800 }}>{time}</span>)}
              </div>
              <a href={cinema} target="_blank" rel="noopener noreferrer" className="button">Verifică programul și biletele ↗</a>
            </article>
          ))}
        </div>
        <p style={{ fontSize: 13, marginTop: 24, color: "#69758a" }}>Sursă: <a href={source} target="_blank" rel="noopener noreferrer" style={{ color: "#7257d8", fontWeight: 700 }}>CineMagia – Cinema City Iulius Mall ↗</a>. Orele și disponibilitatea se pot modifica. Confirmă înainte de plecare.</p>
        <p><Link href="/evenimente" style={{ color: "#7257d8" }}>← Înapoi la evenimente</Link></p>
      </section>
      <EventsCalendar cinemaOnly />
    </main>
  );
}
