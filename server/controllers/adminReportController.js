const Booking = require("../models/Booking")
const Invoice = require("../models/Invoice")

exports.getReports = async (req,res)=>{

  try {

    // "Total Users" = distinct customers who have had an invoice
    // generated for them (same definition/normalization as the
    // dashboard stats and the customer-name search/autofill feature),
    // not registered app accounts.
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

    // Revenue comes from actually-published invoices — not a flat
    // ₹2500-per-booking guess.
    const revenueResult = await Invoice.aggregate([
      { $match: { isPublished: true } },
      { $group: { _id: null, total: { $sum: "$totalAmount" } } },
    ])

    const revenue = revenueResult[0]?.total || 0

    res.json({
      success: true,
      totalUsers,
      totalBookings,
      completedBookings,
      pendingBookings,
      revenue
    })

  } catch (error) {

    console.log(error)

    res.status(500).json({
      success: false,
    })

  }

}
