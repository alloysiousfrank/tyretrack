import { Link } from 'react-router-dom'
import { GARAGE } from '../../data/services'
import './Footer.css'

export default function Footer() {
  return (
    <footer className="footer glass">
      <div className="footer__inner">
        <div className="footer__brand">
          <Link to="/" className="footer__logo">
            TyreTrack
          </Link>
          <p className="footer__tagline">{GARAGE.tagline}</p>
        </div>

        <div className="footer__cols">
          <div>
            <h4>Navigate</h4>
            <Link to="/services">Services</Link>
            <Link to="/booking">Book Now</Link>
            <Link to="/track">Live Tracking</Link>
            <Link to="/gallery">Gallery</Link>
          </div>
          <div>
            <h4>Contact</h4>
            <a href={`tel:${GARAGE.phone.replace(/\s/g, '')}`}>{GARAGE.phone}</a>
            <a href={`mailto:${GARAGE.email}`}>{GARAGE.email}</a>
            <p>{GARAGE.address}</p>
          </div>
          <div>
            <h4>Hours</h4>
            <p>{GARAGE.hours}</p>
          </div>
        </div>

        <div className="footer__bottom">
          <p>© {new Date().getFullYear()} TyreTrack. Demo site — replace with your real data.</p>
        </div>
      </div>
    </footer>
  )
}
