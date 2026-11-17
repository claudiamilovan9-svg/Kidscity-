// Proiecții confirmate în capturile Cinema City pentru 17.11.2026.
// Actualizările viitoare vor fi importate în kidscity_events; nu presupunem ore pentru alte zile.
export const cinemaScreenings = [
  { title: "Micul mamut: Aventuri în Africa", age: "AG", duration: "73 min", language: "Dublat în română", times: ["12:30","14:15","16:00","17:50"] },
  { title: "Mia și școala de monștri", age: "AG", duration: "81 min", language: "Dublat în română", times: ["15:40"] }
].flatMap(film => film.times.map(time => ({
  id: `cinema-city-1802-2026-11-17-${film.title}-${time}`,
  title: film.title,
  organizer: "Cinema City",
  locality: "Timișoara",
  venue: "Iulius Mall",
  category: "Cinema pentru copii",
  starts_at: `2026-11-17T${time}:00+02:00`,
  ends_at: null,
  age_label: film.age,
  price_label: null,
  description: `${film.language} · ${film.duration} · Program 17.11.2026`,
  source_url: "https://www.cinemacity.ro/cinemas/timisoara-iulius-mall/1802",
  ticket_url: "https://www.cinemacity.ro/cinemas/timisoara-iulius-mall/1802"
})));
