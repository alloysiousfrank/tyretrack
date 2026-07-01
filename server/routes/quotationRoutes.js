const express = require("express")

const router = express.Router()

const authMiddleware =
require("../middleware/authMiddleware")

const {

  createQuotation,

  getQuotations,

  getQuotationById,

  updateQuotation,

  publishQuotation,

  deleteQuotation

} = require("../controllers/quotationController")

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