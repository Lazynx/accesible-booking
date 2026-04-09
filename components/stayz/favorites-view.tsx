'use client'

import { Heart } from 'lucide-react'
import { useAuth } from '@/lib/auth-context'
import { hotels } from '@/lib/hotels-data'
import { HotelCard } from './hotel-card'
import type { Hotel } from '@/lib/hotels-data'

interface FavoritesViewProps {
  onHotelClick: (hotel: Hotel) => void
  onShowAuth: () => void
  onBrowse: () => void
}

export function FavoritesView({ onHotelClick, onShowAuth, onBrowse }: FavoritesViewProps) {
  const { user, favorites } = useAuth()

  if (!user) {
    return (
      <div className="flex flex-col items-center justify-center py-32 text-center px-4">
        <div className="w-20 h-20 rounded-2xl bg-red-50 flex items-center justify-center mb-5 shadow-sm">
          <Heart className="w-9 h-9 text-red-300" />
        </div>
        <h2 className="text-2xl font-bold text-foreground mb-2">Войдите чтобы увидеть избранное</h2>
        <p className="text-muted-foreground text-sm mb-6 max-w-sm">
          Сохраняйте понравившиеся отели и возвращайтесь к ним в любое время
        </p>
        <div className="flex items-center gap-3">
          <button
            onClick={onShowAuth}
            className="bg-primary hover:bg-primary/90 text-white font-semibold px-8 py-3 rounded-xl transition-all shadow-sm hover:shadow-md"
          >
            Войти / Зарегистрироваться
          </button>
          <button
            onClick={onBrowse}
            className="text-muted-foreground hover:text-foreground px-6 py-3 rounded-xl border border-border hover:border-foreground/30 transition-all text-sm font-medium"
          >
            Смотреть отели
          </button>
        </div>
      </div>
    )
  }

  const favoriteHotels = hotels.filter(h => favorites.includes(h.id))

  if (favoriteHotels.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-32 text-center px-4">
        <div className="w-20 h-20 rounded-2xl bg-red-50 flex items-center justify-center mb-5 shadow-sm">
          <Heart className="w-9 h-9 text-red-300" />
        </div>
        <h2 className="text-2xl font-bold text-foreground mb-2">Пока пусто</h2>
        <p className="text-muted-foreground text-sm mb-6 max-w-sm">
          Нажимайте ♥ на карточках отелей чтобы добавлять их сюда
        </p>
        <button
          onClick={onBrowse}
          className="bg-primary hover:bg-primary/90 text-white font-semibold px-8 py-3 rounded-xl transition-all shadow-sm hover:shadow-md"
        >
          Найти отели
        </button>
      </div>
    )
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="flex items-center gap-3 mb-6">
        <div className="w-10 h-10 rounded-xl bg-red-50 flex items-center justify-center">
          <Heart className="w-5 h-5 text-red-400 fill-red-400" />
        </div>
        <div>
          <h2 className="text-xl font-bold text-foreground">Избранное</h2>
          <p className="text-sm text-muted-foreground">{favoriteHotels.length} сохранённых отелей</p>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
        {favoriteHotels.map(hotel => (
          <HotelCard
            key={hotel.id}
            hotel={hotel}
            onClick={onHotelClick}
            onAuthRequired={onShowAuth}
          />
        ))}
      </div>
    </div>
  )
}
