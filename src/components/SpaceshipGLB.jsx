import { Suspense, useEffect, useRef } from 'react'
import * as THREE from 'three'
import { Canvas, useFrame, useThree } from '@react-three/fiber'
import {
  ContactShadows,
  Environment,
  OrbitControls,
  useGLTF,
  Center,
} from '@react-three/drei'

const MODEL = '/spaceship/base.opt.glb'
useGLTF.preload(MODEL)

function Ship({ spin, float, tilt }) {
  const ref = useRef(null)
  const { scene } = useGLTF(MODEL)

  useFrame((state, dt) => {
    if (!ref.current) return
    if (spin) ref.current.rotation.y += dt * 0.1
    if (float) {
      const t = state.clock.getElapsedTime()
      ref.current.position.y = Math.sin(t * 0.9) * 0.08
      ref.current.rotation.z = tilt + Math.sin(t * 0.6) * 0.025
    }
  })

  return (
    <group ref={ref} rotation={[0, 0, tilt]}>
      <Center>
        <primitive object={scene} />
      </Center>
    </group>
  )
}

// Responsive camera — pulls back + widens FOV on narrow portrait screens so
// the capsule never crops at the sides on mobile.
function CameraRig() {
  const { camera, size } = useThree()
  useEffect(() => {
    const isPortrait = size.width < 640
    if (isPortrait) {
      camera.position.set(0, 1.4, 8.6)
      camera.fov = 38
    } else {
      camera.position.set(2.2, 1.8, 5.4)
      camera.fov = 32
    }
    camera.lookAt(0, 0, 0)
    camera.updateProjectionMatrix()
  }, [size.width, camera])
  return null
}

export default function SpaceshipGLB({
  spin = true,
  float = false,
  tilt = 0,
  controls = true,
  variant = 'dark',
}) {
  const isLight = variant === 'light'
  return (
    <Canvas
      // Cap DPR at 1.5 — full 2x on a mobile retina screen is the single
      // biggest perf cost here and you can't see the difference on this scene.
      dpr={[1, 1.5]}
      shadows
      gl={{
        antialias: true,
        alpha: true,
        toneMapping: THREE.ACESFilmicToneMapping,
        outputColorSpace: THREE.SRGBColorSpace,
      }}
      camera={{ position: [2.2, 1.8, 5.4], fov: 32 }}
      style={{ width: '100%', height: '100%', background: 'transparent' }}
    >
      <CameraRig />

      <ambientLight intensity={isLight ? 0.55 : 0.18} />
      <directionalLight
        position={[4, 6, 4]}
        intensity={isLight ? 1.9 : 2.4}
        color="#fff5e6"
        castShadow
        shadow-mapSize-width={1024}
        shadow-mapSize-height={1024}
      />
      <directionalLight
        position={[-4, 3, 1]}
        intensity={isLight ? 0.7 : 0.55}
        color={isLight ? '#ffd9a8' : '#94b8ff'}
      />
      <directionalLight
        position={[0, 2.5, -5]}
        intensity={0.5}
        color={isLight ? '#ffe4c0' : '#c9d6ff'}
      />

      {/* Lower-res HDRI — barely visible on this emissive-heavy model but
          much cheaper to upload to GPU. */}
      <Environment
        preset={isLight ? 'apartment' : 'city'}
        background={false}
        resolution={64}
      />

      <Suspense fallback={null}>
        <Ship spin={spin} float={float} tilt={tilt} />
      </Suspense>

      <ContactShadows
        position={[0, -1.05, 0]}
        opacity={isLight ? 0.42 : 0.5}
        scale={9}
        blur={3}
        far={3.2}
        resolution={512}
        color={isLight ? '#5a3a1c' : '#000000'}
      />

      {controls && (
        <OrbitControls
          makeDefault
          enablePan={false}
          enableZoom
          zoomSpeed={0.6}
          enableDamping
          dampingFactor={0.08}
          minDistance={2.5}
          maxDistance={12}
        />
      )}
    </Canvas>
  )
}
