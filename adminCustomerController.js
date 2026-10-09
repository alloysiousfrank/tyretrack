const Invoice = require("../models/Invoice")

// GET ONE CUSTOMER'S FULL SERVICE HISTORY (for the admin customer detail
// page / downloadable report). :key is whatever customerKey getCustomers
// above grouped this customer under — their phone number if they have
// one on file, otherwise their lowercased name — so a click-through from
// that list always resolves to the same customer. Matches on either
// condition rather than guessing which one the key represents, so it
// works correctly regardless of which branch produced it.
exports.getCustomerHistory = async (req, res) => {

  try {

    const key = req.params.key

    const invoices = await Invoice.find({

      isPublished: true,

      $or: [
        { phone: key },
        { $expr: { $eq: [{ $toLower: "$customerName" }, key.toLowerCase()] } },
      ],

    }).sort({ createdAt: 1 }).lean()

    if (invoices.length === 0) {

      return res.json({
        success: true,
        customer: null,
        services: [],
        totalSpent: 0,
      })

    }

    const latest = invoices[invoices.length - 1]

    const services = []
    let totalSpent = 0

    invoices.forEach((invoice) => {

      totalSpent += Number(invoice.totalAmount || 0)

      ;(invoice.customServices || []).forEach((line) => {

        services.push({
          date: invoice.createdAt,
          invoiceId: invoice.invoiceId,
          // Lets the report detect customers billed for multiple vehicles
          vehicleNumber: invoice.vehicleNumber || "",
          serviceName: line.serviceName || "",
          quantity: line.quantity || 0,
          amount: line.amount || 0,
          total: line.total || 0,
        })

      })

    })

    res.json({

      success: true,

      customer: {
        name: latest.customerName,
        phone: latest.phone,
        email: latest.email,
        vehicleNumber: latest.vehicleNumber,
      },

      services,

      totalSpent,

    })

  } catch (error) {

    console.log(error)

    res.status(500).json({
      success: false,
    })

  }

}

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