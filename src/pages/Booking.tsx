import { useState } from "react"
import "./Booking.css"
import { createBooking } from "../api/bookingApi"
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

  const getSuggestedTime = (forDate: string) => {
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
    return `${hh}:${mm}`
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

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target

    if (name === "time") {
      setTimeManuallySet(true)
      setFormData({ ...formData, time: value })
      return
    }

    if (name === "date") {
      setFormData({
        ...formData,
        date: value,
        time: timeManuallySet ? formData.time : getSuggestedTime(value),
      })
      return
    }

    setFormData({ ...formData, [name]: value })
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      setLoading(true)

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
        time: getSuggestedTime(formData.date),
      })
      setTimeManuallySet(false)

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
          <input type="time" name="time" aria-label="Preferred Time" value={formData.time} onChange={handleChange} min="09:00" max="19:00" required />

          <button type="submit">{loading ? "Booking..." : "Book Now"}</button>
        </form>
      </div>
    </div>
  )
}