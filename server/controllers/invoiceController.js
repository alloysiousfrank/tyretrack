const Invoice = require("../models/Invoice")
const Booking = require("../models/Booking")
const Inventory = require("../models/Inventory")
const {
  sendServiceCompletedWhatsApp,
} = require("../utils/whatsappMessages")
const { isConfigured } = require("../utils/whatsappService")

// ==============================
// CREATE INVOICE
// ==============================

exports.createInvoice = async (req, res) => {

  try {

    const now = new Date()

    const financialYear =
      now.getMonth() >= 3
        ? `${now.getFullYear()}-${String(now.getFullYear() + 1).slice(-2)}`
        : `${now.getFullYear() - 1}-${String(now.getFullYear()).slice(-2)}`

    let financialYearStart

    if (now.getMonth() >= 3) {
      financialYearStart = new Date(now.getFullYear(), 3, 1)
    } else {
      financialYearStart = new Date(now.getFullYear() - 1, 3, 1)
    }

    // ✅ GST invoices and non-GST invoices are numbered as two
    // completely separate sequences, per the owner's auditor's
    // requirement - a non-GST invoice must never take up a number
    // in the GST invoice series, and vice versa.
    const isGST = !!req.body.includeGST

    const lastInvoice = await Invoice.findOne({
      createdAt: { $gte: financialYearStart },
      includeGST: isGST,
    }).sort({ invoiceNumber: -1 })

    let nextNumber = 1

    if (lastInvoice) {
      nextNumber = (lastInvoice.invoiceNumber || 0) + 1
    }

    const invoiceId = isGST
      ? `INV-${financialYear}-${String(nextNumber).padStart(6, "0")}`
      : `NGST-${financialYear}-${String(nextNumber).padStart(6, "0")}`

    // =====================
    // STOCK VALIDATION
    // =====================

    if (req.body.tyreBrand && Number(req.body.tyreQuantity) > 0) {

      const tyreProduct = await Inventory.findOne({ brand: req.body.tyreBrand })

      if (!tyreProduct) {
        return res.status(400).json({
          success: false,
          message: "Selected tyre brand not found in inventory",
        })
      }

      if (tyreProduct.quantity < Number(req.body.tyreQuantity)) {
        return res.status(400).json({
          success: false,
          message: `Only ${tyreProduct.quantity} tyre(s) available in stock`,
        })
      }

    }

    // =====================
    // CUSTOM SERVICES
    // =====================

    const customServices = Array.isArray(req.body.customServices)
      ? req.body.customServices.map((service) => ({
          ...service,
          total:
            Number(service.quantity || 0) * Number(service.amount || 0),
        }))
      : []

    // =====================
    // CALCULATE TOTALS
    // =====================

    let subtotal = 0

    // All service totals come from the admin-entered line items.
    customServices.forEach((service) => {
      subtotal += Number(service.total || 0)
    })

    const gst = req.body.includeGST
      ? Number((subtotal * 0.18).toFixed(2))
      : 0

    const totalAmount = Number((subtotal + gst).toFixed(2))

    // =====================
    // CREATE INVOICE
    // =====================

    const invoice = await Invoice.create({
      ...req.body,
      subtotal,
      gst,
      totalAmount,
      tyrePrice: Number(req.body.tyrePrice || 0),
      email: req.body.email ? req.body.email.toLowerCase() : "",
      vehicleNumber: req.body.vehicleNumber
        ? req.body.vehicleNumber.toUpperCase()
        : "",
      status: "Completed",
      customServices,
      invoiceId,
      financialYear,
      invoiceNumber: nextNumber,
    })

    // =====================
    // STOCK DEDUCTION
    // =====================

    if (req.body.tyreBrand && Number(req.body.tyreQuantity) > 0) {

      const tyreProduct = await Inventory.findOne({ brand: req.body.tyreBrand })

      if (tyreProduct) {
        tyreProduct.quantity -= Number(req.body.tyreQuantity)
        await tyreProduct.save()
      }

    }

    // =====================
    // LINK TO BOOKING
    // =====================

    if (req.body.bookingId) {
      await Booking.findOneAndUpdate(
        { bookingId: req.body.bookingId },
        { invoiceId },
        { returnDocument: "after" }   // ✅ FIX: replaces deprecated { new: true }
      )
    }

    res.json({ success: true, invoice })

  } catch (error) {

    console.error("CREATE INVOICE ERROR:", error.message)
    console.error(error.stack)

    return res.status(500).json({
      success: false,
      message: error.message,
      stack: error.stack,
    })

  }

}

// ==============================
// GET ALL INVOICES
// ==============================

exports.getInvoices = async (req, res) => {

  try {

    const invoices = await Invoice.find().sort({ createdAt: -1 })

    res.json({ success: true, invoices })

  } catch (error) {

    console.error("GET INVOICES ERROR:", error.message)

    res.status(500).json({ success: false, message: error.message })

  }

}

// ==============================
// GET BY VEHICLE
// ==============================

exports.getInvoicesByVehicle = async (req, res) => {

  try {

    const invoices = await Invoice.find({
      vehicleNumber: req.params.vehicleNumber.toUpperCase(),
    }).sort({ createdAt: -1 })

    res.json({ success: true, invoices })

  } catch (error) {

    console.error("GET INVOICES BY VEHICLE ERROR:", error.message)

    res.status(500).json({ success: false, message: error.message })

  }

}

// ==============================
// GET BY ID
// ==============================

exports.getInvoiceById = async (req, res) => {

  try {

    const invoice = await Invoice.findById(req.params.id)

    if (!invoice) {
      return res.status(404).json({
        success: false,
        message: "Invoice not found",
      })
    }

    res.json({ success: true, invoice })

  } catch (error) {

    console.error("GET INVOICE BY ID ERROR:", error.message)

    res.status(500).json({ success: false, message: error.message })

  }

}

// ==============================
// GET BY CUSTOMER EMAIL
// ==============================

exports.getInvoicesByCustomer = async (req, res) => {

  try {

    // ✅ FIX: decode email param — frontend sends encodeURIComponent(email)
    const email = decodeURIComponent(req.params.email).toLowerCase()

    const invoices = await Invoice.find({ email }).sort({ createdAt: -1 })

    res.json({ success: true, invoices })

  } catch (error) {

    console.error("GET INVOICES BY CUSTOMER ERROR:", error.message)

    res.status(500).json({ success: false, message: error.message })

  }

}

// ==============================
// PUBLISH INVOICE
// ==============================

exports.publishInvoice = async (req, res) => {

  try {

    const invoice = await Invoice.findById(req.params.id)

    if (!invoice) {
      return res.status(404).json({
        success: false,
        message: "Invoice not found",
      })
    }

    await Invoice.findByIdAndUpdate(
      req.params.id,
      { isPublished: true, publishedAt: new Date() },
      { returnDocument: "after" }     // ✅ FIX: replaces deprecated { new: true }
    )

    if (invoice.bookingId) {
      await Booking.findOneAndUpdate(
        { bookingId: invoice.bookingId },
        {
          invoiceGenerated: true,
          invoiceId: invoice.invoiceId,
          status: "Completed",
          currentStage: 4,
          completed: true,
        },
        { returnDocument: "after" }   // ✅ FIX: replaces deprecated { new: true }
      )
    }

    // Fire the "service completed" WhatsApp text now - it needs no PDF,
    // so it can go out immediately on publish. The invoice PDF itself
    // is sent separately via POST /api/whatsapp/send-invoice once the
    // frontend has generated the PDF blob (see AdminInvoices.tsx).
    if (isConfigured() && invoice.phone) {

      try {

        await sendServiceCompletedWhatsApp({
          phone: invoice.phone,
          customerName: invoice.customerName,
          vehicleNumber: invoice.vehicleNumber,
        })

        console.log("Service completed WhatsApp sent successfully.")

      } catch (waError) {

        console.log("Service Completed WhatsApp Error:", waError.message)

      }

    }

    res.json({ success: true, message: "Invoice Published" })

  } catch (error) {

    console.error("PUBLISH INVOICE ERROR:", error.message)

    res.status(500).json({ success: false, message: error.message })

  }

}

// ==============================
// UPDATE INVOICE
// ==============================

exports.updateInvoice = async (req, res) => {

  try {

    const invoice = await Invoice.findByIdAndUpdate(
      req.params.id,
      req.body,
      { returnDocument: "after" }     // ✅ FIX: replaces deprecated { new: true }
    )

    res.json({ success: true, invoice })

  } catch (error) {

    console.error("UPDATE INVOICE ERROR:", error.message)

    res.status(500).json({ success: false, message: error.message })

  }

}