const express = require("express")

const router = express.Router()

const {
  createBooking,
  getBookings,
  updateBookingStatus,
  deleteBooking,
} = require("../controllers/bookingController")

// CREATE BOOKING
router.post("/", createBooking)

// GET BOOKINGS
router.get("/", getBookings)

// UPDATE STATUS
router.put("/:bookingId", updateBookingStatus)

// DELETE BOOKING
router.delete("/:bookingId", deleteBooking)

module.exports = router