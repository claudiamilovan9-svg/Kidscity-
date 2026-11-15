import Link from "next/link";
import { ArrowRight, Search, MapPin, ShieldCheck, Sparkles, Palette, Dumbbell, Languages, Music2, Baby, PartyPopper } from "lucide-react";
import ActivityDirectory from "@/components/activity-directory";

const categories = [
  { name: "Creșe & grădinițe", detail: "Locuri în care cei mici cresc frumos", icon: Baby, tone: "peach" },
  { name: "Sport & mișcare", detail: "Energie, joacă și încredere", icon: Dumbbell, tone: "mint" },
  { name: "Artă & creativitate", detail: "Desen, pictură și lucru manual", icon: Palette, tone: "lilac" },
  { name: "Limbi străine", detail: "Primele cuvinte într-o lume nouă", icon: Languages, tone: "lemon" },
  { name: "Muzică & dans", detail: "Ritm, sunet și voie bună", icon: Music2, tone: "pink" },
  { name: "Ateliere & evenimente", detail: "Experiențe de ținut minte", icon: PartyPopper, tone: "blue" }
];

const categoryRoutes: Record<string, string> = {
  "Creșe & grădinițe": "after-school-ingrijire",
  "Sport & mișcare": "sport-miscare",
  "Artă & creativitate": "arta-creativitate",
  "Limbi străine": "limbi-straine",
  "Muzică & dans": "muzica",
  "Ateliere & evenimente": "petreceri-evenimente",
};

const places = ["Timișoara", "Dumbrăvița", "Giroc", "Moșnița Nouă", "Ghiroda"];

export default function Home() {
  return (
    <main>
      <header className="site-header">
        <Link className="brand" href="/"><span className="brand-mark">K</span><span>kids<span className="brand-city">city</span><small>CREȘTEM ÎMPREUNĂ</small></span></Link>
        <nav className="desktop-nav"><a href="#categorii">Categorii</a><Link href="/furnizori">Furnizori</Link><a href="#cum-functioneaza">Cum funcționează</a><a href="#furnizori">Pentru furnizori</a></nav>
        <div className="header-actions"><Link className="login-link" href="/autentificare">Intră în cont</Link><Link className="button button-small" href="/inscriere">Creează cont</Link></div>
      </header>
      <nav className="mobile-nav" aria-label="Navigare rapidă">
        <Link href="#categorii">Categorii</Link>
        <Link href="/activitati">Activități</Link>
        <Link href="/furnizori">Furnizori</Link>
        <Link href="#furnizori">Pentru organizatori</Link>
      </nav>

      <section className="hero">
        <div className="hero-copy">
          <div className="eyebrow"><Sparkles size={15}/> LUMEA ACTIVITĂȚILOR PENTRU COPII</div>
          <h1>Copilăria e plină de <span>posibilități.</span></h1>
          <p className="hero-lead">Descoperă locuri, cursuri și experiențe care îl ajută pe cel mic să crească, să învețe și să se bucure.</p>
          <form className="search-panel" action="/activitati" method="get">
            <label>
              <Search size={18}/>
              <span><small>Ce căutăm?</small><input id="home-search" name="q" type="search" placeholder="Sport, artă, dans..." /></span>
            </label>
            <label>
              <MapPin size={18}/>
              <span><small>Unde?</small>
                <select id="home-locality" name="locality" defaultValue="">
                  <option value="">Toate localitățile</option>
                  <option value="Timișoara">Timișoara</option>
                  <option value="Dumbrăvița">Dumbrăvița</option>
                  <option value="Giroc">Giroc</option>
                  <option value="Moșnița Nouă">Moșnița Nouă</option>
                  <option value="Ghiroda">Ghiroda</option>
                </select>
              </span>
            </label>
            <button type="submit" className="button search-button">Descoperă <ArrowRight size={17}/></button>
          </form>
          <div className="hero-note"><ShieldCheck size={16}/> Furnizori locali · activități pentru fiecare vârstă</div>
        </div>
        <div className="hero-art">
          <svg className="hero-compass-image" viewBox="0 0 720 620" role="img" aria-label="Busolă elegantă în nuanțe pastelate" style={{ display: "block", width: "100%", maxWidth: 520, height: "auto", margin: "0 auto" }} xmlns="http://www.w3.org/2000/svg">
            <defs>
              <radialGradient id="compass-halo"><stop stopColor="#f6eefa" stopOpacity=".9"/><stop offset="1" stopColor="#f6eefa" stopOpacity="0"/></radialGradient>
              <linearGradient id="compass-metal" x1="0" y1="0" x2="1" y2="1"><stop stopColor="#fff4d9"/><stop offset=".45" stopColor="#c9a96e"/><stop offset="1" stopColor="#fff0cc"/></linearGradient>
              <linearGradient id="compass-face" x1="0" y1="0" x2="1" y2="1"><stop stopColor="#fffefa"/><stop offset="1" stopColor="#f5f0e8"/></linearGradient>
              <linearGradient id="compass-needle" x1="0" y1="0" x2="0" y2="1"><stop stopColor="#d9a7c7"/><stop offset="1" stopColor="#9d91c7"/></linearGradient>
              <filter id="compass-shadow" x="-30%" y="-30%" width="160%" height="170%"><feDropShadow dx="0" dy="18" stdDeviation="18" floodColor="#9a8ba8" floodOpacity=".18"/></filter>
            </defs>
            <ellipse cx="360" cy="320" rx="300" ry="270" fill="url(#compass-halo)"/>
            <circle cx="360" cy="310" r="224" fill="#d8cce8" opacity=".16"/>
            <g filter="url(#compass-shadow)" transform="rotate(-8 360 310)">
              <circle cx="360" cy="310" r="194" fill="url(#compass-metal)"/>
              <circle cx="360" cy="310" r="183" fill="url(#compass-face)" stroke="#b99b69" strokeWidth="2"/>
              <circle cx="360" cy="310" r="166" fill="none" stroke="#e8dcc7" strokeWidth="1.5"/>
              <circle cx="360" cy="310" r="151" fill="none" stroke="#d9cbb6"/>
              <g stroke="#b9a98f" strokeWidth="2" strokeLinecap="round"><path d="M360 151v15 M360 454v15 M201 310h15 M504 310h15"/><path d="M247 197l11 11 M462 412l11 11 M473 197l-11 11 M258 412l-11 11" opacity=".8"/></g>
              <g fill="#a99b87" fontFamily="Georgia,serif" fontSize="17" textAnchor="middle"><text x="360" y="140">N</text><text x="360" y="493">S</text><text x="188" y="316">W</text><text x="532" y="316">E</text></g>
              <g transform="translate(360 310)">
                <path d="M0-125 L25 0 L0 125 L-25 0Z" fill="#e8dff0" opacity=".75"/>
                <path d="M0-125 L25 0 L0 0Z" fill="url(#compass-needle)"/>
                <path d="M0-125 L-25 0 L0 0Z" fill="#e7b9c9"/>
                <path d="M0 125 L25 0 L0 0Z" fill="#b8d9d0"/>
                <path d="M0 125 L-25 0 L0 0Z" fill="#d9cce9"/>
                <circle r="13" fill="url(#compass-metal)" stroke="#b99b69" strokeWidth="2"/>
                <circle r="4" fill="#9b8aa9"/>
              </g>
              <circle cx="360" cy="310" r="194" fill="none" stroke="#fff8e8" strokeWidth="3" opacity=".9"/>
            </g>
            <g opacity=".75"><path d="M127 155c-18-20-16-42 2-55 19 13 21 35 2 55-2 3-3 3-4 0Z" fill="#d9cde9"/><path d="M584 420c-15-17-13-36 2-47 16 11 18 30 2 47-2 2-3 2-4 0Z" fill="#c6e2d9"/><path d="M558 145c-10-12-9-25 1-33 11 8 12 21 1 33-1 2-1 2-2 0Z" fill="#f0d2dc"/></g>
            <g fill="#c5a978" opacity=".7"><circle cx="154" cy="430" r="3"/><circle cx="570" cy="250" r="3"/><circle cx="220" cy="115" r="2.5"/><circle cx="520" cy="500" r="2.5"/></g>
          </svg>
        </div>
      </section>

      <section className="trust-strip"><div><strong>Un singur loc</strong><span>pentru idei și activități</span></div><div><strong>Pe vârsta copilului</strong><span>recomandări mai potrivite</span></div><div><strong>Aproape de tine</strong><span>în Timișoara și localitățile vecine</span></div></section>


      <ActivityDirectory compact />

      <section className="section" id="categorii">
        <div className="section-heading"><div><span className="eyebrow">DESCOPERĂ CE I SE POTRIVEȘTE</span><h2>Explorează după <span>categorie</span></h2></div><Link className="text-link" href="/activitati">Toate categoriile <ArrowRight size={16}/></Link></div>
        <div className="category-grid">{categories.map(({name,detail,icon:Icon,tone}) => <Link className="category-card" href={`/activitati?category=${categoryRoutes[name]}`} key={name}><span className={"category-icon "+tone}><Icon size={25}/></span><strong>{name}</strong><small>{detail}</small><ArrowRight className="category-arrow" size={18}/></Link>)}</div>
      </section>

      <section className="local-section"><div><span className="eyebrow">APROAPE DE FAMILIA TA</span><h2>Descoperă activități <span>în zona ta</span></h2><p>Începem în Timișoara și comunitățile din jur, cu planuri de extindere în alte orașe.</p></div><div className="place-list">{places.map(place => <Link href={`/activitati?locality=${encodeURIComponent(place)}`} key={place}><MapPin size={16}/>{place}<ArrowRight size={15}/></Link>)}</div></section>

      <section className="section how-section" id="cum-functioneaza"><div className="section-heading"><div><span className="eyebrow">SIMPLU PENTRU PĂRINȚI</span><h2>Trei pași spre o experiență <span>grozavă</span></h2></div></div><div className="steps"><article><span>01</span><h3>Spune-ne ce îi place</h3><p>Alege vârsta, zona și activitățile care îl atrag pe copilul tău.</p></article><article><span>02</span><h3>Descoperă opțiunile</h3><p>Compară activități și furnizori într-un singur loc.</p></article><article><span>03</span><h3>Trimite o solicitare</h3><p>Cere un loc, iar furnizorul îți va confirma disponibilitatea.</p></article></div></section>

      <section className="provider-cta" id="furnizori"><div><span className="eyebrow">AI ACTIVITĂȚI PENTRU COPII?</span><h2>Hai să le descopere <span>mai multe familii.</span></h2><p>Alătură-te comunității KidsCity și prezintă-ți activitățile părinților din zonă.</p></div><Link className="button button-light" href="/pentru-furnizori">Devino partener <ArrowRight size={17}/></Link></section>

      <footer><Link className="brand footer-brand" href="/"><span className="brand-mark">K</span><span>kidscity<small>CREȘTEM ÎMPREUNĂ</small></span></Link><span>Un oraș plin de idei pentru copilărie.</span><span>© {new Date().getFullYear()} KidsCity</span></footer>
    </main>
  );
}