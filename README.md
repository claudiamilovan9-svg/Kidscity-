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

## Product scope
- Parent accounts and child profiles (age calculated from birth date)
- Provider applications with manual approval
- Provider locations and activities
- Search by category, age, locality and budget
- Favorites, booking requests, provider responses and cancellations
- Reviews after completed bookings
- Admin moderation and reporting

## Database setup

The initial migration is `supabase/migrations/202611120001_initial_marketplace.sql`.

1. Open the Supabase project dashboard.
2. Go to **SQL Editor**.
3. Paste and run the migration file.
4. Confirm that all tables, RLS policies, RPC functions, localities and categories were created.
5. Configure Auth email confirmation and production redirect URLs under Authentication settings.

The migration creates the database schema only. It does not connect to or modify a Supabase project until you run it in that project's SQL Editor. It seeds reference categories and localities around Timișoara; it does not create fake providers or real activity offers.

## Security notes
- Never put a Supabase service-role/secret key in browser code or Git.
- Only the publishable/anon key belongs in `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY`.
- New signups always receive the `parent` role; role assignment is not accepted from user metadata.
- Provider accounts remain pending until an administrator approves them.
- Row Level Security is enabled on every application table.
- Child profiles and booking details are private to the parent and relevant provider.
- Booking status changes use restricted database functions instead of direct client updates.

## Launch checklist
- Apply and test the migration in a non-production Supabase project first.
- Configure Auth email templates, redirect URLs and abuse protection.
- Create the first administrator through a trusted server-side/database admin process; never expose admin role assignment to clients.
- Configure a private Storage bucket and upload policies before enabling provider image uploads.
- Add privacy policy, terms, cookie consent and child-data handling disclosures.
- Verify provider identity/business details before publishing listings.
- Add automated tests, error monitoring, backups and production deployment before accepting real bookings or payments.

Demo content must be visibly labeled and must never be presented as confirmed providers or real availability.
