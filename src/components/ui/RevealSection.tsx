import { motion } from 'framer-motion'
import React from 'react'
import type { ReactNode } from 'react'

interface RevealSectionProps {
  children: ReactNode
  className?: string
  delay?: number
  stagger?: boolean
}

export default function RevealSection({ children, className = '', delay = 0, stagger = false }: RevealSectionProps) {
  const containerVariants = stagger ? {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.12,
        delayChildren: delay,
      },
    },
  } : undefined

  const itemVariants = stagger ? {
    hidden: { opacity: 0, y: 40 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.7, ease: [0.22, 1, 0.36, 1] },
    },
  } : undefined

  return (
    <motion.section
      className={className}
      variants={containerVariants}
      initial={stagger ? 'hidden' : { opacity: 0, y: 60 }}
      whileInView={stagger ? 'visible' : { opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-80px' }}
      transition={!stagger ? { duration: 0.9, delay, ease: [0.22, 1, 0.36, 1] } : undefined}
    >
      {stagger ? (
        <motion.div variants={containerVariants}>
          {children}
        </motion.div>
      ) : (
        children
      )}
    </motion.section>
  )
}
