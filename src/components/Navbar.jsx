import { useEffect, useState } from 'react'
import { Link, NavLink } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { Menu, X, ArrowUpRight } from 'lucide-react'
import logo from '../assets/logo.png'

const NAV_ITEMS = [
  { label: 'Home', to: '/' },
  { label: 'About us', to: '/about' },
  { label: 'Our Projects', to: '/projects' },
  { label: 'Customization', to: '/customization' },
  { label: 'Contact us', to: '/contact' },
]

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false)
  const [open, setOpen] = useState(false)

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 16)
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  const closeMenu = () => setOpen(false)

  return (
    <motion.header
      initial={{ y: -28, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.7, ease: [0.2, 0.7, 0.2, 1] }}
      className="fixed inset-x-0 top-0 z-50 flex justify-center px-3 pt-3 sm:px-6 sm:pt-5"
    >
      <nav
        className={`flex w-full min-w-0 max-w-[min(100%,80rem)] items-center justify-between rounded-full border px-3 py-2 transition-all duration-500 sm:px-4 ${
          scrolled
            ? 'border-white/10 bg-navy-950/70 shadow-[0_20px_60px_-20px_rgba(0,0,0,0.7)] backdrop-blur-xl'
            : 'border-white/5 bg-white/[0.04] backdrop-blur-md'
        }`}
      >
        {/* Logo */}
        <Link
          to="/"
          onClick={closeMenu}
          className="group flex min-w-0 shrink items-center gap-3 rounded-full pl-1 pr-2 py-1 sm:pr-3"
        >
          <span className="relative grid h-10 w-10 shrink-0 place-items-center overflow-hidden rounded-full border border-white/15 bg-navy-950/60 ring-1 ring-inset ring-white/5 sm:h-12 sm:w-12 lg:h-14 lg:w-14">
            <img
              src={logo}
              alt="Madras Swastic Engineers"
              className="h-7 w-7 object-contain drop-shadow-[0_0_10px_rgba(240,198,116,0.4)] sm:h-9 sm:w-9 lg:h-11 lg:w-11"
            />
            <span className="absolute inset-0 bg-[radial-gradient(circle_at_50%_30%,rgba(240,198,116,0.35),transparent_60%)] opacity-0 transition-opacity duration-500 group-hover:opacity-100" />
          </span>
          {/* Wordmark — desktop only. Hiding below lg keeps the pill compact
              on every phone (portrait + landscape) and on tablets, so it
              never overflows the viewport. */}
          <span className="hidden min-w-0 flex-col leading-tight lg:flex">
            <span className="truncate font-display text-[13px] font-semibold tracking-[0.16em] text-white">
              MADRAS SWASTIC
            </span>
            <span className="truncate font-mono text-[10px] tracking-[0.32em] text-gold-400">
              ENGINEERS
            </span>
          </span>
        </Link>

        {/* Center links */}
        <ul className="hidden items-center gap-1 lg:flex">
          {NAV_ITEMS.map((item) => (
            <li key={item.to}>
              <NavLink
                to={item.to}
                end={item.to === '/'}
                onClick={closeMenu}
                className={({ isActive }) =>
                  `group relative inline-flex items-center rounded-full px-4 py-2 font-display text-[16px] font-medium tracking-wide transition-colors ${
                    isActive ? 'text-white' : 'text-white/75 hover:text-white'
                  }`
                }
              >
                {({ isActive }) => (
                  <>
                    <span>{item.label}</span>
                    <span
                      className={`pointer-events-none absolute inset-x-4 -bottom-px h-px bg-gradient-to-r from-transparent via-gold-400 to-transparent transition-transform duration-500 ${
                        isActive
                          ? 'scale-x-100'
                          : 'scale-x-0 group-hover:scale-x-100'
                      }`}
                    />
                  </>
                )}
              </NavLink>
            </li>
          ))}
        </ul>

        {/* CTA + mobile toggle */}
        <div className="flex shrink-0 items-center gap-2">
          <button
            onClick={() => setOpen((v) => !v)}
            aria-label="Toggle menu"
            className="grid h-10 w-10 shrink-0 place-items-center rounded-full border border-white/10 bg-white/[0.04] text-white/90 backdrop-blur lg:hidden"
          >
            {open ? <X className="h-4 w-4" /> : <Menu className="h-4 w-4" />}
          </button>
        </div>
      </nav>

      {/* Mobile sheet */}
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: -12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -12 }}
            transition={{ duration: 0.25 }}
            className="absolute left-3 right-3 top-[72px] rounded-3xl border border-white/10 bg-navy-950/85 p-5 backdrop-blur-2xl lg:hidden"
          >
            <ul className="flex flex-col gap-1">
              {NAV_ITEMS.map((item) => (
                <li key={item.to}>
                  <NavLink
                    to={item.to}
                    end={item.to === '/'}
                    onClick={closeMenu}
                    className="flex items-center justify-between rounded-2xl border border-transparent px-4 py-3 font-display text-base text-white/85 hover:border-white/10 hover:bg-white/[0.04]"
                  >
                    <span>{item.label}</span>
                    <ArrowUpRight className="h-4 w-4 text-gold-400" />
                  </NavLink>
                </li>
              ))}
            </ul>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.header>
  )
}
