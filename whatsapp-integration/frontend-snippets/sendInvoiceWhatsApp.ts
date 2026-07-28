// Place this file at: src/utils/sendInvoiceWhatsApp.ts
// Mirrors src/utils/sendInvoiceEmail.ts exactly, just points at the
// new WhatsApp endpoint.

export const sendInvoiceWhatsApp = async (

  invoice: any,

  pdfBlob: Blob

) => {

  const formData = new FormData()

  formData.append(
    "invoice",
    pdfBlob,
    `${invoice.invoiceId}.pdf`
  )

  formData.append(
    "phone",
    invoice.phone
  )

  formData.append(
    "customerName",
    invoice.customerName
  )

  formData.append(
    "invoiceId",
    invoice.invoiceId
  )

  formData.append(
    "totalAmount",
    String(invoice.totalAmount ?? "")
  )

  const response =
    await fetch(

      "https://tyretrack-server.onrender.com/api/whatsapp/send-invoice",

      {

        method: "POST",

        body: formData

      }

    )

  return response.json()

}
