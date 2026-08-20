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
} from "recharts"

import "./AdminReports.css"

const RED = "#e10600"
const RED_SOFT = "rgba(225, 6, 0, 0.35)"
const GRID_COLOR = "rgba(255, 255, 255, 0.08)"
const TEXT_MUTED = "rgba(245, 245, 247, 0.55)"
const PIE_COLORS = [RED, "#f5f5f7"]

const API_BASE = "https://tyretrack-server.onrender.com/api/admin"

type DayOption = "today" | "yesterday" | "custom" | "month" | "range"

type HourlyRevenue = {
  hour: string
  revenue: number
  invoiceCount: number
}

type DailyRevenue = {
  date: string
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

type RangeReport = {
  start: string
  end: string
  totalRevenue: number
  invoiceCount: number
  dailyRevenue: DailyRevenue[]
  gstSplit: GstSplitEntry[]
  serviceRevenue: ServiceRevenueEntry[]
}

// Both report shapes above get flattened into this common shape for
// rendering, so the chart/stat JSX below doesn't need to know or care
// whether it's looking at an hour-by-hour single day or a day-by-day
// month/range — it just reads `series` and `seriesLabel`.
type NormalizedReport = {
  totalRevenue: number
  invoiceCount: number
  series: { key: string; revenue: number; invoiceCount: number }[]
  seriesLabel: string
  gstSplit: GstSplitEntry[]
  serviceRevenue: ServiceRevenueEntry[]
}

const normalizeDailyReport = (report: DailyReport): NormalizedReport => ({
  totalRevenue: report.totalRevenue,
  invoiceCount: report.invoiceCount,
  series: report.hourlyRevenue.map((h) => ({
    key: h.hour,
    revenue: h.revenue,
    invoiceCount: h.invoiceCount,
  })),
  seriesLabel: "Hour (IST)",
  gstSplit: report.gstSplit,
  serviceRevenue: report.serviceRevenue,
})

const normalizeRangeReport = (report: RangeReport): NormalizedReport => ({
  totalRevenue: report.totalRevenue,
  invoiceCount: report.invoiceCount,
  series: report.dailyRevenue.map((d) => ({
    key: d.date.slice(5), // MM-DD — the year is already in the page heading
    revenue: d.revenue,
    invoiceCount: d.invoiceCount,
  })),
  seriesLabel: "Date",
  gstSplit: report.gstSplit,
  serviceRevenue: report.serviceRevenue,
})

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

// Current IST month as "YYYY-MM", for the month picker's default value.
const toIstMonthString = () => toIstDateString(0).slice(0, 7)

// Turns a "YYYY-MM" month string into its first and last calendar day
// ("YYYY-MM-DD"), capping the last day at today (IST) if the selected
// month is the current one — no point charting a week of the future
// that can't have any invoices yet.
const monthToRange = (monthString: string) => {

  const [year, month] = monthString.split("-").map(Number)

  const start = `${monthString}-01`

  const lastDayOfMonth = new Date(Date.UTC(year, month, 0)).getUTCDate()
  const naturalEnd = `${monthString}-${String(lastDayOfMonth).padStart(2, "0")}`

  const todayIst = toIstDateString(0)
  const end = naturalEnd > todayIst ? todayIst : naturalEnd

  return { start, end }

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

  const [customMonth,
    setCustomMonth] =
    useState(toIstMonthString())

  const [rangeStart,
    setRangeStart] =
    useState(toIstDateString(-6))

  const [rangeEnd,
    setRangeEnd] =
    useState(toIstDateString(0))

  const [report,
    setReport] =
    useState<NormalizedReport | null>(null)

  const [loading,
    setLoading] =
    useState(true)

  const [rangeError,
    setRangeError] =
    useState("")

  const [lastUpdated,
    setLastUpdated] =
    useState<Date | null>(null)

  const [exporting,
    setExporting] =
    useState(false)

  const isSingleDay =
    dayOption === "today" ||
    dayOption === "yesterday" ||
    dayOption === "custom"

  // The exact start/end dates (YYYY-MM-DD, IST) covered by whatever is
  // currently selected — a single day still has start === end, so the
  // range-report endpoint could serve it too, but the existing
  // daily-report endpoint (with its hour-by-hour chart) stays in use
  // for those three options exactly as before.
  const { effectiveStart, effectiveEnd, periodLabel } = (() => {

    if (dayOption === "today") {
      const d = toIstDateString(0)
      return { effectiveStart: d, effectiveEnd: d, periodLabel: d }
    }

    if (dayOption === "yesterday") {
      const d = toIstDateString(-1)
      return { effectiveStart: d, effectiveEnd: d, periodLabel: d }
    }

    if (dayOption === "custom") {
      return { effectiveStart: customDate, effectiveEnd: customDate, periodLabel: customDate }
    }

    if (dayOption === "month") {
      const { start, end } = monthToRange(customMonth)
      return { effectiveStart: start, effectiveEnd: end, periodLabel: customMonth }
    }

    // range
    return {
      effectiveStart: rangeStart,
      effectiveEnd: rangeEnd,
      periodLabel: `${rangeStart} to ${rangeEnd}`,
    }

  })()

  useEffect(() => {

    if (dayOption === "range" && rangeEnd < rangeStart) {
      setRangeError("End date can't be before the start date")
      return
    }

    setRangeError("")
    fetchReport()

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [dayOption, customDate, customMonth, rangeStart, rangeEnd])

  const fetchReport =
    async () => {

      setLoading(true)

      try {

        if (isSingleDay) {

          const response =
            await fetch(
              `${API_BASE}/daily-report?date=${effectiveStart}`,
              { cache: "no-store" }
            )

          const result: DailyReport & { success: boolean } =
            await response.json()

          if (result.success) {
            setReport(normalizeDailyReport(result))
            setLastUpdated(new Date())
          }

        } else {

          const response =
            await fetch(
              `${API_BASE}/range-report?start=${effectiveStart}&end=${effectiveEnd}`,
              { cache: "no-store" }
            )

          const result: RangeReport & { success: boolean; message?: string } =
            await response.json()

          if (result.success) {
            setReport(normalizeRangeReport(result))
            setLastUpdated(new Date())
          } else {
            setRangeError(result.message || "Failed to load report")
          }

        }

      } catch (error) {

        console.log(error)

      } finally {

        setLoading(false)

      }

    }

  const handleRefresh = () => {
    fetchReport()
  }

  // Pulls a fresh copy of the selected period's report before exporting,
  // so the CSV always matches exactly what's on screen.
  const handleExportCsv =
    async () => {

      setExporting(true)

      try {

        const endpoint = isSingleDay
          ? `${API_BASE}/daily-report?date=${effectiveStart}`
          : `${API_BASE}/range-report?start=${effectiveStart}&end=${effectiveEnd}`

        const response =
          await fetch(endpoint, { cache: "no-store" })

        const raw = await response.json()

        if (!raw.success) {
          throw new Error(raw.message || "Failed to load report")
        }

        const freshReport: NormalizedReport = isSingleDay
          ? normalizeDailyReport(raw)
          : normalizeRangeReport(raw)

        const rows: (string | number)[][] = []

        rows.push([`TyreTrack Report — ${periodLabel}`])
        rows.push(["Generated At", new Date().toLocaleString()])
        rows.push([])

        rows.push(["Summary"])
        rows.push(["Metric", "Value"])
        rows.push(["Total Revenue", freshReport.totalRevenue])
        rows.push(["Invoice Count", freshReport.invoiceCount])
        rows.push([])

        rows.push([`Revenue by ${freshReport.seriesLabel}`])
        rows.push([freshReport.seriesLabel, "Revenue", "Invoice Count"])
        freshReport.series.forEach((s) => {
          rows.push([s.key, s.revenue, s.invoiceCount])
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
          `tyretrack-report-${periodLabel.replace(/\s+/g, "-")}.csv`,
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
            Reports
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

          <button
            className={
              dayOption === "month"
                ? "day-option day-option-active"
                : "day-option"
            }
            onClick={() => setDayOption("month")}
          >
            Month
          </button>

          <button
            className={
              dayOption === "range"
                ? "day-option day-option-active"
                : "day-option"
            }
            onClick={() => setDayOption("range")}
          >
            Date Range
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

          {dayOption === "month" && (
            <input
              type="month"
              className="day-date-input"
              value={customMonth}
              max={toIstMonthString()}
              onChange={(e) => setCustomMonth(e.target.value)}
            />
          )}

          {dayOption === "range" && (
            <div className="day-range-inputs">
              <input
                type="date"
                className="day-date-input"
                value={rangeStart}
                max={toIstDateString(0)}
                onChange={(e) => setRangeStart(e.target.value)}
              />
              <span className="day-range-sep">to</span>
              <input
                type="date"
                className="day-date-input"
                value={rangeEnd}
                max={toIstDateString(0)}
                onChange={(e) => setRangeEnd(e.target.value)}
              />
            </div>
          )}

        </div>

        {rangeError && (
          <p className="reports-updated-note reports-error-note">
            {rangeError}
          </p>
        )}

        {lastUpdated && !rangeError && (
          <p className="reports-updated-note">
            Showing {periodLabel} (IST) · last refreshed{" "}
            {lastUpdated.toLocaleTimeString()}
          </p>
        )}

        {loading || !report ? (
          <p>Loading...</p>
        ) : (
          <>

            <div className="admin-stats">

              <div className="stat-card">
                <h3>Invoices In Period</h3>
                <p>{report.invoiceCount}</p>
              </div>

              <div className="stat-card">
                <h3>Total Revenue</h3>
                <p>₹ {report.totalRevenue.toLocaleString()}</p>
              </div>

            </div>

            <h2>Revenue by {report.seriesLabel}</h2>

            <div className="admin-card analytics-chart-card">
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={report.series}>
                  <CartesianGrid stroke={GRID_COLOR} vertical={false} />
                  <XAxis
                    dataKey="key"
                    stroke={TEXT_MUTED}
                    tick={{ fill: TEXT_MUTED, fontSize: 11 }}
                    interval={report.series.length > 15 ? Math.ceil(report.series.length / 15) - 1 : 0}
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
                    dot={report.series.length > 20 ? false : { fill: RED, r: 3 }}
                    activeDot={{ r: 6 }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>

            <div className="analytics-chart-row">

              <div className="admin-card analytics-chart-card">
                <h2>GST vs Non-GST Revenue</h2>
                {report.gstSplit.every((g) => g.revenue === 0) ? (
                  <p className="reports-updated-note">No published invoices in this period.</p>
                ) : (
                  <>
                    <ResponsiveContainer width="100%" height={240}>
                      <PieChart>
                        <Pie
                          data={report.gstSplit}
                          dataKey="revenue"
                          nameKey="name"
                          cx="50%"
                          cy="50%"
                          innerRadius={55}
                          outerRadius={85}
                          paddingAngle={2}
                        >
                          {report.gstSplit.map((_entry: any, index: number) => (
                            <Cell key={index} fill={PIE_COLORS[index % PIE_COLORS.length]} />
                          ))}
                        </Pie>
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
                    <div className="pie-legend-list">
                      {report.gstSplit.map((g, index) => (
                        <div className="pie-legend-row" key={g.name}>
                          <span
                            className="pie-legend-swatch"
                            style={{ background: PIE_COLORS[index % PIE_COLORS.length] }}
                          />
                          <span className="pie-legend-name">{g.name}</span>
                          <span className="pie-legend-value">₹{g.revenue.toLocaleString()}</span>
                        </div>
                      ))}
                    </div>
                  </>
                )}
              </div>

              <div className="admin-card analytics-chart-card">
                <h2>Top Services In Period</h2>
                {report.serviceRevenue.length === 0 ? (
                  <p className="reports-updated-note">No services billed in this period.</p>
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