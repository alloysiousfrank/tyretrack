import jsPDF from "jspdf"
import autoTable from "jspdf-autotable"

// Fully independent of generateInvoicePdf.ts — reuses the same brand
// colors and A4/mm layout conventions for a visually consistent look,
// but is its own file so nothing about the existing invoice PDF is
// touched or depended on.

const RED: [number, number, number] = [220, 0, 0]
const DARK: [number, number, number] = [30, 30, 30]
const GREY_BG: [number, number, number] = [248, 248, 248]

interface ServiceRow {
  date: string
  invoiceId: string
  serviceName: string
  quantity: number
  amount: number
  total: number
}

interface CustomerInfo {
  name: string
  phone: string
  email: string
  vehicleNumber: string
}

export const generateCustomerReportPDF = (
  customer: CustomerInfo,
  services: ServiceRow[],
  totalSpent: number
): Blob => {

  const doc = new jsPDF({ unit: "mm", format: "a4" })
  const PW = 210
  const ML = 14
  const MR = 14
  const CW = PW - ML - MR

  // Top accent bar
  doc.setFillColor(...RED)
  doc.rect(0, 0, PW, 4, "F")

  // Company details (left)
  doc.setFont("helvetica", "bold")
  doc.setFontSize(13)
  doc.setTextColor(DARK[0], DARK[1], DARK[2])
  doc.text("TYRETRACK PREMIUM AUTO CARE", ML, 18)

  doc.setFont("helvetica", "normal")
  doc.setFontSize(8)
  const compLines = [
    "107/2, Pasumai Nagar, Opp. Gokulam Apartment, Andipalayam, Mangalam Road, Tiruppur",
    "Phone : 9443738487 / 7448787979",
    "GSTIN : 33AAWFT5612K1ZP",
  ]
  let cy = 23
  for (const line of compLines) {
    doc.text(line, ML, cy)
    cy += 4.2
  }

  // Report title (right)
  doc.setFont("helvetica", "bold")
  doc.setFontSize(16)
  doc.setTextColor(...RED)
  const title = "CUSTOMER SERVICE REPORT"
  const titleW = doc.getTextWidth(title)
  doc.text(title, PW - MR - titleW, 18)

  doc.setFont("helvetica", "normal")
  doc.setFontSize(8.5)
  doc.setTextColor(100, 100, 100)
  const generatedText = `Generated: ${new Date().toLocaleDateString("en-IN", {
    day: "2-digit", month: "short", year: "numeric",
  })}`
  const generatedW = doc.getTextWidth(generatedText)
  doc.text(generatedText, PW - MR - generatedW, 24)

  // Divider
  doc.setDrawColor(220, 220, 220)
  doc.line(ML, 36, PW - MR, 36)

  // Customer details box
  const boxY = 41
  const boxH = 26
  doc.setFillColor(...GREY_BG)
  doc.roundedRect(ML, boxY, CW, boxH, 2, 2, "F")
  doc.setFillColor(...RED)
  doc.rect(ML, boxY, CW, 6, "F")
  doc.setFont("helvetica", "bold")
  doc.setFontSize(9)
  doc.setTextColor(255, 255, 255)
  doc.text("CUSTOMER DETAILS", ML + 4, boxY + 4.3)

  doc.setFont("helvetica", "normal")
  doc.setFontSize(9)
  doc.setTextColor(DARK[0], DARK[1], DARK[2])

  const rowY1 = boxY + 12
  const rowY2 = boxY + 19
  const colXLeft = ML + 4
  const colXRight = ML + CW / 2 + 2

  doc.setFont("helvetica", "bold")
  doc.text("Name:", colXLeft, rowY1)
  doc.text("Phone:", colXRight, rowY1)
  doc.text("Email:", colXLeft, rowY2)
  doc.text("Vehicle No:", colXRight, rowY2)

  doc.setFont("helvetica", "normal")
  doc.text(customer.name || "-", colXLeft + 14, rowY1)
  doc.text(customer.phone || "-", colXRight + 14, rowY1)
  doc.text(customer.email || "-", colXLeft + 14, rowY2)
  doc.text(customer.vehicleNumber || "-", colXRight + 18, rowY2)

  // Services table — one row per service line, across every invoice
  const tableBody = services.map((s) => [
    `${new Date(s.date).toLocaleDateString("en-IN", { day: "2-digit", month: "short", year: "numeric" })}\n${s.invoiceId}`,
    s.serviceName,
    String(s.quantity),
    `Rs. ${Number(s.amount).toLocaleString("en-IN", { maximumFractionDigits: 2 })}`,
    `Rs. ${Number(s.total).toLocaleString("en-IN", { maximumFractionDigits: 2 })}`,
  ])

  autoTable(doc, {
    startY: boxY + boxH + 8,
    margin: { left: ML, right: MR },
    head: [["Date / Invoice No.", "Service", "Qty", "Amount", "Total"]],
    body: tableBody.length > 0 ? tableBody : [["-", "No service history found", "-", "-", "-"]],
    theme: "grid",
    styles: {
      font: "helvetica",
      fontSize: 8.5,
      cellPadding: 3,
      textColor: DARK,
      lineColor: [220, 220, 220],
      lineWidth: 0.2,
    },
    headStyles: {
      fillColor: RED,
      textColor: [255, 255, 255],
      fontStyle: "bold",
      halign: "left",
    },
    columnStyles: {
      0: { cellWidth: 42 },
      1: { cellWidth: "auto" },
      2: { cellWidth: 16, halign: "center" },
      3: { cellWidth: 30, halign: "right" },
      4: { cellWidth: 30, halign: "right" },
    },
    alternateRowStyles: { fillColor: GREY_BG },
  })

  // Grand total box, right-aligned below the table
  // @ts-ignore — jspdf-autotable attaches this at runtime
  const afterTableY = (doc as any).lastAutoTable.finalY + 10

  const totalBoxW = 80
  const totalBoxH = 14
  const totalBoxX = PW - MR - totalBoxW

  doc.setFillColor(DARK[0], DARK[1], DARK[2])
  doc.roundedRect(totalBoxX, afterTableY, totalBoxW, totalBoxH, 2, 2, "F")

  doc.setFont("helvetica", "bold")
  doc.setFontSize(10)
  doc.setTextColor(255, 255, 255)
  doc.text("Total Amount Spent", totalBoxX + 4, afterTableY + 9)

  doc.setFont("helvetica", "bold")
  doc.setFontSize(11)
  doc.setTextColor(...RED)
  const totalText = `Rs. ${Number(totalSpent).toLocaleString("en-IN", { maximumFractionDigits: 2 })}`
  const totalTextW = doc.getTextWidth(totalText)
  doc.text(totalText, totalBoxX + totalBoxW - 4 - totalTextW, afterTableY + 9)

  // Footer
  const footerY = afterTableY + totalBoxH + 14
  doc.setFont("helvetica", "italic")
  doc.setFontSize(7.5)
  doc.setTextColor(140, 140, 140)
  const footerText = "This is a computer-generated customer service report."
  const footerW = doc.getTextWidth(footerText)
  doc.text(footerText, (PW - footerW) / 2, footerY)

  return doc.output("blob")
}

export const downloadCustomerReportPDF = (
  customer: CustomerInfo,
  services: ServiceRow[],
  totalSpent: number
) => {

  const blob = generateCustomerReportPDF(customer, services, totalSpent)
  const url = URL.createObjectURL(blob)

  // File name is the customer's own name, sanitized for filesystem safety.
  const safeName = (customer.name || "Customer")
    .trim()
    .replace(/[/\\:*?"<>|]/g, "")
    .replace(/\s+/g, " ") || "Customer"

  const link = document.createElement("a")
  link.href = url
  link.download = `${safeName}.pdf`
  document.body.appendChild(link)
  link.click()
  document.body.removeChild(link)
  URL.revokeObjectURL(url)
}
