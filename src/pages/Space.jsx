import { Suspense, lazy } from 'react'
import ErrorBoundary from '../components/ErrorBoundary.jsx'

const SpaceScene = lazy(() => import('../components/SpaceScene.jsx'))

export function Component() {
  return (
    <div className="h-svh" style={{ width: '100vw', background: '#000' }}>
      <ErrorBoundary fallback={null}>
        <Suspense fallback={null}>
          <SpaceScene />
        </Suspense>
      </ErrorBoundary>
    </div>
  )
}
