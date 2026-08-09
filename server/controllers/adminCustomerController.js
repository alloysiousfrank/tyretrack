const Invoice = require("../models/Invoice")

exports.getCustomers = async (req, res) => {

  try {

    // Built from actual invoices, not just registered logins — a
    // walk-in customer the admin billed directly (no account signup)
    // still shows up here. Grouped by phone number where we have one,
    // since that's the most reliable way to tell two customers apart
    // (falls back to name if a record has no phone on file).
    const customers = await Invoice.aggregate([

      { $sort: { createdAt: -1 } },

      {
        $addFields: {
          customerKey: {
            $cond: [
              { $and: [
                { $ne: ["$phone", null] },
                { $ne: ["$phone", ""] },
              ] },
              "$phone",
              { $toLower: "$customerName" },
            ],
          },
        },
      },

      {
        $group: {
          _id: "$customerKey",
          name: { $first: "$customerName" },
          phone: { $first: "$phone" },
          email: { $first: "$email" },
          totalInvoices: { $sum: 1 },
          totalSpent: {
            $sum: {
              $cond: ["$isPublished", "$totalAmount", 0],
            },
          },
          lastVisit: { $first: "$createdAt" },
          joinedDate: { $last: "$createdAt" },
        },
      },

      { $sort: { lastVisit: -1 } },

    ])

    res.json({
      success: true,
      customers,
    })

  } catch (error) {

    console.log(error)

    res.status(500).json({
      success: false,
    })

  }

}