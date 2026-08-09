import { Suspense, lazy } from "react"
import { Routes, Route } from "react-router-dom"

import Layout from "./components/layout/Layout"
import AdminLayout from "./components/admin/AdminLayout"

import Home from "./pages/Home"
import Services from "./pages/Services"
import Booking from "./pages/Booking"
import Contact from "./pages/Contact"
import Gallery from "./pages/Gallery"
import Tracking from "./pages/Tracking"
import About from "./pages/About"
import Login from "./pages/Login"
import History from "./pages/History"
import CurrentBooking from "./pages/CurrentBooking"
import CustomerInvoices from "./pages/CustomerInvoices"
import GetQuote from "./pages/GetQuote"

// Admin-only pages are lazy-loaded — customers browsing the public
// site should never have to download admin code (charts, invoice
// editor, etc.) just to view the home page.
const Admin = lazy(() => import("./pages/Admin"))
const AdminLogin = lazy(() => import("./pages/AdminLogin"))
const AdminDashboard = lazy(() => import("./pages/AdminDashboard"))
const AdminCustomers = lazy(() => import("./pages/AdminCustomers"))
const AdminAnalytics = lazy(() => import("./pages/AdminAnalytics"))
const AdminReports = lazy(() => import("./pages/AdminReports"))
const AdminInvoices = lazy(() => import("./pages/AdminInvoices"))
const AdminInventory = lazy(() => import("./pages/AdminInventory"))
const AdminQuotes = lazy(() => import("./pages/AdminQuotes"))

function AdminLoadingFallback() {
  return (
    <div style={{
      minHeight: "100vh",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      color: "#f5f5f7",
      background: "#050505",
    }}>
      Loading…
    </div>
  )
}

function App() {

  return (

    <Routes>

      {/* CUSTOMER WEBSITE */}

      <Route path="/" element={<Layout />}>

        <Route
          index
          element={<Home />}
        />

        <Route
          path="services"
          element={<Services />}
        />

        <Route
          path="booking"
          element={<Booking />}
        />
        <Route
  path="getquote"
  element={<GetQuote />}
/>
        <Route
          path="contact"
          element={<Contact />}
        />

        <Route
          path="gallery"
          element={<Gallery />}
        />

        <Route
          path="track"
          element={<Tracking />}
        />

        <Route
          path="about"
          element={<About />}
        />

        <Route
          path="login"
          element={<Login />}
        />

        <Route
          path="history"
          element={<History />}
        />

        <Route
          path="current-booking"
          element={<CurrentBooking />}
        />

        <Route
          path="my-invoices"
          element={<CustomerInvoices />}
        />

      </Route>

      {/* ADMIN LOGIN */}

      <Route
        path="/admin-login"
        element={
          <Suspense fallback={<AdminLoadingFallback />}>
            <AdminLogin />
          </Suspense>
        }
      />

      {/* PROTECTED ADMIN ROUTES */}

      <Route
        element={
          <Suspense fallback={<AdminLoadingFallback />}>
            {localStorage.getItem("adminToken")
              ? <AdminLayout />
              : <AdminLogin />}
          </Suspense>
        }
      >

        <Route
          path="/admin"
          element={<Admin />}
        />

        <Route
          path="/admin-dashboard"
          element={<AdminDashboard />}
        />

        <Route
          path="/admin-customers"
          element={<AdminCustomers />}
        />

        <Route
          path="/admin-analytics"
          element={<AdminAnalytics />}
        />

        <Route
          path="/admin-reports"
          element={<AdminReports />}
        />

        <Route

  path="/admin-quotes"

  element={<AdminQuotes />}

/>

        <Route
          path="/admin-invoices"
          element={<AdminInvoices />}
        />

        <Route
          path="/admin-inventory"
          element={<AdminInventory />}
        />

      </Route>

    </Routes>

  )

}

export default App