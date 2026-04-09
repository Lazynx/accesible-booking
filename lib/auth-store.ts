export interface StoredUser {
  email: string
  passwordHash: string
  name: string
  favorites: number[]
  createdAt: string
}

const USERS_KEY = 'stayz_users'
const SESSION_KEY = 'stayz_session'

function simpleHash(str: string): string {
  let hash = 5381
  for (let i = 0; i < str.length; i++) {
    hash = ((hash << 5) + hash) ^ str.charCodeAt(i)
    hash = hash >>> 0
  }
  return hash.toString(36)
}

export function getUsers(): StoredUser[] {
  if (typeof window === 'undefined') return []
  try {
    const data = localStorage.getItem(USERS_KEY)
    return data ? JSON.parse(data) : []
  } catch {
    return []
  }
}

function saveUsers(users: StoredUser[]): void {
  localStorage.setItem(USERS_KEY, JSON.stringify(users))
}

export function getCurrentEmail(): string | null {
  if (typeof window === 'undefined') return null
  return localStorage.getItem(SESSION_KEY)
}

export function getCurrentUser(): StoredUser | null {
  const email = getCurrentEmail()
  if (!email) return null
  return getUsers().find(u => u.email === email) ?? null
}

export function login(email: string, password: string): { success: boolean; error?: string } {
  const user = getUsers().find(u => u.email.toLowerCase() === email.toLowerCase())
  if (!user) return { success: false, error: 'Пользователь не найден' }
  if (user.passwordHash !== simpleHash(password)) return { success: false, error: 'Неверный пароль' }
  localStorage.setItem(SESSION_KEY, user.email)
  return { success: true }
}

export function register(email: string, password: string): { success: boolean; error?: string } {
  if (!email.includes('@') || !email.includes('.')) return { success: false, error: 'Введите корректный email' }
  if (password.length < 6) return { success: false, error: 'Пароль — минимум 6 символов' }
  const users = getUsers()
  if (users.find(u => u.email.toLowerCase() === email.toLowerCase())) {
    return { success: false, error: 'Email уже зарегистрирован' }
  }
  const newUser: StoredUser = {
    email,
    passwordHash: simpleHash(password),
    name: email.split('@')[0],
    favorites: [],
    createdAt: new Date().toISOString(),
  }
  users.push(newUser)
  saveUsers(users)
  localStorage.setItem(SESSION_KEY, email)
  return { success: true }
}

export function logout(): void {
  localStorage.removeItem(SESSION_KEY)
}

export function toggleFavorite(hotelId: number): number[] {
  const email = getCurrentEmail()
  if (!email) return []
  const users = getUsers()
  const user = users.find(u => u.email === email)
  if (!user) return []
  const idx = user.favorites.indexOf(hotelId)
  if (idx === -1) user.favorites.push(hotelId)
  else user.favorites.splice(idx, 1)
  saveUsers(users)
  return [...user.favorites]
}
