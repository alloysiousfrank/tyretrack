import { motion } from 'framer-motion'
import type { ReactNode } from 'react'
import './GlassCard.css'

interface GlassCardProps {
  children: ReactNode
  className?: string
  hover?: boolean
  red?: boolean
}

export default function GlassCard({ children, className = '', hover = true, red = false }: GlassCardProps) {
  return (
    <motion.div
      className={`glass-card ${red ? 'glass-red' : 'glass'} ${className}`}
      initial={{ opacity: 0, y: 40 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-50px' }}
      whileHover={hover ? { y: -12, scale: 1.02 } : undefined}
      transition={{ 
        type: 'spring', 
        stiffness: 300, 
        damping: 24,
        duration: 0.6,
        ease: [0.22, 1, 0.36, 1]
      }}
    >
      {children}
    </motion.div>
  )
}
