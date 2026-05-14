import React, {
  Suspense,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react'
import * as THREE from 'three'
import { Canvas, useFrame, useThree } from '@react-three/fiber'
import {
  Environment,
  Html,
  Line,
  OrbitControls,
  useTexture,
} from '@react-three/drei'

/* ──────────────────────────────────────────────────────────────────────────
 *  STEP 2 (v2) — High-quality Earth diffuse + bump + specular.
 *  4K NASA Blue Marble Next Generation textures via jsDelivr (CORS-friendly).
 *  -  2_no_clouds_4k.jpg  — 4096×2048 day-side diffuse (no baked clouds)
 *  -  elev_bump_4k.jpg    — terrain elevation as a bump map
 *  -  water_4k.png        — ocean/water mask used as a roughness map so
 *                            water reflects the sun and land stays matte
 *  Anisotropic filtering is set to the GPU max for sharp detail at the
 *  horizon, and the geometry is bumped to 128×128 segments.
 * ────────────────────────────────────────────────────────────────────────── */

const CDN = 'https://cdn.jsdelivr.net/gh/turban/webgl-earth@master/images'
const TEX = {
  day: `${CDN}/2_no_clouds_4k.jpg`,
  bump: `${CDN}/elev_bump_4k.jpg`,
  water: `${CDN}/water_4k.png`,
  clouds: `${CDN}/fair_clouds_4k.png`,
}

/* STEP 3 — Earth + independent cloud layer. */
function Earth() {
  const surfaceRef = useRef()
  const cloudRefA = useRef()
  const cloudRefB = useRef()
  const { gl } = useThree()

  const [dayMap, bumpMap, waterMap, cloudMap] = useTexture([
    TEX.day,
    TEX.bump,
    TEX.water,
    TEX.clouds,
  ])

  useEffect(() => {
    const aniso = gl.capabilities.getMaxAnisotropy()
    ;[dayMap, cloudMap].forEach((t) => {
      if (t) t.colorSpace = THREE.SRGBColorSpace
    })
    ;[dayMap, bumpMap, waterMap, cloudMap].forEach((t) => {
      if (t) t.anisotropy = aniso
    })
  }, [dayMap, bumpMap, waterMap, cloudMap, gl])

  useFrame(() => {
    if (surfaceRef.current) surfaceRef.current.rotation.y += 0.0008
    if (cloudRefA.current) cloudRefA.current.rotation.y += 0.0012
    if (cloudRefB.current) cloudRefB.current.rotation.y += 0.0009
  })

  return (
    <group>
      {/* Surface */}
      <mesh ref={surfaceRef}>
        <sphereGeometry args={[3, 128, 128]} />
        <meshStandardMaterial
          map={dayMap}
          bumpMap={bumpMap}
          bumpScale={0.05}
          roughnessMap={waterMap}
          roughness={0.9}
          metalness={0.05}
        />
      </mesh>

      {/* Lower cloud deck — full opacity */}
      <mesh ref={cloudRefA} scale={1.012} renderOrder={1}>
        <sphereGeometry args={[3, 96, 96]} />
        <meshStandardMaterial
          map={cloudMap}
          alphaMap={cloudMap}
          transparent
          opacity={1}
          depthWrite={false}
        />
      </mesh>

      {/* Upper cloud deck — slightly higher, different rotation rate,
          rotated phase so the two layers parallax instead of stacking flat */}
      <mesh
        ref={cloudRefB}
        scale={1.022}
        rotation={[0, Math.PI * 0.35, 0]}
        renderOrder={2}
      >
        <sphereGeometry args={[3, 96, 96]} />
        <meshStandardMaterial
          map={cloudMap}
          alphaMap={cloudMap}
          transparent
          opacity={0.55}
          depthWrite={false}
        />
      </mesh>
    </group>
  )
}

/* ──────────────────────────────────────────────────────────────────────────
 *  Procedural canvas textures for the capsule.
 *  Generating these in code (instead of shipping image assets) keeps the
 *  component self-contained and lets us tune the "weathered metal" look
 *  directly.  Each function returns an HTMLCanvasElement that we then wrap
 *  in a THREE.CanvasTexture.
 * ────────────────────────────────────────────────────────────────────────── */

// White/silver thermal blanket with vertical & horizontal panel seams plus
// fine speckle noise so the surface picks up grain at close range.
function makeBodyDiffuse() {
  const c = document.createElement('canvas')
  c.width = 1024
  c.height = 512
  const ctx = c.getContext('2d')
  // Base vertical brightness gradient (lighter top, darker bottom)
  const g = ctx.createLinearGradient(0, 0, 0, 512)
  g.addColorStop(0, '#eef1f5')
  g.addColorStop(0.5, '#dadee3')
  g.addColorStop(1, '#c2c7cd')
  ctx.fillStyle = g
  ctx.fillRect(0, 0, 1024, 512)
  // Brushed-metal horizontal streaking
  for (let i = 0; i < 2200; i++) {
    const y = Math.random() * 512
    const w = 30 + Math.random() * 80
    const x = Math.random() * 1024
    ctx.strokeStyle = `rgba(255,255,255,${0.015 + Math.random() * 0.04})`
    ctx.lineWidth = 0.5 + Math.random()
    ctx.beginPath()
    ctx.moveTo(x, y)
    ctx.lineTo(x + w, y)
    ctx.stroke()
  }
  // Vertical panel seams — 6 around the circumference
  ctx.strokeStyle = 'rgba(35,40,50,0.55)'
  ctx.lineWidth = 1.5
  for (let i = 0; i < 6; i++) {
    const x = (i + 0.5) * (1024 / 6)
    ctx.beginPath()
    ctx.moveTo(x, 0)
    ctx.lineTo(x, 512)
    ctx.stroke()
  }
  // Horizontal seams — 3 rings at known heights
  ctx.strokeStyle = 'rgba(35,40,50,0.5)'
  ctx.lineWidth = 1.5
  for (const y of [110, 256, 402]) {
    ctx.beginPath()
    ctx.moveTo(0, y)
    ctx.lineTo(1024, y)
    ctx.stroke()
  }
  // Bolt rivet rows along each horizontal seam
  ctx.fillStyle = 'rgba(40,45,55,0.85)'
  for (const y of [110, 256, 402]) {
    for (let x = 18; x < 1024; x += 36) {
      ctx.beginPath()
      ctx.arc(x, y, 2, 0, Math.PI * 2)
      ctx.fill()
    }
  }
  // Subtle soot / weathering streaks running downward (hint of reentry heat)
  for (let i = 0; i < 40; i++) {
    const x = Math.random() * 1024
    const len = 60 + Math.random() * 140
    const y0 = 90 + Math.random() * 320
    const grd = ctx.createLinearGradient(0, y0, 0, y0 + len)
    grd.addColorStop(0, 'rgba(50,40,30,0)')
    grd.addColorStop(0.4, 'rgba(60,45,30,0.15)')
    grd.addColorStop(1, 'rgba(40,30,20,0)')
    ctx.fillStyle = grd
    ctx.fillRect(x, y0, 1 + Math.random() * 2, len)
  }
  // Small registration mark "ISRO" + "HS-1"
  ctx.fillStyle = 'rgba(20,25,35,0.8)'
  ctx.font = 'bold 22px system-ui, sans-serif'
  ctx.textAlign = 'center'
  ctx.fillText('ISRO', 512, 300)
  ctx.font = 'bold 14px system-ui, sans-serif'
  ctx.fillText('HS-1', 512, 322)
  return c
}

// Roughness map — bolts and seams are duller (rougher); broad panels keep
// the brushed-metal shine.  White = rough, black = smooth.
function makeBodyRoughness() {
  const c = document.createElement('canvas')
  c.width = 1024
  c.height = 512
  const ctx = c.getContext('2d')
  ctx.fillStyle = '#5c5c5c'
  ctx.fillRect(0, 0, 1024, 512)
  // Random speckle for variation
  for (let i = 0; i < 9000; i++) {
    const v = 70 + Math.random() * 80
    ctx.fillStyle = `rgb(${v},${v},${v})`
    ctx.fillRect(Math.random() * 1024, Math.random() * 512, 1, 1)
  }
  // Seams brighter (rougher)
  ctx.strokeStyle = '#c8c8c8'
  ctx.lineWidth = 2
  for (let i = 0; i < 6; i++) {
    const x = (i + 0.5) * (1024 / 6)
    ctx.beginPath(); ctx.moveTo(x, 0); ctx.lineTo(x, 512); ctx.stroke()
  }
  for (const y of [110, 256, 402]) {
    ctx.beginPath(); ctx.moveTo(0, y); ctx.lineTo(1024, y); ctx.stroke()
  }
  return c
}

// Heat-shield ablative coating — dark, charred, with hot streaks fading
// upward from the apex.  This sells the "moment before reentry" story.
function makeHeatShieldDiffuse() {
  const c = document.createElement('canvas')
  c.width = 512
  c.height = 512
  const ctx = c.getContext('2d')
  ctx.fillStyle = '#1f1611'
  ctx.fillRect(0, 0, 512, 512)
  // Radial hot streaks (faked re-entry plasma scoring) from the bottom
  for (let i = 0; i < 24; i++) {
    const ang = (i / 24) * Math.PI * 2
    const r0 = 0
    const r1 = 180 + Math.random() * 70
    const g = ctx.createRadialGradient(256, 256, r0, 256, 256, r1)
    g.addColorStop(0, 'rgba(255,120,40,0.18)')
    g.addColorStop(0.4, 'rgba(180,60,20,0.10)')
    g.addColorStop(1, 'rgba(0,0,0,0)')
    ctx.fillStyle = g
    ctx.save()
    ctx.translate(256, 256)
    ctx.rotate(ang)
    ctx.fillRect(-3, 0, 6, r1)
    ctx.restore()
  }
  // Speckled char texture
  for (let i = 0; i < 12000; i++) {
    const r = Math.random()
    const v = r < 0.2 ? 80 + Math.random() * 40 : 25 + Math.random() * 25
    ctx.fillStyle = `rgb(${v * 1.2},${v * 0.85},${v * 0.65})`
    ctx.fillRect(Math.random() * 512, Math.random() * 512, 1 + Math.random() * 1.5, 1 + Math.random() * 1.5)
  }
  return c
}

/* STEP 6 — Gaganyaan capsule.
 *  - Crew module: truncated cone (top 0.08, bottom 0.18, height 0.22)
 *  - Heat shield: hemispherical cap at the wide base
 *  - Service module: short cylinder above the cone
 *  - Solar panels: two thin boxes extending sideways
 *  Positioned at [2.2, 1.4, 0.5] with heat shield angled toward Earth.
 *  No plasma / decals / hover yet — those come in later steps. */
function Capsule() {
  // Procedural canvas textures — memoised so they're created once.
  const bodyMap = useMemo(() => {
    const t = new THREE.CanvasTexture(makeBodyDiffuse())
    t.colorSpace = THREE.SRGBColorSpace
    t.wrapS = t.wrapT = THREE.RepeatWrapping
    t.anisotropy = 8
    return t
  }, [])
  const bodyRoughnessMap = useMemo(() => {
    const t = new THREE.CanvasTexture(makeBodyRoughness())
    t.wrapS = t.wrapT = THREE.RepeatWrapping
    t.anisotropy = 8
    return t
  }, [])
  const heatShieldMap = useMemo(() => {
    const t = new THREE.CanvasTexture(makeHeatShieldDiffuse())
    t.colorSpace = THREE.SRGBColorSpace
    t.anisotropy = 8
    return t
  }, [])

  // Brushed-metal thermal blanket — MeshPhysicalMaterial picks up clearcoat,
  // proper IBL reflections from the <Environment>, and looks distinctly
  // metallic without going chrome-bright.
  const blanket = useMemo(
    () =>
      new THREE.MeshPhysicalMaterial({
        map: bodyMap,
        roughnessMap: bodyRoughnessMap,
        color: '#ffffff',
        metalness: 0.85,
        roughness: 0.38,
        clearcoat: 0.45,
        clearcoatRoughness: 0.22,
        envMapIntensity: 1.2,
      }),
    [bodyMap, bodyRoughnessMap],
  )

  const heatShield = useMemo(
    () =>
      new THREE.MeshPhysicalMaterial({
        map: heatShieldMap,
        color: '#ffffff',
        metalness: 0.25,
        roughness: 0.78,
        clearcoat: 0.15,
        clearcoatRoughness: 0.55,
        envMapIntensity: 0.6,
      }),
    [heatShieldMap],
  )
  const dome = useMemo(
    () =>
      new THREE.MeshPhysicalMaterial({
        color: '#dde2e8',
        metalness: 0.92,
        roughness: 0.22,
        clearcoat: 0.65,
        clearcoatRoughness: 0.15,
        envMapIntensity: 1.4,
      }),
    [],
  )

  const dark = useMemo(
    () =>
      new THREE.MeshStandardMaterial({
        color: '#1a1d24',
        metalness: 0.7,
        roughness: 0.45,
      }),
    [],
  )

  const antenna = useMemo(
    () =>
      new THREE.MeshStandardMaterial({
        color: '#b5b9bd',
        metalness: 1,
        roughness: 0.25,
      }),
    [],
  )

  const accent = useMemo(
    () =>
      new THREE.MeshPhysicalMaterial({
        color: '#d4a017',
        metalness: 1,
        roughness: 0.28,
        clearcoat: 0.5,
        envMapIntensity: 1.4,
      }),
    [],
  )

  // Indian flag canvas texture — desaturated / slightly weathered so it
  // reads as a painted-on decal rather than a neon sticker.  We also add
  // a faint vertical brushed-metal streak so it blends into the body.
  const flagTexture = useMemo(() => {
    const c = document.createElement('canvas')
    c.width = 192
    c.height = 128
    const ctx = c.getContext('2d')
    // Brightened saffron / white / green — readable on the metallic body
    // but a touch softened so it still feels painted-on, not neon sticker.
    ctx.fillStyle = '#ee9433'
    ctx.fillRect(0, 0, 192, 43)
    ctx.fillStyle = '#f4f5f6'
    ctx.fillRect(0, 43, 192, 42)
    ctx.fillStyle = '#178a10'
    ctx.fillRect(0, 85, 192, 43)
    // Ashoka Chakra in deep navy
    const cx = 96
    const cy = 64
    const r = 17
    ctx.strokeStyle = '#1a1f70'
    ctx.lineWidth = 2
    ctx.beginPath()
    ctx.arc(cx, cy, r, 0, Math.PI * 2)
    ctx.stroke()
    ctx.lineWidth = 1
    for (let i = 0; i < 24; i++) {
      const a = (i / 24) * Math.PI * 2
      ctx.beginPath()
      ctx.moveTo(cx, cy)
      ctx.lineTo(cx + Math.cos(a) * r, cy + Math.sin(a) * r)
      ctx.stroke()
    }
    // Brushed-metal streaks on top so it shares the body's grain
    for (let i = 0; i < 120; i++) {
      const y = Math.random() * 128
      const w = 8 + Math.random() * 30
      const x = Math.random() * 192
      ctx.strokeStyle = `rgba(255,255,255,${0.025 + Math.random() * 0.04})`
      ctx.lineWidth = 0.5
      ctx.beginPath()
      ctx.moveTo(x, y)
      ctx.lineTo(x + w, y)
      ctx.stroke()
    }
    // Very light vignette — feathers the edges without dimming the flag
    const vg = ctx.createRadialGradient(96, 64, 50, 96, 64, 115)
    vg.addColorStop(0, 'rgba(0,0,0,0)')
    vg.addColorStop(1, 'rgba(0,0,0,0.12)')
    ctx.fillStyle = vg
    ctx.fillRect(0, 0, 192, 128)
    const tex = new THREE.CanvasTexture(c)
    tex.colorSpace = THREE.SRGBColorSpace
    return tex
  }, [])

  // Flag material — PBR with metallic blend so it picks up the same
  // environment reflections as the body and reads as "painted on metal".
  const flagMat = useMemo(
    () =>
      new THREE.MeshPhysicalMaterial({
        map: flagTexture,
        color: '#ffffff',
        metalness: 0.25,
        roughness: 0.55,
        clearcoat: 0.25,
        clearcoatRoughness: 0.45,
        envMapIntensity: 0.55,
      }),
    [flagTexture],
  )

  // Ultra-realistic spacecraft window — dark mirror-like glass that picks
  // up the environment hard.  Near-zero roughness + full clearcoat gives
  // the deep gloss you see on Apollo/Soyuz/Gaganyaan portholes.
  const windowGlass = useMemo(
    () =>
      new THREE.MeshPhysicalMaterial({
        color: '#05080c',
        metalness: 1,
        roughness: 0.04,
        clearcoat: 1,
        clearcoatRoughness: 0,
        envMapIntensity: 2.5,
      }),
    [],
  )

  // Window frame — brushed metallic bezel around each porthole.
  const windowFrame = useMemo(
    () =>
      new THREE.MeshPhysicalMaterial({
        color: '#9ea3a8',
        metalness: 1,
        roughness: 0.25,
        clearcoat: 0.4,
        envMapIntensity: 1.4,
      }),
    [],
  )

  // Cone radius at height y (cone goes from r=0.18 at y=-0.11 to r=0.08 at y=0.11)
  const coneR = (y) => 0.18 - (y + 0.11) * ((0.18 - 0.08) / 0.22)

  // 3 portholes spread across the upper-front of the cone.
  // Radial offset 0.005 outside the actual cone radius prevents the
  // outer bezel rings from sinking into the cone (z-fighting).
  const windows = useMemo(
    () =>
      [-65, 0, 65].map((deg) => {
        const a = THREE.MathUtils.degToRad(deg)
        const r = coneR(0.05) + 0.005
        return {
          pos: [Math.sin(a) * r, 0.05, Math.cos(a) * r],
          ry: a,
        }
      }),
    [],
  )

  // Hover state — debounced so we don't flicker when the cursor
  // crosses between sub-meshes of the capsule (the brief out→over
  // sequence is swallowed by a small leave-delay).
  const [hovered, setHovered] = useState(false)
  const leaveTimer = useRef(null)
  const handleOver = (e) => {
    e.stopPropagation()
    if (leaveTimer.current) {
      clearTimeout(leaveTimer.current)
      leaveTimer.current = null
    }
    setHovered(true)
  }
  const handleOut = (e) => {
    e.stopPropagation()
    if (leaveTimer.current) clearTimeout(leaveTimer.current)
    leaveTimer.current = setTimeout(() => {
      setHovered(false)
      leaveTimer.current = null
    }, 80)
  }
  useEffect(() => {
    document.body.style.cursor = hovered ? 'pointer' : 'auto'
    return () => {
      document.body.style.cursor = 'auto'
    }
  }, [hovered])
  useEffect(
    () => () => {
      if (leaveTimer.current) clearTimeout(leaveTimer.current)
    },
    [],
  )

  // RCS thruster cluster — 8 nozzles in 4 pairs around the top.
  // Radial position is computed from the cone's actual radius at each
  // thruster Y so the nozzles sit flush with the cone surface instead of
  // floating above it / embedded in it.
  const thrusters = useMemo(() => {
    const out = []
    for (const deg of [45, 135, 225, 315]) {
      const a = THREE.MathUtils.degToRad(deg)
      const yTop = 0.1
      const yBot = 0.07
      const rTop = coneR(yTop) + 0.002
      const rBot = coneR(yBot) + 0.002
      out.push({
        pos: [Math.cos(a) * rTop, yTop, Math.sin(a) * rTop],
        ry: -a,
        scale: 1,
      })
      out.push({
        pos: [Math.cos(a) * rBot, yBot, Math.sin(a) * rBot],
        ry: -a,
        scale: 0.75,
      })
    }
    return out
  }, [])

  // Dome grab handles — 3 small radial cylinders for crew EVA/recovery.
  const handles = useMemo(
    () =>
      [0, 120, 240].map((deg) => {
        const a = THREE.MathUtils.degToRad(deg)
        return { pos: [Math.cos(a) * 0.05, 0.175, Math.sin(a) * 0.05], ry: -a }
      }),
    [],
  )

  return (
    <group
      // Pushed further from Earth (distance from origin ≈ 3.85) and scaled
      // down 30% so the capsule reads as a smaller, more distant orbiter.
      position={[0.58, 0.23, 3.78]}
      scale={0.7}
      // 45° pitch down + 60° roll to the left.
      rotation={[
        THREE.MathUtils.degToRad(45),
        0,
        THREE.MathUtils.degToRad(60),
      ]}
      onPointerOver={handleOver}
      onPointerOut={handleOut}
    >
      {/* Crew module — truncated cone, wide end down in local frame.
          Slightly higher segment count for smoother specular highlights. */}
      <mesh material={blanket}>
        <cylinderGeometry args={[0.08, 0.18, 0.22, 64, 1]} />
      </mesh>

      {/* Heat shield — Y-scaled to ~45% depth so it reads as a shallow
          saucer (less oval-looking) instead of a deep hemispherical bowl.
          Rim still meets the cone base at y=-0.11. */}
      <mesh material={heatShield} position={[0, -0.11, 0]} scale={[1, 0.45, 1]}>
        <sphereGeometry
          args={[0.18, 48, 48, 0, Math.PI * 2, Math.PI / 2, Math.PI / 2]}
        />
      </mesh>

      {/* Upper cone reinforcement band */}
      <mesh
        material={dark}
        position={[0, 0.07, 0]}
        rotation={[Math.PI / 2, 0, 0]}
      >
        <torusGeometry args={[0.105, 0.004, 12, 48]} />
      </mesh>

      {/* Cupola / docking dome — radius bumped to 0.08 to match the cone's
          top radius, and seated at y=0.11 (exactly the cone top) so there
          is no gap between the cone and the dome. */}
      <mesh material={dome} position={[0, 0.11, 0]}>
        <sphereGeometry args={[0.08, 36, 24, 0, Math.PI * 2, 0, Math.PI / 2]} />
      </mesh>

      {/* Dome grab/handle bars — sit on the dome surface */}
      {handles.map(({ pos, ry }, i) => (
        <group key={`handle-${i}`} position={[pos[0] * 1.16, 0.155, pos[2] * 1.16]} rotation={[0, ry, 0]}>
          <mesh material={antenna} rotation={[0, 0, Math.PI / 2]}>
            <cylinderGeometry args={[0.0035, 0.0035, 0.02, 10]} />
          </mesh>
        </group>
      ))}

      {/* RCS thruster nozzles — 8 in 4 pairs, oriented outward */}
      {thrusters.map(({ pos, ry, scale }, i) => (
        <group key={`rcs-${i}`} position={pos} rotation={[0, ry, 0]} scale={scale}>
          <mesh material={dark} rotation={[0, 0, Math.PI / 2]}>
            <cylinderGeometry args={[0.006, 0.010, 0.016, 14]} />
          </mesh>
          {/* Inner bore — slightly emissive so the nozzle catches a hint of light */}
          <mesh
            material={dark}
            rotation={[0, 0, Math.PI / 2]}
            position={[0.008, 0, 0]}
          >
            <ringGeometry args={[0.003, 0.008, 18]} />
          </mesh>
        </group>
      ))}

      {/* Indian flag — centered on the cone's front face, just below the
          row of windows.  Tilt matches the cone's exact slope and plane
          is offset slightly outward to avoid z-fighting. */}
      <mesh
        material={flagMat}
        position={[0, -0.02, 0.145]}
        rotation={[
          -Math.atan((0.18 - 0.08) / 0.22),
          0,
          THREE.MathUtils.degToRad(-3),
        ]}
      >
        <planeGeometry args={[0.08, 0.053]} />
      </mesh>

      {/* Hover highlight — wireframe halo around the capsule + leader
          line up to the tooltip card.  Only rendered while hovered. */}
      {hovered && (
        <>
          {/* Glowing wireframe halo (sized to clearly enclose the capsule).
              raycast disabled so it can't fire its own pointer events. */}
          <mesh raycast={() => null}>
            <sphereGeometry args={[0.35, 36, 24]} />
            <meshBasicMaterial
              color="#7ad6ff"
              wireframe
              transparent
              opacity={0.28}
              depthWrite={false}
            />
          </mesh>
          {/* Soft additive sphere just inside the wireframe for a glow */}
          <mesh raycast={() => null}>
            <sphereGeometry args={[0.34, 32, 24]} />
            <meshBasicMaterial
              color="#7ad6ff"
              transparent
              opacity={0.05}
              blending={THREE.AdditiveBlending}
              depthWrite={false}
              side={THREE.BackSide}
            />
          </mesh>
          {/* Leader line — halo edge → tooltip anchor.
              Longer run so the text card sits clearly off to one side
              of the capsule with a visible connector. */}
          <Line
            points={[
              [0, 0.36, 0],
              [0, 0.68, 0],
            ]}
            color="#a8e3ff"
            lineWidth={1.4}
            transparent
            opacity={0.9}
          />
          {/* Small dot where the line meets the tooltip — nice touchpoint */}
          <mesh position={[0, 0.68, 0]} raycast={() => null}>
            <sphereGeometry args={[0.012, 16, 16]} />
            <meshBasicMaterial color="#a8e3ff" transparent opacity={0.95} />
          </mesh>
          {/* Tooltip card — modest offset above the capsule */}
          <Html
            position={[0, 0.75, 0]}
            center
            distanceFactor={1.2}
            zIndexRange={[100, 0]}
            pointerEvents="none"
          >
            <div className="mse-capsule-tooltip">
              <span className="mse-tooltip-label">Fabricated by</span>
              <strong className="mse-tooltip-name">Madras Swastic Engineers</strong>
              <span className="mse-tooltip-mission">for Gaganyaan mission</span>
            </div>
          </Html>
        </>
      )}

      {/* Ultra-realistic portholes.
          - Outer body: short cylinder sunk into the cone, dark interior
          - Glass disc: mirror-grade PBR with high envMapIntensity
          - Bezel ring: brushed metal frame around the glass */}
      {windows.map(({ pos, ry }, i) => (
        <group
          key={`win-${i}`}
          position={pos}
          rotation={[-Math.atan((0.18 - 0.08) / 0.22), ry, 0]}
        >
          {/* Recessed barrel behind the glass — gives the window depth */}
          <mesh material={dark} position={[0, 0, -0.005]} rotation={[Math.PI / 2, 0, 0]}>
            <cylinderGeometry args={[0.0145, 0.0145, 0.012, 24, 1, true]} />
          </mesh>
          {/* Glass disc — slightly proud of the cone surface */}
          <mesh material={windowGlass} position={[0, 0, 0.003]}>
            <circleGeometry args={[0.0145, 32]} />
          </mesh>
          {/* Inner bezel — thin reflective frame */}
          <mesh material={windowFrame} position={[0, 0, 0.0035]}>
            <torusGeometry args={[0.0155, 0.0018, 12, 32]} />
          </mesh>
          {/* Outer bezel — thicker outer ring for the porthole housing */}
          <mesh material={windowFrame} position={[0, 0, 0.001]}>
            <torusGeometry args={[0.019, 0.003, 14, 36]} />
          </mesh>
        </group>
      ))}
    </group>
  )
}

function EarthFallback() {
  return (
    <mesh>
      <sphereGeometry args={[3, 48, 48]} />
      <meshStandardMaterial color="#1a3a5c" roughness={1} />
    </mesh>
  )
}

export default function SpaceScene() {
  return (
    <>
      <style>{tooltipCss}</style>
      <Canvas
        dpr={[1, 2]}
        gl={{
          antialias: true,
          alpha: true,
          toneMapping: THREE.ACESFilmicToneMapping,
          outputColorSpace: THREE.SRGBColorSpace,
        }}
        camera={{ position: [0, 0, 8], fov: 45 }}
        style={{ width: '100%', height: '100%', background: 'transparent' }}
      >
        <ambientLight intensity={0.12} />
        <directionalLight position={[10, 5, 5]} intensity={2.5} color="#fff5e6" />

        {/* IBL — drives PBR reflections on metallic surfaces.  Loaded at low
            resolution and used for reflections only (no scene background). */}
        <Environment preset="city" background={false} resolution={64} />

        <Suspense fallback={<EarthFallback />}>
          <Earth />
        </Suspense>

        <Capsule />

        <OrbitControls
          enablePan={false}
          enableZoom
          zoomSpeed={0.6}
          enableDamping
          dampingFactor={0.08}
          minDistance={5}
          maxDistance={20}
        />
      </Canvas>
    </>
  )
}

/* ──────────────────────────────────────────────────────────────────────────
 *  Tooltip styles — glassmorphic card with a tricolor accent border.
 * ────────────────────────────────────────────────────────────────────────── */
const tooltipCss = `
.mse-capsule-tooltip {
  display: flex;
  flex-direction: column;
  gap: 4px;
  padding: 14px 18px;
  background: rgba(8, 12, 22, 0.82);
  backdrop-filter: blur(14px);
  -webkit-backdrop-filter: blur(14px);
  color: #f4f7fb;
  font-family: Inter, system-ui, -apple-system, sans-serif;
  font-size: 13px;
  line-height: 1.35;
  letter-spacing: 0.01em;
  border-radius: 10px;
  border-left: 3px solid;
  border-image: linear-gradient(
    to bottom,
    #ff9933 0 33%,
    #ffffff 33% 66%,
    #138808 66% 100%
  ) 1;
  box-shadow: 0 10px 28px rgba(0, 0, 0, 0.45);
  white-space: nowrap;
  pointer-events: none;
  opacity: 0;
  transform: translateY(6px);
  animation: mseTooltipIn 200ms ease-out forwards;
  user-select: none;
}
.mse-tooltip-label {
  font-size: 11px;
  text-transform: uppercase;
  letter-spacing: 0.12em;
  opacity: 0.7;
}
.mse-tooltip-name {
  font-weight: 600;
  font-size: 15px;
  letter-spacing: 0.005em;
}
.mse-tooltip-mission {
  font-size: 12px;
  opacity: 0.85;
}
@keyframes mseTooltipIn {
  to {
    opacity: 1;
    transform: translateY(0);
  }
}
`
