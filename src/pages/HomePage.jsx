import { useEffect, useState } from 'react'
import ListingDetailsModal from '../components/ListingDetailsModal.jsx'
import ListingCard from '../components/ListingCard.jsx'
import SiteHeader from '../components/SiteHeader.jsx'
import { getPublicListings } from '../lib/listingsApi.js'

const filterOptions = [
  { value: 'all', label: 'All' },
  { value: 'sale', label: 'For Sale' },
  { value: 'rent', label: 'For Rent' },
  { value: 'sold', label: 'Sold' },
]

function HomePage() {
  const [activeFilter, setActiveFilter] = useState('all')
  const [listings, setListings] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  const [source, setSource] = useState('nhost')
  const [message, setMessage] = useState('')
  const [selectedListing, setSelectedListing] = useState(null)

  useEffect(() => {
    let ignore = false

    async function loadListings(shouldSetLoading = false) {
      if (shouldSetLoading) {
        setIsLoading(true)
      }

      const result = await getPublicListings()

      if (ignore) {
        return
      }

      setListings(result.listings)
      setSource(result.source)
      setMessage(result.message)
      setIsLoading(false)
    }

    loadListings(true)

    const intervalId = window.setInterval(() => {
      loadListings(false)
    }, 15000)

    const handleFocus = () => {
      loadListings(false)
    }

    window.addEventListener('focus', handleFocus)

    return () => {
      ignore = true
      window.clearInterval(intervalId)
      window.removeEventListener('focus', handleFocus)
    }
  }, [])

  const filteredListings =
    activeFilter === 'all'
      ? listings
      : listings.filter((listing) => listing.listingType === activeFilter)

  return (
    <>
      <SiteHeader actionLabel="Admin" actionTo="/admin" />

      <main className="site-shell site-shell--home">
        <section className="listings-section listings-section--home" id="listings">
          <div className="section-heading">
            <div>
              <h1>Properties</h1>
            </div>

            <div className="filter-bar" role="tablist" aria-label="Listing filter">
              {filterOptions.map((option) => (
                <button
                  key={option.value}
                  className={option.value === activeFilter ? 'is-active' : ''}
                  type="button"
                  onClick={() => setActiveFilter(option.value)}
                >
                  {option.label}
                </button>
              ))}
            </div>
          </div>

          {message ? (
            <div className={`status-banner status-banner--${source}`}>{message}</div>
          ) : null}

          {isLoading ? (
            <div className="state-block">Loading listings...</div>
          ) : filteredListings.length ? (
            <div className="listings-grid">
              {filteredListings.map((listing) => (
                <ListingCard
                  key={listing.id}
                  listing={listing}
                  onOpen={() => setSelectedListing(listing)}
                />
              ))}
            </div>
          ) : (
            <div className="state-block">No listings match this filter yet.</div>
          )}
        </section>
      </main>

      <ListingDetailsModal
        key={selectedListing?.id ?? 'listing-modal'}
        listing={selectedListing}
        onClose={() => setSelectedListing(null)}
      />
    </>
  )
}

export default HomePage
