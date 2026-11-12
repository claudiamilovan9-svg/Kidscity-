-- KidsCity initial marketplace schema
-- Apply in Supabase SQL Editor. Safe to run once on a new project.

create extension if not exists pgcrypto;

create type public.account_role as enum ('parent', 'provider', 'admin');
create type public.provider_status as enum ('pending', 'approved', 'rejected', 'suspended');
create type public.booking_status as enum ('pending', 'accepted', 'declined', 'cancelled', 'completed');

create table public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  full_name text not null default '',
  phone text,
  role public.account_role not null default 'parent',
  avatar_url text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.localities (
  id bigint generated always as identity primary key,
  name text not null unique,
  county text not null default 'Timiș',
  created_at timestamptz not null default now()
);

create table public.categories (
  id bigint generated always as identity primary key,
  name text not null unique,
  slug text not null unique,
  description text,
  icon text,
  sort_order integer not null default 0,
  is_active boolean not null default true
);

create table public.children (
  id uuid primary key default gen_random_uuid(),
  parent_id uuid not null references public.profiles(id) on delete cascade,
  first_name text not null,
  birth_date date not null,
  notes text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.provider_profiles (
  id uuid primary key default gen_random_uuid(),
  owner_id uuid not null unique references public.profiles(id) on delete cascade,
  business_name text not null,
  slug text not null unique,
  description text,
  contact_email text,
  contact_phone text,
  website_url text,
  status public.provider_status not null default 'pending',
  rejection_reason text,
  verified_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.provider_locations (
  id uuid primary key default gen_random_uuid(),
  provider_id uuid not null references public.provider_profiles(id) on delete cascade,
  locality_id bigint not null references public.localities(id),
  name text,
  address text not null,
  postal_code text,
  latitude double precision,
  longitude double precision,
  is_active boolean not null default true,
  created_at timestamptz not null default now(),
  constraint valid_latitude check (latitude is null or latitude between -90 and 90),
  constraint valid_longitude check (longitude is null or longitude between -180 and 180)
);

create table public.activities (
  id uuid primary key default gen_random_uuid(),
  provider_id uuid not null references public.provider_profiles(id) on delete cascade,
  location_id uuid references public.provider_locations(id) on delete set null,
  category_id bigint not null references public.categories(id),
  title text not null,
  slug text not null,
  description text not null,
  min_age_months integer not null default 0,
  max_age_months integer not null default 216,
  price_amount numeric(10,2),
  currency text not null default 'RON',
  price_unit text not null default 'per_session',
  duration_minutes integer,
  capacity integer,
  booking_required boolean not null default true,
  is_active boolean not null default false,
  published_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique(provider_id, slug),
  constraint activity_age_range check (min_age_months >= 0 and max_age_months >= min_age_months and max_age_months <= 216),
  constraint activity_price_nonnegative check (price_amount is null or price_amount >= 0),
  constraint activity_duration_positive check (duration_minutes is null or duration_minutes > 0),
  constraint activity_capacity_positive check (capacity is null or capacity > 0)
);

create table public.activity_images (
  id uuid primary key default gen_random_uuid(),
  activity_id uuid not null references public.activities(id) on delete cascade,
  storage_path text not null,
  alt_text text,
  sort_order integer not null default 0,
  created_at timestamptz not null default now()
);

create table public.favorites (
  parent_id uuid not null references public.profiles(id) on delete cascade,
  activity_id uuid not null references public.activities(id) on delete cascade,
  created_at timestamptz not null default now(),
  primary key(parent_id, activity_id)
);

create table public.bookings (
  id uuid primary key default gen_random_uuid(),
  parent_id uuid not null references public.profiles(id) on delete restrict,
  child_id uuid not null references public.children(id) on delete restrict,
  activity_id uuid not null references public.activities(id) on delete restrict,
  requested_date timestamptz not null,
  participants integer not null default 1,
  parent_message text,
  provider_message text,
  status public.booking_status not null default 'pending',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint booking_participants_positive check (participants between 1 and 20),
  constraint booking_date_future check (requested_date > created_at)
);

create table public.reviews (
  id uuid primary key default gen_random_uuid(),
  booking_id uuid not null unique references public.bookings(id) on delete cascade,
  parent_id uuid not null references public.profiles(id) on delete cascade,
  activity_id uuid not null references public.activities(id) on delete cascade,
  rating integer not null check (rating between 1 and 5),
  comment text,
  is_visible boolean not null default true,
  created_at timestamptz not null default now()
);

create index children_parent_id_idx on public.children(parent_id);
create index provider_locations_locality_idx on public.provider_locations(locality_id);
create index activities_category_idx on public.activities(category_id);
create index activities_age_idx on public.activities(min_age_months, max_age_months);
create index activities_provider_active_idx on public.activities(provider_id, is_active);
create index bookings_parent_created_idx on public.bookings(parent_id, created_at desc);
create index bookings_activity_idx on public.bookings(activity_id, requested_date);
create index reviews_activity_idx on public.reviews(activity_id, created_at desc);

create or replace function public.set_updated_at()
returns trigger language plpgsql as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

create trigger profiles_updated_at before update on public.profiles
for each row execute function public.set_updated_at();
create trigger children_updated_at before update on public.children
for each row execute function public.set_updated_at();
create trigger provider_profiles_updated_at before update on public.provider_profiles
for each row execute function public.set_updated_at();
create trigger activities_updated_at before update on public.activities
for each row execute function public.set_updated_at();
create trigger bookings_updated_at before update on public.bookings
for each row execute function public.set_updated_at();

-- The role is assigned by trusted administrators, never from sign-up metadata.
create or replace function public.prevent_profile_role_change()
returns trigger language plpgsql as $$
begin
  if new.role is distinct from old.role and coalesce(auth.jwt() ->> 'role', '') <> 'service_role' then
    raise exception 'Account role can only be changed by a trusted administrator';
  end if;
  return new;
end;
$$;
create trigger profiles_protect_role before update on public.profiles
for each row execute function public.prevent_profile_role_change();

create or replace function public.handle_new_user()
returns trigger language plpgsql security definer set search_path = ''
as $$
begin
  insert into public.profiles (id, full_name, role)
  values (
    new.id,
    coalesce(new.raw_user_meta_data ->> 'full_name', ''),
    'parent'
  )
  on conflict (id) do nothing;
  return new;
end;
$$;
create trigger on_auth_user_created
after insert on auth.users
for each row execute procedure public.handle_new_user();

create or replace function public.is_admin()
returns boolean language sql stable security definer set search_path = ''
as $$
  select exists (
    select 1 from public.profiles
    where id = (select auth.uid()) and role = 'admin'
  );
$$;

create or replace function public.owns_provider(target_provider uuid)
returns boolean language sql stable security definer set search_path = ''
as $$
  select exists (
    select 1 from public.provider_profiles
    where id = target_provider and owner_id = (select auth.uid())
  );
$$;

alter table public.profiles enable row level security;
alter table public.localities enable row level security;
alter table public.categories enable row level security;
alter table public.children enable row level security;
alter table public.provider_profiles enable row level security;
alter table public.provider_locations enable row level security;
alter table public.activities enable row level security;
alter table public.activity_images enable row level security;
alter table public.favorites enable row level security;
alter table public.bookings enable row level security;
alter table public.reviews enable row level security;

create policy "Profiles are visible to their owner and admins"
on public.profiles for select to authenticated
using (id = (select auth.uid()) or public.is_admin());
create policy "Users can create their own parent profile"
on public.profiles for insert to authenticated
with check (id = (select auth.uid()) and role = 'parent');
create policy "Users can update their own profile"
on public.profiles for update to authenticated
using (id = (select auth.uid()) or public.is_admin())
with check (id = (select auth.uid()) or public.is_admin());

create policy "Localities are public" on public.localities
for select to anon, authenticated using (true);
create policy "Admins manage localities" on public.localities
for all to authenticated using (public.is_admin()) with check (public.is_admin());

create policy "Active categories are public" on public.categories
for select to anon, authenticated using (is_active or public.is_admin());
create policy "Admins manage categories" on public.categories
for all to authenticated using (public.is_admin()) with check (public.is_admin());

create policy "Parents manage their children" on public.children
for all to authenticated
using (parent_id = (select auth.uid()) or public.is_admin())
with check (parent_id = (select auth.uid()) or public.is_admin());

create policy "Providers are public when approved"
on public.provider_profiles for select to anon, authenticated
using (status = 'approved' or owner_id = (select auth.uid()) or public.is_admin());
create policy "Users can apply as providers"
on public.provider_profiles for insert to authenticated
with check (owner_id = (select auth.uid()) and status = 'pending');
create policy "Providers update their own application"
on public.provider_profiles for update to authenticated
using (owner_id = (select auth.uid()) or public.is_admin())
with check ((owner_id = (select auth.uid()) and status = 'pending') or public.is_admin());

create policy "Active provider locations are public"
on public.provider_locations for select to anon, authenticated
using (
  is_active and exists (
    select 1 from public.provider_profiles p
    where p.id = provider_id and p.status = 'approved'
  )
  or public.owns_provider(provider_id) or public.is_admin()
);
create policy "Providers manage their locations"
on public.provider_locations for all to authenticated
using (public.owns_provider(provider_id) or public.is_admin())
with check (public.owns_provider(provider_id) or public.is_admin());

create policy "Published activities are public"
on public.activities for select to anon, authenticated
using (
  (is_active and exists (
    select 1 from public.provider_profiles p
    where p.id = provider_id and p.status = 'approved'
  ))
  or public.owns_provider(provider_id) or public.is_admin()
);
create policy "Approved providers manage activities"
on public.activities for all to authenticated
using (public.owns_provider(provider_id) or public.is_admin())
with check (
  (public.owns_provider(provider_id) and exists (
    select 1 from public.provider_profiles p
    where p.id = provider_id and p.status = 'approved'
  ))
  or public.is_admin()
);

create policy "Images follow activity visibility"
on public.activity_images for select to anon, authenticated
using (exists (
  select 1 from public.activities a
  where a.id = activity_id and (
    (a.is_active and exists (select 1 from public.provider_profiles p where p.id = a.provider_id and p.status = 'approved'))
    or public.owns_provider(a.provider_id) or public.is_admin()
  )
));
create policy "Providers manage activity images"
on public.activity_images for all to authenticated
using (exists (select 1 from public.activities a where a.id = activity_id and (public.owns_provider(a.provider_id) or public.is_admin())))
with check (exists (select 1 from public.activities a where a.id = activity_id and (public.owns_provider(a.provider_id) or public.is_admin())));

create policy "Parents manage favorites"
on public.favorites for all to authenticated
using (parent_id = (select auth.uid()) or public.is_admin())
with check (parent_id = (select auth.uid()) or public.is_admin());

create policy "Booking parties can view bookings"
on public.bookings for select to authenticated
using (
  parent_id = (select auth.uid())
  or exists (
    select 1 from public.activities a
    where a.id = activity_id and public.owns_provider(a.provider_id)
  )
  or public.is_admin()
);
create policy "Parents create bookings for their children"
on public.bookings for insert to authenticated
with check (
  parent_id = (select auth.uid())
  and exists (select 1 from public.children c where c.id = child_id and c.parent_id = (select auth.uid()))
  and exists (
    select 1 from public.activities a
    join public.provider_profiles p on p.id = a.provider_id
    where a.id = activity_id and a.is_active and p.status = 'approved'
  )
);
-- No direct UPDATE/DELETE grant on bookings: status changes are exposed through narrow RPCs.

create policy "Visible reviews are public"
on public.reviews for select to anon, authenticated
using (is_visible or parent_id = (select auth.uid()) or public.is_admin());
create policy "Parents review completed bookings"
on public.reviews for insert to authenticated
with check (
  parent_id = (select auth.uid())
  and exists (
    select 1 from public.bookings b
    where b.id = booking_id and b.parent_id = (select auth.uid())
      and b.activity_id = activity_id and b.status = 'completed'
  )
);

create or replace function public.provider_respond_to_booking(target_booking uuid, decision public.booking_status, message text default null)
returns void language plpgsql security definer set search_path = ''
as $$
begin
  if decision not in ('accepted', 'declined') then
    raise exception 'Invalid provider decision';
  end if;
  update public.bookings b
  set status = decision, provider_message = left(message, 2000)
  where b.id = target_booking and b.status = 'pending'
    and exists (
      select 1 from public.activities a
      where a.id = b.activity_id and public.owns_provider(a.provider_id)
    );
  if not found then raise exception 'Booking not found or no longer pending'; end if;
end;
$$;

create or replace function public.parent_cancel_booking(target_booking uuid)
returns void language plpgsql security definer set search_path = ''
as $$
begin
  update public.bookings
  set status = 'cancelled'
  where id = target_booking and parent_id = (select auth.uid())
    and status in ('pending', 'accepted');
  if not found then raise exception 'Booking cannot be cancelled'; end if;
end;
$$;

revoke all on function public.provider_respond_to_booking(uuid, public.booking_status, text) from public;
revoke all on function public.parent_cancel_booking(uuid) from public;
grant execute on function public.provider_respond_to_booking(uuid, public.booking_status, text) to authenticated;
grant execute on function public.parent_cancel_booking(uuid) to authenticated;

grant usage on schema public to anon, authenticated;
grant select on public.localities, public.categories, public.provider_profiles, public.provider_locations, public.activities, public.activity_images, public.reviews to anon, authenticated;
grant select, insert, update on public.profiles to authenticated;
grant select, insert, update, delete on public.children, public.favorites to authenticated;
grant select, insert, update, delete on public.provider_profiles, public.provider_locations, public.activities, public.activity_images to authenticated;
grant select, insert on public.bookings to authenticated;
grant select, insert on public.reviews to authenticated;
grant usage, select on all sequences in schema public to anon, authenticated;

insert into public.localities (name) values
  ('Timișoara'), ('Dumbrăvița'), ('Giroc'), ('Moșnița Nouă'), ('Ghiroda'),
  ('Șag'), ('Sânandrei'), ('Giarmata'), ('Remetea Mare')
on conflict (name) do nothing;

insert into public.categories (name, slug, description, icon, sort_order) values
  ('Sport și mișcare', 'sport-miscare', 'Sport, înot, dans și activități în aer liber.', 'activity', 1),
  ('Artă și creativitate', 'arta-creativitate', 'Pictură, modelaj, teatru și ateliere creative.', 'palette', 2),
  ('Educație și STEM', 'educatie-stem', 'Experimente, robotică, programare și învățare.', 'lightbulb', 3),
  ('Muzică', 'muzica', 'Instrumente, canto și educație muzicală.', 'music', 4),
  ('Limbi străine', 'limbi-straine', 'Cursuri și cluburi de limbi străine.', 'languages', 5),
  ('Natură și aventură', 'natura-aventura', 'Explorare, tabere și experiențe în natură.', 'trees', 6),
  ('Petreceri și evenimente', 'petreceri-evenimente', 'Aniversări, spectacole și evenimente pentru copii.', 'party-popper', 7),
  ('After-school și îngrijire', 'after-school-ingrijire', 'Programe after-school și servicii de îngrijire.', 'school', 8)
on conflict (slug) do nothing;

comment on table public.children is 'Contains personal data about minors. Visible only to the owning parent and authorized administrators.';
comment on table public.bookings is 'Booking status transitions are restricted to provider_respond_to_booking and parent_cancel_booking RPCs.';
