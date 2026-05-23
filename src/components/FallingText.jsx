import { useRef, useState, useEffect } from 'react'
import './FallingText.css'

/**
 * FallingText — words drop and bounce inside a matter.js physics world
 * when the trigger fires. Adapted from React Bits.
 *
 * matter-js is lazy-loaded the first time the effect starts so it doesn't
 * add weight to the initial bundle (used only in the footer here).
 */
const FallingText = ({
  className = '',
  text = '',
  highlightWords = [],
  highlightClass = 'highlighted',
  trigger = 'auto',
  backgroundColor = 'transparent',
  wireframes = false,
  gravity = 1,
  mouseConstraintStiffness = 0.2,
  // Defaults `undefined` so the component inherits font sizing from its
  // parent unless the caller explicitly overrides. Pass e.g.
  // fontSize="2rem" to force a size.
  fontSize,
  lineHeight,
}) => {
  const containerRef = useRef(null)
  const textRef = useRef(null)
  const canvasContainerRef = useRef(null)

  const [effectStarted, setEffectStarted] = useState(false)

  // Build the highlighted word spans whenever text/highlight inputs change.
  useEffect(() => {
    if (!textRef.current) return
    const words = text.split(' ')
    const newHTML = words
      .map((word) => {
        const isHighlighted = highlightWords.some((hw) => word.startsWith(hw))
        return `<span class="word ${isHighlighted ? highlightClass : ''}">${word}</span>`
      })
      .join(' ')
    textRef.current.innerHTML = newHTML
  }, [text, highlightWords, highlightClass])

  // Auto / scroll trigger handling.
  useEffect(() => {
    if (trigger === 'auto') {
      setEffectStarted(true)
      return
    }
    if (trigger === 'scroll' && containerRef.current) {
      const observer = new IntersectionObserver(
        ([entry]) => {
          if (entry.isIntersecting) {
            setEffectStarted(true)
            observer.disconnect()
          }
        },
        { threshold: 0.1 },
      )
      observer.observe(containerRef.current)
      return () => observer.disconnect()
    }
  }, [trigger])

  // Physics simulation — fired once `effectStarted` flips true.
  // Auto-resets after 5s so the paragraph returns to its readable flow
  // layout and the user can re-trigger the effect.
  useEffect(() => {
    if (!effectStarted) return
    if (typeof window === 'undefined') return

    let cancelled = false
    let cleanup = () => {}
    let resetTimer = 0

    import('matter-js').then((mod) => {
      if (cancelled || !containerRef.current || !canvasContainerRef.current) return
      const Matter = mod.default ?? mod
      const {
        Engine,
        Render,
        World,
        Bodies,
        Runner,
        Mouse,
        MouseConstraint,
      } = Matter

      const containerRect = containerRef.current.getBoundingClientRect()
      const width = containerRect.width
      const height = containerRect.height

      if (width <= 0 || height <= 0) return

      const engine = Engine.create()
      engine.world.gravity.y = gravity

      const render = Render.create({
        element: canvasContainerRef.current,
        engine,
        options: { width, height, background: backgroundColor, wireframes },
      })

      const boundaryOptions = {
        isStatic: true,
        render: { fillStyle: 'transparent' },
      }
      const floor = Bodies.rectangle(width / 2, height + 25, width, 50, boundaryOptions)
      const leftWall = Bodies.rectangle(-25, height / 2, 50, height, boundaryOptions)
      const rightWall = Bodies.rectangle(width + 25, height / 2, 50, height, boundaryOptions)
      const ceiling = Bodies.rectangle(width / 2, -25, width, 50, boundaryOptions)

      const wordSpans = textRef.current.querySelectorAll('.word')
      const wordBodies = [...wordSpans].map((elem) => {
        const rect = elem.getBoundingClientRect()
        const x = rect.left - containerRect.left + rect.width / 2
        const y = rect.top - containerRect.top + rect.height / 2

        const body = Bodies.rectangle(x, y, rect.width, rect.height, {
          render: { fillStyle: 'transparent' },
          restitution: 0.8,
          frictionAir: 0.01,
          friction: 0.2,
        })

        Matter.Body.setVelocity(body, {
          x: (Math.random() - 0.5) * 5,
          y: 0,
        })
        Matter.Body.setAngularVelocity(body, (Math.random() - 0.5) * 0.05)
        return { elem, body }
      })

      wordBodies.forEach(({ elem, body }) => {
        elem.style.position = 'absolute'
        elem.style.left = `${body.position.x - (body.bounds.max.x - body.bounds.min.x) / 2}px`
        elem.style.top = `${body.position.y - (body.bounds.max.y - body.bounds.min.y) / 2}px`
        elem.style.transform = 'none'
      })

      const mouse = Mouse.create(containerRef.current)
      const mouseConstraint = MouseConstraint.create(engine, {
        mouse,
        constraint: {
          stiffness: mouseConstraintStiffness,
          render: { visible: false },
        },
      })
      render.mouse = mouse

      World.add(engine.world, [
        floor,
        leftWall,
        rightWall,
        ceiling,
        mouseConstraint,
        ...wordBodies.map((wb) => wb.body),
      ])

      const runner = Runner.create()
      Runner.run(runner, engine)
      Render.run(render)

      let rafId = 0
      const updateLoop = () => {
        wordBodies.forEach(({ body, elem }) => {
          const { x, y } = body.position
          elem.style.left = `${x}px`
          elem.style.top = `${y}px`
          elem.style.transform = `translate(-50%, -50%) rotate(${body.angle}rad)`
        })
        rafId = requestAnimationFrame(updateLoop)
      }
      updateLoop()

      cleanup = () => {
        cancelAnimationFrame(rafId)
        Render.stop(render)
        Runner.stop(runner)
        if (render.canvas && canvasContainerRef.current) {
          try {
            canvasContainerRef.current.removeChild(render.canvas)
          } catch {
            /* canvas already detached */
          }
        }
        World.clear(engine.world)
        Engine.clear(engine)
        // Restore each word span to its natural inline-flow position so
        // the paragraph reads normally again and the next hover can
        // re-trigger the drop.
        wordBodies.forEach(({ elem }) => {
          elem.style.position = ''
          elem.style.left = ''
          elem.style.top = ''
          elem.style.transform = ''
        })
      }

      // Auto-reset 5s after the physics actually kicks off (not from the
      // moment the trigger fired — keeps the visible "fall time" honest
      // even if matter-js takes a beat to lazy-load on slow networks).
      resetTimer = window.setTimeout(() => {
        if (cancelled) return
        setEffectStarted(false)
      }, 5000)
    })

    return () => {
      cancelled = true
      if (resetTimer) window.clearTimeout(resetTimer)
      cleanup()
    }
  }, [effectStarted, gravity, wireframes, backgroundColor, mouseConstraintStiffness])

  const handleTrigger = () => {
    if (!effectStarted && (trigger === 'click' || trigger === 'hover')) {
      setEffectStarted(true)
    }
  }

  return (
    <div
      ref={containerRef}
      className={`falling-text-container ${className}`}
      onClick={trigger === 'click' ? handleTrigger : undefined}
      onMouseEnter={trigger === 'hover' ? handleTrigger : undefined}
      style={{ position: 'relative', overflow: 'hidden' }}
    >
      <div
        ref={textRef}
        className="falling-text-target"
        style={{
          ...(fontSize ? { fontSize } : null),
          ...(lineHeight ? { lineHeight } : null),
        }}
      />
      <div ref={canvasContainerRef} className="falling-text-canvas" />
    </div>
  )
}

export default FallingText
