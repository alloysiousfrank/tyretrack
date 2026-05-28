import { useEffect, useState } from "react"
import "./CurrentBooking.css"

export default function CurrentBooking() {

  const [booking, setBooking] = useState<any>(null)

  useEffect(() => {

    const bookings =
      JSON.parse(localStorage.getItem("bookings") || "[]")

    if (bookings.length > 0) {

      const activeBookings =
  bookings.filter(
    (booking: any) =>
      !booking.completed
  )

const latestBooking =
  activeBookings[
    activeBookings.length - 1
  ]

      setBooking(latestBooking)

    }

  }, [])

  return (

    <div className="current-booking-page">

      <div className="current-booking-card">

        <h1>Current Booking</h1>

        {!booking ? (

          <p className="no-booking">
            No Current Booking Found
          </p>

        ) : (

          <>

            <div className="booking-grid">

              <div className="booking-item">
                <span>Booking ID</span>
                <h3>{booking.bookingId}</h3>
              </div>

              <div className="booking-item">
                <span>Customer</span>
                <h3>{booking.name}</h3>
              </div>

              <div className="booking-item">
                <span>Email</span>
                <h3>{booking.email}</h3>
              </div>

              <div className="booking-item">
                <span>Phone</span>
                <h3>{booking.phone}</h3>
              </div>

              <div className="booking-item">
                <span>Service</span>
                <h3>{booking.service}</h3>
              </div>

              <div className="booking-item">
                <span>Date</span>
                <h3>{booking.date}</h3>
              </div>

              <div className="booking-item">
                <span>Time</span>
                <h3>{booking.time}</h3>
              </div>

              <div className="booking-item">
                <span>Status</span>
                <h3 className="status-active">
                  {
                    booking.status ||
                    "Booking Confirmed"
                  }
                </h3>
              </div>

            </div>

            <div className="booking-progress">

              <div className="progress-bar"></div>

            </div>

            <button
  className="cancel-booking-btn"
  onClick={() => {

    const confirmCancel =
      window.confirm(
        "Are you sure you want to cancel this booking?"
      )

    if (!confirmCancel) return

    const bookings =
      JSON.parse(localStorage.getItem("bookings") || "[]")

    const updatedBookings =
      bookings.filter(
        (item: any) =>
          item.bookingId !== booking.bookingId
      )

    localStorage.setItem(
      "bookings",
      JSON.stringify(updatedBookings)
    )

    alert("Booking Cancelled Successfully")

    window.location.href = "/booking"
  }}
>
  Cancel Booking
</button>

            <div className="booking-note">

              Your vehicle service is currently
              active and being processed.

            </div>

          </>

        )}

      </div>

    </div>

  )
}