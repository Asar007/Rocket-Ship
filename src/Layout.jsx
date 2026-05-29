import { useEffect, useLayoutEffect } from 'react'
import { Outlet, useLocation, useNavigationType } from 'react-router-dom'
import Navbar from './components/Navbar.jsx'
import Footer from './components/Footer.jsx'
import CallbackDialog from './components/CallbackDialog.jsx'
import ScrollProgress from './components/ScrollProgress.jsx'

// useLayoutEffect on the client, useEffect during SSR (no DOM).
const useIsoLayoutEffect =
  typeof window !== 'undefined' ? useLayoutEffect : useEffect

function scrollEverythingToTop() {
  // The mobile menu can leave `body { overflow: hidden }` set as an
  // inline style for a tick after the route changes — that suppresses
  // programmatic scroll in some browsers. Clear it before scrolling.
  if (document.body.style.overflow === 'hidden') {
    document.body.style.overflow = ''
  }
  // Different browsers expose the scroll container differently —
  // sometimes it's the documentElement (html), sometimes body, sometimes
  // window. The body + html `max-width: 100vw; overflow-x: hidden` rules
  // we use can promote body to the scroll container in WebKit, so hit
  // all three to be safe.
  try { window.scrollTo(0, 0) } catch {}
  try { document.documentElement.scrollTop = 0 } catch {}
  try { document.body.scrollTop = 0 } catch {}
}

function ScrollToTop() {
  const { pathname } = useLocation()
  const navType = useNavigationType()

  // Disable the browser's automatic scroll restoration once. Without this,
  // browsers (especially Chrome) restore the previous scroll Y on every
  // history navigation right after our scrollTo, undoing the reset.
  useEffect(() => {
    if ('scrollRestoration' in window.history) {
      window.history.scrollRestoration = 'manual'
    }
  }, [])

  useIsoLayoutEffect(() => {
    // POP navigations are back/forward — let the browser restore position
    // there. For PUSH / REPLACE (link clicks), force the top.
    if (navType === 'POP') return

    // The global `html { scroll-behavior: smooth }` rule would animate this
    // jump if we let it inherit. Temporarily turn it off, fire the scroll,
    // then restore.
    const html = document.documentElement
    const prev = html.style.scrollBehavior
    html.style.scrollBehavior = 'auto'

    scrollEverythingToTop()

    // Lazy-loaded route chunks resolve after this effect runs — the new
    // page mounts and React Router can shift focus / layout. Fire one
    // more reset on the next two frames to outlast the chunk landing.
    const raf1 = requestAnimationFrame(() => {
      scrollEverythingToTop()
      const raf2 = requestAnimationFrame(() => {
        scrollEverythingToTop()
        html.style.scrollBehavior = prev
      })
      // Save the second handle on the first so the cleanup can cancel it.
      ScrollToTop._raf2 = raf2
    })

    return () => {
      cancelAnimationFrame(raf1)
      if (ScrollToTop._raf2) cancelAnimationFrame(ScrollToTop._raf2)
      html.style.scrollBehavior = prev
    }
  }, [pathname, navType])

  return null
}

export default function Layout() {
  return (
    <div className="relative min-h-svh w-full bg-navy-950">
      <ScrollToTop />
      <ScrollProgress />
      <Navbar />
      <main className="relative">
        <Outlet />
      </main>
      <Footer />
      <CallbackDialog />
    </div>
  )
}
