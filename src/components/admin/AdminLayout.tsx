import { Outlet } from "react-router-dom"
import { useState } from "react"

import AdminSidebar from "./AdminSidebar"

export default function AdminLayout(){

 const [open,setOpen] =
 useState(false)

 return(

<div className="admin-layout">

<button
 className="menu-btn"
 onClick={()=>
 setOpen(!open)
 }
>
☰
</button>

<AdminSidebar
 open={open}
 setOpen={setOpen}
/>

<div className="admin-content">

<Outlet/>

</div>

</div>

 )

}