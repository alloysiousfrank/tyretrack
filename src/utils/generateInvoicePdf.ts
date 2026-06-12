import jsPDF from "jspdf"
import autoTable from "jspdf-autotable"

export const generateInvoicePdf = (
    invoice: any
) => {

    const doc =
        new jsPDF()

    // HEADER

    doc.setFontSize(24)

    doc.text(
        "TYRETRACK",
        14,
        20
    )

    doc.setFontSize(10)

    doc.text(
        "Premium Auto Care",
        14,
        28
    )

    doc.text(
        "107/2, Pasumai Nagar",
        14,
        34
    )

    doc.text(
        "Mangalam Road, Tiruppur",
        14,
        40
    )

    doc.text(
        "Phone : 9443738487",
        14,
        46
    )

    // INVOICE INFO

    doc.setFontSize(16)

    doc.text(
        "TAX INVOICE",
        150,
        20
    )

    doc.setFontSize(10)

    doc.text(
        `Invoice No : ${invoice.invoiceId}`,
        140,
        30
    )

    doc.text(
        `Date : ${new Date()
            .toLocaleDateString()
        }`,
        140,
        36
    )

    // CUSTOMER

    doc.setFontSize(12)

    doc.text(
        "Customer Details",
        14,
        60
    )

    doc.setFontSize(10)

    doc.text(
        `Name : ${invoice.customerName}`,
        14,
        68
    )

    doc.text(
        `Phone : ${invoice.phone}`,
        14,
        74
    )

    doc.text(
        `Email : ${invoice.email}`,
        14,
        80
    )

    doc.text(
        `Vehicle No : ${invoice.vehicleNumber}`,
        14,
        86
    )

    doc.text(
        `Vehicle Type : ${invoice.vehicleType}`,
        14,
        92
    )

    // SERVICES TABLE

    const rows =
        invoice.services.map(
            (
                service: string
            ) => [

                    service,

                    ""

                ]
        )

    autoTable(doc, {

        startY: 100,

        head: [[
            "Service",
            "Amount"
        ]],

        body: rows,

    })

    const finalY =
        (doc as any)
            .lastAutoTable
            .finalY

    // TOTALS

    doc.text(
        `Subtotal : ₹${invoice.subtotal}`,
        140,
        finalY + 15
    )

    doc.text(
        `CGST (9%) : ₹${(invoice.gst / 2)
            .toFixed(2)
        }`,
        140,
        finalY + 22
    )

    doc.text(
        `SGST (9%) : ₹${(invoice.gst / 2)
            .toFixed(2)
        }`,
        140,
        finalY + 29
    )

    doc.setFontSize(14)

    doc.text(
        `Total : ₹${invoice.totalAmount}`,
        140,
        finalY + 40
    )

    // FOOTER

    doc.setFontSize(10)

    doc.text(
        "Thank you for choosing TYRETRACK",
        14,
        270
    )

    doc.text(
        "Authorized Signatory",
        150,
        270
    )

    doc.save(
        `${invoice.invoiceId}.pdf`
    )

}