import { useEffect, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Menu, X, ArrowUpRight } from 'lucide-react'
import logo from '../assets/logo.png'
import { openCallback } from './CallbackDialog.jsx'

const NAV_ITEMS = [
  { label: 'Home', href: '#home' },
  { label: 'About us', href: '#about' },
  { label: 'Our Projects', href: '#projects' },
  { label: 'Customization', href: '#customization' },
  { label: 'Contact us', href: '#contact' },
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

  const onNavClick = (e, href) => {
    if (href === '#contact') {
      e.preventDefault()
      setOpen(false)
      openCallback()
      return
    }
    const target = document.querySelector(href)
    if (target) {
      e.preventDefault()
      target.scrollIntoView({ behavior: 'smooth', block: 'start' })
      setOpen(false)
    }
  }

  const onContactClick = (e) => {
    e.preventDefault()
    setOpen(false)
    openCallback()
  }

  return (
    <motion.header
      initial={{ y: -28, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.7, ease: [0.2, 0.7, 0.2, 1] }}
      className="fixed inset-x-0 top-0 z-50 flex justify-center px-3 pt-3 sm:px-6 sm:pt-5"
    >
      <nav
        className={`liquid-glass liquid-glass-pill flex w-full max-w-7xl items-center justify-between px-3 py-2 transition-all duration-500 sm:px-4 ${
          scrolled
            ? 'shadow-[0_20px_60px_-20px_rgba(0,0,0,0.7)]'
            : ''
        }`}
      >
        {/* Logo */}
        <a
          href="#home"
          onClick={(e) => onNavClick(e, '#home')}
          className="group flex items-center gap-3 rounded-full pl-1 pr-3 py-1"
        >
          <span className="relative grid h-10 w-10 place-items-center overflow-hidden rounded-full border border-white/15 bg-navy-950/60 ring-1 ring-inset ring-white/5">
            <img
              src={logo}
              alt="Madras Swastic Engineers"
              className="h-7 w-7 object-contain drop-shadow-[0_0_8px_rgba(240,198,116,0.35)]"
            />
            <span className="absolute inset-0 bg-[radial-gradient(circle_at_50%_30%,rgba(240,198,116,0.35),transparent_60%)] opacity-0 transition-opacity duration-500 group-hover:opacity-100" />
          </span>
          <span className="hidden flex-col leading-tight sm:flex">
            <span className="font-display text-[13px] font-semibold tracking-[0.16em] text-white">
              MADRAS SWASTIC
            </span>
            <span className="font-mono text-[10px] tracking-[0.32em] text-gold-400">
              ENGINEERS
            </span>
          </span>
        </a>

        {/* Center links */}
        <ul className="hidden items-center gap-1 lg:flex">
          {NAV_ITEMS.map((item) => (
            <li key={item.href}>
              <a
                href={item.href}
                onClick={(e) => onNavClick(e, item.href)}
                className="group relative inline-flex items-center rounded-full px-4 py-2 font-display text-[13px] font-medium tracking-wide text-white/75 transition-colors hover:text-white"
              >
                <span>{item.label}</span>
                <span className="pointer-events-none absolute inset-x-4 -bottom-px h-px scale-x-0 bg-gradient-to-r from-transparent via-gold-400 to-transparent transition-transform duration-500 group-hover:scale-x-100" />
              </a>
            </li>
          ))}
        </ul>

        {/* CTA + mobile toggle */}
        <div className="flex items-center gap-2">
          <a
            href="#contact"
            onClick={onContactClick}
            className="group relative hidden overflow-hidden rounded-full pl-4 pr-3 py-2 font-display text-[13px] font-semibold text-navy-950 sm:inline-flex items-center gap-2 bg-gradient-to-br from-gold-400 via-gold-500 to-gold-600 shadow-glow-gold liquid-glass liquid-glass-pill"
          >
            <span>Get Consultation</span>
            <ArrowUpRight className="h-4 w-4 transition-transform duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
            <span className="pointer-events-none absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-white/40 to-transparent transition-transform duration-700 group-hover:translate-x-full" />
          </a>

          <button
            onClick={() => setOpen((v) => !v)}
            aria-label="Toggle menu"
            className="grid h-10 w-10 place-items-center rounded-full border border-white/10 bg-white/[0.04] text-white/90 backdrop-blur lg:hidden"
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
                <li key={item.href}>
                  <a
                    href={item.href}
                    onClick={(e) => onNavClick(e, item.href)}
                    className="flex items-center justify-between rounded-2xl border border-transparent px-4 py-3 font-display text-base text-white/85 hover:border-white/10 hover:bg-white/[0.04]"
                  >
                    <span>{item.label}</span>
                    <ArrowUpRight className="h-4 w-4 text-gold-400" />
                  </a>
                </li>
              ))}
            </ul>
            <a
              href="#contact"
              onClick={onContactClick}
              className="btn-primary mt-3 w-full justify-center"
            >
              Get Consultation
              <ArrowUpRight className="h-4 w-4" />
            </a>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.header>
  )
}
