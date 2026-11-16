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
      <EventsCalendar cinemaOnly />
      <footer><Link href="/evenimente">← Înapoi la evenimente</Link></footer>
    </main>
  );
}
