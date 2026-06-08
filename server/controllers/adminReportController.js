const Booking = require("../models/Booking")
const User = require("../models/User")

exports.getReports = async (req,res)=>{

  const totalUsers =
    await User.countDocuments()

  const totalBookings =
    await Booking.countDocuments()

  const completedBookings =
    await Booking.countDocuments({
      status:"Completed"
    })

  const pendingBookings =
    await Booking.countDocuments({
      status:{
        $ne:"Completed"
      }
    })

  const revenue =
    completedBookings * 2500

  res.json({
    totalUsers,
    totalBookings,
    completedBookings,
    pendingBookings,
    revenue
  })

}
const {
 getReports
}
=
require(
 "../controllers/adminReportController"
)

router.get(
 "/reports",
 getReports
)