import { Suspense, lazy, useEffect, useRef, useState } from 'react'
import { motion } from 'framer-motion'
import { ArrowUpRight, Mail, Phone, MapPin } from 'lucide-react'
import { openCallback } from '../components/CallbackDialog.jsx'

// Heavy r3f/rapier physics scene — only loaded when the section enters view
// AND the user hasn't opted out of motion / isn't on a tiny screen.
const ConnectorsBackground = lazy(() => import('../components/ConnectorsBackground.jsx'))

function useShouldRenderConnectors(ref) {
  const [render, setRender] = useState(false)

  useEffect(() => {
    if (typeof window === 'undefined') return
    const motionMq = window.matchMedia('(prefers-reduced-motion: reduce)')
    const sizeMq = window.matchMedia('(max-width: 640px)')
    if (motionMq.matches || sizeMq.matches) return

    const node = ref.current
    if (!node || !('IntersectionObserver' in window)) {
      setRender(true)
      return
    }

    const io = new IntersectionObserver(
      (entries) => {
        if (entries.some((e) => e.isIntersecting)) {
          setRender(true)
          io.disconnect()
        }
      },
      { rootMargin: '200px' }
    )
    io.observe(node)
    return () => io.disconnect()
  }, [ref])

  return render
}

export default function ContactCTA() {
  const sceneRef = useRef(null)
  const shouldRender = useShouldRenderConnectors(sceneRef)

  return (
    <section id="contact" className="section-pad relative">
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <motion.div
          ref={sceneRef}
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-80px' }}
          transition={{ duration: 0.8, ease: [0.2, 0.7, 0.2, 1] }}
          className="glass-strong relative overflow-hidden rounded-[32px] px-6 py-14 text-center sm:px-12 sm:py-20"
        >
          {/* Connectors scene fills the panel. Pointer-events confined to itself
              via a wrapper so the CTA buttons stay clickable; clicking empty
              area still drops through to the canvas to cycle accent colour. */}
          {shouldRender && (
            <div className="pointer-events-none absolute inset-0 z-0">
              <Suspense fallback={null}>
                <ConnectorsBackground />
              </Suspense>
            </div>
          )}

          {/* Static decorative wash — always visible as a fallback / on mobile */}
          <div className="pointer-events-none absolute -left-20 -top-20 h-60 w-60 rounded-full bg-electric-500/20 blur-3xl" />
          <div className="pointer-events-none absolute -right-20 -bottom-20 h-60 w-60 rounded-full bg-gold-500/20 blur-3xl" />
          <div className="pointer-events-none absolute inset-0 bg-grid opacity-20" />

          <div className="relative z-10">
            <div className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/[0.04] px-3 py-1.5 backdrop-blur">
              <span className="h-1.5 w-1.5 rounded-full bg-gold-400" />
              <span className="eyebrow">Open for 2026 projects</span>
            </div>

            <h2 className="mx-auto mt-6 max-w-3xl font-display text-3xl font-semibold leading-[1.05] tracking-tight text-white sm:text-5xl md:text-6xl">
              Let's Build Something{' '}
              <span className="bg-gradient-to-br from-gold-400 via-gold-500 to-gold-600 bg-clip-text text-transparent">
                Great
              </span>{' '}
              Together.
            </h2>
            <p className="mx-auto mt-5 max-w-xl text-base leading-relaxed text-white/70 sm:text-lg">
              Tell us about your site, drawings or RFQ. We'll respond inside 24 hours with a senior
              engineer assigned to your conversation.
            </p>

            <div className="mt-9 flex flex-wrap items-center justify-center gap-3">
              <button
                type="button"
                onClick={openCallback}
                className="btn-primary liquid-glass liquid-glass-pill group"
              >
                Start a Conversation
                <ArrowUpRight className="h-4 w-4 transition-transform duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
              </button>
              <a href="tel:+914400000000" className="btn-ghost liquid-glass liquid-glass-pill">
                <Phone className="h-4 w-4 text-gold-400" />
                +91 44 0000 0000
              </a>
            </div>

            <div className="mt-12 grid grid-cols-1 gap-px overflow-hidden rounded-2xl border border-white/10 bg-white/[0.02] sm:grid-cols-3">
              {[
                { icon: Mail, label: 'Email us', value: 'projects@madrasswastic.com' },
                { icon: Phone, label: 'Call directly', value: '+91 44 0000 0000' },
                { icon: MapPin, label: 'Head office', value: 'Sriperumbudur, Chennai' },
              ].map((c) => (
                <div
                  key={c.label}
                  className="flex items-center gap-3 bg-navy-950/30 px-5 py-4 text-left"
                >
                  <span className="grid h-9 w-9 place-items-center rounded-full border border-white/10 bg-white/[0.04]">
                    <c.icon className="h-4 w-4 text-gold-400" />
                  </span>
                  <div>
                    <div className="font-mono text-[10px] tracking-[0.2em] uppercase text-white/50">
                      {c.label}
                    </div>
                    <div className="font-display text-sm font-medium text-white">{c.value}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  )
}
