const nodemailer = require("nodemailer")

const transporter = nodemailer.createTransport({

  host: process.env.EMAIL_HOST,

  port: Number(process.env.EMAIL_PORT),

  secure: true,

  auth: {

    user: process.env.EMAIL_USER,

    pass: process.env.EMAIL_PASS,

  },

})

const sendEmail = async ({

  to,

  subject,

  html,

  attachments = []

}) => {

  return transporter.sendMail({

    from: `"TyreTrack Premium Auto Care" <${process.env.EMAIL_USER}>`,

    to,

    subject,

    html,

    attachments

  })

}

module.exports = {

  sendEmail

}