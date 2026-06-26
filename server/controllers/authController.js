const User = require("../models/User")
const jwt = require("jsonwebtoken")
const { sendWelcomeEmail } = require("../utils/emailService")

exports.loginOrRegister = async (req, res) => {

  try {

    const { name, email, phone } = req.body

    // VALIDATION
    if (!email || !phone) {
      return res.status(400).json({
        success: false,
        message: "Email and Phone are required",
      })
    }

    // FIND USER
    let user = await User.findOne({
      email: email.toLowerCase(),
    })

    // ==============================
    // EXISTING USER — LOGIN
    // ==============================

    if (user) {

      const token = jwt.sign(
        { id: user._id },
        process.env.JWT_SECRET,
        { expiresIn: "7d" }
      )

      return res.json({
        success: true,
        existingUser: true,
        token,
        user: {
          name: user.name,
          email: user.email,
          phone: user.phone,
        },
      })

    }

    // ==============================
    // NEW USER — REGISTER
    // ==============================

    // name is required only for new users
    if (!name || name.trim() === "") {
      return res.status(400).json({
        success: false,
        message: "Name is required for new accounts",
      })
    }

    user = await User.create({
      name: name.trim(),
      email: email.toLowerCase(),
      phone,
    })

    // ✅ FIX: wrapped in try/catch so email failure never crashes registration
    // ✅ FIX: passing object { customerName, email } — matches sendWelcomeEmail signature
    try {
      await sendWelcomeEmail({
        customerName: user.name,
        email: user.email,
      })
      console.log("Welcome email sent to", user.email)
    } catch (emailError) {
      console.log("Welcome email failed (non-fatal):", emailError.message)
      // User is already created — we continue and return success
    }

    const token = jwt.sign(
      { id: user._id },
      process.env.JWT_SECRET,
      { expiresIn: "7d" }
    )

    return res.json({
      success: true,
      existingUser: false,
      token,
      user: {
        name: user.name,
        email: user.email,
        phone: user.phone,
      },
    })

  } catch (error) {
    console.log("LOGIN OR REGISTER ERROR:", error)
    return res.status(500).json({
      success: false,
      message: "Server Error",
    })
  }

}