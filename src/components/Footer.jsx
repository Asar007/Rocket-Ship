import { lazy, Suspense } from 'react'
import { Mail, Phone, ArrowUp } from 'lucide-react'
import { Link } from 'react-router-dom'
import logo from '../assets/logo.png'

// matter.js physics is heavy — lazy-load the falling-text widget so it
// doesn't bloat the initial bundle. Rendered only on tablet/desktop
// (it needs real estate the mobile footer doesn't have).
const FallingText = lazy(() => import('./FallingText.jsx'))

const LINKS = [
  {
    title: 'Company',
    items: [
      { label: 'About us', to: '/about' },
      { label: 'Projects', to: '/projects' },
      { label: 'Customization', to: '/customization' },
      { label: 'Contact', to: '/contact' },
    ],
  },
  {
    title: 'Reach us',
    items: [
      { label: 'md@madrasswastic.com', href: 'mailto:md@madrasswastic.com' },
      { label: '+91 98841 48474', href: 'tel:+919884148474' },
      { label: 'Guindy Industrial Estate, Chennai 600032', to: '/contact' },
    ],
  },
]

export default function Footer() {
  const onTop = () => window.scrollTo({ top: 0, behavior: 'smooth' })
  return (
    <footer
      className="safe-bottom relative isolate mt-12 overflow-hidden border-t border-white/10 bg-navy-950/70 backdrop-blur-xl"
    >
      <div className="hairline-gold absolute inset-x-0 top-0 z-30" />

      {/* MSE watermark — clipped inside the footer, sits behind all content.
          Mobile opacity dialled down so it doesn't fight the link columns. */}
      <div
        className="pointer-events-none absolute inset-x-0 bottom-[72px] z-0 flex select-none justify-center opacity-[0.06] sm:bottom-[55px] sm:opacity-[0.10] lg:bottom-[41px] lg:opacity-[0.12]"
        aria-hidden="true"
      >
        <div className="flex h-[160px] w-[92%] max-w-[1100px] items-center justify-center sm:h-[320px] sm:w-[88%] lg:h-[440px] lg:w-[85%]">
          <span className="font-body text-[160px] font-black uppercase leading-none tracking-[0.18em] text-white sm:text-[320px] lg:text-[440px]">
            MSE
          </span>
        </div>
      </div>

      <div className="relative z-20 mx-auto max-w-7xl px-5 pb-5 pt-8 sm:px-6 sm:pb-6 sm:pt-10">
        {/* Top row — mobile: logo block on the left, back-to-top on the right.
            Desktop hides the inline back-to-top (rendered as its own col below). */}
        <div className="flex items-center justify-between gap-3 lg:hidden">
          <div className="flex items-center gap-3">
            <span className="grid h-11 w-11 place-items-center rounded-full border border-white/10 bg-white/[0.04]">
              <img src={logo} alt="Madras Swastic Engineers" className="h-7 w-7 object-contain" />
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
          <button
            onClick={onTop}
            className="group inline-flex h-11 w-11 shrink-0 items-center justify-center rounded-full border border-white/10 bg-white/[0.04] text-white/70 transition-all duration-300 hover:border-gold-400/40 hover:text-gold-400 active:bg-white/[0.08]"
            aria-label="Back to top"
          >
            <ArrowUp className="h-4 w-4 transition-transform duration-300 group-hover:-translate-y-0.5" />
          </button>
        </div>

        {/* Mobile contact chips, sit just under the brand row. */}
        <div className="mt-5 flex items-center gap-2.5 lg:hidden">
          {[
            { Icon: Mail, label: 'Email us', href: 'mailto:md@madrasswastic.com' },
            { Icon: Phone, label: 'Call us', href: 'tel:+919884148474' },
          ].map(({ Icon, label, href }) => (
            <a
              key={label}
              href={href}
              aria-label={label}
              className="grid h-11 w-11 place-items-center rounded-full border border-white/10 bg-white/[0.04] text-white/70 transition-all duration-300 hover:border-gold-400/40 hover:text-gold-400 active:bg-white/[0.08]"
            >
              <Icon className="h-4 w-4" />
            </a>
          ))}
        </div>

        {/* Link columns — mobile: 2-up Company | Reach us; desktop: slot into
            the right-hand 7-col band of the brand/links/back-to-top grid. */}
        <div className="mt-8 grid grid-cols-2 gap-x-5 gap-y-6 sm:gap-x-8 lg:hidden">
          {LINKS.map((col) => (
            <div key={col.title}>
              <div className="font-mono text-[11px] tracking-[0.25em] uppercase text-gold-400">
                {col.title}
              </div>
              <ul className="mt-3 space-y-2">
                {col.items.map((it) =>
                  it.to ? (
                    <li key={it.label}>
                      <Link
                        to={it.to}
                        className="text-[13.5px] text-white/70 transition-colors duration-300 hover:text-white"
                      >
                        {it.label}
                      </Link>
                    </li>
                  ) : (
                    <li key={it.label}>
                      <a
                        href={it.href}
                        className="text-[13.5px] text-white/70 transition-colors duration-300 hover:text-white"
                      >
                        {it.label}
                      </a>
                    </li>
                  ),
                )}
              </ul>
            </div>
          ))}
        </div>

        {/* Desktop layout — kept on its own grid so the mobile flow above
            can stay simple and the desktop visual is unchanged. */}
        <div className="hidden gap-10 lg:grid lg:grid-cols-12">
          {/* Brand */}
          <div className="lg:col-span-4">
            <div className="flex items-center gap-3">
              <span className="grid h-12 w-12 place-items-center rounded-full border border-white/10 bg-white/[0.04]">
                <img src={logo} alt="Madras Swastic Engineers" className="h-8 w-8 object-contain" />
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
            {/* Brand description — hover the paragraph to drop the words
                into a matter.js physics world. The wrapper carries the
                original paragraph classes (text-sm, leading-relaxed,
                text-white/60) so the resting text is pixel-identical to
                the old <p>; FallingText inherits all of them. */}
            <div className="mt-5 h-28 max-w-sm text-sm leading-relaxed text-white/60">
              <Suspense
                fallback={
                  <p>
                    A turnkey industrial engineering firm based in Chennai, delivering
                    structural, mechanical and piping work for India's energy and
                    manufacturing sectors since 2009.
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
            <div className="mt-6 flex items-center gap-2">
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

          {/* Link columns — sit to the right of brand */}
          <div className="grid grid-cols-2 gap-8 lg:col-span-7 lg:col-start-6">
            {LINKS.map((col) => (
              <div key={col.title}>
                <div className="font-mono text-[11px] tracking-[0.25em] uppercase text-gold-400">
                  {col.title}
                </div>
                <ul className="mt-4 space-y-3">
                  {col.items.map((it) =>
                    it.to ? (
                      <li key={it.label}>
                        <Link
                          to={it.to}
                          className="text-sm text-white/70 transition-colors duration-300 hover:text-white"
                        >
                          {it.label}
                        </Link>
                      </li>
                    ) : (
                      <li key={it.label}>
                        <a
                          href={it.href}
                          className="text-sm text-white/70 transition-colors duration-300 hover:text-white"
                        >
                          {it.label}
                        </a>
                      </li>
                    ),
                  )}
                </ul>
              </div>
            ))}
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

        <div className="mt-6 flex flex-col items-start justify-between gap-2 border-t border-white/10 pt-4 text-[11.5px] text-white/55 sm:mt-8 sm:flex-row sm:items-center sm:pt-5 sm:text-xs">
          <span>© {new Date().getFullYear()} Madras Swastic Engineers Pvt. Ltd.</span>
          <span>
            The work of{' '}
            <a
              href="https://github.com/Asar007"
              target="_blank"
              rel="noopener noreferrer"
              className="font-medium text-white/75 underline-offset-4 transition-colors duration-300 hover:text-gold-400 hover:underline"
            >
              Asar007
            </a>{' '}
            &amp;{' '}
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
