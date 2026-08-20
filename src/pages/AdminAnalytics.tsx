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

import "./AdminAnalytics.css"

const RED = "#e10600"
const RED_SOFT = "rgba(225, 6, 0, 0.35)"
const GRID_COLOR = "rgba(255, 255, 255, 0.08)"
const TEXT_MUTED = "rgba(245, 245, 247, 0.55)"
const PIE_COLORS = [RED, "#f5f5f7"]

const API_BASE = "https://tyretrack-server.onrender.com/api/admin"

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

export default function AdminAnalytics() {

  const [data,
    setData] =
    useState<any>(null)

  const [trends, setTrends] =
    useState<any>(null)

  const [lastUpdated,
    setLastUpdated] =
    useState<Date | null>(null)

  const [exporting,
    setExporting] =
    useState(false)

  useEffect(() => {

    fetchAnalytics()
    fetchRevenueTrends()

  }, [])

  const fetchAnalytics =
    async () => {

      try {

        const response =
          await fetch(
            `${API_BASE}/analytics`,
            { cache: "no-store" }
          )

        const analytics =
          await response.json()

        setData(
          analytics
        )

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
            `${API_BASE}/revenue-trends`,
            { cache: "no-store" }
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

  const handleRefresh = () => {
    fetchAnalytics()
    fetchRevenueTrends()
  }

  // Pulls fresh data before exporting, so the CSV always reflects
  // whatever invoices exist in the database at that exact moment.
  const handleExportCsv =
    async () => {

      setExporting(true)

      try {

        const [analyticsRes, trendsRes] = await Promise.all([
          fetch(`${API_BASE}/analytics`, { cache: "no-store" }),
          fetch(`${API_BASE}/revenue-trends`, { cache: "no-store" }),
        ])

        const freshData = await analyticsRes.json()
        const freshTrendsRaw = await trendsRes.json()
        const freshTrends = freshTrendsRaw.success ? freshTrendsRaw : null

        const rows: (string | number)[][] = []

        rows.push(["TyreTrack Analytics — Overall"])
        rows.push(["Generated At", new Date().toLocaleString()])
        rows.push([])

        rows.push(["Summary"])
        rows.push(["Metric", "Value"])
        rows.push(["Total Bookings", freshData.totalBookings])
        rows.push(["Completed Bookings", freshData.completedBookings])
        rows.push(["Pending Bookings", freshData.pendingBookings])
        rows.push(["Total Revenue (Published Invoices)", freshData.revenue])
        rows.push(["Most Popular Service", freshData.popularService])
        rows.push([])

        rows.push(["Service Statistics"])
        rows.push(["Service", "Total Bookings"])
        ;(freshData.serviceStats || []).forEach((item: any) => {
          rows.push([item._id, item.count])
        })
        rows.push([])

        if (freshTrends) {

          rows.push(["Monthly Revenue (Last 12 Months)"])
          rows.push(["Month", "Revenue", "Invoice Count"])
          freshTrends.monthlyRevenue.forEach((m: any) => {
            rows.push([m.month, m.revenue, m.invoiceCount])
          })
          rows.push([])

          rows.push(["GST vs Non-GST Revenue"])
          rows.push(["Category", "Revenue", "Invoice Count"])
          freshTrends.gstSplit.forEach((g: any) => {
            rows.push([g.name, g.revenue, g.count])
          })
          rows.push([])

          rows.push(["Top Services by Revenue"])
          rows.push(["Service", "Revenue"])
          freshTrends.serviceRevenue.forEach((s: any) => {
            rows.push([s.service, s.revenue])
          })

        }

        const timestamp = new Date()
          .toISOString()
          .slice(0, 19)
          .replace(/[:T]/g, "-")

        downloadCsv(
          `tyretrack-analytics-${timestamp}.csv`,
          rows
        )

      } catch (error) {

        console.log(error)

      } finally {

        setExporting(false)

      }

    }

  if (!data)
    return <p>Loading...</p>

  return (

    <div className="admin-page">

      <div className="admin-container">

        <div className="analytics-header-row">

          <h1>
            Analytics Dashboard
          </h1>

          <div className="analytics-export-group">

            <button
              className="export-btn secondary"
              onClick={handleRefresh}
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
          <p className="analytics-updated-note">
            Live from invoices &amp; bookings · last refreshed{" "}
            {lastUpdated.toLocaleTimeString()}
          </p>
        )}

        <div className="admin-stats">

          <div className="stat-card">
            <h3>Total Bookings</h3>
            <p>
              {data.totalBookings}
            </p>
          </div>

          <div className="stat-card">
            <h3>Completed</h3>
            <p>
              {data.completedBookings}
            </p>
          </div>

          <div className="stat-card">
            <h3>Pending</h3>
            <p>
              {data.pendingBookings}
            </p>
          </div>

          <div className="stat-card">
            <h3>Revenue</h3>
            <p>
              ₹ {Number(data.revenue || 0).toLocaleString("en-IN", { maximumFractionDigits: 2 })}
            </p>
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

        <div className="admin-card">

          <h2>
            Most Popular Service
          </h2>

          <h1>
            {data.popularService}
          </h1>

        </div>

        <h2>
          Service Statistics
        </h2>

        <div className="admin-bookings">

          {
            data.serviceStats.map(
              (
                item: any,
                index: number
              ) => (

                <div
                  key={index}
                  className="admin-card"
                >

                  <h3>
                    {item._id}
                  </h3>

                  <p>
                    Total Bookings:
                    {item.count}
                  </p>

                </div>

              )
            )
          }

        </div>

      </div>

    </div>

  )

}