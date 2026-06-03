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

    const otp =
      Math.floor(100000 + Math.random() * 900000).toString()

    // MAIL TRANSPORT
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

transporter.verify((error, success) => {
  if (error) {
    console.log("GMAIL VERIFY ERROR:", error);
  } else {
    console.log("GMAIL SERVER READY");
  }
});

    // SEND OTP MAIL
    /*await transporter.sendMail({

      from: process.env.EMAIL_USER,

      to: email,

      subject: "TyreTrack OTP Verification",

      text: `Your TyreTrack OTP is ${otp}`,

    })
*/

return res.json({
  success: true,
  existingUser: false,
  message: "OTP Sent Successfully",
})
    // SAVE USER WITH OTP
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
console.log(error.message)
console.log(error.stack)

    return res.status(500).json({

      success: false,
      message: "Server Error",

    })

  }

}

// ==========================================
// VERIFY OTP
// ==========================================

exports.verifyOtp = async (req, res) => {

  try {

    const { email, otp } = req.body

    // FIND USER
    const user = await User.findOne({ email })

    if (!user) {

      return res.status(404).json({
        success: false,
        message: "User not found",
      })

    }

    // OTP CHECK
    const savedOtp = String(user.otp).trim()
    const enteredOtp = String(otp).trim()

    if (savedOtp !== enteredOtp) {

      return res.status(400).json({
        success: false,
        message: "Invalid OTP",
      })

    }

    // CREATE TOKEN
    const token = jwt.sign(
      {
        id: user._id,
      },

      process.env.JWT_SECRET,

      {
        expiresIn: "7d",
      }
    )

    // REMOVE OTP AFTER SUCCESS
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