const Booking = require("../models/Booking")
const {
  sendBookingConfirmationEmail,
} = require("../utils/emailService")

// CREATE BOOKING
exports.createBooking = async (req, res) => {

  try {

    const booking = await Booking.create(req.body)

    // Send Booking Confirmation Email
    try {

      await sendBookingConfirmationEmail({

        customerName: booking.name,

        email: booking.email,

        bookingId: booking.bookingId,

        vehicleNumber: booking.vehicleNumber,

        vehicleType: booking.vehicleType,

        service: booking.service,

        date: new Date(
          booking.date
        ).toLocaleDateString(),

        time: booking.time,

      })

      console.log(
        "Booking confirmation email sent successfully."
      )

    } catch (mailError) {

      console.log(
        "Booking Email Error:",
        mailError.message
      )

    }

    res.status(201).json({

      success: true,

      booking,

    })

  } catch (error) {

    console.log(error)

    res.status(500).json({

      success: false,

      message: "Booking Failed",

    })

  }

}
// GET ALL BOOKINGS
exports.getBookings = async (req, res) => {

  try {

    const bookings = await Booking.find().sort({
      createdAt: -1,
    })

    res.json(bookings)

  } catch (error) {

    console.log(error)

    res.status(500).json({
      success: false,
      message: "Failed to fetch bookings",
    })

  }

}

// GET USER BOOKINGS
exports.getUserBookings = async (req, res) => {

  try {

    const { email } = req.params

    const bookings = await Booking.find({
      email: email.toLowerCase(),
    }).sort({
      createdAt: -1,
    })

    res.json({
      success: true,
      bookings,
    })

  } catch (error) {

    console.log(error)

    res.status(500).json({
      success: false,
      message: "Failed to fetch user bookings",
    })

  }

}


// UPDATE BOOKING STATUS
exports.updateBookingStatus = async (req, res) => {

  try {

    const { bookingId } = req.params

    const updatedBooking =
      await Booking.findOneAndUpdate(
        { bookingId },
        req.body,
        { returnDocument: "after" }
      )

    res.json({
      success: true,
      booking: updatedBooking,
    })

  } catch (error) {

    console.log(error)

    res.status(500).json({
      success: false,
      message: "Update Failed",
    })

  }

}

// DELETE BOOKING
exports.deleteBooking = async (req, res) => {

  try {

    await Booking.findOneAndDelete({
      bookingId: req.params.bookingId,
    })

    res.json({
      success: true,
      message: "Booking Deleted",
    })

  } catch (error) {

    console.log(error)

    res.status(500).json({
      success: false,
      message: "Delete Failed",
    })

  }

}

exports.clearAllBookings = async (req, res) => {

  try {

    await Booking.deleteMany({})

    res.json({
      success: true,
      message: "All bookings deleted"
    })

  } catch (error) {

    console.log(error)

    res.status(500).json({
      success: false,
      message: "Failed to clear bookings"
    })

  }

}

