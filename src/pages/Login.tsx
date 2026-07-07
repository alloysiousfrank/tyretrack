import { useState } from "react"
import { useSearchParams, useNavigate } from "react-router-dom"
import "./Login.css"

import { loginOrRegister } from "../api/authApi"
import { useAuth } from "../context/AuthContext"

export default function Login() {

  const [searchParams] = useSearchParams()
  const navigate = useNavigate()
  const { login } = useAuth()

  const selectedService = searchParams.get("service")

  const [name, setName] = useState("")
  const [email, setEmail] = useState("")
  const [phone, setPhone] = useState("")
  const [loading, setLoading] = useState(false)

  const handleLogin = async () => {

    // ✅ FIX: validate inputs before hitting the API
    if (!email.trim() || !phone.trim()) {
      alert("Please enter your email and phone number")
      return
    }

    if (!email.includes("@")) {
      alert("Please enter a valid email address")
      return
    }

    try {

      setLoading(true)

      const data = await loginOrRegister(
        name,
        email,
        phone
      )

      if (!data.success) {
        alert(data.message || "Login Failed")
        return
      }

      // ✅ Store auth data
      localStorage.setItem("token", data.token!)
      localStorage.setItem("userName", data.user!.name)
      localStorage.setItem("userEmail", data.user!.email)
      localStorage.setItem("userPhone", data.user!.phone)
      localStorage.setItem("isLoggedIn", "true")

      // ✅ FIX: update AuthContext state (not just localStorage) so the
      // Navbar's isLoggedIn/profile dropdown reflects the login immediately
      login(data.user!.name)

      if (data.existingUser) {
        alert("Welcome Back ✅")
      } else {
        alert("Account Created Successfully ✅")
      }

      // ✅ FIX: use navigate() — no page reload, no race condition
      if (selectedService) {
        localStorage.setItem("selectedService", selectedService)
        navigate(`/booking?service=${selectedService}`)
      } else {
        navigate("/booking")
      }

    } catch (error) {
      console.error("Login error:", error)
      alert("Something went wrong. Please try again.")
    } finally {
      setLoading(false)
    }

  }

  return (

    <div className="login-page">

      <div className="login-card">

        <h1>TyreTrack Login</h1>

        <input
          type="text"
          placeholder="Enter Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />

        <input
          type="email"
          placeholder="Enter Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />

        <input
          type="text"
          placeholder="Enter Phone Number"
          value={phone}
          onChange={(e) => setPhone(e.target.value)}
        />

        <button
          onClick={handleLogin}
          disabled={loading}
        >
          {loading ? "Please Wait..." : "Continue"}
        </button>

      </div>

    </div>

  )

}