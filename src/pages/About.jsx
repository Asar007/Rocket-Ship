import Seo from '../lib/seo.jsx'
import About from '../sections/About.jsx'
import AboutVideo from '../sections/AboutVideo.jsx'
import WhyChooseUs from '../sections/WhyChooseUs.jsx'

export function Component() {
  return (
    <div className="pt-24 sm:pt-28">
      <Seo
        title="About Us"
        description="27 years of turnkey industrial engineering, structural fabrication, plant erection and precision mechanical work, and a fabrication partner on ISRO's Gaganyaan crew module programme."
        path="/about"
      />
      <About />
      <AboutVideo />
      <WhyChooseUs />
    </div>
  )
}
