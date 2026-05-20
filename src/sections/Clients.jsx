import SectionHeading from '../components/SectionHeading.jsx'
import TicketBand3D from '../components/TicketBand3D.jsx'

export default function Clients() {
  return (
    <section id="clients" className="section-pad relative">
      <div className="mx-auto max-w-7xl px-4 sm:px-6">
        <SectionHeading
          eyebrow="Our clients"
          title="Trusted by India's industrial leaders."
          accentWord="Trusted"
          subtitle="Public-sector space agencies and private operators that depend on engineering work executed without drama."
        />

        <div className="mt-12 mb-12 sm:mb-16">
          <TicketBand3D />
        </div>
      </div>
    </section>
  )
}
