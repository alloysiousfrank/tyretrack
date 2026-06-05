import { useState } from "react"
import { useSearchParams } from "react-router-dom"
import "./Login.css"

import { loginOrRegister } from "../api/authApi"

export default function Login() {

  const [searchParams] =
  useSearchParams()

const selectedService =
  searchParams.get("service")

  const [name, setName] = useState("")
  const [email, setEmail] = useState("")
  const [phone, setPhone] = useState("")

  const [loading, setLoading] =
    useState(false)

  const handleLogin = async () => {

    try {

      setLoading(true)

      const data =
        await loginOrRegister(
          name,
          email,
          phone
        )

      console.log(data)

      if (!data.success) {

        alert(
          data.message ||
          "Login Failed"
        )

        return

      }

      localStorage.setItem(
        "token",
        data.token
      )

      localStorage.setItem(
        "userName",
        data.user.name
      )

      localStorage.setItem(
        "userEmail",
        data.user.email
      )

      localStorage.setItem(
        "userPhone",
        data.user.phone
      )

      localStorage.setItem(
        "isLoggedIn",
        "true"
      )

      if (data.existingUser) {

        alert(
          "Welcome Back ✅"
        )

      } else {

        alert(
          "Account Created Successfully ✅"
        )

      }

      if (selectedService) {

  localStorage.setItem(
    "selectedService",
    selectedService
  )

}

window.location.href =
  selectedService
    ? `/booking?service=${selectedService}`
    : "/booking"

    } catch (error) {

      console.log(error)

      alert(
        "Something went wrong"
      )

    } finally {

      setLoading(false)

    }

  }


  return (

    <div className="login-page">

      <div className="login-card">

        <h1>
          TyreTrack Login
        </h1>

        <input
          type="text"
          placeholder="Enter Name"
          value={name}
          onChange={(e) =>
            setName(e.target.value)
          }
        />

        <input
          type="email"
          placeholder="Enter Email"
          value={email}
          onChange={(e) =>
            setEmail(e.target.value)
          }
        />

        <input
          type="text"
          placeholder="Enter Phone Number"
          value={phone}
          onChange={(e) =>
            setPhone(e.target.value)
          }
        />

        <button
          onClick={handleLogin}
          disabled={loading}
        >

          {
            loading
              ? "Please Wait..."
              : "Continue"
          }

        </button>

      </div>

    </div>

  )

}
