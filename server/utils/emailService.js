const { Resend } = require("resend")

// Render's free tier blocks outbound SMTP ports, which is why the old
// Nodemailer/Gmail transport was unreliable there. Resend sends over
// HTTPS instead, so it isn't affected by that block.
//
// Built lazily (not at module load) because the Resend constructor
// throws immediately if RESEND_API_KEY is missing — creating it at
// the top of this file would crash the whole server on boot before
// the env var is ever set. Building it on first send instead means a
// missing key only fails the email itself (caught by callers below).
let resendClient = null

const getResendClient = () => {

  if (!resendClient) {
    resendClient = new Resend(process.env.RESEND_API_KEY)
  }

  return resendClient

}

// Must be an address on the domain verified in the Resend dashboard,
// e.g. "TyreTrack Premium Auto Care <invoices@yourdomain.com>".
// Set RESEND_FROM_EMAIL in Render's environment variables — falls back
// to Resend's shared test address so nothing crashes if it's unset,
// but that fallback can only send to your own Resend account email.
const FROM_ADDRESS =
  process.env.RESEND_FROM_EMAIL ||
  "TyreTrack Premium Auto Care <onboarding@resend.dev>"

const sendEmail = async ({
  to,
  subject,
  html,
  attachments = [],
}) => {

  // Nodemailer-style attachments ({ filename, content }) map directly
  // onto Resend's shape — Resend also accepts a raw Buffer as content.
  const resendAttachments = attachments.map((att) => ({
    filename: att.filename,
    content: att.content,
  }))

  const { data, error } = await getResendClient().emails.send({
    from: FROM_ADDRESS,
    to,
    subject,
    html,
    attachments:
      resendAttachments.length > 0
        ? resendAttachments
        : undefined,
  })

  if (error) {
    throw new Error(
      error.message || "Failed to send email via Resend"
    )
  }

  return data

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