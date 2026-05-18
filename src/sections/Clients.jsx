import { motion } from 'framer-motion'
import SectionHeading from '../components/SectionHeading.jsx'
import MagicBento from '../components/MagicBento.jsx'

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
          className="mt-12"
        >
          <MagicBento items={CLIENTS} />
        </motion.div>
      </div>
    </section>
  )
}
