import Link from "next/link";
import { ArrowLeft, MapPin, Search, SlidersHorizontal } from "lucide-react";

const sampleActivities = [
  { category: "SPORT & MIȘCARE", title: "Activități sportive pentru cei mici", area: "Timișoara și împrejurimi", age: "Vârste diferite", description: "Exemple demonstrative. Activitățile reale vor apărea după înscrierea și verificarea furnizorilor." },
  { category: "ARTĂ & CREATIVITATE", title: "Ateliere creative pentru copii", area: "Timișoara și împrejurimi", age: "Vârste diferite", description: "Exemple demonstrative. Informațiile și programările vor fi gestionate prin KidsCity." },
  { category: "LIMBI STRĂINE", title: "Cursuri de limbi străine", area: "Timișoara și împrejurimi", age: "Vârste diferite", description: "Exemple demonstrative. Nu reprezintă oferte reale sau furnizori confirmați." }
];

export default function ActivitiesPage() {
  return (
    <main className="listing-page">
      <header className="site-header"><Link className="brand" href="/"><span className="brand-mark">K</span><span>kids<span className="brand-city">city</span><small>CREȘTEM ÎMPREUNĂ</small></span></Link><Link className="login-link" href="/autentificare">Intră în cont</Link></header>
      <section className="listing-intro"><Link className="back-home" href="/">← Pagina principală</Link><span className="eyebrow">DESCOPERĂ ȘI ALEGE</span><h1>Activități pentru <span>copilul tău</span></h1><p>În curând, toate opțiunile pentru copii din Timișoara și localitățile apropiate, într-un singur loc.</p></section>
      <section className="listing-layout">
        <aside className="filter-panel"><h2><SlidersHorizontal size={18}/> Filtrează</h2><label>Caută activitate<div className="filter-input"><Search size={16}/><input placeholder="Ex. înot, dans, pictură" disabled /></div></label><label>Localitate<select disabled defaultValue=""><option value="">Toate localitățile</option></select></label><label>Categoria<select disabled defaultValue=""><option value="">Toate categoriile</option></select></label><label>Vârsta copilului<select disabled defaultValue=""><option value="">Orice vârstă</option></select></label><p className="filter-note">Filtrele vor fi conectate la catalogul din baza de date în etapa următoare.</p></aside>
        <div className="results-panel"><div className="results-heading"><strong>Previzualizare catalog</strong><span>Conținut demonstrativ</span></div>{sampleActivities.map(item => <article className="sample-card" key={item.category}><span className="eyebrow">{item.category}</span><h2>{item.title}</h2><div className="sample-meta"><span><MapPin size={15}/>{item.area}</span><span>{item.age}</span></div><p>{item.description}</p><span className="demo-label">EXEMPLU – NU ESTE OFERTĂ REALĂ</span></article>)}</div>
      </section>
    </main>
  );
}