import Link from "next/link";
import { ArrowRight, BadgeCheck, Store, Users } from "lucide-react";

export default function ProvidersPage() {
  return (
    <main className="auth-shell">
      <Link className="brand" href="/"><span className="brand-mark">K</span><span>kids<span className="brand-city">city</span><small>CREȘTEM ÎMPREUNĂ</small></span></Link>
      <section className="auth-card provider-info-card">
        <span className="eyebrow">PENTRU ORGANIZATORI ȘI CENTRE</span>
        <h1>Adu-ți activitățile mai aproape de familii.</h1>
        <p>KidsCity va ajuta furnizorii de servicii pentru copii să își prezinte activitățile, locațiile și intervalele disponibile.</p>
        <div className="account-placeholder"><p><Store size={17}/> Profil de furnizor și mai multe locații</p><p><Users size={17}/> Cereri de rezervare centralizate</p><p><BadgeCheck size={17}/> Proces de verificare a profilului</p></div>
        <p className="form-notice">Înscrierea furnizorilor și verificarea documentelor sunt în curs de dezvoltare. Nu colectăm încă aplicații prin această pagină.</p>
        <Link href="/" className="button auth-submit">Înapoi la KidsCity <ArrowRight size={16}/></Link>
      </section>
    </main>
  );
}