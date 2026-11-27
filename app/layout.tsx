import type { Metadata } from "next";
import Link from "next/link";
import "./globals.css";

export const metadata: Metadata = {
  title: "KidsCity – Descoperă activități pentru copilul tău",
  description: "Grădinițe, sport, artă, cursuri și experiențe pentru copii în Timișoara și împrejurimi."
};

const links = [
  ["/", "Acasă"], ["/activitati", "Cursuri și activități"], ["/evenimente", "Evenimente"],
  ["/cinema-pentru-copii", "Cinema"], ["/furnizori", "Furnizori"],
  ["/#categorii", "Categorii"], ["/#cum-functioneaza", "Cum funcționează"], ["/#furnizori", "Pentru organizatori"]
];

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="ro">
      <body>
        <style>{`
          .kc-global-header {position:sticky;top:0;z-index:100;background:#fff;border-bottom:1px solid #eee9ff;}
          .kc-global-header .site-header {height:auto;min-height:64px;gap:12px;flex-wrap:wrap;padding-top:10px;padding-bottom:10px;}
          .kc-global-header .header-actions {margin-left:auto;gap:10px;}
          .kc-global-links {display:flex;flex-wrap:wrap;justify-content:center;gap:6px;max-width:1200px;margin:auto;padding:0 12px 8px;}
          .kc-global-links a {padding:8px 10px;border-radius:12px;background:#f5f2ff;color:#5843a8;font-size:12px;font-weight:800;}
          .kc-global-links a:focus-visible {outline:2px solid #7257d8;}
          main > header.site-header, main > nav.mobile-nav {display:none;}
          html {scroll-padding-top:170px;}
          @media(max-width:800px){.kc-global-links {display:grid;grid-template-columns:repeat(4,minmax(0,1fr));gap:4px;}.kc-global-links a{text-align:center;font-size:10px;padding:7px 3px;}.kc-global-header .site-header{padding-left:12px;padding-right:12px;}}
        `}</style>
        <div className="kc-global-header">
          <header className="site-header">
            <Link className="brand" href="/"><span className="brand-mark">K</span><span>kids<span className="brand-city">city</span><small>CREȘTEM ÎMPREUNĂ</small></span></Link>
            <div className="header-actions"><Link className="login-link" href="/autentificare">Intră în cont</Link><Link className="button button-small" href="/inscriere">Creează cont</Link></div>
          </header>
          <nav className="kc-global-links" aria-label="Navigare principală">{links.map(([href,label])=><Link key={href} href={href}>{label}</Link>)}</nav>
        </div>
        {children}
        <footer aria-label="Informații juridice" style={{borderTop:'1px solid #eee9ff',padding:'24px 16px',display:'flex',flexWrap:'wrap',justifyContent:'center',gap:'16px',fontSize:'13px',color:'#5843a8'}}><Link href="/confidentialitate">Confidențialitate (în pregătire)</Link><Link href="/termeni-si-conditii">Termeni și condiții</Link><Link href="/cookies">Cookies</Link><a href="mailto:contact@kidscityapp.ro">Contact</a></footer>
      </body>
    </html>
  );
}
