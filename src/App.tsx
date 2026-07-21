import { Routes, Route, Navigate } from 'react-router-dom'
import { useAuth } from './AuthContext'
import Navbar from './components/Navbar'
import Home from './pages/Home'
import Login from './pages/Login'
import Signup from './pages/Signup'
import Dashboard from './pages/Dashboard'
import BinderView from './pages/BinderView'
import SharedBinder from './pages/SharedBinder'

function PrivateRoute({ children }: { children: React.ReactNode }) {
  const { user, loading } = useAuth()
  if (loading) return <div className="loading-screen">Loading...</div>
  return user ? <>{children}</> : <Navigate to="/login" />
}

export default function App() {
  const { user, loading } = useAuth()

  if (loading) return <div className="loading-screen">Loading...</div>

  return (
    <div className="app">
      <Navbar />
      <main className="main-content">
        <Routes>
          <Route path="/" element={user ? <Dashboard /> : <Home />} />
          <Route path="/login" element={user ? <Navigate to="/" /> : <Login />} />
          <Route path="/signup" element={user ? <Navigate to="/" /> : <Signup />} />
          <Route path="/binder/:id" element={<PrivateRoute><BinderView /></PrivateRoute>} />
          <Route path="/shared/:shareId" element={<SharedBinder />} />
          <Route path="*" element={<Navigate to="/" />} />
        </Routes>
      </main>
    </div>
  )
}
