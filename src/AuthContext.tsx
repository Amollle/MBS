import { createContext, useContext, useState, useEffect, type ReactNode } from 'react'
import { account } from './appwrite'
import type { Models } from 'appwrite'

interface AuthContextType {
  user: Models.User<Models.Preferences> | null
  loading: boolean
  login: (email: string, password: string) => Promise<void>
  signup: (email: string, password: string, name: string) => Promise<void>
  logout: () => Promise<void>
}

const AuthContext = createContext<AuthContextType | null>(null)

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<Models.User<Models.Preferences> | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    account.get()
      .then((u) => setUser(u))
      .catch(() => setUser(null))
      .finally(() => setLoading(false))
  }, [])

  const login = async (email: string, password: string) => {
    await account.createEmailPasswordSession(email, password)
    const u = await account.get()
    setUser(u)
  }

  const signup = async (email: string, password: string, name: string) => {
    await account.create('unique()', email, password, name)
    await account.createEmailPasswordSession(email, password)
    const u = await account.get()
    setUser(u)
  }

  const logout = async () => {
    await account.deleteSessions()
    setUser(null)
  }

  return (
    <AuthContext.Provider value={{ user, loading, login, signup, logout }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuth must be used within AuthProvider')
  return ctx
}
