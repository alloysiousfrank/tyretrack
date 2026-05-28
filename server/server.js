const express = require("express")
const cors = require("cors")
require("dotenv").config()

const connectDB = require("./config/db")

const authRoutes = require("./routes/authRoutes")
const bookingRoutes = require("./routes/bookingRoutes")

const app = express()

connectDB()

// CORS FIX
app.use(
  cors({
    origin: [
      "http://localhost:5173",
      "https://tyretrackfrontend.vercel.app",
      "https://tyretrackfrontend-3s6rag82q-alloysious-frank-s-projects.vercel.app",
    ],
    credentials: true,
  })
)

app.use(express.json())

app.get("/", (req, res) => {
  res.json({
    message: "TyreTrack Server Running",
  })
})

// ROUTES
app.use("/api/auth", authRoutes)
app.use("/api/bookings", bookingRoutes)

const PORT = process.env.PORT || 5000

app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`)
})