import Link from "next/link";
import EventsCalendar from "@/components/events-calendar";

export const metadata = {
  title: "Cinema pentru copii | KidsCity",
  description: "Filme și proiecții pentru copii în Timișoara și împrejurimi, cu program verificat."
};

export default function KidsCinemaPage() {
  return (
    <main>
      <header className="site-header">
        <Link className="brand" href="/"><span className="brand-mark">K</span><span>kids<span className="brand-city">city</span><small>CREȘTEM ÎMPREUNĂ</small></span></Link>
        <nav className="desktop-nav">
          <Link href="/">Acasă</Link>
          <Link href="/evenimente">Evenimente</Link>
          <Link href="/cinema-pentru-copii">Cinema pentru copii</Link>
          <Link href="/activitati">Activități</Link>
        </nav>
      </header>
      <p style={{ maxWidth: 1120, margin: "24px auto 0", padding: "0 18px" }}>
        Cinema pentru copii – doar filme potrivite copiilor, cu cinematograf, dată, oră și link către program sau bilete.
        Sunt afișate numai proiecțiile cu dată și sursă confirmate.
        {" "}<Link href="/evenimente" style={{ color: "#7456d8", fontWeight: 700 }}>Vezi toate evenimentele →</Link>
      </p>
      <section style={{ maxWidth: 1120, margin: "28px auto", padding: "0 18px" }}>
        <h2 style={{ fontSize: "1.5rem", marginBottom: 8 }}>Program Cinema City Timișoara</h2>
        <p style={{ marginBottom: 18 }}>Vezi programul actualizat și orele de proiecție direct la cinematograf. Cinema City publică de regulă noul program miercurea. În calendarul KidsCity apar separat numai proiecțiile pentru copii cu dată și oră confirmate.</p>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))", gap: 16 }}>
          <article style={{ border: "1px solid #e6e3ef", borderRadius: 16, padding: 20, background: "#fff" }}>
            <h3 style={{ marginTop: 0 }}>Cinema City Iulius Town</h3>
            <p>Iulius Mall, Piața Consiliul Europei nr. 2, Timișoara.</p>
            <a href="https://www.cinemacity.ro/cinemas/timisoara-iulius-mall/1802" target="_blank" rel="noopener noreferrer" style={{ color: "#7456d8", fontWeight: 700 }}>Vezi programul și biletele ↗</a>
          </article>
          <article style={{ border: "1px solid #e6e3ef", borderRadius: 16, padding: 20, background: "#fff" }}>
            <h3 style={{ marginTop: 0 }}>Cinema City Shopping City</h3>
            <p>Shopping City Timișoara. Alege ziua și filmul pe pagina oficială.</p>
            <a href="https://www.cinemacity.ro/cinemas/timisoara-shopping-city/1823" target="_blank" rel="noopener noreferrer" style={{ color: "#7456d8", fontWeight: 700 }}>Vezi programul și biletele ↗</a>
          </article>
        </div>
        <p style={{ marginTop: 14, fontSize: ".9rem" }}>Programul extern poate include și filme pentru adulți. Verifică clasificarea de vârstă înainte de a cumpăra bilete.</p>
      </section>
      <EventsCalendar cinemaOnly />
      <footer><Link href="/evenimente">← Înapoi la evenimente</Link></footer>
    </main>
  );
}
