import { useEffect, useState } from "react"
import "./CurrentBooking.css"

export default function CurrentBooking() {

  const [booking, setBooking] = useState<any>(null)

  useEffect(() => {

    const fetchCurrentBooking = async () => {

      try {

        const userEmail =
          localStorage.getItem("userEmail")

        if (!userEmail) return

        const response = await fetch(
          `https://tyretrack-server.onrender.com/api/bookings/user/${userEmail}`
        )

        const data = await response.json()

        if (
          data.success &&
          data.bookings.length > 0
        ) {

          setBooking(data.bookings[0])

        }

      } catch (error) {

        console.log(error)

      }

    }

    fetchCurrentBooking()

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
                  {booking.status}
                </h3>
              </div>

            </div>

            <div className="booking-progress">
              <div className="progress-bar"></div>
            </div>

            <button
              className="track-booking-btn"
              onClick={() => {
                window.location.href = "/track"
              }}
            >
              Open Live Tracking
            </button>

            <button
              className="cancel-booking-btn"
              onClick={async () => {

                const confirmCancel =
                  window.confirm(
                    "Are you sure you want to cancel this booking?"
                  )

                if (!confirmCancel) return

                try {

                  await fetch(
                    `https://tyretrack-server.onrender.com/api/bookings/${booking.bookingId}`,
                    {
                      method: "DELETE",
                    }
                  )

                  alert(
                    "Booking Cancelled Successfully"
                  )

                  window.location.href =
                    "/booking"

                } catch (error) {

                  console.log(error)

                  alert(
                    "Failed to cancel booking"
                  )

                }

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