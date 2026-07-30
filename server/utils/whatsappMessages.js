// ==============================
// TYRETRACK WHATSAPP MESSAGE FLOWS
// ==============================
// Thin wrappers around whatsappService.js encoding the specific
// templates TyreTrack needs. Swap TEMPLATE NAMES below for whatever
// you name them when you create them in Meta Business Manager >
// WhatsApp Manager > Message Templates. See templates.md in this
// bundle for suggested template bodies to submit for approval.

const {
  sendTemplateMessage,
  sendPdfDocument,
} = require("./whatsappService")

// ==============================
// 1. WELCOME MESSAGE (on booking / on account creation)
// ==============================
const sendWelcomeWhatsApp = async ({ phone, customerName }) => {
  return sendTemplateMessage({
    to: phone,
    templateName: "tyretrack_welcome",
    components: [
      {
        type: "body",
        parameters: [{ type: "text", text: customerName }],
      },
    ],
  })
}

// ==============================
// 2. BOOKING CONFIRMATION (on booking creation)
// ==============================
const sendBookingConfirmationWhatsApp = async ({
  phone,
  customerName,
  bookingId,
  service,
  date,
  time,
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

// ==============================
// 3. SERVICE COMPLETED (when invoice is published / booking marked completed)
// ==============================
const sendServiceCompletedWhatsApp = async ({
  phone,
  customerName,
  vehicleNumber,
}) => {
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

// ==============================
// 4. INVOICE READY + PDF (on invoice publish)
// ==============================
// Sends a template first (works even outside a session window),
// then follows up with the actual PDF document.
const sendInvoiceWhatsApp = async ({
  phone,
  customerName,
  invoiceId,
  totalAmount,
  pdfBuffer,
}) => {
  await sendTemplateMessage({
    to: phone,
    templateName: "tyretrack_invoiceready",
    components: [
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

  return sendPdfDocument({
    to: phone,
    buffer: pdfBuffer,
    filename: `${invoiceId}.pdf`,
    caption: `Invoice ${invoiceId} - TyreTrack Premium Auto Care`,
  })
}

// ==============================
// 5. QUOTATION READY + PDF (on quote publish)
// ==============================
const sendQuotationWhatsApp = async ({
  phone,
  customerName,
  quoteId,
  totalAmount,
  pdfBuffer,
}) => {
  await sendTemplateMessage({
    to: phone,
    templateName:	"tyretrack_quoteready",
    components: [
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

  return sendPdfDocument({
    to: phone,
    buffer: pdfBuffer,
    filename: `${quoteId}.pdf`,
    caption: `Quotation ${quoteId} - TyreTrack Premium Auto Care`,
  })
}

module.exports = {
  sendWelcomeWhatsApp,
  sendBookingConfirmationWhatsApp,
  sendServiceCompletedWhatsApp,
  sendInvoiceWhatsApp,
  sendQuotationWhatsApp,
}
