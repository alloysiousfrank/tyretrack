const User = require("../models/User")
const jwt = require("jsonwebtoken")
const nodemailer = require("nodemailer")

// ==========================================
// SEND OTP / LOGIN
// ==========================================

exports.sendOtp = async (req, res) => {
  try {
    const { name, email, phone } = req.body

    // CHECK EXISTING USER
    const existingUser = await User.findOne({ email })

    // =========================================
    // EXISTING USER LOGIN DIRECTLY
    // =========================================

    if (existingUser) {
      const token = jwt.sign(
        {
          id: existingUser._id,
        },
        process.env.JWT_SECRET,
        {
          expiresIn: "7d",
        }
      )

      return res.json({
        success: true,
        existingUser: true,
        token,

        user: {
          name: existingUser.name,
          email: existingUser.email,
          phone: existingUser.phone,
        },
      })
    }

    // =========================================
    // NEW USER OTP FLOW
    // =========================================

    const otp = Math.floor(
      100000 + Math.random() * 900000
    ).toString()

    // MAIL TRANSPORTER

    const transporter = nodemailer.createTransport({
      host: "smtp.gmail.com",
      port: 587,
      secure: false,

      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },

      family: 4,
    })

    // SEND OTP MAIL

    await transporter.sendMail({
      from: `"TyreTrack" <${process.env.EMAIL_USER}>`,
      to: email,
      subject: "TyreTrack OTP Verification",

      html: `
        <div style="font-family:Arial,sans-serif">
          <h2>TyreTrack OTP Verification</h2>
          <p>Your OTP is:</p>
          <h1 style="color:red">${otp}</h1>
          <p>This OTP is valid for login verification.</p>
        </div>
      `,
    })

    // SAVE USER

    const user = new User({
      name,
      email,
      phone,
      otp,
    })

    await user.save()

    return res.json({
      success: true,
      existingUser: false,
      message: "OTP Sent Successfully",
    })
  } catch (error) {
    console.log("SEND OTP ERROR FULL:")
    console.log(error)

    return res.status(500).json({
      success: false,
      message: error.message,
    })
  }
}

// ==========================================
// VERIFY OTP
// ==========================================

exports.verifyOtp = async (req, res) => {
  try {
    const { email, otp } = req.body

    const user = await User.findOne({ email })

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      })
    }

    if (String(user.otp).trim() !== String(otp).trim()) {
      return res.status(400).json({
        success: false,
        message: "Invalid OTP",
      })
    }

    const token = jwt.sign(
      {
        id: user._id,
      },
      process.env.JWT_SECRET,
      {
        expiresIn: "7d",
      }
    )

    user.otp = ""
    await user.save()

    return res.json({
      success: true,
      token,

      user: {
        name: user.name,
        email: user.email,
        phone: user.phone,
      },
    })
  } catch (error) {
    console.log("VERIFY OTP ERROR:", error)

    return res.status(500).json({
      success: false,
      message: "Verification Failed",
    })
  }
}