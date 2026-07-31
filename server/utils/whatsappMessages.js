// ==============================
// TYRETRACK WHATSAPP MESSAGE FLOWS
// ==============================
// Thin wrappers around whatsappService.js encoding the specific
// templates TyreTrack needs. Template names below must match exactly
// what's registered in Meta WhatsApp Manager for this account.

const {
  sendTemplateMessage,
  uploadMediaBuffer,
} = require("./whatsappService")

const sendWelcomeWhatsApp = async ({ phone, customerName }) => {
  return sendTemplateMessage({
    to: phone,
    templateName: "tyretrack_welcome",
    components: [
      {
        type: "body",
        parameters: [
          { type: "text", parameter_name: "customer_name", text: customerName },
        ],
      },
    ],
  })
}

const sendBookingConfirmationWhatsApp = async ({
  phone, customerName, bookingId, service, date, time,
}) => {
  return sendTemplateMessage({
    to: phone,
    templateName: "tyretrackbookingconfirmed",
    components: [
      {
        type: "body",
        parameters: [
          { type: "text", text: customerName },
          { type: "text", text: bookingId },
          { type: "text", text: service },
          { type: "text", text: date },
          { type: "text", text: time },
        ],
      },
    ],
  })
}

const sendServiceCompletedWhatsApp = async ({ phone, customerName, vehicleNumber }) => {
  return sendTemplateMessage({
    to: phone,
    templateName: "tyretrack_servicecompleted",
    components: [
      {
        type: "body",
        parameters: [
          { type: "text", text: customerName },
          { type: "text", text: vehicleNumber || "your vehicle" },
        ],
      },
    ],
  })
}

const sendInvoiceWhatsApp = async ({ phone, customerName, invoiceId, totalAmount, pdfBuffer }) => {
  const mediaId = await uploadMediaBuffer(pdfBuffer, `${invoiceId}.pdf`)
  return sendTemplateMessage({
    to: phone,
    templateName: "tyretrack_invoicepdf",
    components: [
      {
        type: "header",
        parameters: [{ type: "document", document: { id: mediaId, filename: `${invoiceId}.pdf` } }],
      },
      {
        type: "body",
        parameters: [
          { type: "text", text: customerName },
          { type: "text", text: invoiceId },
          { type: "text", text: String(totalAmount) },
        ],
      },
    ],
  })
}

const sendQuotationWhatsApp = async ({ phone, customerName, quoteId, totalAmount, pdfBuffer }) => {
  const mediaId = await uploadMediaBuffer(pdfBuffer, `${quoteId}.pdf`)
  return sendTemplateMessage({
    to: phone,
    templateName: "tyretrack_quotepdf",
    components: [
      {
        type: "header",
        parameters: [{ type: "document", document: { id: mediaId, filename: `${quoteId}.pdf` } }],
      },
      {
        type: "body",
        parameters: [
          { type: "text", text: customerName },
          { type: "text", text: quoteId },
          { type: "text", text: String(totalAmount) },
        ],
      },
    ],
  })
}

module.exports = {
  sendWelcomeWhatsApp,
  sendBookingConfirmationWhatsApp,
  sendServiceCompletedWhatsApp,
  sendInvoiceWhatsApp,
  sendQuotationWhatsApp,
}