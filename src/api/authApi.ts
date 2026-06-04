const API_URL =
  "https://tyretrack-server.onrender.com/api/auth"

export const loginOrRegister = async (
  name: string,
  email: string,
  phone: string
) => {

  const response = await fetch(
    `${API_URL}/login`,
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