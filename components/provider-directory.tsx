"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { createClient } from "@/lib/supabase/client";
import { MapPin, ArrowRight, LoaderCircle, Store } from "lucide-react";

type Provider = {
  id: string;
  business_name: string;
  slug: string;
  description: string | null;
  provider_locations: { address: string; locality: { name: string } | null }[];
};

export default function ProviderDirectory() {
  const [providers, setProviders] = useState<Provider[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let active = true;
    async function load() {
      try {
        const supabase = createClient();
        const { data, error: queryError } = await supabase
          .from("provider_profiles")
          .select("id,business_name,slug,description,provider_locations(address,locality:localities(name))")
          .eq("status", "approved")
          .order("business_name");
        if (queryError) throw queryError;
        if (active) setProviders((data ?? []) as unknown as Provider[]);
      } catch (e) {
        console.error("KidsCity provider directory:", e);
        if (active) setError("Nu am putut încărca furnizorii. Verifică setările de conexiune și încearcă din nou.");
      } finally {
        if (active) setLoading(false);
      }
    }
    load();
    return () => { active = false; };
  }, []);

  return (
    <section className="provider-directory">
      <div className="provider-directory-heading">
        <span className="eyebrow"><Store size={14}/> COMUNITATEA KIDSCITY</span>
        <h2>Furnizori pentru <span>copilul tău</span></h2>
        <p>Cunoaște organizațiile și specialiștii care propun activități pentru copii.</p>
      </div>
      {loading ? <div className="directory-state"><LoaderCircle className="spin" size={25}/> Încărcăm furnizorii...</div> :
        error ? <div className="directory-state directory-error">{error}</div> :
        providers.length === 0 ? <div className="directory-state">Momentan nu există furnizori aprobați.</div> :
        <div className="provider-grid">{providers.map(provider => (
          <article className="provider-card" key={provider.id}>
            <div className="provider-card-mark">{provider.business_name.replace(/^DEMO – /, "").slice(0, 1).toLocaleUpperCase("ro")}</div>
            <div className="provider-card-content">
              <h3>{provider.business_name}</h3>
              <p>{provider.description || "Descoperă activitățile acestui furnizor pe KidsCity."}</p>
              {provider.provider_locations?.map((location, index) => (
                <span className="provider-location" key={index}><MapPin size={14}/>{location.locality?.name ?? location.address}</span>
              ))}
              <Link className="text-link" href="/activitati">Vezi activitățile <ArrowRight size={15}/></Link>
            </div>
          </article>
        ))}</div>
      }
    </section>
  );
}
