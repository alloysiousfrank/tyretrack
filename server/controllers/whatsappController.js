const {
  sendInvoiceWhatsApp,
  sendQuotationWhatsApp,
  sendServiceCompletedWhatsApp,
} = require("../utils/whatsappMessages")
const { isConfigured } = require("../utils/whatsappService")

// ==============================
// SEND INVOICE PDF OVER WHATSAPP
// ==============================
// Mirrors POST /api/invoices/send-email - expects the PDF as a
// multipart "invoice" file field (same blob the frontend already
// generates via generateInvoicePdf), plus phone/customerName/invoiceId/
// totalAmount in the body.
exports.sendInvoiceWhatsApp = async (req, res) => {

  try {

    if (!isConfigured()) {
      return res.status(503).json({
        success: false,
        message: "WhatsApp is not configured on the server yet.",
      })
    }

    const { phone, customerName, invoiceId, totalAmount } = req.body

    if (!phone) {
      return res.status(400).json({
        success: false,
        message: "Customer phone number is required",
      })
    }

    if (!customerName) {
      return res.status(400).json({
        success: false,
        message: "Customer name is required",
      })
    }

    if (!invoiceId) {
      return res.status(400).json({
        success: false,
        message: "Invoice ID is required",
      })
    }

    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: "Invoice PDF file is required",
      })
    }

    await sendInvoiceWhatsApp({
      phone,
      customerName,
      invoiceId,
      totalAmount: totalAmount || "",
      pdfBuffer: req.file.buffer,
    })

    res.json({
      success: true,
      message: "Invoice sent over WhatsApp",
    })

  } catch (error) {

    console.error("SEND INVOICE WHATSAPP ERROR:", error.message)

    res.status(500).json({
      success: false,
      message: error.message,
    })

  }

}

// ==============================
// SEND QUOTATION PDF OVER WHATSAPP
// ==============================
exports.sendQuotationWhatsApp = async (req, res) => {

  try {

    if (!isConfigured()) {
      return res.status(503).json({
        success: false,
        message: "WhatsApp is not configured on the server yet.",
      })
    }

    const { phone, customerName, quoteId, totalAmount } = req.body

    if (!phone) {
      return res.status(400).json({
        success: false,
        message: "Customer phone number is required",
      })
    }

    if (!customerName) {
      return res.status(400).json({
        success: false,
        message: "Customer name is required",
      })
    }

    if (!quoteId) {
      return res.status(400).json({
        success: false,
        message: "Quote ID is required",
      })
    }

    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: "Quotation PDF file is required",
      })
    }

    await sendQuotationWhatsApp({
      phone,
      customerName,
      quoteId,
      totalAmount: totalAmount || "",
      pdfBuffer: req.file.buffer,
    })

    res.json({
      success: true,
      message: "Quotation sent over WhatsApp",
    })

  } catch (error) {

    console.error("SEND QUOTATION WHATSAPP ERROR:", error.message)

    res.status(500).json({
      success: false,
      message: error.message,
    })

  }

}

// ==============================
// SEND "SERVICE COMPLETED" TEXT (no PDF) - optional standalone trigger
// ==============================
exports.sendServiceCompletedWhatsApp = async (req, res) => {

  try {

    if (!isConfigured()) {
      return res.status(503).json({
        success: false,
        message: "WhatsApp is not configured on the server yet.",
      })
    }

    const { phone, customerName, vehicleNumber } = req.body

    if (!phone || !customerName) {
      return res.status(400).json({
        success: false,
        message: "phone and customerName are required",
      })
    }

    await sendServiceCompletedWhatsApp({ phone, customerName, vehicleNumber })

    res.json({
      success: true,
      message: "Service completed WhatsApp sent",
    })

  } catch (error) {

    console.error("SEND SERVICE COMPLETED WHATSAPP ERROR:", error.message)

    res.status(500).json({
      success: false,
      message: error.message,
    })

  }

}
