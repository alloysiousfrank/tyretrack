const Booking = require("../models/Booking")
const User = require("../models/User")
const Invoice = require("../models/Invoice")

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

    // Revenue comes from actually-published invoices — not a flat
    // guess per completed booking. Draft (unpublished) invoices are
    // excluded since they aren't finalized yet.
    const revenueResult = await Invoice.aggregate([
      { $match: { isPublished: true } },
      { $group: { _id: null, total: { $sum: "$totalAmount" } } },
    ])

    const revenue = revenueResult[0]?.total || 0

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