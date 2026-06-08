const Booking = require("../models/Booking")
const User = require("../models/User")

exports.getReports = async (
  req,
  res
) => {

  try {

    const totalUsers =
      await User.countDocuments()

    const totalBookings =
      await Booking.countDocuments()

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

    let revenue = 0

    const completed =
      await Booking.find({
        status: "Completed",
      })

    completed.forEach(
      booking => {

        revenue += Number(
          booking.price || 2500
        )

      }
    )

    res.json({

      success: true,

      totalUsers,

      totalBookings,

      completedBookings,

      pendingBookings,

      revenue,

    })

  } catch (error) {

    console.log(error)

    res.status(500).json({
      success: false,
    })

  }

}