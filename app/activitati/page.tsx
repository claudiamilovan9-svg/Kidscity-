import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import ActivityDirectory from "@/components/activity-directory";

export default function ActivitiesPage() {
  return (
    <main className="listing-page">
      <header className="site-header">
        <Link className="brand" href="/"><span className="brand-mark">K</span><span>kids<span className="brand-city">city</span><small>CREȘTEM ÎMPREUNĂ</small></span></Link>
        <Link className="login-link" href="/autentificare">Intră în cont</Link>
      </header>
      <div className="listing-intro">
        <Link className="back-home" href="/"><ArrowLeft size={14}/> Pagina principală</Link>
        <span className="eyebrow">DESCOPERĂ ȘI ALEGE</span>
        <h1>Activități pentru <span>copilul tău</span></h1>
        <p>Compară opțiunile reale publicate de furnizorii KidsCity. Folosește filtrele ca să găsești rapid ce se potrivește familiei tale.</p>
      </div>
      <ActivityDirectory />
    </main>
  );
}
