import { Suspense, lazy, useState } from 'react'
import ErrorBoundary from '../components/ErrorBoundary.jsx'

// Lazy so the three.js chunk only loads when this sandbox route is hit.
const SpaceshipGLB = lazy(() => import('../components/SpaceshipGLB.jsx'))

/**
 * Standalone sandbox route at /cts-render — used to iterate on the
 * three.js CTS capsule render in isolation before it's integrated
 * into the home / about page.
 */
export function Component() {
  const [spin, setSpin] = useState(false)

  return (
    <div
      style={{
        position: 'relative',
        width: '100vw',
        height: '100vh',
        background:
          'radial-gradient(120% 90% at 50% 45%, #0a1130 0%, #000533 55%, #00020d 100%)',
        overflow: 'hidden',
      }}
    >
      {/* Volumetric accent glows */}
      <div
        aria-hidden
        style={{
          position: 'absolute',
          left: '50%',
          top: '50%',
          width: '70vmin',
          height: '70vmin',
          transform: 'translate(-50%, -50%)',
          borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(90,166,255,0.10), transparent 65%)',
          filter: 'blur(60px)',
          pointerEvents: 'none',
        }}
      />
      <div
        aria-hidden
        style={{
          position: 'absolute',
          left: '14%',
          top: '18%',
          width: '34vmin',
          height: '34vmin',
          borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(240,198,116,0.08), transparent 65%)',
          filter: 'blur(80px)',
          pointerEvents: 'none',
        }}
      />

      {/* Header overlay */}
      <div
        style={{
          position: 'absolute',
          top: 28,
          left: 32,
          zIndex: 10,
          color: '#f4f7fb',
          fontFamily: 'Inter, system-ui, sans-serif',
          pointerEvents: 'none',
        }}
      >
        <div
          style={{
            fontSize: 10,
            letterSpacing: '0.42em',
            textTransform: 'uppercase',
            color: '#f0c674',
            fontWeight: 600,
          }}
        >
          Render · Sandbox
        </div>
        <div
          style={{
            marginTop: 8,
            fontSize: 22,
            fontWeight: 600,
            letterSpacing: '-0.01em',
          }}
        >
          Crew Training Simulator (CTS)
        </div>
        <div
          style={{
            marginTop: 4,
            fontSize: 12,
            color: 'rgba(244,247,251,0.55)',
            letterSpacing: '0.04em',
          }}
        >
          Gaganyaan · ISRO / HSFC · fabricated at Madras Swastic Engineers
        </div>
      </div>

      {/* Controls overlay */}
      <div
        style={{
          position: 'absolute',
          bottom: 28,
          left: '50%',
          transform: 'translateX(-50%)',
          zIndex: 10,
          display: 'flex',
          gap: 12,
          padding: '10px 14px',
          borderRadius: 999,
          border: '1px solid rgba(255,255,255,0.10)',
          background: 'rgba(10,14,28,0.55)',
          backdropFilter: 'blur(12px)',
          WebkitBackdropFilter: 'blur(12px)',
          color: '#f4f7fb',
          fontFamily: 'ui-monospace, SFMono-Regular, Menlo, monospace',
          fontSize: 11,
          letterSpacing: '0.22em',
          textTransform: 'uppercase',
        }}
      >
        <button
          type="button"
          onClick={() => setSpin((s) => !s)}
          style={{
            padding: '6px 12px',
            borderRadius: 999,
            border: '1px solid rgba(240,198,116,0.32)',
            background: spin ? 'rgba(240,198,116,0.14)' : 'transparent',
            color: '#f0c674',
            cursor: 'pointer',
            font: 'inherit',
          }}
        >
          {spin ? '◼ Pause spin' : '▶ Auto spin'}
        </button>
        <span style={{ alignSelf: 'center', color: 'rgba(244,247,251,0.55)' }}>
          Drag to orbit · scroll to zoom
        </span>
      </div>

      <ErrorBoundary fallback={null}>
        <Suspense fallback={null}>
          <SpaceshipGLB spin={spin} />
        </Suspense>
      </ErrorBoundary>
    </div>
  )
}
