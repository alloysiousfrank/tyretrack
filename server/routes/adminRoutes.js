const express = require("express")

const router = express.Router()

const {
  adminLogin,
} = require("../controllers/adminController")

const {
  getDashboardStats,
} = require("../controllers/adminStatsController")

const {
  getAnalytics,
  getRevenueTrends,
  getDailyReport,
  getRangeReport,
} = require("../controllers/adminAnalyticsController")

const {
  getCustomers,
  getCustomerHistory,
} = require("../controllers/adminCustomerController")

const {
  getReports,
} = require(
  "../controllers/adminReportController"
)

router.post(
  "/login",
  adminLogin
)

router.get(
  "/stats",
  getDashboardStats
)

router.get(
  "/analytics",
  getAnalytics
)

router.get(
  "/revenue-trends",
  getRevenueTrends
)

router.get(
  "/customers",
  getCustomers
)

// Must come after "/customers" above, not before — otherwise Express
// would never reach this since "/customers" is matched first anyway
// (different path shape), but kept in this order for clarity with the
// other ":id"-style routes in this codebase.
router.get(
  "/customers/:key/history",
  getCustomerHistory
)

router.get(
  "/reports",
  getReports
)

router.get(
  "/daily-report",
  getDailyReport
)

router.get(
  "/range-report",
  getRangeReport
)

module.exports = router