'use client'

import { useState, useMemo, useCallback, useEffect } from 'react'
import { LanguageProvider } from '@/lib/language-context'
import { AuthProvider } from '@/lib/auth-context'
import { hotels, type Hotel } from '@/lib/hotels-data'
import { Header } from '@/components/stayz/header'
import { Hero } from '@/components/stayz/hero'
import { FilterBar, type Filters } from '@/components/stayz/filter-bar'
import { HotelGrid } from '@/components/stayz/hotel-grid'
import { HotelDrawer } from '@/components/stayz/hotel-drawer'
import { Pagination } from '@/components/stayz/pagination'
import { AuthModal } from '@/components/stayz/auth-modal'
import { FavoritesView } from '@/components/stayz/favorites-view'
import { Shield, Tag, Clock, Accessibility } from 'lucide-react'

const HOTELS_PER_PAGE = 24

const defaultFilters: Filters = {
  stars: [],
  category: null,
  priceRange: [0, 800],
  sortBy: 'ratingDesc',
  amenities: [],
  accessibilityFeatures: [],
  accessibleOnly: false,
}

const accessibleCount = hotels.filter(h => h.accessibility.length > 0).length

function StayzApp() {
  const [searchQuery, setSearchQuery] = useState('')
  const [filters, setFilters] = useState<Filters>(defaultFilters)
  const [currentPage, setCurrentPage] = useState(1)
  const [selectedHotel, setSelectedHotel] = useState<Hotel | null>(null)
  const [loading, setLoading] = useState(true)
  const [authModal, setAuthModal] = useState<{ open: boolean; tab: 'login' | 'register' }>({ open: false, tab: 'login' })
  const [showFavorites, setShowFavorites] = useState(false)

  useEffect(() => {
    const timer = setTimeout(() => setLoading(false), 600)
    return () => clearTimeout(timer)
  }, [])

  const filteredHotels = useMemo(() => {
    let result = [...hotels]

    if (searchQuery) {
      const q = searchQuery.toLowerCase()
      result = result.filter(h =>
        h.name.toLowerCase().includes(q) ||
        h.city.toLowerCase().includes(q) ||
        h.country.toLowerCase().includes(q)
      )
    }

    if (filters.stars.length > 0) result = result.filter(h => filters.stars.includes(h.stars))
    if (filters.category) result = result.filter(h => h.category === filters.category)
    result = result.filter(h => h.pricePerNight >= filters.priceRange[0] && h.pricePerNight <= filters.priceRange[1])
    if (filters.amenities.length > 0) result = result.filter(h => filters.amenities.every(a => h.amenities.includes(a)))
    if (filters.accessibleOnly) result = result.filter(h => h.accessibility.length > 0)
    if (filters.accessibilityFeatures.length > 0) result = result.filter(h => filters.accessibilityFeatures.every(f => h.accessibility.includes(f)))

    switch (filters.sortBy) {
      case 'priceAsc': result.sort((a, b) => a.pricePerNight - b.pricePerNight); break
      case 'priceDesc': result.sort((a, b) => b.pricePerNight - a.pricePerNight); break
      case 'ratingDesc': result.sort((a, b) => b.rating - a.rating); break
      case 'reviewsDesc': result.sort((a, b) => b.reviewCount - a.reviewCount); break
    }
    return result
  }, [searchQuery, filters])

  const totalPages = Math.ceil(filteredHotels.length / HOTELS_PER_PAGE)
  const paginatedHotels = useMemo(() => {
    const start = (currentPage - 1) * HOTELS_PER_PAGE
    return filteredHotels.slice(start, start + HOTELS_PER_PAGE)
  }, [filteredHotels, currentPage])

  useEffect(() => setCurrentPage(1), [searchQuery, filters])

  const handleSearch = useCallback((destination: string) => {
    setSearchQuery(destination)
    setShowFavorites(false)
    const el = document.getElementById('hotels')
    el?.scrollIntoView({ behavior: 'smooth' })
  }, [])

  const handleHotelClick = useCallback((hotel: Hotel) => setSelectedHotel(hotel), [])
  const handleCloseDrawer = useCallback(() => setSelectedHotel(null), [])
  const handlePageChange = useCallback((page: number) => {
    setCurrentPage(page)
    document.getElementById('hotels')?.scrollIntoView({ behavior: 'smooth' })
  }, [])

  return (
    <div className="min-h-screen bg-background overflow-x-hidden">
      <Header
        onShowAuth={(tab) => setAuthModal({ open: true, tab: tab ?? 'login' })}
        onShowFavorites={() => setShowFavorites(s => !s)}
        showingFavorites={showFavorites}
      />

      <main>
        {!showFavorites && (
          <>
            <Hero onSearch={handleSearch} />

            {/* Trust bar */}
            <div className="bg-white border-b border-border py-3">
              <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex items-center justify-center gap-6 flex-wrap">
                  {[
                    { icon: <Shield className="w-4 h-4 text-emerald-500" />, text: 'Безопасное бронирование' },
                    { icon: <Tag className="w-4 h-4 text-primary" />, text: 'Гарантия лучшей цены' },
                    { icon: <Clock className="w-4 h-4 text-blue-500" />, text: 'Поддержка 24/7' },
                    { icon: <Accessibility className="w-4 h-4 text-accessible" />, text: `${accessibleCount} доступных отелей` },
                  ].map((item, i) => (
                    <div key={i} className="flex items-center gap-2 text-sm text-muted-foreground">
                      {item.icon}
                      <span>{item.text}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <section id="hotels" className="scroll-mt-16">
              <FilterBar
                filters={filters}
                onFiltersChange={setFilters}
                resultCount={filteredHotels.length}
              />

              <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                {/* Section header */}
                <div className="flex items-center justify-between mb-6">
                  <div>
                    <h2 className="text-xl font-bold text-foreground">
                      {searchQuery ? `Результаты: "${searchQuery}"` : 'Все отели'}
                    </h2>
                    <p className="text-sm text-muted-foreground mt-0.5">
                      {filteredHotels.length} отелей · 15 городов
                    </p>
                  </div>
                  {searchQuery && (
                    <button
                      onClick={() => setSearchQuery('')}
                      className="text-sm text-primary hover:underline"
                    >
                      Сбросить поиск
                    </button>
                  )}
                </div>

                <HotelGrid
                  hotels={paginatedHotels}
                  onHotelClick={handleHotelClick}
                  loading={loading}
                  onAuthRequired={() => setAuthModal({ open: true, tab: 'login' })}
                />

                <Pagination
                  currentPage={currentPage}
                  totalPages={totalPages}
                  onPageChange={handlePageChange}
                />
              </div>
            </section>
          </>
        )}

        {showFavorites && (
          <div className="pt-16">
            <FavoritesView
              onHotelClick={handleHotelClick}
              onShowAuth={() => setAuthModal({ open: true, tab: 'login' })}
              onBrowse={() => setShowFavorites(false)}
            />
          </div>
        )}
      </main>

      <HotelDrawer hotel={selectedHotel} onClose={handleCloseDrawer} />

      <AuthModal
        isOpen={authModal.open}
        onClose={() => setAuthModal(s => ({ ...s, open: false }))}
        defaultTab={authModal.tab}
      />

      {/* Footer */}
      <footer className="border-t border-border py-10 bg-secondary mt-6">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="flex items-center gap-2">
              <div className="w-7 h-7 rounded-lg bg-primary flex items-center justify-center">
                <span className="text-white font-bold text-xs">S</span>
              </div>
              <span className="text-lg font-bold text-foreground tracking-tight">STAYZ</span>
              <span className="text-muted-foreground text-sm">© 2026</span>
            </div>
            <div className="flex items-center gap-1 flex-wrap justify-center">
              {['Конфиденциальность', 'Условия', 'Доступность', 'Контакты'].map(link => (
                <a key={link} href="#" className="px-3 py-1.5 text-sm text-muted-foreground hover:text-foreground hover:bg-border/60 rounded-lg transition-all">
                  {link}
                </a>
              ))}
            </div>
            <div className="flex items-center gap-2 text-xs text-muted-foreground">
              <span className="w-5 h-5 rounded-full bg-accessible-light text-accessible flex items-center justify-center text-sm">♿</span>
              <span>Inclusive booking platform</span>
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
}

export default function Home() {
  return (
    <AuthProvider>
      <LanguageProvider>
        <StayzApp />
      </LanguageProvider>
    </AuthProvider>
  )
}
