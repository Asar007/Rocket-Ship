import Seo from '../lib/seo.jsx'
import Hero from '../sections/Hero.jsx'
import About from '../sections/About.jsx'
import WhyChooseUs from '../sections/WhyChooseUs.jsx'
import Stats from '../sections/Stats.jsx'
import Clients from '../sections/Clients.jsx'
import ContactCTA from '../sections/ContactCTA.jsx'

// Hybrid: a full long-scroll narrative for first-time visitors, while
// /about /projects /customization /contact remain focused, indexable,
// shareable deep pages. AboutVideo + Projects + Customization stay
// exclusive to their own pages to keep Home lighter and limit
// duplicate content.
export function Component() {
  return (
    <>
      <Seo
        title="Engineering Precision for Space & Industry"
        description="Madras Swastic Engineers fabricates anything from the smallest precision connection to complete space-capsule and rocket-test systems for ISRO, plus turnkey plants for the paper, sugar and petrochemical industries across India."
        path="/"
      />
      <Hero />
      <About />
      <WhyChooseUs />
      <Stats />
      <Clients />
      <ContactCTA />
    </>
  )
}
