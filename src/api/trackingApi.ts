const API_URL = "https://tyretrack-server.onrender.com"

export async function getBookingById(bookingId: string) {
  const response = await fetch(`${API_URL}/${bookingId}`)

  return response.json()
}