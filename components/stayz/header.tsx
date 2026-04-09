'use client'

import { Globe, Heart, User, Menu } from 'lucide-react'
import { useLanguage } from '@/lib/language-context'
import type { Language } from '@/lib/translations'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { Button } from '@/components/ui/button'

const languages: { code: Language; label: string; flag: string }[] = [
  { code: 'ru', label: 'Русский', flag: '🇷🇺' },
  { code: 'kz', label: 'Қазақша', flag: '🇰🇿' },
  { code: 'en', label: 'English', flag: '🇬🇧' },
]

export function Header() {
  const { language, setLanguage, t } = useLanguage()

  const currentLang = languages.find(l => l.code === language)

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-white/95 backdrop-blur-md border-b border-border shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <a href="/" className="flex items-center gap-1.5 group">
            <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center shadow-sm group-hover:shadow-md transition-shadow">
              <span className="text-white font-bold text-sm">S</span>
            </div>
            <span className="text-xl font-bold text-foreground tracking-tight">
              STAYZ
            </span>
          </a>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-1">
            <a
              href="#hotels"
              className="px-4 py-2 text-sm font-medium text-muted-foreground hover:text-foreground hover:bg-secondary rounded-lg transition-all"
            >
              {t('hotels')}
            </a>
            <a
              href="#deals"
              className="px-4 py-2 text-sm font-medium text-muted-foreground hover:text-foreground hover:bg-secondary rounded-lg transition-all"
            >
              {t('deals')}
            </a>
            <a
              href="#favorites"
              className="px-4 py-2 text-sm font-medium text-muted-foreground hover:text-foreground hover:bg-secondary rounded-lg transition-all flex items-center gap-1.5"
            >
              <Heart className="w-3.5 h-3.5" />
              {t('favorites')}
            </a>
          </nav>

          {/* Right Side */}
          <div className="flex items-center gap-2">
            {/* Language Switcher */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="ghost"
                  size="sm"
                  className="text-muted-foreground hover:text-foreground hover:bg-secondary gap-2 font-normal"
                >
                  <Globe className="w-4 h-4" />
                  <span className="hidden sm:inline text-sm">{currentLang?.flag} {currentLang?.label}</span>
                  <span className="sm:hidden">{currentLang?.flag}</span>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="bg-white border-border shadow-lg">
                {languages.map((lang) => (
                  <DropdownMenuItem
                    key={lang.code}
                    onClick={() => setLanguage(lang.code)}
                    className={`cursor-pointer ${language === lang.code ? 'bg-accent text-primary font-medium' : 'text-foreground hover:bg-secondary'}`}
                  >
                    <span className="mr-2">{lang.flag}</span>
                    {lang.label}
                  </DropdownMenuItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>

            {/* Sign In */}
            <Button
              size="sm"
              className="bg-primary hover:bg-primary/90 text-white gap-2 shadow-sm"
            >
              <User className="w-4 h-4" />
              <span className="hidden sm:inline">{t('signIn')}</span>
            </Button>
          </div>
        </div>
      </div>
    </header>
  )
}
