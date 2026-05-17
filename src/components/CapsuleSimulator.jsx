import { useEffect, useRef, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

/**
 * Cinematic scroll-synced crew-capsule simulator.
 *
 * Technique: Apple-grade pre-rendered frame sequence painted to a <canvas>.
 * The 240 frames in /public/capsule already contain the true fabricated
 * geometry rotating, separating into an exploded view, and reassembling —
 * so rivets, seams, weld lines and curvature are preserved exactly (no
 * runtime deformation is possible). Scroll → frame is rAF-lerp smoothed,
 * which removes all stutter and gives physically-believable easing.
 */

// Frames 1..EXPLODE_FRAMES = assembled → fully-exploded apex.
// The whole scroll is mapped onto this range so scrolling DOWN takes the
// capsule apart and leaves it apart (frames past the apex are reassembly
// and are intentionally not used here).
// Desktop = full-res JPEG sequence; mobile = ~80% lighter 960px WebP set
// (forward / explode only). Both map assembled → fully-exploded apex.
const DESKTOP = { dir: 'capsule', ext: 'jpg', frames: 102 }
const MOBILE = { dir: 'capsule-sm', ext: 'webp', frames: 52 }
const NAVY = '#000533'
const framePath = (i, cfg) =>
  `/${cfg.dir}/ezgif-frame-${String(i).padStart(3, '0')}.${cfg.ext}`

// Narrative phases mapped to scroll progress (0..1).
const PHASES = [
  {
    at: 0.0,
    eyebrow: 'Assembled · Flight configuration',
    title: 'The reusable crew capsule.',
    body: 'Aerospace-grade aluminium–titanium primary structure, matte-white thermal coating, fully integrated and flight-ready.',
  },
  {
    at: 0.32,
    eyebrow: 'Disassembly · Scroll-driven',
    title: 'Every fabricated structure, separating.',
    body: 'Outer shell panels, structural rings, hatch assembly, support frames, mounting brackets and the thermal shield casing glide apart along their true assembly axes.',
  },
  {
    at: 0.78,
    eyebrow: 'Precision exploded view',
    title: 'Built from these parts.',
    body: 'Each authentic fabricated component, fully separated — with the real shop process that produces it.',
  },
]

function phaseForProgress(p) {
  let active = PHASES[0]
  for (const ph of PHASES) if (p >= ph.at) active = ph
  return active
}

/**
 * Component callouts, anchored as fractions of the rendered frame so they
 * track the capsule across any viewport. `a` = the point on the part the
 * leader line touches; `l` = where the glass label attaches; `side`
 * controls which way the label box grows. `at` = scroll progress at
 * which that part has visibly separated, so each callout reveals one
 * by one as its component pulls away. Only authentic fabricated
 * structures + their real shop process — no invented internals.
 */
const ANNOTATIONS = [
  {
    at: 0.3,
    a: [0.5, 0.205],
    l: [0.21, 0.12],
    side: 'left',
    name: 'Apex hatch & docking ring',
    method: 'CNC-machined forged ring · TIG-welded collar',
  },
  {
    at: 0.44,
    a: [0.73, 0.22],
    l: [0.8, 0.13],
    side: 'right',
    name: 'Outer shell panel',
    method: 'Press-formed Al-alloy · chemically milled skin',
  },
  {
    at: 0.57,
    a: [0.745, 0.49],
    l: [0.81, 0.5],
    side: 'right',
    name: 'Crew-access panel & viewport',
    method: 'Laser-cut · roll-formed · riveted port frame',
  },
  {
    at: 0.69,
    a: [0.5, 0.4],
    l: [0.2, 0.42],
    side: 'left',
    name: 'Primary structural frame',
    method: 'Machined longerons · welded ring frames',
  },
  {
    at: 0.8,
    a: [0.5, 0.78],
    l: [0.8, 0.74],
    side: 'right',
    name: 'Lower base ring assembly',
    method: 'Rolled & welded ring · bolted mount brackets',
  },
]

// per-callout reveal: 0 before its part separates → 1 shortly after
const revealAt = (at, progress) => clamp01((progress - at) / 0.1)

const clamp01 = (v) => Math.max(0, Math.min(1, v))

/**
 * @param scrollRootRef Optional ref to a scroll container (e.g. the
 *   project modal's scrollable div). When given, scroll progress is
 *   driven by that element instead of the window — required when the
 *   simulator lives inside a modal where the page itself doesn't scroll.
 * @param embedded When true, drop the standalone-page chrome (navbar
 *   offset, full-bleed breakout, top margin) and pin to the container
 *   top at full height.
 */
export default function CapsuleSimulator({
  scrollRootRef = null,
  embedded = false,
} = {}) {
  const sectionRef = useRef(null)
  const canvasRef = useRef(null)
  const imagesRef = useRef([])
  const renderState = useRef({ current: 0, target: 0, drawn: -1 })
  // Last progress value pushed to React state, quantized to ~0.5% steps.
  // Scroll updates a ref only; the rAF loop coalesces them into at most
  // one re-render per frame (and none while idle) — this is what keeps
  // the blurred callout boxes from re-painting on every scroll tick.
  const progressStepRef = useRef(-1)
  const [loaded, setLoaded] = useState(0)
  const [ready, setReady] = useState(false)
  const [progress, setProgress] = useState(0)
  const [reduced, setReduced] = useState(false)
  const [imgRect, setImgRect] = useState(null)
  const rectRef = useRef(null)
  const [isMobile, setIsMobile] = useState(false)

  const cfg = isMobile ? MOBILE : DESKTOP
  const FRAMES = cfg.frames

  // Pick the asset set: phones (or save-data) get the light WebP set.
  useEffect(() => {
    if (typeof window === 'undefined') return
    const mqM = window.matchMedia('(max-width: 820px)')
    const saveData =
      navigator.connection && navigator.connection.saveData === true
    const apply = () => setIsMobile(mqM.matches || saveData)
    apply()
    mqM.addEventListener('change', apply)
    return () => mqM.removeEventListener('change', apply)
  }, [])

  // Preload the active frame sequence (re-runs if the set switches).
  useEffect(() => {
    if (typeof window === 'undefined') return
    const mq = window.matchMedia('(prefers-reduced-motion: reduce)')
    setReduced(mq.matches)

    const active = isMobile ? MOBILE : DESKTOP
    let count = 0
    let cancelled = false
    setReady(false)
    setLoaded(0)
    const imgs = new Array(active.frames)
    for (let i = 0; i < active.frames; i++) {
      const img = new Image()
      img.decoding = 'async'
      img.src = framePath(i + 1, active)
      const done = () => {
        if (cancelled) return
        count += 1
        setLoaded(count)
        if (count === active.frames) setReady(true)
      }
      // Decode off-thread up front so the first scroll-through never
      // pays a synchronous JPEG decode on drawImage (a key stutter).
      if (typeof img.decode === 'function') {
        img.decode().then(done, () => {
          img.onload = img.onerror = done
          if (img.complete) done()
        })
      } else {
        img.onload = img.onerror = done
      }
      imgs[i] = img
    }
    imagesRef.current = imgs
    renderState.current = { current: 0, target: 0, drawn: -1 }
    return () => {
      cancelled = true
    }
  }, [isMobile])

  // High-DPI canvas sizing + cover-fit draw.
  useEffect(() => {
    if (typeof window === 'undefined') return
    const canvas = canvasRef.current
    if (!canvas) return

    const draw = (frameIdx) => {
      const img = imagesRef.current[frameIdx]
      const ctx = canvas.getContext('2d')
      if (!img || !ctx || !img.width) return
      const dpr = Math.min(window.devicePixelRatio || 1, 2)
      const cw = canvas.clientWidth
      const ch = canvas.clientHeight
      if (canvas.width !== cw * dpr || canvas.height !== ch * dpr) {
        canvas.width = cw * dpr
        canvas.height = ch * dpr
      }
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0)
      ctx.fillStyle = NAVY
      ctx.fillRect(0, 0, cw, ch)
      // desktop: contain (whole frame composed). mobile: cover so the
      // capsule fills the portrait screen instead of a tiny letterbox
      const scale = isMobile
        ? Math.max(cw / img.width, ch / img.height)
        : Math.min(cw / img.width, ch / img.height)
      const w = img.width * scale
      const h = img.height * scale
      const x = (cw - w) / 2
      const y = (ch - h) / 2
      ctx.drawImage(img, x, y, w, h)
      // publish the drawn rect so callouts can track the capsule
      const r = rectRef.current
      if (!r || r.w !== w || r.h !== h || r.x !== x || r.y !== y) {
        const next = { x, y, w, h }
        rectRef.current = next
        setImgRect(next)
      }
    }

    let raf
    const tick = () => {
      const s = renderState.current
      // critically-damped lerp toward the scroll target → zero jitter
      s.current += (s.target - s.current) * 0.12
      if (Math.abs(s.target - s.current) < 0.01) s.current = s.target
      const frame = Math.max(
        0,
        Math.min(FRAMES - 1, Math.round(s.current)),
      )
      if (frame !== s.drawn) {
        draw(frame)
        s.drawn = frame
      }
      // Reflect the *smoothed* progress to React, but only when it
      // crosses a ~0.5% step — coalesces a scroll burst into ≤1 render
      // per frame and skips renders entirely once motion settles.
      const denom = FRAMES - 1 || 1
      const pp = s.current / denom
      const step = Math.round(pp * 200)
      if (step !== progressStepRef.current) {
        progressStepRef.current = step
        setProgress(pp)
      }
      raf = requestAnimationFrame(tick)
    }
    raf = requestAnimationFrame(tick)

    const onResize = () => {
      renderState.current.drawn = -1
    }
    window.addEventListener('resize', onResize)
    return () => {
      cancelAnimationFrame(raf)
      window.removeEventListener('resize', onResize)
    }
  }, [ready, isMobile, FRAMES])

  // Scroll → progress over a short pinned span. The capsule holds on
  // screen just long enough to come fully apart (~1.5 screens of
  // scroll), then the pin releases and the page continues normally.
  useEffect(() => {
    if (typeof window === 'undefined') return
    const section = sectionRef.current
    if (!section) return

    // Drive off the modal scroll container when embedded; otherwise the
    // window. The container is a full-viewport fixed element, so the
    // section's viewport-relative rect.top still maps correctly.
    const scroller =
      scrollRootRef && scrollRootRef.current ? scrollRootRef.current : null

    const onScroll = () => {
      const rect = section.getBoundingClientRect()
      const vh = scroller ? scroller.clientHeight : window.innerHeight
      // raw: 0 when the section's top hits the scroll-area top (pin
      // starts), 1 when the pinned span is exhausted (pin releases)
      const raw = -rect.top / (section.offsetHeight - vh)
      // brief assembled hold, then fully exploded before the pin releases
      const p = Math.max(0, Math.min(1, (raw - 0.06) / 0.82))
      // Ref-only write — cheap, no re-render. The rAF loop turns this
      // into smoothed canvas frames + a coalesced progress state update.
      renderState.current.target = p * (FRAMES - 1)
    }
    onScroll()
    const target = scroller || window
    target.addEventListener('scroll', onScroll, { passive: true })
    window.addEventListener('resize', onScroll)
    return () => {
      target.removeEventListener('scroll', onScroll)
      window.removeEventListener('resize', onScroll)
    }
  }, [ready, FRAMES, scrollRootRef])

  const phase = phaseForProgress(progress)
  const pct = Math.round(progress * 100)

  return (
    <section
      ref={sectionRef}
      className={
        embedded
          ? 'relative h-[210vh] w-full'
          : 'relative left-1/2 mt-16 h-[210vh] w-screen -translate-x-1/2'
      }
      style={{ background: NAVY }}
      aria-label="Interactive reusable crew capsule simulator"
    >
      {/* Pinned cinematic stage */}
      <div
        className={
          embedded
            ? 'sticky top-0 flex h-screen w-full items-center justify-center overflow-hidden'
            : 'sticky top-24 flex h-[calc(100vh-6rem)] w-full items-center justify-center overflow-hidden sm:top-28 sm:h-[calc(100vh-7rem)]'
        }
        style={{ background: NAVY }}
      >
        {/* soft volumetric ambient glow */}
        <div className="pointer-events-none absolute inset-0">
          <div className="absolute left-1/2 top-1/2 h-[80vmin] w-[80vmin] -translate-x-1/2 -translate-y-1/2 rounded-full bg-electric-500/10 blur-[120px]" />
          <div className="absolute left-[12%] top-[18%] h-[36vmin] w-[36vmin] rounded-full bg-gold-500/[0.07] blur-[110px]" />
          <div className="absolute bottom-[10%] right-[10%] h-[40vmin] w-[40vmin] rounded-full bg-electric-400/[0.06] blur-[120px]" />
        </div>

        <canvas
          ref={canvasRef}
          className="absolute inset-0 h-full w-full"
          style={{ opacity: ready ? 1 : 0, transition: 'opacity 900ms ease' }}
        />

        {/* Cinematic vignette for museum-grade depth */}
        <div
          className="pointer-events-none absolute inset-0"
          style={{
            background:
              'radial-gradient(120% 90% at 50% 45%, transparent 55%, rgba(0,2,15,0.55) 100%)',
          }}
        />

        {/* Desktop callouts — each reveals one by one as its part separates */}
        {!isMobile && imgRect && progress > 0.22 && (
          <div className="pointer-events-none absolute inset-0">
            <svg className="absolute inset-0 h-full w-full overflow-visible">
              {ANNOTATIONS.map((an) => {
                const ax = imgRect.x + an.a[0] * imgRect.w
                const ay = imgRect.y + an.a[1] * imgRect.h
                const lx = imgRect.x + an.l[0] * imgRect.w
                const ly = imgRect.y + an.l[1] * imgRect.h
                const rev = revealAt(an.at, progress)
                return (
                  <g
                    key={an.name}
                    style={{
                      opacity: rev,
                      transition: 'opacity 260ms linear',
                    }}
                  >
                    <line
                      x1={lx}
                      y1={ly}
                      x2={ax}
                      y2={ay}
                      stroke="rgba(240,198,116,0.5)"
                      strokeWidth="1"
                    />
                    <circle
                      cx={ax}
                      cy={ay}
                      r="3.5"
                      fill="none"
                      stroke="rgba(240,198,116,0.9)"
                      strokeWidth="1.5"
                    />
                    <circle cx={ax} cy={ay} r="1.5" fill="rgba(240,198,116,1)" />
                  </g>
                )
              })}
            </svg>

            {ANNOTATIONS.map((an, i) => {
              const lx = imgRect.x + an.l[0] * imgRect.w
              const ly = imgRect.y + an.l[1] * imgRect.h
              const left = an.side === 'right'
              const rev = revealAt(an.at, progress)
              return (
                <div
                  key={an.name}
                  className="absolute max-w-[15rem] rounded-xl border border-gold-400/25 bg-white/[0.05] px-3.5 py-2.5 backdrop-blur-xl"
                  style={{
                    left: lx,
                    top: ly,
                    opacity: rev,
                    transform: `translate(${left ? '0' : '-100%'}, -50%) translateY(${(1 - rev) * 12}px)`,
                    boxShadow: 'inset 0 1px 0 rgba(255,255,255,0.08)',
                    transition: 'opacity 260ms linear, transform 260ms ease',
                  }}
                >
                  <div
                    className={`font-display text-[14px] font-semibold leading-tight text-white ${left ? 'text-left' : 'text-right'}`}
                  >
                    {String(i + 1).padStart(2, '0')} · {an.name}
                  </div>
                  <div
                    className={`mt-1 font-mono text-[10px] uppercase leading-relaxed tracking-[0.13em] text-gold-200/80 ${left ? 'text-left' : 'text-right'}`}
                  >
                    {an.method}
                  </div>
                </div>
              )
            })}
          </div>
        )}

        {/* Mobile callouts — list rows reveal one by one as parts separate */}
        {isMobile && progress > 0.22 && (
          <div className="pointer-events-none absolute inset-x-0 bottom-0 px-4 pb-[5vh]">
            <div className="rounded-2xl border border-white/10 bg-navy-950/80 p-4">
              <div className="mb-3 font-mono text-[9px] uppercase tracking-[0.35em] text-gold-300">
                Fabricated components
              </div>
              <ul className="flex flex-col gap-2.5">
                {ANNOTATIONS.map((an, i) => {
                  const rev = revealAt(an.at, progress)
                  return (
                    <li
                      key={an.name}
                      className="flex gap-3"
                      style={{
                        opacity: rev,
                        transform: `translateY(${(1 - rev) * 10}px)`,
                        transition: 'opacity 260ms linear, transform 260ms ease',
                      }}
                    >
                      <span className="mt-0.5 font-mono text-[11px] text-gold-400">
                        {String(i + 1).padStart(2, '0')}
                      </span>
                      <div>
                        <div className="font-display text-[14px] font-semibold leading-tight text-white">
                          {an.name}
                        </div>
                        <div className="font-mono text-[9.5px] uppercase leading-relaxed tracking-[0.12em] text-gold-200/75">
                          {an.method}
                        </div>
                      </div>
                    </li>
                  )
                })}
              </ul>
            </div>
          </div>
        )}

        {/* Premium loader */}
        <AnimatePresence>
          {!ready && (
            <motion.div
              exit={{ opacity: 0 }}
              transition={{ duration: 0.6 }}
              className="absolute inset-0 flex flex-col items-center justify-center gap-5"
              style={{ background: NAVY }}
            >
              <div className="font-mono text-[10px] uppercase tracking-[0.5em] text-white/45">
                Calibrating optics
              </div>
              <div className="h-px w-56 overflow-hidden bg-white/10">
                <div
                  className="h-full bg-gradient-to-r from-electric-400 to-gold-400 transition-[width] duration-300"
                  style={{ width: `${(loaded / FRAMES) * 100}%` }}
                />
              </div>
              <div className="font-mono text-[11px] tracking-[0.3em] text-white/55">
                {Math.round((loaded / FRAMES) * 100)}%
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Floating glass narrative — crossfades per phase (desktop;
            on mobile the stacked legend conveys the same content) */}
        {!isMobile && (
        <div className="pointer-events-none absolute inset-x-0 bottom-0 flex justify-center px-5 pb-[7vh] sm:justify-start sm:pl-[7vw]">
          <AnimatePresence mode="wait">
            <motion.div
              key={phase.title}
              initial={{ opacity: 0, y: 28, filter: 'blur(8px)' }}
              animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
              exit={{ opacity: 0, y: -20, filter: 'blur(8px)' }}
              transition={{ duration: 0.7, ease: [0.2, 0.7, 0.2, 1] }}
              className="max-w-xl rounded-2xl border border-white/10 bg-white/[0.04] p-6 backdrop-blur-xl sm:p-8"
              style={{ boxShadow: 'inset 0 1px 0 rgba(255,255,255,0.08)' }}
            >
              <div className="font-mono text-[10px] uppercase tracking-[0.42em] text-gold-300">
                {phase.eyebrow}
              </div>
              <h3 className="mt-4 font-display text-3xl font-semibold leading-tight text-white sm:text-4xl">
                {phase.title}
              </h3>
              <p className="mt-3 text-[13.5px] leading-relaxed text-white/65">
                {phase.body}
              </p>
            </motion.div>
          </AnimatePresence>
        </div>
        )}

        {/* Progress rail */}
        <div className="pointer-events-none absolute right-[5vw] top-1/2 hidden -translate-y-1/2 flex-col items-center gap-3 lg:flex">
          <span className="font-mono text-[10px] tracking-[0.3em] text-white/40">
            {String(pct).padStart(3, '0')}
          </span>
          <div className="h-44 w-px bg-white/10">
            <div
              className="w-px bg-gradient-to-b from-electric-400 to-gold-400"
              style={{ height: `${pct}%` }}
            />
          </div>
          <span className="font-mono text-[9px] uppercase tracking-[0.3em] text-white/35">
            Scroll
          </span>
        </div>

        {/* Scroll cue (fades out as the user engages) */}
        <motion.div
          animate={{ opacity: progress > 0.04 ? 0 : 1 }}
          transition={{ duration: 0.4 }}
          className="pointer-events-none absolute bottom-7 left-1/2 flex -translate-x-1/2 flex-col items-center gap-2"
        >
          <span className="font-mono text-[9px] uppercase tracking-[0.4em] text-white/45">
            Scroll to disassemble
          </span>
          <span className="h-9 w-[1.5px] animate-pulse bg-gradient-to-b from-white/50 to-transparent" />
        </motion.div>
      </div>

      {reduced && (
        <p className="absolute bottom-3 left-1/2 -translate-x-1/2 font-mono text-[9px] tracking-[0.25em] text-white/30">
          Reduced-motion mode · scroll still steps frames
        </p>
      )}
    </section>
  )
}
