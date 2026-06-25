const express = require("express")
const router = express.Router()

const { sendEmail } = require("../utils/emailService")

router.get("/test", async (req, res) => {

  try {

    await sendEmail({

      to: "tyretrackoff@gmail.com",

      subject: "TyreTrack Email Test",

      html: `
      <h1>🚗 TyreTrack</h1>

      <p>Your email service is working successfully.</p>

      <p>Congratulations!</p>
      `

    })

    res.json({
      success: true,
      message: "Email Sent Successfully"
    })

  } catch (error) {

    console.log(error)

    res.status(500).json({
      success: false,
      message: error.message
    })

  }

})

module.exports = router