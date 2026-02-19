'use client'

import { motion, useReducedMotion } from 'motion/react'
import { type ReactNode } from 'react'

type Direction = 'up' | 'down' | 'left' | 'right' | 'none'

type Props = {
  children: ReactNode
  direction?: Direction
  delay?: number
  duration?: number
  className?: string
}

function getOffset(direction: Direction): { x: number; y: number } {
  switch (direction) {
    case 'up':
      return { x: 0, y: 40 }
    case 'down':
      return { x: 0, y: -40 }
    case 'left':
      return { x: 40, y: 0 }
    case 'right':
      return { x: -40, y: 0 }
    case 'none':
      return { x: 0, y: 0 }
  }
}

export function ScrollFadeIn({
  children,
  direction = 'up',
  delay = 0,
  duration = 0.6,
  className,
}: Props) {
  const shouldReduceMotion = useReducedMotion()

  if (shouldReduceMotion) {
    return <div className={className}>{children}</div>
  }

  const offset = getOffset(direction)

  return (
    <motion.div
      initial={{ opacity: 0, x: offset.x, y: offset.y }}
      whileInView={{ opacity: 1, x: 0, y: 0 }}
      viewport={{ once: true, amount: 0.3 }}
      transition={{ duration, delay, ease: 'easeOut' }}
      className={className}
    >
      {children}
    </motion.div>
  )
}
