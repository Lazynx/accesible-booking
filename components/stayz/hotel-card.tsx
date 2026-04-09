'use client'

import { useState } from 'react'
import Image from 'next/image'
import { Star, MapPin, ArrowRight } from 'lucide-react'
import { useLanguage } from '@/lib/language-context'
import type { Hotel, Amenity } from '@/lib/hotels-data'

interface HotelCardProps {
  hotel: Hotel
  onClick: (hotel: Hotel) => void
}

const categoryColors: Record<string, { bg: string; text: string }> = {
  Boutique: { bg: 'bg-purple-100', text: 'text-purple-700' },
  Resort: { bg: 'bg-emerald-100', text: 'text-emerald-700' },
  Business: { bg: 'bg-blue-100', text: 'text-blue-700' },
  Hostel: { bg: 'bg-orange-100', text: 'text-orange-700' },
  Villa: { bg: 'bg-rose-100', text: 'text-rose-700' },
}

const amenityIcons: Record<Amenity, string> = {
  Pool: '🏊',
  Spa: '💆',
  Gym: '🏋️',
  WiFi: '📶',
  Restaurant: '🍽️',
  Bar: '🍸',
  Parking: '🅿️',
  'Beach Access': '🏖️',
  Rooftop: '🌇',
  'Pet Friendly': '🐕',
  'Airport Shuttle': '🚐',
}

export function HotelCard({ hotel, onClick }: HotelCardProps) {
  const { t } = useLanguage()
  const [imageLoaded, setImageLoaded] = useState(false)
  const [hovered, setHovered] = useState(false)

  const colors = categoryColors[hotel.category] || { bg: 'bg-gray-100', text: 'text-gray-700' }
  const hasAccessibility = hotel.accessibility.length > 0

  const getReviewsLabel = () => {
    const count = hotel.reviewCount
    if (count === 1) return `1 ${t('review')}`
    if (count >= 2 && count <= 4) return `${count} ${t('reviewsPlural')}`
    return `${count} ${t('reviews')}`
  }

  return (
    <article
      className="card-animate group relative bg-white rounded-2xl overflow-hidden border border-border hover:border-primary/20 transition-all duration-300 hover:shadow-xl hover:-translate-y-1 cursor-pointer"
      onClick={() => onClick(hotel)}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => e.key === 'Enter' && onClick(hotel)}
      aria-label={`${hotel.name}, ${hotel.city}. ${hotel.pricePerNight}$ за ночь`}
    >
      {/* Image Container */}
      <div className="relative aspect-[4/3] overflow-hidden bg-secondary">
        {/* Skeleton */}
        {!imageLoaded && (
          <div className="absolute inset-0 bg-secondary animate-pulse" />
        )}

        <Image
          src={hotel.image}
          alt={hotel.name}
          fill
          className={`object-cover transition-transform duration-500 ${hovered ? 'scale-105' : 'scale-100'} ${imageLoaded ? 'opacity-100' : 'opacity-0'}`}
          onLoad={() => setImageLoaded(true)}
          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
        />

        {/* Top badges */}
        <div className="absolute top-3 left-3 right-3 flex items-start justify-between">
          <span className={`text-xs font-semibold px-2.5 py-1 rounded-full ${colors.bg} ${colors.text}`}>
            {t(hotel.category.toLowerCase() as 'boutique' | 'resort' | 'business' | 'hostel' | 'villa')}
          </span>
          <span className="flex items-center gap-1 bg-white/95 backdrop-blur-sm text-foreground px-2 py-1 rounded-full text-xs font-bold shadow-sm">
            <Star className="w-3 h-3 text-amber-400 fill-amber-400" />
            {hotel.stars}★
          </span>
        </div>

        {/* Accessibility badge */}
        {hasAccessibility && (
          <div className="absolute bottom-3 left-3">
            <span
              className="flex items-center gap-1 bg-accessible text-white text-xs font-semibold px-2.5 py-1 rounded-full shadow-sm accessible-badge"
              title={`${hotel.accessibility.length} функций доступности`}
            >
              ♿ {hotel.accessibility.length}
            </span>
          </div>
        )}
      </div>

      {/* Content */}
      <div className="p-4">
        {/* Title & Location */}
        <div className="mb-3">
          <h3 className="font-semibold text-base text-foreground line-clamp-1 group-hover:text-primary transition-colors">
            {hotel.name}
          </h3>
          <div className="flex items-center gap-1 text-muted-foreground text-sm mt-0.5">
            <MapPin className="w-3.5 h-3.5 shrink-0" />
            <span className="truncate">
              {t(hotel.city as 'Paris' | 'Tokyo' | 'Bali' | 'New York' | 'Dubai' | 'Barcelona' | 'Santorini' | 'Maldives' | 'London' | 'Bangkok' | 'Rome' | 'Cape Town' | 'Sydney' | 'Almaty' | 'Istanbul')},&nbsp;
              {t(hotel.country as 'France' | 'Japan' | 'Indonesia' | 'USA' | 'UAE' | 'Spain' | 'Greece' | 'UK' | 'Thailand' | 'Italy' | 'South Africa' | 'Australia' | 'Kazakhstan' | 'Turkey' | 'Maldives')}
            </span>
          </div>
        </div>

        {/* Amenities */}
        <div className="flex items-center gap-1 flex-wrap mb-3">
          {hotel.amenities.slice(0, 4).map((amenity) => (
            <span
              key={amenity}
              className="text-xs bg-secondary text-muted-foreground px-2 py-0.5 rounded-full"
              title={t(amenity)}
            >
              {amenityIcons[amenity]}
            </span>
          ))}
          {hotel.amenities.length > 4 && (
            <span className="text-xs text-muted-foreground px-1">
              +{hotel.amenities.length - 4}
            </span>
          )}
        </div>

        {/* Price & Rating */}
        <div className="flex items-center justify-between pt-3 border-t border-border">
          <div>
            <span className="text-xl font-bold text-foreground">${hotel.pricePerNight}</span>
            <span className="text-muted-foreground text-sm ml-1">{t('perNight')}</span>
          </div>
          <div className="flex items-center gap-1.5">
            <div className="flex items-center gap-1 bg-amber-50 text-amber-700 px-2 py-1 rounded-lg">
              <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
              <span className="text-sm font-semibold">{hotel.rating}</span>
            </div>
            <span className="text-xs text-muted-foreground hidden sm:block">{getReviewsLabel()}</span>
          </div>
        </div>

        {/* View Button - appears on hover */}
        <div className={`mt-3 transition-all duration-200 ${hovered ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-1'}`}>
          <button
            className="w-full bg-primary hover:bg-primary/90 text-white text-sm font-semibold py-2.5 rounded-xl flex items-center justify-center gap-2 transition-colors"
            onClick={(e) => {
              e.stopPropagation()
              onClick(hotel)
            }}
            tabIndex={-1}
          >
            {t('viewDetails')}
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </article>
  )
}

export function HotelCardSkeleton() {
  return (
    <div className="bg-white rounded-2xl overflow-hidden border border-border">
      <div className="aspect-[4/3] bg-secondary animate-pulse" />
      <div className="p-4 space-y-3">
        <div className="space-y-2">
          <div className="h-4 bg-secondary animate-pulse rounded-full w-3/4" />
          <div className="h-3 bg-secondary animate-pulse rounded-full w-1/2" />
        </div>
        <div className="flex gap-2">
          <div className="h-5 w-5 bg-secondary animate-pulse rounded-full" />
          <div className="h-5 w-5 bg-secondary animate-pulse rounded-full" />
          <div className="h-5 w-5 bg-secondary animate-pulse rounded-full" />
          <div className="h-5 w-5 bg-secondary animate-pulse rounded-full" />
        </div>
        <div className="flex justify-between pt-3 border-t border-border">
          <div className="h-6 bg-secondary animate-pulse rounded-full w-20" />
          <div className="h-6 bg-secondary animate-pulse rounded-lg w-12" />
        </div>
      </div>
    </div>
  )
}
