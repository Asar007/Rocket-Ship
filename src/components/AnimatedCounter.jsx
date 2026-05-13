import { useEffect, useRef, useState } from 'react'
import { useInView, useMotionValue, animate } from 'framer-motion'

export default function AnimatedCounter({ value, suffix = '', duration = 2, decimals = 0 }) {
  const ref = useRef(null)
  const inView = useInView(ref, { once: true, margin: '-60px' })
  const mv = useMotionValue(0)
  const [display, setDisplay] = useState('0')

  useEffect(() => {
    if (!inView) return
    const controls = animate(mv, value, {
      duration,
      ease: [0.2, 0.7, 0.2, 1],
      onUpdate: (latest) => {
        setDisplay(
          latest.toLocaleString('en-US', {
            minimumFractionDigits: decimals,
            maximumFractionDigits: decimals,
          })
        )
      },
    })
    return () => controls.stop()
  }, [inView, mv, value, duration, decimals])

  return (
    <span ref={ref}>
      {display}
      {suffix}
    </span>
  )
}
