const API =
"https://tyretrack-server.onrender.com/api/bookings"

// CREATE BOOKING
export const createBooking = async (
  bookingData: any
) => {

  const response = await fetch(API, {

    method: "POST",

    headers: {
      "Content-Type": "application/json",
    },

    body: JSON.stringify(bookingData),

  })

  return response.json()

}

// GET BOOKINGS
export const getBookings = async () => {

  const response = await fetch(API)

  return response.json()

}

// GET USER BOOKINGS
export const getUserBookings =
  async (email: string) => {

  const response = await fetch(
    `${API}/user/${email}`
  )

  return response.json()

}