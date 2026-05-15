import { Suspense, lazy, useEffect, useState } from 'react'

import Navbar from './components/Navbar.jsx'
import Footer from './components/Footer.jsx'
import CallbackDialog from './components/CallbackDialog.jsx'

// Heavy three.js scene — split into its own async chunk so it never
// blocks the initial bundle / first paint.
const SpaceScene = lazy(() => import('./components/SpaceScene.jsx'))

import Hero from './sections/Hero.jsx'
import About from './sections/About.jsx'
import AboutVideo from './sections/AboutVideo.jsx'
import WhyChooseUs from './sections/WhyChooseUs.jsx'
import Customization from './sections/Customization.jsx'
import Projects from './sections/Projects.jsx'
import Clients from './sections/Clients.jsx'
import Stats from './sections/Stats.jsx'
import ContactCTA from './sections/ContactCTA.jsx'

function useHashRoute() {
  const [hash, setHash] = useState(() =>
    typeof window === 'undefined' ? '' : window.location.hash,
  )
  useEffect(() => {
    const onChange = () => setHash(window.location.hash)
    window.addEventListener('hashchange', onChange)
    return () => window.removeEventListener('hashchange', onChange)
  }, [])
  return hash
}

export default function App() {
  const hash = useHashRoute()

  if (hash === '#space') {
    return (
      <div style={{ width: '100vw', height: '100vh', background: '#000' }}>
        <Suspense fallback={null}>
          <SpaceScene />
        </Suspense>
      </div>
    )
  }

  return (
    <div className="relative min-h-screen w-full bg-navy-950">
      <Navbar />

      <main className="relative">
        <Hero />
        <About />
        <AboutVideo />
        <WhyChooseUs />
        <Customization />
        <Projects />
        <Clients />
        <Stats />
        <ContactCTA />
      </main>

      <Footer />
      <CallbackDialog />
    </div>
  )
}
