import Link from "next/link";
import EventsCalendar from "@/components/events-calendar";

export const metadata = {
  title: "Cinema pentru copii în Timișoara | KidsCity",
  description: "Calendar cu proiecții pentru copii la Cinema City Iulius Mall și evenimente cinema confirmate."
};

export default function KidsCinemaPage() {
  return (
    <main style={{ minHeight: "100vh", background: "#fffaf4" }}>
      <header className="site-header">
        <Link className="brand" href="/"><span className="brand-mark">K</span><span>kids<span className="brand-city">city</span><small>CREȘTEM ÎMPREUNĂ</small></span></Link>
        <nav className="desktop-nav"><Link href="/">Acasă</Link><Link href="/evenimente">Evenimente</Link><Link href="/cinema-pentru-copii">Cinema pentru copii</Link><Link href="/activitati">Activități</Link></nav>
      </header>
      <section style={{ maxWidth: 1120, margin: "24px auto 0", padding: "0 18px" }}>
        <span className="eyebrow">TIMIȘOARA · CINEMA PENTRU COPII</span>
        <h1 style={{ font: "900 clamp(30px,5vw,46px)/1.15 Nunito,sans-serif", margin: "14px 0" }}>Filme și ore de proiecție</h1>
        <p style={{ color: "#69758a", lineHeight: 1.7 }}>Selectează o zi din calendar pentru a vedea filmele și orele disponibile. Am inclus proiecțiile confirmate pentru 17 noiembrie 2026 de la Cinema City Iulius Mall. Pentru alte zile sunt afișate doar proiecțiile existente în baza de date; importul automat zilnic nu este încă activ.</p>
      </section>
      <EventsCalendar cinemaOnly />
      <footer><Link href="/evenimente">← Înapoi la evenimente</Link></footer>
    </main>
  );
}
