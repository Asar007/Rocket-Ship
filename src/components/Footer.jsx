import { lazy, Suspense } from 'react'
import { Mail, Phone, MapPin, ArrowUp, PhoneCall, ArrowUpRight } from 'lucide-react'
import { Link } from 'react-router-dom'
import logo from '../assets/logo.png'
import { openCallback } from './CallbackDialog.jsx'

// matter.js physics is heavy — lazy-load the falling-text widget so it
// doesn't bloat the initial bundle. Rendered only on tablet/desktop
// (it needs real estate the mobile footer doesn't have).
const FallingText = lazy(() => import('./FallingText.jsx'))

const COMPANY_LINKS = [
  { label: 'About us', to: '/about' },
  { label: 'Projects', to: '/projects' },
  { label: 'Customization', to: '/customization' },
  { label: 'Contact', to: '/contact' },
]

const REACH_ITEMS = [
  {
    Icon: Mail,
    label: 'md@madrasswastic.com',
    href: 'mailto:md@madrasswastic.com',
    kind: 'a',
  },
  {
    Icon: Phone,
    label: '+91 98841 48474',
    href: 'tel:+919884148474',
    kind: 'a',
  },
  {
    Icon: MapPin,
    // Multi-line address — renders on its own row, doesn't fight the grid.
    label: ['21-C, 5th Cross St, Guindy', 'Chennai 600032'],
    to: '/contact',
    kind: 'link',
  },
]

export default function Footer() {
  const onTop = () => window.scrollTo({ top: 0, behavior: 'smooth' })

  return (
    <footer
      className="safe-bottom relative isolate mt-12 overflow-hidden border-t border-white/10 bg-navy-950/70 backdrop-blur-xl"
    >
      <div className="hairline-gold absolute inset-x-0 top-0 z-30" />

      {/* MSE watermark — desktop only. There isn't enough vertical real
          estate inside the mobile footer for a 100px+ wordmark to sit
          behind content without visually overlapping the link grid /
          CTA. On lg+ it lives behind the brand column where it stays
          out of the link area. */}
      <div
        className="pointer-events-none absolute inset-y-0 left-0 right-0 z-0 hidden select-none items-center justify-center opacity-[0.10] lg:flex lg:opacity-[0.12]"
        aria-hidden="true"
      >
        <span
          className="font-body font-black uppercase leading-none text-white"
          style={{
            fontSize: 'clamp(280px, 32vw, 440px)',
            letterSpacing: '0.08em',
          }}
        >
          MSE
        </span>
      </div>

      <div className="relative z-20 mx-auto max-w-7xl px-5 pb-5 pt-9 sm:px-6 sm:pb-6 sm:pt-10">
        {/* ───── MOBILE / TABLET LAYOUT (< lg) ─────
            Single space-y container so each child auto-flows with
            consistent rhythm. No section-specific margins, no chance
            of double-spacing or overlap. */}
        <div className="flex flex-col gap-7 lg:hidden">
          {/* 1. Brand row */}
          <div className="flex items-center justify-between gap-3">
            <div className="flex min-w-0 items-center gap-3">
              <span className="grid h-11 w-11 shrink-0 place-items-center rounded-full border border-white/10 bg-white/[0.04]">
                <img
                  src={logo}
                  alt="Madras Swastic Engineers"
                  className="h-7 w-7 object-contain"
                />
              </span>
              <div className="min-w-0 leading-tight">
                <div className="truncate font-display text-sm font-semibold tracking-[0.16em] text-white">
                  MADRAS SWASTIC
                </div>
                <div className="truncate font-mono text-[10px] tracking-[0.32em] text-gold-400">
                  ENGINEERS
                </div>
              </div>
            </div>
            <button
              onClick={onTop}
              className="group inline-flex h-11 w-11 shrink-0 items-center justify-center rounded-full border border-white/10 bg-white/[0.04] text-white/70 transition-all duration-300 hover:border-gold-400/40 hover:text-gold-400 active:bg-white/[0.08]"
              aria-label="Back to top"
            >
              <ArrowUp className="h-4 w-4 transition-transform duration-300 group-hover:-translate-y-0.5" />
            </button>
          </div>

          {/* 2. Tagline */}
          <p className="max-w-md text-[13.5px] leading-relaxed text-white/60">
            A turnkey industrial engineering firm based in Chennai —
            structural, mechanical and piping work for India&rsquo;s energy and
            manufacturing sectors since 2009.
          </p>

          {/* 3. Primary CTA + contact pills — wraps cleanly via flex-wrap
              when the row gets tight, so chips never overflow or overlap. */}
          <div className="flex flex-wrap items-center gap-2.5">
            <button
              type="button"
              onClick={openCallback}
              className="group inline-flex h-11 items-center justify-center gap-2 rounded-full bg-gradient-to-r from-gold-400 via-gold-500 to-gold-600 px-4 font-display text-[14px] font-semibold text-navy-950 shadow-[0_10px_24px_-12px_rgba(212,162,76,0.7)] transition-transform duration-300 hover:-translate-y-0.5 active:translate-y-0"
            >
              <PhoneCall className="h-4 w-4" strokeWidth={2.2} />
              Schedule a callback
              <ArrowUpRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
            </button>
            {[
              {
                Icon: Mail,
                label: 'Email',
                aria: 'Email us',
                href: 'mailto:md@madrasswastic.com',
              },
              {
                Icon: Phone,
                label: 'Call',
                aria: 'Call us',
                href: 'tel:+919884148474',
              },
            ].map(({ Icon, label, aria, href }) => (
              <a
                key={label}
                href={href}
                aria-label={aria}
                className="inline-flex h-11 items-center gap-2 rounded-full border border-white/10 bg-white/[0.04] px-4 text-[13px] font-medium text-white/75 transition-all duration-300 hover:border-gold-400/40 hover:text-gold-400 active:bg-white/[0.08]"
              >
                <Icon className="h-4 w-4" />
                {label}
              </a>
            ))}
          </div>

          {/* 4. Link grid */}
          <div className="grid grid-cols-2 gap-x-5 gap-y-6 sm:gap-x-10">
            <div>
              <div className="font-mono text-[11px] tracking-[0.25em] uppercase text-gold-400">
                Company
              </div>
              <ul className="mt-3 space-y-2.5">
                {COMPANY_LINKS.map((it) => (
                  <li key={it.label}>
                    <Link
                      to={it.to}
                      className="text-[13.5px] text-white/70 transition-colors duration-300 hover:text-white"
                    >
                      {it.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            <div className="min-w-0">
              <div className="font-mono text-[11px] tracking-[0.25em] uppercase text-gold-400">
                Reach us
              </div>
              <ul className="mt-3 space-y-3">
                {REACH_ITEMS.map((it) => {
                  const Body = (
                    <span className="flex min-w-0 items-start gap-2 text-[13px] leading-snug text-white/70 transition-colors duration-300 group-hover:text-white">
                      <it.Icon className="mt-0.5 h-3.5 w-3.5 shrink-0 text-gold-400" />
                      <span className="min-w-0 break-words">
                        {Array.isArray(it.label)
                          ? it.label.map((line, i) => (
                              <span key={i} className="block">
                                {line}
                              </span>
                            ))
                          : it.label}
                      </span>
                    </span>
                  )
                  return (
                    <li key={Array.isArray(it.label) ? it.label[0] : it.label}>
                      {it.kind === 'link' ? (
                        <Link to={it.to} className="group block">
                          {Body}
                        </Link>
                      ) : (
                        <a href={it.href} className="group block">
                          {Body}
                        </a>
                      )}
                    </li>
                  )
                })}
              </ul>
            </div>
          </div>
        </div>

        {/* ───── DESKTOP LAYOUT (lg+) ───── */}
        <div className="hidden gap-10 lg:grid lg:grid-cols-12">
          {/* Brand */}
          <div className="lg:col-span-4">
            <div className="flex items-center gap-3">
              <span className="grid h-12 w-12 place-items-center rounded-full border border-white/10 bg-white/[0.04]">
                <img
                  src={logo}
                  alt="Madras Swastic Engineers"
                  className="h-8 w-8 object-contain"
                />
              </span>
              <div className="leading-tight">
                <div className="font-display text-sm font-semibold tracking-[0.16em] text-white">
                  MADRAS SWASTIC
                </div>
                <div className="font-mono text-[10px] tracking-[0.32em] text-gold-400">
                  ENGINEERS
                </div>
              </div>
            </div>

            {/* Brand description — falling text on hover */}
            <div className="mt-5 h-28 max-w-sm text-sm leading-relaxed text-white/60">
              <Suspense
                fallback={
                  <p>
                    A turnkey industrial engineering firm based in Chennai,
                    delivering structural, mechanical and piping work for
                    India&rsquo;s energy and manufacturing sectors since 2009.
                  </p>
                }
              >
                <FallingText
                  text="A turnkey industrial engineering firm based in Chennai, delivering structural, mechanical and piping work for India's energy and manufacturing sectors since 2009."
                  trigger="hover"
                  backgroundColor="transparent"
                  wireframes={false}
                  gravity={0.56}
                  mouseConstraintStiffness={0.9}
                />
              </Suspense>
            </div>

            {/* Callback CTA + contact chips */}
            <div className="mt-6 flex items-center gap-2">
              <button
                type="button"
                onClick={openCallback}
                className="group inline-flex h-11 items-center gap-2 rounded-full bg-gradient-to-r from-gold-400 via-gold-500 to-gold-600 px-4 font-display text-[13.5px] font-semibold text-navy-950 shadow-[0_10px_24px_-12px_rgba(212,162,76,0.7)] transition-transform duration-300 hover:-translate-y-0.5"
              >
                <PhoneCall className="h-4 w-4" strokeWidth={2.2} />
                Schedule a callback
              </button>
              {[
                { Icon: Mail, label: 'Email us', href: 'mailto:md@madrasswastic.com' },
                { Icon: Phone, label: 'Call us', href: 'tel:+919884148474' },
              ].map(({ Icon, label, href }) => (
                <a
                  key={label}
                  href={href}
                  aria-label={label}
                  className="grid h-11 w-11 place-items-center rounded-full border border-white/10 bg-white/[0.04] text-white/70 transition-all duration-300 hover:border-gold-400/40 hover:text-gold-400"
                >
                  <Icon className="h-4 w-4" />
                </a>
              ))}
            </div>
          </div>

          {/* Link columns */}
          <div className="grid grid-cols-2 gap-8 lg:col-span-7 lg:col-start-6">
            <div>
              <div className="font-mono text-[11px] tracking-[0.25em] uppercase text-gold-400">
                Company
              </div>
              <ul className="mt-4 space-y-3">
                {COMPANY_LINKS.map((it) => (
                  <li key={it.label}>
                    <Link
                      to={it.to}
                      className="text-sm text-white/70 transition-colors duration-300 hover:text-white"
                    >
                      {it.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            <div>
              <div className="font-mono text-[11px] tracking-[0.25em] uppercase text-gold-400">
                Reach us
              </div>
              <ul className="mt-4 space-y-3.5">
                {REACH_ITEMS.map((it) => {
                  const Body = (
                    <span className="flex items-start gap-2.5 text-sm leading-snug text-white/70 transition-colors duration-300 group-hover:text-white">
                      <it.Icon className="mt-0.5 h-3.5 w-3.5 shrink-0 text-gold-400" />
                      <span>
                        {Array.isArray(it.label)
                          ? it.label.map((line, i) => (
                              <span key={i} className="block">
                                {line}
                              </span>
                            ))
                          : it.label}
                      </span>
                    </span>
                  )
                  return (
                    <li key={Array.isArray(it.label) ? it.label[0] : it.label}>
                      {it.kind === 'link' ? (
                        <Link to={it.to} className="group block">
                          {Body}
                        </Link>
                      ) : (
                        <a href={it.href} className="group block">
                          {Body}
                        </a>
                      )}
                    </li>
                  )
                })}
              </ul>
            </div>
          </div>

          {/* Desktop back-to-top */}
          <div className="lg:col-span-1 lg:col-start-12 lg:justify-self-end">
            <button
              onClick={onTop}
              className="group inline-flex h-12 w-12 items-center justify-center rounded-full border border-white/10 bg-white/[0.04] text-white/70 transition-all duration-300 hover:border-gold-400/40 hover:text-gold-400"
              aria-label="Back to top"
            >
              <ArrowUp className="h-4 w-4 transition-transform duration-300 group-hover:-translate-y-0.5" />
            </button>
          </div>
        </div>

        {/* Bottom credit strip */}
        <div className="mt-8 flex flex-col items-start justify-between gap-2 border-t border-white/10 pt-4 text-[11.5px] text-white/55 sm:mt-10 sm:flex-row sm:items-center sm:pt-5 sm:text-xs">
          <span>
            © {new Date().getFullYear()} Madras Swastic Engineers Pvt. Ltd.
          </span>
          <span className="flex items-center gap-1.5">
            The work of
            <a
              href="https://github.com/Asar007"
              target="_blank"
              rel="noopener noreferrer"
              className="font-medium text-white/75 underline-offset-4 transition-colors duration-300 hover:text-gold-400 hover:underline"
            >
              Asar007
            </a>
            &amp;
            <a
              href="https://github.com/CatOn60hz"
              target="_blank"
              rel="noopener noreferrer"
              className="font-medium text-white/75 underline-offset-4 transition-colors duration-300 hover:text-gold-400 hover:underline"
            >
              CatOn60hz
            </a>
          </span>
        </div>
      </div>
    </footer>
  )
}
