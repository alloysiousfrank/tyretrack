import {
  useEffect,
  useState,
} from "react"

import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  PieChart,
  Pie,
  Cell,
  BarChart,
  Bar,
  Legend,
} from "recharts"

import "./AdminReports.css"

const RED = "#e10600"
const RED_SOFT = "rgba(225, 6, 0, 0.35)"
const GRID_COLOR = "rgba(255, 255, 255, 0.08)"
const TEXT_MUTED = "rgba(245, 245, 247, 0.55)"
const PIE_COLORS = [RED, "#f5f5f7"]

const API_BASE = "https://tyretrack-server.onrender.com/api/admin"

type MonthlyRevenue = {
  month: string
  revenue: number
  invoiceCount: number
}

type GstSplitEntry = {
  name: string
  revenue: number
  count: number
}

type ServiceRevenueEntry = {
  service: string
  revenue: number
}

type TrendsData = {
  monthlyRevenue: MonthlyRevenue[]
  gstSplit: GstSplitEntry[]
  serviceRevenue: ServiceRevenueEntry[]
}

type ReportData = {
  totalUsers: number
  totalBookings: number
  completedBookings: number
  pendingBookings: number
  revenue: number
}

// Turns a value into a safe CSV cell — wraps in quotes and escapes
// any quotes inside, so names/commas in the data can't break columns.
const csvCell = (value: string | number) => {

  const str = String(value)

  if (/[",\n]/.test(str)) {
    return `"${str.replace(/"/g, '""')}"`
  }

  return str

}

const downloadCsv = (filename: string, rows: (string | number)[][]) => {

  const csvContent = rows
    .map((row) => row.map(csvCell).join(","))
    .join("\n")

  const blob = new Blob(
    ["\uFEFF" + csvContent],
    { type: "text/csv;charset=utf-8;" }
  )

  const url = URL.createObjectURL(blob)

  const link = document.createElement("a")
  link.href = url
  link.setAttribute("download", filename)
  document.body.appendChild(link)
  link.click()
  document.body.removeChild(link)

  URL.revokeObjectURL(url)

}

export default function AdminReports() {

  const [report,
    setReport] =
    useState<ReportData | null>(null)

  const [trends,
    setTrends] =
    useState<TrendsData | null>(null)

  const [lastUpdated,
    setLastUpdated] =
    useState<Date | null>(null)

  const [exporting,
    setExporting] =
    useState(false)

  useEffect(() => {

    fetchReports()
    fetchRevenueTrends()

  }, [])

  const fetchReports =
    async () => {

      try {

        const response =
          await fetch(
            `${API_BASE}/reports`
          )

        const data =
          await response.json()

        setReport(data)
        setLastUpdated(new Date())

      } catch (error) {

        console.log(error)

      }

    }

  const fetchRevenueTrends =
    async () => {

      try {

        const response =
          await fetch(
            `${API_BASE}/revenue-trends`
          )

        const result =
          await response.json()

        if (result.success) {
          setTrends(result)
        }

      } catch (error) {

        console.log(error)

      }

    }

  // Pulls fresh data from both endpoints — every export always
  // reflects whatever invoices exist in the database at that moment,
  // so there's nothing to update by hand before exporting.
  const handleExportCsv =
    async () => {

      setExporting(true)

      try {

        const [reportsRes, trendsRes] = await Promise.all([
          fetch(`${API_BASE}/reports`),
          fetch(`${API_BASE}/revenue-trends`),
        ])

        const freshReport: ReportData = await reportsRes.json()
        const freshTrendsRaw = await trendsRes.json()
        const freshTrends: TrendsData | null =
          freshTrendsRaw.success ? freshTrendsRaw : null

        const rows: (string | number)[][] = []

        rows.push(["TyreTrack Business Report"])
        rows.push(["Generated At", new Date().toLocaleString()])
        rows.push([])

        rows.push(["Summary"])
        rows.push(["Metric", "Value"])
        rows.push(["Total Users", freshReport.totalUsers])
        rows.push(["Total Bookings", freshReport.totalBookings])
        rows.push(["Completed Bookings", freshReport.completedBookings])
        rows.push(["Pending Bookings", freshReport.pendingBookings])
        rows.push(["Total Revenue (Published Invoices)", freshReport.revenue])
        rows.push([])

        if (freshTrends) {

          rows.push(["Monthly Revenue (Last 12 Months)"])
          rows.push(["Month", "Revenue", "Invoice Count"])
          freshTrends.monthlyRevenue.forEach((m) => {
            rows.push([m.month, m.revenue, m.invoiceCount])
          })
          rows.push([])

          rows.push(["GST vs Non-GST Revenue"])
          rows.push(["Category", "Revenue", "Invoice Count"])
          freshTrends.gstSplit.forEach((g) => {
            rows.push([g.name, g.revenue, g.count])
          })
          rows.push([])

          rows.push(["Top Services by Revenue"])
          rows.push(["Service", "Revenue"])
          freshTrends.serviceRevenue.forEach((s) => {
            rows.push([s.service, s.revenue])
          })

        }

        const timestamp = new Date()
          .toISOString()
          .slice(0, 19)
          .replace(/[:T]/g, "-")

        downloadCsv(
          `tyretrack-report-${timestamp}.csv`,
          rows
        )

      } catch (error) {

        console.log(error)

      } finally {

        setExporting(false)

      }

    }

  if (!report)
    return <p>Loading...</p>

  return (

    <div className="admin-page">

      <div className="admin-container">

        <div className="reports-header-row">

          <h1>
            Business Reports
          </h1>

          <div className="reports-export-group">

            <button
              className="export-btn secondary"
              onClick={() => {
                fetchReports()
                fetchRevenueTrends()
              }}
            >
              Refresh
            </button>

            <button
              className="export-btn"
              onClick={handleExportCsv}
              disabled={exporting}
            >
              {exporting ? "Exporting..." : "Export CSV"}
            </button>

          </div>

        </div>

        {lastUpdated && (
          <p className="reports-updated-note">
            Live from invoices &amp; bookings · last refreshed{" "}
            {lastUpdated.toLocaleTimeString()}
          </p>
        )}

        <div className="admin-stats">

          <div className="stat-card">
            <h3>Total Users</h3>
            <p>{report.totalUsers}</p>
          </div>

          <div className="stat-card">
            <h3>Total Bookings</h3>
            <p>{report.totalBookings}</p>
          </div>

          <div className="stat-card">
            <h3>Completed</h3>
            <p>{report.completedBookings}</p>
          </div>

          <div className="stat-card">
            <h3>Pending</h3>
            <p>{report.pendingBookings}</p>
          </div>

          <div className="stat-card">
            <h3>Revenue</h3>
            <p>₹ {report.revenue}</p>
          </div>

        </div>

        {trends && (
          <>
            <h2>Revenue Trend (Last 12 Months)</h2>

            <div className="admin-card analytics-chart-card">
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={trends.monthlyRevenue}>
                  <CartesianGrid stroke={GRID_COLOR} vertical={false} />
                  <XAxis
                    dataKey="month"
                    stroke={TEXT_MUTED}
                    tick={{ fill: TEXT_MUTED, fontSize: 12 }}
                  />
                  <YAxis
                    stroke={TEXT_MUTED}
                    tick={{ fill: TEXT_MUTED, fontSize: 12 }}
                    tickFormatter={(v) => `₹${v}`}
                  />
                  <Tooltip
                    contentStyle={{
                      background: "#0c0c0c",
                      border: `1px solid ${RED_SOFT}`,
                      borderRadius: 12,
                    }}
                    labelStyle={{ color: "#f5f5f7" }}
                    formatter={(value: any) => [`₹${Number(value).toLocaleString()}`, "Revenue"]}
                  />
                  <Line
                    type="monotone"
                    dataKey="revenue"
                    stroke={RED}
                    strokeWidth={3}
                    dot={{ fill: RED, r: 4 }}
                    activeDot={{ r: 6 }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>

            <div className="analytics-chart-row">

              <div className="admin-card analytics-chart-card">
                <h2>GST vs Non-GST Revenue</h2>
                <ResponsiveContainer width="100%" height={280}>
                  <PieChart>
                    <Pie
                      data={trends.gstSplit}
                      dataKey="revenue"
                      nameKey="name"
                      cx="50%"
                      cy="50%"
                      outerRadius={90}
                      label={(entry: any) => `₹${entry.revenue.toLocaleString()}`}
                    >
                      {trends.gstSplit.map((_entry: any, index: number) => (
                        <Cell key={index} fill={PIE_COLORS[index % PIE_COLORS.length]} />
                      ))}
                    </Pie>
                    <Legend
                      wrapperStyle={{ color: TEXT_MUTED, fontSize: 13 }}
                    />
                    <Tooltip
                      contentStyle={{
                        background: "#0c0c0c",
                        border: `1px solid ${RED_SOFT}`,
                        borderRadius: 12,
                      }}
                      formatter={(value: any) => [`₹${Number(value).toLocaleString()}`, "Revenue"]}
                    />
                  </PieChart>
                </ResponsiveContainer>
              </div>

              <div className="admin-card analytics-chart-card">
                <h2>Top Services by Revenue</h2>
                <ResponsiveContainer width="100%" height={280}>
                  <BarChart data={trends.serviceRevenue} layout="vertical">
                    <CartesianGrid stroke={GRID_COLOR} horizontal={false} />
                    <XAxis
                      type="number"
                      stroke={TEXT_MUTED}
                      tick={{ fill: TEXT_MUTED, fontSize: 12 }}
                      tickFormatter={(v) => `₹${v}`}
                    />
                    <YAxis
                      type="category"
                      dataKey="service"
                      stroke={TEXT_MUTED}
                      tick={{ fill: TEXT_MUTED, fontSize: 12 }}
                      width={130}
                    />
                    <Tooltip
                      contentStyle={{
                        background: "#0c0c0c",
                        border: `1px solid ${RED_SOFT}`,
                        borderRadius: 12,
                      }}
                      formatter={(value: any) => [`₹${Number(value).toLocaleString()}`, "Revenue"]}
                    />
                    <Bar dataKey="revenue" fill={RED} radius={[0, 6, 6, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>

            </div>
          </>
        )}

      </div>

    </div>

  )

}