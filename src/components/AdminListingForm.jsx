import { Plus, RotateCcw, Save, Trash2 } from 'lucide-react'

function AdminListingForm({
  formState,
  isEditing,
  saving,
  onChange,
  onGalleryImageUrlChange,
  onAddGalleryImageField,
  onRemoveGalleryImageField,
  onSubmit,
  onReset,
}) {
  const canAddAnotherImage =
    formState.galleryImageUrls.length < 5 &&
    Boolean(formState.galleryImageUrls[formState.galleryImageUrls.length - 1]?.trim())

  const previewUrls = formState.galleryImageUrls.filter(Boolean)

  return (
    <section className="admin-panel admin-panel--form">
      <div className="admin-panel__header">
        <div>
          <h2>{isEditing ? 'Edit Property' : 'Add Property'}</h2>
        </div>
      </div>

      <form className="admin-form" onSubmit={onSubmit}>
        <label>
          <span>Title</span>
          <input
            name="title"
            value={formState.title}
            onChange={onChange}
            placeholder="Wyndham Family Home"
            required
          />
        </label>

        <div className="admin-form__grid admin-form__grid--compact">
          <label>
            <span>Type</span>
            <select name="listingType" value={formState.listingType} onChange={onChange}>
              <option value="sale">For Sale</option>
              <option value="rent">For Rent</option>
              <option value="sold">Sold</option>
            </select>
          </label>

          <label>
            <span>Price</span>
            <input
              name="price"
              value={formState.price}
              onChange={onChange}
              placeholder="$485,000"
              required
            />
          </label>
        </div>

        <label>
          <span>Address</span>
          <input
            name="address"
            value={formState.address}
            onChange={onChange}
            placeholder="2847 Wyndham Dr"
            required
          />
        </label>

        <div className="admin-form__grid">
          <label>
            <span>City</span>
            <input
              name="city"
              value={formState.city}
              onChange={onChange}
              placeholder="Glen Allen"
            />
          </label>

          <label>
            <span>State</span>
            <input name="state" value={formState.state} onChange={onChange} placeholder="VA" />
          </label>

          <label>
            <span>Zip code</span>
            <input
              name="zipCode"
              value={formState.zipCode}
              onChange={onChange}
              placeholder="23060"
            />
          </label>
        </div>

        <div className="admin-form__grid">
          <label>
            <span>Beds</span>
            <input name="beds" type="number" min="0" value={formState.beds} onChange={onChange} />
          </label>

          <label>
            <span>Baths</span>
            <input
              name="baths"
              type="number"
              min="0"
              step="0.5"
              value={formState.baths}
              onChange={onChange}
            />
          </label>

          <label>
            <span>Sqft</span>
            <input name="sqft" type="number" min="0" value={formState.sqft} onChange={onChange} />
          </label>
        </div>

        <div className="admin-url-block">
          <div className="admin-url-block__header">
            <span>Listing image URLs</span>
            <small>Image 1 becomes the main cover image on the website. Max 5.</small>
          </div>

          <div className="admin-url-list">
            {formState.galleryImageUrls.map((imageUrl, index) => (
              <div className="admin-url-row" key={`gallery-url-${index}`}>
                <label>
                  <span>Image {index + 1} URL</span>
                  <input
                    type="url"
                    value={imageUrl}
                    onChange={(event) =>
                      onGalleryImageUrlChange(index, event.target.value)
                    }
                    placeholder="https://example.com/photo.jpg"
                  />
                </label>
                <button
                  className="button button--ghost"
                  type="button"
                  onClick={() => onRemoveGalleryImageField(index)}
                >
                  <Trash2 size={16} />
                  <span>Delete</span>
                </button>
              </div>
            ))}
          </div>

          <div className="admin-url-actions">
            <button
              className="button button--ghost"
              type="button"
              onClick={onAddGalleryImageField}
              disabled={!canAddAnotherImage}
            >
              <Plus size={16} />
              <span>Add another</span>
            </button>
          </div>
        </div>

        {previewUrls.length ? (
          <div className="admin-gallery">
            {previewUrls.map((imageUrl, index) => (
              <div className="admin-gallery__item" key={`${imageUrl}-${index}`}>
                <img src={imageUrl} alt={`Listing image ${index + 1}`} />
                <div className="admin-gallery__caption">Image {index + 1}</div>
              </div>
            ))}
          </div>
        ) : null}

        <label>
          <span>Description</span>
          <textarea
            name="description"
            rows="5"
            value={formState.description}
            onChange={onChange}
            placeholder="Short marketing description for the listing."
          />
        </label>

        <div className="admin-form__toggles">
          <label className="admin-toggle">
            <input
              name="featured"
              type="checkbox"
              checked={formState.featured}
              onChange={onChange}
            />
            <span>Featured</span>
          </label>

          <label className="admin-toggle">
            <input
              name="published"
              type="checkbox"
              checked={formState.published}
              onChange={onChange}
            />
            <span>Published</span>
          </label>
        </div>

        <div className="admin-form__actions">
          <button className="button button--primary" type="submit" disabled={saving}>
            <Save size={16} />
            <span>{saving ? 'Saving...' : isEditing ? 'Update Property' : 'Add Property'}</span>
          </button>
          <button
            className="button button--ghost"
            type="button"
            onClick={onReset}
            disabled={saving}
          >
            <RotateCcw size={16} />
            <span>Reset</span>
          </button>
        </div>
      </form>
    </section>
  )
}

export default AdminListingForm
