import Seo from '../lib/seo.jsx'
import Hero from '../sections/Hero.jsx'
import Stats from '../sections/Stats.jsx'
import Clients from '../sections/Clients.jsx'

export function Component() {
  return (
    <>
      <Seo
        title="Engineering Precision for Modern Infrastructure"
        description="Madras Swastic Engineers — turnkey industrial engineering: structural fabrication, plant erection, and precision mechanical solutions across India. Fabrication partner on ISRO's Gaganyaan programme."
        path="/"
      />
      <Hero />
      <Stats />
      <Clients />
    </>
  )
}
