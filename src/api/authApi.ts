const API_URL =
  "https://tyretrack-server.onrender.com/api/auth"

export interface AuthResponse {
  success: boolean
  existingUser?: boolean
  token?: string
  message?: string
  user?: {
    name: string
    email: string
    phone: string
  }
}

export const loginOrRegister = async (
  name: string,
  email: string,
  phone: string
): Promise<AuthResponse> => {

  const response = await fetch(
    `${API_URL}/login`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        name: name.trim(),
        email: email.trim().toLowerCase(),
        phone: phone.trim(),
      }),
    }
  )

  if (!response.ok && response.status !== 400) {
    throw new Error(`Server error: ${response.status}`)
  }

  return response.json()
}