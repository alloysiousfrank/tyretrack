import { useEffect, useState } from "react"

export default function AdminAnalytics() {

  const [analytics, setAnalytics] =
    useState<any[]>([])

  useEffect(() => {

    fetchAnalytics()

  }, [])

  const fetchAnalytics = async () => {

    const response = await fetch(
      "https://tyretrack-server.onrender.com/api/admin/analytics"
    )

    const data = await response.json()

    setAnalytics(data.serviceStats)

  }

  return (

    <div className="admin-page">

      <h1>Service Analytics</h1>

      {analytics.map((item, index) => (

        <div
          key={index}
          className="admin-card"
        >

          <h3>{item._id}</h3>

          <p>
            Total Bookings :
            {item.count}
          </p>

        </div>

      ))}

    </div>

  )

}