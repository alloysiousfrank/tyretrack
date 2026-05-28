import { useEffect, useState } from "react"
import "./Tracking.css"

export default function Tracking() {

  const [booking, setBooking] = useState<any>(null)

  const stages = [
    "Booking Confirmed",
    "Vehicle Received",
    "Service Started",
    "Quality Check",
    "Completed",
  ]

  useEffect(() => {

    const fetchLatestBooking = async () => {

      try {

        const token =
          localStorage.getItem("token")

        const response = await fetch(
          "http://localhost:5000/api/bookings"
        )

        const data = await response.json()

        if (data.length > 0) {

          // GET CURRENT USER EMAIL
          const currentUserEmail =
            localStorage.getItem("userEmail")

          // FIND CURRENT USER BOOKINGS
          const userBookings =
            data.filter(
              (item: any) =>
                item.email === currentUserEmail
            )

          if (userBookings.length > 0) {

            // LATEST BOOKING
            const latestBooking =
              userBookings[userBookings.length - 1]

            setBooking(latestBooking)

          }

        }

      } catch (error) {

        console.log(error)

      }

    }

    fetchLatestBooking()

    // AUTO REFRESH LIVE STATUS
    const interval = setInterval(() => {

      fetchLatestBooking()

    }, 3000)

    return () => clearInterval(interval)

  }, [])

  return (

    <div className="tracking-page">

      <div className="tracking-card">

        <h1>Live Service Tracking</h1>

        {!booking ? (

          <p className="no-booking">
            No active booking found
          </p>

        ) : (

          <div className="tracking-details">

            <div className="tracking-item">
              <span>Booking ID</span>
              <h3>{booking.bookingId}</h3>
            </div>

            <div className="tracking-item">
              <span>Customer</span>
              <h3>{booking.name}</h3>
            </div>

            <div className="tracking-item">
              <span>Service</span>
              <h3>{booking.service}</h3>
            </div>

            <div className="tracking-item">
              <span>Date</span>
              <h3>{booking.date}</h3>
            </div>

            <div className="tracking-item">
              <span>Time</span>
              <h3>{booking.time}</h3>
            </div>

            {/* LIVE TRACKING */}

            <div className="live-status">

              <div className="live-dot"></div>

              LIVE TRACKING ACTIVE

            </div>

            {/* PROGRESS */}

            <div className="tracking-progress">

              {stages.map((stage, index) => (

                <div
                  key={index}
                  className={`tracking-stage ${
                    index <= booking.currentStage
                      ? "active-stage"
                      : ""
                  }`}
                >

                  <div className="stage-circle"></div>

                  <p>{stage}</p>

                </div>

              ))}

            </div>

            {/* CURRENT STATUS */}

            <div className="tracking-current-status">

              Current Status :

              <span>
                {stages[booking.currentStage]}
              </span>

            </div>

          </div>

        )}

      </div>

    </div>

  )

}