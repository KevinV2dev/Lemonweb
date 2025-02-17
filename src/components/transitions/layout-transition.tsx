'use client'

import { motion } from 'framer-motion'

const pageVariants = {
  initial: {
    opacity: 0,
    x: -10
  },
  animate: {
    opacity: 1,
    x: 0,
    transition: {
      duration: 0.25,
      ease: [0.25, 0.1, 0.25, 1.0], // cubic-bezier
    }
  },
  exit: {
    opacity: 0,
    x: 10,
    transition: {
      duration: 0.25,
      ease: [0.25, 0.1, 0.25, 1.0],
    }
  }
}

export function LayoutTransition({ children }: { children: React.ReactNode }) {
  return (
    <motion.div
      variants={pageVariants}
      initial="initial"
      animate="animate"
      exit="exit"
      style={{
        position: 'relative',
        width: '100%'
      }}
    >
      {children}
    </motion.div>
  )
} 