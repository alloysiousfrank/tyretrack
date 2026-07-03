import { Outlet } from "react-router-dom"
import { useState} from "react"
import AdminSidebar from "./AdminSidebar"
import "./AdminLayout.css"

export default function AdminLayout() {

  const [open, setOpen] = useState(false)

  return (

    <div className="admin-layout">

      <button

        className="menu-btn"

onClick={(e)=>{

e.stopPropagation()

setOpen(true)

}}
      >

        ☰

      </button>

      <AdminSidebar

        open={open}

        setOpen={setOpen}

      />

<main
className="admin-content"
onClick={()=>{
if(open){
setOpen(false)
}
}}
>
        <Outlet />

      </main>

    </div>

  )

}