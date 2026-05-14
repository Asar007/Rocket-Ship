import Navbar from './components/Navbar.jsx'
import Footer from './components/Footer.jsx'
import CallbackDialog from './components/CallbackDialog.jsx'

import Hero from './sections/Hero.jsx'
import About from './sections/About.jsx'
import WhyChooseUs from './sections/WhyChooseUs.jsx'
import Customization from './sections/Customization.jsx'
import Projects from './sections/Projects.jsx'
import Clients from './sections/Clients.jsx'
import Stats from './sections/Stats.jsx'
import ContactCTA from './sections/ContactCTA.jsx'

export default function App() {
  return (
    <div className="relative min-h-screen w-full bg-navy-950">
      <Navbar />

      <main className="relative">
        <Hero />
        <About />
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
