import { Routes, Route } from "react-router-dom"

import Layout from "./components/layout/Layout"

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

import Admin from "./pages/Admin"
import AdminLogin from "./pages/AdminLogin"
import AdminDashboard from "./pages/AdminDashboard"
import AdminCustomers from "./pages/AdminCustomers"
import AdminAnalytics from "./pages/AdminAnalytics"
import AdminReports from "./pages/AdminReports"

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

      </Route>

      {/* ADMIN WEBSITE */}

      <Route
        path="/admin-login"
        element={<AdminLogin />}
      />

      <Route
        path="/admin"
        element={
          localStorage.getItem("adminToken")
            ? <Admin />
            : <AdminLogin />
        }
      />

      <Route
        path="/admin-dashboard"
        element={
          localStorage.getItem("adminToken")
            ? <AdminDashboard />
            : <AdminLogin />
        }
      />

      <Route
        path="/admin-customers"
        element={
          localStorage.getItem("adminToken")
            ? <AdminCustomers />
            : <AdminLogin />
        }
      />

      <Route
        path="/admin-analytics"
        element={
          localStorage.getItem("adminToken")
            ? <AdminAnalytics />
            : <AdminLogin />
        }
      />

      <Route
        path="/admin-reports"
        element={
          localStorage.getItem("adminToken")
            ? <AdminReports />
            : <AdminLogin />
        }
      />

    </Routes>

  )
}

export default App