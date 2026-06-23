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

import Admin from "./pages/Admin"
import AdminLogin from "./pages/AdminLogin"
import AdminDashboard from "./pages/AdminDashboard"
import AdminCustomers from "./pages/AdminCustomers"
import AdminAnalytics from "./pages/AdminAnalytics"
import AdminReports from "./pages/AdminReports"
import AdminInvoices from "./pages/AdminInvoices"
import AdminInventory from "./pages/AdminInventory"

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
        element={<AdminLogin />}
      />

      {/* PROTECTED ADMIN ROUTES */}

      <Route
        element={
          localStorage.getItem("adminToken")
            ? <AdminLayout />
            : <AdminLogin />
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