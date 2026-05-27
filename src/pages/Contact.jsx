import Seo from '../lib/seo.jsx'
import ContactCTA from '../sections/ContactCTA.jsx'

export function Component() {
  return (
    <div className="pt-24 sm:pt-28">
      <Seo
        title="Contact: Request a Heavy Fabrication Quote"
        description="Send drawings or an RFQ for heavy fabrication, structural or turnkey work. Senior engineer assigned within a working day. India and export enquiries welcome. md@madrasswastic.com · +91 98841 48474."
        path="/contact"
      />
      <ContactCTA />
    </div>
  )
}
