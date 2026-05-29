import Seo from '../lib/seo.jsx'
import About from '../sections/About.jsx'
import AboutHero from '../sections/AboutHero.jsx'
import AboutJourney from '../sections/AboutJourney.jsx'
import AboutMetrics from '../sections/AboutMetrics.jsx'
import WhyChooseUs from '../sections/WhyChooseUs.jsx'
import StoryVideo from '../components/StoryVideo.jsx'

export function Component() {
  return (
    <div className="pt-24 sm:pt-28">
      <Seo
        title="About: Heavy Fabrication Company in Chennai"
        description="Founded 2009 in Chennai. ISRO Gaganyaan partner. Heavy and precision metal fabrication, structural assemblies and turnkey plants delivered across India and export markets."
        path="/about"
      />
      <AboutHero />
      <section className="section-pad relative">
        <div className="mx-auto max-w-7xl px-4 sm:px-6">
          <StoryVideo
            title="Inside the Madras Swastic shop floor."
            meta="2:33 · Gaganyaan crew module"
          />
        </div>
      </section>
      <AboutJourney />
      <AboutMetrics />
      <About />
      <WhyChooseUs />
    </div>
  )
}
