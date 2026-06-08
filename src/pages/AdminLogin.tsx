import { useState } from "react"
import { useNavigate } from "react-router-dom"
import "./AdminLogin.css"

export default function AdminLogin() {

  const navigate = useNavigate()

  const [username, setUsername] = useState("")
  const [password, setPassword] = useState("")

const handleLogin = async (
  e: React.FormEvent
) => {

  e.preventDefault()

  try {

    const response =
      await fetch(
        "https://tyretrack-server.onrender.com/api/admin/login",
        {
          method: "POST",

          headers: {
            "Content-Type":
              "application/json",
          },

          body: JSON.stringify({
            username,
            password,
          }),
        }
      )

    const data =
      await response.json()

    if (!data.success) {

      alert(data.message)

      return

    }

    localStorage.setItem(
      "adminToken",
      data.token
    )

    localStorage.setItem(
      "adminRole",
      data.role
    )
    console.log("TOKEN:", data.token)
console.log("ROLE:", data.role)
    alert(
      `${data.role} Login Successful ✅`
    )
    console.log("NAVIGATING...")
window.location.href = "/admin"

  } catch (error) {

    console.log(error)

    alert("Login Failed")

  }

}

  return (

    <div className="admin-login-page">

      <div className="admin-login-card">

        <h1>TyreTrack Admin Login</h1>

        <form onSubmit={handleLogin}>

          <input
            type="text"
            placeholder="Username"
            value={username}
            onChange={(e) =>
              setUsername(e.target.value)
            }
            required
          />

          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) =>
              setPassword(e.target.value)
            }
            required
          />

          <button type="submit">
            Login
          </button>

        </form>

      </div>

    </div>

  )

}