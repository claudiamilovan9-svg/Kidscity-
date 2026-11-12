import Link from "next/link";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";

async function signOut() {
  "use server";
  const supabase = await createClient();
  await supabase.auth.signOut();
  redirect("/");
}

export default async function AccountPage() {
  const supabase = await createClient();
  const { data: { user }, error } = await supabase.auth.getUser();

  if (error || !user) {
    redirect("/autentificare?next=/cont");
  }

  return (
    <main className="auth-shell">
      <Link className="brand" href="/"><span className="brand-mark">K</span><span>kids<span className="brand-city">city</span><small>CREȘTEM ÎMPREUNĂ</small></span></Link>
      <section className="auth-card">
        <span className="eyebrow">CONTUL MEU</span>
        <h1>Bine ai venit!</h1>
        <p>Ești autentificat cu <strong>{user.email}</strong>.</p>
        <div className="account-placeholder"><h2>Profilul de părinte</h2><p>În etapa următoare adăugăm profilurile copiilor, favoritele și solicitările de rezervare. Aceste secțiuni nu sunt încă legate la baza de date.</p></div>
        <Link href="/activitati" className="button auth-submit">Descoperă activități</Link>
        <form action={signOut}>
          <button className="back-home signout-button" type="submit">Ieșire din cont</button>
        </form>
      </section>
    </main>
  );
}
