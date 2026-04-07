import { useRef, useState } from 'react'
import { ChevronLeft, ChevronRight } from 'lucide-react'

const statusMap = {
  sale: 'For Sale',
  rent: 'For Rent',
  sold: 'Sold',
}

function formatLocation({ address, city, state, zipCode }) {
  return [address, city, state, zipCode].filter(Boolean).join(', ')
}

function formatMetric(value, label) {
  if (!value) {
    return `- ${label}`
  }

  return `${value} ${label}`
}

function ListingCard({ listing, onOpen }) {
  const galleryImages =
    listing.galleryImageUrls?.length
      ? listing.galleryImageUrls
      : [listing.coverImageUrl].filter(Boolean)
  const photoCount = galleryImages.length
  const [activeIndex, setActiveIndex] = useState(0)
  const trackRef = useRef(null)
  const currentIndex = Math.min(activeIndex, Math.max(photoCount - 1, 0))

  function scrollToIndex(nextIndex) {
    if (!trackRef.current) {
      return
    }

    const boundedIndex = Math.max(0, Math.min(nextIndex, photoCount - 1))
    const nextLeft = boundedIndex * trackRef.current.clientWidth

    trackRef.current.scrollTo({
      left: nextLeft,
      behavior: 'smooth',
    })

    setActiveIndex(boundedIndex)
  }

  function handleScroll() {
    if (!trackRef.current) {
      return
    }

    const { scrollLeft, clientWidth } = trackRef.current

    if (!clientWidth) {
      return
    }

    const nextIndex = Math.round(scrollLeft / clientWidth)
    setActiveIndex(Math.max(0, Math.min(nextIndex, photoCount - 1)))
  }

  function handleOpen() {
    onOpen?.()
  }

  function handleKeyDown(event) {
    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault()
      handleOpen()
    }
  }

  return (
    <article
      className={`listing-card${onOpen ? ' listing-card--interactive' : ''}`}
      role={onOpen ? 'button' : undefined}
      tabIndex={onOpen ? 0 : undefined}
      onClick={handleOpen}
      onKeyDown={handleKeyDown}
    >
      <div className="listing-card__media">
        <div
          key={`${listing.id}-${photoCount}-${listing.coverImageUrl}`}
          className={`listing-card__gallery${photoCount > 1 ? ' listing-card__gallery--interactive' : ''}`}
          ref={trackRef}
          onScroll={handleScroll}
        >
          {galleryImages.map((imageUrl, index) => (
            <div className="listing-card__slide" key={`${listing.id}-${index}`}>
              <img src={imageUrl} alt={`${listing.title} ${index + 1}`} draggable="false" />
            </div>
          ))}
        </div>

        <span className={`listing-card__badge listing-card__badge--${listing.listingType}`}>
          {statusMap[listing.listingType] || 'Listing'}
        </span>

        {photoCount > 1 ? (
          <div className="listing-card__gallery-ui">
            <span className="listing-card__count">
              {currentIndex + 1} / {photoCount}
            </span>

            <div className="listing-card__arrows" aria-label="Listing photos">
              <button
                type="button"
                className="listing-card__arrow"
                onClick={(event) => {
                  event.stopPropagation()
                  scrollToIndex(currentIndex - 1)
                }}
                disabled={currentIndex === 0}
                aria-label="Previous photo"
              >
                <ChevronLeft size={18} />
              </button>
              <button
                type="button"
                className="listing-card__arrow"
                onClick={(event) => {
                  event.stopPropagation()
                  scrollToIndex(currentIndex + 1)
                }}
                disabled={currentIndex === photoCount - 1}
                aria-label="Next photo"
              >
                <ChevronRight size={18} />
              </button>
            </div>
          </div>
        ) : null}
      </div>

      <div className="listing-card__body">
        <div className="listing-card__eyebrow">{formatLocation(listing)}</div>
        <h3>{listing.title}</h3>
        <div className="listing-card__price">{listing.price}</div>
        <p>{listing.description}</p>

        <div className="listing-card__meta">
          <span>{formatMetric(listing.beds, 'Beds')}</span>
          <span>{formatMetric(listing.baths, 'Baths')}</span>
          <span>{formatMetric(listing.sqft, 'Sqft')}</span>
        </div>
      </div>
    </article>
  )
}

export default ListingCard
