import { Suspense, useRef, useState } from 'react'
import { Canvas, useFrame } from '@react-three/fiber'
import { OrbitControls, Stars, Float } from '@react-three/drei'
import * as THREE from 'three'

/* =========================================================
 * The capsule — built from primitive geometries.
 * Boeing Starliner / Crew-Dragon inspired silhouette.
 * ========================================================= */
function Capsule() {
  const group = useRef(null)
  const flame = useRef(null)
  const [hovered, setHovered] = useState(false)

  useFrame((state, dt) => {
    if (!group.current) return
    // Subtle scale-on-hover
    const target = hovered ? 1.06 : 1
    group.current.scale.lerp({ x: target, y: target, z: target }, 0.08)
    // Flicker the engine flame
    if (flame.current) {
      flame.current.scale.y = 1 + Math.sin(state.clock.elapsedTime * 30) * 0.15
      flame.current.material.opacity = 0.7 + Math.sin(state.clock.elapsedTime * 25) * 0.2
    }
  })

  return (
    <group
      ref={group}
      onPointerOver={(e) => {
        e.stopPropagation()
        setHovered(true)
        document.body.style.cursor = 'grab'
      }}
      onPointerOut={() => {
        setHovered(false)
        document.body.style.cursor = 'auto'
      }}
      rotation={[0.1, 0.4, 0.15]}
    >
      {/* ===== Top dome (command module nose) ===== */}
      <mesh position={[0, 0.7, 0]} castShadow>
        <sphereGeometry args={[0.5, 48, 32, 0, Math.PI * 2, 0, Math.PI / 2.2]} />
        <meshStandardMaterial color="#eef1f6" metalness={0.55} roughness={0.32} />
      </mesh>

      {/* ===== Body — truncated cone ===== */}
      <mesh position={[0, 0.05, 0]} castShadow>
        <cylinderGeometry args={[0.5, 0.92, 1.3, 64, 1, false]} />
        <meshStandardMaterial color="#f4f5f9" metalness={0.45} roughness={0.42} />
      </mesh>

      {/* Dark equipment ring near the dome */}
      <mesh position={[0, 0.62, 0]}>
        <cylinderGeometry args={[0.5, 0.5, 0.04, 64]} />
        <meshStandardMaterial color="#161821" metalness={0.7} roughness={0.4} />
      </mesh>

      {/* ===== Heat shield ===== */}
      <mesh position={[0, -0.7, 0]} castShadow>
        <cylinderGeometry args={[0.92, 0.7, 0.22, 64]} />
        <meshStandardMaterial color="#9a6a3a" metalness={0.85} roughness={0.35} emissive="#3a1d08" emissiveIntensity={0.4} />
      </mesh>
      {/* Heat-shield base disc */}
      <mesh position={[0, -0.82, 0]}>
        <cylinderGeometry args={[0.7, 0.66, 0.08, 64]} />
        <meshStandardMaterial color="#5a3818" metalness={0.7} roughness={0.5} />
      </mesh>

      {/* ===== Window (front-facing, with emissive interior glow) ===== */}
      <mesh position={[0, 0.32, 0.49]}>
        <circleGeometry args={[0.09, 32]} />
        <meshStandardMaterial color="#0a1230" emissive="#4a8eff" emissiveIntensity={1.4} />
      </mesh>
      <mesh position={[0, 0.32, 0.495]}>
        <torusGeometry args={[0.11, 0.012, 16, 48]} />
        <meshStandardMaterial color="#1a1d2a" metalness={0.7} roughness={0.4} />
      </mesh>

      {/* ===== Hatch panel ===== */}
      <mesh position={[0, 0, 0.62]} rotation={[0.05, 0, 0]}>
        <boxGeometry args={[0.32, 0.36, 0.015]} />
        <meshStandardMaterial color="#1c1e25" metalness={0.6} roughness={0.55} />
      </mesh>
      {/* Hatch rivets */}
      {Array.from({ length: 12 }).map((_, i) => {
        const angle = (i / 12) * Math.PI * 2
        const x = Math.cos(angle) * 0.15
        const y = Math.sin(angle) * 0.16
        return (
          <mesh key={i} position={[x, y, 0.628]}>
            <sphereGeometry args={[0.012, 8, 8]} />
            <meshStandardMaterial color="#c9c9cf" metalness={0.9} roughness={0.3} />
          </mesh>
        )
      })}

      {/* ===== Side rails (4 around the body) ===== */}
      {Array.from({ length: 4 }).map((_, i) => {
        const angle = (i / 4) * Math.PI * 2 + Math.PI / 4
        return (
          <mesh
            key={i}
            position={[Math.cos(angle) * 0.7, -0.05, Math.sin(angle) * 0.7]}
            rotation={[0, -angle + Math.PI / 2, 0.18]}
          >
            <boxGeometry args={[0.04, 0.7, 0.02]} />
            <meshStandardMaterial color="#0f1118" metalness={0.6} roughness={0.5} />
          </mesh>
        )
      })}

      {/* ===== Logo plate "MSE" ===== */}
      <mesh position={[0.36, 0.05, 0.4]} rotation={[0, 0.55, 0]}>
        <boxGeometry args={[0.18, 0.22, 0.005]} />
        <meshStandardMaterial color="#0d0f15" emissive="#f0c674" emissiveIntensity={0.3} />
      </mesh>

      {/* ===== Antenna ===== */}
      <mesh position={[0, 1.1, 0]}>
        <cylinderGeometry args={[0.012, 0.012, 0.35, 8]} />
        <meshStandardMaterial color="#bfc1c9" metalness={0.8} roughness={0.3} />
      </mesh>
      <mesh position={[0, 1.31, 0]}>
        <sphereGeometry args={[0.034, 16, 16]} />
        <meshStandardMaterial color="#f0c674" emissive="#f0c674" emissiveIntensity={2.2} />
      </mesh>

      {/* ===== Engine plume (under heat shield) ===== */}
      <mesh ref={flame} position={[0, -1.05, 0]} scale={[1, 1, 1]}>
        <coneGeometry args={[0.32, 0.7, 32, 1, true]} />
        <meshBasicMaterial
          color="#5aa6ff"
          transparent
          opacity={0.85}
          side={THREE.DoubleSide}
          blending={THREE.AdditiveBlending}
          depthWrite={false}
        />
      </mesh>
      <mesh position={[0, -1.4, 0]}>
        <coneGeometry args={[0.18, 0.6, 32, 1, true]} />
        <meshBasicMaterial
          color="#ffd27a"
          transparent
          opacity={0.6}
          side={THREE.DoubleSide}
          blending={THREE.AdditiveBlending}
          depthWrite={false}
        />
      </mesh>
    </group>
  )
}

/* =========================================================
 * Earth — procedural, no external textures required.
 * Layered atmosphere for the iconic blue rim glow.
 * ========================================================= */
function Earth() {
  const earth = useRef(null)
  const clouds = useRef(null)

  useFrame((_, dt) => {
    if (earth.current) earth.current.rotation.y += dt * 0.04
    if (clouds.current) clouds.current.rotation.y += dt * 0.06
  })

  return (
    <group position={[2.3, -2.6, -2.5]} rotation={[0.2, 0, -0.1]}>
      {/* Planet core */}
      <mesh ref={earth}>
        <sphereGeometry args={[2.4, 64, 64]} />
        <meshStandardMaterial
          color="#1e4f9a"
          emissive="#0a2452"
          emissiveIntensity={0.35}
          roughness={0.95}
          metalness={0}
        />
      </mesh>

      {/* "Continent" splotches — slightly larger sphere with patchy opacity */}
      <mesh ref={clouds} scale={1.005}>
        <sphereGeometry args={[2.4, 64, 64]} />
        <meshStandardMaterial
          color="#3c8a4a"
          transparent
          opacity={0.55}
          roughness={1}
          alphaMap={useProceduralPatchMap()}
        />
      </mesh>

      {/* Inner atmosphere */}
      <mesh scale={1.04}>
        <sphereGeometry args={[2.4, 64, 64]} />
        <meshBasicMaterial color="#5aa6ff" transparent opacity={0.18} side={THREE.BackSide} blending={THREE.AdditiveBlending} />
      </mesh>
      {/* Outer atmosphere — soft rim glow */}
      <mesh scale={1.13}>
        <sphereGeometry args={[2.4, 64, 64]} />
        <meshBasicMaterial color="#7ec0ff" transparent opacity={0.08} side={THREE.BackSide} blending={THREE.AdditiveBlending} />
      </mesh>
    </group>
  )
}

/* Generate a noisy alpha map once for "continent" patches */
function useProceduralPatchMap() {
  const ref = useRef(null)
  if (!ref.current) {
    const size = 256
    const canvas = document.createElement('canvas')
    canvas.width = size
    canvas.height = size
    const ctx = canvas.getContext('2d')
    ctx.fillStyle = 'black'
    ctx.fillRect(0, 0, size, size)
    // Random blobs
    for (let i = 0; i < 90; i++) {
      const x = Math.random() * size
      const y = Math.random() * size
      const r = 8 + Math.random() * 36
      const g = ctx.createRadialGradient(x, y, 0, x, y, r)
      g.addColorStop(0, `rgba(255,255,255,${0.5 + Math.random() * 0.5})`)
      g.addColorStop(1, 'rgba(255,255,255,0)')
      ctx.fillStyle = g
      ctx.beginPath()
      ctx.arc(x, y, r, 0, Math.PI * 2)
      ctx.fill()
    }
    const tex = new THREE.CanvasTexture(canvas)
    tex.wrapS = tex.wrapT = THREE.RepeatWrapping
    ref.current = tex
  }
  return ref.current
}

/* =========================================================
 * Scene wrapper
 * ========================================================= */
export default function SpaceCapsule() {
  return (
    <Canvas
      shadows
      dpr={[1, 1.6]}
      camera={{ position: [0, 0.1, 3.6], fov: 42 }}
      gl={{ antialias: true, alpha: false, powerPreference: 'high-performance' }}
      style={{ touchAction: 'pan-y' }}
    >
      <color attach="background" args={['#02030c']} />
      <fog attach="fog" args={['#02030c', 8, 18]} />

      {/* Sun-like key light */}
      <directionalLight
        position={[5, 3, 4]}
        intensity={2.2}
        color="#fff5d6"
        castShadow
        shadow-mapSize-width={1024}
        shadow-mapSize-height={1024}
      />
      {/* Earth bounce — cool fill */}
      <pointLight position={[3, -3, -2]} intensity={1.6} color="#5aa6ff" distance={10} />
      {/* Soft ambient */}
      <ambientLight intensity={0.18} />
      {/* Rim from behind */}
      <directionalLight position={[-3, 1, -3]} intensity={0.6} color="#9ec5ff" />

      <Suspense fallback={null}>
        {/* Deep-space starfield */}
        <Stars
          radius={60}
          depth={50}
          count={2500}
          factor={2.2}
          fade
          speed={0.4}
        />

        {/* Earth in the lower-right of frame */}
        <Earth />

        {/* Capsule floats with subtle motion */}
        <Float speed={1.1} rotationIntensity={0.35} floatIntensity={0.7} floatingRange={[-0.05, 0.05]}>
          <group scale={0.95} position={[-0.15, 0.15, 0]}>
            <Capsule />
          </group>
        </Float>

        {/* A few foreground sparkle stars closer to camera */}
        <Stars radius={8} depth={6} count={150} factor={0.5} fade speed={1.2} />
      </Suspense>

      {/* Drag-to-rotate; wheel zoom disabled so page scroll wins */}
      <OrbitControls
        enablePan={false}
        enableZoom={false}
        rotateSpeed={0.7}
        minPolarAngle={Math.PI / 3.4}
        maxPolarAngle={Math.PI / 1.6}
        autoRotate
        autoRotateSpeed={0.55}
      />
    </Canvas>
  )
}
