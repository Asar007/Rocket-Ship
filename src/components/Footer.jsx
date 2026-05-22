import { Mail, Phone, ArrowUp } from 'lucide-react'
import { Link } from 'react-router-dom'
import logo from '../assets/logo.png'
import TextPressure from './TextPressure'

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
    <footer className="relative isolate mt-12 overflow-hidden border-t border-white/10 bg-navy-950/70 backdrop-blur-xl">
      <div className="hairline-gold absolute inset-x-0 top-0 z-30" />

      {/* MSE watermark — clipped inside the footer, sits behind all content */}
      <div
        className="pointer-events-none absolute inset-x-0 -top-[36px] z-0 flex select-none justify-center opacity-[0.10] sm:-top-[72px] sm:opacity-[0.12] lg:-top-[96px]"
        aria-hidden="true"
      >
        <div className="h-[140px] w-[86%] max-w-[820px] sm:h-[240px] sm:w-[78%] lg:h-[310px] lg:w-[75%]">
          <TextPressure
            text="MSE"
            flex={false}
            alpha={false}
            stroke={false}
            width={true}
            weight={true}
            italic={true}
            textColor="#FFFFFF"
            strokeColor="#D4AF37"
            minFontSize={48}
          />
        </div>
      </div>

      <div className="relative z-20 mx-auto max-w-7xl px-4 py-8 sm:px-6 sm:py-14">
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
            className="group inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-white/10 bg-white/[0.04] text-white/70 transition-all duration-300 hover:border-gold-400/40 hover:text-gold-400"
            aria-label="Back to top"
          >
            <ArrowUp className="h-4 w-4 transition-transform duration-300 group-hover:-translate-y-0.5" />
          </button>
        </div>

        {/* Mobile contact chips, sit just under the brand row. */}
        <div className="mt-5 flex items-center gap-2 lg:hidden">
          {[
            { Icon: Mail, label: 'Email us', href: 'mailto:md@madrasswastic.com' },
            { Icon: Phone, label: 'Call us', href: 'tel:+919884148474' },
          ].map(({ Icon, label, href }) => (
            <a
              key={label}
              href={href}
              aria-label={label}
              className="grid h-10 w-10 place-items-center rounded-full border border-white/10 bg-white/[0.04] text-white/70 transition-all duration-300 hover:border-gold-400/40 hover:text-gold-400"
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
            <p className="mt-5 max-w-sm text-sm leading-relaxed text-white/60">
              A turnkey industrial engineering firm based in Chennai, delivering structural,
              mechanical and piping work for India's energy and manufacturing sectors since 2009.
            </p>
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

        <div className="mt-6 border-t border-white/10 pt-4 text-[11px] text-white/50 sm:mt-12 sm:pt-6 sm:text-xs">
          © {new Date().getFullYear()} Madras Swastic Engineers Pvt. Ltd.
        </div>
      </div>
    </footer>
  )
}
