const Booking = require("../models/Booking")
const User = require("../models/User")

exports.getDashboardStats = async (req, res) => {
  try {

    const totalBookings =
      await Booking.countDocuments()

    const totalUsers =
      await User.countDocuments()

    const completedBookings =
      await Booking.countDocuments({
        status: "Completed",
      })

    const pendingBookings =
      await Booking.countDocuments({
        status: {
          $ne: "Completed",
        },
      })

    const bookings =
await Booking.find()

let revenue = 0

bookings.forEach(
 booking => {

  if (
   booking.status ===
   "Completed"
  ) {

   revenue +=
   Number(
    booking.price || 2500
   )

  }

 })

    res.json({
      success: true,

      totalBookings,
      totalUsers,
      completedBookings,
      pendingBookings,
      revenue,
    })

  } catch (error) {

    console.log(error)

    res.status(500).json({
      success: false,
      message: "Failed",
    })

  }
}