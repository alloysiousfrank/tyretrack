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

export default function AdminAnalytics() {

  const [data,
    setData] =
    useState<any>(null)

  const [trends, setTrends] =
    useState<any>(null)

  useEffect(() => {

    fetchAnalytics()
    fetchRevenueTrends()

  }, [])

  const fetchAnalytics =
    async () => {

      try {

        const response =
          await fetch(
            "https://tyretrack-server.onrender.com/api/admin/analytics"
          )

        const analytics =
          await response.json()

        setData(
          analytics
        )

      } catch (error) {

        console.log(error)

      }

    }

  const fetchRevenueTrends =
    async () => {

      try {

        const response =
          await fetch(
            "https://tyretrack-server.onrender.com/api/admin/revenue-trends"
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

  if (!data)
    return <p>Loading...</p>

  return (

    <div className="admin-page">

      <div className="admin-container">

        <h1>
          Analytics Dashboard
        </h1>

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
              ₹ {data.revenue}
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