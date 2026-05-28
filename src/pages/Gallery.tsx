import RevealSection from '../components/ui/RevealSection'
import SectionHeading from '../components/ui/SectionHeading'
import './Gallery.css'

export default function Gallery() {
  return (
    <article className="page-inner">
      <RevealSection>
        <SectionHeading
          eyebrow="Gallery"
          title="Our Work"
          subtitle="Showcase your premium car care services"
          align="center"
        />
      </RevealSection>

      <section className="gallery-grid">
        <p style={{ textAlign: 'center', padding: '2rem' }}>
          Gallery content coming soon. Add your portfolio images here.
        </p>
      </section>
    </article>
  )
}