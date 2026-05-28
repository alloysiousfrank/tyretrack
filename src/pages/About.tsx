import { Link } from 'react-router-dom'
import RevealSection from '../components/ui/RevealSection'
import SectionHeading from '../components/ui/SectionHeading'
import GlassCard from '../components/ui/GlassCard'
import { GARAGE } from '../data/services'
import './About.css'

const values = [
  {
    title: 'Precision Engineering',
    text: 'Laser alignment, torque-spec fastening, and calibrated equipment on every job.',
  },
  {
    title: 'Transparent Process',
    text: 'Live tracking, before-and-after documentation, and honest estimates.',
  },
  {
    title: 'Luxury Experience',
    text: 'A lounge-worthy waiting area mindset — your car treated like a flagship.',
  },
]

export default function About() {
  return (
    <article className="page-inner about-page">
      <RevealSection>
        <SectionHeading
          eyebrow="Our Story"
          title="Born on the Track"
          subtitle="TyreTrack started with a simple belief: every driver deserves motorsport-grade care, whether it's a daily commuter or a weekend machine."
          align="center"
        />
      </RevealSection>

      <RevealSection delay={0.1}>
        <GlassCard className="about-hero glass-red" red>
          <p>
            From wheel alignment to full interior restoration, we combine German-precision workflows
            with Mumbai hustle — delivering premium garage services without the dealership markup.
          </p>
        </GlassCard>
      </RevealSection>

      <section className="about-values">
        {values.map((v, i) => (
          <RevealSection key={v.title} delay={i * 0.1}>
            <GlassCard>
              <h3>{v.title}</h3>
              <p>{v.text}</p>
            </GlassCard>
          </RevealSection>
        ))}
      </section>

      <RevealSection>
        <section className="about-cta">
          <p>{GARAGE.hours}</p>
          <Link to="/booking" className="btn btn-primary">
            Book Your Visit
          </Link>
        </section>
      </RevealSection>
    </article>
  )
}
