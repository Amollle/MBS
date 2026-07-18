import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { databases, DATABASE_ID, BINDERS_COLLECTION_ID } from '../appwrite'
import { Query, Permission, Role } from 'appwrite'
import { useAuth } from '../AuthContext'

interface Binder {
  $id: string
  name: string
  shareId: string | null
  $createdAt: string
}

export default function Dashboard() {
  const { user } = useAuth()
  const [binders, setBinders] = useState<Binder[]>([])
  const [loading, setLoading] = useState(true)
  const [showCreate, setShowCreate] = useState(false)
  const [newName, setNewName] = useState('')
  const [creating, setCreating] = useState(false)

  const fetchBinders = async () => {
    if (!user) return
    try {
      const res = await databases.listDocuments(
        DATABASE_ID,
        BINDERS_COLLECTION_ID,
        [Query.equal('userId', user.$id), Query.orderDesc('$createdAt')]
      )
      setBinders(res.documents as unknown as Binder[])
    } catch (err) {
      console.error('Failed to load binders', err)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => { fetchBinders() }, [user])

  const createBinder = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!newName.trim() || !user) return
    setCreating(true)
    try {
      await databases.createDocument(
        DATABASE_ID,
        BINDERS_COLLECTION_ID,
        'unique()',
        { name: newName.trim(), userId: user.$id },
        [
          Permission.read(Role.any()),
          Permission.update(Role.user(user.$id)),
          Permission.delete(Role.user(user.$id)),
        ]
      )
      setNewName('')
      setShowCreate(false)
      fetchBinders()
    } catch (err) {
      console.error('Failed to create binder', err)
    } finally {
      setCreating(false)
    }
  }

  const deleteBinder = async (id: string) => {
    if (!confirm('Delete this binder and all its cards?')) return
    try {
      await databases.deleteDocument(DATABASE_ID, BINDERS_COLLECTION_ID, id)
      setBinders((prev) => prev.filter((b) => b.$id !== id))
    } catch (err) {
      console.error('Failed to delete binder', err)
    }
  }

  return (
    <div className="dashboard">
      <div className="dashboard-header">
        <h1>My Binders</h1>
        <button className="btn btn-primary" onClick={() => setShowCreate(true)}>
          + New Binder
        </button>
      </div>

      {showCreate && (
        <div className="create-binder-overlay" onClick={() => setShowCreate(false)}>
          <div className="create-binder-modal" onClick={(e) => e.stopPropagation()}>
            <h2>Name your binder</h2>
            <form onSubmit={createBinder}>
              <input
                type="text"
                value={newName}
                onChange={(e) => setNewName(e.target.value)}
                placeholder="e.g. My Pokemon Cards"
                autoFocus
                required
              />
              <div className="modal-actions">
                <button type="button" className="btn btn-ghost" onClick={() => setShowCreate(false)}>Cancel</button>
                <button type="submit" className="btn btn-primary" disabled={creating}>
                  {creating ? 'Creating...' : 'Create'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {loading ? (
        <div className="loading-screen">Loading your binders...</div>
      ) : binders.length === 0 ? (
        <div className="empty-state">
          <div className="empty-icon">📂</div>
          <h2>No binders yet!</h2>
          <p>Create your first binder to start adding cards.</p>
          <button className="btn btn-primary" onClick={() => setShowCreate(true)}>
            Create Your First Binder
          </button>
        </div>
      ) : (
        <div className="binder-grid">
          {binders.map((binder) => (
            <div key={binder.$id} className="binder-card">
              <Link to={`/binder/${binder.$id}`} className="binder-card-link">
                <div className="binder-card-icon">📁</div>
                <h3>{binder.name}</h3>
                <p className="binder-date">
                  Created {new Date(binder.$createdAt).toLocaleDateString()}
                </p>
              </Link>
              <button
                className="btn btn-danger-sm"
                onClick={(e) => { e.preventDefault(); deleteBinder(binder.$id) }}
                title="Delete binder"
              >
                🗑️
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
