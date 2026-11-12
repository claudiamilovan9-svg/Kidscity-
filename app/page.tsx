import Link from "next/link";
import { ArrowRight, Search, MapPin, Heart, ShieldCheck, Sparkles, Palette, Dumbbell, Languages, Music2, Baby, PartyPopper } from "lucide-react";
import ActivityDirectory from "@/components/activity-directory";

const categories = [
  { name: "Creșe & grădinițe", detail: "Locuri în care cei mici cresc frumos", icon: Baby, tone: "peach" },
  { name: "Sport & mișcare", detail: "Energie, joacă și încredere", icon: Dumbbell, tone: "mint" },
  { name: "Artă & creativitate", detail: "Desen, pictură și lucru manual", icon: Palette, tone: "lilac" },
  { name: "Limbi străine", detail: "Primele cuvinte într-o lume nouă", icon: Languages, tone: "lemon" },
  { name: "Muzică & dans", detail: "Ritm, sunet și voie bună", icon: Music2, tone: "pink" },
  { name: "Ateliere & evenimente", detail: "Experiențe de ținut minte", icon: PartyPopper, tone: "blue" }
];

const places = ["Timișoara", "Dumbrăvița", "Giroc", "Moșnița Nouă", "Ghiroda"];

export default function Home() {
  return (
    <main>
      <header className="site-header">
        <Link className="brand" href="/"><span className="brand-mark">K</span><span>kids<span className="brand-city">city</span><small>CREȘTEM ÎMPREUNĂ</small></span></Link>
        <nav className="desktop-nav"><a href="#categorii">Categorii</a><Link href="/furnizori">Furnizori</Link><a href="#cum-functioneaza">Cum funcționează</a><a href="#furnizori">Pentru furnizori</a></nav>
        <div className="header-actions"><Link className="login-link" href="/autentificare">Intră în cont</Link><Link className="button button-small" href="/inscriere">Creează cont</Link></div>
      </header>

      <section className="hero">
        <div className="hero-copy">
          <div className="eyebrow"><Sparkles size={15}/> LUMEA ACTIVITĂȚILOR PENTRU COPII</div>
          <h1>Copilăria e plină de <span>posibilități.</span></h1>
          <p className="hero-lead">Descoperă locuri, cursuri și experiențe care îl ajută pe cel mic să crească, să învețe și să se bucure.</p>
          <div className="search-panel">
            <label><Search size={18}/><span><small>Ce căutăm?</small><strong>Sport, artă, grădiniță...</strong></span></label>
            <label><MapPin size={18}/><span><small>Unde?</small><strong>Timișoara și împrejurimi</strong></span></label>
            <Link href="/activitati" className="button search-button">Descoperă <ArrowRight size={17}/></Link>
          </div>
          <div className="hero-note"><ShieldCheck size={16}/> Furnizori verificați · Activități pentru fiecare vârstă</div>
        </div>
        <div className="hero-art" aria-label="Ilustrație decorativă cu forme colorate">
          <div className="sun"></div><div className="orbit orbit-one"></div><div className="orbit orbit-two"></div>
          <div className="hero-card card-top"><span>✦</span><b>Joacă.</b><small>Descoperire.</small></div>
          <div className="hero-card card-bottom"><Heart size={18} fill="currentColor"/><b>Amintiri</b><small>care cresc odată cu ei</small></div>
          <div className="hero-sticker">YAY!</div>
          <div className="hero-blob"><span>☺</span></div>
        </div>
      </section>

      <section className="trust-strip"><div><strong>Un singur loc</strong><span>pentru idei și activități</span></div><div><strong>Pe vârsta copilului</strong><span>recomandări mai potrivite</span></div><div><strong>Aproape de tine</strong><span>în Timișoara și localitățile vecine</span></div></section>

      <ActivityDirectory compact />

      <section className="section" id="categorii">
        <div className="section-heading"><div><span className="eyebrow">DESCOPERĂ CE I SE POTRIVEȘTE</span><h2>Explorează după <span>categorie</span></h2></div><Link className="text-link" href="/activitati">Toate categoriile <ArrowRight size={16}/></Link></div>
        <div className="category-grid">{categories.map(({name,detail,icon:Icon,tone}) => <Link className="category-card" href="/activitati" key={name}><span className={"category-icon "+tone}><Icon size={25}/></span><strong>{name}</strong><small>{detail}</small><ArrowRight className="category-arrow" size={18}/></Link>)}</div>
      </section>

      <section className="local-section"><div><span className="eyebrow">APROAPE DE FAMILIA TA</span><h2>Descoperă activități <span>în zona ta</span></h2><p>Începem în Timișoara și comunitățile din jur, cu planuri de extindere în alte orașe.</p></div><div className="place-list">{places.map(place => <Link href="/activitati" key={place}><MapPin size={16}/>{place}<ArrowRight size={15}/></Link>)}</div></section>

      <section className="section how-section" id="cum-functioneaza"><div className="section-heading"><div><span className="eyebrow">SIMPLU PENTRU PĂRINȚI</span><h2>Trei pași spre o experiență <span>grozavă</span></h2></div></div><div className="steps"><article><span>01</span><h3>Spune-ne ce îi place</h3><p>Alege vârsta, zona și activitățile care îl atrag pe copilul tău.</p></article><article><span>02</span><h3>Descoperă opțiunile</h3><p>Compară activități și furnizori într-un singur loc.</p></article><article><span>03</span><h3>Trimite o solicitare</h3><p>Cere un loc, iar furnizorul îți va confirma disponibilitatea.</p></article></div></section>

      <section className="provider-cta" id="furnizori"><div><span className="eyebrow">AI ACTIVITĂȚI PENTRU COPII?</span><h2>Hai să le descopere <span>mai multe familii.</span></h2><p>Alătură-te comunității KidsCity și prezintă-ți activitățile părinților din zonă.</p></div><Link className="button button-light" href="/pentru-furnizori">Devino partener <ArrowRight size={17}/></Link></section>

      <footer><Link className="brand footer-brand" href="/"><span className="brand-mark">K</span><span>kidscity<small>CREȘTEM ÎMPREUNĂ</small></span></Link><span>Un oraș plin de idei pentru copilărie.</span><span>© {new Date().getFullYear()} KidsCity</span></footer>
    </main>
  );
}