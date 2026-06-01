// Real-user Core Web Vitals → GA4.
//
// Streams the live field metrics (LCP, INP, CLS, FCP, TTFB) from real
// visitors into the existing gtag (G-5LNL7XZK0S) as `event`s under the
// "Web Vitals" category. This is what lets us *measure* real-world
// performance instead of only lab/PageSpeed numbers.
//
// Client-only: gtag is injected in index.html and only exists in the
// browser, so the guard below makes this a no-op during SSR/prerender.
import { onCLS, onINP, onLCP, onFCP, onTTFB } from 'web-vitals'

function sendToGA4({ name, value, id, rating, navigationType }) {
  if (typeof window === 'undefined' || typeof window.gtag !== 'function') return
  window.gtag('event', name, {
    event_category: 'Web Vitals',
    // GA4 event values must be integers. CLS is a small unitless ratio,
    // so scale it by 1000; the others are already in milliseconds.
    value: Math.round(name === 'CLS' ? value * 1000 : value),
    metric_id: id, // unique per page load — lets GA4 dedupe/aggregate
    metric_value: value, // raw float, kept as a custom param
    metric_rating: rating, // 'good' | 'needs-improvement' | 'poor'
    metric_navigation_type: navigationType,
    non_interaction: true,
  })
}

// Registers the listeners once. web-vitals reports each metric when it's
// final (e.g. CLS/INP on visibility change), so this is fire-and-forget.
export function reportWebVitals() {
  onCLS(sendToGA4)
  onINP(sendToGA4)
  onLCP(sendToGA4)
  onFCP(sendToGA4)
  onTTFB(sendToGA4)
}
