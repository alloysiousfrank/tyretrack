# WhatsApp Automation — Wiring Instructions

## 1. Copy files into your repo

```
server/utils/whatsappService.js       -> server/utils/whatsappService.js
server/utils/whatsappMessages.js      -> server/utils/whatsappMessages.js
server/controllers/whatsappController.js -> server/controllers/whatsappController.js
server/routes/whatsappRoutes.js       -> server/routes/whatsappRoutes.js

server/controllers/bookingController.js  -> REPLACES your existing file
server/controllers/invoiceController.js  -> REPLACES your existing file
```

`quotationController.js` was NOT replaced (it's large and only needs the
optional text-notification hook — see step 4 below if you want it).

## 2. Register the new route in `server/server.js`

Add near the other route requires:

```js
const whatsappRoutes = require("./routes/whatsappRoutes")
```

Add near the other `app.use(...)` calls:

```js
app.use("/api/whatsapp", whatsappRoutes)
```

## 3. Add environment variables

Add to `server/.env` (and to Render's Environment settings):

```
WHATSAPP_TOKEN=your-permanent-access-token
WHATSAPP_PHONE_ID=your-phone-number-id
WHATSAPP_API_VERSION=v21.0
```

See `META_SETUP.md` in this bundle for how to get these.

## 4. Frontend: 2 small edits

### a) Copy the utils

```
frontend-snippets/sendInvoiceWhatsApp.ts -> src/utils/sendInvoiceWhatsApp.ts
frontend-snippets/sendQuoteWhatsApp.ts   -> src/utils/sendQuoteWhatsApp.ts
```

### b) `src/pages/AdminInvoices.tsx` — inside `publishInvoice`

Import at the top:
```ts
import { sendInvoiceWhatsApp } from "../utils/sendInvoiceWhatsApp"
```

Find this block (around line 756):
```ts
const emailResult =
  await sendInvoiceEmail(
    publishedInvoice,
    pdfBlob
  )

console.log(emailResult)
```

Add right after it:
```ts
const whatsappResult =
  await sendInvoiceWhatsApp(
    publishedInvoice,
    pdfBlob
  )

console.log(whatsappResult)
```

That's it — now every time admin clicks **Publish**, the invoice PDF is
emailed AND sent over WhatsApp automatically, in addition to the
"service completed" text that the backend already fires the moment
`publishInvoice` runs (see `invoiceController.js`).

### c) `src/components/quotations/QuoteEditor.tsx` — inside `publishQuote`

Import at the top:
```ts
import { generateQuotePDF } from "../../utils/generateQuotePDF"
import { sendQuoteWhatsApp } from "../../utils/sendQuoteWhatsApp"
```

Currently `publishQuote` only calls the publish endpoint and doesn't
generate/send anything. Update the success branch (around line 287):

```ts
if (data.success) {

  alert("Quotation Published Successfully ✅")

  applyQuoteData(data.quotation)

  // NEW: generate the PDF and send it over WhatsApp automatically
  try {

    const items = [
      {
        description: `${quote.preferredBrand || "Tyre"} Tyre`,
        quantity: tyreQuantity,
        rate: tyrePrice,
        total: tyrePrice * tyreQuantity,
      },
      { description: "Labour", quantity: 1, rate: labourCharge, total: labourCharge },
      { description: "Accessories", quantity: 1, rate: accessoriesCharge, total: accessoriesCharge },
    ].filter((item) => item.total > 0)

    const pdfBlob = await generateQuotePDF({
      quoteNumber: data.quotation.quoteId,
      customerName: data.quotation.customerName,
      phone: data.quotation.phone,
      email: data.quotation.email,
      vehicleNumber: data.quotation.vehicleNumber,
      vehicleType: data.quotation.vehicleType,
      vehicleBrand: data.quotation.vehicleBrand,
      vehicleModel: data.quotation.vehicleModel,
      tyreSize: data.quotation.tyreSize,
      preferredBrand: data.quotation.preferredBrand,
      notes: data.quotation.notes,
      validTill: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toLocaleDateString("en-IN"),
      subtotal,
      gst,
      total,
      items,
    })

    const whatsappResult = await sendQuoteWhatsApp(data.quotation, pdfBlob)
    console.log(whatsappResult)

  } catch (waErr) {
    console.log("Quote WhatsApp send failed:", waErr)
  }

}
```

> Note: `generateQuotePDF` in your repo currently only *saves* the PDF
> (`doc.save(...)`) rather than returning the blob to the caller in all
> paths — double check the tail of that function returns
> `doc.output("blob")` (it does, per the version I reviewed). If you've
> since changed it, make sure it still returns the blob.

## 5. Test locally before going live

1. Set the env vars.
2. Use Meta's **test number** + **your own WhatsApp number added as a
   tester** in Meta Business Manager (free, no approval needed for this).
3. Trigger a booking — you should get the welcome + booking-confirmation
   templates on WhatsApp.
4. Publish an invoice/quote — you should get the completion text + PDF.

Once templates are approved and you've added a real business number,
this works for any customer, not just testers.
