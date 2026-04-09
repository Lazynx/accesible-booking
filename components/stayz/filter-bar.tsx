'use client'

import { useState } from 'react'
import { Star, SlidersHorizontal, ChevronDown, X } from 'lucide-react'
import { useLanguage } from '@/lib/language-context'
import type { HotelCategory, Amenity, AccessibilityFeature } from '@/lib/hotels-data'
import { Button } from '@/components/ui/button'
import { Slider } from '@/components/ui/slider'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover'
import { Checkbox } from '@/components/ui/checkbox'

export type SortOption = 'priceAsc' | 'priceDesc' | 'ratingDesc' | 'reviewsDesc'

export interface Filters {
  stars: number[]
  category: HotelCategory | null
  priceRange: [number, number]
  sortBy: SortOption
  amenities: Amenity[]
  accessibilityFeatures: AccessibilityFeature[]
  accessibleOnly: boolean
}

interface FilterBarProps {
  filters: Filters
  onFiltersChange: (filters: Filters) => void
  resultCount: number
}

const allAmenities: Amenity[] = [
  'Pool', 'Spa', 'Gym', 'WiFi', 'Restaurant', 'Bar',
  'Parking', 'Beach Access', 'Rooftop', 'Pet Friendly', 'Airport Shuttle'
]

const allAccessibilityFeatures: AccessibilityFeature[] = [
  'Wheelchair Accessible',
  'Accessible Bathroom',
  'Braille Signage',
  'Audio Guides',
  'Hearing Loop',
  'Sign Language Staff',
  'Accessible Parking',
  'Step-Free Access',
  'Visual Alerts',
  'Large Print Menus',
]

const categories: (HotelCategory | null)[] = [null, 'Boutique', 'Resort', 'Business', 'Hostel', 'Villa']

const accessibilityIcons: Record<AccessibilityFeature, string> = {
  'Wheelchair Accessible': '♿',
  'Accessible Bathroom': '🚿',
  'Braille Signage': '👆',
  'Audio Guides': '🎧',
  'Hearing Loop': '👂',
  'Sign Language Staff': '🤟',
  'Accessible Parking': '🅿️',
  'Step-Free Access': '🚶',
  'Visual Alerts': '🔔',
  'Large Print Menus': '📋',
}

export function FilterBar({ filters, onFiltersChange, resultCount }: FilterBarProps) {
  const { t } = useLanguage()
  const [priceRange, setPriceRange] = useState<[number, number]>(filters.priceRange)

  const toggleStar = (star: number) => {
    const newStars = filters.stars.includes(star)
      ? filters.stars.filter(s => s !== star)
      : [...filters.stars, star]
    onFiltersChange({ ...filters, stars: newStars })
  }

  const setCategory = (category: HotelCategory | null) => {
    onFiltersChange({ ...filters, category })
  }

  const setSortBy = (sortBy: SortOption) => {
    onFiltersChange({ ...filters, sortBy })
  }

  const toggleAmenity = (amenity: Amenity) => {
    const newAmenities = filters.amenities.includes(amenity)
      ? filters.amenities.filter(a => a !== amenity)
      : [...filters.amenities, amenity]
    onFiltersChange({ ...filters, amenities: newAmenities })
  }

  const toggleAccessibilityFeature = (feature: AccessibilityFeature) => {
    const current = filters.accessibilityFeatures
    const updated = current.includes(feature)
      ? current.filter(f => f !== feature)
      : [...current, feature]
    onFiltersChange({ ...filters, accessibilityFeatures: updated })
  }

  const toggleAccessibleOnly = () => {
    onFiltersChange({ ...filters, accessibleOnly: !filters.accessibleOnly })
  }

  const handlePriceChange = (value: number[]) => {
    setPriceRange([value[0], value[1]])
  }

  const applyPriceRange = () => {
    onFiltersChange({ ...filters, priceRange })
  }

  const getCategoryLabel = (category: HotelCategory | null) => {
    if (!category) return t('allCategories')
    return t(category.toLowerCase() as 'boutique' | 'resort' | 'business' | 'hostel' | 'villa')
  }

  const getSortLabel = (sort: SortOption) => {
    return t(sort)
  }

  const getResultsLabel = () => {
    if (resultCount === 1) return `1 ${t('result')}`
    if (resultCount >= 2 && resultCount <= 4) return `${resultCount} ${t('resultsPlural')}`
    return `${resultCount} ${t('results')}`
  }

  const hasActiveFilters = filters.stars.length > 0 ||
    filters.category !== null ||
    filters.amenities.length > 0 ||
    filters.accessibilityFeatures.length > 0 ||
    filters.accessibleOnly ||
    filters.priceRange[0] > 0 ||
    filters.priceRange[1] < 800

  const clearFilters = () => {
    onFiltersChange({
      stars: [],
      category: null,
      priceRange: [0, 800],
      sortBy: 'ratingDesc',
      amenities: [],
      accessibilityFeatures: [],
      accessibleOnly: false,
    })
    setPriceRange([0, 800])
  }

  const activeAccessibility = filters.accessibilityFeatures.length > 0 || filters.accessibleOnly

  return (
    <div className="sticky top-16 z-40 bg-white/98 backdrop-blur-md border-b border-border py-3 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-hide">

          {/* Star Filters */}
          <div className="flex items-center gap-1.5 shrink-0">
            {[3, 4, 5].map((star) => (
              <button
                key={star}
                onClick={() => toggleStar(star)}
                className={`filter-chip flex items-center gap-1 px-3 py-1.5 rounded-full text-sm font-medium border ${
                  filters.stars.includes(star)
                    ? 'bg-primary text-white border-primary shadow-sm'
                    : 'bg-white text-muted-foreground border-border hover:border-primary/40 hover:text-foreground'
                }`}
              >
                <Star className={`w-3.5 h-3.5 ${filters.stars.includes(star) ? 'fill-white' : ''}`} />
                {star}★
              </button>
            ))}
          </div>

          <div className="w-px h-5 bg-border shrink-0" />

          {/* Accessibility Filter */}
          <Popover>
            <PopoverTrigger asChild>
              <button
                className={`filter-chip flex items-center gap-1.5 px-3 py-1.5 rounded-full text-sm font-medium border shrink-0 ${
                  activeAccessibility
                    ? 'bg-accessible text-white border-accessible shadow-sm accessible-badge'
                    : 'bg-white text-muted-foreground border-border hover:border-accessible/40 hover:text-accessible'
                }`}
              >
                <span className="text-base leading-none">♿</span>
                <span>{t('accessibilityFilter')}</span>
                {activeAccessibility && (
                  <span className="ml-0.5 w-4 h-4 bg-white/25 rounded-full text-[10px] flex items-center justify-center font-bold">
                    {filters.accessibilityFeatures.length + (filters.accessibleOnly ? 1 : 0)}
                  </span>
                )}
              </button>
            </PopoverTrigger>
            <PopoverContent className="w-72 bg-white border-border shadow-xl rounded-2xl p-4" align="start" sideOffset={8}>
              <div className="space-y-3">
                <div className="flex items-center justify-between mb-1">
                  <h4 className="text-sm font-semibold text-foreground">{t('accessibilityFeatures')}</h4>
                  {activeAccessibility && (
                    <button
                      onClick={() => onFiltersChange({ ...filters, accessibilityFeatures: [], accessibleOnly: false })}
                      className="text-xs text-muted-foreground hover:text-foreground"
                    >
                      Сбросить
                    </button>
                  )}
                </div>

                {/* Accessible only toggle */}
                <label className="flex items-center gap-3 cursor-pointer py-2 px-3 rounded-xl hover:bg-accessible-light transition-colors">
                  <Checkbox
                    checked={filters.accessibleOnly}
                    onCheckedChange={toggleAccessibleOnly}
                    className="border-accessible-light data-[state=checked]:bg-accessible data-[state=checked]:border-accessible"
                  />
                  <div>
                    <span className="text-sm font-medium text-foreground">Только доступные отели</span>
                    <p className="text-xs text-muted-foreground">Хотя бы одна функция доступности</p>
                  </div>
                </label>

                <div className="border-t border-border pt-3 space-y-1">
                  <p className="text-xs font-medium text-muted-foreground mb-2">Конкретные функции:</p>
                  {allAccessibilityFeatures.map((feature) => (
                    <label
                      key={feature}
                      className="flex items-center gap-2.5 cursor-pointer py-1.5 px-2 rounded-lg hover:bg-secondary transition-colors"
                    >
                      <Checkbox
                        checked={filters.accessibilityFeatures.includes(feature)}
                        onCheckedChange={() => toggleAccessibilityFeature(feature)}
                        className="border-border data-[state=checked]:bg-accessible data-[state=checked]:border-accessible"
                      />
                      <span className="text-base leading-none">{accessibilityIcons[feature]}</span>
                      <span className="text-sm text-foreground">{t(feature as Parameters<typeof t>[0])}</span>
                    </label>
                  ))}
                </div>
              </div>
            </PopoverContent>
          </Popover>

          <div className="w-px h-5 bg-border shrink-0" />

          {/* Category Filter */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <button
                className={`filter-chip flex items-center gap-1.5 px-3 py-1.5 rounded-full text-sm font-medium border shrink-0 ${
                  filters.category ? 'bg-primary/10 text-primary border-primary/30' : 'bg-white text-muted-foreground border-border hover:border-primary/40 hover:text-foreground'
                }`}
              >
                {getCategoryLabel(filters.category)}
                <ChevronDown className="w-3.5 h-3.5" />
              </button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="bg-white border-border shadow-xl rounded-xl">
              {categories.map((category) => (
                <DropdownMenuItem
                  key={category || 'all'}
                  onClick={() => setCategory(category)}
                  className={`cursor-pointer rounded-lg ${
                    filters.category === category ? 'bg-primary/10 text-primary font-medium' : 'text-foreground hover:bg-secondary'
                  }`}
                >
                  {getCategoryLabel(category)}
                </DropdownMenuItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>

          {/* Price Range */}
          <Popover>
            <PopoverTrigger asChild>
              <button
                className={`filter-chip flex items-center gap-1.5 px-3 py-1.5 rounded-full text-sm font-medium border shrink-0 ${
                  filters.priceRange[0] > 0 || filters.priceRange[1] < 800
                    ? 'bg-primary/10 text-primary border-primary/30'
                    : 'bg-white text-muted-foreground border-border hover:border-primary/40 hover:text-foreground'
                }`}
              >
                <SlidersHorizontal className="w-3.5 h-3.5" />
                ${filters.priceRange[0]} — ${filters.priceRange[1]}
              </button>
            </PopoverTrigger>
            <PopoverContent className="w-72 bg-white border-border shadow-xl rounded-2xl p-4" align="start" sideOffset={8}>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium text-foreground">{t('priceRange')}</span>
                  <span className="text-sm font-semibold text-primary">${priceRange[0]} — ${priceRange[1]}</span>
                </div>
                <Slider
                  value={priceRange}
                  min={0}
                  max={800}
                  step={10}
                  onValueChange={handlePriceChange}
                  onValueCommit={applyPriceRange}
                  className="[&_[role=slider]]:bg-primary [&_[role=slider]]:border-primary [&_.bg-primary]:bg-primary"
                />
                <div className="flex justify-between text-xs text-muted-foreground">
                  <span>$0</span>
                  <span>$800+</span>
                </div>
              </div>
            </PopoverContent>
          </Popover>

          {/* Sort By */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <button className="filter-chip flex items-center gap-1.5 px-3 py-1.5 rounded-full text-sm font-medium border bg-white text-muted-foreground border-border hover:border-primary/40 hover:text-foreground shrink-0">
                {t('sortBy')}: {getSortLabel(filters.sortBy)}
                <ChevronDown className="w-3.5 h-3.5" />
              </button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="bg-white border-border shadow-xl rounded-xl">
              {(['priceAsc', 'priceDesc', 'ratingDesc', 'reviewsDesc'] as SortOption[]).map((sort) => (
                <DropdownMenuItem
                  key={sort}
                  onClick={() => setSortBy(sort)}
                  className={`cursor-pointer rounded-lg ${
                    filters.sortBy === sort ? 'bg-primary/10 text-primary font-medium' : 'text-foreground hover:bg-secondary'
                  }`}
                >
                  {getSortLabel(sort)}
                </DropdownMenuItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>

          {/* Amenities */}
          <Popover>
            <PopoverTrigger asChild>
              <button
                className={`filter-chip flex items-center gap-1.5 px-3 py-1.5 rounded-full text-sm font-medium border shrink-0 ${
                  filters.amenities.length > 0
                    ? 'bg-primary/10 text-primary border-primary/30'
                    : 'bg-white text-muted-foreground border-border hover:border-primary/40 hover:text-foreground'
                }`}
              >
                {t('amenities')}
                {filters.amenities.length > 0 && (
                  <span className="w-4 h-4 bg-primary text-white text-[10px] rounded-full flex items-center justify-center font-bold">
                    {filters.amenities.length}
                  </span>
                )}
                <ChevronDown className="w-3.5 h-3.5" />
              </button>
            </PopoverTrigger>
            <PopoverContent className="w-64 bg-white border-border shadow-xl rounded-2xl p-4" align="start" sideOffset={8}>
              <div className="grid grid-cols-1 gap-1">
                {allAmenities.map((amenity) => (
                  <label
                    key={amenity}
                    className="flex items-center gap-2.5 cursor-pointer py-1.5 px-2 rounded-lg hover:bg-secondary transition-colors"
                  >
                    <Checkbox
                      checked={filters.amenities.includes(amenity)}
                      onCheckedChange={() => toggleAmenity(amenity)}
                      className="border-border data-[state=checked]:bg-primary data-[state=checked]:border-primary"
                    />
                    <span className="text-sm text-foreground">{t(amenity)}</span>
                  </label>
                ))}
              </div>
            </PopoverContent>
          </Popover>

          <div className="flex-1" />

          {/* Clear Filters */}
          {hasActiveFilters && (
            <button
              onClick={clearFilters}
              className="filter-chip flex items-center gap-1.5 px-3 py-1.5 rounded-full text-sm font-medium text-muted-foreground hover:text-foreground hover:bg-secondary border border-border shrink-0 transition-all"
            >
              <X className="w-3.5 h-3.5" />
              Сбросить
            </button>
          )}

          {/* Results Count */}
          <span className="text-sm font-semibold text-primary shrink-0 bg-accent px-3 py-1.5 rounded-full">
            {getResultsLabel()}
          </span>
        </div>
      </div>
    </div>
  )
}
