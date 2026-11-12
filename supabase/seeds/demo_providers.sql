-- KIDSCITY DEMO DATA — DEVELOPMENT/STAGING ONLY.
-- Creates clearly labeled fictional providers and sample activities.
-- These synthetic accounts have no usable password and cannot be used to sign in.
-- Do not run on production. Delete rows with slug LIKE 'demo-%' before launch.

begin;

insert into auth.users (
  instance_id,id,aud,role,email,encrypted_password,email_confirmed_at,
  raw_app_meta_data,raw_user_meta_data,created_at,updated_at,
  confirmation_token,email_change,email_change_token_new,recovery_token
) values
('00000000-0000-0000-0000-000000000000','d0000000-0000-4000-8000-000000000001','authenticated','authenticated','demo.sport@kidscity.example','',now(),'{"provider":"email","providers":["email"]}'::jsonb,'{"full_name":"DEMO – Clubul Micilor Campioni"}'::jsonb,now(),now(),'','','',''),
('00000000-0000-0000-0000-000000000000','d0000000-0000-4000-8000-000000000002','authenticated','authenticated','demo.arta@kidscity.example','',now(),'{"provider":"email","providers":["email"]}'::jsonb,'{"full_name":"DEMO – Atelierul Curcubeu"}'::jsonb,now(),now(),'','','',''),
('00000000-0000-0000-0000-000000000000','d0000000-0000-4000-8000-000000000003','authenticated','authenticated','demo.muzica@kidscity.example','',now(),'{"provider":"email","providers":["email"]}'::jsonb,'{"full_name":"DEMO – Note Vesele"}'::jsonb,now(),now(),'','','',''),
('00000000-0000-0000-0000-000000000004','d0000000-0000-4000-8000-000000000004','authenticated','authenticated','demo.limbi@kidscity.example','',now(),'{"provider":"email","providers":["email"]}'::jsonb,'{"full_name":"DEMO – Little Linguists"}'::jsonb,now(),now(),'','','',''),
('00000000-0000-0000-0000-000000000000','d0000000-0000-4000-8000-000000000005','authenticated','authenticated','demo.dans@kidscity.example','',now(),'{"provider":"email","providers":["email"]}'::jsonb,'{"full_name":"DEMO – Dance & Joy"}'::jsonb,now(),now(),'','','',''),
('00000000-0000-0000-0000-000000000000','d0000000-0000-4000-8000-000000000006','authenticated','authenticated','demo.stem@kidscity.example','',now(),'{"provider":"email","providers":["email"]}'::jsonb,'{"full_name":"DEMO – Mini Exploratori STEM"}'::jsonb,now(),now(),'','','','')
on conflict (id) do nothing;

alter table public.profiles disable trigger profiles_protect_role;
update public.profiles set role='provider' where id in (
'd0000000-0000-4000-8000-000000000001','d0000000-0000-4000-8000-000000000002',
'd0000000-0000-4000-8000-000000000003','d0000000-0000-4000-8000-000000000004',
'd0000000-0000-4000-8000-000000000005','d0000000-0000-4000-8000-000000000006');
alter table public.profiles enable trigger profiles_protect_role;

insert into public.provider_profiles (id,owner_id,business_name,slug,description,contact_email,contact_phone,status,verified_at) values
('e0000000-0000-4000-8000-000000000001','d0000000-0000-4000-8000-000000000001','DEMO – Clubul Micilor Campioni','demo-clubul-micilor-campioni','Profil demonstrativ fictiv: inițiere sportivă și mișcare pentru copii.','demo.sport@kidscity.example','0700 000 001','approved',now()),
('e0000000-0000-4000-8000-000000000002','d0000000-0000-4000-8000-000000000002','DEMO – Atelierul Curcubeu','demo-atelierul-curcubeu','Profil demonstrativ fictiv: pictură, modelaj și creativitate.','demo.arta@kidscity.example','0700 000 002','approved',now()),
('e0000000-0000-4000-8000-000000000003','d0000000-0000-4000-8000-000000000003','DEMO – Note Vesele','demo-note-vesele','Profil demonstrativ fictiv: educație muzicală și ritm.','demo.muzica@kidscity.example','0700 000 003','approved',now()),
('e0000000-0000-4000-8000-000000000004','d0000000-0000-4000-8000-000000000004','DEMO – Little Linguists','demo-little-linguists','Profil demonstrativ fictiv: cluburi de limba engleză.','demo.limbi@kidscity.example','0700 000 004','approved',now()),
('e0000000-0000-4000-8000-000000000005','d0000000-0000-4000-8000-000000000005','DEMO – Dance & Joy','demo-dance-joy','Profil demonstrativ fictiv: dans creativ și mișcare.','demo.dans@kidscity.example','0700 000 005','approved',now()),
('e0000000-0000-4000-8000-000000000006','d0000000-0000-4000-8000-000000000006','DEMO – Mini Exploratori STEM','demo-mini-exploratori-stem','Profil demonstrativ fictiv: experimente, logică și robotică.','demo.stem@kidscity.example','0700 000 006','approved',now())
on conflict (id) do update set status='approved',description=excluded.description,verified_at=now();

insert into public.provider_locations (id,provider_id,locality_id,name,address,is_active)
select v.id,v.provider_id,l.id,v.label,v.address,true
from (values
('f0000000-0000-4000-8000-000000000001','e0000000-0000-4000-8000-000000000001','Timișoara','Sediu demo sport','Adresă fictivă – demo'),
('f0000000-0000-4000-8000-000000000002','e0000000-0000-4000-8000-000000000002','Dumbrăvița','Sediu demo artă','Adresă fictivă – demo'),
('f0000000-0000-4000-8000-000000000003','e0000000-0000-4000-8000-000000000003','Timișoara','Sediu demo muzică','Adresă fictivă – demo'),
('f0000000-0000-4000-8000-000000000004','e0000000-0000-4000-8000-000000000004','Giroc','Sediu demo limbi','Adresă fictivă – demo'),
('f0000000-0000-4000-8000-000000000005','e0000000-0000-4000-8000-000000000005','Timișoara','Sediu demo dans','Adresă fictivă – demo'),
('f0000000-0000-4000-8000-000000000006','e0000000-0000-4000-8000-000000000006','Dumbrăvița','Sediu demo STEM','Adresă fictivă – demo')
) v(id,provider_id,locality,label,address)
join public.localities l on l.name=v.locality
on conflict (id) do update set address=excluded.address,is_active=true;

insert into public.activities (id,provider_id,location_id,category_id,title,slug,description,min_age_months,max_age_months,price_amount,currency,price_unit,duration_minutes,capacity,booking_required,is_active,published_at)
select v.id,v.provider_id,v.location_id,c.id,v.title,v.slug,v.description,v.min_age,v.max_age,v.price,'RON','per_session',v.duration,10,true,true,now()
from (values
('a0000000-0000-4000-8000-000000000001','e0000000-0000-4000-8000-000000000001','f0000000-0000-4000-8000-000000000001','sport-miscare','DEMO – Mini atletism','demo-mini-atletism','Jocuri de coordonare și mișcare – exemplu fictiv.',36,96,45,50),
('a0000000-0000-4000-8000-000000000002','e0000000-0000-4000-8000-000000000001','f0000000-0000-4000-8000-000000000001','sport-miscare','DEMO – Gimnastică distractivă','demo-gimnastica-distractiva','Echilibru, mobilitate și jocuri sportive – exemplu fictiv.',48,144,55,55),
('a0000000-0000-4000-8000-000000000003','e0000000-0000-4000-8000-000000000002','f0000000-0000-4000-8000-000000000002','arta-creativitate','DEMO – Pictură pentru pitici','demo-pictura-pentru-pitici','Culoare, pictură și exprimare creativă – exemplu fictiv.',36,96,50,60),
('a0000000-0000-4000-8000-000000000004','e0000000-0000-4000-8000-000000000002','f0000000-0000-4000-8000-000000000002','arta-creativitate','DEMO – Modelaj și forme','demo-modelaj-si-forme','Modelaj și lucru manual – exemplu fictiv.',60,144,60,75),
('a0000000-0000-4000-8000-000000000005','e0000000-0000-4000-8000-000000000003','f0000000-0000-4000-8000-000000000003','muzica','DEMO – Primii pași în muzică','demo-primii-pasi-in-muzica','Ritm, cântec și jocuri muzicale – exemplu fictiv.',24,72,45,45),
('a0000000-0000-4000-8000-000000000006','e0000000-0000-4000-8000-000000000003','f0000000-0000-4000-8000-000000000003','muzica','DEMO – Atelier de percuție','demo-atelier-de-percutie','Explorarea instrumentelor de percuție – exemplu fictiv.',72,156,65,60),
('a0000000-0000-4000-8000-000000000007','e0000000-0000-4000-8000-000000000004','f0000000-0000-4000-8000-000000000004','limbi-straine','DEMO – English Playtime','demo-english-playtime','Engleză prin povești și joc – exemplu fictiv.',48,96,50,45),
('a0000000-0000-4000-8000-000000000008','e0000000-0000-4000-8000-000000000004','f0000000-0000-4000-8000-000000000004','limbi-straine','DEMO – English Explorers','demo-english-explorers','Vocabular și conversație pentru copii – exemplu fictiv.',84,156,65,60),
('a0000000-0000-4000-8000-000000000009','e0000000-0000-4000-8000-000000000005','f0000000-0000-4000-8000-000000000005','sport-miscare','DEMO – Dans creativ','demo-dans-creativ','Dans, ritm și exprimare prin mișcare – exemplu fictiv.',36,96,50,50),
('a0000000-0000-4000-8000-000000000010','e0000000-0000-4000-8000-000000000005','f0000000-0000-4000-8000-000000000005','sport-miscare','DEMO – Street dance junior','demo-street-dance-junior','Pași de dans și coregrafii junior – exemplu fictiv.',96,180,70,60),
('a0000000-0000-4000-8000-000000000011','e0000000-0000-4000-8000-000000000006','f0000000-0000-4000-8000-000000000006','educatie-stem','DEMO – Micii inventatori','demo-micii-inventatori','Experimente simple și gândire logică – exemplu fictiv.',60,120,65,75),
('a0000000-0000-4000-8000-000000000012','e0000000-0000-4000-8000-000000000006','f0000000-0000-4000-8000-000000000006','educatie-stem','DEMO – Robotică pentru copii','demo-robotica-pentru-copii','Primii pași în robotică și programare – exemplu fictiv.',96,180,85,90)
) v(id,provider_id,location_id,category_slug,title,slug,description,min_age,max_age,price,duration)
join public.categories c on c.slug=v.category_slug
on conflict (id) do update set title=excluded.title,description=excluded.description,is_active=true,published_at=now();

commit;
