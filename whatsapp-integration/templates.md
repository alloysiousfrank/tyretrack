# Message Templates to Submit in Meta WhatsApp Manager

Category for all of these: **Utility**. Language: English (en_US) —
match whatever you pass as `languageCode` in whatsappMessages.js.

---

### 1. `tyretrack_welcome`
Body:
```
Welcome to TyreTrack Premium Auto Care, {{1}}! 🚗
Thanks for booking with us — we look forward to serving your vehicle.
```
Variables: `{{1}}` = customer name

---

### 2. `tyretrack_booking_confirmed`
Body:
```
Hi {{1}}, your booking {{2}} is confirmed ✅
Service: {{3}}
Date: {{4}}
Time: {{5}}
Track your vehicle anytime on the TyreTrack website.
```
Variables: `{{1}}` name, `{{2}}` bookingId, `{{3}}` service, `{{4}}` date, `{{5}}` time

---

### 3. `tyretrack_service_completed`
Body:
```
Hi {{1}}, the service on {{2}} is complete 🎉
Your invoice is on its way. Thank you for choosing TyreTrack Premium Auto Care!
```
Variables: `{{1}}` name, `{{2}}` vehicle number

---

### 4. `tyretrack_invoice_ready`
Body:
```
Hi {{1}}, your invoice {{2}} for ₹{{3}} has been generated.
The PDF will follow in the next message.
```
Variables: `{{1}}` name, `{{2}}` invoiceId, `{{3}}` totalAmount

---

### 5. `tyretrack_quote_ready`
Body:
```
Hi {{1}}, your quotation {{2}} for ₹{{3}} is ready.
The PDF will follow in the next message. Valid for 30 days.
```
Variables: `{{1}}` name, `{{2}}` quoteId, `{{3}}` totalAmount

---

Once approved, the template *names* above must match exactly what's
used in `server/utils/whatsappMessages.js`. If you rename a template
in Meta, update it there too.
