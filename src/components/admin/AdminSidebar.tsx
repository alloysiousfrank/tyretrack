import { Link } from "react-router-dom"
import { useState } from "react"
import "./AdminSidebar.css"

export default function AdminSidebar() {

  const [open,setOpen] =
useState(false)



  return (

<>
return (

<>

<button
 className="menu-btn"
 onClick={()=>
 setOpen(!open)
}
>
☰
</button>

<aside
 className={
  open
  ? "admin-sidebar open"
  : "admin-sidebar"
 }
>

  <aside
    className={
      open
        ? "admin-sidebar open"
        : "admin-sidebar"
    }
  >

    <div className="admin-logo">
      <h2>TyreTrack</h2>
      <span>ADMIN PANEL</span>
    </div>

    <nav className="admin-menu">

      <Link
        to="/admin-dashboard"
        onClick={() =>
          setOpen(false)
        }
      >
         Dashboard
      </Link>

      <Link
        to="/admin"
        onClick={() =>
          setOpen(false)
        }
      >
         Bookings
      </Link>

      <Link
        to="/admin-customers"
        onClick={() =>
          setOpen(false)
        }
      >
         Customers
      </Link>

      <Link
        to="/admin-analytics"
        onClick={() =>
          setOpen(false)
        }
      >
         Analytics
      </Link>

      <Link
        to="/admin-reports"
        onClick={() =>
          setOpen(false)
        }
      >
         Reports
      </Link>

      <Link
        to="/admin-invoices"
        onClick={() =>
          setOpen(false)
        }
      >
         Invoices
      </Link>

      <Link
        to="/admin-inventory"
        onClick={() =>
          setOpen(false)
        }
      >
         Inventory
      </Link>

    </nav>

    <button
      className="logout-btn"
      onClick={()=>{

 setOpen(false)

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
       Logout
    </button>

  </aside>
  </aside>

</>
)
</>

)
}