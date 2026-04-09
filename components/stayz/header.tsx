'use client'

import { Globe, Heart, LogOut, User } from 'lucide-react'
import { useLanguage } from '@/lib/language-context'
import { useAuth } from '@/lib/auth-context'
import type { Language } from '@/lib/translations'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { Button } from '@/components/ui/button'

const languages: { code: Language; label: string; flag: string }[] = [
  { code: 'ru', label: 'Русский', flag: '🇷🇺' },
  { code: 'kz', label: 'Қазақша', flag: '🇰🇿' },
  { code: 'en', label: 'English', flag: '🇬🇧' },
]

interface HeaderProps {
  onShowAuth: (tab?: 'login' | 'register') => void
  onShowFavorites: () => void
  showingFavorites: boolean
}

export function Header({ onShowAuth, onShowFavorites, showingFavorites }: HeaderProps) {
  const { language, setLanguage, t } = useLanguage()
  const { user, logout, favorites } = useAuth()
  const currentLang = languages.find(l => l.code === language)

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-white/97 backdrop-blur-md border-b border-border shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">

          {/* Logo */}
          <a
            href="/"
            className="flex items-center gap-1.5 group"
            onClick={(e) => { if (showingFavorites) { e.preventDefault(); onShowFavorites() } }}
          >
            <div className="w-8 h-8 rounded-xl bg-primary flex items-center justify-center shadow-sm group-hover:shadow-md transition-shadow">
              <span className="text-white font-bold text-sm">S</span>
            </div>
            <span className="text-xl font-bold text-foreground tracking-tight">STAYZ</span>
          </a>

          {/* Nav */}
          <nav className="hidden md:flex items-center gap-1">
            <a
              href="#hotels"
              className={`px-4 py-2 text-sm font-medium rounded-lg transition-all ${showingFavorites ? 'text-muted-foreground hover:text-foreground hover:bg-secondary' : 'text-foreground bg-secondary'}`}
              onClick={(e) => { if (showingFavorites) { e.preventDefault(); onShowFavorites() } }}
            >
              {t('hotels')}
            </a>
            <button
              onClick={onShowFavorites}
              className={`px-4 py-2 text-sm font-medium rounded-lg transition-all flex items-center gap-1.5 ${showingFavorites ? 'text-primary bg-accent' : 'text-muted-foreground hover:text-foreground hover:bg-secondary'}`}
            >
              <Heart className={`w-3.5 h-3.5 ${showingFavorites ? 'fill-primary' : ''}`} />
              {t('favorites')}
              {favorites.length > 0 && (
                <span className="w-5 h-5 bg-primary text-white text-[10px] font-bold rounded-full flex items-center justify-center">
                  {favorites.length}
                </span>
              )}
            </button>
          </nav>

          {/* Right */}
          <div className="flex items-center gap-2">
            {/* Language */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="sm" className="text-muted-foreground hover:text-foreground hover:bg-secondary gap-2 font-normal">
                  <Globe className="w-4 h-4" />
                  <span className="hidden sm:inline text-sm">{currentLang?.flag} {currentLang?.label}</span>
                  <span className="sm:hidden">{currentLang?.flag}</span>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="bg-white border-border shadow-lg rounded-xl">
                {languages.map((lang) => (
                  <DropdownMenuItem
                    key={lang.code}
                    onClick={() => setLanguage(lang.code)}
                    className={`cursor-pointer rounded-lg ${language === lang.code ? 'bg-accent text-primary font-medium' : 'text-foreground hover:bg-secondary'}`}
                  >
                    <span className="mr-2">{lang.flag}</span>
                    {lang.label}
                  </DropdownMenuItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>

            {/* Auth */}
            {user ? (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <button className="flex items-center gap-2 px-3 py-2 rounded-xl border border-border hover:bg-secondary transition-all">
                    <div className="w-7 h-7 rounded-full bg-primary flex items-center justify-center">
                      <span className="text-white text-xs font-bold">
                        {user.name.slice(0, 1).toUpperCase()}
                      </span>
                    </div>
                    <span className="text-sm font-medium text-foreground hidden sm:block max-w-[100px] truncate">
                      {user.name}
                    </span>
                  </button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="bg-white border-border shadow-lg rounded-xl w-48">
                  <div className="px-3 py-2 border-b border-border">
                    <p className="text-xs font-semibold text-foreground truncate">{user.name}</p>
                    <p className="text-xs text-muted-foreground truncate">{user.email}</p>
                  </div>
                  <DropdownMenuItem
                    onClick={onShowFavorites}
                    className="cursor-pointer text-foreground hover:bg-secondary flex items-center gap-2 rounded-lg mt-1"
                  >
                    <Heart className="w-4 h-4" />
                    Избранное {favorites.length > 0 && `(${favorites.length})`}
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem
                    onClick={logout}
                    className="cursor-pointer text-red-500 hover:bg-red-50 flex items-center gap-2 rounded-lg"
                  >
                    <LogOut className="w-4 h-4" />
                    Выйти
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              <Button
                size="sm"
                className="bg-primary hover:bg-primary/90 text-white gap-2 shadow-sm"
                onClick={() => onShowAuth('login')}
              >
                <User className="w-4 h-4" />
                <span className="hidden sm:inline">{t('signIn')}</span>
              </Button>
            )}
          </div>
        </div>
      </div>
    </header>
  )
}
