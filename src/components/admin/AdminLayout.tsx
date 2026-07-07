import { Outlet, useLocation } from "react-router-dom"
import { useState, useEffect, useRef } from "react"
import AdminSidebar from "./AdminSidebar"
import "./AdminLayout.css"

export default function AdminLayout() {

  const [open, setOpen] = useState(false)
  const location = useLocation()
  const contentRef = useRef<HTMLDivElement | null>(null)

  useEffect(() => {
    contentRef.current?.scrollTo(0, 0)
  }, [location.pathname])

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

<div
className="admin-content"
ref={contentRef}
onWheel={(e)=>{

if(open){

e.stopPropagation()

}

}}
>
        <Outlet />

      </div>

    </div>

  )

}