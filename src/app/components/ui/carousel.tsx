'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

const images = [
  '/carousel/1.jpg',
  '/carousel/2.jpg',
  '/carousel/3.jpg',
]

const variants = {
  enter: (direction: number) => ({
    x: direction > 0 ? '100%' : '-100%',
    opacity: 1
  }),
  center: {
    zIndex: 1,
    x: 0,
    opacity: 1
  },
  exit: (direction: number) => ({
    zIndex: 0,
    x: direction < 0 ? '100%' : '-100%',
    opacity: 1
  })
}

export function Carousel() {
  const [[page, direction], setPage] = useState([0, 0])
  const [isAutoPlaying, setIsAutoPlaying] = useState(true)

  const imageIndex = Math.abs(page % images.length)

  const paginate = (newDirection: number) => {
    setPage([page + newDirection, newDirection])
  }

  useEffect(() => {
    if (isAutoPlaying) {
      const timer = setTimeout(() => paginate(1), 4000)
      return () => clearTimeout(timer)
    }
  }, [page, isAutoPlaying])

  return (
    <div 
      className="relative h-[500px] w-full overflow-hidden"
      onMouseEnter={() => setIsAutoPlaying(false)}
      onMouseLeave={() => setIsAutoPlaying(true)}
    >
      <AnimatePresence initial={false} custom={direction} mode="popLayout">
        <motion.div
          key={page}
          custom={direction}
          variants={variants}
          initial="enter"
          animate="center"
          exit="exit"
          transition={{
            x: { type: "tween", duration: 0.6, ease: [0.4, 0, 0.2, 1] },
          }}
          className="absolute inset-0 w-full h-full"
        >
          <motion.img
            src={images[imageIndex]}
            alt={`Slide ${imageIndex + 1}`}
            className="w-full h-full object-cover transition-transform duration-500"
            style={{ width: '100%', height: '100%' }}
            whileHover={{ scale: 1.05 }}
            draggable="false"
          />
        </motion.div>
      </AnimatePresence>

      {/* Dots Indicator */}
      <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex space-x-2">
        {images.map((_, index) => (
          <button
            key={index}
            className={`w-2 h-2 rounded-full transition-colors duration-300 ${
              index === imageIndex ? 'bg-white' : 'bg-white/50'
            }`}
            onClick={() => {
              const direction = index - imageIndex
              setPage([index, direction])
            }}
          />
        ))}
      </div>
    </div>
  )
} 