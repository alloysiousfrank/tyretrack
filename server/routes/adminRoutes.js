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
} = require("../controllers/adminAnalyticsController")

const {
  getCustomers,
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

router.get(
  "/reports",
  getReports
)

router.get(
  "/daily-report",
  getDailyReport
)

module.exports = router