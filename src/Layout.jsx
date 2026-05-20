import { useEffect } from 'react'
import { Outlet, useLocation } from 'react-router-dom'
import Navbar from './components/Navbar.jsx'
import Footer from './components/Footer.jsx'
import CallbackDialog from './components/CallbackDialog.jsx'
import ScrollProgress from './components/ScrollProgress.jsx'

function ScrollToTop() {
  const { pathname } = useLocation()
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'instant' in window ? 'instant' : 'auto' })
  }, [pathname])
  return null
}

export default function Layout() {
  return (
    <div className="relative min-h-screen w-full bg-navy-950">
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
