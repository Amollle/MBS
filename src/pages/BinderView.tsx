import { useState, useEffect, useRef } from 'react'
import { useParams, Link } from 'react-router-dom'
import { databases, storage, APPWRITE_ENDPOINT, APPWRITE_PROJECT_ID, DATABASE_ID, BINDERS_COLLECTION_ID, CARDS_COLLECTION_ID, CARD_IMAGES_BUCKET_ID } from '../appwrite'
import { ID, Query, Permission, Role } from 'appwrite'
import { nanoid } from 'nanoid'
import { useAuth } from '../AuthContext'

interface Card {
  $id: string
  name: string
  imageUrl: string | null
}

interface BinderData {
  $id: string
  name: string
  shareId: string | null
}

export default function BinderView() {
  const { id } = useParams<{ id: string }>()
  const { user } = useAuth()
  const [binder, setBinder] = useState<BinderData | null>(null)
  const [cards, setCards] = useState<Card[]>([])
  const [loading, setLoading] = useState(true)
  const [showAddCard, setShowAddCard] = useState(false)
  const [cardName, setCardName] = useState('')
  const [cardFile, setCardFile] = useState<File | null>(null)
  const [addingCard, setAddingCard] = useState(false)
  const [shareLink, setShareLink] = useState('')
  const [copied, setCopied] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const fetchBinder = async () => {
    if (!id) return
    try {
      const [binderDoc, cardsDoc] = await Promise.all([
        databases.getDocument(DATABASE_ID, BINDERS_COLLECTION_ID, id),
        databases.listDocuments(DATABASE_ID, CARDS_COLLECTION_ID, [
          Query.equal('binder', id),
          Query.orderDesc('$createdAt'),
        ]),
      ])
      setBinder(binderDoc as unknown as BinderData)
      setCards(cardsDoc.documents as unknown as Card[])
    } catch (err) {
      console.error('Failed to load binder', err)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => { fetchBinder() }, [id])

  const addCard = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!cardName.trim() || !id || !user) return
    setAddingCard(true)
    try {
      let imageUrl: string | null = null
      if (cardFile) {
        const fileId = ID.unique()
        await storage.createFile(CARD_IMAGES_BUCKET_ID, fileId, cardFile)
        imageUrl = `${APPWRITE_ENDPOINT}/storage/buckets/${CARD_IMAGES_BUCKET_ID}/files/${fileId}/view?project=${APPWRITE_PROJECT_ID}`
      }
      await databases.createDocument(
        DATABASE_ID,
        CARDS_COLLECTION_ID,
        'unique()',
        { name: cardName.trim(), imageUrl, binder: id },
        [
          Permission.read(Role.any()),
          Permission.update(Role.user(user.$id)),
          Permission.delete(Role.user(user.$id)),
        ]
      )
      setCardName('')
      setCardFile(null)
      if (fileInputRef.current) fileInputRef.current.value = ''
      setShowAddCard(false)
      fetchBinder()
    } catch (err) {
      console.error('Failed to add card', err)
    } finally {
      setAddingCard(false)
    }
  }

  const deleteCard = async (cardId: string) => {
    if (!confirm('Remove this card?')) return
    try {
      await databases.deleteDocument(DATABASE_ID, CARDS_COLLECTION_ID, cardId)
      setCards((prev) => prev.filter((c) => c.$id !== cardId))
    } catch (err) {
      console.error('Failed to delete card', err)
    }
  }

  const generateShareLink = async () => {
    if (!binder || !id) return
    if (binder.shareId) {
      const link = `${window.location.origin}/shared/${binder.shareId}`
      setShareLink(link)
      return
    }
    try {
      const newShareId = nanoid(12)
      await databases.updateDocument(DATABASE_ID, BINDERS_COLLECTION_ID, id, { shareId: newShareId })
      const link = `${window.location.origin}/shared/${newShareId}`
      setShareLink(link)
      setBinder((prev) => prev ? { ...prev, shareId: newShareId } : prev)
    } catch (err) {
      console.error('Failed to generate share link', err)
    }
  }

  const copyLink = async () => {
    if (!shareLink) return
    await navigator.clipboard.writeText(shareLink)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  if (loading) return <div className="loading-screen">Loading binder...</div>
  if (!binder) return <div className="loading-screen">Binder not found. <Link to="/">Go back</Link></div>

  return (
    <div className="binder-view">
      <div className="binder-header">
        <Link to="/" className="back-link">← Back to binders</Link>
        <h1>{binder.name}</h1>
        <div className="binder-actions">
          <button className="btn btn-secondary" onClick={generateShareLink}>
            🔗 Share
          </button>
          <button className="btn btn-primary" onClick={() => setShowAddCard(true)}>
            + Add Card
          </button>
        </div>
      </div>

      {shareLink && (
        <div className="share-bar">
          <input type="text" readOnly value={shareLink} className="share-input" />
          <button className="btn btn-primary" onClick={copyLink}>
            {copied ? '✓ Copied!' : 'Copy'}
          </button>
        </div>
      )}

      {showAddCard && (
        <div className="create-binder-overlay" onClick={() => setShowAddCard(false)}>
          <div className="create-binder-modal" onClick={(e) => e.stopPropagation()}>
            <h2>Add a new card</h2>
            <form onSubmit={addCard}>
              <label>Card name</label>
              <input
                type="text"
                value={cardName}
                onChange={(e) => setCardName(e.target.value)}
                placeholder="e.g. Charizard"
                autoFocus
                required
              />
              <label>Picture (optional)</label>
              <input
                type="file"
                accept="image/*"
                ref={fileInputRef}
                onChange={(e) => setCardFile(e.target.files?.[0] || null)}
              />
              <div className="modal-actions">
                <button type="button" className="btn btn-ghost" onClick={() => setShowAddCard(false)}>Cancel</button>
                <button type="submit" className="btn btn-primary" disabled={addingCard}>
                  {addingCard ? 'Adding...' : 'Add Card'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {cards.length === 0 ? (
        <div className="empty-state">
          <div className="empty-icon">🃏</div>
          <h2>No cards yet!</h2>
          <p>Add your first card to this binder.</p>
          <button className="btn btn-primary" onClick={() => setShowAddCard(true)}>
            Add Your First Card
          </button>
        </div>
      ) : (
        <div className="card-grid">
          {cards.map((card) => (
            <div key={card.$id} className="card-item">
              <div className="card-image-wrapper">
                {card.imageUrl ? (
                  <img src={card.imageUrl} alt={card.name} />
                ) : (
                  <div className="card-placeholder">🃏</div>
                )}
              </div>
              <div className="card-info">
                <h4>{card.name}</h4>
                <button className="btn btn-danger-sm" onClick={() => deleteCard(card.$id)} title="Remove card">
                  🗑️
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
