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
        <h1>Cursuri și <span>activități regulate</span></h1>
        <p>Descoperă cursuri și activități la care copiii se pot înscrie pentru mai multe ședințe sau pe perioade mai lungi. Confirmă programul, tariful și disponibilitatea direct cu organizatorul.</p>
      </div>
      <p style={{textAlign:"center",margin:"12px auto"}}>Cauți un spectacol sau un atelier de o zi? <Link href="/evenimente" style={{color:"#7456d8",fontWeight:700}}>Vezi evenimentele din oraș →</Link></p>
      <ActivityDirectory />
    </main>
  );
}
