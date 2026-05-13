import { useEffect, useRef } from 'react'
import { useInView, useMotionValue, animate, motion, useTransform } from 'framer-motion'

export default function ProgressRing({ value = 0.96, label = '', sublabel = '' }) {
  const ref = useRef(null)
  const inView = useInView(ref, { once: true, margin: '-40px' })
  const progress = useMotionValue(0)

  const radius = 64
  const circumference = 2 * Math.PI * radius
  const dashOffset = useTransform(progress, (v) => circumference * (1 - v))
  const percent = useTransform(progress, (v) => `${Math.round(v * 100)}%`)

  useEffect(() => {
    if (!inView) return
    const controls = animate(progress, value, { duration: 1.8, ease: [0.2, 0.7, 0.2, 1] })
    return () => controls.stop()
  }, [inView, progress, value])

  return (
    <div ref={ref} className="flex flex-col items-center gap-3">
      <div className="relative h-40 w-40">
        <svg className="h-full w-full -rotate-90" viewBox="0 0 160 160">
          <defs>
            <linearGradient id={`ring-grad-${label}`} x1="0" y1="0" x2="1" y2="1">
              <stop offset="0%" stopColor="#5aa6ff" />
              <stop offset="55%" stopColor="#2563eb" />
              <stop offset="100%" stopColor="#f0c674" />
            </linearGradient>
          </defs>
          <circle
            cx="80"
            cy="80"
            r={radius}
            fill="none"
            stroke="rgba(255,255,255,0.08)"
            strokeWidth="8"
          />
          <motion.circle
            cx="80"
            cy="80"
            r={radius}
            fill="none"
            stroke={`url(#ring-grad-${label})`}
            strokeWidth="8"
            strokeLinecap="round"
            strokeDasharray={circumference}
            style={{ strokeDashoffset: dashOffset }}
          />
        </svg>
        <div className="absolute inset-0 grid place-items-center">
          <motion.span className="font-display text-2xl font-semibold text-white">
            {percent}
          </motion.span>
        </div>
      </div>
      <div className="text-center">
        <div className="font-display text-sm font-medium text-white">{label}</div>
        {sublabel && <div className="mt-0.5 text-xs text-white/55">{sublabel}</div>}
      </div>
    </div>
  )
}
