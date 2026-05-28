const API_URL = "http://localhost:5000/api/bookings"

export async function getBookingById(bookingId: string) {
  const response = await fetch(`${API_URL}/${bookingId}`)

  return response.json()
}