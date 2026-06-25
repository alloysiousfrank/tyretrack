const { sendEmail } = require("../utils/sendEmail")
console.log(req.body)

console.log(req.file)

console.log(req.file?.originalname)

console.log(req.file?.size)
exports.sendInvoiceEmail = async (req, res) => {

  try {

    if (!req.file) {

      return res.status(400).json({
        success: false,
        message: "No PDF uploaded"
      })

    }

    const { email, customerName, invoiceId } = req.body

    await sendEmail({

      to: email,

      subject: `TyreTrack Invoice - ${invoiceId}`,

      html: `
        <div style="font-family:Arial;padding:20px">

          <h2>Thank you for choosing TyreTrack 🚗</h2>

          <p>Hi <b>${customerName}</b>,</p>

          <p>
            Your service invoice has been generated successfully.
          </p>

          <p>
            Please find your invoice attached with this email.
          </p>

          <br>

          <p>
            Thank you for choosing
            <b>TyreTrack Premium Auto Care</b>.
          </p>

        </div>
      `,

      attachments: [

        {

          filename: req.file.originalname,

          content: req.file.buffer

        }

      ]

    })

    return res.json({

      success: true,

      message: "Invoice email sent successfully"

    })

  }

  catch (error) {

    console.log(error)

    return res.status(500).json({

      success: false,

      message: error.message

    })

  }

}