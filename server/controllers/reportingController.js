const Invoice = require("../models/Invoice")
const Booking = require("../models/Booking")

// ==============================================================
// GET ALL PUBLISHED INVOICES — flat, BI-friendly shape
// ==============================================================
// Used by the Power BI Web.Contents query (see the setup guide). Only
// returns published invoices, same rule the admin dashboard's own
// revenue figures already follow, so a Power BI report built on this
// endpoint always reconciles with the live admin dashboard.
exports.getReportingInvoices = async (req, res) => {

  try {

    const invoices = await Invoice.find({
      isPublished: true,
    })
    .select(
      "invoiceId createdAt customerName phone vehicleNumber customServices includeGST subtotal gst totalAmount"
    )
    .sort({ createdAt: 1 })
    .lean()

    res.json({
      success: true,
      count: invoices.length,
      invoices,
    })

  } catch (error) {

    console.log(error)

    res.status(500).json({
      success: false,
      message: "Failed to fetch reporting invoices",
    })

  }

}

// ==============================================================
// GET ALL BOOKINGS — flat, BI-friendly shape
// ==============================================================
exports.getReportingBookings = async (req, res) => {

  try {

    const bookings = await Booking.find({
      cancelled: { $ne: true },
    })
    .select(
      "bookingId name vehicleType service date time price status createdAt"
    )
    .sort({ date: 1 })
    .lean()

    res.json({
      success: true,
      count: bookings.length,
      bookings,
    })

  } catch (error) {

    console.log(error)

    res.status(500).json({
      success: false,
      message: "Failed to fetch reporting bookings",
    })

  }

}
