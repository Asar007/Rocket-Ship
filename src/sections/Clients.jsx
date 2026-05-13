import SectionHeading from '../components/SectionHeading.jsx'

const CLIENTS = [
  'CPCL · Chennai',
  'NTPC',
  'L&T Construction',
  'Hyundai India',
  'GMR Energy',
  'Reliance Industries',
  'IOCL',
  'HPCL',
  'Adani Power',
  'BHEL',
  'Tata Steel',
  'Saint-Gobain',
]

function ClientPill({ name }) {
  return (
    <li className="group mx-3 flex shrink-0 items-center gap-3 rounded-full border border-white/10 bg-white/[0.03] px-5 py-3 backdrop-blur transition-colors duration-300 hover:border-gold-400/30 hover:bg-white/[0.06]">
      <span className="h-1.5 w-1.5 rounded-full bg-gold-400/80 transition-transform duration-300 group-hover:scale-150" />
      <span className="font-display text-sm font-medium text-white/85">{name}</span>
    </li>
  )
}

export default function Clients() {
  return (
    <section id="clients" className="section-pad relative">
      <div className="mx-auto max-w-7xl px-4 sm:px-6">
        <SectionHeading
          eyebrow="Our clients"
          title="Trusted by India's industrial leaders."
          accentWord="Trusted"
          subtitle="Public-sector and private operators that depend on engineering work executed without drama."
        />

        {/* Marquee */}
        <div className="mt-12 overflow-hidden rounded-3xl border border-white/10 bg-white/[0.03] py-6 backdrop-blur-xl marquee-mask">
          <ul className="flex animate-marquee whitespace-nowrap">
            {[...CLIENTS, ...CLIENTS].map((c, i) => (
              <ClientPill key={`${c}-${i}`} name={c} />
            ))}
          </ul>
        </div>

        {/* Second row, reverse direction */}
        <div className="mt-4 overflow-hidden rounded-3xl border border-white/10 bg-white/[0.02] py-6 backdrop-blur-xl marquee-mask">
          <ul
            className="flex animate-marquee whitespace-nowrap"
            style={{ animationDirection: 'reverse', animationDuration: '50s' }}
          >
            {[...CLIENTS.slice().reverse(), ...CLIENTS.slice().reverse()].map((c, i) => (
              <ClientPill key={`r-${c}-${i}`} name={c} />
            ))}
          </ul>
        </div>
      </div>
    </section>
  )
}
