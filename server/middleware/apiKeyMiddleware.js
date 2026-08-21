// Auth for read-only reporting/BI consumers (Power BI, other external
// dashboards) — deliberately separate from authMiddleware.js, which is
// for the logged-in admin session. This one checks a long-lived API key
// instead of a JWT, since a scheduled Power BI refresh has no user
// sitting there to log in and refresh a session token.
//
// Set REPORTING_API_KEY in the server's environment (Render dashboard →
// Environment). Requests must send it as the "x-api-key" header.

module.exports = (req, res, next) => {

  try {

    const providedKey = req.headers["x-api-key"]

    if (!process.env.REPORTING_API_KEY) {
      console.log("REPORTING_API_KEY is not set on the server")
      return res.status(500).json({
        success: false,
        message: "Reporting API is not configured",
      })
    }

    if (!providedKey || providedKey !== process.env.REPORTING_API_KEY) {
      return res.status(401).json({
        success: false,
        message: "Invalid or missing API key",
      })
    }

    next()

  } catch (error) {

    console.log("REPORTING API KEY ERROR:", error)

    return res.status(401).json({
      success: false,
      message: "Unauthorized",
    })

  }

}
