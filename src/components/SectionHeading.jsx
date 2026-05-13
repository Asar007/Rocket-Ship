import { motion } from 'framer-motion'

export default function SectionHeading({ eyebrow, title, accentWord, subtitle, align = 'left' }) {
  const alignCls = align === 'center' ? 'items-center text-center' : 'items-start text-left'

  // Highlight the accent word inside the title
  const renderedTitle = accentWord
    ? title.split(new RegExp(`(${accentWord})`, 'gi')).map((part, i) =>
        part.toLowerCase() === accentWord.toLowerCase() ? (
          <span key={i} className="relative inline-block">
            <span className="bg-gradient-to-br from-gold-400 via-gold-500 to-gold-600 bg-clip-text text-transparent">
              {part}
            </span>
            <span className="absolute -bottom-1 left-0 right-0 h-px bg-gradient-to-r from-transparent via-gold-400/70 to-transparent" />
          </span>
        ) : (
          <span key={i}>{part}</span>
        )
      )
    : title

  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-80px' }}
      transition={{ duration: 0.7, ease: [0.2, 0.7, 0.2, 1] }}
      className={`flex max-w-3xl flex-col gap-4 ${alignCls}`}
    >
      {eyebrow && (
        <div className="inline-flex items-center gap-2">
          <span className="h-px w-8 bg-gold-400/60" />
          <span className="eyebrow">{eyebrow}</span>
        </div>
      )}
      <h2 className="font-display text-3xl font-semibold leading-[1.1] tracking-tight text-white sm:text-4xl md:text-5xl">
        {renderedTitle}
      </h2>
      {subtitle && (
        <p className="max-w-2xl text-base leading-relaxed text-white/65 sm:text-lg">{subtitle}</p>
      )}
    </motion.div>
  )
}
