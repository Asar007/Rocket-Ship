import { Linkedin, Mail, Phone, Instagram, Youtube, ArrowUp } from 'lucide-react'
import { Link } from 'react-router-dom'
import logo from '../assets/logo.png'

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
    title: 'Capabilities',
    items: [
      { label: 'Structural fabrication', to: '/projects' },
      { label: 'Mechanical erection', to: '/projects' },
      { label: 'Piping & skid', to: '/customization' },
      { label: 'Turnkey delivery', to: '/about' },
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
    <footer className="relative mt-12 border-t border-white/10 bg-navy-950/70 backdrop-blur-xl">
      <div className="hairline-gold absolute inset-x-0 top-0" />

      <div className="mx-auto max-w-7xl px-4 py-14 sm:px-6">
        <div className="grid grid-cols-1 gap-10 lg:grid-cols-12">
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
              A turnkey industrial engineering firm based in Chennai — delivering structural,
              mechanical and piping work for India's energy and manufacturing sectors since 1998.
            </p>

            <div className="mt-6 flex items-center gap-2">
              {[Linkedin, Instagram, Youtube, Mail, Phone].map((Icon, i) => (
                <Link
                  key={i}
                  to="/contact"
                  className="grid h-9 w-9 place-items-center rounded-full border border-white/10 bg-white/[0.04] text-white/70 transition-all duration-300 hover:border-gold-400/40 hover:text-gold-400"
                >
                  <Icon className="h-4 w-4" />
                </Link>
              ))}
            </div>
          </div>

          {/* Link columns */}
          <div className="grid grid-cols-2 gap-8 sm:grid-cols-3 lg:col-span-7 lg:col-start-6">
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

          {/* Back to top */}
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

        <div className="mt-12 flex flex-col items-start justify-between gap-4 border-t border-white/10 pt-6 text-xs text-white/50 sm:flex-row sm:items-center">
          <div>© {new Date().getFullYear()} Madras Swastic Engineers Pvt. Ltd. All rights reserved.</div>
          <div className="flex items-center gap-5">
            <a href="#" className="hover:text-white">
              Privacy
            </a>
            <a href="#" className="hover:text-white">
              Terms
            </a>
            <a href="#" className="hover:text-white">
              Sitemap
            </a>
          </div>
        </div>
      </div>
    </footer>
  )
}
