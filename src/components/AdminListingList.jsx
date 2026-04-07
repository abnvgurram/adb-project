import { Eye, EyeOff, PencilLine, RefreshCw, Trash2 } from 'lucide-react'

function formatUpdatedAt(value) {
  if (!value) {
    return 'Just now'
  }

  const parsedDate = new Date(value)

  if (Number.isNaN(parsedDate.getTime())) {
    return value
  }

  return parsedDate.toLocaleString()
}

const listingTypeLabels = {
  sale: 'Sale',
  rent: 'Rent',
  sold: 'Sold',
}

function AdminListingList({
  listings,
  loading,
  onEdit,
  onDelete,
  onTogglePublished,
  onRefresh,
}) {
  return (
    <section className="admin-panel admin-panel--list">
      <div className="admin-panel__header">
        <div>
          <h2>Manage Properties</h2>
        </div>

        <button className="button button--ghost button--compact" type="button" onClick={onRefresh}>
          <RefreshCw size={16} />
          <span>Refresh</span>
        </button>
      </div>

      {loading ? (
        <div className="state-block">Loading listings...</div>
      ) : listings.length ? (
        <div className="admin-list">
          {listings.map((listing) => (
            <article className="admin-listing" key={listing.id}>
              <div className="admin-listing__body">
                <div className="admin-listing__topline">
                  <span className={`admin-type-pill admin-type-pill--${listing.listingType}`}>
                    {listingTypeLabels[listing.listingType] || 'Listing'}
                  </span>
                  <span className={listing.published ? 'admin-pill admin-pill--live' : 'admin-pill'}>
                    {listing.published ? 'Published' : 'Draft'}
                  </span>
                </div>

                <h3>{listing.title}</h3>
                <p className="admin-listing__location">
                  {[listing.address, listing.city, listing.state, listing.zipCode]
                    .filter(Boolean)
                    .join(', ')}
                </p>
                <div className="admin-listing__price">{listing.price}</div>
                <p className="admin-listing__meta">
                  {listing.beds} beds - {listing.baths} baths - {listing.sqft} sqft
                </p>
                <p className="admin-listing__updated">
                  Updated: {formatUpdatedAt(listing.updatedAt)}
                </p>
              </div>

              <div className="admin-listing__actions">
                <button className="button button--ghost" type="button" onClick={() => onEdit(listing)}>
                  <PencilLine size={16} />
                  <span>Edit</span>
                </button>
                <button
                  className="button button--ghost"
                  type="button"
                  onClick={() => onTogglePublished(listing)}
                >
                  {listing.published ? <EyeOff size={16} /> : <Eye size={16} />}
                  <span>{listing.published ? 'Unpublish' : 'Publish'}</span>
                </button>
                <button
                  className="button button--danger"
                  type="button"
                  onClick={() => onDelete(listing)}
                >
                  <Trash2 size={16} />
                  <span>Delete</span>
                </button>
              </div>
            </article>
          ))}
        </div>
      ) : (
        <div className="state-block">No listings found yet. Create the first one from the form.</div>
      )}
    </section>
  )
}

export default AdminListingList
