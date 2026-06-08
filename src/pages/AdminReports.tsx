import {
  useEffect,
  useState,
} from "react"

export default function AdminReports() {

  const [report,
    setReport] =
    useState<any>(null)

  useEffect(() => {

    fetchReports()

  }, [])

  const fetchReports =
    async () => {

      const response =
        await fetch(
          "https://tyretrack-server.onrender.com/api/admin/reports"
        )

      const data =
        await response.json()

      setReport(data)

    }

  if (!report)
    return <p>Loading...</p>

  return (

    <div className="admin-page">

      <div className="admin-container">

        <h1>
          Business Reports
        </h1>

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

      </div>

    </div>

  )

}