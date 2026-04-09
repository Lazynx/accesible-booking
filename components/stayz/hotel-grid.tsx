'use client'

import { HotelCard, HotelCardSkeleton } from './hotel-card'
import { useLanguage } from '@/lib/language-context'
import type { Hotel } from '@/lib/hotels-data'
import { Search } from 'lucide-react'

interface HotelGridProps {
  hotels: Hotel[]
  onHotelClick: (hotel: Hotel) => void
  loading?: boolean
}

export function HotelGrid({ hotels, onHotelClick, loading }: HotelGridProps) {
  const { t } = useLanguage()

  if (loading) {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
        {Array.from({ length: 6 }).map((_, i) => (
          <HotelCardSkeleton key={i} />
        ))}
      </div>
    )
  }

  if (hotels.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-24 text-center">
        <div className="w-20 h-20 rounded-2xl bg-secondary flex items-center justify-center mb-5 shadow-sm">
          <Search className="w-9 h-9 text-muted-foreground/50" />
        </div>
        <h3 className="text-xl font-bold text-foreground mb-2">
          {t('noHotels')}
        </h3>
        <p className="text-muted-foreground max-w-sm text-sm">
          {t('noHotelsHint')}
        </p>
      </div>
    )
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
      {hotels.map((hotel) => (
        <HotelCard
          key={hotel.id}
          hotel={hotel}
          onClick={onHotelClick}
        />
      ))}
    </div>
  )
}
