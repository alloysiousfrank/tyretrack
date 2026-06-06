import { useState } from "react"
import "./Booking.css"
import { createBooking } from "../api/bookingApi"
import { useSearchParams } from "react-router-dom"
export default function Booking() {

  // USER DATA FROM LOGIN
  const userName =
    localStorage.getItem("userName")

  const userEmail =
    localStorage.getItem("userEmail")

  const userPhone =
    localStorage.getItem("userPhone")

  const isLoggedIn =
    localStorage.getItem("isLoggedIn")

  const [loading, setLoading] =
    useState(false)

  const [searchParams] = useSearchParams()

  const selectedService =
    searchParams.get("service")

  // REDIRECT IF NOT LOGGED IN
  if (!isLoggedIn || !userEmail) {

    window.location.href =
      `/login?service=${selectedService || ""}`

    return null

  }

  // TODAY DATE AUTO
  const today =
    new Date().toISOString().split("T")[0]

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

  service:
  serviceMap[
    localStorage.getItem(
      "selectedService"
    ) || ""
  ] || "",

    date: today,

    time: "",

  })


  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLSelectElement
    >
  ) => {

    setFormData({

      ...formData,

      [e.target.name]: e.target.value,

    })

  }

  const handleSubmit = async (
    e: React.FormEvent
  ) => {

    e.preventDefault()

    try {

      setLoading(true)

      // BOOKING ID
      const bookingId =
        "TYR" +
        Math.floor(Math.random() * 1000000)

      const bookingData = {

        ...formData,

        bookingId,

        status: "Booking Confirmed",

        currentStage: 0,

      }

      // SAVE TO DATABASE
      const response =
  await createBooking(bookingData)

if (!response.success) {

  throw new Error(
    response.message ||
    "Booking Failed"
  )

}
      

      // SUCCESS
      alert(
        `Booking Confirmed ✅\n\nBooking ID: ${bookingId}`
      )

      // RESET ONLY SERVICE + TIME
      setFormData({

        ...formData,

        service: "",

        time: "",

      })

      // REDIRECT TO CURRENT BOOKING
      window.location.href =
        "/current-booking"

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

          <input
            type="text"
            name="name"
            placeholder="Your Name"
            value={formData.name}
            onChange={handleChange}
            readOnly
            required
          />

          <input
            type="email"
            name="email"
            placeholder="Your Email"
            value={formData.email}
            onChange={handleChange}
            readOnly
            required
          />

          <input
            type="text"
            name="phone"
            placeholder="Phone Number"
            value={formData.phone}
            onChange={handleChange}
            readOnly
            required
          />

          <select
            name="service"
            value={formData.service}
            onChange={handleChange}
            required
          >

            <option value="">
              Select Service
            </option>

            <option value="Wheel Alignment">
               Wheel Alignment
            </option>

            <option value="Wheel Balancing">
              Wheel Balancing
            </option>

            <option value="Multi Branded Tyres">
              Multi Branded Tyres
            </option>

            <option value="Automatic Car Spa">
              Automatic Car Spa
            </option>

            <option value="Foam Wash">
              Foam Wash
            </option>
            
            <option value="Interior Cleaning">
              Interior Cleaning
            </option>

            <option value="Teflon Coating">
              Teflon Coating
            </option>
            
            <option value="Ceramic Coating">
              Ceramic Coating
            </option>

          </select>

          <input
            type="date"
            name="date"
            value={formData.date}
            onChange={handleChange}
            required
          />

          <input
            type="time"
            name="time"
            value={formData.time}
            onChange={handleChange}
            required
          />

          <button type="submit">

            {loading
              ? "Booking..."
              : "Book Now"}

          </button>

        </form>

      </div>

    </div>

  )

}