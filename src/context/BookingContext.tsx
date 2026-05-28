import { createContext, useContext, useState, useCallback, type ReactNode } from 'react'

export interface Booking {
  id: string
  name: string
  phone: string
  email: string
  vehicle: string
  service: string
  date: string
  time: string
  notes: string
  createdAt: string
}

interface BookingContextValue {
  bookings: Booking[]
  addBooking: (data: Omit<Booking, 'id' | 'createdAt'>) => string
  getBooking: (id: string) => Booking | undefined
}

const BookingContext = createContext<BookingContextValue | null>(null)
const STORAGE_KEY = 'tyretrack_bookings'

function loadBookings(): Booking[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    return raw ? JSON.parse(raw) : []
  } catch {
    return []
  }
}

export function BookingProvider({ children }: { children: ReactNode }) {
  const [bookings, setBookings] = useState<Booking[]>(loadBookings)

  const persist = useCallback((next: Booking[]) => {
    setBookings(next)
    localStorage.setItem(STORAGE_KEY, JSON.stringify(next))
  }, [])

  const addBooking = useCallback(
    (data: Omit<Booking, 'id' | 'createdAt'>) => {
      const id = `TT-${Date.now().toString(36).toUpperCase()}`
      const booking: Booking = {
        ...data,
        id,
        createdAt: new Date().toISOString(),
      }
      const next = [booking, ...bookings]
      persist(next)
      return id
    },
    [bookings, persist],
  )

  const getBooking = useCallback((id: string) => bookings.find((b) => b.id === id), [bookings])

  return (
    <BookingContext.Provider value={{ bookings, addBooking, getBooking }}>
      {children}
    </BookingContext.Provider>
  )
}

export function useBooking() {
  const ctx = useContext(BookingContext)
  if (!ctx) throw new Error('useBooking must be used within BookingProvider')
  return ctx
}
