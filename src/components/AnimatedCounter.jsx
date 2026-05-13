import { useEffect, useMemo, useRef, useState } from 'react'
import { useInView, useMotionValue, animate } from 'framer-motion'

export default function AnimatedCounter({ value, suffix = '', duration = 2, decimals = 0 }) {
  const ref = useRef(null)
  const inView = useInView(ref, { once: true, margin: '-60px' })
  const mv = useMotionValue(0)
  const [display, setDisplay] = useState('0')

  // Allocate the formatter once instead of every animation frame.
  const formatter = useMemo(
    () =>
      new Intl.NumberFormat('en-US', {
        minimumFractionDigits: decimals,
        maximumFractionDigits: decimals,
      }),
    [decimals]
  )

  useEffect(() => {
    if (!inView) return
    const controls = animate(mv, value, {
      duration,
      ease: [0.2, 0.7, 0.2, 1],
      onUpdate: (latest) => setDisplay(formatter.format(latest)),
    })
    return () => controls.stop()
  }, [inView, mv, value, duration, formatter])

  return (
    <span ref={ref}>
      {display}
      {suffix}
    </span>
  )
}
