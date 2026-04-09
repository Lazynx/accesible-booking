'use client'

import { useState, useMemo, useCallback, useEffect } from 'react'
import { LanguageProvider } from '@/lib/language-context'
import { hotels, type Hotel } from '@/lib/hotels-data'
import { Header } from '@/components/stayz/header'
import { Hero } from '@/components/stayz/hero'
import { FilterBar, type Filters, type SortOption } from '@/components/stayz/filter-bar'
import { HotelGrid } from '@/components/stayz/hotel-grid'
import { HotelDrawer } from '@/components/stayz/hotel-drawer'
import { Pagination } from '@/components/stayz/pagination'

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

function StayzApp() {
  const [searchQuery, setSearchQuery] = useState('')
  const [filters, setFilters] = useState<Filters>(defaultFilters)
  const [currentPage, setCurrentPage] = useState(1)
  const [selectedHotel, setSelectedHotel] = useState<Hotel | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const timer = setTimeout(() => setLoading(false), 800)
    return () => clearTimeout(timer)
  }, [])

  const filteredHotels = useMemo(() => {
    let result = [...hotels]

    if (searchQuery) {
      const query = searchQuery.toLowerCase()
      result = result.filter(hotel =>
        hotel.name.toLowerCase().includes(query) ||
        hotel.city.toLowerCase().includes(query) ||
        hotel.country.toLowerCase().includes(query)
      )
    }

    if (filters.stars.length > 0) {
      result = result.filter(hotel => filters.stars.includes(hotel.stars))
    }

    if (filters.category) {
      result = result.filter(hotel => hotel.category === filters.category)
    }

    result = result.filter(hotel =>
      hotel.pricePerNight >= filters.priceRange[0] &&
      hotel.pricePerNight <= filters.priceRange[1]
    )

    if (filters.amenities.length > 0) {
      result = result.filter(hotel =>
        filters.amenities.every(amenity => hotel.amenities.includes(amenity))
      )
    }

    // Accessibility filters
    if (filters.accessibleOnly) {
      result = result.filter(hotel => hotel.accessibility.length > 0)
    }
    if (filters.accessibilityFeatures.length > 0) {
      result = result.filter(hotel =>
        filters.accessibilityFeatures.every(f => hotel.accessibility.includes(f))
      )
    }

    switch (filters.sortBy) {
      case 'priceAsc':
        result.sort((a, b) => a.pricePerNight - b.pricePerNight)
        break
      case 'priceDesc':
        result.sort((a, b) => b.pricePerNight - a.pricePerNight)
        break
      case 'ratingDesc':
        result.sort((a, b) => b.rating - a.rating)
        break
      case 'reviewsDesc':
        result.sort((a, b) => b.reviewCount - a.reviewCount)
        break
    }

    return result
  }, [searchQuery, filters])

  const totalPages = Math.ceil(filteredHotels.length / HOTELS_PER_PAGE)

  const paginatedHotels = useMemo(() => {
    const start = (currentPage - 1) * HOTELS_PER_PAGE
    return filteredHotels.slice(start, start + HOTELS_PER_PAGE)
  }, [filteredHotels, currentPage])

  useEffect(() => {
    setCurrentPage(1)
  }, [searchQuery, filters])

  const handleSearch = useCallback((destination: string) => {
    setSearchQuery(destination)
    const hotelsSection = document.getElementById('hotels')
    if (hotelsSection) {
      hotelsSection.scrollIntoView({ behavior: 'smooth' })
    }
  }, [])

  const handleFiltersChange = useCallback((newFilters: Filters) => {
    setFilters(newFilters)
  }, [])

  const handleHotelClick = useCallback((hotel: Hotel) => {
    setSelectedHotel(hotel)
  }, [])

  const handleCloseDrawer = useCallback(() => {
    setSelectedHotel(null)
  }, [])

  const handlePageChange = useCallback((page: number) => {
    setCurrentPage(page)
    const hotelsSection = document.getElementById('hotels')
    if (hotelsSection) {
      hotelsSection.scrollIntoView({ behavior: 'smooth' })
    }
  }, [])

  return (
    <div className="min-h-screen bg-background">
      <Header />

      <main>
        <Hero onSearch={handleSearch} />

        <section id="hotels" className="scroll-mt-16">
          <FilterBar
            filters={filters}
            onFiltersChange={handleFiltersChange}
            resultCount={filteredHotels.length}
          />

          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <HotelGrid
              hotels={paginatedHotels}
              onHotelClick={handleHotelClick}
              loading={loading}
            />

            <Pagination
              currentPage={currentPage}
              totalPages={totalPages}
              onPageChange={handlePageChange}
            />
          </div>
        </section>
      </main>

      <HotelDrawer
        hotel={selectedHotel}
        onClose={handleCloseDrawer}
      />

      {/* Footer */}
      <footer className="border-t border-border py-10 mt-4 bg-secondary">
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
              {['Privacy Policy', 'Terms of Service', 'Accessibility', 'Contact'].map((link) => (
                <a
                  key={link}
                  href="#"
                  className="px-3 py-1.5 text-sm text-muted-foreground hover:text-foreground hover:bg-border/60 rounded-lg transition-all"
                >
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
    <LanguageProvider>
      <StayzApp />
    </LanguageProvider>
  )
}
