import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import AdminListingForm from '../components/AdminListingForm.jsx'
import AdminListingList from '../components/AdminListingList.jsx'
import { createListing, deleteListing, getAdminListings, updateListing } from '../lib/listingsApi.js'

const adminAccessKey = 'srg-admin-unlocked'
const adminInfoDismissKey = 'srg-admin-info-dismissed'

function createEmptyFormState() {
  return {
    title: '',
    listingType: 'sale',
    price: '',
    address: '',
    city: '',
    state: 'VA',
    zipCode: '',
    beds: '0',
    baths: '0',
    sqft: '0',
    galleryImageUrls: [''],
    description: '',
    featured: false,
    published: true,
  }
}

function toFormState(listing) {
  const galleryImageUrls =
    Array.isArray(listing.galleryImageUrls) && listing.galleryImageUrls.length
      ? listing.galleryImageUrls
      : listing.coverImageUrl
        ? [listing.coverImageUrl]
        : ['']

  return {
    title: listing.title || '',
    listingType: listing.listingType || 'sale',
    price: listing.price || '',
    address: listing.address || '',
    city: listing.city || '',
    state: listing.state || 'VA',
    zipCode: listing.zipCode || '',
    beds: String(listing.beds ?? 0),
    baths: String(listing.baths ?? 0),
    sqft: String(listing.sqft ?? 0),
    galleryImageUrls,
    description: listing.description || '',
    featured: Boolean(listing.featured),
    published: Boolean(listing.published),
  }
}

function AdminPage() {
  const [isUnlocked, setIsUnlocked] = useState(() => {
    return window.localStorage.getItem(adminAccessKey) === 'true'
  })
  const [showAdminInfo, setShowAdminInfo] = useState(() => {
    return window.localStorage.getItem(adminInfoDismissKey) !== 'true'
  })
  const [listings, setListings] = useState([])
  const [formState, setFormState] = useState(createEmptyFormState)
  const [editingId, setEditingId] = useState(null)
  const [isLoading, setIsLoading] = useState(false)
  const [isSaving, setIsSaving] = useState(false)
  const [errorMessage, setErrorMessage] = useState('')
  const [noticeMessage, setNoticeMessage] = useState('')

  useEffect(() => {
    if (!noticeMessage) {
      return undefined
    }

    const timeoutId = window.setTimeout(() => {
      setNoticeMessage('')
    }, 3200)

    return () => {
      window.clearTimeout(timeoutId)
    }
  }, [noticeMessage])

  useEffect(() => {
    if (!errorMessage) {
      return undefined
    }

    const timeoutId = window.setTimeout(() => {
      setErrorMessage('')
    }, 4200)

    return () => {
      window.clearTimeout(timeoutId)
    }
  }, [errorMessage])

  async function loadListings() {
    setIsLoading(true)
    setErrorMessage('')

    try {
      const nextListings = await getAdminListings()
      setListings(nextListings)
    } catch (error) {
      setErrorMessage(error instanceof Error ? error.message : 'Failed to load listings.')
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    if (!isUnlocked) {
      return
    }

    loadListings()
  }, [isUnlocked])

  function handleUnlock() {
    window.localStorage.setItem(adminAccessKey, 'true')
    setIsUnlocked(true)
  }

  function handleDismissAdminInfo() {
    window.localStorage.setItem(adminInfoDismissKey, 'true')
    setShowAdminInfo(false)
  }

  function handleChange(event) {
    const { name, value, type, checked } = event.target

    setFormState((currentState) => ({
      ...currentState,
      [name]: type === 'checkbox' ? checked : value,
    }))
  }

  function handleReset() {
    setEditingId(null)
    setFormState(createEmptyFormState())
    setNoticeMessage('')
  }

  function handleGalleryImageUrlChange(indexToUpdate, nextValue) {
    setFormState((currentState) => {
      const nextGallery = currentState.galleryImageUrls.map((imageUrl, index) =>
        index === indexToUpdate ? nextValue : imageUrl
      )

      return {
        ...currentState,
        galleryImageUrls: nextGallery,
      }
    })
  }

  function handleAddGalleryImageField() {
    setFormState((currentState) => {
      if (currentState.galleryImageUrls.length >= 5) {
        return currentState
      }

      const lastImageUrl =
        currentState.galleryImageUrls[currentState.galleryImageUrls.length - 1] || ''

      if (!lastImageUrl.trim()) {
        return currentState
      }

      return {
        ...currentState,
        galleryImageUrls: [...currentState.galleryImageUrls, ''],
      }
    })
  }

  function handleRemoveGalleryImageField(indexToRemove) {
    setFormState((currentState) => {
      const nextGallery = currentState.galleryImageUrls.filter(
        (_, index) => index !== indexToRemove
      )

      return {
        ...currentState,
        galleryImageUrls: nextGallery.length ? nextGallery : [''],
      }
    })
  }

  async function handleSubmit(event) {
    event.preventDefault()
    setIsSaving(true)
    setErrorMessage('')
    setNoticeMessage('')

    try {
      const nextValues = {
        ...formState,
      }

      if (editingId) {
        await updateListing(editingId, nextValues)
        setNoticeMessage('Listing updated.')
      } else {
        await createListing(nextValues)
        setNoticeMessage('Listing created.')
      }

      handleReset()
      await loadListings()
    } catch (error) {
      setErrorMessage(error instanceof Error ? error.message : 'Failed to save listing.')
    } finally {
      setIsSaving(false)
    }
  }

  function handleEdit(listing) {
    setEditingId(listing.id)
    setFormState(toFormState(listing))
    setNoticeMessage(`Editing "${listing.title}"`)
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  async function handleDelete(listing) {
    const shouldDelete = window.confirm(`Delete "${listing.title}"?`)

    if (!shouldDelete) {
      return
    }

    setErrorMessage('')
    setNoticeMessage('')

    try {
      await deleteListing(listing.id)
      if (editingId === listing.id) {
        handleReset()
      }
      setNoticeMessage('Listing deleted.')
      await loadListings()
    } catch (error) {
      setErrorMessage(error instanceof Error ? error.message : 'Failed to delete listing.')
    }
  }

  async function handleTogglePublished(listing) {
    setErrorMessage('')
    setNoticeMessage('')

    try {
      await updateListing(listing.id, {
        ...listing,
        published: !listing.published,
      })
      setNoticeMessage(
        listing.published ? 'Listing moved to draft.' : 'Listing published.'
      )
      await loadListings()
    } catch (error) {
      setErrorMessage(
        error instanceof Error ? error.message : 'Failed to update listing status.'
      )
    }
  }

  if (!isUnlocked) {
    return (
      <main className="admin-gate-shell">
        <button className="button button--admin-login" type="button" onClick={handleUnlock}>
          Login As Admin -&gt;
        </button>
      </main>
    )
  }

  return (
    <main className="admin-shell">
      <header className="admin-header">
        <div>
          <span className="section-heading__eyebrow">Temporary Admin</span>
          <h1>Listings control panel</h1>
          <p>
            This version uses a one-button local gate only. Backend permissions
            are intentionally open for local testing and must be locked down
            before any real deployment.
          </p>
        </div>

        <div className="admin-header__actions">
          <Link className="button button--ghost" to="/">
            View Website
          </Link>
          <button
            className="button button--ghost"
            type="button"
            onClick={() => {
              window.localStorage.removeItem(adminAccessKey)
              setIsUnlocked(false)
            }}
          >
            Exit Admin
          </button>
        </div>
      </header>

      {errorMessage ? <div className="status-banner status-banner--demo">{errorMessage}</div> : null}
      {noticeMessage ? <div className="status-banner status-banner--nhost">{noticeMessage}</div> : null}

      {showAdminInfo ? (
        <section className="admin-warning">
          <p>
            This admin currently depends on open `public` permissions for local
            testing. Setup details are saved in `nhost/SETUP.md`.
          </p>
          <button className="button button--ghost" type="button" onClick={handleDismissAdminInfo}>
            Dismiss
          </button>
        </section>
      ) : null}

      <div className="admin-layout">
        <AdminListingForm
          formState={formState}
          isEditing={Boolean(editingId)}
          saving={isSaving}
          onChange={handleChange}
          onGalleryImageUrlChange={handleGalleryImageUrlChange}
          onAddGalleryImageField={handleAddGalleryImageField}
          onRemoveGalleryImageField={handleRemoveGalleryImageField}
          onSubmit={handleSubmit}
          onReset={handleReset}
        />

        <AdminListingList
          listings={listings}
          loading={isLoading}
          onEdit={handleEdit}
          onDelete={handleDelete}
          onTogglePublished={handleTogglePublished}
          onRefresh={loadListings}
        />
      </div>
    </main>
  )
}

export default AdminPage
