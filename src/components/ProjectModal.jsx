import { useEffect, useRef } from 'react'
import { createPortal } from 'react-dom'
import {
  motion,
  AnimatePresence,
  useScroll,
  useInView,
  useReducedMotion,
} from 'framer-motion'
import { X, MapPin, ChevronDown } from 'lucide-react'

/* Inline "scroll to view more" cue — lives at the top of the header so
   it scrolls away (disappears) once the visitor scrolls down. */
function ScrollMore() {
  const reduce = useReducedMotion()
  return (
    <div className="mb-8 flex items-center gap-2 text-white/40">
      <span className="font-mono text-[10px] uppercase tracking-[0.3em]">
        Scroll to view more
      </span>
      <motion.span
        animate={reduce ? undefined : { y: [0, 6, 0] }}
        transition={{ duration: 1.6, repeat: Infinity, ease: 'easeInOut' }}
      >
        <ChevronDown className="h-4 w-4" />
      </motion.span>
    </div>
  )
}

/* ── Shared header ─────────────────────────────────────────────── */
function StoryHeader({ project }) {
  return (
    <div className="mx-auto max-w-5xl px-5 pt-20 sm:px-8 sm:pt-24">
      <ScrollMore />
      <div className="flex flex-wrap items-center gap-3">
        <span className="font-mono text-[11px] uppercase tracking-[0.32em] text-gold-400">
          Selected work
        </span>
        <span className="rounded-full border border-white/15 bg-white/[0.04] px-2.5 py-1 font-mono text-[10px] tracking-[0.2em] text-white/70">
          {project.year}
        </span>
      </div>
      <h2 className="mt-4 font-display text-3xl font-semibold leading-tight text-white sm:text-5xl">
        {project.storyTitle || project.title}
      </h2>
      <div className="mt-3 flex items-center gap-2 text-sm text-white/55">
        <MapPin className="h-4 w-4 text-gold-400" />
        <span className="font-mono tracking-wider">{project.location}</span>
      </div>
      <div className="mt-5 flex flex-wrap gap-2">
        {project.tags.map((t) => (
          <span
            key={t}
            className="rounded-full border border-white/10 bg-white/[0.04] px-3 py-1 font-mono text-[10px] tracking-[0.15em] text-white/65"
          >
            {t}
          </span>
        ))}
      </div>
    </div>
  )
}

/* ── 1. Static (fallback / reduced-motion) ────────────────────── */
function StaticStory({ project, story }) {
  return (
    <>
      <StoryHeader project={project} />
      <div className="mx-auto max-w-5xl px-5 pb-24 sm:px-8">
        <div className="mt-10 overflow-hidden rounded-3xl border border-white/10">
          <img
            src={project.images[0]}
            alt={project.title}
            className="aspect-[16/9] w-full object-cover"
          />
        </div>
        <div className="mt-10 max-w-3xl space-y-5">
          {story.map((p, i) => (
            <p
              key={i}
              className="text-[15px] leading-relaxed text-white/70 sm:text-base"
            >
              {p}
            </p>
          ))}
        </div>
        {project.images.length > 1 && (
          <div className="mt-12 grid grid-cols-1 gap-4 sm:grid-cols-2">
            {project.images.slice(1).map((src, i) => (
              <div
                key={i}
                className="overflow-hidden rounded-2xl border border-white/10"
              >
                <img
                  src={src}
                  alt={`${project.title} — ${i + 2}`}
                  loading="lazy"
                  className="aspect-[4/3] w-full object-cover"
                />
              </div>
            ))}
          </div>
        )}
      </div>
    </>
  )
}

/* ── 2. Sticky visual + revealing text ────────────────────────── */
function StickyBeat({ index, text, scrollRef }) {
  const ref = useRef(null)
  const inView = useInView(ref, { root: scrollRef, amount: 0.5 })
  return (
    <motion.div
      ref={ref}
      animate={{ opacity: inView ? 1 : 0.25, y: inView ? 0 : 24 }}
      transition={{ duration: 0.5, ease: [0.2, 0.7, 0.2, 1] }}
      className="flex min-h-[60vh] flex-col justify-center"
    >
      <span className="font-mono text-sm tracking-[0.3em] text-gold-400">
        {String(index + 1).padStart(2, '0')}
      </span>
      <p className="mt-4 text-xl leading-relaxed text-white/80 sm:text-2xl">
        {text}
      </p>
    </motion.div>
  )
}

function StickyStory({ project, story, scrollRef }) {
  return (
    <>
      <StoryHeader project={project} />
      <div className="mx-auto max-w-6xl px-5 pb-[15vh] sm:px-8">
        <div className="mt-10 grid gap-10 lg:grid-cols-2">
          <div className="lg:sticky lg:top-24 lg:h-fit lg:self-start">
            <div className="flex items-center justify-center overflow-hidden rounded-3xl border border-white/10 bg-navy-900 p-3">
              <img
                src={project.images[0]}
                alt={project.title}
                className="max-h-[70vh] w-auto object-contain"
              />
            </div>
          </div>
          <div>
            {story.map((p, i) => (
              <StickyBeat
                key={i}
                index={i}
                text={p}
                scrollRef={scrollRef}
              />
            ))}
          </div>
        </div>
      </div>
    </>
  )
}

/* ── 2b. Mission timeline ─────────────────────────────────────── */
function TimelineStep({ index, text, scrollRef, last }) {
  const ref = useRef(null)
  const inView = useInView(ref, { root: scrollRef, amount: 0.6 })
  return (
    <div
      ref={ref}
      className={`relative pl-10 ${last ? '' : 'pb-4'} flex min-h-[58vh] flex-col justify-center`}
    >
      {/* Node */}
      <span
        className={`absolute left-0 top-1/2 grid h-5 w-5 -translate-x-1/2 -translate-y-1/2 place-items-center rounded-full border transition-all duration-500 ${
          inView
            ? 'border-gold-400 bg-gold-400 shadow-[0_0_18px_-2px_rgba(240,198,116,0.7)]'
            : 'border-white/30 bg-navy-950'
        }`}
      >
        <span
          className={`h-1.5 w-1.5 rounded-full transition-colors duration-500 ${
            inView ? 'bg-navy-950' : 'bg-white/40'
          }`}
        />
      </span>
      <motion.div
        animate={{ opacity: inView ? 1 : 0.3, x: inView ? 0 : 14 }}
        transition={{ duration: 0.5, ease: [0.2, 0.7, 0.2, 1] }}
      >
        <span className="font-mono text-sm tracking-[0.3em] text-gold-400">
          STAGE {String(index + 1).padStart(2, '0')}
        </span>
        <p className="mt-3 text-xl leading-relaxed text-white/80 sm:text-2xl">
          {text}
        </p>
      </motion.div>
    </div>
  )
}

function TimelineStory({ project, story, scrollRef }) {
  return (
    <>
      <StoryHeader project={project} />
      <div className="mx-auto max-w-6xl px-5 pb-[15vh] sm:px-8">
        <div className="mt-10 grid gap-10 lg:grid-cols-2">
          <div className="lg:sticky lg:top-24 lg:h-fit lg:self-start">
            <div className="flex items-center justify-center overflow-hidden rounded-3xl border border-white/10 bg-navy-900 p-3">
              <img
                src={project.images[0]}
                alt={project.title}
                className="max-h-[70vh] w-auto object-contain"
              />
            </div>
          </div>
          <div className="relative">
            {/* Spine */}
            <span className="absolute bottom-[8%] left-0 top-[8%] w-px bg-gradient-to-b from-gold-400/10 via-gold-400/40 to-gold-400/10" />
            {story.map((p, i) => (
              <TimelineStep
                key={i}
                index={i}
                text={p}
                scrollRef={scrollRef}
                last={i === story.length - 1}
              />
            ))}
          </div>
        </div>
      </div>
    </>
  )
}

/* ── 3. Full-screen cinematic steps ───────────────────────────── */
function CinematicSlide({ image, text, index, scrollRef }) {
  const reduce = useReducedMotion()
  const ref = useRef(null)
  const inView = useInView(ref, { root: scrollRef, amount: 0.5 })
  return (
    <section
      ref={ref}
      className="relative flex h-screen w-full items-center justify-center overflow-hidden bg-navy-950"
    >
      <motion.img
        src={image}
        alt=""
        initial={false}
        animate={reduce ? {} : { scale: inView ? 1 : 1.06 }}
        transition={{ duration: 1.1, ease: [0.2, 0.7, 0.2, 1] }}
        className="max-h-[82vh] max-w-[92vw] object-contain"
      />
      <motion.div
        animate={{ opacity: inView ? 1 : 0, y: inView ? 0 : 28 }}
        transition={{ duration: 0.5, ease: [0.2, 0.7, 0.2, 1] }}
        className="absolute inset-x-0 bottom-0 flex justify-center p-6 sm:p-10"
      >
        <div className="max-w-2xl rounded-2xl bg-navy-950/75 px-7 py-5 text-center ring-1 ring-white/10 backdrop-blur-md">
          <span className="font-mono text-sm tracking-[0.3em] text-gold-400">
            {String(index + 1).padStart(2, '0')}
          </span>
          <p className="mt-2 font-display text-2xl font-semibold leading-snug text-white sm:text-4xl">
            {text}
          </p>
        </div>
      </motion.div>
    </section>
  )
}

function CinematicStory({ project, story, scrollRef }) {
  return (
    <>
      {/* Title slide */}
      <section className="relative flex h-screen w-full items-center justify-center overflow-hidden">
        <img
          src={project.images[0]}
          alt={project.title}
          className="absolute inset-0 h-full w-full scale-105 object-cover"
        />
        <div className="absolute inset-0 bg-navy-950/65" />
        <div className="absolute left-1/2 top-8 -translate-x-1/2">
          <ScrollMore />
        </div>
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: [0.2, 0.7, 0.2, 1] }}
          className="relative px-6 text-center"
        >
          <span className="font-mono text-[11px] uppercase tracking-[0.4em] text-gold-400">
            {project.location} · {project.year}
          </span>
          <h2 className="mx-auto mt-5 max-w-3xl font-display text-4xl font-semibold leading-tight text-white sm:text-6xl">
            {project.storyTitle || project.title}
          </h2>
        </motion.div>
      </section>

      {story.map((text, i) => (
        <CinematicSlide
          key={i}
          image={project.images[i % project.images.length]}
          text={text}
          index={i}
          scrollRef={scrollRef}
        />
      ))}
    </>
  )
}

/* ── 4. Ken Burns — whole image (no crop) + per-screen captions ── */
function KenBurnsCaption({ index, text, scrollRef }) {
  const ref = useRef(null)
  const inView = useInView(ref, { root: scrollRef, amount: 0.5 })
  return (
    <section
      ref={ref}
      className="relative z-10 flex h-screen items-center justify-center px-6"
    >
      <motion.div
        animate={{ opacity: inView ? 1 : 0, y: inView ? 0 : 30 }}
        transition={{ duration: 0.5, ease: [0.2, 0.7, 0.2, 1] }}
        className="max-w-2xl rounded-2xl bg-navy-950/75 px-7 py-6 text-center ring-1 ring-white/10 backdrop-blur-md"
      >
        <span className="font-mono text-sm tracking-[0.3em] text-gold-400">
          {String(index + 1).padStart(2, '0')}
        </span>
        <p className="mt-3 font-display text-2xl font-semibold leading-snug text-white sm:text-4xl">
          {text}
        </p>
      </motion.div>
    </section>
  )
}

function KenBurnsStory({ project, story, scrollRef }) {
  const reduce = useReducedMotion()
  return (
    <div className="relative bg-navy-950">
      <StoryHeader project={project} />
      {/* Sticky image underlay — full image, letterboxed, pulled up so
          the caption screens overlay it. Self-contained Ken Burns loop
          (not scroll-linked, so it never gets stuck). */}
      <div
        className="sticky top-0 flex h-screen w-full items-center justify-center overflow-hidden"
        style={{ marginBottom: '-100vh' }}
      >
        <motion.img
          src={project.images[0]}
          alt={project.title}
          animate={
            reduce ? {} : { scale: [1, 1.08, 1], x: ['0%', '-2.5%', '0%'] }
          }
          transition={{ duration: 26, repeat: Infinity, ease: 'easeInOut' }}
          className="max-h-[88vh] max-w-[92vw] object-contain"
        />
      </div>

      {story.map((c, i) => (
        <KenBurnsCaption
          key={i}
          index={i}
          text={c}
          scrollRef={scrollRef}
        />
      ))}
    </div>
  )
}

/* ── Modal shell ──────────────────────────────────────────────── */
export default function ProjectModal({ project, onClose }) {
  const reduce = useReducedMotion()
  const scrollRef = useRef(null)
  const { scrollYProgress } = useScroll({ container: scrollRef })

  useEffect(() => {
    const onKey = (e) => {
      if (e.key === 'Escape') onClose()
    }
    window.addEventListener('keydown', onKey)
    const prev = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    return () => {
      window.removeEventListener('keydown', onKey)
      document.body.style.overflow = prev
    }
  }, [onClose])

  if (typeof document === 'undefined') return null

  const story =
    project.story && project.story.length ? project.story : [project.blurb]
  const style = reduce ? 'static' : project.storyStyle || 'static'

  return createPortal(
    <AnimatePresence>
      <motion.div
        key="proj-backdrop"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.3 }}
        className="fixed inset-0 z-[120] bg-navy-950"
        role="dialog"
        aria-modal="true"
        aria-label={project.title}
      >
        {/* Scroll progress bar */}
        {style !== 'static' && (
          <motion.div
            style={{ scaleX: scrollYProgress }}
            className="fixed inset-x-0 top-0 z-[140] h-[3px] origin-left bg-gradient-to-r from-gold-400 to-gold-600"
          />
        )}

        <button
          type="button"
          onClick={onClose}
          aria-label="Close"
          className="fixed right-4 top-4 z-[140] grid h-11 w-11 place-items-center rounded-full border border-white/15 bg-navy-950/70 text-white/80 backdrop-blur transition-colors hover:bg-white/[0.12] hover:text-white sm:right-6 sm:top-6"
        >
          <X className="h-5 w-5" />
        </button>

        <div
          ref={scrollRef}
          className="h-full w-full overflow-y-auto overflow-x-hidden"
        >
          {style === 'sticky' && (
            <StickyStory
              project={project}
              story={story}
              scrollRef={scrollRef}
            />
          )}
          {style === 'timeline' && (
            <TimelineStory
              project={project}
              story={story}
              scrollRef={scrollRef}
            />
          )}
          {style === 'cinematic' && (
            <CinematicStory
              project={project}
              story={story}
              scrollRef={scrollRef}
            />
          )}
          {style === 'kenburns' && (
            <KenBurnsStory
              project={project}
              story={story}
              scrollRef={scrollRef}
            />
          )}
          {style === 'static' && (
            <StaticStory project={project} story={story} />
          )}
        </div>
      </motion.div>
    </AnimatePresence>,
    document.body,
  )
}
