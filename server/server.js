const express = require("express")
const mongoose = require("mongoose")
const cors = require("cors")
require("dotenv").config()

const connectDB = require("./config/db")
const authRoutes = require("./routes/authRoutes")
const bookingRoutes = require("./routes/bookingRoutes")
const adminRoutes = require("./routes/adminRoutes")


const app = express()

// DATABASE
connectDB()

// CORS
app.use(
  cors({
    origin: [
      "http://localhost:5173",
      "https://tyretrack-neon.vercel.app",
      "https://tyretrackfrontend.vercel.app"
    ],
    credentials: true,
  })
)

app.use(express.json())

// ROUTES
app.use("/api/auth", authRoutes)
app.use("/api/bookings", bookingRoutes)
app.use("/api/admin", adminRoutes)

// TEST ROUTE
app.get("/", (req, res) => {
  res.send("TyreTrack Server Running")
})

const PORT = process.env.PORT || 5000

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})