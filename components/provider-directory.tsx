"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { createClient } from "@/lib/supabase/client";
import { MapPin, ArrowRight, LoaderCircle, Store, ExternalLink } from "lucide-react";

type Provider = {
  id: string;
  business_name: string;
  slug: string;
  description: string | null;
  website_url?: string | null;
  provider_locations?: { address: string; locality_name?: string | null }[];
};

type PublicProvider = {
  name: string;
  category: string;
  description: string;
  url: string;
  image?: string;
  imageAlt?: string;
  locality: string;
  sourceLabel: string;
  address?: string;
};

const publicProviders: PublicProvider[] = [
  {
    name: "IMALO Kinderklub",
    category: "Afterschool bilingv · educație · sport",
    description: "Program afterschool română–germană, ateliere creative, robotică și activități sportive.",
    url: "https://imalokinderklub.ro/",
    locality: "Timișoara",
    sourceLabel: "Site oficial",
  },
  {
    name: "Bee Friends Academy",
    category: "Afterschool · ateliere · robotică",
    description: "Afterschool pentru clasele primare, cu ateliere creative, club de lectură și activități opționale.",
    url: "https://beefriends.ro/afterschool",
    image: "https://static.tildacdn.net/tild3339-6462-4731-a135-636166316131/IMG_5018.jpeg",
    imageAlt: "Copii participând la un atelier creativ în aer liber",
    locality: "Timișoara",
    sourceLabel: "Site oficial",
  },
  {
    name: "Alle Kids Joy Afterschool",
    category: "Afterschool · limbi străine · activități creative",
    description: "Program afterschool cu sprijin la teme, ateliere, activități sportive și opționale.",
    url: "https://www.allekidsjoy.ro/",
    image: "https://www.allekidsjoy.ro/images/logo.jpg",
    imageAlt: "Logo Alle Kids Joy",
    locality: "Timișoara",
    sourceLabel: "Site oficial",
  },
  {
    name: "Tip Top Club",
    category: "Before & afterschool · dans · teatru · arte",
    description: "Cursuri pentru copii, activități creative, dans, teatru și programe before & after school.",
    url: "https://www.tiptopclub.ro/",
    image: "https://www.tiptopclub.ro/wp-content/uploads/elementor/thumbs/slider4-qz800me89tvgurvknql981ittkobu9chjj4f065fhc.jpg",
    imageAlt: "Imagine de prezentare Tip Top Club",
    locality: "Timișoara",
    sourceLabel: "Site oficial",
  },
  {
    name: "Hobby Art",
    category: "Muzică · teatru · arte",
    description: "Cursuri de teatru, vioară, canto, pian și chitară pentru copii.",
    url: "https://afterschool-dumbravita.ro/",
    locality: "Dumbrăvița",
    sourceLabel: "Site oficial",
  },
  {
    name: "Active Kids House",
    category: "Before & afterschool · robotică",
    description: "Club pentru copii cu program before & afterschool, joacă în aer liber și ateliere.",
    url: "https://www.clubulcopiilor.ro/locatie/active-kids-house/",
    locality: "Timișoara",
    sourceLabel: "Pagină de prezentare",
  },
  {
    name: "Activitate Afară",
    category: "Natură · aventură · activități în aer liber",
    description: "Programe pentru copii cu activități sportive și experiențe în aer liber.",
    url: "https://afterschool.ator.ro/",
    locality: "Giroc",
    address: "Zona Pădurii Giroc",
    sourceLabel: "Date publice · neconfirmat de furnizor",
  },
  {
    name: "Magic Town",
    category: "Petreceri · joacă · evenimente",
    description: "Spațiu și servicii pentru activități și evenimente dedicate copiilor.",
    url: "https://www.magic-town.ro/",
    locality: "Timișoara",
    address: "Calea Buziașului 74",
    sourceLabel: "Site oficial · listare neconfirmată",
  },
  {
    name: "Cuib cu Teatru",
    category: "Artă · teatru · creativitate",
    description: "Activități de teatru și expresie creativă pentru copii.",
    url: "https://www.google.com/maps/search/?api=1&query=Cuib+cu+Teatru+Timisoara",
    locality: "Timișoara",
    address: "Strada Gheorghe Lazăr 5",
    sourceLabel: "Date publice · neconfirmat de furnizor",
  },
  {
    name: "Kidgineers",
    category: "Educație · STEM · robotică",
    description: "Activități educaționale din zona roboticii și STEM pentru copii.",
    url: "https://www.google.com/maps/search/?api=1&query=Kidgineers+Timisoara",
    locality: "Timișoara",
    address: "Strada Crișul 7",
    sourceLabel: "Date publice · neconfirmat de furnizor",
  },
  {
    name: "ARTASIA – Arta de a Vorbi",
    category: "Artă · teatru · comunicare",
    description: "Activități de teatru, vorbire și ateliere creative pentru copii.",
    url: "https://www.google.com/maps/search/?api=1&query=ARTASIA+Arta+De+A+Vorbi+Timisoara",
    locality: "Timișoara",
    address: "Piața Iancu Huniade 2, camera 24",
    sourceLabel: "Date publice · neconfirmat de furnizor",
  },
  {
    name: "MAGNUM Place",
    category: "Sport · dans",
    description: "Activități de dans sportiv pentru copii.",
    url: "https://www.google.com/maps/search/?api=1&query=MAGNUM+Place+Timisoara",
    locality: "Timișoara",
    address: "Strada Divizia 9 Cavalerie 21A",
    sourceLabel: "Date publice · neconfirmat de furnizor",
  },
  {
    name: "Academia Steluțelor",
    category: "Afterschool · activități extracurriculare",
    description: "Program afterschool și activități extracurriculare pentru copii.",
    url: "https://academia-stelutelor.ro/servicii/",
    locality: "Timișoara",
    address: "Strada Salcâmilor 7",
    sourceLabel: "Site oficial · listare neconfirmată",
  },

  {
    name: "YuHuu Land",
    category: "Afterschool · joacă · ateliere · petreceri",
    description: "Centru pentru copii cu afterschool, spații de joacă și ateliere educative și creative.",
    url: "https://www.google.com/maps/search/?api=1&query=YuHuu+Land+Timisoara",
    locality: "Timișoara",
    address: "Strada Panselelor 47",
    sourceLabel: "Date publice · listare neconfirmată",
  },
  {
    name: "Kindertruppe",
    category: "Afterschool · limba germană",
    description: "Centru afterschool cu sprijin educațional și activități pentru copii.",
    url: "https://www.google.com/maps/search/?api=1&query=Kindertruppe+Timisoara",
    locality: "Timișoara",
    address: "Strada Ciocârliei 88",
    sourceLabel: "Date publice · listare neconfirmată",
  },
  {
    name: "Discovery Smart Kids Club",
    category: "Educație · afterschool · ateliere",
    description: "Centru educațional și afterschool cu activități creative și opționale.",
    url: "https://www.google.com/maps/search/?api=1&query=Discovery+Smart+Kids+Club+Timisoara",
    locality: "Timișoara",
    address: "Strada Lacului 1H",
    sourceLabel: "Date publice · listare neconfirmată",
  },
  {
    name: "Clubul Copiilor",
    category: "Afterschool · limbi străine · evenimente",
    description: "Centru pentru copii cu programe educative, activități recreative și ateliere.",
    url: "https://www.clubulcopiilor.ro/activitati-copii-in-timisoara/",
    locality: "Timișoara",
    address: "Strada Martir Cernăianu 16",
    sourceLabel: "Director public · listare neconfirmată",
  },
  {
    name: "Beautiful Dance by Daniela",
    category: "Dans · balet",
    description: "Cursuri de dans și balet pentru copii.",
    url: "https://www.google.com/maps/search/?api=1&query=Beautiful+Dance+by+Daniela+Timisoara",
    locality: "Timișoara",
    sourceLabel: "Director public · listare neconfirmată",
  },
  {
    name: "Atelierul de Povești",
    category: "Artă · teatru · scriere creativă",
    description: "Ateliere și cursuri de actorie, teatru și scriere creativă pentru copii.",
    url: "https://www.clubulcopiilor.ro/activitati-copii-in-timisoara/",
    locality: "Timișoara",
    sourceLabel: "Director public · listare neconfirmată",
  },
  {
    name: "STURZ – Centrul de Cercetare și Dezvoltare a Educației pentru Familie",
    category: "Educație · STEM · robotică",
    description: "Activități educaționale și cursuri de robotică și programare pentru copii.",
    url: "https://www.google.com/maps/search/?api=1&query=STURZ+Timisoara",
    locality: "Timișoara",
    sourceLabel: "Director public · listare neconfirmată",
  },
  {
    name: "Academia Mămicilor din Timișoara",
    category: "Artă · creativitate · ateliere",
    description: "Ateliere creative și activități tematice pentru copii.",
    url: "https://www.google.com/maps/search/?api=1&query=Academia+Mamicilor+Timisoara",
    locality: "Timișoara",
    sourceLabel: "Director public · listare neconfirmată",
  },
  {
    name: "Craft Hub",
    category: "Artă · pictură · lucru manual",
    description: "Ateliere de pictură și activități creative pentru copii.",
    url: "https://www.google.com/maps/search/?api=1&query=Craft+Hub+Timisoara",
    locality: "Timișoara",
    sourceLabel: "Director public · listare neconfirmată",
  },
  {
    name: "MGA Moga Art Gallery",
    category: "Artă · pictură · creativitate",
    description: "Ateliere creative și activități artistice pentru copii.",
    url: "https://www.google.com/maps/search/?api=1&query=MGA+Moga+Art+Gallery+Timisoara",
    locality: "Timișoara",
    sourceLabel: "Director public · listare neconfirmată",
  },
];

export default function ProviderDirectory() {
  const [providers, setProviders] = useState<Provider[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [directorySearch, setDirectorySearch] = useState("");
  const [directoryCategory, setDirectoryCategory] = useState("");
  const [directoryLocality, setDirectoryLocality] = useState("");

  useEffect(() => {
    let active = true;
    async function load() {
      try {
        const supabase = createClient();
        const { data, error: queryError } = await supabase
          .from("provider_profiles")
          .select("id,business_name,slug,description,website_url")
          .eq("status", "approved")
          .order("business_name");
        if (queryError) throw queryError;

        const rows = (data ?? []) as Provider[];
        if (!active) return;
        setProviders(rows);

        if (rows.length > 0) {
          const { data: locations, error: locationsError } = await supabase
            .from("provider_locations")
            .select("provider_id,address,localities(name)")
            .eq("is_active", true)
            .in("provider_id", rows.map((provider) => provider.id));

          if (locationsError) {
            console.warn("KidsCity provider locations:", locationsError);
          } else if (active && locations) {
            const byProvider = new Map<string, { address: string; locality_name?: string | null }[]>();
            for (const location of locations as { provider_id: string; address: string; localities: { name: string } | { name: string }[] | null }[]) {
              const locality = Array.isArray(location.localities) ? location.localities[0] : location.localities;
              const current = byProvider.get(location.provider_id) ?? [];
              current.push({ address: location.address, locality_name: locality?.name ?? null });
              byProvider.set(location.provider_id, current);
            }
            setProviders(rows.map((provider) => ({
              ...provider,
              provider_locations: byProvider.get(provider.id) ?? [],
            })));
          }
        }
      } catch (e) {
        console.error("KidsCity provider directory:", e);
        if (active) setError("Nu am putut încărca furnizorii aprobați din KidsCity.");
      } finally {
        if (active) setLoading(false);
      }
    }
    load();
    return () => { active = false; };
  }, []);

  const categories = [...new Set(publicProviders.map(provider => provider.category.split(" · ")[0]))].sort((a, b) => a.localeCompare(b, "ro"));
  const localities = [...new Set(publicProviders.map(provider => provider.locality))].sort((a, b) => a.localeCompare(b, "ro"));
  const filteredPublicProviders = publicProviders.filter(provider => {
    const term = directorySearch.trim().toLocaleLowerCase("ro");
    const matchesSearch = !term || [provider.name, provider.category, provider.description, provider.locality, provider.address].some(value => value?.toLocaleLowerCase("ro").includes(term));
    return matchesSearch && (!directoryCategory || provider.category.startsWith(directoryCategory)) && (!directoryLocality || provider.locality === directoryLocality);
  });

  return (
    <section className="provider-directory" id="furnizori">
      <div className="provider-directory-heading">
        <span className="eyebrow"><Store size={14}/> COMUNITATEA KIDSCITY</span>
        <h2>Furnizori pentru <span>copilul tău</span></h2>
        <p>Descoperă furnizori locali și deschide paginile lor publice pentru detalii despre programe și înscrieri.</p>
      </div>

      {loading ? <div className="directory-state"><LoaderCircle className="spin" size={25}/> Încărcăm furnizorii...</div> :
        error ? <div className="directory-state directory-error">{error}</div> : null}

      {providers.length > 0 && (
        <>
          <h3 className="provider-group-title">Furnizori înscriși în KidsCity</h3>
          <div className="provider-grid">
            {providers.map(provider => (
              <article className="provider-card" key={provider.id}>
                <div className="provider-card-mark">{provider.business_name.slice(0, 1).toLocaleUpperCase("ro")}</div>
                <div className="provider-card-content">
                  <h3>{provider.business_name}</h3>
                  <p>{provider.description || "Descoperă activitățile acestui furnizor pe KidsCity."}</p>
                  {provider.provider_locations?.map((location, index) => (
                    <span className="provider-location" key={index}><MapPin size={14}/>{location.locality_name ?? location.address}</span>
                  ))}
                  <Link className="text-link" href="/activitati">Vezi activitățile <ArrowRight size={15}/></Link>
                </div>
              </article>
            ))}
          </div>
        </>
      )}

      <h3 className="provider-group-title">Explorează furnizorii locali</h3>
      <div className="directory-tools provider-directory-tools">
        <label className="directory-search"><Search size={18}/><input value={directorySearch} onChange={event => setDirectorySearch(event.target.value)} placeholder="Caută furnizor, dans, STEM, afterschool..." /></label>
        <label><span>Categorie</span><select value={directoryCategory} onChange={event => setDirectoryCategory(event.target.value)}><option value="">Toate categoriile</option>{categories.map(value => <option key={value} value={value}>{value}</option>)}</select></label>
        <label><span>Localitate</span><select value={directoryLocality} onChange={event => setDirectoryLocality(event.target.value)}><option value="">Toate localitățile</option>{localities.map(value => <option key={value}>{value}</option>)}</select></label>
        <button className="filter-reset" onClick={() => { setDirectorySearch(""); setDirectoryCategory(""); setDirectoryLocality(""); }}>Resetează filtrele</button>
      </div>
      <p className="provider-directory-note">{filteredPublicProviders.length} furnizori găsiți. Linkurile duc către site-uri sau directoare publice; listarea nu înseamnă parteneriat confirmat.</p>
      <p className="provider-directory-note">Acestea sunt linkuri externe către paginile publice ale organizațiilor. KidsCity nu confirmă disponibilitatea locurilor sau actualitatea tarifelor; verifică direct cu furnizorul.</p>
      <div className="provider-grid">
        {filteredPublicProviders.map(provider => (
          <article className="provider-card provider-card-featured" key={provider.name}>
            {provider.image ? (
              <div className="provider-card-photo">
                {/* Public image supplied by the provider's website or its linked profile. */}
                <img src={provider.image} alt={provider.imageAlt ?? provider.name} loading="lazy" />
              </div>
            ) : (
              <div className="provider-card-photo provider-card-photo-placeholder" aria-hidden="true">
                <span>{provider.name.slice(0, 1)}</span>
              </div>
            )}
            <div className="provider-card-content">
              <span className="provider-card-category">{provider.category}</span>
              <h3>{provider.name}</h3>
              <p>{provider.description}</p>
              <span className="provider-location"><MapPin size={14}/>{provider.locality}{provider.address ? ` · ${provider.address}` : ""}</span>
              <a className="text-link" href={provider.url} target="_blank" rel="noopener noreferrer">
                {provider.sourceLabel} <ExternalLink size={15}/>
              </a>
            </div>
          </article>
        ))}
      </div>
      {filteredPublicProviders.length === 0 && <div className="directory-state"><strong>Nu am găsit furnizori pentru filtrele alese.</strong><button className="filter-reset" onClick={() => { setDirectorySearch(""); setDirectoryCategory(""); setDirectoryLocality(""); }}>Resetează filtrele</button></div>}
    </section>
  );
}
