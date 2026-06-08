import { useEffect, useState } from "react"
import { getBookings } from "../api/bookingApi"
import AdminSidebar from
"../components/admin/AdminSidebar"
const token =
  localStorage.getItem(
    "adminToken"
  )
import "./Admin.css"

export default function Admin() {

  const [bookings, setBookings] = useState<any[]>([])

  const [search, setSearch] = useState("")
  const [filter, setFilter] = useState("All")
const role =
  localStorage.getItem("adminRole")
  const serviceStages = [
    "Booking Confirmed",
    "Vehicle Received",
    "Service Started",
    "Quality Check",
    "Completed",
  ]

  // FETCH BOOKINGS
useEffect(() => {

  fetchBookings()

}, [])

const fetchBookings = async () => {

  try {

    const response = await fetch(
      "https://tyretrack-server.onrender.com/api/bookings"
    )

    const data = await response.json()

    setBookings(data)

  } catch (error) {

    console.log(error)

  }

}

  // UPDATE STATUS
const updateBookingStatus = async (bookingId: string) => {

  try {

    const updatedBookings = bookings.map((booking) => {

      if (booking.bookingId === bookingId) {

        let nextStage = booking.currentStage || 0

        if (nextStage < serviceStages.length - 1) {
          nextStage += 1
        }

        return {
          ...booking,
          currentStage: nextStage,
          status: serviceStages[nextStage],
        }

      }

      return booking

    })

    // UPDATE STATE
    setBookings(updatedBookings)

    // FIND UPDATED BOOKING
    const updatedBooking = updatedBookings.find(
      (booking) => booking.bookingId === bookingId
    )

    // UPDATE DATABASE
    await fetch(
      `https://tyretrack-server.onrender.com/api/bookings/${bookingId}`,
      {
        method: "PUT",

        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },

        body: JSON.stringify({
          currentStage: updatedBooking.currentStage,
          status: updatedBooking.status,
        }),
      }
    )

    alert("Service Updated Successfully ✅")

  } catch (error) {

    console.log(error)

    alert("Update Failed")

  }

}

const clearAllBookings = async () => {

  const confirmDelete =
    window.confirm(
      "Clear all bookings permanently?"
    )

  if (!confirmDelete) return

  try {
const token =
  localStorage.getItem("adminToken")
    await fetch(
      "https://tyretrack-server.onrender.com/api/bookings/clear/all",
      {
        method: "DELETE",

        headers: {
     Authorization:
       `Bearer ${token}`
    }     
  }

    )
    setBookings([])


    alert("All bookings cleared")

  } catch (error) {

    console.log(error)

    alert("Failed to clear bookings")

  }

}

  // DELETE BOOKING
const deleteBookingHandler = async (
  bookingId: string
) => {

  try {

    const confirmDelete =
      window.confirm(
        "Delete this booking?"
      )

    if (!confirmDelete) return
const token =
  localStorage.getItem("adminToken")
    await fetch(
      `https://tyretrack-server.onrender.com/api/bookings/${bookingId}`,
      {
        method: "DELETE",

        headers: {
      Authorization:
        `Bearer ${token}`,
    },
      }
    )

    fetchBookings()

  } catch (error) {

    console.log(error)

  }

}

  // LOGOUT
const handleAdminLogout = () => {

  localStorage.removeItem(
  "adminToken"
)

localStorage.removeItem(
  "adminRole"
)

window.location.href =
"/admin-login"

}
  // STATS
  const completedBookings =
    bookings.filter(
      (booking) =>
        booking.status === "Completed"
    ).length

  const pendingBookings =
    bookings.filter(
      (booking) =>
        booking.status !== "Completed"
    ).length

  const totalRevenue =
    completedBookings * 2500

  // FILTER
  const filteredBookings =
    bookings.filter((booking) => {

      const matchesSearch =
        booking.bookingId
          ?.toLowerCase()
          .includes(
            search.toLowerCase()
          )

      const matchesFilter =
        filter === "All"
          ? true
          : booking.status === filter

      return (
        matchesSearch &&
        matchesFilter
      )

    })

  return (
<>
<AdminSidebar />

<div
 className="admin-page"
 style={{
  marginLeft: "270px"
 }}
>

      <div className="admin-container">

        <div className="admin-header">

          <h1>
            TyreTrack Admin Dashboard
          </h1>

          {role === "Admin" && (

<button
  className="clear-btn"
  onClick={clearAllBookings}
>
  Clear All Bookings
</button>

)}

          <button
            className="admin-logout-btn"
            onClick={handleAdminLogout}
          >
            Logout
          </button>

        </div>

        {/* STATS */}

        <div className="admin-stats">

          <div className="stat-card">
            <h3>Total Bookings</h3>
            <p>{bookings.length}</p>
          </div>

          <div className="stat-card">
            <h3>Completed</h3>
            <p>{completedBookings}</p>
          </div>

          <div className="stat-card">
            <h3>Pending</h3>
            <p>{pendingBookings}</p>
          </div>

          <div className="stat-card">
            <h3>Revenue</h3>
            <p>₹ {totalRevenue}</p>
          </div>

        </div>

        {/* CONTROLS */}

        <div className="admin-controls">

          <input
            type="text"
            placeholder="Search Booking ID..."
            value={search}
            onChange={(e) =>
              setSearch(e.target.value)
            }
            className="admin-search"
          />

          <select
            className="filter-select"
            value={filter}
            onChange={(e) =>
              setFilter(e.target.value)
            }
          >

            <option value="All">
              All
            </option>

            <option value="Booking Confirmed">
              Booking Confirmed
            </option>

            <option value="Vehicle Received">
              Vehicle Received
            </option>

            <option value="Service Started">
              Service Started
            </option>

            <option value="Quality Check">
              Quality Check
            </option>

            <option value="Completed">
              Completed
            </option>

          </select>

        </div>

        {/* BOOKINGS */}

        {bookings.length === 0 ? (

          <p className="no-bookings">
            No bookings available
          </p>

        ) : (

          <div className="admin-bookings">

            {filteredBookings.map(
              (booking, index) => (

                <div
                  key={index}
                  className="admin-card"
                >

                  <div className="admin-top">

                    <div>

                      <span>
                        Booking ID
                      </span>

                      <h2>
                        {booking.bookingId}
                      </h2>

                    </div>

                    <div className="status-badge">

                      {
                        serviceStages[
                          booking.currentStage || 0
                        ]
                      }

                    </div>

                  </div>

                  <div className="admin-details">

                    <p>
                      <strong>
                        Customer:
                      </strong>
                      {booking.name}
                    </p>

                    <p>
                      <strong>
                        Email:
                      </strong>
                      {booking.email}
                    </p>

                    <p>
                      <strong>
                        Phone:
                      </strong>
                      {booking.phone}
                    </p>

                    <p>
                      <strong>
                        Service:
                      </strong>
                      {booking.service}
                    </p>

                    <p>
                      <strong>
                        Date:
                      </strong>
                      {booking.date}
                    </p>

                    <p>
                      <strong>
                        Time:
                      </strong>
                      {booking.time}
                    </p>

                    <p>
                      <strong>
                        Vehicle Number:
                      </strong>
                      {booking.vehicleNumber || "Not Added"}
                    </p>

                    <p>
                      <strong>
                        Price:
                      </strong>
                      ₹{booking.price || "2500"}
                    </p>

                    <p>
                      <strong>
                        Status:
                      </strong>
                      {booking.status}
                    </p>

                  </div>

                  <div className="admin-actions">

                    <button
                      className="update-btn"
                      onClick={() =>
                        updateBookingStatus(
                          booking.bookingId
                        )
                      }
                    >
                      Update Service Status
                    </button>

{role === "Admin" && (

<button
  className="delete-booking-btn"
  onClick={() =>
    deleteBookingHandler(
      booking.bookingId
    )
  }
>
  Delete Booking
</button>

)}

                  </div>

                </div>

              )
            )}

          </div>

        )}

      </div>

    </div>

</>

)

}