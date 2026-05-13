import * as THREE from 'three'
import { useMemo, useReducer, useRef } from 'react'
import { Canvas, useFrame } from '@react-three/fiber'
import { Environment, Lightformer } from '@react-three/drei'
import { BallCollider, CuboidCollider, Physics, RigidBody } from '@react-three/rapier'

/**
 * pmndrs "Lusion Connectors" example — re-implemented procedurally so we
 * don't have to host the original c-transformed.glb. Each connector is
 * three perpendicular hollow pipe arms with a central hub, matching the
 * silhouette of the reference image.
 *
 * https://pmndrs.github.io/examples/lusion-connectors/
 */

// Palette tuned to the brand + the reference image (deep navy + bold blue + gold).
const ACCENTS = ['#2540a8', '#f0c674', '#5aa6ff', '#d4a24c']

const palette = (accentIdx = 0) => [
  { color: '#03061a', roughness: 0.35, metalness: 0.6 },
  { color: '#0a1133', roughness: 0.4, metalness: 0.55 },
  { color: '#06091f', roughness: 0.4, metalness: 0.6 },
  { color: '#2540a8', roughness: 0.35, metalness: 0.5, accent: true },
  { color: '#1e40af', roughness: 0.4, metalness: 0.5 },
  { color: '#0a1133', roughness: 0.35, metalness: 0.6 },
  { color: ACCENTS[accentIdx], roughness: 0.3, metalness: 0.55, accent: true },
  { color: '#2540a8', roughness: 0.35, metalness: 0.5, accent: true },
  { color: '#06091f', roughness: 0.4, metalness: 0.6 },
]

// One arm of the connector: a hollow pipe with proper inside walls and end
// rings. LatheGeometry revolves the profile so caps + outer + inner are one mesh.
function PipeArm({ length = 2.4, outerR = 0.55, innerR = 0.22, color, roughness, metalness }) {
  const geometry = useMemo(() => {
    const half = length / 2
    const profile = [
      new THREE.Vector2(innerR, -half),
      new THREE.Vector2(outerR, -half),
      new THREE.Vector2(outerR, half),
      new THREE.Vector2(innerR, half),
    ]
    const g = new THREE.LatheGeometry(profile, 32)
    g.computeVertexNormals()
    return g
  }, [length, outerR, innerR])

  return (
    <mesh castShadow receiveShadow geometry={geometry}>
      <meshStandardMaterial
        color={color}
        roughness={roughness}
        metalness={metalness}
        side={THREE.DoubleSide}
      />
    </mesh>
  )
}

// Three perpendicular arms + a central hub sphere = one connector piece.
function ConnectorMesh({ color, roughness, metalness }) {
  return (
    <group>
      {/* Vertical arm (Y) */}
      <PipeArm color={color} roughness={roughness} metalness={metalness} />
      {/* Horizontal arm (X) */}
      <group rotation={[0, 0, Math.PI / 2]}>
        <PipeArm color={color} roughness={roughness} metalness={metalness} />
      </group>
      {/* Depth arm (Z) */}
      <group rotation={[Math.PI / 2, 0, 0]}>
        <PipeArm color={color} roughness={roughness} metalness={metalness} />
      </group>
      {/* Central hub — hides the seams where pipes meet */}
      <mesh castShadow receiveShadow>
        <sphereGeometry args={[0.62, 24, 24]} />
        <meshStandardMaterial color={color} roughness={roughness} metalness={metalness} />
      </mesh>
    </group>
  )
}

function Connector({ position, accent, color, roughness, metalness }) {
  const api = useRef(null)
  const vec = useMemo(() => new THREE.Vector3(), [])
  const r = THREE.MathUtils.randFloatSpread
  const startPos = useMemo(() => position || [r(10), r(10), r(10)], [position, r])

  useFrame((_, delta) => {
    const dt = Math.min(0.1, delta)
    if (api.current) {
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
      {/* Three slab colliders approximating the connector volume */}
      <CuboidCollider args={[0.55, 1.2, 0.55]} />
      <CuboidCollider args={[1.2, 0.55, 0.55]} />
      <CuboidCollider args={[0.55, 0.55, 1.2]} />
      <ConnectorMesh color={color} roughness={roughness} metalness={metalness} />
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
      gl={{ antialias: true, alpha: true }}
      camera={{ position: [0, 0, 15], fov: 17.5, near: 1, far: 20 }}
      style={{ width: '100%', height: '100%' }}
    >
      <ambientLight intensity={0.35} />
      <spotLight
        position={[10, 10, 10]}
        angle={0.18}
        penumbra={1}
        intensity={1.2}
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
