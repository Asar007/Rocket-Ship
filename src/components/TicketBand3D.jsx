import { Suspense, useEffect, useMemo, useRef, useState } from 'react'
import * as THREE from 'three'
import { Canvas, useFrame } from '@react-three/fiber'
import { useTexture } from '@react-three/drei'

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

/* ──────────────────────────────────────────────────────────────────────────
 *  STEP 2 — 12 client logos painted around the cylinder.
 *  Each panel = one square logo chip on a paper-textured pink background.
 *  Diffuse / bump / roughness are all procedurally generated canvas
 *  textures so no extra image assets are needed beyond the existing logos.
 * ────────────────────────────────────────────────────────────────────────── */

const LOGO_SOURCES = [
  isro, nsil, ursc, lpsc, hsfc, hvf,
  jkPaper, manali, schwing, tancem, tpl, tagros,
]

// 18 panels around a larger band — 12 logos cycle through (each appearing
// 1–2× depending on position). Bigger circle + more panels means more
// tickets sit in the visible front arc at any moment.
const BAND_RADIUS = 5.4
const PANELS = 18
// Square panels in 3D arc-length.
const PANEL_ARC = (2 * Math.PI * BAND_RADIUS) / PANELS // ≈ 1.885 — unchanged
const BAND_HEIGHT = PANEL_ARC
// Desktop keeps the smooth curve; mobile drops to ~1/3 the triangle
// count which is still visually smooth at the lower resolution and
// saves a lot of vertex+fragment work.
const SEGMENTS_DESKTOP = 128
const SEGMENTS_MOBILE = 64

// Texture canvas: 240px per panel chip — comfortably above the on-screen
// chip size at retina DPR, well below the previous 320px overkill.
const PANEL_PX = 240
const TEX_W = PANEL_PX * PANELS // 4320
const TEX_H = PANEL_PX // 240

function roundRectPath(ctx, x, y, w, h, r) {
  ctx.beginPath()
  ctx.moveTo(x + r, y)
  ctx.lineTo(x + w - r, y)
  ctx.quadraticCurveTo(x + w, y, x + w, y + r)
  ctx.lineTo(x + w, y + h - r)
  ctx.quadraticCurveTo(x + w, y + h, x + w - r, y + h)
  ctx.lineTo(x + r, y + h)
  ctx.quadraticCurveTo(x, y + h, x, y + h - r)
  ctx.lineTo(x, y + r)
  ctx.quadraticCurveTo(x, y, x + r, y)
  ctx.closePath()
}

// Band background — fully transparent. Only the logo chips end up visible
// after the alpha mask is applied; there's no paper wristband any more.
function makeBandBackground() {
  const c = document.createElement('canvas')
  c.width = TEX_W
  c.height = TEX_H
  // Don't paint anything — leave the canvas fully transparent.
  return c
}

// Alpha mask — only the logo chips are opaque; the rest of the cylinder
// is fully transparent. The "band" is gone; only the logos remain visible.
function makeBandAlpha() {
  const c = document.createElement('canvas')
  c.width = TEX_W
  c.height = TEX_H
  const ctx = c.getContext('2d')

  // Start fully transparent
  ctx.fillStyle = '#000000'
  ctx.fillRect(0, 0, TEX_W, TEX_H)

  // Chip-shaped mask — matches the chip dimensions used when drawing logos.
  const rectW = 186 // = chipSize from bandMap loop
  const rectH = 186
  const r = 18 // = chipRadius

  ctx.fillStyle = '#ffffff'
  for (const wrap of [-TEX_W, 0, TEX_W]) {
    for (let i = 0; i < PANELS; i++) {
      const cx = (i + 0.5) * PANEL_PX + wrap
      const rx = cx - rectW / 2
      const ry = (TEX_H - rectH) / 2
      roundRectPath(ctx, rx, ry, rectW, rectH, r)
      ctx.fill()
    }
  }

  return c
}

/* Camera/viewport presets — mobile uses a closer camera + wider FOV so
 * the band fills the narrower portrait viewport. The depth-fade
 * thresholds shift correspondingly so the rear tickets still ghost out
 * starting at the cylinder centreline. */
const CAM_DESKTOP = {
  pos: [0, 2.4, 12.2],
  fov: 35,
  fadeNear: 11.2,
  fadeRange: 6.4,
}
const CAM_MOBILE = {
  pos: [0, 1.6, 10.5],
  fov: 46,
  fadeNear: 9.5,
  fadeRange: 6.4,
}

/* Depth-fade shader patch: front tickets opaque + saturated, rear tickets
 * fade toward translucent, desaturated, cool-tinted ghosts. Rides on top
 * of MeshStandardMaterial so PBR lighting, alphaMap, etc. still apply. */
function applyDepthFade(shader, opts = {}) {
  const minAlpha = opts.minAlpha ?? 0.15
  const desat = opts.desat ?? 0.55
  const frostTint = opts.frostTint ?? 0.22
  const near = opts.near ?? CAM_DESKTOP.fadeNear
  const range = opts.range ?? CAM_DESKTOP.fadeRange

  shader.vertexShader = shader.vertexShader
    .replace(
      '#include <common>',
      `#include <common>
       varying float vViewZ;`,
    )
    .replace(
      '#include <project_vertex>',
      `#include <project_vertex>
       vViewZ = -mvPosition.z;`,
    )

  shader.fragmentShader = shader.fragmentShader
    .replace(
      '#include <common>',
      `#include <common>
       varying float vViewZ;`,
    )
    .replace(
      '#include <dithering_fragment>',
      `#include <dithering_fragment>
       float dT = clamp((vViewZ - ${near.toFixed(2)}) / ${range.toFixed(2)}, 0.0, 1.0);
       // Desaturate toward gray on the way back
       float gray = dot(gl_FragColor.rgb, vec3(0.299, 0.587, 0.114));
       gl_FragColor.rgb = mix(gl_FragColor.rgb, vec3(gray), dT * ${desat.toFixed(2)});
       // Subtle cool tint — frosted-glass feel
       gl_FragColor.rgb = mix(gl_FragColor.rgb, vec3(0.90, 0.93, 1.0), dT * ${frostTint.toFixed(2)});
       // Smooth opacity falloff
       gl_FragColor.a *= mix(1.0, ${minAlpha.toFixed(3)}, dT);`,
    )
}

function Band({ groupRef, dragState, isNarrow, isLowTier }) {
  // Drei suspends the component until all 12 logos are loaded.
  const logoTextures = useTexture(LOGO_SOURCES)
  // Camera framing follows viewport width (narrow viewports need the
  // closer + wider-FOV preset so the band doesn't clip on the sides).
  const fadeNear = isNarrow ? CAM_MOBILE.fadeNear : CAM_DESKTOP.fadeNear
  const fadeRange = isNarrow ? CAM_MOBILE.fadeRange : CAM_DESKTOP.fadeRange

  // Composite diffuse: paper background, then a white rounded chip per panel
  // with the client logo drawn inside it (contain-fit, centered).
  const bandMap = useMemo(() => {
    const c = makeBandBackground()
    const ctx = c.getContext('2d')

    const padding = 27
    const chipSize = PANEL_PX - padding * 2 // 186
    const chipRadius = 18

    for (let i = 0; i < PANELS; i++) {
      const tex = logoTextures[i % logoTextures.length]
      const img = tex && tex.image
      if (!img) continue

      const panelX = i * PANEL_PX
      const chipX = panelX + padding
      const chipY = (TEX_H - chipSize) / 2

      // White rounded chip — no drop shadow now that there's no paper
      // background for the shadow to land on.
      ctx.fillStyle = '#ffffff'
      roundRectPath(ctx, chipX, chipY, chipSize, chipSize, chipRadius)
      ctx.fill()

      // Clip everything below to the chip's rounded shape — this is what
      // gives the logo itself visibly rounded corners.
      ctx.save()
      roundRectPath(ctx, chipX, chipY, chipSize, chipSize, chipRadius)
      ctx.clip()

      // Cover-fit the logo so it fills the chip (cropping if needed), the
      // same behaviour as the existing `object-cover` LogoChip in Clients.
      const iw = img.naturalWidth || img.width
      const ih = img.naturalHeight || img.height
      const scale = Math.max(chipSize / iw, chipSize / ih)
      const dw = iw * scale
      const dh = ih * scale
      const cx = chipX + chipSize / 2
      const cy = chipY + chipSize / 2
      ctx.drawImage(img, cx - dw / 2, cy - dh / 2, dw, dh)
      ctx.restore()
    }

    const t = new THREE.CanvasTexture(c)
    t.colorSpace = THREE.SRGBColorSpace
    t.anisotropy = 8
    return t
  }, [logoTextures])

  const alphaMap = useMemo(() => {
    const t = new THREE.CanvasTexture(makeBandAlpha())
    t.anisotropy = 4
    return t
  }, [])

  // Alpha-masked into rounded panels, with depth-fade shader so rear
  // tickets ghost out into frosted translucency. DoubleSide so the back-
  // half of the cylinder renders as the faded "tickets behind". Bump and
  // roughness maps removed — they only mattered while the paper band was
  // visible; chips read fine without them.
  const outerMat = useMemo(() => {
    const m = new THREE.MeshStandardMaterial({
      map: bandMap,
      roughness: 0.78,
      metalness: 0,
      alphaMap,
      transparent: true,
      // Low-tier devices: FrontSide only — no back-half ghost tickets,
      // ~50% less fragment work. High-tier (including beefy phones) keeps
      // DoubleSide for the layered look.
      side: isLowTier ? THREE.FrontSide : THREE.DoubleSide,
      depthWrite: false,
    })
    m.onBeforeCompile = (s) =>
      applyDepthFade(s, { minAlpha: 0.14, near: fadeNear, range: fadeRange })
    return m
  }, [bandMap, alphaMap, fadeNear, fadeRange, isLowTier])

  useFrame((_, dt) => {
    if (!groupRef.current) return
    const ds = dragState.current

    // While the user is actively dragging, the pointer handler is driving
    // rotation.y directly — don't add anything here.
    if (ds.isDragging) return

    // Momentum carry: apply the velocity captured at release, decay it
    // exponentially each frame until it's small enough to be considered
    // settled. Half-life ≈ 0.22s; feels weighty but not sluggish.
    if (Math.abs(ds.velocity) > 0.02) {
      groupRef.current.rotation.y += ds.velocity * dt
      ds.velocity *= Math.pow(0.04, dt)
      return
    }
    ds.velocity = 0

    // Idle auto-rotation — resumes only once the manual momentum has died.
    groupRef.current.rotation.y += dt * 0.45
  })

  return (
    <group ref={groupRef} position={[0, 0.8, 0]}>
      {/* Single DoubleSide shell — the back half of the cylinder renders
          as the depth-faded ghost tickets behind the front. Gaps in the
          alpha mask show through to the page background. */}
      <mesh material={outerMat}>
        <cylinderGeometry
          args={[
            BAND_RADIUS,
            BAND_RADIUS,
            BAND_HEIGHT,
            isLowTier ? SEGMENTS_MOBILE : SEGMENTS_DESKTOP,
            1,
            true,
          ]}
        />
      </mesh>
    </group>
  )
}

export default function TicketBand3D() {
  // Shared between the pointer handlers (outside the Canvas) and the Band's
  // useFrame loop (inside the Canvas) — refs are stable so the R3F render
  // loop reads the latest drag state every frame.
  const groupRef = useRef(null)
  const dragState = useRef({
    isDragging: false,
    lastX: 0,
    lastTime: 0,
    velocity: 0, // radians/sec, used for release-momentum
  })

  // Two independent signals:
  //   isNarrow  — viewport ≤ 640px → use the closer mobile camera framing
  //   isLowTier — device can't comfortably run the full preset → drop
  //               drag, DoubleSide, MSAA, full DPR, and segment count
  // A beefy phone in portrait gets isNarrow=true (mobile camera) BUT
  // isLowTier=false (full features including drag).
  const [isNarrow, setIsNarrow] = useState(false)
  const [isLowTier, setIsLowTier] = useState(false)
  useEffect(() => {
    if (typeof window === 'undefined') return

    const mq = window.matchMedia('(max-width: 640px)')
    const onResize = () => setIsNarrow(mq.matches)
    onResize()
    mq.addEventListener('change', onResize)

    // Capability check, run once on mount.
    const detectLowTier = () => {
      // Desktop-style input (mouse) → trust the platform, high tier.
      if (window.matchMedia('(hover: hover) and (pointer: fine)').matches) {
        return false
      }
      // iOS exposes no deviceMemory; iPhones/iPads from the last few
      // years are very capable, so treat iOS as high tier by default.
      if (/iPad|iPhone|iPod/.test(navigator.userAgent)) return false
      // Android (and others): require flagship-class signals.
      const mem = navigator.deviceMemory ?? 4
      const cores = navigator.hardwareConcurrency ?? 4
      return !(mem >= 6 && cores >= 8)
    }
    setIsLowTier(detectLowTier())

    return () => mq.removeEventListener('change', onResize)
  }, [])

  const cam = isNarrow ? CAM_MOBILE : CAM_DESKTOP

  // Pause rendering when the band is off-screen — the biggest perf win,
  // since useFrame would otherwise keep ticking at 60fps regardless.
  const wrapperRef = useRef(null)
  const [inView, setInView] = useState(true)
  useEffect(() => {
    if (typeof window === 'undefined' || !wrapperRef.current) return
    const io = new IntersectionObserver(
      ([entry]) => setInView(entry.isIntersecting),
      { rootMargin: '120px' },
    )
    io.observe(wrapperRef.current)
    return () => io.disconnect()
  }, [])

  const onPointerDown = (e) => {
    if (!groupRef.current) return
    e.currentTarget.setPointerCapture?.(e.pointerId)
    dragState.current.isDragging = true
    dragState.current.lastX = e.clientX
    dragState.current.lastTime = performance.now()
    dragState.current.velocity = 0
  }

  const onPointerMove = (e) => {
    const ds = dragState.current
    if (!ds.isDragging || !groupRef.current) return
    const now = performance.now()
    const dx = e.clientX - ds.lastX
    const dt = Math.max((now - ds.lastTime) / 1000, 0.001)

    // 1 px ≈ 0.006 rad — full revolution in ~1000 px of drag.
    // Negative so dragging RIGHT pushes the front-facing panels to the right.
    const dRot = -dx * 0.006
    groupRef.current.rotation.y += dRot
    ds.velocity = dRot / dt

    ds.lastX = e.clientX
    ds.lastTime = now
  }

  const onPointerUp = (e) => {
    e.currentTarget.releasePointerCapture?.(e.pointerId)
    dragState.current.isDragging = false
  }

  return (
    <div
      ref={wrapperRef}
      // Low-tier devices: no drag handlers, no grab cursor, no touch-action
      // lock — so the band area scrolls naturally with the rest of the page.
      className={`relative h-[360px] w-full sm:h-[460px] md:h-[560px] ${
        isLowTier ? '' : 'cursor-grab touch-none select-none active:cursor-grabbing'
      }`}
      onPointerDown={isLowTier ? undefined : onPointerDown}
      onPointerMove={isLowTier ? undefined : onPointerMove}
      onPointerUp={isLowTier ? undefined : onPointerUp}
      onPointerCancel={isLowTier ? undefined : onPointerUp}
    >
      <Canvas
        // R3F locks the camera prop at mount time; key the Canvas on the
        // (camera, perf-tier) pair so it rebuilds when either flips.
        key={`${isNarrow ? 'n' : 'w'}-${isLowTier ? 'l' : 'h'}`}
        // Low tier: dpr 1 + no MSAA — biggest fragment-shader win.
        // High tier (including beefy phones): full 2x DPR.
        dpr={isLowTier ? 1 : [1, 2]}
        camera={{ position: cam.pos, fov: cam.fov }}
        // Off-screen pause — biggest overall perf win: stops the render
        // loop entirely when the band isn't on screen.
        frameloop={inView ? 'always' : 'never'}
        gl={{
          antialias: !isLowTier,
          alpha: true,
          powerPreference: 'high-performance',
          toneMapping: THREE.ACESFilmicToneMapping,
          outputColorSpace: THREE.SRGBColorSpace,
        }}
        style={{ background: 'transparent' }}
      >
        <ambientLight intensity={0.55} />
        <directionalLight position={[4, 6, 5]} intensity={1.4} />
        <directionalLight position={[-4, 2, -3]} intensity={0.35} />

        <Suspense fallback={null}>
          <Band
            groupRef={groupRef}
            dragState={dragState}
            isNarrow={isNarrow}
            isLowTier={isLowTier}
          />
        </Suspense>
      </Canvas>
    </div>
  )
}
