import { useState } from "react"
import { useNavigate } from "react-router-dom"
import "./AdminLogin.css"

export default function AdminLogin() {

  const navigate = useNavigate()

  const [username, setUsername] = useState("")
  const [password, setPassword] = useState("")

  const handleLogin = (e: React.FormEvent) => {

    e.preventDefault()

    // OWNER ADMIN

    if (
      username === "admin" &&
      password === "12345"
    ) {

      localStorage.setItem(
        "adminLoggedIn",
        "true"
      )

      localStorage.setItem(
        "adminRole",
        "Admin"
      )

      alert("Admin Login Successful ✅")

      navigate("/admin")

    }

    // DEVELOPER LOGIN

    else if (
      username === "developer" &&
      password === "dev123"
    ) {

      localStorage.setItem(
        "adminLoggedIn",
        "true"
      )

      localStorage.setItem(
        "adminRole",
        "Developer"
      )

      alert("Developer Login Successful ✅")

      navigate("/admin")

    }

    else {

      alert("Invalid Credentials ❌")

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

        <div className="login-info">

          <p>
            Developer Access Enabled
          </p>

        </div>

      </div>

    </div>

  )

}