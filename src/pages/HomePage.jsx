import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import ListingCard from '../components/ListingCard.jsx'
import { getPublicListings } from '../lib/listingsApi.js'

const filterOptions = [
  { value: 'all', label: 'All Listings' },
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
    <main className="site-shell">
      <header className="site-header">
        <Link className="site-brand" to="/">
          <span className="site-brand__mark">SR</span>
          <span className="site-brand__text">
            <strong>Siris Realty Group</strong>
            <small>Listings that can be managed from one simple admin panel</small>
          </span>
        </Link>

        <nav className="site-nav">
          <a href="#listings">Listings</a>
          <a href="#contact">Contact</a>
          <Link className="site-nav__admin" to="/admin">
            Admin
          </Link>
        </nav>
      </header>

      <section className="hero-section">
        <div className="hero-section__content">
          <span className="hero-section__eyebrow">Richmond Metro Listings</span>
          <h1>Simple on the front. Editable from admin on the back.</h1>
          <p>
            The website stays focused on browsing listings. The admin route now
            handles create, update, publish, and delete actions against the
            same Nhost data source.
          </p>

          <div className="hero-section__actions">
            <a className="button button--primary" href="#listings">
              Browse Listings
            </a>
            <Link className="button button--ghost" to="/admin">
              Admin Route
            </Link>
          </div>

          <dl className="hero-section__stats">
            <div>
              <dt>Public Route</dt>
              <dd>/</dd>
            </div>
            <div>
              <dt>Admin Route</dt>
              <dd>/admin</dd>
            </div>
            <div>
              <dt>Source</dt>
              <dd>{source === 'nhost' ? 'Nhost Live' : 'Demo Data'}</dd>
            </div>
          </dl>
        </div>

        <aside className="hero-section__panel">
          <p className="hero-section__panel-label">Current setup</p>
          <ul>
            <li>Public home page at `/`</li>
            <li>Desktop layout widened and tightened</li>
            <li>Nhost-backed listings query already in use</li>
            <li>Admin CRUD starts from one login button</li>
            <li>Website re-checks listings while open</li>
          </ul>
        </aside>
      </section>

      <section className="listings-section" id="listings">
        <div className="section-heading">
          <div>
            <span className="section-heading__eyebrow">Featured Listings</span>
            <h2>Properties for buyers, tenants, and recent sale proof.</h2>
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
              <ListingCard key={listing.id} listing={listing} />
            ))}
          </div>
        ) : (
          <div className="state-block">No listings match this filter yet.</div>
        )}
      </section>

      <section className="contact-section" id="contact">
        <div>
          <span className="section-heading__eyebrow">Contact</span>
          <h2>Need a quick way to move listings from admin to live site?</h2>
          <p>
            This first phase keeps the public experience clean. Add or edit
            listings in the admin panel, and this page can pick them up from
            the same backend without code changes.
          </p>
        </div>

        <div className="contact-card">
          <a href="tel:8044266495">Call 804-426-6495</a>
          <a href="mailto:hello@sirisrealtygroup.com">hello@sirisrealtygroup.com</a>
          <Link to="/admin">Open admin route</Link>
        </div>
      </section>
    </main>
  )
}

export default HomePage
