// Component ported from https://codepen.io/JuanFuentes/full/rgXKGQ

import { useEffect, useRef, useState, useMemo, useCallback } from 'react'

const dist = (a, b) => {
  const dx = b.x - a.x
  const dy = b.y - a.y
  return Math.sqrt(dx * dx + dy * dy)
}

const getAttr = (distance, maxDist, minVal, maxVal) => {
  const val = maxVal - Math.abs((maxVal * distance) / maxDist)
  return Math.max(minVal, val + minVal)
}

const debounce = (func, delay) => {
  let timeoutId
  return (...args) => {
    clearTimeout(timeoutId)
    timeoutId = setTimeout(() => {
      func.apply(this, args)
    }, delay)
  }
}

const TextPressure = ({
  text = 'Compressa',
  fontFamily = 'Compressa VF',
  fontUrl = '/fonts/CompressaPRO-GX.woff2',

  width = true,
  weight = true,
  italic = true,
  alpha = false,

  flex = true,
  stroke = false,
  scale = false,

  textColor = '#FFFFFF',
  strokeColor = '#FF0000',
  className = '',

  minFontSize = 24,
}) => {
  const containerRef = useRef(null)
  const titleRef = useRef(null)
  const spansRef = useRef([])

  const mouseRef = useRef({ x: 0, y: 0 })
  const cursorRef = useRef({ x: 0, y: 0 })

  const [fontSize, setFontSize] = useState(minFontSize)
  const [scaleY, setScaleY] = useState(1)
  const [lineHeight, setLineHeight] = useState(1)

  const chars = text.split('')

  useEffect(() => {
    const handleMouseMove = (e) => {
      cursorRef.current.x = e.clientX
      cursorRef.current.y = e.clientY
    }
    const handleTouchMove = (e) => {
      const t = e.touches[0]
      cursorRef.current.x = t.clientX
      cursorRef.current.y = t.clientY
    }

    window.addEventListener('mousemove', handleMouseMove)
    window.addEventListener('touchmove', handleTouchMove, { passive: true })

    if (containerRef.current) {
      const { left, top, width, height } = containerRef.current.getBoundingClientRect()
      mouseRef.current.x = left + width / 2
      mouseRef.current.y = top + height / 2
      cursorRef.current.x = mouseRef.current.x
      cursorRef.current.y = mouseRef.current.y
    }

    return () => {
      window.removeEventListener('mousemove', handleMouseMove)
      window.removeEventListener('touchmove', handleTouchMove)
    }
  }, [])

  const setSize = useCallback(() => {
    if (!containerRef.current || !titleRef.current) return

    const { width: containerW, height: containerH } =
      containerRef.current.getBoundingClientRect()

    let newFontSize = containerW / (chars.length / 2)
    newFontSize = Math.max(newFontSize, minFontSize)

    setFontSize(newFontSize)
    setScaleY(1)
    setLineHeight(1)

    requestAnimationFrame(() => {
      if (!titleRef.current) return
      const textRect = titleRef.current.getBoundingClientRect()

      if (scale && textRect.height > 0) {
        const yRatio = containerH / textRect.height
        setScaleY(yRatio)
        setLineHeight(yRatio)
      }
    })
  }, [chars.length, minFontSize, scale])

  useEffect(() => {
    const debouncedSetSize = debounce(setSize, 100)
    debouncedSetSize()
    window.addEventListener('resize', debouncedSetSize)
    return () => window.removeEventListener('resize', debouncedSetSize)
  }, [setSize])

  useEffect(() => {
    let rafId
    const animate = () => {
      mouseRef.current.x += (cursorRef.current.x - mouseRef.current.x) / 15
      mouseRef.current.y += (cursorRef.current.y - mouseRef.current.y) / 15

      if (titleRef.current) {
        const titleRect = titleRef.current.getBoundingClientRect()
        const maxDist = titleRect.width / 2

        spansRef.current.forEach((span) => {
          if (!span) return

          const rect = span.getBoundingClientRect()
          const charCenter = {
            x: rect.x + rect.width / 2,
            y: rect.y + rect.height / 2,
          }

          const d = dist(mouseRef.current, charCenter)

          const wdth = width ? Math.floor(getAttr(d, maxDist, 5, 200)) : 100
          const wght = weight ? Math.floor(getAttr(d, maxDist, 100, 900)) : 400
          const italVal = italic ? getAttr(d, maxDist, 0, 1).toFixed(2) : 0
          const alphaVal = alpha ? getAttr(d, maxDist, 0, 1).toFixed(2) : 1

          const newFontVariationSettings = `'wght' ${wght}, 'wdth' ${wdth}, 'ital' ${italVal}`

          if (span.style.fontVariationSettings !== newFontVariationSettings) {
            span.style.fontVariationSettings = newFontVariationSettings
          }
          if (alpha && span.style.opacity !== alphaVal) {
            span.style.opacity = alphaVal
          }
        })
      }

      rafId = requestAnimationFrame(animate)
    }

    animate()
    return () => cancelAnimationFrame(rafId)
  }, [width, weight, italic, alpha])

  // Load Compressa via FontFace API, deferred to browser idle time.
  //
  // Earlier we moved the @font-face out of the SSG'd HTML into a useEffect
  // FontFace.load() call, but PageSpeed still flagged the font as the
  // longest critical chain on /customization (689 ms) -- useEffect fires
  // immediately after hydration, so the fetch landed inside the LCP
  // window. requestIdleCallback pushes it to whenever the browser has
  // spare cycles (typically after LCP), with a setTimeout fallback for
  // Safari versions that don't support it.
  useEffect(() => {
    if (typeof window === 'undefined' || !window.FontFace) return
    if (Array.from(document.fonts || []).some((f) => f.family === fontFamily)) return

    let cancelled = false
    const loadFont = () => {
      if (cancelled) return
      const face = new FontFace(fontFamily, `url(${fontUrl}) format('woff2')`, {
        style: 'normal',
        display: 'swap',
      })
      face.load().then((loaded) => document.fonts.add(loaded)).catch(() => {})
    }

    if ('requestIdleCallback' in window) {
      const id = window.requestIdleCallback(loadFont, { timeout: 3000 })
      return () => {
        cancelled = true
        window.cancelIdleCallback?.(id)
      }
    }
    const t = setTimeout(loadFont, 1500)
    return () => {
      cancelled = true
      clearTimeout(t)
    }
  }, [fontFamily, fontUrl])

  const styleElement = useMemo(() => {
    return (
      <style>{`
        .tp-flex {
          display: flex;
          justify-content: space-between;
        }

        .tp-stroke span {
          position: relative;
          color: ${textColor};
        }
        .tp-stroke span::after {
          content: attr(data-char);
          position: absolute;
          left: 0;
          top: 0;
          color: transparent;
          z-index: -1;
          -webkit-text-stroke-width: 3px;
          -webkit-text-stroke-color: ${strokeColor};
        }

        .text-pressure-title {
          color: ${textColor};
        }
      `}</style>
    )
  }, [textColor, strokeColor])

  const dynamicClassName = [className, flex ? 'tp-flex' : '', stroke ? 'tp-stroke' : '']
    .filter(Boolean)
    .join(' ')

  return (
    <div
      ref={containerRef}
      style={{
        position: 'relative',
        width: '100%',
        height: '100%',
        background: 'transparent',
      }}
    >
      {styleElement}
      <h1
        ref={titleRef}
        className={`text-pressure-title ${dynamicClassName}`}
        style={{
          fontFamily,
          textTransform: 'uppercase',
          fontSize: fontSize,
          lineHeight,
          transform: `scale(1, ${scaleY})`,
          transformOrigin: 'center top',
          margin: 0,
          textAlign: 'center',
          userSelect: 'none',
          whiteSpace: 'nowrap',
          fontWeight: 100,
          width: '100%',
        }}
      >
        {chars.map((char, i) => (
          <span
            key={i}
            ref={(el) => (spansRef.current[i] = el)}
            data-char={char}
            style={{
              display: 'inline-block',
              color: stroke ? undefined : textColor,
            }}
          >
            {char}
          </span>
        ))}
      </h1>
    </div>
  )
}

export default TextPressure
