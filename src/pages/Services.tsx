import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import RevealSection from '../components/ui/RevealSection'
import SectionHeading from '../components/ui/SectionHeading'
import GlassCard from '../components/ui/GlassCard'
import { services } from '../data/services'
import './Services.css'

export default function Services() {
  return (
    <article className="page-inner">
      <RevealSection>
        <SectionHeading
          eyebrow="Services"
          title="Premium Tyre & Auto Care"
          subtitle="Every service is delivered with premium equipment, certified technicians, and transparent pricing."
          align="center"
        />
      </RevealSection>

      <section className="services-showcase">
        {services.map((service, i) => (
          <RevealSection key={service.id} delay={i * 0.08}>
            <GlassCard
              className={`service-row ${
                i % 2 === 1 ? 'service-row--reverse' : ''
              }`}
            >
              <motion.div
                className="service-row__visual"
                style={{
                  backgroundImage: `url(${service.image})`,
                  backgroundSize: 'cover',
                  backgroundPosition: 'center',
                }}
                whileHover={{ scale: 1.03 }}
                transition={{ duration: 0.5 }}
              ></motion.div>

              <section className="service-row__content">
                <span className="service-row__icon">
                  {service.icon}
                </span>

                <h2>{service.title}</h2>

                <p>{service.description}</p>

                <section className="service-row__meta">
                  <span>{service.price}</span>
                  <span>{service.duration}</span>
                </section>

                <Link
                  to={`/booking?service=${service.id}`}
                  className="btn btn-primary"
                >
                  Book {service.title}
                </Link>
              </section>
            </GlassCard>
          </RevealSection>
        ))}
      </section>
    </article>
  )
}