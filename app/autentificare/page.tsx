"use client";

import Link from "next/link";
import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";

export default function SignInPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError("");
    setLoading(true);
    try {
      const supabase = createClient();
      const { error } = await supabase.auth.signInWithPassword({ email, password });
      if (error) throw error;
      router.push("/cont");
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Autentificarea nu a reușit.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="auth-shell">
      <Link className="brand" href="/"><span className="brand-mark">K</span><span>kids<span className="brand-city">city</span><small>CREȘTEM ÎMPREUNĂ</small></span></Link>
      <section className="auth-card">
        <span className="eyebrow">BINE AI REVENIT</span>
        <h1>Intră în contul tău</h1>
        <p>Continuă să descoperi activități frumoase pentru copilul tău.</p>
        <form onSubmit={handleSubmit} className="auth-form">
          <label>Email<input type="email" autoComplete="email" required value={email} onChange={e => setEmail(e.target.value)} placeholder="adresa@email.ro" /></label>
          <label>Parolă<input type="password" autoComplete="current-password" required value={password} onChange={e => setPassword(e.target.value)} placeholder="Parola ta" /></label>
          {error && <p className="form-error">{error}</p>}
          <button className="button auth-submit" disabled={loading}>{loading ? "Se verifică..." : "Intră în cont"}</button>
        </form>
        <p className="auth-switch">Nu ai încă un cont? <Link href="/inscriere">Creează unul</Link></p>
        <Link className="back-home" href="/">← Înapoi la KidsCity</Link>
      </section>
    </main>
  );
}