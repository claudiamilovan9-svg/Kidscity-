import Link from "next/link";
import EventsCalendar from "@/components/events-calendar";
export const metadata = { title: "Calendar evenimente copii | KidsCity", description: "Descoperă evenimente pentru copii în Timișoara, Dumbrăvița și împrejurimi, cu surse verificate." };
export default function EventsPage() {
  return <main><header className="site-header"><Link className="brand" href="/"><span className="brand-mark">K</span><span>kids<span className="brand-city">city</span><small>CREȘTEM ÎMPREUNĂ</small></span></Link><nav className="desktop-nav"><Link href="/">Acasă</Link><Link href="/activitati">Activități</Link><Link href="/furnizori">Furnizori</Link></nav></header><EventsCalendar/><footer><Link href="/">← Înapoi la KidsCity</Link></footer></main>;
}