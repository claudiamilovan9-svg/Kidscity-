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
        <span className="eyebrow">PARTENERII NOȘTRI</span>
        <h1>Descoperă <span>furnizorii KidsCity</span></h1>
        <p>Explorează furnizorii aprobați și descoperă activitățile pe care le pregătesc pentru cei mici.</p>
      </div>
      <ProviderDirectory />
    </main>
  );
}
