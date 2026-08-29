const Booking = require("../models/Booking")
const Invoice = require("../models/Invoice")

exports.getDashboardStats = async (req, res) => {
  try {

    const totalBookings =
      await Booking.countDocuments()

    // "Total Users" = number of distinct customers who have had an
    // invoice generated for them — not registered app accounts. Names
    // are deduped case-insensitively (trimmed) so "Ramesh" and "ramesh "
    // count as the same customer, matching the same normalization used
    // by the customer-name search/autofill feature.
    const totalUsersResult = await Invoice.aggregate([
      { $match: { customerName: { $exists: true, $ne: "" } } },
      {
        $group: {
          _id: { $toLower: { $trim: { input: "$customerName" } } },
        },
      },
      { $count: "count" },
    ])

    const totalUsers = totalUsersResult[0]?.count || 0

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