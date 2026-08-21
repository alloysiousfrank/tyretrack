const express = require("express")
const router = express.Router()

const apiKeyMiddleware = require("../middleware/apiKeyMiddleware")

const {
  getReportingInvoices,
  getReportingBookings,
} = require("../controllers/reportingController")

// Every route here requires the x-api-key header — see
// server/middleware/apiKeyMiddleware.js. These are separate from
// /api/admin (JWT/login-protected) so an external BI tool like Power BI
// can refresh on a schedule without a logged-in admin session.

router.get(
  "/invoices",
  apiKeyMiddleware,
  getReportingInvoices
)

router.get(
  "/bookings",
  apiKeyMiddleware,
  getReportingBookings
)

module.exports = router
