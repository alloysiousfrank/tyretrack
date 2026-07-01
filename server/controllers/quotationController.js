const Quotation = require("../models/Quotation")

// ==============================
// CREATE QUOTATION
// ==============================

exports.createQuotation = async (req, res) => {

  try {

    const now = new Date()

    const financialYear =
      now.getMonth() >= 3
        ? `${now.getFullYear()}-${String(now.getFullYear() + 1).slice(-2)}`
        : `${now.getFullYear() - 1}-${String(now.getFullYear()).slice(-2)}`

    let financialYearStart

    if (now.getMonth() >= 3) {

      financialYearStart = new Date(
        now.getFullYear(),
        3,
        1
      )

    } else {

      financialYearStart = new Date(
        now.getFullYear() - 1,
        3,
        1
      )

    }

    const lastQuote =
      await Quotation.findOne({

        createdAt: {
          $gte: financialYearStart
        }

      }).sort({
        quoteNumber: -1
      })

    let nextNumber = 1

    if (lastQuote) {

      nextNumber =
        (lastQuote.quoteNumber || 0) + 1

    }

    const quoteId =
      `QT-${financialYear}-${String(nextNumber).padStart(6, "0")}`

    const quotation =
      await Quotation.create({

        ...req.body,

        quoteId,

        financialYear,

        quoteNumber: nextNumber

      })

    return res.json({

      success: true,

      quotation

    })

  }

  catch (error) {

    console.log(error)

    return res.status(500).json({

      success: false,

      message: error.message

    })

  }

}

// ==============================
// GET ALL QUOTATIONS
// ==============================

exports.getQuotations =
async (req, res) => {

  try {

    const quotations =
      await Quotation.find()
      .sort({
        createdAt: -1
      })

    return res.json({

      success: true,

      quotations

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

exports.updateQuotation =
async (req, res) => {

  try {

    const quotation =
      await Quotation.findByIdAndUpdate(

        req.params.id,

        req.body,

        {
          returnDocument: "after"
        }

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
// PUBLISH QUOTATION
// ==============================

exports.publishQuotation =
async (req, res) => {

  try {

    const quotation =
      await Quotation.findByIdAndUpdate(

        req.params.id,

        {

          isPublished: true,

          publishedAt: new Date(),

          status: "Published"

        },

        {
          returnDocument: "after"
        }

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