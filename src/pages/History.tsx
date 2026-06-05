import { useEffect, useState } from "react"
import { getUserBookings } from "../api/bookingApi"
import "./History.css"

export default function History() {

  const [bookings, setBookings] =
    useState<any[]>([])

  const [loading, setLoading] =
    useState(true)

  useEffect(() => {

    fetchHistory()

  }, [])

  const fetchHistory = async () => {

    try {

      const userEmail =
        localStorage.getItem(
          "userEmail"
        )

      if (!userEmail) {

        setLoading(false)

        return

      }

      const response =
        await getUserBookings(
          userEmail
        )

      if (response.success) {

        setBookings(
          response.bookings
        )

      }

    } catch (error) {

      console.log(error)

    } finally {

      setLoading(false)

    }

  }

  return (

    <div className="history-page">

      <div className="history-container">

        <h1>
          Service History
        </h1>

        {loading ? (

          <p>
            Loading...
          </p>

        ) : bookings.length === 0 ? (

          <p>
            No bookings found
          </p>

        ) : (

          bookings.map(
            (
              booking: any,
              index: number
            ) => (

              <div
                className="history-card"
                key={index}
              >

                <h2>
                  {booking.service}
                </h2>

                <p>
                  <strong>
                    Booking ID:
                  </strong>{" "}
                  {booking.bookingId}
                </p>

                <p>
                  <strong>
                    Date:
                  </strong>{" "}
                  {new Date(
                    booking.date
                  ).toLocaleDateString()}
                </p>

                <p>
                  <strong>
                    Time:
                  </strong>{" "}
                  {booking.time}
                </p>

                <p>
                  <strong>
                    Status:
                  </strong>{" "}
                  {booking.status}
                </p>

              </div>

            )
          )

        )}

      </div>

    </div>

  )

}