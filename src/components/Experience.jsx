import { Fragment, useCallback, useEffect, useRef } from 'react'
import { gsap, useGSAP } from '../hooks/gsap'
import { useReducedMotion } from '../hooks/useReducedMotion'
import { experience } from '../data/portfolio'
import Copy from './Copy'
import StringLine from './StringLine'
import ExperienceVisual from '../visuals/ExperienceVisual'

export default function Experience() {
  const sectionRef = useRef(null)
  const panelWrap = useRef(null)
  const panel = useRef(null)
  const slides = useRef([])
  const rows = useRef([])
  const dividers = useRef([])
  const zTop = useRef(experience.items.length)
  const hovered = useRef(null)
  const mouse = useRef(null)
  const reduced = useReducedMotion()
  const reducedRef = useRef(reduced)
  reducedRef.current = reduced

  useGSAP(() => {
    gsap.set(slides.current, { zIndex: (i) => i + 1 })
    gsap.set(slides.current[0], { scale: 1.05 })
    gsap.set(slides.current.slice(1), { scale: 0 })
    if (reduced) {
      gsap.set(dividers.current, { scaleX: 1 })
      return
    }
    dividers.current.forEach((el) =>
      gsap.to(el, { scaleX: 1, duration: 0.8, ease: 'power2.inOut', scrollTrigger: { trigger: el, start: 'top 85%' } }),
    )
  }, { scope: sectionRef, dependencies: [reduced] })

  // glide the preview to the hovered row and pop its visual on top
  const show = useCallback((i) => {
    const row = rows.current[i]
    const box = panel.current
    if (row && box) {
      const currentY = gsap.getProperty(box, 'y')
      const b = box.getBoundingClientRect()
      const baseCenter = b.top + b.height / 2 - currentY
      const r = row.getBoundingClientRect()
      const y = r.top + r.height / 2 - baseCenter
      reducedRef.current ? gsap.set(box, { y }) : gsap.to(box, { y, duration: 0.65, ease: 'back.out(1.6)' })
    }
    const slide = slides.current[i]
    if (!slide) return
    zTop.current += 1
    gsap.set(slide, { zIndex: zTop.current })
    gsap.killTweensOf(slide)
    if (reducedRef.current) gsap.set(slide, { scale: 1.05 })
    else gsap.fromTo(slide, { scale: 0 }, { scale: 1.05, duration: 0.45, ease: 'power2.out' })
  }, [])

  const hitTest = useCallback((x, y) => {
    const idx = rows.current.findIndex((el) => {
      const r = el?.getBoundingClientRect()
      return r && y >= r.top && y < r.bottom && x >= r.left && x < r.right
    })
    if (idx !== -1 && idx !== hovered.current) {
      hovered.current = idx
      show(idx)
    }
  }, [show])

  useEffect(() => {
    const onMove = (e) => {
      mouse.current = { x: e.clientX, y: e.clientY }
      hitTest(e.clientX, e.clientY)
    }
    // rows move under a still cursor while scrolling, so re-test on scroll too
    const onScroll = () => mouse.current && hitTest(mouse.current.x, mouse.current.y)
    window.addEventListener('mousemove', onMove, { passive: true })
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => {
      window.removeEventListener('mousemove', onMove)
      window.removeEventListener('scroll', onScroll)
    }
  }, [hitTest])

  const items = experience.items

  return (
    <section ref={sectionRef} id="experience" className="relative w-full bg-ink text-white py-[7vw] max-[1025px]:py-[12vw]">
      <div className="w-full flex items-center px-[4vw] gap-[4vw] max-[1025px]:px-[5vw]">
        <div className="w-full">
          <Copy stagger={0.015}>
            <h2 className="text-[5.5vw] leading-[1.2] mb-[4vw] max-[1025px]:text-[7vw] max-md:text-[9vw]">
              {experience.heading[0]}
              <br />
              {experience.heading[1]}
            </h2>
          </Copy>

          <div
            onMouseEnter={() => gsap.to(panelWrap.current, { opacity: 1, duration: reduced ? 0 : 0.4, ease: 'power2.out' })}
            onMouseLeave={() => {
              hovered.current = null
              gsap.to(panelWrap.current, { opacity: 0, duration: reduced ? 0 : 0.4, ease: 'power2.out' })
            }}
          >
            {items.map((item, i) => (
              <Fragment key={item.title}>
                {i !== 0 && (
                  <div ref={(el) => (dividers.current[i - 1] = el)} className="relative h-px w-full origin-left scale-x-0">
                    <StringLine />
                  </div>
                )}
                <div ref={(el) => (rows.current[i] = el)} className="relative py-7 max-md:py-5">
                  <Copy splitBy="lines">
                    <h3 className="text-[1.8vw] font-normal w-[52%] max-[1025px]:w-full max-[1025px]:text-[3.4vw] max-md:text-[5vw]">{item.title}</h3>
                  </Copy>
                  <Copy splitBy="lines">
                    <p className="text-[1.05vw] tracking-wide text-white/35 mt-3 max-[1025px]:text-[2vw] max-md:text-[3.3vw]">{item.meta}</p>
                  </Copy>
                </div>
              </Fragment>
            ))}
            <div ref={(el) => (dividers.current[items.length - 1] = el)} className="relative h-px w-full origin-left scale-x-0">
              <StringLine />
            </div>
          </div>
        </div>

        <div
          ref={panelWrap}
          className="w-[40vw] flex justify-center absolute right-[6%] pointer-events-none opacity-0 max-[1025px]:hidden"
        >
          <div ref={panel} className="w-[40vw] h-[22vw] relative bg-ink rounded-lg overflow-hidden shadow-2xl will-change-transform">
            {items.map((item, i) => (
              <div key={item.title} ref={(el) => (slides.current[i] = el)} className="absolute inset-0 rounded-lg overflow-hidden">
                <ExperienceVisual type={item.visual} />
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
