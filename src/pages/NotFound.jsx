import { Link } from 'react-router-dom'
import { Head } from 'vite-react-ssg'
import { ArrowUpRight } from 'lucide-react'
import Seo from '../lib/seo.jsx'

const DESTINATIONS = [
  {
    to: '/',
    eyebrow: 'Start',
    title: 'Home',
    body: 'Heavy and precision metal fabrication for space and industry.',
  },
  {
    to: '/projects',
    eyebrow: 'Selected work',
    title: 'Projects',
    body: 'Aerospace, structural and process plant builds for ISRO and Indian industry.',
  },
  {
    to: '/customization',
    eyebrow: 'Bespoke',
    title: 'Custom fabrication',
    body: 'Made-to-drawing fabrication and contract manufacturing.',
  },
  {
    to: '/contact',
    eyebrow: 'Talk to us',
    title: 'Contact',
    body: 'Send drawings or an RFQ. Senior engineer assigned within a working day.',
  },
]

export function Component() {
  return (
    <div className="relative min-h-svh overflow-hidden pt-24 sm:pt-28">
      <Seo
        title="Page not found (404)"
        description="The page you are looking for does not exist. Browse Madras Swastic Engineers heavy fabrication, projects, custom work and contact."
        path="/404"
      />
      <Head>
        <meta name="robots" content="noindex, nofollow" />
      </Head>

      {/* Soft radial wash so the page does not read as a flat error screen. */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 -z-10"
        style={{
          background:
            'radial-gradient(ellipse at 50% 30%, rgba(90,166,255,0.12), rgba(240,198,116,0.06) 40%, transparent 72%)',
        }}
      />

      <main className="mx-auto flex max-w-5xl flex-col items-center px-5 py-16 text-center sm:px-6 sm:py-24">
        <p className="font-mono text-[11px] uppercase tracking-[0.4em] text-gold-400">
          404
        </p>
        <h1
          className="mt-5 font-display font-semibold leading-[1.05] tracking-tight text-white"
          style={{ fontSize: 'clamp(2rem, 5vw + 1rem, 3.5rem)' }}
        >
          This page drifted off course.
        </h1>
        <p className="mt-5 max-w-xl text-[15px] leading-relaxed text-white/65 sm:text-base">
          The link may be broken, or the page may have moved. Pick a destination
          below, or head back to the home page.
        </p>

        <div className="mt-10 grid w-full grid-cols-1 gap-4 text-left sm:grid-cols-2 sm:gap-5">
          {DESTINATIONS.map((d) => (
            <Link
              key={d.to}
              to={d.to}
              className="group relative flex flex-col rounded-2xl border border-white/10 bg-white/[0.03] p-5 backdrop-blur-xl transition-colors duration-500 hover:border-gold-400/40 focus:outline-none focus-visible:ring-2 focus-visible:ring-gold-400/60"
            >
              <div className="flex items-center justify-between">
                <span className="font-mono text-[10px] uppercase tracking-[0.28em] text-gold-400">
                  {d.eyebrow}
                </span>
                <span className="grid h-7 w-7 place-items-center rounded-full border border-white/15 text-gold-400 transition-all duration-500 group-hover:rotate-[-45deg] group-hover:border-gold-400/60">
                  <ArrowUpRight className="h-3.5 w-3.5" />
                </span>
              </div>
              <h2 className="mt-3 font-display text-lg font-semibold text-white">
                {d.title}
              </h2>
              <p className="mt-2 text-[13px] leading-relaxed text-white/55">
                {d.body}
              </p>
            </Link>
          ))}
        </div>

        <Link to="/" className="btn-primary mt-10">
          Back to home
        </Link>
      </main>
    </div>
  )
}
