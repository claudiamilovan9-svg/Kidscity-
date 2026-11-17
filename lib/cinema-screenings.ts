// Proiecții publicate pentru 17.11.2026. Date punctuale, nu sincronizare automată.
// Pentru alte date, calendarul folosește evenimentele confirmate din Supabase.
type Film = { title: string; age: string; duration: string | null; language: string; times: string[] };
const cinemas: { id: string; venue: string; source: string; ticket: string; films: Film[] }[] = [
  {
    id: "1802",
    venue: "Cinema City Iulius Mall",
    source: "https://www.cinemacity.ro/cinemas/timisoara-iulius-mall/1802",
    ticket: "https://www.cinemacity.ro/cinemas/timisoara-iulius-mall/1802",
    films: [
      { title: "Micul mamut: Aventuri în Africa", age: "AG", duration: "73 min", language: "Dublat în română", times: ["12:30", "14:15", "16:00", "17:50"] },
      { title: "Mia și școala de monștri", age: "AG", duration: "81 min", language: "Dublat în română", times: ["15:40"] }
    ]
  },
  {
    id: "1823",
    venue: "Cinema City Shopping City",
    source: "https://m.cinemagia.ro/program-cinema/cinema-city-shopping-city-timisoara/?from_date=17.11.2026",
    ticket: "https://www.cinemacity.ro/cinemas/timisoara-shopping-city/1823",
    films: [
      { title: "Mia și școala de monștri", age: "Verifică clasificarea", duration: null, language: "Dublat în română", times: ["12:00", "14:00"] },
      { title: "Wildwood: Tărâmul fantastic", age: "Verifică clasificarea", duration: null, language: "Dublat în română", times: ["12:20"] },
      { title: "Micul mamut: Aventuri în Africa", age: "Verifică clasificarea", duration: null, language: "Dublat în română", times: ["13:10", "15:00", "16:45", "18:40"] },
      { title: "Misterul lui Lucy Lost", age: "Verifică clasificarea", duration: null, language: "Versiunea diferă după proiecție; verifică sursa", times: ["12:15", "13:50", "15:50", "17:50"] }
    ]
  }
];
export const cinemaScreenings = cinemas.flatMap(cinema => cinema.films.flatMap(film => film.times.map(time => ({
  id: `cinema-city-${cinema.id}-2026-11-17-${film.title}-${time}`,
  title: film.title,
  organizer: "Cinema City",
  locality: "Timișoara",
  venue: cinema.venue,
  category: "Cinema pentru copii",
  starts_at: `2026-11-17T${time}:00+02:00`,
  ends_at: null,
  age_label: film.age,
  price_label: null,
  description: `${film.language}${film.duration ? " · " + film.duration : ""} · Program 17.11.2026`,
  source_url: cinema.source,
  ticket_url: cinema.ticket
}))));
