import { Suspense, lazy, useEffect, useState } from 'react'

const ShaderGradientCanvas = lazy(() =>
  import('@shadergradient/react').then((m) => ({ default: m.ShaderGradientCanvas }))
)
const ShaderGradient = lazy(() =>
  import('@shadergradient/react').then((m) => ({ default: m.ShaderGradient }))
)

function useShaderEnabled() {
  // Disable the shader for users that prefer reduced motion, on tiny / low-power
  // screens, and while the tab is hidden — keeps Lighthouse + battery happy.
  const [enabled, setEnabled] = useState(() => {
    if (typeof window === 'undefined') return false
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return false
    if (window.matchMedia('(max-width: 640px)').matches) return false
    return true
  })

  useEffect(() => {
    if (typeof window === 'undefined') return

    const motionMq = window.matchMedia('(prefers-reduced-motion: reduce)')
    const sizeMq = window.matchMedia('(max-width: 640px)')

    const update = () => {
      setEnabled(!motionMq.matches && !sizeMq.matches && !document.hidden)
    }
    const onVis = () => update()

    motionMq.addEventListener?.('change', update)
    sizeMq.addEventListener?.('change', update)
    document.addEventListener('visibilitychange', onVis)
    update()

    return () => {
      motionMq.removeEventListener?.('change', update)
      sizeMq.removeEventListener?.('change', update)
      document.removeEventListener('visibilitychange', onVis)
    }
  }, [])

  return enabled
}

export default function ShaderBackground() {
  const enabled = useShaderEnabled()

  return (
    <div
      aria-hidden="true"
      className="pointer-events-none fixed inset-0 -z-10 overflow-hidden bg-navy-950"
    >
      {/* Always-on radial fallback. Doubles as the mobile/reduced-motion experience. */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_10%,rgba(37,99,235,0.25),transparent_55%),radial-gradient(circle_at_80%_90%,rgba(212,162,76,0.18),transparent_55%)]" />

      {enabled && (
        <Suspense fallback={null}>
          <ShaderGradientCanvas
            style={{ position: 'absolute', inset: 0, width: '100%', height: '100%' }}
            pixelDensity={1}
            fov={45}
          >
            <ShaderGradient
              animate="on"
              brightness={1.2}
              cAzimuthAngle={170}
              cDistance={4.41}
              cPolarAngle={70}
              cameraZoom={1}
              color1="#0d00ff"
              color2="#ffaf19"
              color3="#ffffff"
              envPreset="city"
              frameRate={10}
              lightType="3d"
              positionX={0}
              positionY={0.9}
              positionZ={-0.3}
              rangeStart={0}
              rangeEnd={40}
              range="enabled"
              reflection={0.1}
              rotationX={45}
              shader="defaults"
              type="waterPlane"
              uDensity={1.2}
              uSpeed={0.2}
              uStrength={3.4}
            />
          </ShaderGradientCanvas>
        </Suspense>
      )}

      <div className="absolute inset-x-0 top-0 h-40 bg-gradient-to-b from-navy-950/80 to-transparent" />
      <div className="absolute inset-x-0 bottom-0 h-56 bg-gradient-to-t from-navy-950/90 to-transparent" />
      <div
        className="absolute inset-0 opacity-[0.05] mix-blend-overlay"
        style={{
          backgroundImage:
            'url("data:image/svg+xml;utf8,<svg xmlns=%22http://www.w3.org/2000/svg%22 width=%22160%22 height=%22160%22><filter id=%22n%22><feTurbulence type=%22fractalNoise%22 baseFrequency=%220.9%22 numOctaves=%222%22/></filter><rect width=%22100%25%22 height=%22100%25%22 filter=%22url(%23n)%22 opacity=%220.6%22/></svg>")',
        }}
      />
    </div>
  )
}
