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
  price_amount: number | null;
  currency: string;
  price_unit: string;
  provider: { business_name: string; slug: string } | null;
  category: { name: string; slug: string } | null;
  location: { address: string; locality: { name: string } | null } | null;
};

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
          .from("activities")
          .select("id,title,slug,description,min_age_months,max_age_months,price_amount,currency,price_unit,provider:provider_profiles!inner(business_name,slug),category:categories(name,slug),location:provider_locations(address,locality:localities(name))")
          .eq("is_active", true)
          .eq("provider.status", "approved")
          .order("published_at", { ascending: false, nullsFirst: false });
        if (queryError) throw queryError;
        if (active) setActivities((data ?? []) as unknown as Activity[]);
      } catch {
        if (active) setError("Nu am putut încărca activitățile. Te rugăm să încerci din nou.");
      } finally {
        if (active) setLoading(false);
      }
    }
    load();
    return () => { active = false; };
  }, []);

  const localities = useMemo(() => [...new Set(activities.map(a => a.location?.locality?.name).filter(Boolean))].sort() as string[], [activities]);
  const categories = useMemo(() => {
    const values = new Map<string, string>();
    activities.forEach(a => { if (a.category?.slug && a.category.name) values.set(a.category.slug, a.category.name); });
    return [...values].map(([slug, name]) => ({ slug, name })).sort((a, b) => a.name.localeCompare(b.name, "ro"));
  }, [activities]);

  const filtered = useMemo(() => activities.filter(a => {
    const term = search.trim().toLocaleLowerCase("ro");
    const matchesSearch = !term || [a.title, a.description, a.provider?.business_name, a.category?.name, a.location?.locality?.name].some(v => v?.toLocaleLowerCase("ro").includes(term));
    const matchesAge = !age || (() => { const option = ageOptions.find(o => o.label === age); return !!option && a.min_age_months <= option.max && a.max_age_months >= option.min; })();
    const matchesPrice = !maxPrice || (a.price_amount !== null && a.price_amount <= Number(maxPrice));
    return matchesSearch && (!locality || a.location?.locality?.name === locality) && (!category || a.category?.slug === category) && matchesAge && matchesPrice;
  }), [activities, search, locality, category, age, maxPrice]);

  const visible = compact ? filtered.slice(0, 6) : filtered;
  const reset = () => { setSearch(""); setLocality(""); setCategory(""); setAge(""); setMaxPrice(""); };

  return (
    <section className={compact ? "directory-section directory-compact" : "directory-section directory-full"} id="furnizori">
      <div className="directory-heading">
        <div>
          <span className="eyebrow"><Sparkles size={14}/> CATALOG KIDSCITY</span>
          <h2>{compact ? <>Descoperă furnizori <span>din apropiere</span></> : <>Găsește activitatea <span>potrivită</span></>}</h2>
          <p>Explorează activități publicate de furnizori aprobați și filtrează după nevoile familiei tale.</p>
        </div>
        {compact && <Link className="text-link" href="/activitati">Vezi toate activitățile <ArrowRight size={16}/></Link>}
      </div>

      <div className="directory-tools">
        <label className="directory-search"><Search size={18}/><input value={search} onChange={e => setSearch(e.target.value)} placeholder="Caută sport, dans, pictură sau furnizor..." /></label>
        <label><span>Localitate</span><select value={locality} onChange={e => setLocality(e.target.value)}><option value="">Toate localitățile</option>{localities.map(v => <option key={v}>{v}</option>)}</select></label>
        <label><span>Categorie</span><select value={category} onChange={e => setCategory(e.target.value)}><option value="">Toate categoriile</option>{categories.map(v => <option key={v.slug} value={v.slug}>{v.name}</option>)}</select></label>
        <label><span>Vârsta copilului</span><select value={age} onChange={e => setAge(e.target.value)}><option value="">Orice vârstă</option>{ageOptions.map(v => <option key={v.label}>{v.label}</option>)}</select></label>
        <label><span>Buget maxim</span><select value={maxPrice} onChange={e => setMaxPrice(e.target.value)}><option value="">Orice buget</option><option value="50">Până la 50 lei</option><option value="100">Până la 100 lei</option><option value="150">Până la 150 lei</option><option value="250">Până la 250 lei</option></select></label>
        <button className="filter-reset" onClick={reset}><SlidersHorizontal size={15}/> Resetează</button>
      </div>

      <div className="directory-results-head"><strong>{loading ? "Se încarcă activitățile..." : `${filtered.length} ${filtered.length === 1 ? "activitate" : "activități"} găsite`}</strong><span>Doar oferte publicate de furnizori aprobați</span></div>
      {loading ? <div className="directory-state"><LoaderCircle className="spin" size={25}/> Încărcăm opțiunile pentru familia ta...</div> :
        error ? <div className="directory-state directory-error">{error}</div> :
        visible.length === 0 ? <div className="directory-state"><strong>Momentan nu am găsit activități pentru aceste filtre.</strong><span>Încearcă o altă categorie sau resetează filtrele.</span><button className="filter-reset" onClick={reset}>Resetează filtrele</button></div> :
        <div className="activity-grid">{visible.map(activity => (
          <article className="activity-card" key={activity.id}>
            <div className="activity-card-art"><span>{activity.category?.name ?? "Activitate pentru copii"}</span><b>{activity.provider?.business_name?.slice(0, 1).toLocaleUpperCase("ro") ?? "K"}</b></div>
            <div className="activity-card-body">
              <span className="activity-provider">{activity.provider?.business_name}</span>
              <h3>{activity.title}</h3>
              <p>{activity.description}</p>
              <div className="activity-meta"><span><MapPin size={14}/>{activity.location?.locality?.name ?? "Locație de confirmat"}</span><span>{activity.min_age_months === 0 ? "De la 0 ani" : `De la ${Math.floor(activity.min_age_months / 12)} ani`} · până la {Math.floor(activity.max_age_months / 12)} ani</span></div>
              <div className="activity-card-bottom"><strong>{activity.price_amount === null ? "Preț la cerere" : `${activity.price_amount} ${activity.currency}`}</strong><span>Ofertă publicată</span></div>
            </div>
          </article>
        ))}</div>
      }
      {compact && filtered.length > 6 && <div className="directory-more"><Link className="button" href="/activitati">Vezi toate cele {filtered.length} activități <ArrowRight size={16}/></Link></div>}
      {!loading && !error && activities.length === 0 && <p className="directory-footnote">Catalogul se va completa pe măsură ce furnizorii își publică activitățile. Nu afișăm profiluri sau oferte demonstrative ca și cum ar fi reale.</p>}
    </section>
  );
}
