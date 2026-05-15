import { Component } from 'react'

/**
 * Minimal error boundary. Wrap fragile subtrees (e.g. WebGL canvases that
 * can throw on unsupported GPUs / context loss) so a failure degrades to a
 * static fallback instead of blanking or crashing the whole page.
 *
 * Usage: <ErrorBoundary fallback={<Something />}><Risky /></ErrorBoundary>
 */
export default class ErrorBoundary extends Component {
  constructor(props) {
    super(props)
    this.state = { hasError: false }
  }

  static getDerivedStateFromError() {
    return { hasError: true }
  }

  componentDidCatch(error, info) {
    // Surface in dev; stays silent for users (fallback handles UX).
    if (import.meta.env?.DEV) {
      console.error('ErrorBoundary caught:', error, info)
    }
  }

  render() {
    if (this.state.hasError) {
      return this.props.fallback ?? null
    }
    return this.props.children
  }
}
