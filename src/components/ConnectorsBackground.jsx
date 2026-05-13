import * as THREE from 'three'
import { useMemo, useReducer, useRef } from 'react'
import { Canvas, useFrame } from '@react-three/fiber'
import { Environment, Lightformer } from '@react-three/drei'
import { BallCollider, CuboidCollider, Physics, RigidBody } from '@react-three/rapier'

/**
 * Adapted from the pmndrs "Lusion Connectors" example:
 * https://pmndrs.github.io/examples/lusion-connectors/
 *
 * Differences vs. the original:
 *  - "+" connector shape built from two crossed boxes (no GLB asset needed).
 *  - Brand palette: navy + gold + electric blue, no pastels.
 *  - Postprocessing dropped (saves ~150 KB and a heavy AO pass).
 *  - Renders transparent so the section's glass surface shows through.
 */

const ACCENTS = ['#f0c674', '#5aa6ff', '#d4a24c', '#ffffff']

const palette = (accentIdx = 0) => [
  { color: '#03061a', roughness: 0.1 },
  { color: '#06091f', roughness: 0.4 },
  { color: '#0a1133', roughness: 0.1 },
  { color: '#ffffff', roughness: 0.15, accent: true },
  { color: '#ffffff', roughness: 0.75 },
  { color: '#ffffff', roughness: 0.75 },
  { color: ACCENTS[accentIdx], roughness: 0.15, accent: true },
  { color: ACCENTS[accentIdx], roughness: 0.75, accent: true },
  { color: ACCENTS[accentIdx], roughness: 0.15, accent: true },
]

function PlusModel({ color = 'white', roughness = 0 }) {
  const material = useMemo(
    () => new THREE.MeshStandardMaterial({ color, roughness, metalness: 0.25 }),
    [color, roughness]
  )
  return (
    <group dispose={null}>
      <mesh castShadow receiveShadow material={material}>
        <boxGeometry args={[0.76, 2.54, 0.76]} />
      </mesh>
      <mesh castShadow receiveShadow rotation={[0, 0, Math.PI / 2]} material={material}>
        <boxGeometry args={[0.76, 2.54, 0.76]} />
      </mesh>
    </group>
  )
}

function Connector({ position, accent, color, roughness }) {
  const api = useRef(null)
  const vec = useMemo(() => new THREE.Vector3(), [])
  const r = THREE.MathUtils.randFloatSpread
  const startPos = useMemo(() => position || [r(10), r(10), r(10)], [position, r])

  useFrame((_, delta) => {
    const dt = Math.min(0.1, delta)
    if (api.current) {
      // Gentle pull toward the centre — keeps connectors clustered around the camera.
      api.current.applyImpulse(
        vec.copy(api.current.translation()).negate().multiplyScalar(0.2 * dt * 60)
      )
    }
  })

  return (
    <RigidBody
      ref={api}
      position={startPos}
      linearDamping={4}
      angularDamping={1}
      friction={0.1}
      colliders={false}
    >
      <CuboidCollider args={[0.38, 1.27, 0.38]} />
      <CuboidCollider args={[1.27, 0.38, 0.38]} />
      <CuboidCollider args={[0.38, 0.38, 1.27]} />
      <PlusModel color={color} roughness={roughness} />
      {accent && <pointLight intensity={3} distance={3} color={color} />}
    </RigidBody>
  )
}

function Pointer() {
  const ref = useRef(null)
  const vec = useMemo(() => new THREE.Vector3(), [])
  useFrame(({ pointer, viewport }) => {
    if (!ref.current) return
    ref.current.setNextKinematicTranslation(
      vec.set((pointer.x * viewport.width) / 2, (pointer.y * viewport.height) / 2, 0)
    )
  })
  return (
    <RigidBody type="kinematicPosition" colliders={false} ref={ref}>
      <BallCollider args={[1]} />
    </RigidBody>
  )
}

export default function ConnectorsBackground() {
  const [accentIdx, cycle] = useReducer((s) => (s + 1) % ACCENTS.length, 0)
  const connectors = useMemo(() => palette(accentIdx), [accentIdx])

  return (
    <Canvas
      onClick={cycle}
      shadows
      dpr={[1, 1.5]}
      gl={{ antialias: false, alpha: true }}
      camera={{ position: [0, 0, 15], fov: 17.5, near: 1, far: 20 }}
      style={{ width: '100%', height: '100%' }}
    >
      <ambientLight intensity={0.4} />
      <spotLight
        position={[10, 10, 10]}
        angle={0.15}
        penumbra={1}
        intensity={1}
        castShadow
      />
      <Physics gravity={[0, 0, 0]} timeStep="vary">
        <Pointer />
        {connectors.map((props, i) => (
          <Connector key={i} {...props} />
        ))}
      </Physics>
      <Environment resolution={256}>
        <group rotation={[-Math.PI / 3, 0, 1]}>
          <Lightformer
            form="circle"
            intensity={4}
            rotation-x={Math.PI / 2}
            position={[0, 5, -9]}
            scale={2}
          />
          <Lightformer
            form="circle"
            intensity={2}
            rotation-y={Math.PI / 2}
            position={[-5, 1, -1]}
            scale={2}
          />
          <Lightformer
            form="circle"
            intensity={2}
            rotation-y={Math.PI / 2}
            position={[-5, -1, -1]}
            scale={2}
          />
          <Lightformer
            form="circle"
            intensity={2}
            rotation-y={-Math.PI / 2}
            position={[10, 1, 0]}
            scale={8}
          />
        </group>
      </Environment>
    </Canvas>
  )
}
