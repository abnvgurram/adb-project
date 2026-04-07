import { demoListings } from '../data/demoListings.js'
import { hasNhostConfig, nhost } from './nhost.js'

const listingFields = `
  id
  title
  listing_type
  price
  address
  city
  state
  zip_code
  beds
  baths
  sqft
  description
  cover_image_url
  gallery_image_urls
  featured
  published
  created_at
  updated_at
`

const LISTINGS_QUERY = `
  query PublicListings {
    listings(
      where: { published: { _eq: true } }
      order_by: [{ featured: desc_nulls_last }, { updated_at: desc_nulls_last }, { created_at: desc_nulls_last }]
    ) {
      ${listingFields}
    }
  }
`

const ADMIN_LISTINGS_QUERY = `
  query AdminListings {
    listings(
      order_by: [{ featured: desc_nulls_last }, { updated_at: desc_nulls_last }, { created_at: desc_nulls_last }]
    ) {
      ${listingFields}
    }
  }
`

const CREATE_LISTING_MUTATION = `
  mutation CreateListing($object: listings_insert_input!) {
    insert_listings_one(object: $object) {
      id
    }
  }
`

const UPDATE_LISTING_MUTATION = `
  mutation UpdateListing($id: uuid!, $changes: listings_set_input!) {
    update_listings_by_pk(pk_columns: { id: $id }, _set: $changes) {
      id
    }
  }
`

const DELETE_LISTING_MUTATION = `
  mutation DeleteListing($id: uuid!) {
    delete_listings_by_pk(id: $id) {
      id
    }
  }
`

function normalizeListing(listing) {
  return {
    id: listing.id,
    title: listing.title || 'Untitled listing',
    listingType: listing.listing_type || 'sale',
    price: listing.price || 'Price on request',
    address: listing.address || 'Address pending',
    city: listing.city || '',
    state: listing.state || '',
    zipCode: listing.zip_code || '',
    beds: listing.beds ?? 0,
    baths: listing.baths ?? 0,
    sqft: listing.sqft ?? 0,
    description: listing.description || 'Listing details will be added soon.',
    coverImageUrl:
      listing.cover_image_url ||
      listing.gallery_image_urls?.[0] ||
      'https://images.unsplash.com/photo-1600607687644-c7f34b5f7c1f?auto=format&fit=crop&w=1200&q=80',
    galleryImageUrls: Array.isArray(listing.gallery_image_urls)
      ? listing.gallery_image_urls.filter(Boolean)
      : [],
    featured: Boolean(listing.featured),
    published: Boolean(listing.published),
    createdAt: listing.created_at || '',
    updatedAt: listing.updated_at || '',
  }
}

function toInteger(value) {
  if (value === '' || value === null || value === undefined) {
    return 0
  }

  const parsedValue = Number.parseInt(value, 10)
  return Number.isNaN(parsedValue) ? 0 : parsedValue
}

function toDecimal(value) {
  if (value === '' || value === null || value === undefined) {
    return 0
  }

  const parsedValue = Number.parseFloat(value)
  return Number.isNaN(parsedValue) ? 0 : parsedValue
}

function prepareListingInput(values) {
  const galleryImageUrls = Array.isArray(values.galleryImageUrls)
    ? values.galleryImageUrls.filter(Boolean)
    : Array.isArray(values.gallery_image_urls)
      ? values.gallery_image_urls.filter(Boolean)
      : []

  const coverImageUrl =
    values.coverImageUrl?.trim() ||
    values.cover_image_url?.trim() ||
    galleryImageUrls[0] ||
    null

  return {
    title: values.title?.trim() || 'Untitled listing',
    listing_type: values.listingType || values.listing_type || 'sale',
    price: values.price?.trim() || 'Price on request',
    address: values.address?.trim() || 'Address pending',
    city: values.city?.trim() || '',
    state: values.state?.trim() || 'VA',
    zip_code: values.zipCode?.trim() || values.zip_code?.trim() || null,
    beds: toInteger(values.beds),
    baths: toDecimal(values.baths),
    sqft: toInteger(values.sqft),
    description: values.description?.trim() || '',
    cover_image_url: coverImageUrl,
    gallery_image_urls: galleryImageUrls,
    featured: Boolean(values.featured),
    published: Boolean(values.published),
  }
}

function getErrorMessage(error) {
  if (error instanceof Error && error.message) {
    return error.message
  }

  return 'The request failed. Check that the listings table exists and that permissions are enabled for this temporary MVP.'
}

export async function getPublicListings() {
  if (!hasNhostConfig || !nhost) {
    return {
      listings: demoListings,
      source: 'demo',
      message: 'Nhost environment variables are missing, so demo listings are being shown.',
    }
  }

  try {
    const response = await nhost.graphql.request({
      query: LISTINGS_QUERY,
    })

    const listings = response.body.data?.listings?.map(normalizeListing) ?? []

    return {
      listings: listings.length ? listings : demoListings,
      source: listings.length ? 'nhost' : 'demo',
      message: listings.length
        ? ''
        : 'No published listings were found yet, so demo listings are being shown.',
    }
  } catch (error) {
    console.error('Failed to load listings from Nhost.', error)

    return {
      listings: demoListings,
      source: 'demo',
      message:
        'The Nhost listings table is not ready yet or public read access is blocked. Demo listings are being shown for now.',
    }
  }
}

export async function getAdminListings() {
  if (!hasNhostConfig || !nhost) {
    throw new Error('Nhost is not configured in the frontend environment.')
  }

  try {
    const response = await nhost.graphql.request({
      query: ADMIN_LISTINGS_QUERY,
    })

    return response.body.data?.listings?.map(normalizeListing) ?? []
  } catch (error) {
    throw new Error(getErrorMessage(error))
  }
}

export async function createListing(values) {
  if (!nhost) {
    throw new Error('Nhost is not configured in the frontend environment.')
  }

  try {
    await nhost.graphql.request({
      query: CREATE_LISTING_MUTATION,
      variables: {
        object: prepareListingInput(values),
      },
    })
  } catch (error) {
    throw new Error(getErrorMessage(error))
  }
}

export async function updateListing(id, values) {
  if (!nhost) {
    throw new Error('Nhost is not configured in the frontend environment.')
  }

  try {
    await nhost.graphql.request({
      query: UPDATE_LISTING_MUTATION,
      variables: {
        id,
        changes: prepareListingInput(values),
      },
    })
  } catch (error) {
    throw new Error(getErrorMessage(error))
  }
}

export async function deleteListing(id) {
  if (!nhost) {
    throw new Error('Nhost is not configured in the frontend environment.')
  }

  try {
    await nhost.graphql.request({
      query: DELETE_LISTING_MUTATION,
      variables: {
        id,
      },
    })
  } catch (error) {
    throw new Error(getErrorMessage(error))
  }
}
