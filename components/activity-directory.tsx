"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { createClient } from "@/lib/supabase/client";
import { MapPin, Search, SlidersHorizontal, ArrowRight, LoaderCircle, Sparkles } from "lucide-react";

type Activity = {
  id: string;
  title: string;
  slug: string;
  description: string;
  min_age_months: number;
  max_age_months: number;
  price_min_amount: number | null;
  price_max_amount: number | null;
  price_label: string;
  price_unit: string;
  provider_name: string;
  provider_website: string | null;
  contact_phone: string | null;
  source_url: string;
  schedule_text: string | null;
  duration_minutes: number | null;
  listing_status: "needs_confirmation" | "seasonal" | "closed";
  status_note: string;
  category: { name: string; slug: string } | null;
  location: { name: string } | null;
};

const fallbackLocalities = ["Timișoara", "Dumbrăvița", "Giroc", "Moșnița Nouă", "Ghiroda"];
const fallbackCategories = [
  { slug: "sport-miscare", name: "Sport și mișcare" },
  { slug: "arta-creativitate", name: "Artă și creativitate" },
  { slug: "educatie-stem", name: "Educație și STEM" },
  { slug: "muzica", name: "Muzică" },
  { slug: "limbi-straine", name: "Limbi străine" },
  { slug: "natura-aventura", name: "Natură și aventură" },
  { slug: "petreceri-evenimente", name: "Petreceri și evenimente" },
  { slug: "after-school-ingrijire", name: "After-school și îngrijire" },
];

const ageOptions = [
  { label: "0–2 ani", min: 0, max: 24 },
  { label: "3–5 ani", min: 36, max: 71 },
  { label: "6–8 ani", min: 72, max: 107 },
  { label: "9–12 ani", min: 108, max: 155 },
  { label: "13–18 ani", min: 156, max: 216 },
];

export default function ActivityDirectory({ compact = false }: { compact?: boolean }) {
  const [activities, setActivities] = useState<Activity[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [search, setSearch] = useState("");
  const [locality, setLocality] = useState("");
  const [category, setCategory] = useState("");
  const [age, setAge] = useState("");
  const [maxPrice, setMaxPrice] = useState("");

  useEffect(() => {
    let active = true;
    async function load() {
      try {
        const supabase = createClient();
        const { data, error: queryError } = await supabase
          .from("activity_catalog_entries")
          .select("id,activity_title,slug,description,min_age_months,max_age_months,price_min_amount,price_max_amount,price_label,price_unit,provider_name,provider_website,contact_phone,source_url,schedule_text,duration_minutes,listing_status,status_note,category:categories(name,slug),location:localities(name)")
          .eq("is_visible", true)
          .neq("listing_status", "closed")
          .order("last_checked_at", { ascending: false });
        if (queryError) throw queryError;
        if (active) setActivities((data ?? []).map((row: any) => ({ ...row, title: row.activity_title })) as Activity[]);
      } catch {
        if (active) setError("Nu am putut încărca activitățile. Te rugăm să încerci din nou.");
      } finally {
        if (active) setLoading(false);
      }
    }
    load();
    return () => { active = false; };
  }, []);

  const localities = useMemo(() => [...new Set([...fallbackLocalities, ...activities.map(a => a.location?.name).filter(Boolean) as string[]])].sort((a, b) => a.localeCompare(b, "ro")), [activities]);
  const categories = useMemo(() => {
    const values = new Map<string, string>();
    activities.forEach(a => { if (a.category?.slug && a.category.name) values.set(a.category.slug, a.category.name); });
    const merged = new Map(fallbackCategories.map(item => [item.slug, item]));
    values.forEach((name, slug) => merged.set(slug, { slug, name }));
    return [...merged.values()].sort((a, b) => a.name.localeCompare(b.name, "ro"));
  }, [activities]);

  const filtered = useMemo(() => activities.filter(a => {
    const term = search.trim().toLocaleLowerCase("ro");
    const matchesSearch = !term || [a.title, a.description, a.provider_name, a.category?.name, a.location?.name].some(v => v?.toLocaleLowerCase("ro").includes(term));
    const matchesAge = !age || (() => { const option = ageOptions.find(o => o.label === age); return !!option && a.min_age_months <= option.max && a.max_age_months >= option.min; })();
    const matchesPrice = !maxPrice || (a.price_max_amount !== null && a.price_max_amount <= Number(maxPrice));
    return matchesSearch && (!locality || a.location?.name === locality) && (!category || a.category?.slug === category) && matchesAge && matchesPrice;
  }), [activities, search, locality, category, age, maxPrice]);

  const grouped = useMemo(() => {
    const groups = new Map<string, Activity[]>();
    filtered.forEach(activity => {
      const name = activity.category?.name ?? "Alte activități";
      groups.set(name, [...(groups.get(name) ?? []), activity]);
    });
    return [...groups.entries()].sort(([a], [b]) => a.localeCompare(b, "ro"));
  }, [filtered]);

  const renderActivityCard = (activity: Activity) => (
    <article className="activity-card" key={activity.id}>
      <div className="activity-card-art"><span>{activity.category?.name ?? "Activitate pentru copii"}</span><b>{activity.provider_name?.slice(0, 1).toLocaleUpperCase("ro") ?? "K"}</b></div>
      <div className="activity-card-body">
        <span className="activity-provider">{activity.provider_name}</span>
        <h3>{activity.title}</h3>
        <p>{activity.description}</p>
        <div className="activity-meta"><span><MapPin size={14}/>{activity.location?.name ?? "Locație de confirmat"}</span><span>{activity.min_age_months === 0 ? "De la 0 ani" : `De la ${Math.floor(activity.min_age_months / 12)} ani`} · până la {Math.floor(activity.max_age_months / 12)} ani</span></div>
        {activity.schedule_text && <p className="activity-schedule">{activity.schedule_text}</p>}
        <div className="activity-card-bottom"><strong>{activity.price_label}</strong><span>{activity.duration_minutes ? `${activity.duration_minutes} min / ședință` : "Detalii la organizator"}</span></div>
        <p className="activity-catalog-note">{activity.status_note}</p>
        <div className="activity-card-links">
          {activity.provider_website && <a href={activity.provider_website} target="_blank" rel="noopener noreferrer">Site organizator</a>}
          <a href={activity.source_url} target="_blank" rel="noopener noreferrer">Sursa informațiilor</a>
          {activity.contact_phone && <a href={`tel:${activity.contact_phone.replace(/[^+0-9]/g, "")}`}>Sună: {activity.contact_phone}</a>}
        </div>
      </div>
    </article>
  );
  const reset = () => { setSearch(""); setLocality(""); setCategory(""); setAge(""); setMaxPrice(""); };

  return (
    <section className={compact ? "directory-section directory-compact" : "directory-section directory-full"} id="furnizori">
      <div className="directory-heading">
        <div>
          <span className="eyebrow"><Sparkles size={14}/> CATALOG KIDSCITY</span>
          <h2>{compact ? <>Descoperă activități <span>din apropiere</span></> : <>Găsește activitatea <span>potrivită</span></>}</h2>
          <p>Explorează activități identificate în surse publice. Verifică direct cu organizatorul programul, tariful și locurile disponibile înainte de înscriere.</p>
        </div>
        {compact && <Link className="text-link" href="/activitati">Vezi toate activitățile <ArrowRight size={16}/></Link>}
      </div>

      <div className="directory-tools">
        <label className="directory-search"><Search size={18}/><input value={search} onChange={e => setSearch(e.target.value)} placeholder="Caută sport, dans, pictură sau furnizor..." /></label>
        <label><span>Localitate</span><select value={locality} onChange={e => setLocality(e.target.value)}><option value="">Toate localitățile</option>{localities.map(v => <option key={v}>{v}</option>)}</select></label>
        <label><span>Categorie</span><select value={category} onChange={e => setCategory(e.target.value)}><option value="">Toate categoriile</option>{categories.map(v => <option key={v.slug} value={v.slug}>{v.name}</option>)}</select></label>
        <label><span>Vârsta copilului</span><select value={age} onChange={e => setAge(e.target.value)}><option value="">Orice vârstă</option>{ageOptions.map(v => <option key={v.label}>{v.label}</option>)}</select></label>
        <label><span>Buget maxim</span><select value={maxPrice} onChange={e => setMaxPrice(e.target.value)}><option value="">Orice buget</option><option value="50">Până la 50 lei</option><option value="100">Până la 100 lei</option><option value="150">Până la 150 lei</option><option value="250">Până la 250 lei</option><option value="350">Până la 350 lei</option><option value="400">Până la 400 lei</option></select></label>
        <button className="filter-reset" onClick={reset}><SlidersHorizontal size={15}/> Resetează</button>
      </div>

      <div className="directory-results-head"><strong>{loading ? "Se încarcă activitățile..." : `${filtered.length} ${filtered.length === 1 ? "activitate" : "activități"} găsite`}</strong><span>Activități din surse publice · confirmare directă necesară</span></div>
      {loading ? <div className="directory-state"><LoaderCircle className="spin" size={25}/> Încărcăm opțiunile pentru familia ta...</div> :
        error ? <div className="directory-state directory-error">{error}</div> :
        filtered.length === 0 ? <div className="directory-state"><strong>Momentan nu am găsit activități pentru aceste filtre.</strong><span>Încearcă o altă categorie sau resetează filtrele.</span><button className="filter-reset" onClick={reset}>Resetează filtrele</button></div> :
        compact ? <div className="directory-category-list">{grouped.map(([name, items]) => (
          <section className="directory-category" key={name}>
            <div className="directory-category-heading"><h3>{name}</h3><span>{items.length} {items.length === 1 ? "activitate" : "activități"}</span></div>
            <div className="activity-grid">{items.map(renderActivityCard)}</div>
          </section>
        ))}</div> : <div className="activity-grid">{filtered.map(renderActivityCard)}</div>
      }
      {compact && filtered.length > 6 && <div className="directory-more"><Link className="button" href="/activitati">Vezi toate cele {filtered.length} activități <ArrowRight size={16}/></Link></div>}
      {!loading && !error && activities.length === 0 && <p className="directory-footnote">Catalogul se completează din informații publice; fiecare organizator trebuie să confirme tariful, orarul și disponibilitatea actuală.</p>}
    </section>
  );
}
