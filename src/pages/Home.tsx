import { Link } from 'react-router-dom'
import CinematicHero from '../components/hero/CinematicHero'
import RevealSection from '../components/ui/RevealSection'
import SectionHeading from '../components/ui/SectionHeading'
import GlassCard from '../components/ui/GlassCard'
import Footer from '../components/layout/Footer'
import { services, GARAGE } from '../data/services'
import { galleryItems } from '../data/gallery'
import './Home.css'

export default function Home() {
  return (
    <section className="home">
      <CinematicHero />

      <section className="home__story page-inner">
        <RevealSection className="section-gap">
          <SectionHeading
            eyebrow="Chapter I"
            title="Crafted for the Driven"
            subtitle="Every vehicle that enters TyreTrack receives white-glove treatment — from precision alignment to showroom-ready finishes."
          />
          <section className="home__stats glass">
            {[
              { value: '12K+', label: 'Services Completed' },
              { value: '4.9', label: 'Customer Rating' },
              { value: '15+', label: 'Expert Technicians' },
              { value: '8yr', label: 'Trusted in Mumbai' },
            ].map((stat) => (
              <article key={stat.label} className="home__stat">
                <span className="home__stat-value">{stat.value}</span>
                <span className="home__stat-label">{stat.label}</span>
              </article>
            ))}
          </section>
        </RevealSection>

        <RevealSection className="section-gap" delay={0.1}>
          <SectionHeading
            eyebrow="Chapter II"
            title="Our Services"
            subtitle="Premium care for every detail — book any service online in under a minute."
          />
          <section className="home__services-grid">
            {services.map((service, i) => (
              <GlassCard key={service.id} className="service-card" red={i === 0}>
                <section
                  className="service-card__image"
                  style={{ backgroundImage: `url(${service.image})` }}
                />
                <span className="service-card__icon">{service.icon}</span>
                <h3>{service.title}</h3>
                <p>{service.description}</p>
                <section className="service-card__meta">
                  <span>{service.price}</span>
                  <span>{service.duration}</span>
                </section>
                <Link to={`/booking?service=${service.id}`} className="service-card__link">
                  Book →
                </Link>
              </GlassCard>
            ))}
          </section>
          <section className="home__center-cta">
            <Link to="/services" className="btn btn-ghost">
              View All Services
            </Link>
          </section>
        </RevealSection>

        <RevealSection className="section-gap" delay={0.1}>
          <SectionHeading
            eyebrow="Chapter III"
            title="Before & After"
            subtitle="See the transformation. Real results from our premium bays."
            align="center"
          />
          <section className="home__gallery-preview">
            {galleryItems.slice(0, 2).map((item) => (
              <GlassCard key={item.id} className="compare-card">
                <section className="compare-card__images">
                  <article>
                    <span>Before</span>
                    <img src={item.before} alt={`${item.vehicle} before`} loading="lazy" />
                  </article>
                  <article>
                    <span>After</span>
                    <img src={item.after} alt={`${item.vehicle} after`} loading="lazy" />
                  </article>
                </section>
                <h4>{item.vehicle}</h4>
                <p>{item.service}</p>
              </GlassCard>
            ))}
          </section>
          <section className="home__center-cta">
            <Link to="/gallery" className="btn btn-primary">
              Full Gallery
            </Link>
          </section>
        </RevealSection>

        <RevealSection className="section-gap">
          <GlassCard className="home__track-cta glass-red" red>
            <SectionHeading
              eyebrow="Live"
              title="Track Your Service"
              subtitle="Enter your booking ID (demo: TT-2026-4821) to see real-time progress through every stage."
            />
            <Link to="/track" className="btn btn-primary">
              Open Live Tracker
            </Link>
          </GlassCard>
        </RevealSection>

        <RevealSection>
          <SectionHeading
            eyebrow="Visit Us"
            title="Find TyreTrack"
            subtitle={GARAGE.address}
          />
          <section className="home__map glass">
            <iframe
              title="TyreTrack location"
              src={GARAGE.mapEmbed}
              width="100%"
              height="320"
              style={{ border: 0, borderRadius: 16 }}
              allowFullScreen
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
            />
          </section>
          <p className="home__phone">
            <a href={`tel:${GARAGE.phone1.replace(/\s/g, '')}`}>{GARAGE.phone1}</a>
            {' · '}
            <a href={GARAGE.mapLink} target="_blank" rel="noreferrer">
              Open in Google Maps
            </a>
          </p>
        </RevealSection>
      </section>

      <Footer />
    </section>
  )
}
