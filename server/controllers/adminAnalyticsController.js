const Booking = require("../models/Booking")
const Invoice = require("../models/Invoice")

exports.getAnalytics = async (
  req,
  res
) => {

  try {

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

    // Popular service is based on what was actually billed on
    // published invoices, not just what customers originally
    // requested when booking (a booking can end up billed for a
    // different service than what was first requested).
    const serviceStats =
      await Invoice.aggregate([
        { $match: { isPublished: true } },
        { $unwind: "$services" },
        {
          $group: {
            _id: "$services",
            count: { $sum: 1 },
          },
        },
        { $sort: { count: -1 } },
      ])

    // Revenue comes from actually-published invoices — not a flat
    // guess per completed booking.
    const revenueResult = await Invoice.aggregate([
      { $match: { isPublished: true } },
      { $group: { _id: null, total: { $sum: "$totalAmount" } } },
    ])

    const revenue = revenueResult[0]?.total || 0

    const popularService =
      serviceStats[0]

    res.json({

      success: true,

      totalBookings,

      completedBookings,

      pendingBookings,

      revenue,

      popularService:
        popularService?._id ||
        "No Data",

      serviceStats,

    })

  } catch (error) {

    console.log(error)

    res.status(500).json({
      success: false,
    })

  }

}