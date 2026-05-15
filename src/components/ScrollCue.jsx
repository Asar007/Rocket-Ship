import { useEffect, useState } from 'react'
import { useLocation } from 'react-router-dom'
import { motion, AnimatePresence, useReducedMotion } from 'framer-motion'
import { ChevronDown } from 'lucide-react'

/**
 * Subtle "scroll to view more" cue shown at the top of every page.
 * Fades out once the visitor scrolls; reappears on route change
 * (each page starts at the top via Layout's ScrollToTop).
 */
export default function ScrollCue() {
  const reduce = useReducedMotion()
  const { pathname } = useLocation()
  const [hidden, setHidden] = useState(false)

  useEffect(() => {
    setHidden(window.scrollY > 60)
    const onScroll = () => setHidden(window.scrollY > 60)
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [pathname])

  return (
    <AnimatePresence>
      {!hidden && (
        <motion.div
          key="scroll-cue"
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 8 }}
          transition={{ duration: 0.4 }}
          className="pointer-events-none fixed inset-x-0 bottom-6 z-40 flex flex-col items-center gap-1.5 text-white/55"
        >
          <span className="font-mono text-[10px] uppercase tracking-[0.3em]">
            Scroll to view more
          </span>
          <motion.span
            animate={reduce ? undefined : { y: [0, 7, 0] }}
            transition={{ duration: 1.6, repeat: Infinity, ease: 'easeInOut' }}
          >
            <ChevronDown className="h-5 w-5" />
          </motion.span>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
