import { useEffect, useState } from "react"
import "./QuoteEditor.css"

// Dynamic import for generateQuotePDF so a missing file doesn't break the build.
const generateQuotePDF = async (payload: any) => {
  try {
    const mod = await import("../../utils/generateQuotePDF")
    return mod.generateQuotePDF(payload)
  } catch (e) {
    console.warn("generateQuotePDF module not available:", e)
    return
  }
}

interface Quote {
  _id: string
  quoteId: string
  customerName: string
  phone: string
  email: string
  vehicleType: string
  vehicleBrand: string
  vehicleModel: string
  vehicleNumber: string
  tyreSize: string
  preferredBrand: string
  notes: string
  tyrePrice: number
  tyreQuantity: number
  labourCharge: number
  accessoriesCharge: number
  discount: number
  includeGST: boolean
  gst: number
  subtotal: number
  totalAmount: number
  adminRemarks: string
}

interface Props {
  quoteId: string
  onClose: () => void
}

const fmtCurrency = (n: number) =>
  Number(n || 0).toLocaleString("en-IN", { maximumFractionDigits: 2 })

export default function QuoteEditor({ quoteId, onClose }: Props) {
  const [quote, setQuote] = useState<Quote | null>(null)
  const [tyrePrice, setTyrePrice] = useState(0)
  const [tyreQuantity, setTyreQuantity] = useState(1)
  const [labourCharge, setLabourCharge] = useState(0)
  const [accessoriesCharge, setAccessoriesCharge] = useState(0)
  const [discount, setDiscount] = useState(0)
  const [includeGST, setIncludeGST] = useState(true)
  const [adminRemarks, setAdminRemarks] = useState("")
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [publishing, setPublishing] = useState(false)

  useEffect(() => {
    loadQuote()
    // Re-fetch whenever a different quote is opened in this editor.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [quoteId])

  // Keeps local editable state in sync with whatever quotation object
  // (fresh from the server) we currently have.
  const applyQuoteData = (q: Quote) => {
    setQuote(q)
    setTyrePrice(q.tyrePrice || 0)
    setTyreQuantity(q.tyreQuantity || 1)
    setLabourCharge(q.labourCharge || 0)
    setAccessoriesCharge(q.accessoriesCharge || 0)
    setDiscount(q.discount || 0)
    setIncludeGST(q.includeGST ?? true)
    setAdminRemarks(q.adminRemarks || "")
  }

  const loadQuote = async () => {
    setLoading(true)
    try {
      const response = await fetch(
        `https://tyretrack-server.onrender.com/api/quotations/${quoteId}`
      )
      const data = await response.json()

      if (data.success) {
        applyQuoteData(data.quotation)
      }
    } catch (error) {
      console.log(error)
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return <div className="editor-loading">Loading...</div>
  }

  if (!quote) {
    return <div className="editor-loading">Quotation Not Found</div>
  }

  const rawSubtotal =
    tyrePrice * tyreQuantity + labourCharge + accessoriesCharge - discount

  // Never let a large discount push totals negative.
  const subtotal = Math.max(0, rawSubtotal)
  const gst = includeGST ? subtotal * 0.18 : 0
  const total = subtotal + gst

  const saveDraft = async () => {
    setSaving(true)
    try {
      const response = await fetch(
        `https://tyretrack-server.onrender.com/api/quotations/${quoteId}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            tyrePrice,
            tyreQuantity,
            labourCharge,
            accessoriesCharge,
            discount,
            includeGST,
            adminRemarks,
          }),
        }
      )

      const data = await response.json()

      if (data.success) {
        alert("Quotation Draft Saved Successfully ✅")
        // The PUT response already returns the saved quotation —
        // no need to re-fetch it a second time.
        applyQuoteData(data.quotation)
      } else {
        alert(data.message || "Unable to save draft.")
      }
    } catch (error) {
      console.log(error)
      alert("Unable to save draft. Please check your connection and try again.")
    } finally {
      setSaving(false)
    }
  }

  const handleGeneratePDF = async () => {
    if (!quote) {
      return
    }

    const items = [
      {
        description: `${quote.preferredBrand || "Tyre"} Tyre`,
        quantity: tyreQuantity,
        rate: tyrePrice,
        total: tyrePrice * tyreQuantity,
      },
      {
        description: "Labour",
        quantity: 1,
        rate: labourCharge,
        total: labourCharge,
      },
      {
        description: "Accessories",
        quantity: 1,
        rate: accessoriesCharge,
        total: accessoriesCharge,
      },
      // Only include a line if there's an actual amount to charge for it.
    ].filter((item) => item.total > 0)

    await generateQuotePDF({
      quoteNumber: quote.quoteId,
      customerName: quote.customerName,
      phone: quote.phone,
      email: quote.email,
      vehicleNumber: quote.vehicleNumber,
      vehicleType: quote.vehicleType,
      vehicleBrand: quote.vehicleBrand,
      vehicleModel: quote.vehicleModel,
      tyreSize: quote.tyreSize,
      preferredBrand: quote.preferredBrand,
      notes: quote.notes,
      validTill: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toLocaleDateString(
        "en-IN"
      ),
      subtotal,
      gst,
      total,
      items,
    })
  }

  const publishQuote = async () => {
    const token = localStorage.getItem("adminToken")
    if (!token) {
      alert("Your session has expired. Please log in again to publish.")
      return
    }

    setPublishing(true)
    try {
      const response = await fetch(
        `https://tyretrack-server.onrender.com/api/quotations/publish/${quoteId}`,
        {
          method: "PUT",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      )

      const data = await response.json()

      if (data.success) {
        alert("Quotation Published Successfully ✅")
        loadQuote()
      } else {
        alert(data.message || "Unable to publish quotation.")
      }
    } catch (error) {
      console.log(error)
      alert("Unable to publish quotation.")
    } finally {
      setPublishing(false)
    }
  }

  return (
<div
className="editor-overlay"
onWheel={(e)=>{

e.stopPropagation()

}}
>

<div
className="editor-container"
onWheel={(e)=>{

e.stopPropagation()

}}
>
        <div className="editor-header">
          <h1>Quotation Editor</h1>
          <button onClick={onClose}>✕</button>
        </div>

        {/* CUSTOMER */}
        <section className="editor-card">
          <h2>Customer Information</h2>
          <div className="editor-grid">
            <div className="field-group">
              <label>Customer Name</label>
              <input value={quote.customerName} readOnly />
            </div>
            <div className="field-group">
              <label>Phone</label>
              <input value={quote.phone} readOnly />
            </div>
            <div className="field-group">
              <label>Email</label>
              <input value={quote.email} readOnly />
            </div>
          </div>
        </section>

        {/* VEHICLE */}
        <section className="editor-card">
          <h2>Vehicle Information</h2>
          <div className="editor-grid">
            <div className="field-group">
              <label>Vehicle Type</label>
              <input value={quote.vehicleType} readOnly />
            </div>
            <div className="field-group">
              <label>Vehicle Brand</label>
              <input value={quote.vehicleBrand} readOnly />
            </div>
            <div className="field-group">
              <label>Vehicle Model</label>
              <input value={quote.vehicleModel} readOnly />
            </div>
            <div className="field-group">
              <label>Vehicle Number</label>
              <input value={quote.vehicleNumber} readOnly />
            </div>
            <div className="field-group">
              <label>Tyre Size</label>
              <input value={quote.tyreSize} readOnly />
            </div>
            <div className="field-group">
              <label>Preferred Brand</label>
              <input value={quote.preferredBrand} readOnly />
            </div>
          </div>

          {quote.notes && (
            <textarea value={quote.notes} readOnly rows={3} />
          )}
        </section>

        {/* PRICING */}
        <section className="pricing-section">
          <div className="section-title">
            <div>
              <h2>Pricing Details</h2>
              <p>Enter the quotation pricing below.</p>
            </div>
          </div>

          <div className="pricing-grid">
            <div className="pricing-card">
              <label>🛞 Tyre Price (₹ / Per Tyre)</label>
              <small>Price of one tyre.</small>
              <input
                type="number"
                min={0}
                value={tyrePrice}
                onChange={(e) => setTyrePrice(Number(e.target.value))}
                placeholder="Example : 3500"
              />
            </div>

            <div className="pricing-card">
              <label>📦 Tyre Quantity</label>
              <small>Number of tyres.</small>
              <input
                type="number"
                min={0}
                value={tyreQuantity}
                onChange={(e) => setTyreQuantity(Number(e.target.value))}
                placeholder="Example : 4"
              />
            </div>

            <div className="pricing-card">
              <label>🔧 Labour Charge (₹)</label>
              <small>Wheel fitting, balancing, alignment etc.</small>
              <input
                type="number"
                min={0}
                value={labourCharge}
                onChange={(e) => setLabourCharge(Number(e.target.value))}
                placeholder="Example : 600"
              />
            </div>

            <div className="pricing-card">
              <label>🧰 Accessories Charge (₹)</label>
              <small>Valve, Nitrogen, Wheel weights etc.</small>
              <input
                type="number"
                min={0}
                value={accessoriesCharge}
                onChange={(e) => setAccessoriesCharge(Number(e.target.value))}
                placeholder="Example : 250"
              />
            </div>

            <div className="pricing-card">
              <label>🏷 Discount (₹)</label>
              <small>Optional customer discount.</small>
              <input
                type="number"
                min={0}
                value={discount}
                onChange={(e) => setDiscount(Number(e.target.value))}
                placeholder="Example : 500"
              />
            </div>
          </div>

          <div className="gst-box">
            <label>
              <input
                type="checkbox"
                checked={includeGST}
                onChange={(e) => setIncludeGST(e.target.checked)}
              />
              Include GST (18%)
            </label>
          </div>

          {/* SUMMARY */}
          <div className="summary-card">
            <h2>Summary</h2>
            <div className="summary-row">
              <span>Subtotal</span>
              <span>₹ {fmtCurrency(subtotal)}</span>
            </div>
            <div className="summary-row">
              <span>GST {includeGST ? "(18%)" : "(not applied)"}</span>
              <span>₹ {fmtCurrency(gst)}</span>
            </div>
            <div className="summary-row total">
              <span>Total</span>
              <span>₹ {fmtCurrency(total)}</span>
            </div>
          </div>
        </section>

        {/* ADMIN REMARKS */}
        <section className="editor-card">
          <h2>Internal Notes (Admin Remarks)</h2>
          <textarea
            value={adminRemarks}
            onChange={(e) => setAdminRemarks(e.target.value)}
            placeholder="Internal notes visible only to admins — not shown to the customer."
            rows={4}
          />
        </section>

        <div className="editor-actions">
          <button className="draft" onClick={saveDraft} disabled={saving}>
            {saving ? "Saving..." : "Save Draft"}
          </button>

          <button className="pdf" onClick={handleGeneratePDF}>
            Generate PDF
          </button>

          <button className="publish" onClick={publishQuote} disabled={publishing}>
            {publishing ? "Publishing..." : "Publish Quote"}
          </button>
        </div>
      </div>
    </div>
  )
}