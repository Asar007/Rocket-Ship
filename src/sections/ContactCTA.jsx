import { motion } from 'framer-motion'
import { ArrowUpRight, Mail, Phone, MapPin } from 'lucide-react'

export default function ContactCTA() {
  return (
    <section id="contact" className="section-pad relative">
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-80px' }}
          transition={{ duration: 0.8, ease: [0.2, 0.7, 0.2, 1] }}
          className="glass-strong relative overflow-hidden rounded-[32px] px-6 py-14 text-center sm:px-12 sm:py-20"
        >
          {/* Background ambient */}
          <div className="absolute -left-20 -top-20 h-60 w-60 rounded-full bg-electric-500/30 blur-3xl" />
          <div className="absolute -right-20 -bottom-20 h-60 w-60 rounded-full bg-gold-500/30 blur-3xl" />
          <div className="absolute inset-0 bg-grid opacity-30" />

          {/* Concentric rings */}
          <div className="pointer-events-none absolute left-1/2 top-1/2 hidden -translate-x-1/2 -translate-y-1/2 sm:block">
            <div className="absolute h-[420px] w-[420px] -translate-x-1/2 -translate-y-1/2 rounded-full border border-white/[0.06]" />
            <div className="absolute h-[560px] w-[560px] -translate-x-1/2 -translate-y-1/2 rounded-full border border-white/[0.04]" />
            <div className="absolute h-[720px] w-[720px] -translate-x-1/2 -translate-y-1/2 rounded-full border border-white/[0.03]" />
          </div>

          <div className="relative">
            <div className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/[0.04] px-3 py-1.5 backdrop-blur">
              <span className="h-1.5 w-1.5 rounded-full bg-gold-400" />
              <span className="eyebrow">Open for 2026 projects</span>
            </div>

            <h2 className="mx-auto mt-6 max-w-3xl font-display text-3xl font-semibold leading-[1.05] tracking-tight text-white sm:text-5xl md:text-6xl">
              Let's Build Something{' '}
              <span className="bg-gradient-to-br from-gold-400 via-gold-500 to-gold-600 bg-clip-text text-transparent">
                Great
              </span>{' '}
              Together.
            </h2>
            <p className="mx-auto mt-5 max-w-xl text-base leading-relaxed text-white/70 sm:text-lg">
              Tell us about your site, drawings or RFQ. We'll respond inside 24 hours with a senior
              engineer assigned to your conversation.
            </p>

            <div className="mt-9 flex flex-wrap items-center justify-center gap-3">
              <a href="mailto:projects@madrasswastic.com" className="btn-primary group">
                Start a Conversation
                <ArrowUpRight className="h-4 w-4 transition-transform duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
              </a>
              <a href="tel:+914400000000" className="btn-ghost">
                <Phone className="h-4 w-4 text-gold-400" />
                +91 44 0000 0000
              </a>
            </div>

            {/* Contact strip */}
            <div className="mt-12 grid grid-cols-1 gap-px overflow-hidden rounded-2xl border border-white/10 bg-white/[0.02] sm:grid-cols-3">
              {[
                {
                  icon: Mail,
                  label: 'Email us',
                  value: 'projects@madrasswastic.com',
                },
                {
                  icon: Phone,
                  label: 'Call directly',
                  value: '+91 44 0000 0000',
                },
                {
                  icon: MapPin,
                  label: 'Head office',
                  value: 'Sriperumbudur, Chennai',
                },
              ].map((c) => (
                <div
                  key={c.label}
                  className="flex items-center gap-3 bg-navy-950/30 px-5 py-4 text-left"
                >
                  <span className="grid h-9 w-9 place-items-center rounded-full border border-white/10 bg-white/[0.04]">
                    <c.icon className="h-4 w-4 text-gold-400" />
                  </span>
                  <div>
                    <div className="font-mono text-[10px] tracking-[0.2em] uppercase text-white/50">
                      {c.label}
                    </div>
                    <div className="font-display text-sm font-medium text-white">{c.value}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  )
}
