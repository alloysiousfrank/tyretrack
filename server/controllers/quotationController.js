const mongoose = require("mongoose")
const Quotation = require("../models/Quotation")
const Counter = require("../models/Counter")

// ==============================
// CREATE QUOTATION
// ==============================
// Used by both the public "Get a Quote" page and the admin's own
// "Create Quotation" flow — both hit this same function, so both need
// to share one safe, atomic sequence rather than each computing "last
// quote number + 1" independently, which is exactly what could let
// a customer submission and an admin-created quote collide on the
// same quoteId if they happened close together.
//
// Same transactional counter pattern used for invoice numbering
// (server/controllers/invoiceController.js) and for the same reason:
// findOne().sort() + increment in JS is not atomic, so two nearly-
// simultaneous requests could read the same "last number" and race.
// Wrapping the counter increment and the insert in one MongoDB
// transaction means a failed insert can never leave the counter
// pointing past reality — if the insert fails, the whole transaction,
// counter increment included, rolls back together.

exports.createQuotation = async (req, res) => {

  try {

    const now = new Date()

    const financialYear =
      now.getMonth() >= 3
        ? `${now.getFullYear()}-${String(now.getFullYear() + 1).slice(-2)}`
        : `${now.getFullYear() - 1}-${String(now.getFullYear()).slice(-2)}`

    const counterKey = `${financialYear}_QUOTE`

    let quotation
    let nextNumber
    let quoteId
    const MAX_ATTEMPTS = 5

    for (let attempt = 1; attempt <= MAX_ATTEMPTS; attempt++) {

      const session = await mongoose.startSession()

      try {

        await session.withTransaction(async () => {

          const counter = await Counter.findOneAndUpdate(
            { _id: counterKey },
            { $inc: { seq: 1 } },
            { new: true, upsert: true, session }
          )

          nextNumber = counter.seq
          quoteId = `QT-${financialYear}-${String(nextNumber).padStart(6, "0")}`

          const created = await Quotation.create([{

            ...req.body,

            customerName: req.body.customerName || "",

            phone: req.body.phone || "",

            email: req.body.email ? req.body.email.toLowerCase() : "",

            vehicleNumber: req.body.vehicleNumber
              ? req.body.vehicleNumber.toUpperCase()
              : "",

            quoteId,

            quoteNumber: nextNumber,

            financialYear,

            quoteStatus: "Pending"

          }], { session })

          quotation = created[0]

        })

        await session.endSession()
        break // success — counter and quotation committed together

      } catch (err) {

        await session.endSession()

        const isDuplicateQuoteId =
          err.code === 11000 && err.message.includes("quoteId")

        if (isDuplicateQuoteId && attempt < MAX_ATTEMPTS) {
          // Whole transaction rolled back, including the counter
          // increment — no number was lost, loop again for a fresh one.
          continue
        }

        throw err

      }

    }

    res.json({

      success: true,

      quotation

    })

  }

  catch (error) {

    console.log(error)

    res.status(500).json({

      success: false,

      message: error.message

    })

  }

}

// ==============================
// GET ALL QUOTATIONS
// ==============================

exports.getQuotations = async (req, res) => {

  try {

    const quotations =
      await Quotation.find()

      .sort({

        createdAt: -1

      })

    res.json({

      success: true,

      quotations

    })

  }

  catch (error) {

    res.status(500).json({

      success: false,

      message: error.message

    })

  }

}

// ==============================
// GET SINGLE QUOTATION
// ==============================

exports.getQuotationById =
async (req, res) => {

  try {

    const quotation =
      await Quotation.findById(
        req.params.id
      )

    return res.json({

      success: true,

      quotation

    })

  }

  catch (error) {

    console.log(error)

    return res.status(500).json({

      success: false

    })

  }

}

// ==============================
// UPDATE QUOTATION
// ==============================

exports.updateQuotation = async (req, res) => {

  try {

    const {

      tyrePrice,

      tyreQuantity,

      labourCharge,

      accessoriesCharge,

      discount,

      includeGST,

      adminRemarks

    } = req.body

    const subtotal =

      (Number(tyrePrice) * Number(tyreQuantity))

      +

      Number(labourCharge)

      +

      Number(accessoriesCharge)

      -

      Number(discount)

    const gst =

      includeGST

      ? Number((subtotal * 0.18).toFixed(2))

      : 0

    const totalAmount =

      Number((subtotal + gst).toFixed(2))

    const quotation =

      await Quotation.findByIdAndUpdate(

        req.params.id,

        {

          ...req.body,

          subtotal,

          gst,

          totalAmount,

          quoteStatus: "Draft"

        },

        {

          returnDocument: "after"

        }

      )

    res.json({

      success: true,

      quotation

    })

  }

  catch (error) {

    console.log(error)

    res.status(500).json({

      success: false,

      message: error.message

    })

  }

}

// ==============================
// PUBLISH QUOTATION
// ==============================

exports.publishQuotation = async (req, res) => {

  try {

    const quotation =
      await Quotation.findByIdAndUpdate(

        req.params.id,

        {

          quoteStatus: "Published",

          isPublished: true,

          publishedAt: new Date()

        },

        {
          returnDocument: "after"
        }

      )

    res.json({

      success: true,

      quotation

    })

  }

  catch (error) {

    res.status(500).json({

      success: false,

      message: error.message

    })

  }

}

// ==============================
// DELETE QUOTATION
// ==============================

exports.deleteQuotation =
async (req, res) => {

  try {

    await Quotation.findByIdAndDelete(
      req.params.id
    )

    return res.json({

      success: true,

      message: "Quotation Deleted"

    })

  }

  catch (error) {

    console.log(error)

    return res.status(500).json({

      success: false

    })

  }

}