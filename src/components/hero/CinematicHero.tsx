import { useEffect, useState } from 'react'
import { motion, useScroll, useTransform } from 'framer-motion'
import wheelImage from '../../assets/wheel.png'
import './CinematicHero.css'

// ✅ FIX: compute the wheel's off-screen entry position synchronously,
// on first render, instead of via useEffect (which only runs after the
// initial paint). This removes the post-mount jump/inconsistency that
// showed up as "lag" on some devices.
function getInitialEntryX() {
  if (typeof window === 'undefined') return -500
  return window.innerWidth < 768 ? -180 : -window.innerWidth / 2
}

export default function CinematicHero() {
  const [start, setStart] = useState(false)
  const [showText, setShowText] = useState(false)
  const [isScrolled, setIsScrolled] = useState(false)
  const [entryX] = useState(getInitialEntryX)

  const { scrollYProgress } = useScroll()
  const heroY = useTransform(scrollYProgress, [0, 1], [0, 300])
  const glowY = useTransform(scrollYProgress, [0, 1], [0, 500])

  useEffect(() => {
    const onScroll = () => setIsScrolled(window.scrollY > 120)
    window.addEventListener('scroll', onScroll)
    onScroll()

    const t1 = setTimeout(() => setStart(true), 400)
    const t2 = setTimeout(() => setShowText(true), 1200)

    return () => {
      window.removeEventListener('scroll', onScroll)
      clearTimeout(t1)
      clearTimeout(t2)
    }
  }, [])

  return (
    <section className="cinematic-hero" id="hero">
      <motion.div className="cinematic-hero__glow-wrap" style={{ y: glowY }}>
        <div className="cinematic-hero__glow" />
      </motion.div>

      <motion.div className="cinematic-hero__content" style={{ y: heroY }}>
        <div className={`cinematic-hero__text ${showText ? 'cinematic-hero__text--visible' : ''}`}>
          <h1 className="cinematic-hero__title">TyreTrack</h1>
          <p className="cinematic-hero__subtitle">Premium Service & Auto Care</p>
        </div>

        <div className="cinematic-hero__wheel-zone">
          <div className="cinematic-hero__wheel-glow" />
          <motion.div
            className="cinematic-hero__wheel"
            initial={{
              x: entryX,
              rotate: 0,
              scale: 0.8,
              opacity: 0,
            }}
            animate={
              start
                ? {
                    x: isScrolled ? -280 : 0,
                    y: isScrolled ? -170 : 0,
                    rotate: isScrolled ? 720 : 1080,
                    scale: isScrolled ? 0.42 : 1,
                    opacity: 1,
                  }
                : {}
            }
            transition={{
              // Position/rotation/scale keep their original roll-in feel —
              // untouched.
              x: { duration: 2, ease: [0.22, 1, 0.36, 1] },
              y: { duration: 2, ease: [0.22, 1, 0.36, 1] },
              rotate: { duration: 2, ease: [0.22, 1, 0.36, 1] },
              scale: { duration: 2, ease: [0.22, 1, 0.36, 1] },
              // ✅ FIX: opacity now resolves quickly and independently, so
              // the wheel is visible right as it starts rolling in instead
              // of staying nearly invisible until it's already landed.
              opacity: { duration: 0.35, ease: 'easeOut' },
            }}
            whileHover={{
              scale: isScrolled ? 0.42 : 1.03,
              filter: 'drop-shadow(0px 0px 10px rgba(255,0,0,0.28))',
            }}
          >
            <img
              src={wheelImage}
              alt="TyreTrack premium wheel service"
              style={{
                width: '100%',
                height: '100%',
                objectFit: 'contain',
                display: 'block',
              }}
            />
          </motion.div>
        </div>
      </motion.div>
    </section>
  )
}