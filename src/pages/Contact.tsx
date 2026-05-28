import { useState } from 'react'
import RevealSection from '../components/ui/RevealSection'
import SectionHeading from '../components/ui/SectionHeading'
import GlassCard from '../components/ui/GlassCard'
import { GARAGE } from '../data/services'
import './Contact.css'

export default function Contact() {
  const [sent, setSent] = useState(false)

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setSent(true)
  }

  return (
    <article className="page-inner contact-page">
      <RevealSection>
        <SectionHeading
          eyebrow="Contact"
          title="Get In Touch"
          subtitle="Visit our bay, call us, or send a message. We're here to help."
          align="center"
        />
      </RevealSection>

      <section className="contact-grid">
        <RevealSection delay={0.1}>
          <GlassCard className="contact-info">
            <h3>TyreTrack Garage</h3>
            <p>{GARAGE.address}</p>
            <a href={`tel:${GARAGE.phone.replace(/\s/g, '')}`} className="contact-link">
              {GARAGE.phone}
            </a>
            <a href={`mailto:${GARAGE.email}`} className="contact-link">
              {GARAGE.email}
            </a>
            <p className="contact-hours">{GARAGE.hours}</p>
            <a href={GARAGE.mapLink} target="_blank" rel="noreferrer" className="btn btn-ghost">
              Open in Google Maps
            </a>
          </GlassCard>
        </RevealSection>

        <RevealSection delay={0.15}>
          <GlassCard>
            {sent ? (
              <p className="contact-sent">Thank you! We&apos;ll get back to you shortly.</p>
            ) : (
              <form onSubmit={handleSubmit}>
                <section className="form-group">
                  <label htmlFor="c-name">Name</label>
                  <input id="c-name" required />
                </section>
                <section className="form-group">
                  <label htmlFor="c-email">Email</label>
                  <input id="c-email" type="email" required />
                </section>
                <section className="form-group">
                  <label htmlFor="c-msg">Message</label>
                  <textarea id="c-msg" rows={4} required />
                </section>
                <button type="submit" className="btn btn-primary">
                  Send Message
                </button>
              </form>
            )}
          </GlassCard>
        </RevealSection>
      </section>

      <RevealSection delay={0.2}>
        <section className="contact-map glass">
          <iframe
            title="TyreTrack map"
            src={GARAGE.mapEmbed}
            width="100%"
            height="400"
            style={{ border: 0, borderRadius: 16 }}
            allowFullScreen
            loading="lazy"
          />
        </section>
      </RevealSection>
    </article>
  )
}
