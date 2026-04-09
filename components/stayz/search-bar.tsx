'use client'

import { useState, useRef, useEffect } from 'react'
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

const SUGGESTIONS = [
  { label: 'Dubai', display: 'Дубай', sublabel: 'ОАЭ', icon: '🏙️' },
  { label: 'Bali', display: 'Бали', sublabel: 'Индонезия', icon: '🌴' },
  { label: 'Barcelona', display: 'Барселона', sublabel: 'Испания', icon: '🏖️' },
  { label: 'Tokyo', display: 'Токио', sublabel: 'Япония', icon: '🗼' },
  { label: 'Almaty', display: 'Алматы', sublabel: 'Казахстан', icon: '🏔️' },
  { label: 'Maldives', display: 'Мальдивы', sublabel: 'Мальдивы', icon: '🐠' },
  { label: 'Istanbul', display: 'Стамбул', sublabel: 'Турция', icon: '🕌' },
  { label: 'Turkey', display: 'Турция', sublabel: 'Страна', icon: '🇹🇷' },
  { label: 'Bangkok', display: 'Бангкок', sublabel: 'Таиланд', icon: '🛕' },
  { label: 'Thailand', display: 'Таиланд', sublabel: 'Страна', icon: '🇹🇭' },
  { label: 'Paris', display: 'Париж', sublabel: 'Франция', icon: '🗺️' },
  { label: 'Santorini', display: 'Санторини', sublabel: 'Греция', icon: '🏛️' },
  { label: 'Rome', display: 'Рим', sublabel: 'Италия', icon: '🍕' },
  { label: 'Sydney', display: 'Сидней', sublabel: 'Австралия', icon: '🦘' },
  { label: 'London', display: 'Лондон', sublabel: 'Великобритания', icon: '🎡' },
  { label: 'New York', display: 'Нью-Йорк', sublabel: 'США', icon: '🗽' },
  { label: 'Cape Town', display: 'Кейптаун', sublabel: 'ЮАР', icon: '🦁' },
  { label: 'Greece', display: 'Греция', sublabel: 'Страна', icon: '🇬🇷' },
  { label: 'Japan', display: 'Япония', sublabel: 'Страна', icon: '🇯🇵' },
  { label: 'France', display: 'Франция', sublabel: 'Страна', icon: '🇫🇷' },
]

export function SearchBar({ onSearch, initialDestination = '' }: SearchBarProps) {
  const { language, t } = useLanguage()
  const [destination, setDestination] = useState(initialDestination)
  const [checkIn, setCheckIn] = useState<Date | undefined>()
  const [checkOut, setCheckOut] = useState<Date | undefined>()
  const [guests, setGuests] = useState(2)
  const [showSuggestions, setShowSuggestions] = useState(false)
  const inputRef = useRef<HTMLInputElement>(null)
  const containerRef = useRef<HTMLDivElement>(null)

  const locale = language === 'ru' ? ru : language === 'kz' ? kk : enUS

  const filteredSuggestions = destination.trim().length > 0
    ? SUGGESTIONS.filter(s =>
        s.label.toLowerCase().includes(destination.toLowerCase()) ||
        s.display.toLowerCase().includes(destination.toLowerCase()) ||
        s.sublabel.toLowerCase().includes(destination.toLowerCase())
      ).slice(0, 7)
    : SUGGESTIONS.slice(0, 6)

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setShowSuggestions(false)
      }
    }
    document.addEventListener('mousedown', handler)
    return () => document.removeEventListener('mousedown', handler)
  }, [])

  // Translate Russian/Kazakh typed input to English search term
  const resolveQuery = (q: string): string => {
    const lower = q.toLowerCase().trim()
    const match = SUGGESTIONS.find(
      s => s.display.toLowerCase() === lower || s.label.toLowerCase() === lower
    )
    return match ? match.label : q
  }

  const handleSearch = () => {
    setShowSuggestions(false)
    onSearch(resolveQuery(destination), checkIn, checkOut, guests)
  }

  const pickSuggestion = (s: (typeof SUGGESTIONS)[0]) => {
    setDestination(s.display)
    setShowSuggestions(false)
    onSearch(s.label, checkIn, checkOut, guests)
  }

  const getGuestsLabel = () => {
    if (guests === 1) return `1 ${t('guest')}`
    if (guests >= 2 && guests <= 4) return `${guests} ${t('guestsPlural')}`
    return `${guests} ${t('guests')}`
  }

  const formatDate = (d?: Date) => d ? format(d, 'dd MMM', { locale }) : undefined

  // Shared label style
  const labelCls = 'text-[10px] font-bold text-muted-foreground uppercase tracking-widest block mb-0.5'
  // Shared value style
  const valueCls = (hasValue: boolean) => `text-sm font-medium leading-tight ${hasValue ? 'text-foreground' : 'text-muted-foreground/50'}`

  return (
    <div ref={containerRef} className="w-full max-w-4xl mx-auto relative" style={{ zIndex: 10 }}>
      <div className="flex flex-col lg:flex-row bg-white rounded-2xl shadow-2xl border border-border overflow-visible">

        {/* ── WHERE ── */}
        <div className="flex-[1.5] relative">
          <div
            className="flex items-center gap-3 px-5 py-4 border-b lg:border-b-0 lg:border-r border-border hover:bg-orange-50/40 transition-colors cursor-text w-full text-left"
            onClick={() => inputRef.current?.focus()}
          >
            <MapPin className="w-5 h-5 text-primary shrink-0 mt-px" />
            <div className="flex-1 min-w-0">
              <span className={labelCls}>{t('destination')}</span>
              <input
                id="sb-destination"
                ref={inputRef}
                type="text"
                placeholder={t('destinationPlaceholder')}
                value={destination}
                onChange={e => { setDestination(e.target.value); setShowSuggestions(true) }}
                onFocus={() => setShowSuggestions(true)}
                onKeyDown={e => {
                  if (e.key === 'Enter') handleSearch()
                  if (e.key === 'Escape') setShowSuggestions(false)
                }}
                className="text-sm font-medium leading-tight text-foreground bg-transparent border-none outline-none placeholder:text-muted-foreground/50 p-0 m-0 block w-full"
                autoComplete="off"
              />
            </div>
            {destination && (
              <button
                type="button"
                onClick={e => { e.stopPropagation(); setDestination(''); inputRef.current?.focus(); setShowSuggestions(true) }}
                className="shrink-0 ml-auto text-muted-foreground/50 hover:text-muted-foreground transition-colors"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            )}
          </div>

          {/* Dropdown */}
          {showSuggestions && filteredSuggestions.length > 0 && (
            <div
              className="absolute top-[calc(100%+6px)] left-0 w-[min(400px,100vw-2rem)] bg-white rounded-2xl shadow-2xl border border-border overflow-hidden animate-in fade-in slide-in-from-top-1 duration-150"
              style={{ zIndex: 9999 }}
            >
              <div className="py-1.5">
                <div className="px-4 py-1.5 text-[11px] font-bold text-muted-foreground uppercase tracking-wider">
                  {destination ? 'Результаты' : 'Популярные направления'}
                </div>
                {filteredSuggestions.map((s, i) => (
                  <button
                    key={i}
                    type="button"
                    onMouseDown={e => { e.preventDefault(); pickSuggestion(s) }}
                    className="w-full flex items-center gap-3 px-4 py-2.5 hover:bg-secondary transition-colors text-left"
                  >
                    <span className="text-lg w-7 text-center shrink-0 leading-none">{s.icon}</span>
                    <div className="min-w-0">
                      <span className="text-sm font-medium text-foreground">{s.display}</span>
                      <span className="text-xs text-muted-foreground ml-1.5">{s.sublabel}</span>
                    </div>
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* ── CHECK-IN ── */}
        <Popover>
          <PopoverTrigger asChild>
            <button
              type="button"
              className="flex items-center gap-3 px-5 py-4 border-b lg:border-b-0 lg:border-r border-border hover:bg-orange-50/40 transition-colors text-left w-full lg:w-auto lg:min-w-[148px]"
            >
              <Calendar className="w-5 h-5 text-primary shrink-0 mt-px" />
              <div>
                <span className={labelCls}>{t('checkIn')}</span>
                <span className={valueCls(!!checkIn)}>
                  {formatDate(checkIn) ?? t('selectDate')}
                </span>
              </div>
            </button>
          </PopoverTrigger>
          <PopoverContent className="w-auto p-0 bg-white border-border shadow-xl rounded-2xl" align="start" sideOffset={8}>
            <CalendarComponent
              mode="single"
              selected={checkIn}
              onSelect={(d) => {
                setCheckIn(d)
                if (d && checkOut && d >= checkOut) setCheckOut(undefined)
              }}
              disabled={(date) => date < new Date(new Date().setHours(0, 0, 0, 0))}
              locale={locale}
            />
          </PopoverContent>
        </Popover>

        {/* ── CHECK-OUT ── */}
        <Popover>
          <PopoverTrigger asChild>
            <button
              type="button"
              className="flex items-center gap-3 px-5 py-4 border-b lg:border-b-0 lg:border-r border-border hover:bg-orange-50/40 transition-colors text-left w-full lg:w-auto lg:min-w-[148px]"
            >
              <Calendar className="w-5 h-5 text-primary shrink-0 mt-px" />
              <div>
                <span className={labelCls}>{t('checkOut')}</span>
                <span className={valueCls(!!checkOut)}>
                  {formatDate(checkOut) ?? t('selectDate')}
                </span>
              </div>
            </button>
          </PopoverTrigger>
          <PopoverContent className="w-auto p-0 bg-white border-border shadow-xl rounded-2xl" align="start" sideOffset={8}>
            <CalendarComponent
              mode="single"
              selected={checkOut}
              onSelect={setCheckOut}
              disabled={(date) => date <= (checkIn ?? new Date(new Date().setHours(0, 0, 0, 0)))}
              locale={locale}
            />
          </PopoverContent>
        </Popover>

        {/* ── GUESTS ── */}
        <Popover>
          <PopoverTrigger asChild>
            <button
              type="button"
              className="flex items-center gap-3 px-5 py-4 border-b lg:border-b-0 lg:border-r border-border hover:bg-orange-50/40 transition-colors text-left w-full lg:w-auto lg:min-w-[130px]"
            >
              <Users className="w-5 h-5 text-primary shrink-0 mt-px" />
              <div>
                <span className={labelCls}>{t('guests')}</span>
                <span className={valueCls(true)}>{getGuestsLabel()}</span>
              </div>
            </button>
          </PopoverTrigger>
          <PopoverContent className="w-56 bg-white border-border shadow-xl rounded-2xl p-4" align="start" sideOffset={8}>
            <div className="flex items-center justify-between gap-4">
              <div>
                <p className="text-sm font-semibold text-foreground">{t('guests')}</p>
                <p className="text-xs text-muted-foreground">Взрослые и дети</p>
              </div>
              <div className="flex items-center gap-3">
                <button type="button" className="num-btn" onClick={() => setGuests(g => Math.max(1, g - 1))} disabled={guests <= 1}>
                  <Minus className="w-3.5 h-3.5" />
                </button>
                <span className="text-foreground font-bold w-5 text-center text-sm">{guests}</span>
                <button type="button" className="num-btn" onClick={() => setGuests(g => Math.min(10, g + 1))} disabled={guests >= 10}>
                  <Plus className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          </PopoverContent>
        </Popover>

        {/* ── SEARCH BUTTON ── */}
        <div className="p-2 shrink-0">
          <button
            type="button"
            onClick={handleSearch}
            className="w-full lg:h-full lg:w-auto bg-primary hover:bg-primary/90 active:scale-[0.97] text-white font-bold px-8 py-3.5 rounded-xl flex items-center justify-center gap-2 transition-all shadow-md hover:shadow-lg text-[15px]"
          >
            <Search className="w-5 h-5" />
            {t('search')}
          </button>
        </div>
      </div>
    </div>
  )
}
