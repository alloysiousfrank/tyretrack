const { sendEmail } = require("../utils/emailService")

exports.sendInvoiceEmail = async (req, res) => {

  try {

    const { email, customerName, invoiceId } = req.body

    if (!email) {
      return res.status(400).json({
        success: false,
        message: "Customer email is required",
      })
    }

    if (!customerName) {
      return res.status(400).json({
        success: false,
        message: "Customer name is required",
      })
    }

    if (!invoiceId) {
      return res.status(400).json({
        success: false,
        message: "Invoice ID is required",
      })
    }

    // Build attachments array — PDF is optional
    // (admin may send email without PDF if invoice is viewable online)
    const attachments = []

    if (req.file) {
      attachments.push({
        filename: req.file.originalname || `Invoice-${invoiceId}.pdf`,
        content: req.file.buffer,
      })
    }

    await sendEmail({
      to: email,
      subject: `TyreTrack Invoice - ${invoiceId}`,
      html: `
        <div style="font-family:Arial;padding:30px;max-width:600px">

          <h2 style="color:#d62828">
            🚗 TyreTrack Premium Auto Care
          </h2>

          <p>Hi <b>${customerName}</b>,</p>

          <p>
            Your service invoice <b>${invoiceId}</b> has been
            generated successfully.
          </p>

          ${
            attachments.length > 0
              ? `<p>Please find your invoice PDF attached to this email.</p>`
              : `<p>You can view and download your invoice from the TyreTrack website.</p>`
          }

          <br>

          <p>
            Thank you for choosing
            <b>TyreTrack Premium Auto Care</b>.
          </p>

          <hr style="border-color:#eee">

          <p style="color:#999;font-size:12px">
            TyreTrack Premium Auto Care, Tiruppur
          </p>

        </div>
      `,
      attachments,
    })

    console.log(`Invoice email sent to ${email} for invoice ${invoiceId}`)

    return res.json({
      success: true,
      message: "Invoice email sent successfully",
    })

  } catch (error) {

    console.error("SEND INVOICE EMAIL ERROR:", error.message)

    return res.status(500).json({
      success: false,
      message: error.message,
    })

  }

}