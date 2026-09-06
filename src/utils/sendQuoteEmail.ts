// Mirrors src/utils/sendInvoiceEmail.ts exactly, pointed at the
// quotation email endpoint instead. This file did not exist before —
// quotations could only be sent over WhatsApp, so a blocked/erroring
// WhatsApp API meant a published quotation had no way to reach the
// customer at all, even though the "Quotation Published" step itself
// had already succeeded and the backend email endpoint was ready.

export const sendQuoteEmail = async (

  quote: any,

  pdfBlob: Blob

) => {

  const formData = new FormData()

  formData.append(
    "quotation",
    pdfBlob,
    `${quote.quoteId}.pdf`
  )

  formData.append(
    "email",
    quote.email
  )

  formData.append(
    "customerName",
    quote.customerName
  )

  formData.append(
    "quoteId",
    quote.quoteId
  )

  const response =
    await fetch(

      "https://tyretrack-server.onrender.com/api/quotations/send-email",

      {

        method: "POST",

        body: formData

      }

    )

  return response.json()

}
