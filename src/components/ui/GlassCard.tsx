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
      whileHover={hover ? { y: -6, scale: 1.01 } : undefined}
      transition={{ type: 'spring', stiffness: 300, damping: 24 }}
    >
      {children}
    </motion.div>
  )
}
