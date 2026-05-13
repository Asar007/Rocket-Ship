import ShaderBackground from './components/ShaderBackground.jsx'
import Navbar from './components/Navbar.jsx'
import Footer from './components/Footer.jsx'

import Hero from './sections/Hero.jsx'
import About from './sections/About.jsx'
import WhyChooseUs from './sections/WhyChooseUs.jsx'
import Projects from './sections/Projects.jsx'
import Clients from './sections/Clients.jsx'
import Stats from './sections/Stats.jsx'
import ContactCTA from './sections/ContactCTA.jsx'

export default function App() {
  return (
    <>
      {/* Animated shader sits as a fullscreen background layer */}
      <ShaderBackground />

      {/* Glassmorphism enclosure for the whole landing page */}
      <div className="relative z-10 mx-auto min-h-screen w-full">
        <Navbar />

        <main className="relative">
          {/* Luxe glass enclosure wraps the content while keeping the shader visible */}
          <div className="relative">
            <Hero />
            <About />
            <WhyChooseUs />
            <Projects />
            <Clients />
            <Stats />
            <ContactCTA />
          </div>
        </main>

        <Footer />
      </div>
    </>
  )
}
