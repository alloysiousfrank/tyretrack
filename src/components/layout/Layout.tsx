import { Outlet, useLocation } from 'react-router-dom'
import { motion } from 'framer-motion'

import Navbar from './Navbar'
import Footer from './Footer'
import ScrollToTop from './ScrollToTop'

import './Layout.css'

export default function Layout() {
  const location = useLocation()
  const isHome = location.pathname === '/'

  return (
    <>
      <ScrollToTop />
      <Navbar />

      <motion.main
        key={location.pathname}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.4 }}
        className={isHome ? 'layout layout--home' : 'layout page'}
      >
        <Outlet />
      </motion.main>

      {!isHome && <Footer />}
    </>
  )
}