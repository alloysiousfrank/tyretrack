import { Link } from "react-router-dom"
import "./AdminSidebar.css"

interface Props{
  open:boolean
  setOpen:(value:boolean)=>void
}

export default function AdminSidebar({
  open,
  setOpen
}:Props){

  return(

<>
<div
className={
open
? "sidebar-overlay active"
: "sidebar-overlay"
}
onClick={()=>
setOpen(false)
}
/>

<aside
className={
open
? "admin-sidebar open"
: "admin-sidebar"
}
>

<div className="admin-logo">

<h2>TyreTrack</h2>

<span>
ADMIN PANEL
</span>

</div>

<nav className="admin-menu">

<Link
to="/admin-dashboard"
onClick={()=>
setOpen(false)
}
>
 Dashboard
</Link>

<Link
to="/admin"
onClick={()=>
setOpen(false)
}
>
 Bookings
</Link>

<Link
to="/admin-customers"
onClick={()=>
setOpen(false)
}
>
 Customers
</Link>

<Link
to="/admin-analytics"
onClick={()=>
setOpen(false)
}
>
Analytics
</Link>

<Link
to="/admin-reports"
onClick={()=>
setOpen(false)
}
>
 Reports
</Link>

<Link
to="/admin-quotes"
onClick={()=>
setOpen(false)
}
>
 Quotations
</Link>

<Link
to="/admin-invoices"
onClick={()=>
setOpen(false)
}
>
 Invoices
</Link>

<Link
to="/admin-inventory"
onClick={()=>
setOpen(false)
}
>
 Inventory
</Link>

</nav>

<button
className="logout-btn"
onClick={()=>{

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
</>

)

}