import { useEffect, useState } from "react"
import { useParams, useNavigate } from "react-router-dom"
import { downloadCustomerReportPDF } from "../utils/generateCustomerReportPDF"
import "./AdminCustomerDetail.css"

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

export default function AdminCustomerDetail() {

  const { customerKey } = useParams()
  const navigate = useNavigate()

  const [customer, setCustomer] = useState<CustomerInfo | null>(null)
  const [services, setServices] = useState<ServiceRow[]>([])
  const [totalSpent, setTotalSpent] = useState(0)
  const [loading, setLoading] = useState(true)

  useEffect(() => {

    fetchHistory()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [customerKey])

  const fetchHistory = async () => {

    setLoading(true)

    try {

      const response = await fetch(
        `https://tyretrack-server.onrender.com/api/admin/customers/${encodeURIComponent(customerKey || "")}/history`
      )

      const data = await response.json()

      if (data.success) {
        setCustomer(data.customer)
        setServices(data.services)
        setTotalSpent(data.totalSpent)
      }

    } catch (error) {

      console.log(error)

    } finally {

      setLoading(false)

    }

  }

  const handleDownload = () => {

    if (!customer) return

    downloadCustomerReportPDF(customer, services, totalSpent)

  }

  // Groups the flat service list by invoice (every line on one invoice
  // shares that invoice's date), so the date/invoice number column is
  // shown once per invoice instead of repeating on every service row —
  // same grouping used in the downloaded PDF, kept consistent here.
  const groupedServices: { invoiceId: string; date: string; rows: ServiceRow[] }[] = []
  services.forEach((s) => {
    let group = groupedServices.find((g) => g.invoiceId === s.invoiceId)
    if (!group) {
      group = { invoiceId: s.invoiceId, date: s.date, rows: [] }
      groupedServices.push(group)
    }
    group.rows.push(s)
  })

  return (

    <div className="admin-page">

      <div className="admin-container">

        <div className="customer-detail-header">
          <button className="customer-back-btn" onClick={() => navigate("/admin-customers")}>
            ← Back
          </button>
          <h1>Customer Details</h1>
        </div>

        {loading && (
          <p className="customer-detail-loading">Loading...</p>
        )}

        {!loading && !customer && (
          <p className="customer-detail-loading">No service history found for this customer.</p>
        )}

        {!loading && customer && (
          <>
            <div className="customer-detail-card">

              <div className="customer-detail-info">
                <h2>{customer.name || "—"}</h2>
                <p><strong>Phone:</strong> {customer.phone || "—"}</p>
                <p><strong>Email:</strong> {customer.email || "—"}</p>
                <p><strong>Vehicle Number:</strong> {customer.vehicleNumber || "—"}</p>
                <p><strong>Total Amount Spent:</strong> ₹ {Number(totalSpent).toLocaleString("en-IN", { maximumFractionDigits: 2 })}</p>
              </div>

              <button className="customer-download-btn" onClick={handleDownload}>
                ⬇ Download Report (PDF)
              </button>

            </div>

            <div className="customer-history-table-wrapper">
              <table className="customer-history-table">
                <thead>
                  <tr>
                    <th>Date / Invoice No.</th>
                    <th>Service</th>
                    <th>Qty</th>
                    <th>Amount</th>
                    <th>Total</th>
                  </tr>
                </thead>
                <tbody>
                  {services.length === 0 && (
                    <tr>
                      <td colSpan={5} className="customer-history-empty">No service history found.</td>
                    </tr>
                  )}
                  {groupedServices.map((group) => (
                    group.rows.map((s, idx) => (
                      <tr key={`${group.invoiceId}-${idx}`}>
                        {idx === 0 && (
                          <td rowSpan={group.rows.length} className="customer-history-datecell">
                            {new Date(group.date).toLocaleDateString("en-IN", { day: "2-digit", month: "short", year: "numeric" })}
                            <br />
                            <span className="customer-history-invoiceid">{group.invoiceId}</span>
                          </td>
                        )}
                        <td>{s.serviceName}</td>
                        <td>{s.quantity}</td>
                        <td>₹ {Number(s.amount).toLocaleString("en-IN", { maximumFractionDigits: 2 })}</td>
                        <td>₹ {Number(s.total).toLocaleString("en-IN", { maximumFractionDigits: 2 })}</td>
                      </tr>
                    ))
                  ))}
                </tbody>
              </table>
            </div>
          </>
        )}

      </div>

    </div>

  )

}
