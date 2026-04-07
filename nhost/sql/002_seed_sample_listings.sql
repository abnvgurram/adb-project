insert into public.listings (
  title,
  listing_type,
  price,
  address,
  city,
  state,
  zip_code,
  beds,
  baths,
  sqft,
  description,
  cover_image_url,
  gallery_image_urls,
  featured,
  published
)
values
  (
    'Wyndham Family Home',
    'sale',
    '$485,000',
    '2847 Wyndham Dr',
    'Glen Allen',
    'VA',
    '23060',
    4,
    3,
    2340,
    'A move-in ready family home close to top schools, shopping, and commuter routes.',
    'https://images.unsplash.com/photo-1600585154526-990dced4db0d?auto=format&fit=crop&w=1200&q=80',
    array[
      'https://images.unsplash.com/photo-1600585154526-990dced4db0d?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1605146769289-440113cc3d00?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1600047509807-ba8f99d2cdde?auto=format&fit=crop&w=1200&q=80'
    ],
    true,
    true
  ),
  (
    'Broad Oak Executive Listing',
    'sale',
    '$629,000',
    '1124 Broad Oak Ct',
    'Richmond',
    'VA',
    '23229',
    5,
    4,
    3100,
    'Spacious layout, updated interiors, and a polished presentation for serious buyers.',
    'https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?auto=format&fit=crop&w=1200&q=80',
    array[
      'https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1600566752355-35792bedcfea?auto=format&fit=crop&w=1200&q=80'
    ],
    true,
    true
  ),
  (
    'Henrico Rental Opportunity',
    'rent',
    '$2,200/mo',
    '5543 Henrico Blvd',
    'Henrico',
    'VA',
    '23228',
    3,
    2,
    1680,
    'Well-kept rental with easy access to Richmond and strong appeal for working professionals.',
    'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&w=1200&q=80',
    array[
      'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1501183638710-841dd1904471?auto=format&fit=crop&w=1200&q=80'
    ],
    false,
    true
  ),
  (
    'Short Pump Recently Sold',
    'sold',
    '$514,700',
    '3312 Short Pump Pkwy',
    'Glen Allen',
    'VA',
    '23233',
    4,
    3,
    2580,
    'A recent sale that shows the local demand and pricing strength in the Short Pump area.',
    'https://images.unsplash.com/photo-1568605114967-8130f3a36994?auto=format&fit=crop&w=1200&q=80',
    array[
      'https://images.unsplash.com/photo-1568605114967-8130f3a36994?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1570129477492-45c003edd2be?auto=format&fit=crop&w=1200&q=80'
    ],
    false,
    true
  );
