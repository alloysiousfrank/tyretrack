# Getting Free WhatsApp Cloud API Access (Meta)

## Cost
The API itself is free. Meta gives every business a free tier of
conversations per month; beyond that, utility-template messages (like
booking confirmations/invoices) cost a small per-message fee (a few
cents in India) — no subscription/platform fee either way. Testing
with your own number costs nothing.

## Steps

1. **Create a Meta Business Account**
   https://business.facebook.com → create a business if you don't
   have one (uses your existing Facebook login).

2. **Create a Meta Developer App**
   https://developers.facebook.com/apps → "Create App" → choose
   **"Business"** as the app type → link it to the Business Account
   from step 1.

3. **Add the WhatsApp product**
   In the app dashboard, find "WhatsApp" under "Add products to your
   app" and click Set Up. Meta auto-provisions a **test phone number**
   for you immediately — no waiting.

4. **Grab your credentials**
   Under WhatsApp → API Setup you'll see:
   - **Temporary access token** (24h, for testing only)
   - **Phone Number ID** — this is `WHATSAPP_PHONE_ID`
   - A "To" field where you can add up to 5 **tester numbers**
     (add your own phone here to test immediately, free, no approval)

5. **Generate a permanent token** (for production)
   Business Settings → Users → System Users → create a system user →
   generate a token with `whatsapp_business_messaging` +
   `whatsapp_business_management` permissions, no expiry. This is
   `WHATSAPP_TOKEN`.

6. **Get a real business number** (to message anyone, not just testers)
   WhatsApp → API Setup → "Add phone number" → verify a number you
   own (can't be already active on personal WhatsApp) → this replaces
   the test number once approved.

7. **Create & submit message templates**
   WhatsApp Manager → Message Templates → Create Template. You need
   one template per flow (see `templates.md`). Category: "Utility".
   Approval usually takes minutes to a couple of days.

8. **Business verification** (only needed to raise messaging limits
   beyond the starter tier — not required to start testing/sending)
   Business Settings → Security Center → Start Verification.

## What you'll paste into `.env`

```
WHATSAPP_TOKEN=<permanent system-user token from step 5>
WHATSAPP_PHONE_ID=<Phone Number ID from step 4/6>
WHATSAPP_API_VERSION=v21.0
```
