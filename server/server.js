const express = require("express")
const cors = require("cors")
require("dotenv").config()

const connectDB = require("./config/db")
const authRoutes = require("./routes/authRoutes")
const bookingRoutes = require("./routes/bookingRoutes")

const app = express()

// DATABASE
connectDB()

// MIDDLEWARE
app.use(
  cors({
    origin: [
      "https://tyretrackfrontend.vercel.app",
    ],
    credentials: true,
  })
)
app.use(express.json())

// ROUTES
app.use("/api/auth", authRoutes)
app.use("/api/bookings", bookingRoutes)

app.get("/", (req, res) => {
  res.json({
    success: true,
    message: "TyreTrack Server Running",
  })
})

app.get("/api/health", (req, res) => {
  res.json({
    success: true,
    message: "Server Healthy",
  })
})

const PORT = process.env.PORT || 5000

app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`)
})