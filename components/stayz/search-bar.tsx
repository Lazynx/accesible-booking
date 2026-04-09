'use client'

import { useState, useRef } from 'react'
import { MapPin, Calendar, Users, Search, Minus, Plus, X } from 'lucide-react'
import { useLanguage } from '@/lib/language-context'
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover'
import { Calendar as CalendarComponent } from '@/components/ui/calendar'
import { format } from 'date-fns'
import { ru, kk, enUS } from 'date-fns/locale'

interface SearchBarProps {
  onSearch: (destination: string, checkIn?: Date, checkOut?: Date, guests?: number) => void
  initialDestination?: string
}

export function SearchBar({ onSearch, initialDestination = '' }: SearchBarProps) {
  const { language, t } = useLanguage()
  const [destination, setDestination] = useState(initialDestination)
  const [checkIn, setCheckIn] = useState<Date | undefined>()
  const [checkOut, setCheckOut] = useState<Date | undefined>()
  const [guests, setGuests] = useState(2)
  const inputRef = useRef<HTMLInputElement>(null)

  const locale = language === 'ru' ? ru : language === 'kz' ? kk : enUS

  const handleSearch = () => {
    onSearch(destination, checkIn, checkOut, guests)
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') handleSearch()
  }

  const getGuestsLabel = () => {
    if (guests === 1) return `1 ${t('guest')}`
    if (guests >= 2 && guests <= 4) return `${guests} ${t('guestsPlural')}`
    return `${guests} ${t('guests')}`
  }

  return (
    <div className="w-full max-w-4xl mx-auto">
      {/* Main search pill */}
      <div className="flex flex-col lg:flex-row items-stretch bg-white rounded-2xl shadow-xl border border-border overflow-hidden">

        {/* Destination */}
        <div className="search-segment flex-1 flex items-center gap-3 px-5 py-4 border-b lg:border-b-0 lg:border-r border-border transition-colors">
          <MapPin className="w-5 h-5 text-primary shrink-0" />
          <div className="flex-1 min-w-0">
            <label className="text-[11px] font-semibold text-muted-foreground uppercase tracking-wider block mb-0.5">
              {t('destination')}
            </label>
            <div className="relative flex items-center">
              <input
                ref={inputRef}
                type="text"
                placeholder={t('destinationPlaceholder')}
                value={destination}
                onChange={(e) => setDestination(e.target.value)}
                onKeyDown={handleKeyDown}
                className="w-full text-sm font-medium text-foreground bg-transparent border-none outline-none placeholder:text-muted-foreground/60"
                aria-label={t('destination')}
              />
              {destination && (
                <button
                  onClick={() => { setDestination(''); inputRef.current?.focus() }}
                  className="shrink-0 text-muted-foreground hover:text-foreground transition-colors"
                  aria-label="Clear"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Check-in */}
        <Popover>
          <PopoverTrigger asChild>
            <button className="search-segment flex items-center gap-3 px-5 py-4 border-b lg:border-b-0 lg:border-r border-border transition-colors text-left hover:bg-accent/30 group">
              <Calendar className="w-5 h-5 text-primary shrink-0" />
              <div>
                <span className="text-[11px] font-semibold text-muted-foreground uppercase tracking-wider block mb-0.5">
                  {t('checkIn')}
                </span>
                <span className={`text-sm font-medium ${checkIn ? 'text-foreground' : 'text-muted-foreground/60'}`}>
                  {checkIn ? format(checkIn, 'dd MMM', { locale }) : t('selectDate')}
                </span>
              </div>
            </button>
          </PopoverTrigger>
          <PopoverContent className="w-auto p-0 bg-white border-border shadow-xl rounded-2xl" align="start" sideOffset={8}>
            <CalendarComponent
              mode="single"
              selected={checkIn}
              onSelect={setCheckIn}
              disabled={(date) => date < new Date()}
              locale={locale}
            />
          </PopoverContent>
        </Popover>

        {/* Check-out */}
        <Popover>
          <PopoverTrigger asChild>
            <button className="search-segment flex items-center gap-3 px-5 py-4 border-b lg:border-b-0 lg:border-r border-border transition-colors text-left hover:bg-accent/30">
              <Calendar className="w-5 h-5 text-primary shrink-0" />
              <div>
                <span className="text-[11px] font-semibold text-muted-foreground uppercase tracking-wider block mb-0.5">
                  {t('checkOut')}
                </span>
                <span className={`text-sm font-medium ${checkOut ? 'text-foreground' : 'text-muted-foreground/60'}`}>
                  {checkOut ? format(checkOut, 'dd MMM', { locale }) : t('selectDate')}
                </span>
              </div>
            </button>
          </PopoverTrigger>
          <PopoverContent className="w-auto p-0 bg-white border-border shadow-xl rounded-2xl" align="start" sideOffset={8}>
            <CalendarComponent
              mode="single"
              selected={checkOut}
              onSelect={setCheckOut}
              disabled={(date) => date < (checkIn || new Date())}
              locale={locale}
            />
          </PopoverContent>
        </Popover>

        {/* Guests */}
        <Popover>
          <PopoverTrigger asChild>
            <button className="search-segment flex items-center gap-3 px-5 py-4 border-b lg:border-b-0 lg:border-r border-border transition-colors text-left hover:bg-accent/30">
              <Users className="w-5 h-5 text-primary shrink-0" />
              <div>
                <span className="text-[11px] font-semibold text-muted-foreground uppercase tracking-wider block mb-0.5">
                  {t('guests')}
                </span>
                <span className="text-sm font-medium text-foreground">{getGuestsLabel()}</span>
              </div>
            </button>
          </PopoverTrigger>
          <PopoverContent className="w-56 bg-white border-border shadow-xl rounded-2xl p-4" align="start" sideOffset={8}>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-foreground">{t('guests')}</p>
                <p className="text-xs text-muted-foreground">До 10 человек</p>
              </div>
              <div className="flex items-center gap-3">
                <button
                  className="num-btn"
                  onClick={() => setGuests(Math.max(1, guests - 1))}
                  disabled={guests <= 1}
                  aria-label="Decrease guests"
                >
                  <Minus className="w-3.5 h-3.5" />
                </button>
                <span className="text-foreground font-semibold w-6 text-center text-sm">{guests}</span>
                <button
                  className="num-btn"
                  onClick={() => setGuests(Math.min(10, guests + 1))}
                  disabled={guests >= 10}
                  aria-label="Increase guests"
                >
                  <Plus className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          </PopoverContent>
        </Popover>

        {/* Search Button */}
        <div className="p-2">
          <button
            onClick={handleSearch}
            className="h-full w-full lg:w-auto bg-primary hover:bg-primary/90 active:scale-95 text-white font-semibold px-8 py-3 lg:py-0 rounded-xl flex items-center justify-center gap-2 transition-all shadow-sm hover:shadow-md"
          >
            <Search className="w-5 h-5" />
            <span>{t('search')}</span>
          </button>
        </div>
      </div>
    </div>
  )
}
