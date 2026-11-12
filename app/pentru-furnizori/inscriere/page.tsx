"use client";

import Link from "next/link";
import { FormEvent, useState } from "react";
import { createClient } from "@/lib/supabase/client";

const localities = ["Timișoara", "Dumbrăvița", "Giroc", "Moșnița Nouă", "Ghiroda", "Giarmata", "Remetea Mare", "Șag", "Sânandrei"];
const categories = [
  ["sport-miscare", "Sport și mișcare"],
  ["arta-creativitate", "Artă și creativitate"],
  ["educatie-stem", "Educație și STEM"],
  ["muzica", "Muzică"],
  ["limbi-straine", "Limbi străine"],
  ["natura-aventura", "Natură și aventură"],
  ["petreceri-evenimente", "Petreceri și evenimente"],
  ["after-school-ingrijire", "After-school și îngrijire"],
];
const weekdays = ["Luni", "Marți", "Miercuri", "Joi", "Vineri", "Sâmbătă", "Duminică"];

export default function ProviderSignupPage() {
  const [contactPerson, setContactPerson] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [businessName, setBusinessName] = useState("");
  const [organizationType, setOrganizationType] = useState("Centru / organizație");
  const [description, setDescription] = useState("");
  const [phone, setPhone] = useState("");
  const [website, setWebsite] = useState("");
  const [locality, setLocality] = useState("Timișoara");
  const [address, setAddress] = useState("");
  const [courseTitle, setCourseTitle] = useState("");
  const [categorySlug, setCategorySlug] = useState("sport-miscare");
  const [courseDescription, setCourseDescription] = useState("");
  const [minAge, setMinAge] = useState("4");
  const [maxAge, setMaxAge] = useState("12");
  const [price, setPrice] = useState("");
  const [priceUnit, setPriceUnit] = useState("per_session");
  const [priceLabel, setPriceLabel] = useState("");
  const [duration, setDuration] = useState("");
  const [capacity, setCapacity] = useState("");
  const [days, setDays] = useState<string[]>([]);
  const [startTime, setStartTime] = useState("");
  const [endTime, setEndTime] = useState("");
  const [consent, setConsent] = useState(false);
  const [error, setError] = useState("");
  const [notice, setNotice] = useState("");
  const [complete, setComplete] = useState(false);
  const [loading, setLoading] = useState(false);

  function toggleDay(day: string) {
    setDays(current => current.includes(day) ? current.filter(item => item !== day) : [...current, day]);
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError("");
    setNotice("");
    if (Number(minAge) > Number(maxAge)) {
      setError("Vârsta minimă nu poate fi mai mare decât vârsta maximă.");
      return;
    }
    if (startTime && endTime && startTime >= endTime) {
      setError("Ora de final trebuie să fie după ora de început.");
      return;
    }
    if (!consent) {
      setError("Te rugăm să confirmi acordul privind prelucrarea datelor și verificarea informațiilor.");
      return;
    }

    setLoading(true);
    try {
      const supabase = createClient();
      const { data, error: signUpError } = await supabase.auth.signUp({
        email: email.trim(),
        password,
        options: {
          data: {
            full_name: contactPerson.trim(),
            provider_application: {
              contact_person: contactPerson.trim(),
              business_name: businessName.trim(),
              organization_type: organizationType,
              description: description.trim(),
              phone: phone.trim(),
              website: website.trim(),
              locality,
              address: address.trim(),
              first_activity: {
                title: courseTitle.trim(),
                category_slug: categorySlug,
                description: courseDescription.trim(),
                min_age_months: Math.round(Number(minAge) * 12),
                max_age_months: Math.round(Number(maxAge) * 12),
                price_amount: price ? Number(price) : null,
                price_unit: priceUnit,
                price_label: priceLabel.trim(),
                duration_minutes: duration ? Number(duration) : null,
                capacity: capacity ? Number(capacity) : null,
                schedule_days: days,
                start_time: startTime,
                end_time: endTime,
              },
            },
          },
        },
      });
      if (signUpError) throw signUpError;
      setComplete(true);
      if (data.session) {
        setNotice("Contul și solicitarea de parteneriat au fost create. Profilul și prima activitate sunt în așteptarea verificării KidsCity.");
      } else {
        setNotice("Contul a fost creat. Verifică emailul pentru confirmarea adresei. Solicitarea de parteneriat și prima activitate au fost salvate ca propuneri, în așteptarea verificării KidsCity.");
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Nu am putut trimite solicitarea. Te rugăm să încerci din nou.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="auth-shell provider-signup-shell">
      <Link className="brand" href="/"><span className="brand-mark">K</span><span>kids<span className="brand-city">city</span><small>CREȘTEM ÎMPREUNĂ</small></span></Link>
      <section className="auth-card provider-signup-card">
        <span className="eyebrow">DEVINO PARTENER KIDSCITY</span>
        <h1>Hai să prezentăm familiilor activitățile tale.</h1>
        <p>Completează datele organizației și ale primului curs. Îți creăm un cont de furnizor și trimitem profilul spre verificare.</p>
        {complete ? (
          <div className="provider-success">
            <h2>Mulțumim pentru înscriere!</h2>
            <p>{notice}</p>
            <p>După verificare, te vom contacta pentru confirmarea detaliilor înainte ca profilul sau activitățile să fie publicate.</p>
            <Link className="button auth-submit" href="/autentificare">Mergi la autentificare</Link>
            <Link className="back-home" href="/">Înapoi la KidsCity</Link>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="auth-form provider-form">
            <div className="provider-form-section">
              <span className="provider-step">01 · CONTUL TĂU</span>
              <h2>Date de autentificare și contact</h2>
              <label>Persoană de contact<input required autoComplete="name" value={contactPerson} onChange={e => setContactPerson(e.target.value)} placeholder="Nume și prenume" /></label>
              <label>Email de autentificare<input type="email" required autoComplete="email" value={email} onChange={e => setEmail(e.target.value)} placeholder="nume@exemplu.ro" /></label>
              <label>Parolă<input type="password" required minLength={8} autoComplete="new-password" value={password} onChange={e => setPassword(e.target.value)} placeholder="Minimum 8 caractere" /></label>
            </div>

            <div className="provider-form-section">
              <span className="provider-step">02 · ORGANIZAȚIA</span>
              <h2>Despre centrul sau activitatea ta</h2>
              <label>Denumirea organizației / furnizorului<input required value={businessName} onChange={e => setBusinessName(e.target.value)} placeholder="Ex. Club sportiv, atelier, centru educațional" /></label>
              <label>Tipul furnizorului<select value={organizationType} onChange={e => setOrganizationType(e.target.value)}><option>Centru / organizație</option><option>Persoană fizică autorizată</option><option>Instructor / antrenor independent</option><option>Asociație / ONG</option><option>Alt tip de organizator</option></select></label>
              <label>Descriere scurtă<textarea rows={3} value={description} onChange={e => setDescription(e.target.value)} placeholder="Ce face organizația ta și ce experiență oferi copiilor?" /></label>
              <label>Telefon de contact<input type="tel" required value={phone} onChange={e => setPhone(e.target.value)} placeholder="07xx xxx xxx" /></label>
              <label>Website sau pagină socială <span className="field-optional">(opțional)</span><input type="url" value={website} onChange={e => setWebsite(e.target.value)} placeholder="https://" /></label>
            </div>

            <div className="provider-form-section">
              <span className="provider-step">03 · LOCAȚIE</span>
              <h2>Unde au loc activitățile?</h2>
              <label>Localitate<select required value={locality} onChange={e => setLocality(e.target.value)}>{localities.map(place => <option key={place}>{place}</option>)}</select></label>
              <label>Adresă completă<input required value={address} onChange={e => setAddress(e.target.value)} placeholder="Stradă, număr, detalii de acces" /></label>
            </div>

            <div className="provider-form-section">
              <span className="provider-step">04 · PRIMA ACTIVITATE</span>
              <h2>Ce curs sau activitate propui?</h2>
              <label>Denumirea cursului<input required value={courseTitle} onChange={e => setCourseTitle(e.target.value)} placeholder="Ex. Inițiere în înot, robotică, dans" /></label>
              <label>Categorie<select required value={categorySlug} onChange={e => setCategorySlug(e.target.value)}>{categories.map(([slug, name]) => <option key={slug} value={slug}>{name}</option>)}</select></label>
              <label>Descriere<textarea rows={3} value={courseDescription} onChange={e => setCourseDescription(e.target.value)} placeholder="Ce vor face copiii la acest curs?" /></label>
              <div className="provider-two-cols">
                <label>Vârsta minimă (ani)<input type="number" min="0" max="18" required value={minAge} onChange={e => setMinAge(e.target.value)} /></label>
                <label>Vârsta maximă (ani)<input type="number" min="0" max="18" required value={maxAge} onChange={e => setMaxAge(e.target.value)} /></label>
              </div>
              <div className="provider-two-cols">
                <label>Preț (lei) <span className="field-optional">(opțional)</span><input type="number" min="0" step="0.01" value={price} onChange={e => setPrice(e.target.value)} placeholder="Ex. 120" /></label>
                <label>Unitate de tarifare<select value={priceUnit} onChange={e => setPriceUnit(e.target.value)}><option value="per_session">Per ședință</option><option value="per_month">Pe lună</option><option value="per_course">Pe curs / modul</option><option value="free">Gratuit</option></select></label>
              </div>
              <label>Detalii preț <span className="field-optional">(opțional)</span><input value={priceLabel} onChange={e => setPriceLabel(e.target.value)} placeholder="Ex. 4 ședințe / lună, materiale incluse" /></label>
              <div className="provider-two-cols">
                <label>Durată (minute) <span className="field-optional">(opțional)</span><input type="number" min="1" max="600" value={duration} onChange={e => setDuration(e.target.value)} placeholder="Ex. 60" /></label>
                <label>Locuri / grupă <span className="field-optional">(opțional)</span><input type="number" min="1" max="500" value={capacity} onChange={e => setCapacity(e.target.value)} placeholder="Ex. 10" /></label>
              </div>
              <fieldset className="provider-days"><legend>Zile disponibile <span className="field-optional">(poți selecta mai multe)</span></legend><div>{weekdays.map(day => <label key={day}><input type="checkbox" checked={days.includes(day)} onChange={() => toggleDay(day)} />{day}</label>)}</div></fieldset>
              <div className="provider-two-cols">
                <label>Ora de început<input type="time" value={startTime} onChange={e => setStartTime(e.target.value)} /></label>
                <label>Ora de final<input type="time" value={endTime} onChange={e => setEndTime(e.target.value)} /></label>
              </div>
              <p className="provider-hint">Programul și prețul sunt informații propuse de tine și vor fi confirmate înainte de publicare.</p>
            </div>

            <label className="provider-consent"><input type="checkbox" checked={consent} onChange={e => setConsent(e.target.checked)} required />Confirm că am dreptul să transmit aceste informații și sunt de acord ca KidsCity să le folosească pentru evaluarea solicitării și contactarea mea. Înțeleg că înscrierea nu garantează aprobarea sau publicarea automată.</label>
            {error && <p className="form-error">{error}</p>}
            {notice && <p className="form-notice">{notice}</p>}
            <button className="button auth-submit" disabled={loading}>{loading ? "Se trimite solicitarea..." : "Creează contul și trimite solicitarea"}</button>
          </form>
        )}
      </section>
      <Link className="back-home" href="/">← Înapoi la KidsCity</Link>
    </main>
  );
}
