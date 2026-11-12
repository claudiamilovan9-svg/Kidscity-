import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import ProviderDirectory from "@/components/provider-directory";

export default function ProvidersPage() {
  return (
    <main className="listing-page">
      <header className="site-header">
        <Link className="brand" href="/"><span className="brand-mark">K</span><span>kids<span className="brand-city">city</span><small>CREȘTEM ÎMPREUNĂ</small></span></Link>
        <Link className="login-link" href="/autentificare">Intră în cont</Link>
      </header>
      <div className="listing-intro">
        <Link className="back-home" href="/"><ArrowLeft size={14}/> Pagina principală</Link>
        <span className="eyebrow">FURNIZORI DIN COMUNITATE</span>
        <h1>Descoperă <span>furnizori locali</span></h1>
        <p>Explorează furnizori identificați în surse publice. Prezența în catalog nu înseamnă parteneriat sau listare confirmată de furnizor.</p>
      </div>
      <ProviderDirectory />
    </main>
  );
}
