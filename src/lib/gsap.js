import { gsap } from 'gsap'

let registered = false

export function getGsap() {
  return gsap
}

export async function ensureScrollTrigger() {
  if (typeof window === 'undefined') return null
  if (!registered) {
    const mod = await import('gsap/ScrollTrigger')
    gsap.registerPlugin(mod.ScrollTrigger)
    registered = true
  }
  const { ScrollTrigger } = await import('gsap/ScrollTrigger')
  return ScrollTrigger
}
