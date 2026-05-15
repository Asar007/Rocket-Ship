import { Link } from 'react-router-dom'
import Seo from '../lib/seo.jsx'

export function Component() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center px-6 text-center">
      <Seo
        title="Page not found"
        description="The page you're looking for doesn't exist."
        path="/404"
      />
      <p className="font-mono text-[11px] uppercase tracking-[0.4em] text-gold-400">
        404
      </p>
      <h1 className="mt-4 font-display text-3xl font-semibold text-white sm:text-4xl">
        This page drifted off course.
      </h1>
      <p className="mt-3 max-w-md text-white/60">
        The link may be broken or the page may have moved.
      </p>
      <Link to="/" className="btn-primary mt-8">
        Back to home
      </Link>
    </div>
  )
}
