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
        <div className="account-placeholder"><p>Completezi un singur formular pentru cont, profilul organizației, locație și prima activitate.</p><p>Poți propune programul, vârstele și tarifele. KidsCity verifică informațiile înainte de publicare.</p></div>
        <Link href="/pentru-furnizori/inscriere" className="button auth-submit">Creează cont de furnizor <ArrowRight size={16}/></Link>
        <p className="auth-switch">Ai deja cont? <Link href="/autentificare">Intră în cont</Link></p>
      </section>
    </main>
  );
}