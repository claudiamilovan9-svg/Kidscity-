"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";

export default function AccountPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [provider, setProvider] = useState<{ business_name: string; status: string } | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadAccount() {
      const supabase = createClient();
      const { data, error } = await supabase.auth.getUser();
      if (error || !data.user) {
        router.replace("/autentificare");
        return;
      }
      setEmail(data.user.email ?? "");
      const { data: providerData } = await supabase
        .from("provider_profiles")
        .select("business_name,status")
        .eq("owner_id", data.user.id)
        .maybeSingle();
      if (providerData) setProvider(providerData);
      setLoading(false);
    }
    loadAccount();
  }, [router]);

  async function signOut() {
    const supabase = createClient();
    await supabase.auth.signOut();
    router.replace("/");
    router.refresh();
  }

  if (loading) return <main className="auth-shell"><p>Se încarcă profilul...</p></main>;

  return (
    <main className="auth-shell">
      <Link className="brand" href="/"><span className="brand-mark">K</span><span>kids<span className="brand-city">city</span><small>CREȘTEM ÎMPREUNĂ</small></span></Link>
      <section className="auth-card">
        <span className="eyebrow">CONTUL MEU</span>
        <h1>Bine ai venit!</h1>
        <p>Ești autentificat cu <strong>{email}</strong>.</p>
        {provider ? (
          <div className="account-placeholder">
            <h2>Profil furnizor: {provider.business_name}</h2>
            <p>{provider.status === "pending" ? "Solicitarea ta este în așteptarea verificării KidsCity. Profilul și activitățile propuse nu sunt încă publice." : provider.status === "approved" ? "Profilul tău de furnizor este aprobat." : provider.status === "rejected" ? "Solicitarea necesită actualizări. Te vom contacta cu detalii." : "Profilul tău de furnizor este momentan suspendat."}</p>
          </div>
        ) : (
          <div className="account-placeholder">
            <h2>Profilul de părinte</h2>
            <p>În etapa următoare adăugăm profilurile copiilor, favoritele și solicitările de rezervare. Aceste secțiuni nu sunt încă legate la baza de date.</p>
            <Link href="/pentru-furnizori/inscriere">Ești furnizor? Creează un profil KidsCity</Link>
          </div>
        )}
        <Link href="/activitati" className="button auth-submit">Descoperă activități</Link>
        <button className="back-home signout-button" onClick={signOut}>Ieșire din cont</button>
      </section>
    </main>
  );
}
