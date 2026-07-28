const express = require("express")
const router = express.Router()
const upload = require("../middleware/uploadMiddleware")

const {
  sendInvoiceWhatsApp,
  sendQuotationWhatsApp,
  sendServiceCompletedWhatsApp,
} = require("../controllers/whatsappController")

// POST /api/whatsapp/send-invoice
// multipart/form-data: invoice (PDF file), phone, customerName, invoiceId, totalAmount
router.post(
  "/send-invoice",
  upload.single("invoice"),
  sendInvoiceWhatsApp
)

// POST /api/whatsapp/send-quotation
// multipart/form-data: quotation (PDF file), phone, customerName, quoteId, totalAmount
router.post(
  "/send-quotation",
  upload.single("quotation"),
  sendQuotationWhatsApp
)

// POST /api/whatsapp/service-completed
// json: { phone, customerName, vehicleNumber }
router.post(
  "/service-completed",
  sendServiceCompletedWhatsApp
)

module.exports = router
