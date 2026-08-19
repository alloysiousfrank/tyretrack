import { useEffect, useState } from "react"
import "./Booking.css"
import { createBooking, getBookedSlots } from "../api/bookingApi"
import { useSearchParams } from "react-router-dom"
export default function Booking() {

  const userName = localStorage.getItem("userName")
  const userEmail = localStorage.getItem("userEmail")
  const userPhone = localStorage.getItem("userPhone")
  const isLoggedIn = localStorage.getItem("isLoggedIn")

  const [loading, setLoading] = useState(false)
  const [searchParams] = useSearchParams()
  const selectedService = searchParams.get("service")

  if (!isLoggedIn || !userEmail) {
    window.location.href = `/login?service=${selectedService || ""}`
    return null
  }

  const today = new Date().toISOString().split("T")[0]

  // BUSINESS HOURS + SLOT INTERVAL CONFIG
  const BUSINESS_OPEN_HOUR = 9    // 9:00 AM
  const BUSINESS_CLOSE_HOUR = 19  // 7:00 PM
  const SLOT_INTERVAL_MINUTES = 30

  const getSuggestedTime = (forDate: string, takenTimes: string[] = []) => {
    const now = new Date()
    const isToday = forDate === today

    let hours = BUSINESS_OPEN_HOUR
    let minutes = 0

    if (isToday) {
      hours = now.getHours()
      minutes = now.getMinutes()

      const remainder = minutes % SLOT_INTERVAL_MINUTES
      minutes += remainder === 0 ? SLOT_INTERVAL_MINUTES : SLOT_INTERVAL_MINUTES - remainder

      if (minutes >= 60) {
        minutes -= 60
        hours += 1
      }
      if (hours < BUSINESS_OPEN_HOUR) {
        hours = BUSINESS_OPEN_HOUR
        minutes = 0
      }
      if (hours >= BUSINESS_CLOSE_HOUR) {
        hours = BUSINESS_OPEN_HOUR
        minutes = 0
      }
    }

    const hh = String(hours).padStart(2, "0")
    const mm = String(minutes).padStart(2, "0")
    const candidate = `${hh}:${mm}`

    // Skip past any slot that's already taken so the auto-filled time is
    // always one that's actually free, not just the next chronological one.
    return findNextAvailableTime(candidate, takenTimes)
  }

  // Walks forward in SLOT_INTERVAL_MINUTES steps from `fromTime` (inclusive)
  // within business hours until it finds a time that isn't in `takenTimes`.
  // If every remaining slot today is taken, it just returns `fromTime` —
  // the customer can still pick any time manually.
  const findNextAvailableTime = (fromTime: string, takenTimes: string[]) => {
    let [hours, minutes] = fromTime.split(":").map(Number)

    for (let i = 0; i < 48; i++) {
      if (hours >= BUSINESS_CLOSE_HOUR) {
        hours = BUSINESS_OPEN_HOUR
        minutes = 0
      }

      const hh = String(hours).padStart(2, "0")
      const mm = String(minutes).padStart(2, "0")
      const candidate = `${hh}:${mm}`

      if (!takenTimes.includes(candidate)) {
        return candidate
      }

      minutes += SLOT_INTERVAL_MINUTES
      if (minutes >= 60) {
        minutes -= 60
        hours += 1
      }
    }

    return fromTime
  }

  const serviceMap: any = {
    "wheel-alignment": "Wheel Alignment",
    "wheel-balancing": "Wheel Balancing",
    "multi-brand-tyres": "Multi Branded Tyres",
    "automatic-car-spa": "Automatic Car Spa",
    "foam-wash": "Foam Wash",
    "interior-cleaning": "Interior Cleaning",
    "teflon-coating": "Teflon Coating",
    "ceramic-coating": "Ceramic Coating",
  }

  const [formData, setFormData] = useState({
    name: userName || "",
    email: userEmail || "",
    phone: userPhone || "",
    vehicleNumber: "",
    vehicleType: "",
    service: serviceMap[selectedService || ""] || "",
    date: today,
    time: getSuggestedTime(today),
  })

  const [timeManuallySet, setTimeManuallySet] = useState(false)
  const [bookedTimes, setBookedTimes] = useState<string[]>([])
  const [slotConflict, setSlotConflict] = useState<{ suggested: string } | null>(null)

  // Keep the list of already-taken slots in sync with whichever date is
  // selected, and re-run the auto-fill suggestion (only while the
  // customer hasn't manually typed a time) so it never lands on a slot
  // someone else already booked.
  useEffect(() => {
    let cancelled = false

    const loadSlots = async () => {
      try {
        const res = await getBookedSlots(formData.date)
        if (cancelled) return
        const times: string[] = res.success ? res.times : []
        setBookedTimes(times)

        if (!timeManuallySet) {
          setFormData((prev) => ({
            ...prev,
            time: getSuggestedTime(prev.date, times),
          }))
        }
      } catch (error) {
        console.log(error)
      }
    }

    loadSlots()
    return () => {
      cancelled = true
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [formData.date])

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target

    if (name === "time") {
      setTimeManuallySet(true)
      setSlotConflict(null)
      setFormData({ ...formData, time: value })
      return
    }

    if (name === "date") {
      setFormData({
        ...formData,
        date: value,
        time: timeManuallySet ? formData.time : getSuggestedTime(value, bookedTimes),
      })
      setSlotConflict(null)
      return
    }

    setFormData({ ...formData, [name]: value })
  }

  // Runs once the customer finishes picking/typing a time. If it collides
  // with a slot someone else already booked, offer the next free slot
  // instead — but only apply it if they say OK.
  const handleTimeBlur = () => {
    if (!formData.time) return

    if (bookedTimes.includes(formData.time)) {
      const suggested = findNextAvailableTime(formData.time, bookedTimes)
      if (suggested !== formData.time) {
        setSlotConflict({ suggested })
      }
    } else {
      setSlotConflict(null)
    }
  }

  const acceptSuggestedSlot = () => {
    if (!slotConflict) return
    setFormData({ ...formData, time: slotConflict.suggested })
    setTimeManuallySet(true)
    setSlotConflict(null)
  }

  const keepOwnTime = () => {
    // Customer chose to keep the time they typed even though it collides.
    // Nothing to change here — the field already holds what they typed,
    // and they're free to keep editing it; we just close the notice.
    setSlotConflict(null)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      setLoading(true)

      // Final check right before booking — in case another customer took
      // this exact slot in the time since it was last checked.
      const latest = await getBookedSlots(formData.date)
      const latestTaken: string[] = latest.success ? latest.times : []
      if (latestTaken.includes(formData.time)) {
        const suggested = findNextAvailableTime(formData.time, latestTaken)
        setBookedTimes(latestTaken)
        setSlotConflict({ suggested })
        setLoading(false)
        return
      }

      const bookingId = "TYR" + Math.floor(Math.random() * 1000000)

      const bookingData = {
        ...formData,
        bookingId,
        status: "Booking Confirmed",
        currentStage: 0,
      }

      const response = await createBooking(bookingData)
      if (!response.success) {
        throw new Error(response.message || "Booking Failed")
      }

      alert(`Booking Confirmed ✅\n\nBooking ID: ${bookingId}`)

      setFormData({
        ...formData,
        vehicleNumber: "",
        vehicleType: "",
        service: "",
        time: getSuggestedTime(formData.date, [...latestTaken, formData.time]),
      })
      setTimeManuallySet(false)
      setSlotConflict(null)

      window.location.href = "/current-booking"
    } catch (error) {
      console.log(error)
      alert("Booking Failed")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="booking-page">
      <div className="booking-card">
        <h1>Book Your Service</h1>
        <form onSubmit={handleSubmit}>
          <input type="text" name="name" aria-label="Your Name" placeholder="Your Name" value={formData.name} onChange={handleChange} readOnly required />
          <input type="email" name="email" aria-label="Your Email" placeholder="Your Email" value={formData.email} onChange={handleChange} readOnly required />
          <input type="text" name="phone" aria-label="Phone Number" placeholder="Phone Number" value={formData.phone} onChange={handleChange} readOnly required />
          <input type="text" name="vehicleNumber" aria-label="Vehicle Number" placeholder="Vehicle Number" value={formData.vehicleNumber} onChange={handleChange} required />

          <select name="vehicleType" aria-label="Select Vehicle Type" value={formData.vehicleType} onChange={handleChange} required>
            <option value="">Select Vehicle Type</option>
            <option value="Bike">Bike</option>
            <option value="Car">Car</option>
          </select>

          <select name="service" aria-label="Select Service" value={formData.service} onChange={handleChange} required>
            <option value="">Select Service</option>
            <option value="Wheel Alignment">Wheel Alignment</option>
            <option value="Wheel Balancing">Wheel Balancing</option>
            <option value="Multi Branded Tyres">Multi Branded Tyres</option>
            <option value="Automatic Car Spa">Automatic Car Spa</option>
            <option value="Foam Wash">Foam Wash</option>
            <option value="Water Wash">Water Wash</option>
            <option value="Interior Cleaning">Interior Cleaning</option>
            <option value="Teflon Coating">Teflon Coating</option>
            <option value="Ceramic Coating">Ceramic Coating</option>
            <option value="General Service">General Service</option>
          </select>

          <input type="date" name="date" aria-label="Preferred Date" value={formData.date} onChange={handleChange} required />
          <input type="time" name="time" aria-label="Preferred Time" value={formData.time} onChange={handleChange} onBlur={handleTimeBlur} min="09:00" max="19:00" required />

          {slotConflict && (
            <div className="slot-conflict-box" role="alert">
              <p>
                That slot ({formData.time}) has already been taken. Would you like{" "}
                {slotConflict.suggested} instead?
              </p>
              <div className="slot-conflict-actions">
                <button type="button" className="slot-conflict-ok" onClick={acceptSuggestedSlot}>
                  OK
                </button>
                <button type="button" className="slot-conflict-cancel" onClick={keepOwnTime}>
                  Cancel
                </button>
              </div>
            </div>
          )}

          <button type="submit">{loading ? "Booking..." : "Book Now"}</button>
        </form>
      </div>
    </div>
  )
}