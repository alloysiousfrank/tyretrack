import { useState, useEffect, useRef } from 'react'
import { Link, NavLink, useLocation } from 'react-router-dom'
import { motion, useScroll } from 'framer-motion'
import { useAuth } from '../../context/AuthContext'
import wheelImage from '../../assets/logo4.png'
import './Navbar.css'

const primaryLinks = [
  { to: '/', label: 'Home', end: true },
  { to: '/services', label: 'Services' },
  { to: '/booking', label: 'Booking' },
  { to: '/contact', label: 'Contact' },
  { to: '/about', label: 'About' },
]

const extraLinks = [
  { to: '/gallery', label: 'Gallery' },
  
]

export default function Navbar() {

  // MOBILE MENU
  const [open, setOpen] = useState(false)

  // PROFILE DROPDOWN
  const [profileOpen, setProfileOpen] =
    useState(false)

  const [scrolled, setScrolled] =
    useState(false)

  const { isLoggedIn, userName, logout } =
    useAuth()

  const location = useLocation()

  const isHome =
    location.pathname === '/'

  const { scrollYProgress } =
    useScroll()

  const profileRef = useRef<HTMLDivElement | null>(null)

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

useEffect(() => {
  function handleClickOutside(event: Event) {
    const target = event.target
    if (
      profileRef.current &&
      target instanceof Node &&
      !profileRef.current.contains(target)
    ) {
      setProfileOpen(false)
    }
  }

  document.addEventListener('mousedown', handleClickOutside)
  document.addEventListener('touchstart', handleClickOutside)

  return () => {
    document.removeEventListener('mousedown', handleClickOutside)
    document.removeEventListener('touchstart', handleClickOutside)
  }
}, [profileOpen])

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

              <div className="navbar__profile" ref={profileRef}>

                <button
                  className="navbar__profile-btn"
                  aria-expanded={profileOpen}
                  aria-haspopup="true"
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

                      <span className="navbar__dropdown-icon" aria-hidden="true">
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                          <rect x="3" y="4" width="18" height="18" rx="2" />
                          <path d="M16 2v4M8 2v4M3 10h18" />
                        </svg>
                      </span>

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

                      <span className="navbar__dropdown-icon" aria-hidden="true">
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                          <path d="M12 2C8 2 5 5 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-4-3-7-7-7z" />
                          <circle cx="12" cy="9" r="2.5" />
                        </svg>
                      </span>

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

                      <span className="navbar__dropdown-icon" aria-hidden="true">
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                          <path d="M3 12a9 9 0 1 0 3-6.7" />
                          <path d="M3 4v5h5" />
                          <path d="M12 7v5l4 2" />
                        </svg>
                      </span>

                      Service History

                    </NavLink>

                    <button
                      type="button"
                      className="navbar__dropdown-item navbar__logout-btn"
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

                      <span className="navbar__dropdown-icon" aria-hidden="true">
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                          <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
                          <path d="M16 17l5-5-5-5" />
                          <path d="M21 12H9" />
                        </svg>
                      </span>

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