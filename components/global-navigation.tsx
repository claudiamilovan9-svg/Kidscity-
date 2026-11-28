"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";

const links = [
  ["/", "Acasă"], ["/activitati", "Cursuri și activități"], ["/evenimente", "Evenimente"],
  ["/cinema-pentru-copii", "Cinema"], ["/furnizori", "Furnizori"],
  ["/#categorii", "Categorii"], ["/#cum-functioneaza", "Cum funcționează"], ["/#furnizori", "Pentru organizatori"]
];

export default function GlobalNavigation() {
  const pathname = usePathname();
  const [hash, setHash] = useState("");
  useEffect(() => {
    const sync = () => setHash(window.location.hash);
    sync();
    window.addEventListener("hashchange", sync);
    window.addEventListener("popstate", sync);
    return () => { window.removeEventListener("hashchange", sync); window.removeEventListener("popstate", sync); };
  }, [pathname]);
  return <nav className="kc-global-links" aria-label="Navigare principală">{links.map(([href,label]) => {
    const active = href === "/" ? pathname === "/" && !links.some(([url]) => url === "/" + hash && url !== "/") :
      href.startsWith("/#") ? (pathname === "/" && href === "/" + hash) || (href === "/#furnizori" && pathname.startsWith("/pentru-furnizori")) :
      pathname === href || pathname.startsWith(href + "/");
    return <Link key={href} href={href} aria-current={active ? (href.includes("#") && pathname === "/" ? "location" : "page") : undefined} onClick={() => setHash(href.includes("#") ? "#" + href.split("#")[1] : "")}>{label}</Link>;
  })}</nav>;
}
