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

type DayOption = "today" | "yesterday" | "custom"

type HourlyRevenue = {
  hour: string
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

type DailyReport = {
  date: string
  totalRevenue: number
  invoiceCount: number
  hourlyRevenue: HourlyRevenue[]
  gstSplit: GstSplitEntry[]
  serviceRevenue: ServiceRevenueEntry[]
}

// The business runs on IST, so "today" and "yesterday" are computed
// against the IST calendar date, not the browser's local timezone —
// otherwise a device set to a different timezone could pick the
// wrong day.
const toIstDateString = (offsetDays: number) => {

  const IST_OFFSET_MS = 5.5 * 60 * 60 * 1000
  const now = new Date()
  const istNow = new Date(now.getTime() + IST_OFFSET_MS)

  istNow.setUTCDate(istNow.getUTCDate() + offsetDays)

  const year = istNow.getUTCFullYear()
  const month = String(istNow.getUTCMonth() + 1).padStart(2, "0")
  const day = String(istNow.getUTCDate()).padStart(2, "0")

  return `${year}-${month}-${day}`

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

  const [dayOption,
    setDayOption] =
    useState<DayOption>("today")

  const [customDate,
    setCustomDate] =
    useState(toIstDateString(0))

  const [report,
    setReport] =
    useState<DailyReport | null>(null)

  const [loading,
    setLoading] =
    useState(true)

  const [lastUpdated,
    setLastUpdated] =
    useState<Date | null>(null)

  const [exporting,
    setExporting] =
    useState(false)

  const selectedDate =
    dayOption === "today"
      ? toIstDateString(0)
      : dayOption === "yesterday"
      ? toIstDateString(-1)
      : customDate

  useEffect(() => {

    fetchDailyReport(selectedDate)

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedDate])

  const fetchDailyReport =
    async (date: string) => {

      setLoading(true)

      try {

        const response =
          await fetch(
            `${API_BASE}/daily-report?date=${date}`,
            { cache: "no-store" }
          )

        const result =
          await response.json()

        if (result.success) {
          setReport(result)
          setLastUpdated(new Date())
        }

      } catch (error) {

        console.log(error)

      } finally {

        setLoading(false)

      }

    }

  const handleRefresh = () => {
    fetchDailyReport(selectedDate)
  }

  // Pulls a fresh copy of the selected day's report before exporting,
  // so the CSV always matches exactly what's on screen.
  const handleExportCsv =
    async () => {

      setExporting(true)

      try {

        const response =
          await fetch(
            `${API_BASE}/daily-report?date=${selectedDate}`,
            { cache: "no-store" }
          )

        const freshReport: DailyReport =
          await response.json()

        const rows: (string | number)[][] = []

        rows.push([`TyreTrack Daily Report — ${freshReport.date}`])
        rows.push(["Generated At", new Date().toLocaleString()])
        rows.push([])

        rows.push(["Summary"])
        rows.push(["Metric", "Value"])
        rows.push(["Total Revenue", freshReport.totalRevenue])
        rows.push(["Invoice Count", freshReport.invoiceCount])
        rows.push([])

        rows.push(["Hourly Revenue (IST)"])
        rows.push(["Hour", "Revenue", "Invoice Count"])
        freshReport.hourlyRevenue.forEach((h) => {
          rows.push([h.hour, h.revenue, h.invoiceCount])
        })
        rows.push([])

        rows.push(["GST vs Non-GST Revenue"])
        rows.push(["Category", "Revenue", "Invoice Count"])
        freshReport.gstSplit.forEach((g) => {
          rows.push([g.name, g.revenue, g.count])
        })
        rows.push([])

        rows.push(["Top Services by Revenue"])
        rows.push(["Service", "Revenue"])
        freshReport.serviceRevenue.forEach((s) => {
          rows.push([s.service, s.revenue])
        })

        downloadCsv(
          `tyretrack-daily-report-${freshReport.date}.csv`,
          rows
        )

      } catch (error) {

        console.log(error)

      } finally {

        setExporting(false)

      }

    }

  return (

    <div className="admin-page">

      <div className="admin-container">

        <div className="reports-header-row">

          <h1>
            Daily Reports
          </h1>

          <div className="reports-export-group">

            <button
              className="export-btn secondary"
              onClick={handleRefresh}
            >
              Refresh
            </button>

            <button
              className="export-btn"
              onClick={handleExportCsv}
              disabled={exporting || !report}
            >
              {exporting ? "Exporting..." : "Export CSV"}
            </button>

          </div>

        </div>

        <div className="day-selector">

          <button
            className={
              dayOption === "today"
                ? "day-option day-option-active"
                : "day-option"
            }
            onClick={() => setDayOption("today")}
          >
            Today
          </button>

          <button
            className={
              dayOption === "yesterday"
                ? "day-option day-option-active"
                : "day-option"
            }
            onClick={() => setDayOption("yesterday")}
          >
            Yesterday
          </button>

          <button
            className={
              dayOption === "custom"
                ? "day-option day-option-active"
                : "day-option"
            }
            onClick={() => setDayOption("custom")}
          >
            Specific Date
          </button>

          {dayOption === "custom" && (
            <input
              type="date"
              className="day-date-input"
              value={customDate}
              max={toIstDateString(0)}
              onChange={(e) => setCustomDate(e.target.value)}
            />
          )}

        </div>

        {lastUpdated && (
          <p className="reports-updated-note">
            Showing {selectedDate} (IST) · last refreshed{" "}
            {lastUpdated.toLocaleTimeString()}
          </p>
        )}

        {loading || !report ? (
          <p>Loading...</p>
        ) : (
          <>

            <div className="admin-stats">

              <div className="stat-card">
                <h3>Invoices That Day</h3>
                <p>{report.invoiceCount}</p>
              </div>

              <div className="stat-card">
                <h3>Total Revenue</h3>
                <p>₹ {report.totalRevenue}</p>
              </div>

            </div>

            <h2>Revenue by Hour (IST)</h2>

            <div className="admin-card analytics-chart-card">
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={report.hourlyRevenue}>
                  <CartesianGrid stroke={GRID_COLOR} vertical={false} />
                  <XAxis
                    dataKey="hour"
                    stroke={TEXT_MUTED}
                    tick={{ fill: TEXT_MUTED, fontSize: 11 }}
                    interval={2}
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
                    dot={{ fill: RED, r: 3 }}
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
                      data={report.gstSplit}
                      dataKey="revenue"
                      nameKey="name"
                      cx="50%"
                      cy="50%"
                      outerRadius={90}
                      label={(entry: any) => `₹${entry.revenue.toLocaleString()}`}
                    >
                      {report.gstSplit.map((_entry: any, index: number) => (
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
                <h2>Top Services That Day</h2>
                {report.serviceRevenue.length === 0 ? (
                  <p className="reports-updated-note">No services billed on this date.</p>
                ) : (
                  <ResponsiveContainer width="100%" height={280}>
                    <BarChart data={report.serviceRevenue} layout="vertical">
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
                )}
              </div>

            </div>

          </>
        )}

      </div>

    </div>

  )

}