const API_URL =
  "https://tyretrack-server.onrender.com/api/auth"

export const sendOtp = async (
  name: string,
  email: string,
  phone: string
) => {

  const response = await fetch(
    `${API_URL}/send-otp`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        name,
        email,
        phone,
      }),
    }
  )

  return response.json()
}

export const verifyOtp = async (
  email: string,
  otp: string
) => {

  const response = await fetch(
    `${API_URL}/verify-otp`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        email,
        otp,
      }),
    }
  )

  return response.json()
}