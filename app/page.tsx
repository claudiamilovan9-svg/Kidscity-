import Link from "next/link";
import { ArrowRight, Search, MapPin, Heart, ShieldCheck, Sparkles, Compass, Palette, Dumbbell, Languages, Music2, Baby, PartyPopper, GraduationCap, CalendarDays, Trees, Film, Cake, CloudRain, Bell, Star, MessageCircle, CalendarCheck } from "lucide-react";
import ActivityDirectory from "@/components/activity-directory";
import EventsCalendar from "@/components/events-calendar";

const quickSections = [
  {name:"Cursuri pentru copii",detail:"Sport, dans, artă, limbi străine",icon:GraduationCap,tone:"lilac",href:"/activitati"},
  {name:"Evenimente",detail:"Astăzi, mâine și în weekend",icon:CalendarDays,tone:"lemon",href:"/evenimente"},
  {name:"Locuri de joacă și aventură",detail:"Explorează locurile din catalog",icon:Trees,tone:"mint",href:"/activitati?category=natura-aventura"},
  {name:"Cinema",detail:"Filme și ore de proiecție",icon:Film,tone:"blue",href:"/cinema-pentru-copii"},
  {name:"Creșe și grădinițe",detail:"Educație și îngrijire",icon:Baby,tone:"peach",href:"/activitati?category=after-school-ingrijire"},
  {name:"Aniversări și petreceri",detail:"Locuri și organizatori",icon:Cake,tone:"pink",href:"/activitati?category=petreceri-evenimente"}
];

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
      <section className="hero">
        <div className="hero-copy">
          <div className="eyebrow"><Sparkles size={15}/> LUMEA ACTIVITĂȚILOR PENTRU COPII</div>
          <h1>O lume de <span>posibilități</span> pentru copilul tău.</h1>
          <p className="hero-lead">Descoperă locuri, cursuri și experiențe care îl ajută pe cel mic să crească, să învețe și să se bucure.</p>
          <form className="search-panel" action="/activitati" method="get">
            <label>
              <Search size={18}/>
              <span><small>Ce căutăm?</small><input id="home-search" name="q" type="search" placeholder="Înot, dans, engleză..." /></span>
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
        <div className="hero-art" aria-label="Ilustrație decorativă cu forme colorate">
          <div className="sun"></div><div className="orbit orbit-one"></div><div className="orbit orbit-two"></div>
          <div className="hero-card card-top"><span>✦</span><b>Joacă.</b><small>Descoperire.</small></div>
          <div className="hero-card card-bottom"><Heart size={18} fill="currentColor"/><b>Amintiri</b><small>care cresc odată cu ei</small></div>
          <div className="hero-sticker">YAY!</div>
          <div className="hero-blob"><Compass size={142} strokeWidth={1.35} /><Sparkles className="compass-sparkle" size={27} /></div>
        </div>
      </section>

      <section className="trust-strip"><div><strong>Un singur loc</strong><span>pentru idei și activități</span></div><div><strong>Pe vârsta copilului</strong><span>recomandări mai potrivite</span></div><div><strong>Aproape de tine</strong><span>în Timișoara și localitățile vecine</span></div></section>


      <section className="section" style={{paddingTop:32,paddingBottom:24}}>
        <div className="section-heading"><div><span className="eyebrow">ALEGE CE CAUȚI</span><h2>Explorează <span>KidsCity</span></h2></div></div>
        <div className="category-grid">{quickSections.map(({name,detail,icon:Icon,tone,href})=><Link className="category-card" href={href} key={name}><span className={"category-icon "+tone}><Icon size={25}/></span><strong>{name}</strong><small>{detail}</small><ArrowRight className="category-arrow" size={18}/></Link>)}</div>
        <Link className="text-link" style={{marginTop:16}} href="/activitati?q=loc%20de%20joac%C4%83">Caută și locuri de joacă în catalog <ArrowRight size={16}/></Link>
      </section>
      <EventsCalendar compact />
      <ActivityDirectory compact />

      <section className="section" id="categorii">
        <div className="section-heading"><div><span className="eyebrow">DESCOPERĂ CE I SE POTRIVEȘTE</span><h2>Explorează după <span>categorie</span></h2></div><Link className="text-link" href="/activitati">Toate categoriile <ArrowRight size={16}/></Link></div>
        <div className="category-grid">{categories.map(({name,detail,icon:Icon,tone}) => <Link className="category-card" href={`/activitati?category=${categoryRoutes[name]}`} key={name}><span className={"category-icon "+tone}><Icon size={25}/></span><strong>{name}</strong><small>{detail}</small><ArrowRight className="category-arrow" size={18}/></Link>)}</div>
      </section>

      <section className="local-section"><div><span className="eyebrow">APROAPE DE FAMILIA TA</span><h2>Descoperă activități <span>în zona ta</span></h2><p>Începem în Timișoara și comunitățile din jur, cu planuri de extindere în alte orașe.</p></div><div className="place-list">{places.map(place => <Link href={`/activitati?locality=${encodeURIComponent(place)}`} key={place}><MapPin size={16}/>{place}<ArrowRight size={15}/></Link>)}</div></section>

      <section className="section how-section" id="cum-functioneaza">
        <div className="section-heading"><div><span className="eyebrow">SIMPLU PENTRU PĂRINȚI</span><h2>Cum funcționează <span>KidsCity?</span></h2><p>Mai puțin timp petrecut căutând, mai mult timp pentru experiențe frumoase împreună. KidsCity aduce într-un singur loc cursuri, activități, evenimente și locuri pentru copii din Timișoara și împrejurimi.</p></div></div>
        <div className="steps">
          <article><span>01</span><h3>Descoperă ce cauți</h3><p>Explorează cursuri de sport, artă, muzică, limbi străine, locuri de joacă, grădinițe, spectacole și multe alte activități. Consultă calendarul pentru idei de astăzi, mâine sau din weekend.</p></article>
          <article><span>02</span><h3>Alege ce vi se potrivește</h3><p>Filtrează activitățile după localitate, categorie, vârsta copilului sau buget. Compară informațiile disponibile și descoperă inclusiv opțiuni gratuite.</p></article>
          <article><span>03</span><h3>Contactează organizatorul</h3><p>Consultă datele de contact și sursele disponibile. Confirmă direct cu furnizorul programul, tarifele, condițiile de participare și locurile disponibile.</p></article>
        </div>
        <div style={{marginTop:24,lineHeight:1.7}}><h3>Cum construim catalogul?</h3><p>Identificăm furnizori locali, cluburi sportive, centre educaționale și organizatori de evenimente, folosind informații din surse publice. Completăm catalogul treptat, inclusiv în localitățile mai mici. Acolo unde informațiile sunt incomplete sau necesită actualizare, recomandăm confirmarea directă cu organizatorul.</p><p>KidsCity este o platformă în dezvoltare. Ne propunem să aducem părinții și furnizorii mai aproape, iar în viitor să facilităm comunicarea, rezervările și plățile online.</p><Link className="button" href="/activitati">Explorează activitățile <ArrowRight size={17}/></Link></div>
      <div style={{marginTop:40}}><span className="eyebrow">VIZIUNEA NOASTRĂ</span><h2>KidsCity crește împreună cu familia ta</h2><p>Construim pas cu pas o platformă care să simplifice viața părinților. Mai jos sunt direcțiile noastre de dezvoltare; unele funcționalități sunt deja disponibile parțial, iar altele sunt planificate.</p><div style={{display:"grid",gridTemplateColumns:"repeat(auto-fit,minmax(min(100%,280px),1fr))",gap:16,marginTop:24}}><article style={{display:"flex",gap:14,alignItems:"flex-start",padding:18,border:"1px solid #e8e4ee",borderRadius:18}}><span className="category-icon lilac" style={{flexShrink:0}}><CalendarDays size={24}/></span><div><h3 style={{margin:"0 0 6px"}}>Ce facem astăzi?</h3><small style={{fontWeight:600,color:"#66528d"}}>În dezvoltare / extindere</small><p style={{margin:"8px 0 0",lineHeight:1.6}}>Descoperă evenimentele de astăzi, mâine și din weekend, inclusiv activități gratuite. Pe viitor, idei dedicate vacanțelor.</p></div></article><article style={{display:"flex",gap:14,alignItems:"flex-start",padding:18,border:"1px solid #e8e4ee",borderRadius:18}}><span className="category-icon peach" style={{flexShrink:0}}><Baby size={24}/></span><div><h3 style={{margin:"0 0 6px"}}>Profilul copilului</h3><small style={{fontWeight:600,color:"#66528d"}}>În dezvoltare / extindere</small><p style={{margin:"8px 0 0",lineHeight:1.6}}>Adaugă profiluri pentru copii, cu vârsta și interesele lor, pentru recomandări personalizate.</p></div></article><article style={{display:"flex",gap:14,alignItems:"flex-start",padding:18,border:"1px solid #e8e4ee",borderRadius:18}}><span className="category-icon mint" style={{flexShrink:0}}><MapPin size={24}/></span><div><h3 style={{margin:"0 0 6px"}}>Activități în apropiere</h3><small style={{fontWeight:600,color:"#66528d"}}>În dezvoltare / extindere</small><p style={{margin:"8px 0 0",lineHeight:1.6}}>Hartă interactivă, distanțe și indicații de navigare către activitățile din zona ta.</p></div></article><article style={{display:"flex",gap:14,alignItems:"flex-start",padding:18,border:"1px solid #e8e4ee",borderRadius:18}}><span className="category-icon pink" style={{flexShrink:0}}><Heart size={24}/></span><div><h3 style={{margin:"0 0 6px"}}>Favorite</h3><small style={{fontWeight:600,color:"#66528d"}}>În dezvoltare / extindere</small><p style={{margin:"8px 0 0",lineHeight:1.6}}>Salvează activitățile, locurile de joacă și furnizorii preferați.</p></div></article><article style={{display:"flex",gap:14,alignItems:"flex-start",padding:18,border:"1px solid #e8e4ee",borderRadius:18}}><span className="category-icon blue" style={{flexShrink:0}}><CloudRain size={24}/></span><div><h3 style={{margin:"0 0 6px"}}>Ce facem când plouă?</h3><small style={{fontWeight:600,color:"#66528d"}}>În dezvoltare / extindere</small><p style={{margin:"8px 0 0",lineHeight:1.6}}>Recomandări de activități la interior sau exterior, în funcție de vreme.</p></div></article><article style={{display:"flex",gap:14,alignItems:"flex-start",padding:18,border:"1px solid #e8e4ee",borderRadius:18}}><span className="category-icon lemon" style={{flexShrink:0}}><Bell size={24}/></span><div><h3 style={{margin:"0 0 6px"}}>Notificări personalizate</h3><small style={{fontWeight:600,color:"#66528d"}}>În dezvoltare / extindere</small><p style={{margin:"8px 0 0",lineHeight:1.6}}>Evenimente noi, locuri disponibile și recomandări pentru weekend.</p></div></article><article style={{display:"flex",gap:14,alignItems:"flex-start",padding:18,border:"1px solid #e8e4ee",borderRadius:18}}><span className="category-icon lilac" style={{flexShrink:0}}><Cake size={24}/></span><div><h3 style={{margin:"0 0 6px"}}>Organizează ziua copilului</h3><small style={{fontWeight:600,color:"#66528d"}}>În dezvoltare / extindere</small><p style={{margin:"8px 0 0",lineHeight:1.6}}>Descoperă locuri pentru aniversări. Ne propunem să includem animatori, fotografi, torturi, decoruri și pachete de petrecere.</p></div></article><article style={{display:"flex",gap:14,alignItems:"flex-start",padding:18,border:"1px solid #e8e4ee",borderRadius:18}}><span className="category-icon peach" style={{flexShrink:0}}><Star size={24}/></span><div><h3 style={{margin:"0 0 6px"}}>Recenzii de la părinți</h3><small style={{fontWeight:600,color:"#66528d"}}>În dezvoltare / extindere</small><p style={{margin:"8px 0 0",lineHeight:1.6}}>Experiențe, evaluări și recomandări din comunitatea de părinți.</p></div></article><article style={{display:"flex",gap:14,alignItems:"flex-start",padding:18,border:"1px solid #e8e4ee",borderRadius:18}}><span className="category-icon mint" style={{flexShrink:0}}><MessageCircle size={24}/></span><div><h3 style={{margin:"0 0 6px"}}>Comunicare cu furnizorii</h3><small style={{fontWeight:600,color:"#66528d"}}>În dezvoltare / extindere</small><p style={{margin:"8px 0 0",lineHeight:1.6}}>Contact direct, inclusiv prin WhatsApp, acolo unde furnizorii oferă această opțiune.</p></div></article><article style={{display:"flex",gap:14,alignItems:"flex-start",padding:18,border:"1px solid #e8e4ee",borderRadius:18}}><span className="category-icon blue" style={{flexShrink:0}}><CalendarCheck size={24}/></span><div><h3 style={{margin:"0 0 6px"}}>Rezervări și plăți online</h3><small style={{fontWeight:600,color:"#66528d"}}>În dezvoltare / extindere</small><p style={{margin:"8px 0 0",lineHeight:1.6}}>Rezervă activități și achită online, pe măsură ce integrăm furnizorii parteneri.</p></div></article></div></div>
      </section>

      <section className="provider-cta" id="furnizori"><div><span className="eyebrow">AI ACTIVITĂȚI PENTRU COPII?</span><h2>Hai să le descopere <span>mai multe familii.</span></h2><p>Alătură-te comunității KidsCity și prezintă-ți activitățile părinților din zonă.</p></div><Link className="button button-light" href="/pentru-furnizori">Devino partener <ArrowRight size={17}/></Link></section>

      <footer><Link className="brand footer-brand" href="/"><span className="brand-mark">K</span><span>kidscity<small>CREȘTEM ÎMPREUNĂ</small></span></Link><span>Un oraș plin de idei pentru copilărie.</span><span>© {new Date().getFullYear()} KidsCity</span></footer>
    </main>
  );
}