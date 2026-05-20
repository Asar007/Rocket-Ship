import { Suspense, lazy, useRef } from 'react'
import { motion, useInView } from 'framer-motion'
import ErrorBoundary from '../components/ErrorBoundary.jsx'

const SpaceshipGLB = lazy(() => import('../components/SpaceshipGLB.jsx'))

export default function AboutCapsule() {
  const ref = useRef(null)
  const inView = useInView(ref, { once: true, margin: '0px' })

  return (
    <section
      id="capsule"
      ref={ref}
      // Cancel the About-page's pt-24/28 so this hero is true edge-to-edge.
      // h-[100svh] uses small-viewport-height so mobile URL bars don't
      // create a scroll gap; h-screen is the desktop fallback.
      className="relative -mt-24 h-screen w-full overflow-hidden sm:-mt-28"
      style={{
        height: '100svh',
        background:
          'radial-gradient(130% 90% at 50% 38%, #1d44a6 0%, #0d2569 45%, #050f30 100%)',
      }}
    >
      {/* Atmospheric accent glows */}
      <div aria-hidden className="pointer-events-none absolute inset-0">
        <div className="absolute left-[12%] top-[18%] h-[40vmin] w-[40vmin] rounded-full bg-[#5aa6ff]/15 blur-3xl" />
        <div className="absolute right-[8%] bottom-[10%] h-[36vmin] w-[36vmin] rounded-full bg-[#f0c674]/10 blur-3xl" />
      </div>

      {/* Huge backdrop wordmark — sits behind the capsule and gets
          partially occluded by it, like the can labels in the reference. */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 flex items-center justify-center"
      >
        <span
          className="select-none whitespace-nowrap font-bold leading-none text-white/[0.08]"
          style={{
            // Sized so the 9-letter word stays inside the viewport at every
            // breakpoint. On mobile the vw scaling drops it small enough that
            // we tighten letter-spacing further to fill the width.
            fontSize: 'clamp(54px, 13vw, 220px)',
            letterSpacing: '-0.05em',
            fontFamily: '"Playfair Display", "DM Serif Display", Georgia, serif',
          }}
        >
          GAGANYAAN
        </span>
      </div>

      {/* Devanagari accent beneath the wordmark */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-x-0 bottom-[10%] flex items-center justify-center px-6 sm:bottom-[16%]"
      >
        <span
          className="select-none whitespace-nowrap font-mono uppercase text-white/35"
          style={{
            fontSize: 'clamp(9.5px, 1.2vw, 16px)',
            letterSpacing: '0.36em',
          }}
        >
          गगनयान · ISRO / HSFC
        </span>
      </div>

      {/* Floating capsule */}
      <div className="absolute inset-0">
        <ErrorBoundary fallback={null}>
          {inView && (
            <Suspense fallback={null}>
              <SpaceshipGLB
                spin={false}
                float
                tilt={-0.14}
                controls={false}
                variant="dark"
              />
            </Suspense>
          )}
        </ErrorBoundary>
      </div>

      {/* Soft fade at the bottom into the next section */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-x-0 bottom-0 h-24 bg-gradient-to-b from-transparent to-navy-950"
      />
    </section>
  )
}
