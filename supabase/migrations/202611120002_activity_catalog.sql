-- Public-source activity catalog. These records are separate from approved provider activities.
create table public.activity_catalog_entries (
  id uuid primary key default gen_random_uuid(),
  slug text not null unique,
  provider_name text not null,
  activity_title text not null,
  description text not null,
  category_id bigint not null references public.categories(id),
  locality_id bigint not null references public.localities(id),
  address text,
  contact_phone text,
  provider_website text,
  source_url text not null,
  min_age_months integer not null default 0,
  max_age_months integer not null default 216,
  price_min_amount numeric,
  price_max_amount numeric,
  price_label text not null default 'Preț la cerere',
  price_unit text not null default 'per_session',
  duration_minutes integer,
  schedule_text text,
  listing_status text not null default 'needs_confirmation'
    check (listing_status in ('needs_confirmation', 'seasonal', 'closed')),
  status_note text not null default 'Informații publice; confirmă direct cu organizatorul.',
  last_checked_at date not null default current_date,
  is_visible boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint activity_catalog_age_range
    check (min_age_months >= 0 and max_age_months >= min_age_months and max_age_months <= 216),
  constraint activity_catalog_price_range
    check (
      (price_min_amount is null or price_min_amount >= 0)
      and (price_max_amount is null or price_max_amount >= 0)
      and (price_min_amount is null or price_max_amount is null or price_max_amount >= price_min_amount)
    ),
  constraint activity_catalog_duration_positive
    check (duration_minutes is null or duration_minutes > 0)
);

create index activity_catalog_category_idx on public.activity_catalog_entries(category_id);
create index activity_catalog_locality_idx on public.activity_catalog_entries(locality_id);
create index activity_catalog_visible_idx on public.activity_catalog_entries(is_visible, listing_status);

alter table public.activity_catalog_entries enable row level security;

create policy "Public can read visible activity catalog entries"
  on public.activity_catalog_entries
  for select
  to anon, authenticated
  using (is_visible = true);

grant select on public.activity_catalog_entries to anon, authenticated;

comment on table public.activity_catalog_entries is
  'Listings gathered from public sources. Not proof of provider partnership or current availability; provider approval uses provider_profiles and activities.';
