# KidsCity

Marketplace pentru activități și servicii dedicate copiilor, lansat inițial în Timișoara, Dumbrăvița, Giroc, Moșnița Nouă și Ghiroda.

## Stack
- Next.js App Router + TypeScript
- Supabase (PostgreSQL, Auth, Storage)
- CSS responsive

## Local setup
1. Install Node.js 20 or newer.
2. Run `npm install`.
3. Copy `.env.example` to `.env.local`.
4. Add the Supabase project URL and publishable key to `.env.local`.
5. Run `npm run dev` and open http://localhost:3000.

Never commit `.env.local`, service-role/secret keys, passwords, or private credentials.

## Product direction
- Parent and provider accounts
- Child profiles with age stored in months
- Provider profiles, multiple locations and activities
- Activity discovery by category, age, locality, budget and distance
- Booking requests accepted or declined by providers
- Favorites, parent/provider dashboards and admin moderation
- Clearly labeled demo data until real providers are onboarded

Database migrations and authenticated flows will be added incrementally after the Supabase schema and security policies are verified.