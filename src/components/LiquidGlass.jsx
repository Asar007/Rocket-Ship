import { useEffect, useRef, useState } from 'react'

function waitForGlass() {
  return new Promise((resolve) => {
    if (
      typeof window !== 'undefined' &&
      window.Container &&
      window.Button &&
      window.html2canvas
    ) {
      resolve()
      return
    }
    const check = () => {
      if (window.Container && window.Button && window.html2canvas) resolve()
      else setTimeout(check, 50)
    }
    check()
  })
}

// Delay before kicking off the WebGL/html2canvas pipeline so the page paints first.
// The library snapshots document.body once, so we want layout + first paint complete.
const SNAPSHOT_DELAY = 350

export function LiquidGlass({
  children,
  type = 'rounded',
  borderRadius = 24,
  tintOpacity = 0.18,
  className = '',
  style = {},
  as: Tag = 'div',
}) {
  const hostRef = useRef(null)
  const instanceRef = useRef(null)
  const [ready, setReady] = useState(false)

  useEffect(() => {
    let cancelled = false
    let timer

    const boot = async () => {
      await waitForGlass()
      if (cancelled || !hostRef.current) return

      timer = setTimeout(() => {
        if (cancelled || !hostRef.current) return
        try {
          const c = new window.Container({ type, borderRadius, tintOpacity })
          instanceRef.current = c

          // Replace host's visual canvas with the library's canvas, but keep
          // React children in place. The library appends a single absolute
          // <canvas> behind everything, so we just steal it.
          const canvas = c.canvas
          canvas.style.position = 'absolute'
          canvas.style.inset = '0'
          canvas.style.width = '100%'
          canvas.style.height = '100%'
          canvas.style.zIndex = '0'
          canvas.style.pointerEvents = 'none'
          canvas.style.borderRadius = 'inherit'
          hostRef.current.appendChild(canvas)

          // The library reads size from `c.element.getBoundingClientRect()`
          // via updateSizeFromDOM and getPosition. We need to redirect it to
          // read from our React-managed host instead.
          c.element = hostRef.current
          c.updateSizeFromDOM()
          setReady(true)
        } catch (err) {
          // eslint-disable-next-line no-console
          console.warn('LiquidGlass init failed:', err)
        }
      }, SNAPSHOT_DELAY)
    }

    boot()

    return () => {
      cancelled = true
      if (timer) clearTimeout(timer)
      const c = instanceRef.current
      if (c) {
        // Remove canvas, drop GL refs, unhook scroll listener best-effort.
        try {
          if (c.canvas && c.canvas.parentNode) c.canvas.parentNode.removeChild(c.canvas)
          c.gl_refs = {}
          const idx = window.Container?.instances?.indexOf(c)
          if (idx > -1) window.Container.instances.splice(idx, 1)
        } catch {
          /* noop */
        }
        instanceRef.current = null
      }
    }
  }, [type, borderRadius, tintOpacity])

  return (
    <Tag
      ref={hostRef}
      className={`glass-container liquid-glass-host ${ready ? 'is-ready' : ''} ${className}`}
      style={{
        position: 'relative',
        overflow: 'hidden',
        padding: 0,
        gap: 0,
        display: 'inline-flex',
        alignItems: 'center',
        justifyContent: 'center',
        borderRadius:
          type === 'pill' || type === 'circle' ? 9999 : borderRadius,
        ...style,
      }}
    >
      <span
        className="liquid-glass-content"
        style={{
          position: 'relative',
          zIndex: 1,
          display: 'inline-flex',
          alignItems: 'center',
          gap: '0.5rem',
          width: '100%',
          height: '100%',
          justifyContent: 'center',
        }}
      >
        {children}
      </span>
    </Tag>
  )
}

export default LiquidGlass
