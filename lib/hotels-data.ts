export type HotelCategory = 'Boutique' | 'Resort' | 'Business' | 'Hostel' | 'Villa'

export type Amenity =
  | 'Pool'
  | 'Spa'
  | 'Gym'
  | 'WiFi'
  | 'Restaurant'
  | 'Bar'
  | 'Parking'
  | 'Beach Access'
  | 'Rooftop'
  | 'Pet Friendly'
  | 'Airport Shuttle'

export type AccessibilityFeature =
  | 'Wheelchair Accessible'
  | 'Accessible Bathroom'
  | 'Braille Signage'
  | 'Audio Guides'
  | 'Hearing Loop'
  | 'Sign Language Staff'
  | 'Accessible Parking'
  | 'Step-Free Access'
  | 'Visual Alerts'
  | 'Large Print Menus'

export interface Hotel {
  id: number
  name: string
  city: string
  country: string
  stars: 3 | 4 | 5
  pricePerNight: number
  rating: number
  reviewCount: number
  category: HotelCategory
  amenities: Amenity[]
  accessibility: AccessibilityFeature[]
  image: string
  description: string
}

const cities: { city: string; country: string }[] = [
  { city: 'Paris', country: 'France' },
  { city: 'Tokyo', country: 'Japan' },
  { city: 'Bali', country: 'Indonesia' },
  { city: 'New York', country: 'USA' },
  { city: 'Dubai', country: 'UAE' },
  { city: 'Barcelona', country: 'Spain' },
  { city: 'Santorini', country: 'Greece' },
  { city: 'Maldives', country: 'Maldives' },
  { city: 'London', country: 'UK' },
  { city: 'Bangkok', country: 'Thailand' },
  { city: 'Rome', country: 'Italy' },
  { city: 'Cape Town', country: 'South Africa' },
  { city: 'Sydney', country: 'Australia' },
  { city: 'Almaty', country: 'Kazakhstan' },
  { city: 'Istanbul', country: 'Turkey' },
]

const categories: HotelCategory[] = ['Boutique', 'Resort', 'Business', 'Hostel', 'Villa']

const allAmenities: Amenity[] = [
  'Pool', 'Spa', 'Gym', 'WiFi', 'Restaurant', 'Bar',
  'Parking', 'Beach Access', 'Rooftop', 'Pet Friendly', 'Airport Shuttle'
]

const allAccessibility: AccessibilityFeature[] = [
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

const hotelPrefixes = [
  'Grand', 'Royal', 'The', 'Hotel', 'Palace', 'Maison', 'Casa', 
  'Villa', 'Resort', 'Inn', 'Sanctuary', 'Haven', 'Oasis', 'Retreat'
]

const hotelSuffixes = [
  'Plaza', 'Suites', 'Residence', 'Gardens', 'Tower', 'Heights', 
  'View', 'House', 'Lodge', 'Manor', 'Estate', 'Collection'
]

const descriptions = [
  'A timeless sanctuary where modern luxury meets classic elegance.',
  'Nestled in the heart of the city, offering breathtaking panoramic views.',
  'Where every detail has been crafted for the discerning traveler.',
  'An intimate retreat that celebrates local culture and contemporary design.',
  'Experience unparalleled comfort in our meticulously designed spaces.',
  'A hidden gem offering personalized service and unforgettable experiences.',
  'Blending sophisticated style with warm, authentic hospitality.',
  'Your private escape featuring world-class amenities and serene surroundings.',
  'Where architectural beauty meets exceptional comfort and service.',
  'A curated experience designed for those who appreciate the finer things.',
  'Discover tranquility in our elegantly appointed accommodations.',
  'An oasis of calm in a vibrant cityscape.',
  'Luxury redefined with attention to every comfort.',
  'Where dreams of perfect getaways become reality.',
  'A masterpiece of design and hospitality excellence.',
]

function seededRandom(seed: number): () => number {
  return function() {
    seed = (seed * 9301 + 49297) % 233280
    return seed / 233280
  }
}

function getRandomItems<T>(arr: T[], count: number, random: () => number): T[] {
  const shuffled = [...arr].sort(() => random() - 0.5)
  return shuffled.slice(0, count)
}

function generateHotels(): Hotel[] {
  const hotels: Hotel[] = []
  
  for (let i = 1; i <= 200; i++) {
    const random = seededRandom(i * 12345)
    
    const cityData = cities[Math.floor(random() * cities.length)]
    const category = categories[Math.floor(random() * categories.length)]
    const prefix = hotelPrefixes[Math.floor(random() * hotelPrefixes.length)]
    const suffix = hotelSuffixes[Math.floor(random() * hotelSuffixes.length)]
    
    const stars = (Math.floor(random() * 3) + 3) as 3 | 4 | 5
    const amenityCount = Math.floor(random() * 4) + 3
    const amenities = getRandomItems(allAmenities, amenityCount, random)

    // Accessibility: ~60% of hotels have some features, higher-star more likely
    const accessibilityCount = stars === 5
      ? Math.floor(random() * 5) + 3
      : stars === 4
        ? Math.floor(random() * 4) + 1
        : random() > 0.4 ? Math.floor(random() * 3) + 1 : 0
    const accessibility = getRandomItems(allAccessibility, accessibilityCount, random)

    // Price based on category and stars
    let basePrice = 50
    if (category === 'Resort' || category === 'Villa') basePrice = 150
    else if (category === 'Boutique') basePrice = 100
    else if (category === 'Business') basePrice = 80

    const priceMultiplier = stars === 5 ? 3 : stars === 4 ? 2 : 1
    const pricePerNight = Math.floor(basePrice * priceMultiplier + random() * 300)

    const rating = Math.round((3.5 + random() * 1.5) * 10) / 10
    const reviewCount = Math.floor(10 + random() * 2390)

    hotels.push({
      id: i,
      name: `${prefix} ${cityData.city} ${suffix}`,
      city: cityData.city,
      country: cityData.country,
      stars,
      pricePerNight: Math.min(pricePerNight, 800),
      rating,
      reviewCount,
      category,
      amenities,
      accessibility,
      image: `https://picsum.photos/seed/hotel${i}/600/400`,
      description: descriptions[Math.floor(random() * descriptions.length)],
    })
  }
  
  return hotels
}

export const hotels = generateHotels()

export const uniqueCities = [...new Set(hotels.map(h => h.city))]
export const uniqueCountries = [...new Set(hotels.map(h => h.country))]
