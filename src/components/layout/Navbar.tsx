import { useState, useEffect } from 'react'
import { Link, NavLink, useLocation } from 'react-router-dom'
import { motion, useScroll } from 'framer-motion'
import { useAuth } from '../../context/AuthContext'
import wheelImage from '../../assets/logo3.png'
import './Navbar.css'

const primaryLinks = [
  { to: '/', label: 'Home', end: true },
  { to: '/services', label: 'Services' },
  { to: '/booking', label: 'Booking' },
  
  { to: '/contact', label: 'Contact' },
]

const extraLinks = [
  { to: '/gallery', label: 'Gallery' },
    { to: '/tracking', label: 'Track' },

  { to: '/about', label: 'About' },
]

export default function Navbar() {

  // MOBILE MENU
  const [open, setOpen] = useState(false)

  // PROFILE DROPDOWN
  const [profileOpen, setProfileOpen] =
    useState(false)

  const [scrolled, setScrolled] =
    useState(false)

  const { isLoggedIn, logout } =
    useAuth()

  const userName =
    localStorage.getItem("userName")

  const location = useLocation()

  const isHome =
    location.pathname === '/'

  const { scrollYProgress } =
    useScroll()

  useEffect(() => {

    const unsubscribe =
      scrollYProgress.on(
        "change",
        (latest) => {

          setScrolled(latest > 0.04)

        }
      )

    return unsubscribe

  }, [scrollYProgress])

  const visible =
    !isHome || scrolled

  return (
    <>

      <motion.div
        className="navbar-progress"
        style={{ scaleX: scrollYProgress }}
      />

      <motion.nav
        className="navbar"
        initial={{ y: -100, opacity: 0 }}
        animate={{
          y: visible ? 0 : -100,
          opacity: visible ? 1 : 0,
        }}
        transition={{
          duration: 0.6,
          ease: 'easeOut',
        }}
      >

        {/* LOGO */}

        <Link
          to="/"
          className="navbar__brand"
          onClick={() => setOpen(false)}
        >

          <motion.div
            className="navbar__logo"
            whileHover={{ scale: 1.05 }}
            transition={{ duration: 0.3 }}
          >

            <img
              src={wheelImage}
              alt="TyreTrack Premium Auto Care"
              style={{
                height: '80px',
                width: 'auto',
                objectFit: 'contain'
              }}
            />

          </motion.div>

        </Link>

        <div className="navbar__right">

          {/* NAVBAR LINKS */}

          <div
            className={`navbar__links ${
              open ? 'navbar__links--open' : ''
            }`}
          >

            {primaryLinks.map((link) => (

              <NavLink
                key={link.to}
                to={link.to}
                end={link.end}
                className={({ isActive }) =>
                  `navbar__link ${
                    isActive
                      ? 'navbar__link--active'
                      : ''
                  }`
                }
                onClick={() => setOpen(false)}
              >

                {link.label}

              </NavLink>

            ))}

            {extraLinks.map((link) => (

              <NavLink
                key={link.to}
                to={link.to}
                className="navbar__link navbar__link--extra"
                onClick={() => setOpen(false)}
              >

                {link.label}

              </NavLink>

            ))}

            {/* LOGIN / PROFILE */}

            {isLoggedIn ? (

              <div className="navbar__profile">

                <button
                  className="navbar__profile-btn"
                  onClick={() =>
                    setProfileOpen(
                      (prev) => !prev
                    )
                  }
                >

                  Hi, {userName}

                  <span className="navbar__arrow">
                    ▾
                  </span>

                </button>

                {profileOpen && (

                  <div className="navbar__dropdown">

                    <NavLink
                      to="/current-booking"
                      className="navbar__dropdown-item"
                      onClick={() => {

                        setProfileOpen(false)
                        setOpen(false)

                      }}
                    >

                      Current Booking

                    </NavLink>

                    <NavLink
                      to="/track"
                      className="navbar__dropdown-item"
                      onClick={() => {

                        setProfileOpen(false)
                        setOpen(false)

                      }}
                    >

                      Live Tracking

                    </NavLink>

                    <NavLink
                      to="/history"
                      className="navbar__dropdown-item"
                      onClick={() => {

                        setProfileOpen(false)
                        setOpen(false)

                      }}
                    >

                      Service History

                    </NavLink>

                    <button
                      type="button"
                      className="navbar__dropdown-item logout-btn"
                      onClick={() => {

                        // CLEAR SESSION

                        localStorage.removeItem("token")

                        localStorage.removeItem("userName")

                        localStorage.removeItem("userEmail")

                        localStorage.removeItem("userPhone")

                        localStorage.removeItem("latestBookingId")

                        localStorage.removeItem("isLoggedIn")

                        logout()

                        window.location.href =
                          "/login"

                      }}
                    >

                      Logout

                    </button>

                  </div>

                )}

              </div>

            ) : (

              <NavLink
                to="/login"
                className="navbar__link navbar__link--extra"
                onClick={() => setOpen(false)}
              >

                Login

              </NavLink>

            )}

          </div>

          {/* BOOK NOW */}

          <motion.div
            whileHover={{ scale: 1.06 }}
            whileTap={{ scale: 0.96 }}
          >

            <Link
              to="/booking"
              className="navbar__book"
              onClick={() => setOpen(false)}
            >

              Book Now

            </Link>

          </motion.div>

          {/* MOBILE TOGGLE */}

          <button
            type="button"
            className="navbar__toggle"
            aria-label="Menu"
            onClick={() =>
              setOpen((o) => !o)
            }
          >

            <span />
            <span />

          </button>

        </div>

      </motion.nav>

    </>
  )
}