import jsPDF from "jspdf"
import autoTable from "jspdf-autotable"

const servicePrices:any = {

  "Wheel Alignment":800,
  "Wheel Balancing":400,
  "Foam Wash":500,
  "Automatic Car Spa":1500,
  "Multi Branded Tyres":5000,
  "Interior Cleaning":1000,
  "Teflon Coating":3000,
  "Ceramic Coating":8000,
  "General Service":2500,
  "Accessories":1000,

}

export const generateInvoicePdf = (
  invoice:any
) => {

  const doc = new jsPDF()

  // =====================
  // LOGO
  // =====================

  try {

    doc.addImage(
      "/logo5.png",
      "PNG",
      10,
      8,
      75,
      22
    )

  } catch {}

  // =====================
  // COMPANY
  // =====================

  doc.setFontSize(18)

  doc.text(
    "TYRETRACK PREMIUM AUTO CARE",
    14,
    40
  )

  doc.setFontSize(10)

  doc.text(
    "Owner : Rtn Charles A",
    14,
    48
  )

  doc.text(
    "107/2 Pasumai Nagar",
    14,
    54
  )

  doc.text(
    "Mangalam Road, Tiruppur",
    14,
    60
  )

  doc.text(
    "Phone : 9443738487",
    14,
    66
  )

  doc.text(
    "GSTIN : 33AAWFT5612K1ZP",
    14,
    72
  )

  doc.text(
    "PAN : AKDPP7420L",
    14,
    78
  )

  doc.text(
    "HSN/SAC : 40111010",
    14,
    78
  )

  // =====================
  // TAX INVOICE
  // =====================

  doc.setFontSize(18)

  doc.text(
    "TAX INVOICE",
    140,
    25
  )

  doc.setFontSize(10)

  doc.text(
    `Invoice No : ${invoice.invoiceId}`,
    130,
    35
  )

  doc.text(
  `Booking ID : ${invoice.bookingId}`,
  130,
  49
)

  doc.text(
    `Date : ${
      new Date(
        invoice.createdAt || Date.now()
      ).toLocaleDateString()
    }`,
    130,
    42
  )

  // =====================
  // CUSTOMER BOX
  // =====================

  doc.setFillColor(
    245,
    245,
    245
  )

  doc.roundedRect(
    10,
    88,
    190,
    35,
    3,
    3,
    "F"
  )

  doc.setFontSize(12)

  doc.text(
    "Customer Details",
    14,
    97
  )

  doc.setFontSize(10)

  doc.text(
    `Name : ${invoice.customerName}`,
    14,
    105
  )

  doc.text(
    `Phone : ${invoice.phone}`,
    14,
    112
  )

  doc.text(
    `Email : ${invoice.email}`,
    14,
    119
  )

  doc.text(
    `Vehicle No : ${invoice.vehicleNumber}`,
    110,
    105
  )

  doc.text(
    `Vehicle Type : ${invoice.vehicleType}`,
    110,
    112
  )

  doc.text(
 `Vehicle KM : ${invoice.vehicleKm || "-"}`,
 110,
 118
)

  // =====================
  // SERVICES TABLE
  // =====================

  const rows =
    invoice.services.map(
      (service:string)=>[
        service,
        `Rs ${servicePrices[service] || 0}`
      ]
    )

  autoTable(doc,{

    startY:130,

    head:[[
      "Service",
      "Amount"
    ]],

    body:rows,

    theme:"grid",

    headStyles:{
      fillColor:[220,0,0]
    }

  })

  const finalY =
    (doc as any)
    .lastAutoTable
    .finalY

  // =====================
  // TOTAL BOX
  // =====================

  doc.rect(
    125,
    finalY + 8,
    70,
    40
  )

  doc.setFontSize(10)

  doc.text(
    `Subtotal : Rs ${invoice.subtotal}`,
    130,
    finalY + 18
  )

  doc.text(
    `CGST (9%) : Rs ${
      Number(
        invoice.gst/2
      ).toFixed(2)
    }`,
    130,
    finalY + 25
  )

  doc.text(
    `SGST (9%) : Rs ${
      Number(
        invoice.gst/2
      ).toFixed(2)
    }`,
    130,
    finalY + 32
  )

  doc.setFontSize(16)

  doc.text(
    `Total : Rs ${invoice.totalAmount}`,
    130,
    finalY + 42
  )

  // =====================
  // QR
  // =====================

  try {

    doc.addImage(
      "/qr.png",
      "PNG",
      15,
      220,
      40,
      40
    )

  } catch {}

  doc.setFontSize(9)

  doc.text(
    "Scan & Pay",
    20,
    265
  )

  // =====================
  // SIGNATURE
  // =====================

  try {

    doc.addImage(
      "/signature.png",
      "PNG",
      145,
      225,
      40,
      18
    )

  } catch {}

  doc.text(
    "For TYRETRACK",
    145,
    250
  )

  doc.text(
    "Authorized Signatory",
    135,
    258
  )

  // =====================
  // FOOTER
  // =====================

  doc.setFontSize(9)

  doc.text(
    "Thank you for choosing TYRETRACK Premium Auto Care",
    14,
    280
  )

  doc.save(
    `${invoice.invoiceId}.pdf`
  )

}