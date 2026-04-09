'use client'

import { useState, useEffect } from 'react'
import { X, Eye, EyeOff, Mail, Lock } from 'lucide-react'
import { useAuth } from '@/lib/auth-context'

interface AuthModalProps {
  isOpen: boolean
  onClose: () => void
  defaultTab?: 'login' | 'register'
}

export function AuthModal({ isOpen, onClose, defaultTab = 'login' }: AuthModalProps) {
  const { login, register } = useAuth()
  const [tab, setTab] = useState<'login' | 'register'>(defaultTab)
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPwd, setShowPwd] = useState(false)
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    setTab(defaultTab)
    setEmail('')
    setPassword('')
    setError('')
  }, [isOpen, defaultTab])

  useEffect(() => {
    if (!isOpen) return
    const onKey = (e: KeyboardEvent) => { if (e.key === 'Escape') onClose() }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [isOpen, onClose])

  if (!isOpen) return null

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setLoading(true)
    const res = tab === 'login'
      ? await login(email, password)
      : await register(email, password)
    setLoading(false)
    if (res.success) onClose()
    else setError(res.error ?? 'Ошибка')
  }

  return (
    <>
      <div className="fixed inset-0 bg-foreground/30 backdrop-blur-sm z-[60] animate-in fade-in duration-150" onClick={onClose} />
      <div
        className="fixed left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-md bg-white rounded-3xl shadow-2xl z-[60] p-8 animate-in zoom-in-95 duration-200"
        role="dialog"
        aria-modal="true"
        aria-label={tab === 'login' ? 'Вход' : 'Регистрация'}
      >
        <button
          onClick={onClose}
          className="absolute top-5 right-5 p-1.5 rounded-full text-muted-foreground hover:bg-secondary transition-colors"
          aria-label="Закрыть"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Brand */}
        <div className="flex items-center gap-2 mb-5">
          <div className="w-8 h-8 rounded-xl bg-primary flex items-center justify-center shadow-sm">
            <span className="text-white font-bold text-sm">S</span>
          </div>
          <span className="font-bold text-lg text-foreground">STAYZ</span>
        </div>

        <h2 className="text-2xl font-bold text-foreground mb-1">
          {tab === 'login' ? 'С возвращением!' : 'Создать аккаунт'}
        </h2>
        <p className="text-sm text-muted-foreground mb-6">
          {tab === 'login'
            ? 'Войдите чтобы увидеть сохранённые отели'
            : 'Регистрация займёт меньше минуты'}
        </p>

        {/* Tabs */}
        <div className="flex gap-1 bg-secondary p-1 rounded-xl mb-6">
          {(['login', 'register'] as const).map((t) => (
            <button
              key={t}
              onClick={() => { setTab(t); setError('') }}
              className={`flex-1 py-2 rounded-lg text-sm font-medium transition-all ${tab === t ? 'bg-white text-foreground shadow-sm' : 'text-muted-foreground hover:text-foreground'}`}
            >
              {t === 'login' ? 'Войти' : 'Регистрация'}
            </button>
          ))}
        </div>

        <form onSubmit={handleSubmit} className="space-y-3">
          <div className="relative">
            <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground pointer-events-none" />
            <input
              type="email"
              placeholder="Email"
              value={email}
              onChange={e => setEmail(e.target.value)}
              required
              autoComplete="email"
              className="w-full pl-10 pr-4 py-3.5 bg-secondary border border-border rounded-xl text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/25 focus:border-primary transition-all"
            />
          </div>

          <div className="relative">
            <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground pointer-events-none" />
            <input
              type={showPwd ? 'text' : 'password'}
              placeholder={tab === 'register' ? 'Пароль (мин. 6 символов)' : 'Пароль'}
              value={password}
              onChange={e => setPassword(e.target.value)}
              required
              autoComplete={tab === 'login' ? 'current-password' : 'new-password'}
              className="w-full pl-10 pr-11 py-3.5 bg-secondary border border-border rounded-xl text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/25 focus:border-primary transition-all"
            />
            <button
              type="button"
              onClick={() => setShowPwd(s => !s)}
              className="absolute right-3.5 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
              aria-label={showPwd ? 'Скрыть пароль' : 'Показать пароль'}
            >
              {showPwd ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
            </button>
          </div>

          {error && (
            <div className="bg-red-50 text-red-600 text-sm px-4 py-3 rounded-xl border border-red-100 animate-in fade-in duration-200">
              {error}
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-primary hover:bg-primary/90 active:scale-[0.98] disabled:opacity-60 text-white font-bold py-3.5 rounded-xl transition-all flex items-center justify-center gap-2 shadow-sm mt-2"
          >
            {loading
              ? <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              : tab === 'login' ? 'Войти' : 'Создать аккаунт'
            }
          </button>
        </form>

        <p className="text-center text-xs text-muted-foreground mt-5">
          Нажимая, вы соглашаетесь с{' '}
          <a href="#" className="text-primary hover:underline">условиями использования</a>
        </p>
      </div>
    </>
  )
}
