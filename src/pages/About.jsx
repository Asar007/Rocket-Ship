import Seo from '../lib/seo.jsx'
import About from '../sections/About.jsx'
import AboutHero from '../sections/AboutHero.jsx'
import AboutJourney from '../sections/AboutJourney.jsx'
import AboutMetrics from '../sections/AboutMetrics.jsx'
import WhyChooseUs from '../sections/WhyChooseUs.jsx'

export function Component() {
  return (
    <div className="pt-24 sm:pt-28">
      <Seo
        title="About Us"
        description="Madras Swastic Engineers — a turnkey industrial engineering firm in Chennai since 2009. Fabrication partner on ISRO's Gaganyaan crew-module programme, with delivery across paper, sugar and petrochemical sectors."
        path="/about"
      />
      <AboutHero />
      <AboutJourney />
      <AboutMetrics />
      <About />
      <WhyChooseUs />
    </div>
  )
}
