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
  provider_locations?: { address: string; locality_name?: string | null }[];
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
        // Load the directory independently from optional location details.
        const { data, error: queryError } = await supabase
          .from("provider_profiles")
          .select("id,business_name,slug,description")
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

          // A location lookup should never hide providers from the directory.
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
                <span className="provider-location" key={index}><MapPin size={14}/>{location.locality_name ?? location.address}</span>
              ))}
              <Link className="text-link" href="/activitati">Vezi activitățile <ArrowRight size={15}/></Link>
            </div>
          </article>
        ))}</div>
      }
    </section>
  );
}
