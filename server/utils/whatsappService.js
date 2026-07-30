// ==============================
// WHATSAPP CLOUD API SERVICE (Meta)
// ==============================
// Free tier: Meta's official WhatsApp Cloud API.
// Requires env vars (see .env.example in this bundle):
//   WHATSAPP_TOKEN        - permanent access token from Meta App
//   WHATSAPP_PHONE_ID     - the Phone Number ID (from WhatsApp > API Setup)
//   WHATSAPP_API_VERSION  - e.g. "v21.0" (optional, defaults below)

const WHATSAPP_TOKEN   = process.env.WHATSAPP_TOKEN
const WHATSAPP_PHONE_ID = process.env.WHATSAPP_PHONE_ID
const API_VERSION      = process.env.WHATSAPP_API_VERSION || "v21.0"

const BASE_URL = `https://graph.facebook.com/${API_VERSION}/${WHATSAPP_PHONE_ID}`

// ==============================
// HELPERS
// ==============================

// Meta requires E.164 format (country code, no +, no spaces/dashes).
// TyreTrack stores 10-digit Indian numbers -> prefix with 91 if missing.
const normalizePhone = (phone) => {
  if (!phone) return null
  let digits = String(phone).replace(/\D/g, "")
  if (digits.length === 10) digits = `91${digits}`
  if (digits.startsWith("0") && digits.length === 11) digits = `91${digits.slice(1)}`
  return digits
}

const isConfigured = () => Boolean(WHATSAPP_TOKEN && WHATSAPP_PHONE_ID)

const callGraphAPI = async (path, body, isFormData = false) => {
  if (!isConfigured()) {
    throw new Error(
      "WhatsApp not configured: set WHATSAPP_TOKEN and WHATSAPP_PHONE_ID in .env"
    )
  }

  const url = `${BASE_URL}${path}`

  const headers = { Authorization: `Bearer ${WHATSAPP_TOKEN}` }
  if (!isFormData) headers["Content-Type"] = "application/json"

  const response = await fetch(url, {
    method: "POST",
    headers,
    body: isFormData ? body : JSON.stringify(body),
  })

  const data = await response.json()

  if (!response.ok) {
    const message = data?.error?.message || "WhatsApp API request failed"
    const err = new Error(message)
    err.details = data
    throw err
  }

  return data
}

// ==============================
// 1. SEND A PRE-APPROVED TEMPLATE MESSAGE
// ==============================
// Meta requires all proactive (business-initiated) messages to use an
// approved template. Free-form text only works within a 24h customer
// service window (i.e. after the customer has messaged you).
//
// templateName must match the name of a template approved in
// Meta Business Manager > WhatsApp Manager > Message Templates.
// components: array of template variable substitutions, e.g.
//   [{ type: "body", parameters: [{ type: "text", text: "Ravi" }] }]

const sendTemplateMessage = async ({ to, templateName, languageCode = "en", components = [] }) => {
  const phone = normalizePhone(to)
  if (!phone) throw new Error("Invalid recipient phone number")

  return callGraphAPI("/messages", {
    messaging_product: "whatsapp",
    to: phone,
    type: "template",
    template: {
      name: templateName,
      language: { code: languageCode },
      components,
    },
  })
}

// ==============================
// 2. SEND PLAIN TEXT (only valid inside a 24h session window)
// ==============================

const sendTextMessage = async ({ to, body }) => {
  const phone = normalizePhone(to)
  if (!phone) throw new Error("Invalid recipient phone number")

  return callGraphAPI("/messages", {
    messaging_product: "whatsapp",
    to: phone,
    type: "text",
    text: { body },
  })
}

// ==============================
// 3. UPLOAD A PDF BUFFER TO WHATSAPP MEDIA -> get media_id
// ==============================

const uploadMediaBuffer = async (buffer, filename = "document.pdf", mimeType = "application/pdf") => {
  if (!isConfigured()) {
    throw new Error(
      "WhatsApp not configured: set WHATSAPP_TOKEN and WHATSAPP_PHONE_ID in .env"
    )
  }

  const form = new FormData()
  form.append("messaging_product", "whatsapp")
  form.append("file", new Blob([buffer], { type: mimeType }), filename)

  const data = await callGraphAPI("/media", form, true)
  return data.id // media_id
}

// ==============================
// 4. SEND A DOCUMENT (PDF) MESSAGE USING AN UPLOADED media_id
// ==============================
// NOTE: sending a document to a customer who has NOT messaged you
// recently still requires that the *first* contact be a template
// message (see sendTemplateMessage). Once inside the 24h session
// window (e.g. right after they receive a template + reply, or after
// they initiated contact), free-form document sends work.
// For fully automated flows (invoice/quote on publish) where the
// customer may not be in an active session, it's safest to first
// send an approved template that references the document context,
// then follow up with the document itself.

const sendDocumentMessage = async ({ to, mediaId, filename, caption }) => {
  const phone = normalizePhone(to)
  if (!phone) throw new Error("Invalid recipient phone number")

  return callGraphAPI("/messages", {
    messaging_product: "whatsapp",
    to: phone,
    type: "document",
    document: {
      id: mediaId,
      filename,
      caption,
    },
  })
}

// ==============================
// 5. CONVENIENCE: upload + send document in one call
// ==============================

const sendPdfDocument = async ({ to, buffer, filename, caption }) => {
  const mediaId = await uploadMediaBuffer(buffer, filename)
  return sendDocumentMessage({ to, mediaId, filename, caption })
}

module.exports = {
  isConfigured,
  normalizePhone,
  sendTemplateMessage,
  sendTextMessage,
  uploadMediaBuffer,
  sendDocumentMessage,
  sendPdfDocument,
}
