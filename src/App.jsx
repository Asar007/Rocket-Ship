import { lazy, Suspense } from 'react'
import ShaderBackground from './components/ShaderBackground.jsx'
import Navbar from './components/Navbar.jsx'
import Hero from './sections/Hero.jsx'

// Below-the-fold — defer to keep the initial bundle small and TTI fast.
const About = lazy(() => import('./sections/About.jsx'))
const WhyChooseUs = lazy(() => import('./sections/WhyChooseUs.jsx'))
const Projects = lazy(() => import('./sections/Projects.jsx'))
const Clients = lazy(() => import('./sections/Clients.jsx'))
const Stats = lazy(() => import('./sections/Stats.jsx'))
const ContactCTA = lazy(() => import('./sections/ContactCTA.jsx'))
const Footer = lazy(() => import('./components/Footer.jsx'))

// Reserve vertical space so deferred sections don't cause CLS as they hydrate.
function SectionPlaceholder({ minHeight = '70vh' }) {
  return <div aria-hidden="true" style={{ minHeight }} />
}

export default function App() {
  return (
    <>
      <ShaderBackground />

      <div className="relative z-10 mx-auto min-h-screen w-full">
        <Navbar />

        <main id="main" className="relative">
          <div className="relative">
            <Hero />
            <Suspense fallback={<SectionPlaceholder />}>
              <About />
              <WhyChooseUs />
              <Projects />
              <Clients />
              <Stats />
              <ContactCTA />
            </Suspense>
          </div>
        </main>

        <Suspense fallback={<SectionPlaceholder minHeight="40vh" />}>
          <Footer />
        </Suspense>
      </div>
    </>
  )
}
