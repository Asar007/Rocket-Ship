import Seo from '../lib/seo.jsx'
import ContactCTA from '../sections/ContactCTA.jsx'

export function Component() {
  return (
    <div className="pt-24 sm:pt-28">
      <Seo
        title="Contact Us"
        description="Tell us about your site, drawings or RFQ. We'll respond within a working day with a senior engineer assigned. md@madrasswastic.com · +91 98841 48474."
        path="/contact"
      />
      <ContactCTA />
    </div>
  )
}
