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

  // Search-by-Booking-ID (works without being logged in)
  const [searchInput, setSearchInput] = useState("")
  const [searchError, setSearchError] = useState("")
  const [activeBookingId, setActiveBookingId] = useState<string | null>(null)

  const errorCountRef = useRef(0)           // track consecutive failures
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null)

  const isLoggedIn = !!localStorage.getItem("userEmail")

  const stages = [
    "Booking Confirmed",
    "Vehicle Received",
    "Service Started",
    "Quality Check",
    "Completed",
  ]

  // Fetches invoice for whatever booking is currently active,
  // regardless of whether it came from login or a manual search.
  const fetchInvoiceForBooking = async (currentBooking: any) => {

    if (!currentBooking.invoiceGenerated) return

    try {

      const invoiceResponse = await fetch(
        `${SERVER}/api/invoices/booking/${currentBooking.bookingId}`
      )

      const invoiceData = await invoiceResponse.json()

      if (invoiceData.success && invoiceData.invoice) {
        setInvoice(invoiceData.invoice)
      }

    } catch (invoiceError) {
      console.log("Invoice fetch failed (non-fatal):", invoiceError)
    }

  }

  // LOGGED-IN PATH: auto-fetch the customer's latest booking by email
  const fetchLatestBookingForUser = async () => {

    try {

      const currentUserEmail = localStorage.getItem("userEmail")
      if (!currentUserEmail) return

      const encodedEmail = encodeURIComponent(currentUserEmail)

      const response = await fetch(
        `${SERVER}/api/bookings/user/${encodedEmail}`
      )

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}`)
      }

      const data = await response.json()

      errorCountRef.current = 0
      setServerStatus("online")

      if (data.success && data.bookings.length > 0) {

        const currentBooking = data.bookings[0]
        setBooking(currentBooking)
        fetchInvoiceForBooking(currentBooking)

      }

    } catch (error) {

      errorCountRef.current += 1
      console.log(`Fetch attempt ${errorCountRef.current} failed:`, error)

      if (errorCountRef.current === 1) {
        setServerStatus("waking")
      }

      if (errorCountRef.current >= 5) {
        setServerStatus("error")
        if (intervalRef.current) {
          clearInterval(intervalRef.current)
          intervalRef.current = null
        }
      }

    }

  }

  // SEARCH PATH: fetch a specific booking by its Booking ID
  const fetchBookingById = async (bookingId: string) => {

    try {

      setSearchError("")

      const response = await fetch(
        `${SERVER}/api/bookings/${encodeURIComponent(bookingId)}`
      )

      const data = await response.json()

      errorCountRef.current = 0
      setServerStatus("online")

      if (data.success && data.booking) {

        setBooking(data.booking)
        setInvoice(null)
        fetchInvoiceForBooking(data.booking)

      } else {

        setBooking(null)
        setInvoice(null)
        setSearchError("No booking found with that ID. Check and try again.")

      }

    } catch (error) {

      console.log("Booking search failed:", error)
      setSearchError("Couldn't reach the server — try again in a moment.")

    }

  }

  const handleSearchSubmit = (e: React.FormEvent) => {

    e.preventDefault()

    const trimmed = searchInput.trim().toUpperCase()

    if (!trimmed) {
      setSearchError("Enter a Booking ID first.")
      return
    }

    // Stop polling by email (if it was running) — we're now tracking
    // a manually searched booking instead.
    if (intervalRef.current) {
      clearInterval(intervalRef.current)
      intervalRef.current = null
    }

    setActiveBookingId(trimmed)
    fetchBookingById(trimmed)

    // Poll this specific booking every 5s for live status updates,
    // same as the logged-in experience.
    intervalRef.current = setInterval(
      () => fetchBookingById(trimmed),
      5000
    )

  }

  useEffect(() => {

    if (isLoggedIn) {

      fetchLatestBookingForUser()

      intervalRef.current = setInterval(
        fetchLatestBookingForUser,
        5000
      )

    } else {

      // Not logged in — nothing to auto-fetch, just wait for a search.
      setServerStatus("online")

    }

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current)
      }
    }

  }, [])

  // Retry button — resets error state and restarts whichever mode was active
  const handleRetry = () => {

    errorCountRef.current = 0
    setServerStatus("loading")

    if (activeBookingId) {

      fetchBookingById(activeBookingId)

      if (!intervalRef.current) {
        intervalRef.current = setInterval(
          () => fetchBookingById(activeBookingId),
          5000
        )
      }

    } else if (isLoggedIn) {

      fetchLatestBookingForUser()

      if (!intervalRef.current) {
        intervalRef.current = setInterval(
          fetchLatestBookingForUser,
          5000
        )
      }

    }

  }

  return (

    <div className="tracking-page">

      <div className="tracking-card">

        <h1>Live Service Tracking</h1>

        {/* SEARCH BAR — works whether logged in or not */}

        <form
          className="tracking-search-bar"
          onSubmit={handleSearchSubmit}
        >

          <input
            type="text"
            placeholder="Enter your Booking ID (e.g. TYR73757)"
            value={searchInput}
            onChange={(e) => setSearchInput(e.target.value)}
          />

          <button type="submit">
            Track
          </button>

        </form>

        {searchError && (
          <p className="tracking-search-error">
            {searchError}
          </p>
        )}

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
              : isLoggedIn
                ? "No active booking found"
                : "Search using your Booking ID above to see live status"}
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
                <b>{invoice.services?.join(", ") || "—"}</b>
              </div>

              {invoice.customServices && invoice.customServices.length > 0 && (

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
                    {invoice.customServices.map((item: any, i: number) => (
                      <tr key={i}>
                        <td>{item.serviceName}</td>
                        <td>{item.quantity}</td>
                        <td>₹{item.amount}</td>
                        <td>₹{item.total}</td>
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
