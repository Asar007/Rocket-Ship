import { useEffect, useRef } from 'react'
import { createPortal } from 'react-dom'
import {
  motion,
  AnimatePresence,
  useScroll,
  useInView,
  useReducedMotion,
} from 'framer-motion'
import { X, MapPin } from 'lucide-react'
import CapsuleSimulator from './CapsuleSimulator.jsx'

/* ── Shared header ─────────────────────────────────────────────── */
function StoryHeader({ project }) {
  return (
    <div className="mx-auto max-w-5xl px-5 pt-20 sm:px-8 sm:pt-24">
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
                  alt={`${project.title} photo ${i + 2}`}
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
  const inView = useInView(ref, { root: scrollRef, amount: 0.55 })
  return (
    <div
      ref={ref}
      className={`relative pl-10 ${last ? '' : 'pb-2'} flex min-h-[42vh] flex-col justify-center`}
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
        // Fully hidden until you scroll this stage into view — the next
        // paragraph only reveals once you reach it, not shown dim ahead.
        animate={{
          opacity: inView ? 1 : 0,
          y: inView ? 0 : 28,
          filter: inView ? 'blur(0px)' : 'blur(6px)',
        }}
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
      <div className="mx-auto max-w-3xl px-5 pb-[15vh] sm:px-8">
        {/* Single centered timeline column — the capsule simulator above
            already carries the visual, so no sticky image here. */}
        <div className="relative mt-10 pl-3">
          {/* Spine */}
          <span className="absolute bottom-[6%] left-0 top-[6%] w-[6px] -translate-x-1/2 rounded-full bg-gradient-to-b from-gold-400/25 via-gold-400/70 to-gold-400/25" />
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
    </>
  )
}

/* ── 3. Full-screen cinematic steps — text-only points ────────── */
function CinematicSlide({ text, index, scrollRef }) {
  const ref = useRef(null)
  const inView = useInView(ref, { root: scrollRef, amount: 0.5 })
  return (
    <section
      ref={ref}
      className="relative flex min-h-screen w-full items-center justify-center overflow-hidden bg-navy-950 px-6 sm:px-12"
    >
      {/* Soft ambient glow so the slide doesn't read flat */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 bg-[radial-gradient(60%_60%_at_50%_45%,rgba(240,198,116,0.10),transparent_70%)]"
      />
      <motion.div
        animate={{ opacity: inView ? 1 : 0, y: inView ? 0 : 36 }}
        transition={{ duration: 0.6, ease: [0.2, 0.7, 0.2, 1] }}
        className="relative mx-auto max-w-5xl text-center"
      >
        <span className="font-mono text-lg tracking-[0.42em] text-gold-400 sm:text-xl">
          {String(index + 1).padStart(2, '0')}
        </span>
        <div className="mx-auto mt-6 h-px w-24 bg-gradient-to-r from-transparent via-gold-400/70 to-transparent" />
        <p className="mt-8 font-display text-3xl font-semibold leading-[1.15] text-white sm:mt-10 sm:text-5xl lg:text-6xl">
          {text}
        </p>
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
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: [0.2, 0.7, 0.2, 1] }}
          className="relative px-6 text-center"
        >
          <span className="font-mono text-xs uppercase tracking-[0.42em] text-gold-400 sm:text-sm">
            {project.location} · {project.year}
          </span>
          <h2 className="mx-auto mt-6 max-w-5xl font-display text-5xl font-semibold leading-[1.05] text-white sm:mt-8 sm:text-7xl lg:text-8xl">
            {project.storyTitle || project.title}
          </h2>
        </motion.div>
      </section>

      {story.map((text, i) => (
        <CinematicSlide
          key={i}
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

/* ── 5. Scroll-driven crew-capsule simulator ──────────────────── */
function CapsuleStory({ project, story, scrollRef }) {
  return (
    <div className="relative bg-[#000533]">
      {/* Cinematic lead: the scroll-driven capsule simulator. */}
      <div className="relative">
        {/* Lightweight context label — the simulator carries its own
            phase narrative, so this stays minimal and out of the way. */}
        <div className="pointer-events-none absolute left-5 top-6 z-20 sm:left-8 sm:top-8">
          <div className="font-mono text-[10px] uppercase tracking-[0.32em] text-gold-400">
            {project.location} · {project.year}
          </div>
          <div className="mt-1 font-display text-lg font-semibold text-white sm:text-2xl">
            {project.storyTitle || project.title}
          </div>
        </div>
        <CapsuleSimulator scrollRootRef={scrollRef} embedded />
      </div>

      {/* Continue scrolling into the mission story (header + timeline). */}
      <TimelineStory project={project} story={story} scrollRef={scrollRef} />

      {/* Real photos from the floor — handover-grade evidence of the build. */}
      <RealPhotosGallery project={project} />
    </div>
  )
}

/* ── Real-photos gallery ─────────────────────────────────────────
   Rendered at the END of the CTS modal so visitors get to see the
   actual hardware (exterior + interior) after the 3D simulator and
   timeline narrative. */
function RealPhotosGallery({ project }) {
  if (!project.images || project.images.length === 0) return null
  return (
    <section className="mx-auto max-w-5xl px-5 pb-24 sm:px-8">
      <div className="flex items-center gap-3">
        <span className="h-px w-8 bg-gold-400/60" />
        <span className="font-mono text-[11px] uppercase tracking-[0.32em] text-gold-400">
          Photographs · from the floor
        </span>
      </div>
      <h3 className="mt-4 font-display text-2xl font-semibold leading-tight text-white sm:text-3xl">
        The real hardware.
      </h3>
      <p className="mt-3 max-w-2xl text-[15px] leading-relaxed text-white/55">
        Handover-grade photographs of the CTS as it left our floor — exterior shell
        and the crew interior, in the configuration delivered to ISRO / HSFC.
      </p>
      <div className="mt-8 grid grid-cols-1 gap-4 sm:grid-cols-2">
        {project.images.map((src, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-80px' }}
            transition={{ duration: 0.6, delay: i * 0.08, ease: [0.2, 0.7, 0.2, 1] }}
            className="overflow-hidden rounded-2xl border border-white/10 bg-navy-950"
          >
            <div className="flex aspect-[4/3] w-full items-center justify-center">
              <img
                src={src}
                alt={`${project.title} photo ${i + 1}`}
                loading="lazy"
                decoding="async"
                className="max-h-full max-w-full object-contain transition-transform duration-700 hover:scale-[1.03]"
              />
            </div>
          </motion.div>
        ))}
      </div>
    </section>
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
          {style === 'capsule' && (
            <CapsuleStory
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
