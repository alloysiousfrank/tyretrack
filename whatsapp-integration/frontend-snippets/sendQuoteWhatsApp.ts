// Place this file at: src/utils/sendQuoteWhatsApp.ts

export const sendQuoteWhatsApp = async (

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
    "phone",
    quote.phone
  )

  formData.append(
    "customerName",
    quote.customerName
  )

  formData.append(
    "quoteId",
    quote.quoteId
  )

  formData.append(
    "totalAmount",
    String(quote.totalAmount ?? "")
  )

  const response =
    await fetch(

      "https://tyretrack-server.onrender.com/api/whatsapp/send-quotation",

      {

        method: "POST",

        body: formData

      }

    )

  return response.json()

}
