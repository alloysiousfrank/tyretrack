const User = require("../models/User")
const jwt = require("jsonwebtoken")
const nodemailer = require("nodemailer")

exports.loginOrRegister = async (req, res) => {

try {

const { name, email, phone } = req.body

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

// EXISTING USER
if (user) {

  const token = jwt.sign(
    {
      id: user._id,
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
      name: user.name,
      email: user.email,
      phone: user.phone,
    },
  })

}

// CREATE NEW USER

user = await User.create({

  name,
  email: email.toLowerCase(),
  phone,

})

// SEND WELCOME EMAIL
/*
const transporter =
  nodemailer.createTransport({
    host: process.env.EMAIL_HOST,
    port: Number(process.env.EMAIL_PORT),
    secure: true,

    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
  })

await transporter.verify()

console.log(
  "Brevo SMTP Connected ✅"
)

const info =
  await transporter.sendMail({
    from:
      '"TyreTrack" <tyretrackoff@gmail.com@email.com>',

    to: email,

    subject:
      "Welcome to TyreTrack",

    html: `
      <div style="font-family:Arial;padding:20px">
        <h2>Welcome to TyreTrack 🚗</h2>
        <p>Hi ${name},</p>

        <p>
          Your account has been created
          successfully.
        </p>

        <p>
          Thank you for choosing
          TyreTrack.
        </p>
      </div>
    `,
  })

console.log(info.messageId)
  .then(() => {
    console.log("Welcome email sent")
  })
  .catch((err) => {
    console.log("Mail failed:", err.message)
  })
*/
const token = jwt.sign(
  {
    id: user._id,
  },
  process.env.JWT_SECRET,
  {
    expiresIn: "7d",
  }
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
  console.log(
    "LOGIN OR REGISTER ERROR:",
    error
  )

  return res.status(500).json({
    success: false,
    message: "Server Error",
  })
}
}
