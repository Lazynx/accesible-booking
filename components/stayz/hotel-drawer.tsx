'use client'

import { useState, useEffect } from 'react'
import Image from 'next/image'
import { X, Star, MapPin, Check, Minus, Plus, ArrowRight, Construction } from 'lucide-react'
import { useLanguage } from '@/lib/language-context'
import type { Hotel, Amenity, AccessibilityFeature } from '@/lib/hotels-data'

interface HotelDrawerProps {
  hotel: Hotel | null
  onClose: () => void
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

const categoryColors: Record<string, { bg: string; text: string }> = {
  Boutique: { bg: 'bg-purple-100', text: 'text-purple-700' },
  Resort: { bg: 'bg-emerald-100', text: 'text-emerald-700' },
  Business: { bg: 'bg-blue-100', text: 'text-blue-700' },
  Hostel: { bg: 'bg-orange-100', text: 'text-orange-700' },
  Villa: { bg: 'bg-rose-100', text: 'text-rose-700' },
}

export function HotelDrawer({ hotel, onClose }: HotelDrawerProps) {
  const { t } = useLanguage()
  const [nights, setNights] = useState(3)
  const [imageLoaded, setImageLoaded] = useState(false)
  const [activeTab, setActiveTab] = useState<'overview' | 'accessibility'>('overview')
  const [showDevBanner, setShowDevBanner] = useState(false)

  useEffect(() => {
    setImageLoaded(false)
    setActiveTab('overview')
    setShowDevBanner(false)
  }, [hotel?.id])

  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose()
    }
    window.addEventListener('keydown', handleEscape)
    return () => window.removeEventListener('keydown', handleEscape)
  }, [onClose])

  useEffect(() => {
    if (hotel) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = ''
    }
    return () => {
      document.body.style.overflow = ''
    }
  }, [hotel])

  if (!hotel) return null

  const colors = categoryColors[hotel.category] || { bg: 'bg-gray-100', text: 'text-gray-700' }
  const hasAccessibility = hotel.accessibility.length > 0

  const getNightsLabel = () => {
    if (nights === 1) return `1 ${t('night')}`
    if (nights >= 2 && nights <= 4) return `${nights} ${t('nightsPlural')}`
    return `${nights} ${t('nights')}`
  }

  const total = hotel.pricePerNight * nights

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-foreground/30 backdrop-blur-sm z-50 animate-in fade-in duration-200"
        onClick={onClose}
        aria-hidden="true"
      />

      {/* Drawer */}
      <div
        className="fixed right-0 top-0 bottom-0 w-full max-w-lg bg-white border-l border-border z-50 overflow-y-auto shadow-2xl"
        style={{ animation: 'slide-in-right 0.3s cubic-bezier(0.32, 0.72, 0, 1) both' }}
        role="dialog"
        aria-modal="true"
        aria-labelledby="drawer-title"
      >
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 z-10 p-2 rounded-full bg-white shadow-md text-muted-foreground hover:text-foreground hover:shadow-lg transition-all"
          aria-label={t('close')}
        >
          <X className="w-5 h-5" />
        </button>

        {/* Hero Image */}
        <div className="relative aspect-[16/9]">
          {!imageLoaded && (
            <div className="absolute inset-0 bg-secondary animate-pulse" />
          )}
          <Image
            src={hotel.image}
            alt={hotel.name}
            fill
            className={`object-cover transition-opacity duration-300 ${imageLoaded ? 'opacity-100' : 'opacity-0'}`}
            onLoad={() => setImageLoaded(true)}
            priority
          />

          {/* Top badges */}
          <div className="absolute top-4 left-4 flex items-center gap-2">
            <span className={`text-xs font-semibold px-2.5 py-1 rounded-full ${colors.bg} ${colors.text}`}>
              {t(hotel.category.toLowerCase() as 'boutique' | 'resort' | 'business' | 'hostel' | 'villa')}
            </span>
            {hasAccessibility && (
              <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-accessible text-white accessible-badge">
                ♿ {t('accessibleHotel')}
              </span>
            )}
          </div>
        </div>

        {/* Content */}
        <div className="p-6 space-y-5">
          {/* Header */}
          <div>
            <div className="flex items-start justify-between gap-3 mb-2">
              <h2 id="drawer-title" className="text-2xl font-bold text-foreground leading-tight">
                {hotel.name}
              </h2>
              <div className="flex items-center gap-1 shrink-0 bg-amber-50 text-amber-700 px-2.5 py-1.5 rounded-xl">
                <Star className="w-4 h-4 fill-amber-400 text-amber-400" />
                <span className="font-bold text-sm">{hotel.rating}</span>
              </div>
            </div>

            <div className="flex items-center gap-4 text-muted-foreground text-sm">
              <div className="flex items-center gap-1">
                <MapPin className="w-4 h-4" />
                <span>
                  {t(hotel.city as 'Paris' | 'Tokyo' | 'Bali' | 'New York' | 'Dubai' | 'Barcelona' | 'Santorini' | 'Maldives' | 'London' | 'Bangkok' | 'Rome' | 'Cape Town' | 'Sydney' | 'Almaty' | 'Istanbul')},&nbsp;
                  {t(hotel.country as 'France' | 'Japan' | 'Indonesia' | 'USA' | 'UAE' | 'Spain' | 'Greece' | 'UK' | 'Thailand' | 'Italy' | 'South Africa' | 'Australia' | 'Kazakhstan' | 'Turkey' | 'Maldives')}
                </span>
              </div>
              <div className="flex items-center gap-1">
                {Array.from({ length: hotel.stars }).map((_, i) => (
                  <Star key={i} className="w-3.5 h-3.5 text-amber-400 fill-amber-400" />
                ))}
              </div>
            </div>

            <div className="flex items-center gap-2 mt-2 text-sm text-muted-foreground">
              <span>{hotel.reviewCount} {t('reviews')}</span>
            </div>
          </div>

          {/* Tabs */}
          {hasAccessibility && (
            <div className="flex gap-1 bg-secondary p-1 rounded-xl">
              <button
                onClick={() => setActiveTab('overview')}
                className={`flex-1 py-2 px-4 rounded-lg text-sm font-medium transition-all ${
                  activeTab === 'overview'
                    ? 'bg-white text-foreground shadow-sm'
                    : 'text-muted-foreground hover:text-foreground'
                }`}
              >
                Обзор
              </button>
              <button
                onClick={() => setActiveTab('accessibility')}
                className={`flex-1 py-2 px-4 rounded-lg text-sm font-medium transition-all flex items-center justify-center gap-2 ${
                  activeTab === 'accessibility'
                    ? 'bg-accessible text-white shadow-sm'
                    : 'text-muted-foreground hover:text-foreground'
                }`}
              >
                ♿ Доступность
                <span className={`w-5 h-5 rounded-full text-[10px] font-bold flex items-center justify-center ${
                  activeTab === 'accessibility' ? 'bg-white/25 text-white' : 'bg-accessible-light text-accessible'
                }`}>
                  {hotel.accessibility.length}
                </span>
              </button>
            </div>
          )}

          {/* Overview Tab */}
          {activeTab === 'overview' && (
            <div className="space-y-5">
              {/* About */}
              <div>
                <h3 className="text-base font-semibold text-foreground mb-2">{t('aboutHotel')}</h3>
                <p className="text-muted-foreground leading-relaxed text-sm">{hotel.description}</p>
              </div>

              {/* Amenities */}
              <div>
                <h3 className="text-base font-semibold text-foreground mb-3">{t('amenitiesTitle')}</h3>
                <div className="grid grid-cols-2 gap-2">
                  {hotel.amenities.map((amenity) => (
                    <div
                      key={amenity}
                      className="flex items-center gap-2 text-foreground bg-secondary px-3 py-2.5 rounded-xl text-sm"
                    >
                      <span className="text-base">{amenityIcons[amenity]}</span>
                      <span className="font-medium">{t(amenity)}</span>
                      <Check className="w-3.5 h-3.5 text-emerald-500 ml-auto" />
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Accessibility Tab */}
          {activeTab === 'accessibility' && hasAccessibility && (
            <div className="space-y-4">
              <div className="bg-accessible-light border border-accessible/20 rounded-2xl p-4">
                <div className="flex items-center gap-3 mb-2">
                  <div className="w-10 h-10 bg-accessible rounded-xl flex items-center justify-center text-white text-xl">
                    ♿
                  </div>
                  <div>
                    <h3 className="font-semibold text-foreground">{t('accessibilityFeatures')}</h3>
                    <p className="text-sm text-muted-foreground">{hotel.accessibility.length} функций доступности</p>
                  </div>
                </div>
                <p className="text-sm text-muted-foreground">
                  Этот отель специально оборудован для гостей с особыми потребностями и обязательствами по инклюзивности.
                </p>
              </div>

              <div className="grid grid-cols-1 gap-2">
                {hotel.accessibility.map((feature) => (
                  <div
                    key={feature}
                    className="flex items-center gap-3 bg-white border border-accessible/15 px-4 py-3 rounded-xl hover:border-accessible/30 transition-colors"
                  >
                    <span className="text-xl w-8 text-center">{accessibilityIcons[feature]}</span>
                    <span className="text-sm font-medium text-foreground flex-1">
                      {t(feature as Parameters<typeof t>[0])}
                    </span>
                    <Check className="w-4 h-4 text-accessible" />
                  </div>
                ))}
              </div>

              <div className="bg-secondary rounded-xl p-3 text-xs text-muted-foreground">
                💡 Информация о доступности предоставлена отелем и может быть уточнена при бронировании.
              </div>
            </div>
          )}

          {/* Price Breakdown */}
          <div className="bg-secondary rounded-2xl p-4 space-y-3">
            <h3 className="text-base font-semibold text-foreground">{t('priceBreakdown')}</h3>

            {/* Nights Selector */}
            <div className="flex items-center justify-between">
              <span className="text-sm text-muted-foreground">{t('nights')}</span>
              <div className="flex items-center gap-3">
                <button
                  className="num-btn"
                  onClick={() => setNights(Math.max(1, nights - 1))}
                  disabled={nights <= 1}
                  aria-label="Уменьшить"
                >
                  <Minus className="w-3.5 h-3.5" />
                </button>
                <span className="text-foreground font-semibold w-6 text-center">{nights}</span>
                <button
                  className="num-btn"
                  onClick={() => setNights(Math.min(30, nights + 1))}
                  disabled={nights >= 30}
                  aria-label="Увеличить"
                >
                  <Plus className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>

            <div className="flex items-center justify-between text-sm text-muted-foreground">
              <span>${hotel.pricePerNight} × {getNightsLabel()}</span>
              <span>${total}</span>
            </div>

            <div className="border-t border-border pt-3 flex items-center justify-between">
              <span className="font-semibold text-foreground">{t('total')}</span>
              <span className="text-2xl font-bold text-primary">${total}</span>
            </div>
          </div>

          {/* Dev Banner */}
          {showDevBanner && (
            <div className="bg-amber-50 border border-amber-200 rounded-2xl p-4 flex items-start gap-3 animate-in fade-in slide-in-from-bottom-2 duration-300">
              <Construction className="w-5 h-5 text-amber-500 shrink-0 mt-0.5" />
              <div>
                <p className="text-sm font-semibold text-amber-800">Сайт в разработке</p>
                <p className="text-xs text-amber-600 mt-0.5">
                  В скором времени бронирование будет доступно. Следите за обновлениями!
                </p>
              </div>
              <button
                onClick={() => setShowDevBanner(false)}
                className="ml-auto text-amber-400 hover:text-amber-600 transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          )}

          {/* Book Button */}
          <button
            onClick={() => setShowDevBanner(true)}
            className="w-full bg-primary hover:bg-primary/90 active:scale-[0.98] text-white font-bold py-4 rounded-2xl text-base flex items-center justify-center gap-2 transition-all shadow-lg hover:shadow-xl"
          >
            {t('bookNow')}
            <ArrowRight className="w-5 h-5" />
          </button>
        </div>
      </div>
    </>
  )
}
