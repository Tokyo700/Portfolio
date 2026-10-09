import { useEffect, useRef } from 'react'
import { gsap, SplitText } from '../hooks/gsap'
import { prefersReducedMotion } from '../hooks/useReducedMotion'

/**
 * Masked text reveal. Splits its child into chars (or lines) and slides
 * them up from behind a mask when scrolled into view.
 *
 * start=false holds the animation until the parent flips it to true
 * (used by the hero intro sequence).
 */
export default function Copy({
  children,
  splitBy = 'chars',
  stagger,
  duration = 0.5,
  delay = 0,
  start = true,
  animateOnScroll = true,
  className = '',
}) {
  const ref = useRef(null)

  useEffect(() => {
    const wrapper = ref.current
    if (!wrapper || !start) return

    let ctx
    let cancelled = false
    const splits = []

    const run = () => {
      if (cancelled) return
      ctx = gsap.context(() => {
        const targets = []
        Array.from(wrapper.children).forEach((el) => {
          if (splitBy === 'lines') {
            const s = SplitText.create(el, { type: 'lines', mask: 'lines', reduceWhiteSpace: false })
            splits.push(s)
            targets.push(...s.lines)
          } else {
            const s = SplitText.create(el, { type: 'lines,chars', mask: 'chars', reduceWhiteSpace: false })
            s.masks?.forEach((m) => {
              m.style.paddingInline = '0.04em'
              m.style.marginInline = '-0.04em'
            })
            splits.push(s)
            targets.push(...s.chars)
          }
        })

        if (prefersReducedMotion()) {
          gsap.fromTo(wrapper, { opacity: 0, y: 24 }, {
            opacity: 1, y: 0, duration: 0.8, ease: 'power2.out', delay,
            scrollTrigger: animateOnScroll ? { trigger: wrapper, start: 'top 85%', once: true } : undefined,
          })
          return
        }

        gsap.set(wrapper, { opacity: 1 })
        gsap.fromTo(
          targets,
          { yPercent: 100, willChange: 'transform' },
          {
            yPercent: 0,
            duration,
            delay,
            ease: 'power3.out',
            stagger: stagger ?? (splitBy === 'lines' ? 0.1 : 0.03),
            scrollTrigger: animateOnScroll ? { trigger: wrapper, start: 'top 85%' } : undefined,
          },
        )
      }, wrapper)
    }

    // Split only after the web font is ready, otherwise line breaks are measured wrong.
    let timer
    let ran = false
    const go = () => {
      if (ran) return
      ran = true
      clearTimeout(timer)
      run()
    }
    if (document.fonts?.status === 'loaded') go()
    else {
      document.fonts?.ready.then(go)
      timer = setTimeout(go, 600)
    }

    return () => {
      cancelled = true
      clearTimeout(timer)
      ctx?.revert()
      splits.forEach((s) => s.revert())
    }
  }, [start, splitBy, stagger, duration, delay, animateOnScroll])

  return (
    <div ref={ref} className={`opacity-0 ${className}`}>
      {children}
    </div>
  )
}
