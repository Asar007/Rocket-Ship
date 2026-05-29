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

  // Lock body scroll while the mobile sheet is open so background content
  // doesn't slide under the user's thumb on small phones.
  useEffect(() => {
    if (!open) return
    const prev = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    const onKey = (e) => {
      if (e.key === 'Escape') setOpen(false)
    }
    window.addEventListener('keydown', onKey)
    return () => {
      document.body.style.overflow = prev
      window.removeEventListener('keydown', onKey)
    }
  }, [open])

  const closeMenu = () => setOpen(false)

  return (
    <motion.header
      initial={{ y: -28, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.7, ease: [0.2, 0.7, 0.2, 1] }}
      className="fixed inset-x-0 top-0 z-50 flex justify-center px-3 pt-3 sm:px-6 sm:pt-5"
      style={{
        paddingTop: 'max(0.75rem, env(safe-area-inset-top))',
        paddingLeft: 'max(0.75rem, env(safe-area-inset-left))',
        paddingRight: 'max(0.75rem, env(safe-area-inset-right))',
      }}
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
            aria-label={open ? 'Close menu' : 'Open menu'}
            aria-expanded={open}
            aria-controls="mobile-nav-sheet"
            className="grid h-11 w-11 shrink-0 place-items-center rounded-full border border-white/10 bg-white/[0.04] text-white/90 backdrop-blur transition-colors hover:bg-white/[0.08] active:bg-white/[0.12] lg:hidden"
          >
            {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>
      </nav>

      {/* Mobile sheet */}
      <AnimatePresence>
        {open && (
          <>
            {/* Tap-anywhere backdrop closes the menu on mobile. */}
            <motion.button
              type="button"
              aria-label="Close menu"
              onClick={closeMenu}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="fixed inset-0 -z-10 bg-navy-950/40 backdrop-blur-sm lg:hidden"
            />
            <motion.div
              id="mobile-nav-sheet"
              role="dialog"
              aria-modal="true"
              aria-label="Site navigation"
              initial={{ opacity: 0, y: -12, scale: 0.98 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -12, scale: 0.98 }}
              transition={{ duration: 0.28, ease: [0.2, 0.7, 0.2, 1] }}
              className="absolute left-3 right-3 top-[72px] max-h-[calc(100svh-96px)] overflow-y-auto rounded-3xl border border-white/10 bg-navy-950/90 p-4 backdrop-blur-2xl shadow-[0_30px_80px_-20px_rgba(0,0,0,0.8)] lg:hidden"
              style={{
                paddingBottom: 'max(1rem, env(safe-area-inset-bottom))',
              }}
            >
              <ul className="flex flex-col gap-1">
                {NAV_ITEMS.map((item, idx) => (
                  <motion.li
                    key={item.to}
                    initial={{ opacity: 0, x: -8 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.04 + idx * 0.04, duration: 0.25 }}
                  >
                    <NavLink
                      to={item.to}
                      end={item.to === '/'}
                      onClick={closeMenu}
                      className={({ isActive }) =>
                        `flex min-h-[52px] items-center justify-between rounded-2xl border px-4 py-3 font-display text-base text-white/85 transition-colors ${
                          isActive
                            ? 'border-gold-400/30 bg-gold-400/10 text-white'
                            : 'border-transparent hover:border-white/10 hover:bg-white/[0.04] active:bg-white/[0.08]'
                        }`
                      }
                    >
                      <span>{item.label}</span>
                      <ArrowUpRight className="h-4 w-4 text-gold-400" />
                    </NavLink>
                  </motion.li>
                ))}
              </ul>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </motion.header>
  )
}
