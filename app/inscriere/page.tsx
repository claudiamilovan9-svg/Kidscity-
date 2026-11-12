"use client";

import Link from "next/link";
import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";

export default function SignUpPage() {
  const router = useRouter();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [notice, setNotice] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError("");
    setNotice("");
    setLoading(true);
    try {
      const supabase = createClient();
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          emailRedirectTo: `${window.location.origin}/auth/callback?next=/cont`,
          // The database trigger assigns the parent role; never accept roles from user metadata.
          data: { full_name: name },
        },
      });
      if (error) throw error;
      if (data.session) {
        router.replace("/cont");
        router.refresh();
      } else {
        setNotice("Contul a fost creat. Verifică emailul pentru confirmarea adresei.");
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Înregistrarea nu a reușit.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="auth-shell">
      <Link className="brand" href="/"><span className="brand-mark">K</span><span>kids<span className="brand-city">city</span><small>CREȘTEM ÎMPREUNĂ</small></span></Link>
      <section className="auth-card">
        <span className="eyebrow">BUN VENIT ÎN COMUNITATE</span>
        <h1>Creează un cont</h1>
        <p>Începe cu un cont de părinte. Profilurile de furnizor vor avea un proces separat de verificare.</p>
        <form onSubmit={handleSubmit} className="auth-form">
          <label>Numele tău<input required value={name} onChange={e => setName(e.target.value)} placeholder="Nume și prenume" autoComplete="name" /></label>
          <label>Email<input type="email" required value={email} onChange={e => setEmail(e.target.value)} placeholder="adresa@email.ro" autoComplete="email" /></label>
          <label>Parolă<input type="password" required minLength={8} value={password} onChange={e => setPassword(e.target.value)} placeholder="Minimum 8 caractere" autoComplete="new-password" /></label>
          {error && <p className="form-error">{error}</p>}
          {notice && <p className="form-notice">{notice}</p>}
          <button className="button auth-submit" disabled={loading}>{loading ? "Se creează contul..." : "Creează cont de părinte"}</button>
        </form>
        <p className="auth-switch">Ai deja cont? <Link href="/autentificare">Intră în cont</Link></p>
        <Link className="back-home" href="/">← Înapoi la KidsCity</Link>
      </section>
    </main>
  );
}
