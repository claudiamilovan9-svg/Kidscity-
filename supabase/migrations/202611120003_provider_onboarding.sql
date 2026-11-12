-- Provider onboarding: account-triggered pending application and first draft activity.
alter table public.provider_profiles
  add column if not exists organization_type text,
  add column if not exists contact_person text;

alter table public.provider_locations
  add column if not exists contact_phone text;

alter table public.activities
  add column if not exists schedule_days text[] not null default '{}',
  add column if not exists start_time time,
  add column if not exists end_time time,
  add column if not exists price_label text;

create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path to ''
as $function$
declare
  v_application jsonb;
  v_course jsonb;
  v_provider_id uuid;
  v_location_id uuid;
  v_locality_id bigint;
  v_category_id bigint;
  v_slug text;
  v_days text[];
begin
  insert into public.profiles (id, full_name, role)
  values (new.id, coalesce(new.raw_user_meta_data ->> 'full_name', ''), 'parent')
  on conflict (id) do nothing;

  v_application := new.raw_user_meta_data -> 'provider_application';
  if v_application is null or jsonb_typeof(v_application) <> 'object' then
    return new;
  end if;

  if nullif(trim(v_application ->> 'business_name'), '') is null
     or nullif(trim(v_application ->> 'address'), '') is null
     or nullif(trim(v_application ->> 'locality'), '') is null then
    return new;
  end if;

  select l.id into v_locality_id
  from public.localities l
  where lower(l.name) = lower(trim(v_application ->> 'locality'))
  limit 1;

  if v_locality_id is null then return new; end if;

  v_slug := trim(both '-' from regexp_replace(lower(trim(v_application ->> 'business_name')), '[^a-z0-9]+', '-', 'g'));
  v_slug := coalesce(nullif(v_slug, ''), 'furnizor') || '-' || substr(new.id::text, 1, 8);

  insert into public.provider_profiles (
    owner_id, business_name, slug, description, contact_email,
    contact_phone, website_url, organization_type, contact_person, status
  ) values (
    new.id, trim(v_application ->> 'business_name'), v_slug,
    nullif(trim(v_application ->> 'description'), ''), new.email,
    nullif(trim(v_application ->> 'phone'), ''),
    nullif(trim(v_application ->> 'website'), ''),
    nullif(trim(v_application ->> 'organization_type'), ''),
    nullif(trim(v_application ->> 'contact_person'), ''), 'pending'
  )
  on conflict (owner_id) do nothing
  returning id into v_provider_id;

  if v_provider_id is null then
    select p.id into v_provider_id from public.provider_profiles p where p.owner_id = new.id limit 1;
  end if;
  if v_provider_id is null then return new; end if;

  insert into public.provider_locations (provider_id, locality_id, name, address, is_active)
  values (v_provider_id, v_locality_id, trim(v_application ->> 'business_name'), trim(v_application ->> 'address'), false)
  returning id into v_location_id;

  v_course := v_application -> 'first_activity';
  if v_course is not null
     and jsonb_typeof(v_course) = 'object'
     and nullif(trim(v_course ->> 'title'), '') is not null then
    select c.id into v_category_id
    from public.categories c
    where c.slug = v_course ->> 'category_slug' and c.is_active = true
    limit 1;

    if v_category_id is not null then
      select coalesce(array_agg(d), '{}'::text[]) into v_days
      from jsonb_array_elements_text(coalesce(v_course -> 'schedule_days', '[]'::jsonb)) as x(d);

      insert into public.activities (
        provider_id, location_id, category_id, title, slug, description,
        min_age_months, max_age_months, price_amount, price_unit, price_label,
        duration_minutes, capacity, booking_required, is_active,
        schedule_days, start_time, end_time
      ) values (
        v_provider_id, v_location_id, v_category_id, trim(v_course ->> 'title'),
        trim(both '-' from regexp_replace(lower(trim(v_course ->> 'title')), '[^a-z0-9]+', '-', 'g')) || '-' || substr(new.id::text, 1, 8),
        coalesce(nullif(trim(v_course ->> 'description'), ''), 'Activitate propusă de furnizor; detaliile urmează să fie verificate.'),
        greatest(0, least(216, coalesce(nullif(v_course ->> 'min_age_months', '')::integer, 0))),
        greatest(0, least(216, coalesce(nullif(v_course ->> 'max_age_months', '')::integer, 216))),
        nullif(v_course ->> 'price_amount', '')::numeric,
        coalesce(nullif(v_course ->> 'price_unit', ''), 'per_session'),
        coalesce(nullif(trim(v_course ->> 'price_label'), ''), 'Preț de confirmat'),
        nullif(v_course ->> 'duration_minutes', '')::integer,
        nullif(v_course ->> 'capacity', '')::integer,
        true, false, coalesce(v_days, '{}'::text[]),
        nullif(v_course ->> 'start_time', '')::time,
        nullif(v_course ->> 'end_time', '')::time
      );
    end if;
  end if;
  return new;
end;
$function$;

drop policy if exists "Approved providers manage activities" on public.activities;
create policy "Providers manage own draft and approved activities"
on public.activities for all to authenticated
using (public.owns_provider(provider_id) or public.is_admin())
with check (
  public.is_admin()
  or (
    public.owns_provider(provider_id)
    and exists (
      select 1 from public.provider_profiles p
      where p.id = activities.provider_id
        and (
          p.status = 'approved'::public.provider_status
          or (p.status = 'pending'::public.provider_status and activities.is_active = false)
        )
    )
  )
);

comment on column public.activities.schedule_days is 'Zilele săptămânii propuse de furnizor; informații neconfirmate până la aprobare.';
comment on column public.activities.start_time is 'Ora de început propusă de furnizor.';
comment on column public.activities.end_time is 'Ora de sfârșit propusă de furnizor.';
comment on column public.activities.price_label is 'Textul de preț furnizat de organizator, de confirmat înainte de publicare.';
