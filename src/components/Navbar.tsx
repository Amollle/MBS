import { Link } from 'react-router-dom'
import { useAuth } from '../AuthContext'

export default function Navbar() {
  const { user, logout } = useAuth()

  return (
    <nav className="navbar">
      <Link to="/" className="navbar-brand">
        <span className="brand-icon">📁</span>
        <span className="brand-text">MyStuffsBetter</span>
      </Link>
      {user && (
        <div className="navbar-right">
          <span className="user-name">Hey, {user.name || user.email}!</span>
          <button onClick={logout} className="btn btn-ghost">Log out</button>
        </div>
      )}
    </nav>
  )
}
