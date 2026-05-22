import { useEffect, useRef, useState } from 'react'
import { useInView, useMotionValue, useReducedMotion, animate } from 'framer-motion'

const formatValue = (n, decimals) =>
  n.toLocaleString('en-US', {
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals,
  })

export default function AnimatedCounter({ value, suffix = '', duration = 2, decimals = 0 }) {
  const ref = useRef(null)
  const reduce = useReducedMotion()
  // Pulled into view at +20% — gives the count-up time to start before the
  // user sees the value, avoiding the "stuck on 0" flash on quick scrolls.
  const inView = useInView(ref, { once: true, margin: '20% 0px' })
  const mv = useMotionValue(value)
  const [display, setDisplay] = useState(() => formatValue(value, decimals))

  useEffect(() => {
    if (reduce) {
      setDisplay(formatValue(value, decimals))
      return
    }
    if (!inView) return
    mv.set(0)
    setDisplay(formatValue(0, decimals))
    const controls = animate(mv, value, {
      duration,
      ease: [0.2, 0.7, 0.2, 1],
      onUpdate: (latest) => setDisplay(formatValue(latest, decimals)),
    })
    return () => controls.stop()
  }, [inView, mv, value, duration, decimals, reduce])

  return (
    <span ref={ref}>
      {display}
      {suffix}
    </span>
  )
}
