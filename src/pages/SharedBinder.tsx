import { useState, useEffect } from 'react'
import { useParams, Link } from 'react-router-dom'
import { databases, DATABASE_ID, BINDERS_COLLECTION_ID, CARDS_COLLECTION_ID } from '../appwrite'
import { Query } from 'appwrite'
import { getTheme } from '../themes'

interface Card {
  $id: string
  name: string
  imageUrl: string | null
}

interface BinderData {
  $id: string
  name: string
  theme: string | null
}

export default function SharedBinder() {
  const { shareId } = useParams<{ shareId: string }>()
  const [binder, setBinder] = useState<BinderData | null>(null)
  const [cards, setCards] = useState<Card[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    if (!shareId) return
    databases.listDocuments(
      DATABASE_ID,
      BINDERS_COLLECTION_ID,
      [Query.equal('shareId', shareId)]
    )
      .then(async (res) => {
        if (res.documents.length === 0) {
          setError('This binder was not found. It might not be shared anymore.')
        } else {
          const b = res.documents[0] as unknown as BinderData
          setBinder(b)
          const cardsRes = await databases.listDocuments(
            DATABASE_ID,
            CARDS_COLLECTION_ID,
            [Query.equal('binder', b.$id), Query.orderDesc('$createdAt')]
          )
          setCards(cardsRes.documents as unknown as Card[])
        }
      })
      .catch(() => setError('Could not load this binder.'))
      .finally(() => setLoading(false))
  }, [shareId])

  if (loading) return <div className="loading-screen">Loading...</div>
  if (error) return (
    <div className="shared-page">
      <div className="auth-card">
        <h2>Oops!</h2>
        <p>{error}</p>
        <Link to="/" className="btn btn-primary">Go to MyStuffsBetter</Link>
      </div>
    </div>
  )
  if (!binder) return null

  const theme = getTheme(binder.theme)

  return (
    <div className={`shared-page theme-${binder.theme || 'classic'}`}>
      <div className="shared-header">
        <Link to="/login" className="brand-link">
          <span className="brand-icon">📁</span> MyStuffsBetter
        </Link>
        <h1>{binder.name}</h1>
        <p className="shared-subtitle">
          {theme.emoji} {theme.label} — Someone shared their binder with you!
        </p>
      </div>

      {cards.length === 0 ? (
        <div className="empty-state">
          <div className="empty-icon">🃏</div>
          <h2>No cards in this binder yet</h2>
          <p>Check back later — they might add more!</p>
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
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
