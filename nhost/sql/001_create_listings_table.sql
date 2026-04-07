create extension if not exists pgcrypto;

create or replace function public.set_current_timestamp_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

create table if not exists public.listings (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  listing_type text not null check (listing_type in ('sale', 'rent', 'sold')),
  price text not null,
  address text not null,
  city text not null,
  state text not null default 'VA',
  zip_code text,
  beds integer not null default 0 check (beds >= 0),
  baths numeric(4,1) not null default 0 check (baths >= 0),
  sqft integer not null default 0 check (sqft >= 0),
  description text not null default '',
  cover_image_url text,
  gallery_image_urls text[] not null default '{}'::text[],
  featured boolean not null default false,
  published boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint listings_gallery_image_urls_max_5
    check (coalesce(array_length(gallery_image_urls, 1), 0) <= 5)
);

create index if not exists listings_published_idx
  on public.listings (published);

create index if not exists listings_listing_type_idx
  on public.listings (listing_type);

create index if not exists listings_updated_at_idx
  on public.listings (updated_at desc);

drop trigger if exists set_public_listings_updated_at on public.listings;

create trigger set_public_listings_updated_at
before update on public.listings
for each row
execute procedure public.set_current_timestamp_updated_at();
