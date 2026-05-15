import { motion, useReducedMotion } from 'framer-motion'

export default function SectionHeading({
  eyebrow,
  title,
  accentWord,
  subtitle,
  align = 'left',
}) {
  const reduce = useReducedMotion()
  const alignCls =
    align === 'center'
      ? 'items-center text-center mx-auto'
      : 'items-start text-left'

  const container = {
    hidden: {},
    show: {
      transition: { staggerChildren: reduce ? 0 : 0.12, delayChildren: 0.05 },
    },
  }
  const item = reduce
    ? { hidden: { opacity: 0 }, show: { opacity: 1 } }
    : {
        hidden: { opacity: 0, y: 22 },
        show: {
          opacity: 1,
          y: 0,
          transition: { duration: 0.6, ease: [0.2, 0.7, 0.2, 1] },
        },
      }
  const lineGrow = reduce
    ? { hidden: { opacity: 0 }, show: { opacity: 1 } }
    : {
        hidden: { scaleX: 0, opacity: 0 },
        show: {
          scaleX: 1,
          opacity: 1,
          transition: { duration: 0.6, ease: [0.2, 0.7, 0.2, 1] },
        },
      }
  const underline = reduce
    ? { hidden: { opacity: 0 }, show: { opacity: 1 } }
    : {
        hidden: { scaleX: 0 },
        show: {
          scaleX: 1,
          transition: { duration: 0.7, ease: [0.2, 0.7, 0.2, 1] },
        },
      }

  // Highlight the accent word inside the title
  const renderedTitle = accentWord
    ? title.split(new RegExp(`(${accentWord})`, 'gi')).map((part, i) =>
        part.toLowerCase() === accentWord.toLowerCase() ? (
          <span key={i} className="relative inline-block">
            <span className="bg-gradient-to-br from-gold-400 via-gold-500 to-gold-600 bg-clip-text text-transparent">
              {part}
            </span>
            <motion.span
              variants={underline}
              style={{ originX: 0 }}
              className="absolute -bottom-1 left-0 right-0 h-px bg-gradient-to-r from-transparent via-gold-400/70 to-transparent"
            />
          </span>
        ) : (
          <span key={i}>{part}</span>
        ),
      )
    : title

  return (
    <motion.div
      variants={container}
      initial="hidden"
      whileInView="show"
      viewport={{ once: true, margin: '-80px' }}
      className={`flex max-w-3xl flex-col gap-4 ${alignCls}`}
    >
      {eyebrow && (
        <motion.div variants={item} className="inline-flex items-center gap-2">
          <motion.span
            variants={lineGrow}
            style={{ originX: 0 }}
            className="h-px w-8 bg-gold-400/60"
          />
          <span className="eyebrow">{eyebrow}</span>
        </motion.div>
      )}
      <motion.h2
        variants={item}
        className="font-display text-3xl font-semibold leading-[1.1] tracking-tight text-white sm:text-4xl md:text-5xl"
      >
        {renderedTitle}
      </motion.h2>
      {subtitle && (
        <motion.p
          variants={item}
          className="max-w-2xl text-base leading-relaxed text-white/65 sm:text-lg"
        >
          {subtitle}
        </motion.p>
      )}
    </motion.div>
  )
}
