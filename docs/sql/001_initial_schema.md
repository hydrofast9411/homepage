# 001 — Initial Schema

Run this once in the Supabase Dashboard → SQL Editor for project `wmxfomqysadfmbxequsx`.
It creates every table for the HydroFast site, enables trigram search, and sets up
Storage buckets + RLS policies. Safe to run top-to-bottom in a single query.

**Note on RLS here**: the app itself connects to Postgres directly via Drizzle (`DATABASE_URL`)
and enforces "only publish rows the public should see" in its own queries (e.g. `WHERE is_published`),
and gates all admin writes behind `middleware.ts` + the Supabase session check — that is the real
access control. Storage uploads/deletes from Server Actions use the Supabase **service role** key,
which bypasses RLS by design. The policies below are a defense-in-depth backstop for the case where
something ever queries Supabase directly over PostgREST/Storage with an anon or user JWT (e.g. if a
public key were ever used client-side against these tables) — not the primary gate.

```sql
-- Extensions -----------------------------------------------------------
create extension if not exists pg_trgm;
create extension if not exists "uuid-ossp";

-- business_areas ---------------------------------------------------------
create table business_areas (
  id uuid primary key default uuid_generate_v4(),
  slug text unique not null,
  name_ko text not null,
  name_en text,
  summary_ko text,
  summary_en text,
  description_ko text,
  description_en text,
  hero_image_path text,
  icon_key text,
  sort_order int not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- product_categories ------------------------------------------------------
create table product_categories (
  id uuid primary key default uuid_generate_v4(),
  business_area_id uuid references business_areas(id) on delete set null,
  slug text unique not null,
  name_ko text not null,
  name_en text,
  description_ko text,
  description_en text,
  icon_key text,
  sort_order int not null default 0,
  spec_schema jsonb not null default '[]',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- manufacturers ------------------------------------------------------------
create table manufacturers (
  id uuid primary key default uuid_generate_v4(),
  slug text unique not null,
  name text not null,
  country text,
  logo_path text,
  website_url text,
  description_ko text,
  description_en text,
  is_active boolean not null default true,
  sort_order int not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table manufacturer_business_areas (
  manufacturer_id uuid not null references manufacturers(id) on delete cascade,
  business_area_id uuid not null references business_areas(id) on delete cascade,
  primary key (manufacturer_id, business_area_id)
);

-- products -------------------------------------------------------------
create table products (
  id uuid primary key default uuid_generate_v4(),
  slug text unique not null,
  model_no text,
  manufacturer_id uuid references manufacturers(id) on delete set null,
  category_id uuid references product_categories(id) on delete set null,
  business_area_id uuid references business_areas(id) on delete set null,
  name_ko text not null,
  name_en text,
  short_description_ko text,
  short_description_en text,
  description_ko text,
  description_en text,
  specs jsonb not null default '{}',
  primary_image_path text,
  is_published boolean not null default false,
  sort_order int not null default 0,
  search_text text not null default '',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index products_search_text_trgm_idx on products using gin (search_text gin_trgm_ops);
create index products_category_idx on products (category_id);
create index products_manufacturer_idx on products (manufacturer_id);
create index products_business_area_idx on products (business_area_id);

create table product_images (
  id uuid primary key default uuid_generate_v4(),
  product_id uuid not null references products(id) on delete cascade,
  storage_path text not null,
  alt_ko text,
  alt_en text,
  sort_order int not null default 0,
  is_primary boolean not null default false
);

-- case_studies -----------------------------------------------------------
create table case_studies (
  id uuid primary key default uuid_generate_v4(),
  client_name text not null,
  title_ko text not null,
  title_en text,
  description_ko text,
  description_en text,
  image_path text,
  aspect_ratio text not null default '21-9',
  business_area_id uuid references business_areas(id) on delete set null,
  is_published boolean not null default true,
  sort_order int not null default 0,
  created_at timestamptz not null default now()
);

-- client_logos -----------------------------------------------------------
create table client_logos (
  id uuid primary key default uuid_generate_v4(),
  name text not null,
  logo_path text not null,
  is_published boolean not null default true,
  sort_order int not null default 0
);

-- history_events ---------------------------------------------------------
create table history_events (
  id uuid primary key default uuid_generate_v4(),
  year int not null,
  month int,
  title_ko text not null,
  title_en text,
  description_ko text,
  description_en text,
  is_highlight boolean not null default false,
  sort_order int not null default 0
);

-- certifications ---------------------------------------------------------
create table certifications (
  id uuid primary key default uuid_generate_v4(),
  title_ko text not null,
  title_en text,
  issuing_body_ko text,
  issuing_body_en text,
  cert_number text,
  issue_date date,
  image_path text,
  category text not null default 'certification', -- patent | certification | award
  sort_order int not null default 0
);

-- affiliates ---------------------------------------------------------------
create table affiliates (
  id uuid primary key default uuid_generate_v4(),
  slug text unique not null, -- dongshin | efhydro
  name_ko text not null,
  name_en text,
  tagline_ko text,
  tagline_en text,
  logo_path text,
  hero_image_path text,
  sort_order int not null default 0
);

create table affiliate_sections (
  id uuid primary key default uuid_generate_v4(),
  affiliate_id uuid not null references affiliates(id) on delete cascade,
  section_key text not null,
  heading_ko text,
  heading_en text,
  body_ko text,
  body_en text,
  image_path text,
  layout_variant text,
  sort_order int not null default 0
);

-- site_settings ------------------------------------------------------------
create table site_settings (
  setting_key text primary key,
  value_ko text,
  value_en text,
  value_json jsonb
);

-- inquiries ------------------------------------------------------------
create table inquiries (
  id uuid primary key default uuid_generate_v4(),
  name text not null,
  company text,
  email text not null,
  phone text,
  business_area_interest text,
  message text not null,
  created_at timestamptz not null default now(),
  is_read boolean not null default false
);

-- Storage buckets --------------------------------------------------------
insert into storage.buckets (id, name, public)
values
  ('product-images', 'product-images', true),
  ('case-study-images', 'case-study-images', true),
  ('client-logos', 'client-logos', true),
  ('partner-logos', 'partner-logos', true),
  ('site-media', 'site-media', true)
on conflict (id) do nothing;

-- Public read, authenticated write, for every bucket above
create policy "public read product-images" on storage.objects
  for select using (bucket_id = 'product-images');
create policy "auth write product-images" on storage.objects
  for all using (bucket_id = 'product-images' and auth.role() = 'authenticated')
  with check (bucket_id = 'product-images' and auth.role() = 'authenticated');

create policy "public read case-study-images" on storage.objects
  for select using (bucket_id = 'case-study-images');
create policy "auth write case-study-images" on storage.objects
  for all using (bucket_id = 'case-study-images' and auth.role() = 'authenticated')
  with check (bucket_id = 'case-study-images' and auth.role() = 'authenticated');

create policy "public read client-logos" on storage.objects
  for select using (bucket_id = 'client-logos');
create policy "auth write client-logos" on storage.objects
  for all using (bucket_id = 'client-logos' and auth.role() = 'authenticated')
  with check (bucket_id = 'client-logos' and auth.role() = 'authenticated');

create policy "public read partner-logos" on storage.objects
  for select using (bucket_id = 'partner-logos');
create policy "auth write partner-logos" on storage.objects
  for all using (bucket_id = 'partner-logos' and auth.role() = 'authenticated')
  with check (bucket_id = 'partner-logos' and auth.role() = 'authenticated');

create policy "public read site-media" on storage.objects
  for select using (bucket_id = 'site-media');
create policy "auth write site-media" on storage.objects
  for all using (bucket_id = 'site-media' and auth.role() = 'authenticated')
  with check (bucket_id = 'site-media' and auth.role() = 'authenticated');

-- Row Level Security on tables --------------------------------------------
-- Public (anon) can SELECT published rows; only authenticated (the admin) can write.
alter table business_areas enable row level security;
alter table product_categories enable row level security;
alter table manufacturers enable row level security;
alter table manufacturer_business_areas enable row level security;
alter table products enable row level security;
alter table product_images enable row level security;
alter table case_studies enable row level security;
alter table client_logos enable row level security;
alter table history_events enable row level security;
alter table certifications enable row level security;
alter table affiliates enable row level security;
alter table affiliate_sections enable row level security;
alter table site_settings enable row level security;
alter table inquiries enable row level security;

create policy "public read business_areas" on business_areas for select using (true);
create policy "auth write business_areas" on business_areas for all using (auth.role() = 'authenticated') with check (auth.role() = 'authenticated');

create policy "public read product_categories" on product_categories for select using (true);
create policy "auth write product_categories" on product_categories for all using (auth.role() = 'authenticated') with check (auth.role() = 'authenticated');

create policy "public read manufacturers" on manufacturers for select using (true);
create policy "auth write manufacturers" on manufacturers for all using (auth.role() = 'authenticated') with check (auth.role() = 'authenticated');

create policy "public read manufacturer_business_areas" on manufacturer_business_areas for select using (true);
create policy "auth write manufacturer_business_areas" on manufacturer_business_areas for all using (auth.role() = 'authenticated') with check (auth.role() = 'authenticated');

create policy "public read products" on products for select using (is_published = true);
create policy "auth full products" on products for all using (auth.role() = 'authenticated') with check (auth.role() = 'authenticated');

create policy "public read product_images" on product_images for select using (true);
create policy "auth write product_images" on product_images for all using (auth.role() = 'authenticated') with check (auth.role() = 'authenticated');

create policy "public read case_studies" on case_studies for select using (is_published = true);
create policy "auth full case_studies" on case_studies for all using (auth.role() = 'authenticated') with check (auth.role() = 'authenticated');

create policy "public read client_logos" on client_logos for select using (is_published = true);
create policy "auth full client_logos" on client_logos for all using (auth.role() = 'authenticated') with check (auth.role() = 'authenticated');

create policy "public read history_events" on history_events for select using (true);
create policy "auth write history_events" on history_events for all using (auth.role() = 'authenticated') with check (auth.role() = 'authenticated');

create policy "public read certifications" on certifications for select using (true);
create policy "auth write certifications" on certifications for all using (auth.role() = 'authenticated') with check (auth.role() = 'authenticated');

create policy "public read affiliates" on affiliates for select using (true);
create policy "auth write affiliates" on affiliates for all using (auth.role() = 'authenticated') with check (auth.role() = 'authenticated');

create policy "public read affiliate_sections" on affiliate_sections for select using (true);
create policy "auth write affiliate_sections" on affiliate_sections for all using (auth.role() = 'authenticated') with check (auth.role() = 'authenticated');

create policy "public read site_settings" on site_settings for select using (true);
create policy "auth write site_settings" on site_settings for all using (auth.role() = 'authenticated') with check (auth.role() = 'authenticated');

-- inquiries: anyone can INSERT (the public contact form), only admin can read/update
create policy "public insert inquiries" on inquiries for insert with check (true);
create policy "auth read inquiries" on inquiries for select using (auth.role() = 'authenticated');
create policy "auth update inquiries" on inquiries for update using (auth.role() = 'authenticated');
```

## After running this once

1. Go to **Authentication → Providers** and disable "Allow new users to sign up".
2. Go to **Authentication → Users** and manually create the one admin user (email + password) — use the same email you put in `ADMIN_EMAIL` in `.env.local`.
3. Confirm the 5 Storage buckets appear under **Storage** and are marked public.
4. Go to **Project Settings → Database → Connection string**, copy the **Transaction pooler** URI, substitute your DB password, and put it in `DATABASE_URL` in `.env.local` (and later in Vercel's env vars).
