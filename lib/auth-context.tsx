'use client'

import { createContext, useContext, useState, useCallback, useEffect, type ReactNode } from 'react'
import * as store from './auth-store'
import type { StoredUser } from './auth-store'

interface AuthCtx {
  user: StoredUser | null
  ready: boolean
  login: (email: string, password: string) => Promise<{ success: boolean; error?: string }>
  register: (email: string, password: string) => Promise<{ success: boolean; error?: string }>
  logout: () => void
  favorites: number[]
  toggleFavorite: (hotelId: number) => void
  isFavorite: (hotelId: number) => boolean
}

const AuthContext = createContext<AuthCtx | null>(null)

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<StoredUser | null>(null)
  const [favorites, setFavorites] = useState<number[]>([])
  const [ready, setReady] = useState(false)

  useEffect(() => {
    const u = store.getCurrentUser()
    setUser(u)
    setFavorites(u?.favorites ?? [])
    setReady(true)
  }, [])

  const login = useCallback(async (email: string, password: string) => {
    const res = store.login(email, password)
    if (res.success) {
      const u = store.getCurrentUser()
      setUser(u)
      setFavorites(u?.favorites ?? [])
    }
    return res
  }, [])

  const register = useCallback(async (email: string, password: string) => {
    const res = store.register(email, password)
    if (res.success) {
      const u = store.getCurrentUser()
      setUser(u)
      setFavorites(u?.favorites ?? [])
    }
    return res
  }, [])

  const logout = useCallback(() => {
    store.logout()
    setUser(null)
    setFavorites([])
  }, [])

  const toggleFavorite = useCallback((hotelId: number) => {
    const updated = store.toggleFavorite(hotelId)
    setFavorites(updated)
  }, [])

  const isFavorite = useCallback((hotelId: number) => favorites.includes(hotelId), [favorites])

  return (
    <AuthContext.Provider value={{ user, ready, login, register, logout, favorites, toggleFavorite, isFavorite }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuth must be used within AuthProvider')
  return ctx
}
