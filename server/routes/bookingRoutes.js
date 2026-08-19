const express = require("express")

const router = express.Router()
const authMiddleware =
require("../middleware/authMiddleware")
const {
  createBooking,
  getBookings,
  getUserBookings,
  getBookedSlots,
  getBookingById,
  updateBookingStatus,
  deleteBooking,
  clearAllBookings,
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

// GET BOOKED TIME SLOTS FOR A DATE (public — used by the booking form
// to flag a slot another customer already took). Must stay above the
// "/:bookingId" route below, or "slots" gets matched as a bookingId.
router.get(
  "/slots/:date",
  getBookedSlots
)

// GET SINGLE BOOKING BY BOOKING ID (public - used by Live Tracking search)
router.get(
  "/:bookingId",
  getBookingById
)

// UPDATE STATUS
router.put(
 "/:bookingId",
 authMiddleware,
 updateBookingStatus
)

// CLEAR ALL BOOKINGS
router.delete(
 "/clear/all",
 authMiddleware,
 clearAllBookings
)

// DELETE SINGLE BOOKING
router.delete(
 "/:bookingId",
 authMiddleware,
 deleteBooking
)

module.exports = router