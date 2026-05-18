import { motion } from 'framer-motion'
import SectionHeading from '../components/SectionHeading.jsx'

import isro from '../assets/clients/isro.jpg'
import nsil from '../assets/clients/nsil.jpg'
import ursc from '../assets/clients/ursc.jpg'
import lpsc from '../assets/clients/lpsc.jpg'
import hsfc from '../assets/clients/hsfc.jpg'
import hvf from '../assets/clients/hvf.jpg'
import jkPaper from '../assets/clients/jk-paper.jpg'
import manali from '../assets/clients/manali.jpg'
import schwing from '../assets/clients/schwing.jpg'
import tancem from '../assets/clients/tancem.jpg'
import tpl from '../assets/clients/tpl.jpg'
import tagros from '../assets/clients/tagros.jpg'

const CLIENTS = [
  { name: 'ISRO', logo: isro },
  { name: 'NewSpace India Limited', logo: nsil },
  { name: 'U R Rao Satellite Centre', logo: ursc },
  { name: 'LPSC · ISRO', logo: lpsc },
  { name: 'Human Space Flight Centre', logo: hsfc },
  { name: 'Heavy Vehicles Factory', logo: hvf },
  { name: 'JK Paper', logo: jkPaper },
  { name: 'Manali Petrochemicals', logo: manali },
  { name: 'Schwing Stetter', logo: schwing },
  { name: 'TANCEM', logo: tancem },
  { name: 'Tamilnadu Petroproducts', logo: tpl },
  { name: 'Tagros Chemicals', logo: tagros },
]

// Each row carries ALL 12 unique logos so the loop-clone needed for a
// seamless marquee stays off-screen — you never see a logo twice at once.
// Row B is rotated 6 places so the two rows never line up.
const ROW_A = CLIENTS
const ROW_B = [...CLIENTS.slice(6), ...CLIENTS.slice(0, 6)]

function LogoChip({ name, logo }) {
  return (
    <li className="mx-3 flex shrink-0 items-center">
      <div className="group h-24 w-24 overflow-hidden rounded-2xl border border-white/10 bg-white shadow-inner-glow transition-all duration-500 hover:-translate-y-1 hover:border-gold-400/40 hover:shadow-glow-gold sm:h-28 sm:w-28">
        <img
          src={logo}
          alt={name}
          loading="lazy"
          draggable="false"
          className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
        />
      </div>
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
          subtitle="Public-sector space agencies and private operators that depend on engineering work executed without drama."
        />

        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-80px' }}
          transition={{ duration: 0.7, ease: [0.2, 0.7, 0.2, 1] }}
          className="mt-12 space-y-4"
        >
          {/* Row 1 — first half (unique set) */}
          <div className="group/marquee overflow-hidden rounded-3xl border border-white/10 bg-white/[0.03] py-6 backdrop-blur-xl marquee-mask">
            <ul className="flex animate-marquee whitespace-nowrap group-hover/marquee:[animation-play-state:paused]">
              {[...ROW_A, ...ROW_A].map((c, i) => (
                <LogoChip key={`a-${c.name}-${i}`} {...c} />
              ))}
            </ul>
          </div>

          {/* Row 2 — second half (unique set), reverse direction */}
          <div className="group/marquee overflow-hidden rounded-3xl border border-white/10 bg-white/[0.02] py-6 backdrop-blur-xl marquee-mask">
            <ul
              className="flex animate-marquee whitespace-nowrap group-hover/marquee:[animation-play-state:paused]"
              style={{ animationDirection: 'reverse', animationDuration: '55s' }}
            >
              {[...ROW_B, ...ROW_B].map((c, i) => (
                <LogoChip key={`b-${c.name}-${i}`} {...c} />
              ))}
            </ul>
          </div>
        </motion.div>
      </div>
    </section>
  )
}
