const express = require("express")
const router = express.Router()
const upload = require("../middleware/uploadMiddleware")

const {
  createInvoice,
  getInvoices,
  getInvoiceById,
  getInvoicesByVehicle,
  getInvoicesByCustomer,
  publishInvoice,
  updateInvoice,
} = require("../controllers/invoiceController")

const {
  sendInvoiceEmail,
} = require("../controllers/emailController")

// ✅ FIX: /send-email MUST come before /:id
// Otherwise Express matches "send-email" as the :id param and calls getInvoiceById
router.post(
  "/send-email",
  upload.single("invoice"),
  sendInvoiceEmail
)

router.post("/", createInvoice)

router.get("/", getInvoices)

router.get(
  "/vehicle/:vehicleNumber",
  getInvoicesByVehicle
)

router.get(
  "/customer/:email",
  getInvoicesByCustomer
)

router.put(
  "/publish/:id",
  publishInvoice
)

// ✅ FIX: /:id routes come LAST — they are catch-all param routes
router.put("/:id", updateInvoice)

router.get("/:id", getInvoiceById)

module.exports = router