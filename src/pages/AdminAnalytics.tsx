import {
  useEffect,
  useState,
} from "react"

import "./AdminAnalytics.css"

export default function AdminAnalytics() {

  const [data,
    setData] =
    useState<any>(null)

  useEffect(() => {

    fetchAnalytics()

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