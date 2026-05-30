import { Suspense, lazy } from 'react'
import SectionHeading from '../components/SectionHeading.jsx'

// Lazy so the Three.js chunk loads in its own bundle after the rest of
// the page has painted, instead of blocking the initial JS.
const TicketBand3D = lazy(() => import('../components/TicketBand3D.jsx'))

const BandFallback = () => (
  <div
    aria-hidden
    className="h-[320px] w-full sm:h-[460px] md:h-[560px]"
  />
)

export default function Clients() {
  return (
    <section
      id="clients"
      className="section-pad relative pb-2 sm:pb-[clamp(3rem,8vw,7rem)]"
    >
      <div className="mx-auto max-w-7xl px-4 sm:px-6">
        <SectionHeading
          eyebrow="Our clients"
          title="Trusted by India's industrial leaders."
          accentWord="Trusted"
          subtitle="Public-sector space agencies and private operators that depend on engineering work executed without drama."
        />

        <div className="mt-6 mb-6 sm:mt-12 sm:mb-16">
          <Suspense fallback={<BandFallback />}>
            <TicketBand3D />
          </Suspense>
        </div>
      </div>
    </section>
  )
}
