import { Routes, Route } from 'react-router-dom'

import Layout from './components/layout/Layout'

import Home from './pages/Home'
import Services from './pages/Services'
import Booking from './pages/Booking'
import Contact from './pages/Contact'
import Gallery from './pages/Gallery'
import Tracking from './pages/Tracking'
import About from './pages/About'
import Login from './pages/Login'
import History from './pages/History'
import CurrentBooking from "./pages/CurrentBooking"
import Admin from "./pages/Admin"
import AdminLogin from "./pages/AdminLogin"

function App() {
  return (
    <Routes>
      <Route path="/" element={<Layout />}>
        <Route index element={<Home />} />

        <Route path="services" element={<Services />} />

        <Route path="booking" element={<Booking />} />

        <Route path="contact" element={<Contact />} />

        <Route path="gallery" element={<Gallery />} />

        <Route path="track" element={<Tracking />} />

        <Route
  path="/admin"
  element={<Admin />}
/>

        <Route path="about" element={<About />} />

        <Route path="login" element={<Login />} />

        <Route path="/current-booking" element={<CurrentBooking />} />

        <Route path="history" element={<History />} />
      </Route>
    </Routes>
  )
}

export default App