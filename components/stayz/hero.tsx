'use client'

import { useLanguage } from '@/lib/language-context'
import { SearchBar } from './search-bar'

interface HeroProps {
  onSearch: (destination: string) => void
}

export function Hero({ onSearch }: HeroProps) {
  const { t } = useLanguage()

  return (
    <section className="relative min-h-[72vh] flex flex-col items-center justify-center px-4 pt-20 pb-16 hero-gradient">
      {/* Decorative blobs */}
      <div className="absolute top-12 left-1/4 w-72 h-72 bg-orange-100/60 rounded-full blur-3xl float-anim-slow pointer-events-none" />
      <div className="absolute bottom-16 right-1/4 w-56 h-56 bg-blue-100/50 rounded-full blur-3xl float-anim pointer-events-none" style={{ animationDelay: '2s' }} />
      <div className="absolute top-1/3 right-8 w-40 h-40 bg-purple-100/40 rounded-full blur-2xl float-anim pointer-events-none" style={{ animationDelay: '1s' }} />

      {/* Floating destination cards (decorative) */}
      <div className="absolute top-28 left-8 lg:left-24 hidden lg:block float-anim" style={{ animationDelay: '0.5s' }}>
        <div className="bg-white rounded-2xl shadow-lg px-4 py-3 flex items-center gap-3 border border-border/50">
          <div className="w-10 h-10 rounded-xl overflow-hidden bg-secondary flex-shrink-0">
            <div className="w-full h-full bg-gradient-to-br from-orange-200 to-red-200" />
          </div>
          <div>
            <div className="text-xs font-semibold text-foreground">Дубай</div>
            <div className="text-xs text-muted-foreground">от $120/ночь</div>
          </div>
        </div>
      </div>

      <div className="absolute top-40 right-8 lg:right-24 hidden lg:block float-anim-slow" style={{ animationDelay: '1.5s' }}>
        <div className="bg-white rounded-2xl shadow-lg px-4 py-3 flex items-center gap-3 border border-border/50">
          <div className="w-10 h-10 rounded-xl overflow-hidden bg-secondary flex-shrink-0">
            <div className="w-full h-full bg-gradient-to-br from-blue-200 to-indigo-200" />
          </div>
          <div>
            <div className="text-xs font-semibold text-foreground">Бали</div>
            <div className="text-xs text-muted-foreground">от $85/ночь</div>
          </div>
        </div>
      </div>

      {/* Accessible travel badge */}
      <div className="absolute bottom-32 left-8 lg:left-20 hidden lg:block float-anim" style={{ animationDelay: '3s' }}>
        <div className="bg-white rounded-2xl shadow-lg px-4 py-3 flex items-center gap-2 border border-border/50">
          <div className="w-7 h-7 rounded-lg bg-accessible-light flex items-center justify-center text-sm">♿</div>
          <div>
            <div className="text-xs font-semibold text-foreground">Доступный отдых</div>
            <div className="text-xs text-muted-foreground">124 отеля</div>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="relative z-[60] w-full max-w-4xl mx-auto text-center">
        <div className="hero-text-1">
          <span className="inline-block bg-accent text-primary text-xs font-semibold px-3 py-1.5 rounded-full mb-6 border border-primary/20">
            ✨ Более 200 отелей по всему миру
          </span>
        </div>

        <h1 className="hero-text-2 text-4xl sm:text-5xl md:text-6xl font-bold text-foreground mb-5 leading-tight tracking-tight">
          {t('heroTitle')}
        </h1>

        <p className="hero-text-3 text-lg text-muted-foreground mb-10 max-w-xl mx-auto">
          {t('heroSubtitle')}
        </p>

        <div className="hero-text-3">
          <SearchBar onSearch={(destination) => onSearch(destination)} />
        </div>

        {/* Popular destinations */}
        <div className="hero-text-3 flex items-center justify-center gap-2 mt-8 flex-wrap">
          <span className="text-sm text-muted-foreground">Популярные:</span>
          {[
            { ru: 'Дубай', en: 'Dubai' },
            { ru: 'Бали', en: 'Bali' },
            { ru: 'Барселона', en: 'Barcelona' },
            { ru: 'Токио', en: 'Tokyo' },
            { ru: 'Алматы', en: 'Almaty' },
          ].map((dest) => (
            <button
              key={dest.en}
              onClick={() => onSearch(dest.en)}
              className="text-sm font-medium text-primary hover:bg-accent px-3 py-1 rounded-full transition-all border border-primary/20 hover:border-primary/40"
            >
              {dest.ru}
            </button>
          ))}
        </div>
      </div>
    </section>
  )
}
