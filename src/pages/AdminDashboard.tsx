import { useEffect, useState } from "react"

export default function AdminDashboard() {

  const [stats, setStats] = useState<any>({})

  useEffect(() => {

    fetchStats()

  }, [])

  const fetchStats = async () => {

    try {

      const response = await fetch(
        "https://tyretrack-server.onrender.com/api/admin/stats"
      )

      const data = await response.json()

      setStats(data)

    } catch (error) {

      console.log(error)

    }

  }

  return (

    <div className="admin-page">

      <h1>Dashboard</h1>

      <div className="admin-stats">

        <div className="stat-card">
          <h3>Total Users</h3>
          <p>{stats.totalUsers || 0}</p>
        </div>

        <div className="stat-card">
          <h3>Total Bookings</h3>
          <p>{stats.totalBookings || 0}</p>
        </div>

        <div className="stat-card">
          <h3>Completed</h3>
          <p>{stats.completedBookings || 0}</p>
        </div>

        <div className="stat-card">
          <h3>Revenue</h3>
          <p>₹{stats.revenue || 0}</p>
        </div>

      </div>

    </div>

  )

}