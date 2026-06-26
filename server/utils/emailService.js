const nodemailer = require("nodemailer")

const transporter = nodemailer.createTransport({
  host: "smtp.gmail.com",
  port: 587,
  secure: false,                // STARTTLS — do NOT use true on port 587
  family: 4,                    // force IPv4 — fixes ENETUNREACH on Render
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
  connectionTimeout: 10000,
  greetingTimeout: 10000,
  socketTimeout: 15000,
  tls: {
    rejectUnauthorized: false,
  },
})

const sendEmail = async ({
  to,
  subject,
  html,
  attachments = [],
}) => {
  return transporter.sendMail({
    from: `"TyreTrack Premium Auto Care" <${process.env.EMAIL_USER}>`,
    to,
    subject,
    html,
    attachments,
  })
}

// ==============================
// WELCOME EMAIL
// ==============================

const sendWelcomeEmail = async ({
  customerName,
  email,
}) => {
  return sendEmail({
    to: email,
    subject: "Welcome to TyreTrack 🚗",
    html: `
    <div style="font-family:Arial;padding:30px">
      <h2 style="color:#d62828">Welcome to TyreTrack 🚗</h2>
      <p>Hello <b>${customerName}</b>,</p>
      <p>Thank you for registering with <b>TyreTrack Premium Auto Care.</b></p>
      <p>Your account has been created successfully.</p>
      <p>We look forward to serving your vehicle.</p>
      <br>
      <b>Regards,<br>TyreTrack Team</b>
    </div>
    `,
  })
}

// ==============================
// BOOKING CONFIRMATION EMAIL
// ==============================

const sendBookingConfirmationEmail = async ({
  customerName,
  email,
  bookingId,
  vehicleNumber,
  vehicleType,
  service,
  date,
  time,
}) => {
  return sendEmail({
    to: email,
    subject: `Booking Confirmed - ${bookingId}`,
    html: `
<div style="font-family:Arial;padding:35px">
  <h2 style="color:#d62828">🚗 Booking Confirmed</h2>
  <p>Hello <b>${customerName}</b>,</p>
  <p>Your booking has been successfully confirmed.</p>
  <table style="border-collapse:collapse">
    <tr><td><b>Booking ID</b></td><td>${bookingId}</td></tr>
    <tr><td><b>Vehicle</b></td><td>${vehicleNumber}</td></tr>
    <tr><td><b>Vehicle Type</b></td><td>${vehicleType}</td></tr>
    <tr><td><b>Service</b></td><td>${service}</td></tr>
    <tr><td><b>Date</b></td><td>${date}</td></tr>
    <tr><td><b>Time</b></td><td>${time}</td></tr>
  </table>
  <br>
  <p>You can track your vehicle live anytime from the TyreTrack website.</p>
  <hr>
  <p>Thank you for choosing TyreTrack Premium Auto Care.</p>
</div>
    `,
  })
}

module.exports = {
  sendEmail,
  sendWelcomeEmail,
  sendBookingConfirmationEmail,
}