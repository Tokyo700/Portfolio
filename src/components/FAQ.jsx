import { useLayoutEffect, useRef, useState } from 'react'
import { gsap, ScrollTrigger, useGSAP } from '../hooks/gsap'
import { useReducedMotion } from '../hooks/useReducedMotion'
import { faq } from '../data/portfolio'
import Copy from './Copy'

function Item({ q, a, open, onToggle, reduced }) {
  const panel = useRef(null)
  const first = useRef(true)

  // animate height between 0 and the content's natural height
  useLayoutEffect(() => {
    const el = panel.current
    if (first.current) {
      first.current = false
      gsap.set(el, { height: open ? 'auto' : 0 })
      return
    }
    gsap.killTweensOf(el)
    const d = reduced ? 0 : 0.5
    // page height changes, so later scroll-triggered sections need re-measuring
    const done = () => ScrollTrigger.refresh()
    if (open) {
      gsap.fromTo(el, { height: el.offsetHeight }, {
        height: el.scrollHeight,
        duration: d,
        ease: 'power3.out',
        onComplete: () => {
          gsap.set(el, { height: 'auto' })
          done()
        },
      })
    } else {
      gsap.fromTo(el, { height: el.offsetHeight }, { height: 0, duration: d, ease: 'power3.out', onComplete: done })
    }
  }, [open, reduced])

  return (
    <div className="group border-b border-white/10 py-8 max-md:py-5">
      <button type="button" onClick={onToggle} aria-expanded={open} className="w-full flex items-center justify-between gap-6 text-left cursor-pointer max-md:gap-4">
        <span className="text-[1.5vw] font-normal max-[1025px]:text-[2.6vw] max-md:text-[4.2vw]">{q}</span>
        <span className="relative shrink-0 size-14 rounded-full overflow-hidden flex items-center justify-center border border-white/20 max-[1025px]:size-11 max-md:size-9">
          <span className="absolute h-[2px] z-[2] w-4 rounded-full bg-white max-md:w-3" />
          <span className={`absolute h-[2px] z-[2] w-4 rounded-full bg-white transition-transform duration-300 max-md:w-3 ${open ? 'rotate-0' : 'rotate-90'}`} />
          <span className={`absolute inset-0 flame-gradient rounded-full transition-transform duration-300 ease-in-out group-hover:scale-100 ${open ? 'scale-100' : 'scale-0'}`} />
        </span>
      </button>
      <div ref={panel} className="overflow-hidden" role="region">
        <p className="pt-4 pr-[3vw] w-[80%] text-[1.25vw] leading-[1.6] text-white/80 max-[1025px]:w-full max-[1025px]:pr-0 max-[1025px]:text-[2.2vw] max-md:text-[3.8vw]">{a}</p>
      </div>
    </div>
  )
}

export default function FAQ() {
  const sectionRef = useRef(null)
  const [open, setOpen] = useState(0)
  const reduced = useReducedMotion()

  useGSAP(() => {
    const rows = gsap.utils.toArray('.faq-row')
    if (reduced) {
      gsap.set(rows, { opacity: 1, y: 0 })
      return
    }
    rows.forEach((row) =>
      gsap.fromTo(row, { opacity: 0, y: 40 }, { opacity: 1, y: 0, duration: 0.8, ease: 'power2.out', scrollTrigger: { trigger: row, start: 'top 85%' } }),
    )
  }, { scope: sectionRef, dependencies: [reduced] })

  return (
    <section ref={sectionRef} id="faq" className="relative w-full py-[6vw] px-[10vw] bg-ink text-white max-[1025px]:px-[5vw] max-[1025px]:py-[12vw]">
      <Copy stagger={0.015}>
        <h2 className="text-[5.5vw] text-center mb-[6vw] leading-[1.1] max-[1025px]:text-[7vw] max-md:text-[9vw]">{faq.heading}</h2>
      </Copy>
      <div className="w-full">
        {faq.items.map((item, i) => (
          <div key={item.q} className="faq-row opacity-0">
            <Item {...item} open={open === i} onToggle={() => setOpen((cur) => (cur === i ? -1 : i))} reduced={reduced} />
          </div>
        ))}
      </div>
    </section>
  )
}
