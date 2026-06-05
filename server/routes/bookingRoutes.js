const express = require("express")

const router = express.Router()

const {
  createBooking,
  getBookings,
  getUserBookings,
  updateBookingStatus,
  deleteBooking,
} = require("../controllers/bookingController")

// CREATE BOOKING
router.post("/", createBooking)

// GET ALL BOOKINGS
router.get("/", getBookings)

// GET USER BOOKINGS
router.get(
  "/user/:email",
  getUserBookings
)

// UPDATE STATUS
router.put(
  "/:bookingId",
  updateBookingStatus
)
router.delete(
  "/clear/all",
  clearAllBookings
)
// DELETE BOOKING
router.delete(
  "/:bookingId",
  deleteBooking
)

module.exports = router