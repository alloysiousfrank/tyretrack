import { Link } from "react-router-dom"
import "./AdminSidebar.css"

export default function AdminSidebar() {

  return (

    <aside className="admin-sidebar">

      <div className="admin-logo">
        <h2>TyreTrack</h2>
        <span>ADMIN PANEL</span>
      </div>

      <nav className="admin-menu">

        <Link to="/admin-dashboard">
          📊 Dashboard
        </Link>

        <Link to="/admin">
          📋 Bookings
        </Link>

        <Link to="/admin-customers">
          👥 Customers
        </Link>

        <Link to="/admin-analytics">
          📈 Analytics
        </Link>

        <Link to="/admin-reports">
          📑 Reports
        </Link>

      </nav>

      <button
        className="logout-btn"
        onClick={() => {

          localStorage.removeItem(
            "adminToken"
          )

          localStorage.removeItem(
            "adminRole"
          )

          window.location.href =
            "/admin-login"

        }}
      >
        🚪 Logout
      </button>

    </aside>

  )

}