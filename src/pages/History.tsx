import "./History.css"

export default function History() {

  const bookings =
    JSON.parse(localStorage.getItem("bookings") || "[]")

  return (
    <div className="history-page">

      <div className="history-container">

        <h1>Service History</h1>

        {bookings.length === 0 ? (

          <p>No bookings found</p>

        ) : (

          bookings.map((booking: any, index: number) => (

            <div className="history-card" key={index}>

              <h2>{booking.service}</h2>

              <p>
                <strong>Booking ID:</strong> {booking.bookingId}
              </p>

              <p>
                <strong>Date:</strong> {booking.date}
              </p>

              <p>
                <strong>Time:</strong> {booking.time}
              </p>

              <p>
                <strong>Status:</strong> {booking.status}
              </p>

            </div>

          ))

        )}

      </div>

    </div>
  )
}