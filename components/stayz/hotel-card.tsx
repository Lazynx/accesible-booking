'use client'

import { useState } from 'react'
import Image from 'next/image'
import { Star, MapPin, ArrowRight, Heart } from 'lucide-react'
import { useLanguage } from '@/lib/language-context'
import { useAuth } from '@/lib/auth-context'
import type { Hotel, Amenity } from '@/lib/hotels-data'

interface HotelCardProps {
  hotel: Hotel
  onClick: (hotel: Hotel) => void
  onAuthRequired?: () => void
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

function getRatingLabel(rating: number): { label: string; color: string } {
  if (rating >= 4.5) return { label: 'Отлично', color: 'bg-emerald-500' }
  if (rating >= 4.0) return { label: 'Очень хорошо', color: 'bg-green-500' }
  if (rating >= 3.5) return { label: 'Хорошо', color: 'bg-yellow-500' }
  return { label: 'Нормально', color: 'bg-orange-400' }
}

export function HotelCard({ hotel, onClick, onAuthRequired }: HotelCardProps) {
  const { t } = useLanguage()
  const { isFavorite, toggleFavorite, user } = useAuth()
  const [imageLoaded, setImageLoaded] = useState(false)
  const [hovered, setHovered] = useState(false)
  const [heartAnim, setHeartAnim] = useState(false)

  const colors = categoryColors[hotel.category] || { bg: 'bg-gray-100', text: 'text-gray-700' }
  const hasAccessibility = hotel.accessibility.length > 0
  const liked = isFavorite(hotel.id)
  const { label: ratingLabel, color: ratingColor } = getRatingLabel(hotel.rating)

  const getReviewsLabel = () => {
    const count = hotel.reviewCount
    if (count === 1) return `1 ${t('review')}`
    if (count >= 2 && count <= 4) return `${count} ${t('reviewsPlural')}`
    return `${count} ${t('reviews')}`
  }

  const handleHeart = (e: React.MouseEvent) => {
    e.stopPropagation()
    if (!user) {
      onAuthRequired?.()
      return
    }
    setHeartAnim(true)
    setTimeout(() => setHeartAnim(false), 400)
    toggleFavorite(hotel.id)
  }

  return (
    <article
      className="card-animate group relative bg-white rounded-2xl overflow-hidden border border-border hover:border-primary/20 transition-all duration-300 hover:shadow-xl hover:-translate-y-0.5 cursor-pointer"
      onClick={() => onClick(hotel)}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => e.key === 'Enter' && onClick(hotel)}
      aria-label={`${hotel.name}, ${hotel.city}. ${hotel.pricePerNight}$ за ночь`}
    >
      {/* Image */}
      <div className="relative aspect-[4/3] overflow-hidden bg-secondary">
        {!imageLoaded && <div className="absolute inset-0 bg-secondary animate-pulse" />}

        <Image
          src={hotel.image}
          alt={hotel.name}
          fill
          className={`object-cover transition-transform duration-500 ${hovered ? 'scale-105' : 'scale-100'} ${imageLoaded ? 'opacity-100' : 'opacity-0'}`}
          onLoad={() => setImageLoaded(true)}
          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
        />

        {/* Gradient */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/30 via-transparent to-transparent" />

        {/* Heart button */}
        <button
          className={`absolute top-3 right-3 w-9 h-9 rounded-full flex items-center justify-center transition-all duration-200 shadow-sm ${
            liked
              ? 'bg-red-500 text-white scale-110'
              : 'bg-white/90 text-muted-foreground hover:bg-white hover:text-red-400'
          } ${heartAnim ? 'scale-125' : ''}`}
          onClick={handleHeart}
          aria-label={liked ? 'Удалить из избранного' : 'Добавить в избранное'}
        >
          <Heart className={`w-4 h-4 transition-all ${liked ? 'fill-white' : ''}`} />
        </button>

        {/* Category badge */}
        <span className={`absolute top-3 left-3 text-xs font-semibold px-2.5 py-1 rounded-full ${colors.bg} ${colors.text}`}>
          {t(hotel.category.toLowerCase() as 'boutique' | 'resort' | 'business' | 'hostel' | 'villa')}
        </span>

        {/* Accessibility */}
        {hasAccessibility && (
          <span
            className="absolute bottom-3 left-3 flex items-center gap-1 bg-accessible text-white text-xs font-semibold px-2 py-1 rounded-full shadow-sm"
            title={`${hotel.accessibility.length} функций доступности`}
          >
            ♿ {hotel.accessibility.length}
          </span>
        )}

        {/* Stars */}
        <div className="absolute bottom-3 right-3 flex items-center gap-0.5">
          {Array.from({ length: hotel.stars }).map((_, i) => (
            <span key={i} className="text-amber-400 text-sm">★</span>
          ))}
        </div>
      </div>

      {/* Content */}
      <div className="p-4">
        <div className="mb-2">
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
          {hotel.amenities.slice(0, 5).map((amenity) => (
            <span key={amenity} className="text-sm" title={t(amenity)}>
              {amenityIcons[amenity]}
            </span>
          ))}
          {hotel.amenities.length > 5 && (
            <span className="text-xs text-muted-foreground">+{hotel.amenities.length - 5}</span>
          )}
        </div>

        {/* Price + Rating */}
        <div className="flex items-center justify-between pt-3 border-t border-border">
          <div>
            <span className="text-xl font-bold text-foreground">${hotel.pricePerNight}</span>
            <span className="text-muted-foreground text-xs ml-1">{t('perNight')}</span>
          </div>
          <div className="flex items-center gap-2">
            <span className={`${ratingColor} text-white text-xs font-bold px-2 py-1 rounded-lg`}>
              {hotel.rating}
            </span>
            <div className="text-right hidden sm:block">
              <div className="text-xs font-medium text-foreground">{ratingLabel}</div>
              <div className="text-xs text-muted-foreground">{getReviewsLabel()}</div>
            </div>
          </div>
        </div>

        {/* View button on hover */}
        <div className={`overflow-hidden transition-all duration-200 ${hovered ? 'max-h-12 mt-3 opacity-100' : 'max-h-0 mt-0 opacity-0'}`}>
          <button
            className="w-full bg-primary hover:bg-primary/90 text-white text-sm font-semibold py-2.5 rounded-xl flex items-center justify-center gap-2 transition-colors"
            onClick={(e) => { e.stopPropagation(); onClick(hotel) }}
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
        <div className="flex gap-1.5">
          {[...Array(5)].map((_, i) => (
            <div key={i} className="h-5 w-5 bg-secondary animate-pulse rounded" />
          ))}
        </div>
        <div className="flex justify-between pt-3 border-t border-border">
          <div className="h-6 bg-secondary animate-pulse rounded-full w-20" />
          <div className="h-7 bg-secondary animate-pulse rounded-lg w-14" />
        </div>
      </div>
    </div>
  )
}
