import { useEffect, useId, useState } from 'react'
import {
  Bath,
  BedDouble,
  ChevronLeft,
  ChevronRight,
  MapPin,
  Ruler,
  X,
} from 'lucide-react'

const statusMap = {
  sale: 'For Sale',
  rent: 'For Rent',
  sold: 'Sold',
}

function formatLocation({ address, city, state, zipCode }) {
  return [address, city, state, zipCode].filter(Boolean).join(', ')
}

function ListingDetailsModal({ listing, onClose }) {
  const [activeIndex, setActiveIndex] = useState(0)
  const titleId = useId()

  useEffect(() => {
    if (!listing) {
      return undefined
    }

    const previousOverflow = document.body.style.overflow
    document.body.style.overflow = 'hidden'

    function handleKeyDown(event) {
      if (event.key === 'Escape') {
        onClose()
      }
    }

    window.addEventListener('keydown', handleKeyDown)

    return () => {
      document.body.style.overflow = previousOverflow
      window.removeEventListener('keydown', handleKeyDown)
    }
  }, [listing, onClose])

  if (!listing) {
    return null
  }

  const galleryImages =
    listing.galleryImageUrls?.length ? listing.galleryImageUrls : [listing.coverImageUrl].filter(Boolean)
  const photoCount = galleryImages.length
  const currentImage = galleryImages[activeIndex] || listing.coverImageUrl

  function handleBackdropClick(event) {
    if (event.target === event.currentTarget) {
      onClose()
    }
  }

  function goToIndex(nextIndex) {
    setActiveIndex(Math.max(0, Math.min(nextIndex, photoCount - 1)))
  }

  return (
    <div
      className="listing-modal"
      role="presentation"
      onClick={handleBackdropClick}
    >
      <div
        className="listing-modal__dialog"
        role="dialog"
        aria-modal="true"
        aria-labelledby={titleId}
      >
        <button
          className="button button--ghost button--icon-only listing-modal__close"
          type="button"
          onClick={onClose}
          aria-label="Close property details"
        >
          <X size={18} />
        </button>

        <div className="listing-modal__media">
          <div className="listing-modal__image-wrap">
            {currentImage ? (
              <img
                className="listing-modal__image"
                src={currentImage}
                alt={`${listing.title} ${activeIndex + 1}`}
              />
            ) : null}

            {photoCount > 1 ? (
              <div className="listing-modal__gallery-ui">
                <button
                  className="button button--ghost button--icon-only listing-modal__arrow"
                  type="button"
                  onClick={() => goToIndex(activeIndex - 1)}
                  disabled={activeIndex === 0}
                  aria-label="Previous property photo"
                >
                  <ChevronLeft size={18} />
                </button>
                <span className="listing-modal__count">
                  {activeIndex + 1} / {photoCount}
                </span>
                <button
                  className="button button--ghost button--icon-only listing-modal__arrow"
                  type="button"
                  onClick={() => goToIndex(activeIndex + 1)}
                  disabled={activeIndex === photoCount - 1}
                  aria-label="Next property photo"
                >
                  <ChevronRight size={18} />
                </button>
              </div>
            ) : null}
          </div>

          {photoCount > 1 ? (
            <div className="listing-modal__thumbs" aria-label="Property gallery thumbnails">
              {galleryImages.map((imageUrl, index) => (
                <button
                  key={`${listing.id}-thumb-${index}`}
                  className={
                    index === activeIndex
                      ? 'listing-modal__thumb is-active'
                      : 'listing-modal__thumb'
                  }
                  type="button"
                  onClick={() => goToIndex(index)}
                  aria-label={`Show property photo ${index + 1}`}
                >
                  <img src={imageUrl} alt="" />
                </button>
              ))}
            </div>
          ) : null}
        </div>

        <div className="listing-modal__content">
          <span className={`listing-card__badge listing-card__badge--${listing.listingType}`}>
            {statusMap[listing.listingType] || 'Listing'}
          </span>
          <h2 id={titleId}>{listing.title}</h2>
          <div className="listing-modal__price">{listing.price}</div>

          <p className="listing-modal__location">
            <MapPin size={16} />
            <span>{formatLocation(listing)}</span>
          </p>

          <div className="listing-modal__stats">
            <div>
              <BedDouble size={18} />
              <span>{listing.beds || '-'} Beds</span>
            </div>
            <div>
              <Bath size={18} />
              <span>{listing.baths || '-'} Baths</span>
            </div>
            <div>
              <Ruler size={18} />
              <span>{listing.sqft || '-'} Sqft</span>
            </div>
          </div>

          <div className="listing-modal__description">
            <h3>About this property</h3>
            <p>{listing.description}</p>
          </div>
        </div>
      </div>
    </div>
  )
}

export default ListingDetailsModal
