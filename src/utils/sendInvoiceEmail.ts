export const sendInvoiceEmail = async (

  invoice:any,

  pdfBlob:Blob

) => {

  const formData = new FormData()

  formData.append(
    "invoice",
    pdfBlob,
    `${invoice.invoiceId}.pdf`
  )

  formData.append(
    "email",
    invoice.email
  )

  formData.append(
    "customerName",
    invoice.customerName
  )

  formData.append(
    "invoiceId",
    invoice.invoiceId
  )

  const response =
    await fetch(

      "https://tyretrack-server.onrender.com/api/invoices/send-email",

      {

        method:"POST",

        body:formData

      }

    )

  return response.json()

}