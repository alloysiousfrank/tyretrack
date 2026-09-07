const express = require("express")

const router = express.Router()

const authMiddleware =
require("../middleware/authMiddleware")

const upload = require("../middleware/uploadMiddleware")

const {

  createQuotation,

  getQuotations,

  getQuotationById,

  updateQuotation,

  publishQuotation,

  deleteQuotation

} = require("../controllers/quotationController")

const {
  sendQuotationEmail,
} = require("../controllers/emailController")

// ==========================
// SEND QUOTATION EMAIL
// ==========================
// Must come before "/:id" below, same reason as the invoice routes —
// otherwise Express would match "send-email" as the :id param.

router.post(
  "/send-email",
  upload.single("quotation"),
  sendQuotationEmail
)

// ==========================
// CREATE QUOTATION
// ==========================

router.post(
  "/",
  createQuotation
)

// ==========================
// GET ALL QUOTATIONS
// ==========================

router.get(
  "/",
  getQuotations
)

// ==========================
// GET SINGLE QUOTATION
// ==========================

router.get(
  "/:id",
  getQuotationById
)

// ==========================
// UPDATE QUOTATION
// ==========================

router.put(
  "/:id",
  authMiddleware,
  updateQuotation
)

// ==========================
// PUBLISH QUOTATION
// ==========================

router.put(
  "/publish/:id",
  authMiddleware,
  publishQuotation
)

// ==========================
// DELETE QUOTATION
// ==========================

router.delete(
  "/:id",
  authMiddleware,
  deleteQuotation
)

module.exports = router