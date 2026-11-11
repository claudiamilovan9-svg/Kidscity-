"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";

export default function AccountPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const supabase = createClient();
    supabase.auth.getUser().then(({ data, error }) => {
      if (error || !data.user) {
        router.replace("/autentificare");
        return;
      }
      setEmail(data.user.email ?? "");
      setLoading(false);
    });
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
        <div className="account-placeholder"><h2>Profilul de părinte</h2><p>În etapa următoare adăugăm profilurile copiilor, favoritele și solicitările de rezervare. Aceste secțiuni nu sunt încă legate la baza de date.</p></div>
        <Link href="/activitati" className="button auth-submit">Descoperă activități</Link>
        <button className="back-home signout-button" onClick={signOut}>Ieșire din cont</button>
      </section>
    </main>
  );
}