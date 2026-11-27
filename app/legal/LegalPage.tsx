import Link from "next/link";
import styles from "./legal.module.css";

const links = [["/confidentialitate","Confidențialitate"],["/termeni-si-conditii","Termeni și condiții"],["/cookies","Cookies"]];
export default function LegalPage({title,active,sections}:{title:string;active:string;sections:{title:string;body:string}[]}) {
 return <main className={styles.shell}>
 <Link href="/" className={styles.back}>← Înapoi la KidsCity</Link>
 <header className={styles.hero}><span className="eyebrow">CENTRUL JURIDIC KIDSCITY</span><h1>{title}</h1><p>Informații despre utilizarea platformei și protecția datelor.</p><span className={styles.status}>Proiect de interfață · document nefinalizat</span></header>
 <nav className={styles.nav} aria-label="Documente juridice">{links.map(([href,label])=><Link key={href} href={href} aria-current={active===href?"page":undefined}>{label}</Link>)}</nav>
 <article className={styles.article}><p className={styles.notice}>Această pagină este o previzualizare. Textul juridic final urmează să fie validat înainte de publicare.</p>{sections.map((s,i)=><section key={s.title}><h2>{i+1}. {s.title}</h2><p>{s.body}</p></section>)}</article>
 <aside className={styles.contact}><h2>Ai întrebări?</h2><p>Contactează KidsCity la <a href="mailto:contact@kidscityapp.ro">contact@kidscityapp.ro</a>.</p></aside>
 </main>;
}
