alter table public.listings
drop constraint if exists listings_gallery_image_urls_max_5;

alter table public.listings
add constraint listings_gallery_image_urls_max_5
check (coalesce(array_length(gallery_image_urls, 1), 0) <= 5);
