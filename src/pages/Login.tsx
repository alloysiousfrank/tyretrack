import { useState } from "react"
import "./Login.css"

import { sendOtp, verifyOtp } from "../api/authApi"

export default function Login() {

  const [name, setName] = useState("")
  const [email, setEmail] = useState("")
  const [phone, setPhone] = useState("")

  const [otp, setOtp] = useState("")
  const [otpSent, setOtpSent] = useState(false)

  // SEND OTP OR DIRECT LOGIN
const handleSendOtp = async () => {

  try {

    const data = await sendOtp(
      name,
      email,
      phone
    )

    console.log(data)

if (data.existingUser) {

  // SAVE TOKEN
  localStorage.setItem(
    "token",
    data.token
  )

  // SAVE USER DETAILS
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

  alert("Login Successful ✅")

  window.location.href = "/booking"

  return
}

    // NEW USER OTP
    if (data.success) {

      setOtpSent(true)

      alert("OTP Sent Successfully ✅")

    }

  } catch (error) {

    console.log(error)

    alert("Something went wrong")

  }

}



const handleVerifyOtp = async () => {

  try {

    const data = await verifyOtp(
      email,
      otp
    )

    console.log(data)

    if (data.success) {

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

      alert("OTP Verified ✅")

      window.location.href = "/booking"

    } else {

      alert(data.message)

    }

  } catch (error) {

    console.log(error)

    alert("Verification Failed")

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

        {otpSent && (

          <input
            type="text"
            placeholder="Enter OTP"
            value={otp}
            onChange={(e) =>
              setOtp(e.target.value)
            }
          />

        )}

        {!otpSent ? (

          <button onClick={handleSendOtp}>
            Send OTP
          </button>

        ) : (

          <button onClick={handleVerifyOtp}>
            Verify OTP
          </button>

        )}

      </div>

    </div>

  )

}