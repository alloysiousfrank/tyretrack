const nodemailer = require("nodemailer")

const transporter = nodemailer.createTransport({
  host: process.env.EMAIL_HOST,
  port: Number(process.env.EMAIL_PORT),
  secure: Number(process.env.EMAIL_PORT) === 465,

  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
})

exports.sendWelcomeEmail = async (name, email) => {

  try {

    await transporter.sendMail({

      from: `"TyreTrack" <${process.env.EMAIL_USER}>`,

      to: email,

      subject: "Welcome to TyreTrack 🚗",

      html: `
      <div style="font-family:Arial,sans-serif;background:#f5f5f5;padding:30px">

        <div style="max-width:650px;margin:auto;background:white;border-radius:12px;padding:35px">

          <h1 style="color:#d32f2f;text-align:center">
            🚗 Welcome to TyreTrack
          </h1>

          <p>Hi <b>${name}</b>,</p>

          <p>
            Thank you for registering with TyreTrack.
          </p>

          <p>
            Your account has been created successfully.
          </p>

          <hr>

          <h3>Our Services</h3>

          <ul>
            <li>Wheel Alignment</li>
            <li>Wheel Balancing</li>
            <li>General Service</li>
            <li>Foam Wash</li>
            <li>Ceramic Coating</li>
            <li>Tyre Replacement</li>
          </ul>

          <br>

          <p>
            We look forward to serving your vehicle.
          </p>

          <br>

          <b>TyreTrack Premium Auto Care</b>

          <br>

          Tiruppur

        </div>

      </div>
      `

    })

    console.log("✅ Welcome Email Sent")

  } catch (err) {

    console.log("Email Error :", err.message)

  }

}