import { Link } from 'react-router-dom'
import CinematicHero from '../components/hero/CinematicHero'
import RevealSection from '../components/ui/RevealSection'
import SectionHeading from '../components/ui/SectionHeading'
import GlassCard from '../components/ui/GlassCard'
import Footer from '../components/layout/Footer'
import { services, GARAGE } from '../data/services'
import { getDemoStages } from '../data/tracking'
import './Home.css'

export default function Home() {
  return (
    <section className="home">
      <CinematicHero />

      <section className="home__story page-inner">
        <RevealSection className="section-gap">
          <SectionHeading
          
            eyebrow="About Us"
            title="Crafted for the Driven"
            subtitle="Every vehicle that enters TyreTrack receives white-glove treatment — from precision alignment to showroom-ready finishes."
          />
          <section className="home__stats glass">
            {[
              { value: '1K+', label: 'Services Completed' },
              { value: '4.9', label: 'Customer Rating' },
              { value: '5+', label: 'Expert Technicians' },
              { value: '3yr', label: 'Trusted in Tirupur' },
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
            eyebrow="Services"
            title="Our Services"
            subtitle="Premium care for every detail — book any service online in under a minute."
          />
          <section className="home__services-grid">
            {services.slice(0, 4).map((service, i) => (
              <GlassCard key={service.id} className="service-card" red={i === 3}>
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

        <RevealSection className="section-gap">

  <GlassCard className="glass-red" red>

    <SectionHeading
      eyebrow="New"
      title="Need a Tyre Quotation?"
      subtitle="Receive a personalized quotation based on your vehicle and tyre requirements."
    />

    <section className="home__center-cta">

      <Link
        to="/getquote"
        className="btn btn-primary"
      >
        🚗 Get My Quote
      </Link>

    </section>

  </GlassCard>

</RevealSection>

        <RevealSection className="section-gap">
          <GlassCard className="home__track-cta glass-red" red>
            <div className="home__track-content">
              <div className="home__track-text">
                <SectionHeading
                  eyebrow="Live"
                  title="Track Your Service"
                  subtitle="Live booking tracking for TYRE TRACK customers. Monitor your vehicle service progress in real time. Enter your booking ID (demo: TT-2026-4821) to see real-time progress through every stage."
                />
                <Link to="/track" className="btn btn-primary">
                  Open Live Tracker
                </Link>
              </div>

              <div className="home__track-timeline">
                <div className="tracking-line">
                  {getDemoStages(3).map((stage) => (
                    <div key={stage.id} className={`track-stage track-stage--${stage.status}`}>
                      <div className="track-stage__dot"></div>
                      <div className="track-stage__info">
                        <p className="track-stage__label">{stage.label}</p>
                        <p className="track-stage__desc">{stage.description}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
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
