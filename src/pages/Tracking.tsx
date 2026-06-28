import { useEffect, useState, useRef } from "react"
import "./Tracking.css"
import { generateInvoicePdf } from "../utils/generateInvoicePdf"

const SERVER = "https://tyretrack-server.onrender.com"

export default function Tracking() {

  const [booking, setBooking] = useState<any>(null)
  const [invoice, setInvoice] = useState<any>(null)
  const [showInvoice, setShowInvoice] = useState(false)
  const [serverStatus, setServerStatus] = useState<
    "loading" | "online" | "waking" | "error"
  >("loading")

  const errorCountRef = useRef(0)           // track consecutive failures
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null)

  const stages = [
    "Booking Confirmed",
    "Vehicle Received",
    "Service Started",
    "Quality Check",
    "Completed",
  ]

  const fetchLatestBooking = async () => {

    try {

      const currentUserEmail = localStorage.getItem("userEmail")
      if (!currentUserEmail) return

      // ✅ FIX: encode email so @ and . don't break the URL
      const encodedEmail = encodeURIComponent(currentUserEmail)

      const response = await fetch(
        `${SERVER}/api/bookings/user/${encodedEmail}`
      )

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}`)
      }

      const data = await response.json()

      // ✅ Server is responding — reset error count
      errorCountRef.current = 0
      setServerStatus("online")

      if (data.success && data.bookings.length > 0) {

        setBooking(data.bookings[0])
        const currentBooking = data.bookings[0]

        // Fetch invoice only if flagged
        if (currentBooking.invoiceGenerated) {

          try {

            const invoiceResponse = await fetch(
              `${SERVER}/api/invoices/customer/${encodedEmail}`
            )

            const invoiceData = await invoiceResponse.json()

            if (invoiceData.success && invoiceData.invoices.length > 0) {

              const customerInvoice = invoiceData.invoices.find(
                (inv: any) =>
                  inv.bookingId === currentBooking.bookingId &&
                  inv.isPublished === true
              )

              if (customerInvoice) {
                setInvoice(customerInvoice)
              }

            }

          } catch (invoiceError) {
            console.log("Invoice fetch failed (non-fatal):", invoiceError)
          }

        }

      }

    } catch (error) {

      errorCountRef.current += 1
      console.log(`Fetch attempt ${errorCountRef.current} failed:`, error)

      if (errorCountRef.current === 1) {
        // First failure — show waking message (Render cold start)
        setServerStatus("waking")
      }

      if (errorCountRef.current >= 5) {
        // ✅ FIX: after 5 consecutive failures, stop hammering the server
        setServerStatus("error")
        if (intervalRef.current) {
          clearInterval(intervalRef.current)
          intervalRef.current = null
        }
      }

    }

  }

  useEffect(() => {

    fetchLatestBooking()

    // ✅ FIX: poll every 5s (not 3s) — less aggressive on Render free tier
    intervalRef.current = setInterval(fetchLatestBooking, 5000)

    // ✅ FIX: always clear interval on unmount
    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current)
      }
    }

  }, [])

  // Retry button — resets error state and restarts polling
  const handleRetry = () => {
    errorCountRef.current = 0
    setServerStatus("loading")
    fetchLatestBooking()
    if (!intervalRef.current) {
      intervalRef.current = setInterval(fetchLatestBooking, 5000)
    }
  }

  return (

    <div className="tracking-page">

      <div className="tracking-card">

        <h1>Live Service Tracking</h1>

        {/* SERVER STATUS BANNERS */}

        {serverStatus === "waking" && (
          <div className="server-waking-banner">
            ⏳ Server is waking up, please wait a moment...
          </div>
        )}

        {serverStatus === "error" && (
          <div className="server-error-banner">
            ❌ Unable to reach server.
            <button onClick={handleRetry} className="retry-btn">
              Retry
            </button>
          </div>
        )}

        {/* BOOKING CONTENT */}

        {!booking ? (

          <p className="no-booking">
            {serverStatus === "loading" || serverStatus === "waking"
              ? "Connecting to server..."
              : "No active booking found"}
          </p>

        ) : (

          <div className="tracking-details">

            <div className="tracking-item">
              <span>Booking ID</span>
              <h3>{booking.bookingId}</h3>
            </div>

            <div className="tracking-item">
              <span>Customer</span>
              <h3>{booking.name}</h3>
            </div>

            <div className="tracking-item">
              <span>Service</span>
              <h3>{booking.service}</h3>
            </div>

            <div className="tracking-item">
              <span>Date</span>
              <h3>{new Date(booking.date).toLocaleDateString()}</h3>
            </div>

            <div className="tracking-item">
              <span>Time</span>
              <h3>{booking.time}</h3>
            </div>

            {/* LIVE TRACKING */}

            <div className="live-status">
              <div className="live-dot"></div>
              LIVE TRACKING ACTIVE
            </div>

            {/* PROGRESS */}

            <div className="tracking-progress">
              {stages.map((stage, index) => (
                <div
                  key={index}
                  className={`tracking-stage ${
                    index <= booking.currentStage ? "active-stage" : ""
                  }`}
                >
                  <div className="stage-circle"></div>
                  <p>{stage}</p>
                </div>
              ))}
            </div>

            {/* CURRENT STATUS */}

            <div className="tracking-current-status">
              Current Status :
              <span>{stages[booking.currentStage]}</span>
            </div>

            {/* INVOICE SECTION */}

            {invoice && (

              <div className="customer-invoice-box">

                <h2>📄 Invoice Available</h2>

                <div className="invoice-info">
                  <p>Invoice No : <b>{invoice.invoiceId}</b></p>
                  <p>Amount : <b>₹{invoice.totalAmount}</b></p>
                  <p>
                    Generated :{" "}
                    <b>{new Date(invoice.createdAt).toLocaleDateString()}</b>
                  </p>
                </div>

                <div className="invoice-buttons">

                  <button
                    className="invoice-view-btn"
                    onClick={() => setShowInvoice(true)}
                  >
                    👁 View Invoice
                  </button>

                  <button
                    className="invoice-download-btn"
                    onClick={() => generateInvoicePdf(invoice)}
                  >
                    ⬇ Download Invoice
                  </button>

                </div>

              </div>

            )}

          </div>

        )}

      </div>

      {/* ✅ INVOICE MODAL */}

      {showInvoice && invoice && (

        <div
          className="invoice-modal-overlay"
          onClick={() => setShowInvoice(false)}
        >

          <div
            className="invoice-modal"
            onClick={(e) => e.stopPropagation()}
          >

            <button
              className="invoice-modal-close"
              onClick={() => setShowInvoice(false)}
            >
              ✕
            </button>

            <h2>Invoice #{invoice.invoiceId}</h2>

            <div className="invoice-modal-body">

              <div className="invoice-row">
                <span>Customer</span>
                <b>{invoice.customerName}</b>
              </div>

              <div className="invoice-row">
                <span>Vehicle</span>
                <b>{invoice.vehicleNumber}</b>
              </div>

              <div className="invoice-row">
                <span>Service</span>
                <b>{invoice.service}</b>
              </div>

              {invoice.items && invoice.items.length > 0 && (

                <table className="invoice-items-table">
                  <thead>
                    <tr>
                      <th>Item</th>
                      <th>Qty</th>
                      <th>Rate</th>
                      <th>Amount</th>
                    </tr>
                  </thead>
                  <tbody>
                    {invoice.items.map((item: any, i: number) => (
                      <tr key={i}>
                        <td>{item.description}</td>
                        <td>{item.quantity}</td>
                        <td>₹{item.rate}</td>
                        <td>₹{item.amount}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>

              )}

              <div className="invoice-row invoice-total">
                <span>Total Amount</span>
                <b>₹{invoice.totalAmount}</b>
              </div>

            </div>

            <button
              className="invoice-download-btn"
              onClick={() => generateInvoicePdf(invoice)}
            >
              ⬇ Download PDF
            </button>

          </div>

        </div>

      )}

    </div>

  )

}