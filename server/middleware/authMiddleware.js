const jwt = require("jsonwebtoken")

module.exports = (req, res, next) => {

  try {

    console.log("Authorization Header:", req.headers.authorization)

    const token =
      req.headers.authorization?.split(" ")[1]

    console.log("Extracted Token:", token)

    const decoded =
      jwt.verify(token, process.env.JWT_SECRET)

    console.log("Decoded JWT:", decoded)

    req.admin = decoded

    next()

  } catch (error) {

    console.log("JWT ERROR:", error)

    return res.status(401).json({
      success: false,
      message: "Unauthorized"
    })

  }

}