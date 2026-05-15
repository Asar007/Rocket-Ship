import { Suspense, lazy } from 'react'
import ErrorBoundary from '../components/ErrorBoundary.jsx'

const SpaceScene = lazy(() => import('../components/SpaceScene.jsx'))

export function Component() {
  return (
    <div style={{ width: '100vw', height: '100vh', background: '#000' }}>
      <ErrorBoundary fallback={null}>
        <Suspense fallback={null}>
          <SpaceScene />
        </Suspense>
      </ErrorBoundary>
    </div>
  )
}
