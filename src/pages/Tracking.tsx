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

    const currentUserEmail =
      localStorage.getItem(
        "userEmail"
      )

    if (!currentUserEmail) return

    const response = await fetch(
      `https://tyretrack-server.onrender.com/api/bookings/user/${currentUserEmail}`
    )

    const data =
      await response.json()

    if (
      data.success &&
      data.bookings.length > 0
    ) {

      setBooking(
        data.bookings[0]
      )

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
              <h3>
  {new Date(
    booking.date
  ).toLocaleDateString()}
</h3>
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