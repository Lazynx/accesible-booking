import type { Metadata } from 'next'
import { DM_Sans, Playfair_Display } from 'next/font/google'
import { Analytics } from '@vercel/analytics/next'
import './globals.css'

const dmSans = DM_Sans({ 
  subsets: ['latin', 'latin-ext'],
  variable: '--font-dm-sans',
})

const playfairDisplay = Playfair_Display({ 
  subsets: ['latin', 'cyrillic'],
  variable: '--font-playfair',
})

export const metadata: Metadata = {
  title: 'STAYZ - Luxury Hotel Booking',
  description: 'Discover over 200 unique luxury hotels around the world. Book your dream stay at boutique hotels, resorts, and villas.',
  keywords: ['hotels', 'luxury', 'booking', 'travel', 'vacation', 'resort', 'boutique hotel'],
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="ru">
      <body className={`${dmSans.variable} ${playfairDisplay.variable} font-sans antialiased`}>
        {children}
        {process.env.NODE_ENV === 'production' && <Analytics />}
      </body>
    </html>
  )
}
