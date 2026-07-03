import { Link, NavLink } from "react-router-dom"
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
onWheel={(e)=>{

e.stopPropagation()

}}
>

<div className="admin-logo">

<h2>TyreTrack</h2>

<span>
ADMIN PANEL
</span>

</div>

<nav
className="admin-menu"
onWheel={(e)=>{

e.stopPropagation()

}}
>
<NavLink
to="/admin-dashboard"
className={({isActive})=>isActive ? "active" : ""}
onClick={()=>setOpen(false)}
>
Dashboard
</NavLink>

<NavLink
to="/admin"
className={({isActive})=>isActive ? "active" : ""}
onClick={()=>setOpen(false)}
>
 Bookings
</NavLink>

<NavLink
to="/admin-customers"
className={({isActive})=>isActive ? "active" : ""}
onClick={()=>setOpen(false)}
>
 Customers
</NavLink>

<NavLink
to="/admin-analytics"
className={({isActive})=>isActive ? "active" : ""}
onClick={()=>setOpen(false)}
>
Analytics
</NavLink>

<NavLink
to="/admin-reports"
className={({isActive})=>isActive ? "active" : ""}
onClick={()=>setOpen(false)}
>
 Reports
</NavLink>

<NavLink
to="/admin-quotes"
className={({isActive})=>isActive ? "active" : ""}
onClick={()=>setOpen(false)}
>
 Quotations
</NavLink>

<NavLink
to="/admin-invoices"
className={({isActive})=>isActive ? "active" : ""}
onClick={()=>setOpen(false)}
>
 Invoices
</NavLink>

<NavLink
to="/admin-inventory"
className={({isActive})=>isActive ? "active" : ""}
onClick={()=>setOpen(false)}
>
 Inventory
</NavLink>

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