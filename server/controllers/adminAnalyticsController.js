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

// ==============================
// REVENUE TRENDS (for the charts dashboard)
// ==============================
// Only published invoices count — same "realized revenue" rule
// used everywhere else in the admin analytics.

exports.getRevenueTrends = async (req, res) => {

  try {

    // --- Monthly revenue, last 12 months (including zero-revenue months) ---
    const startOfWindow = new Date()
    startOfWindow.setMonth(startOfWindow.getMonth() - 11)
    startOfWindow.setDate(1)
    startOfWindow.setHours(0, 0, 0, 0)

    const monthlyRaw = await Invoice.aggregate([
      {
        $match: {
          isPublished: true,
          createdAt: { $gte: startOfWindow },
        },
      },
      {
        $group: {
          _id: {
            year: { $year: "$createdAt" },
            month: { $month: "$createdAt" },
          },
          revenue: { $sum: "$totalAmount" },
          invoiceCount: { $sum: 1 },
        },
      },
    ])

    const monthlyMap = new Map(
      monthlyRaw.map((entry) => [
        `${entry._id.year}-${entry._id.month}`,
        entry,
      ])
    )

    const monthNames = [
      "Jan", "Feb", "Mar", "Apr", "May", "Jun",
      "Jul", "Aug", "Sep", "Oct", "Nov", "Dec",
    ]

    const monthlyRevenue = []
    const cursor = new Date(startOfWindow)

    for (let i = 0; i < 12; i++) {
      const year = cursor.getFullYear()
      const month = cursor.getMonth() + 1
      const entry = monthlyMap.get(`${year}-${month}`)

      monthlyRevenue.push({
        month: `${monthNames[month - 1]} ${year}`,
        revenue: entry?.revenue || 0,
        invoiceCount: entry?.invoiceCount || 0,
      })

      cursor.setMonth(cursor.getMonth() + 1)
    }

    // --- GST vs non-GST revenue split ---
    const gstSplitRaw = await Invoice.aggregate([
      { $match: { isPublished: true } },
      {
        $group: {
          _id: "$includeGST",
          revenue: { $sum: "$totalAmount" },
          count: { $sum: 1 },
        },
      },
    ])

    const gstEntry = gstSplitRaw.find((e) => e._id === true)
    const nonGstEntry = gstSplitRaw.find((e) => e._id === false)

    const gstSplit = [
      { name: "GST Invoices", revenue: gstEntry?.revenue || 0, count: gstEntry?.count || 0 },
      { name: "Non-GST Invoices", revenue: nonGstEntry?.revenue || 0, count: nonGstEntry?.count || 0 },
    ]

    // --- Top services by actual billed revenue ---
    const serviceRevenue = await Invoice.aggregate([
      { $match: { isPublished: true } },
      { $unwind: "$customServices" },
      {
        $group: {
          _id: "$customServices.serviceName",
          revenue: { $sum: "$customServices.total" },
        },
      },
      { $match: { _id: { $nin: [null, ""] } } },
      { $sort: { revenue: -1 } },
      { $limit: 8 },
      { $project: { _id: 0, service: "$_id", revenue: 1 } },
    ])

    res.json({
      success: true,
      monthlyRevenue,
      gstSplit,
      serviceRevenue,
    })

  } catch (error) {

    console.log(error)

    res.status(500).json({
      success: false,
    })

  }

}

// ==============================
// DAILY REPORT (Reports page — Today / Yesterday / specific date)
// ==============================
// Business runs on IST, so "today" and day boundaries are computed in
// IST (+05:30), not the server's own timezone — otherwise a date
// picked as "today" in India could pull in the wrong day's invoices
// depending on where Render's servers are physically running.

const IST_OFFSET_MS = 5.5 * 60 * 60 * 1000

// Turns a "YYYY-MM-DD" string into the UTC instant that is midnight
// IST on that date, i.e. the correct start-of-day boundary for a
// Mongo query against createdAt (which is stored in UTC).
const istDateStringToUtcStart = (dateString) => {
  const [year, month, day] = dateString.split("-").map(Number)
  const utcMidnightForDate = Date.UTC(year, month - 1, day, 0, 0, 0, 0)
  return new Date(utcMidnightForDate - IST_OFFSET_MS)
}

exports.getDailyReport = async (req, res) => {

  try {

    const { date } = req.query

    if (!date || !/^\d{4}-\d{2}-\d{2}$/.test(date)) {
      return res.status(400).json({
        success: false,
        message: "Query param 'date' is required in YYYY-MM-DD format",
      })
    }

    const dayStart = istDateStringToUtcStart(date)
    const dayEnd = new Date(dayStart.getTime() + 24 * 60 * 60 * 1000)

    const dayMatch = {
      isPublished: true,
      createdAt: { $gte: dayStart, $lt: dayEnd },
    }

    // --- Summary: total revenue + invoice count for the day ---
    const summaryResult = await Invoice.aggregate([
      { $match: dayMatch },
      {
        $group: {
          _id: null,
          totalRevenue: { $sum: "$totalAmount" },
          invoiceCount: { $sum: 1 },
        },
      },
    ])

    const totalRevenue = summaryResult[0]?.totalRevenue || 0
    const invoiceCount = summaryResult[0]?.invoiceCount || 0

    // --- Hourly breakdown (0-23, IST), including zero-revenue hours ---
    const hourlyRaw = await Invoice.aggregate([
      { $match: dayMatch },
      {
        $group: {
          _id: {
            $hour: {
              date: "$createdAt",
              timezone: "+05:30",
            },
          },
          revenue: { $sum: "$totalAmount" },
          invoiceCount: { $sum: 1 },
        },
      },
    ])

    const hourlyMap = new Map(
      hourlyRaw.map((entry) => [entry._id, entry])
    )

    const hourlyRevenue = []
    for (let hour = 0; hour < 24; hour++) {
      const entry = hourlyMap.get(hour)
      hourlyRevenue.push({
        hour: `${String(hour).padStart(2, "0")}:00`,
        revenue: entry?.revenue || 0,
        invoiceCount: entry?.invoiceCount || 0,
      })
    }

    // --- GST vs non-GST split for the day ---
    const gstSplitRaw = await Invoice.aggregate([
      { $match: dayMatch },
      {
        $group: {
          _id: "$includeGST",
          revenue: { $sum: "$totalAmount" },
          count: { $sum: 1 },
        },
      },
    ])

    const gstEntry = gstSplitRaw.find((e) => e._id === true)
    const nonGstEntry = gstSplitRaw.find((e) => e._id === false)

    const gstSplit = [
      { name: "GST Invoices", revenue: gstEntry?.revenue || 0, count: gstEntry?.count || 0 },
      { name: "Non-GST Invoices", revenue: nonGstEntry?.revenue || 0, count: nonGstEntry?.count || 0 },
    ]

    // --- Top services billed that day ---
    const serviceRevenue = await Invoice.aggregate([
      { $match: dayMatch },
      { $unwind: "$customServices" },
      {
        $group: {
          _id: "$customServices.serviceName",
          revenue: { $sum: "$customServices.total" },
        },
      },
      { $match: { _id: { $nin: [null, ""] } } },
      { $sort: { revenue: -1 } },
      { $limit: 8 },
      { $project: { _id: 0, service: "$_id", revenue: 1 } },
    ])

    res.json({
      success: true,
      date,
      totalRevenue,
      invoiceCount,
      hourlyRevenue,
      gstSplit,
      serviceRevenue,
    })

  } catch (error) {

    console.log(error)

    res.status(500).json({
      success: false,
    })

  }

}