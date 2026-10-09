import { useRef } from 'react'
import { Cpu, Database, ShieldCheck } from 'lucide-react'
import { gsap, useGSAP } from '../hooks/gsap'
import { useReducedMotion } from '../hooks/useReducedMotion'
import { whyMe } from '../data/portfolio'
import Copy from './Copy'

const ICONS = { shield: ShieldCheck, cpu: Cpu, database: Database }
const ACCENT = '#E8620F'

export default function WhyMe() {
  const sectionRef = useRef(null)
  const lines = useRef([])
  const reduced = useReducedMotion()

  useGSAP(() => {
    gsap.set(lines.current, { scaleX: 0, transformOrigin: 'left center' })
    if (reduced) return
    gsap.fromTo('.work-card', { opacity: 0, yPercent: 10 }, {
      opacity: 1,
      yPercent: 0,
      stagger: 0.08,
      duration: 0.9,
      ease: 'power2.out',
      scrollTrigger: { trigger: '.work-grid', start: 'top 80%' },
    })
  }, { scope: sectionRef, dependencies: [reduced] })

  // the accent rule draws in from the left on enter and out to the right on leave
  const sweep = (i, show) => {
    const el = lines.current[i]
    if (!el) return
    gsap.killTweensOf(el)
    gsap.set(el, { transformOrigin: show ? 'left center' : 'right center' })
    gsap.to(el, { scaleX: show ? 1 : 0, duration: 0.55, ease: 'power2.out' })
  }

  return (
    <section ref={sectionRef} id="about" className="relative w-full bg-ink text-white pt-[25vw] pb-[10vw] max-[1025px]:pt-[45vw]">
      <div className="text-center mb-[5vw] max-md:mb-[10vw] px-[5vw]">
        <Copy stagger={0.015}>
          <h2 className="text-[5.5vw] leading-[1.1] max-[1025px]:text-[7vw] max-md:text-[9vw]">{whyMe.heading}</h2>
        </Copy>
        <Copy splitBy="lines">
          <p className="text-[1.25vw] text-white mt-[1.5vw] max-[1025px]:text-[2.5vw] max-md:text-[4.5vw] max-md:mt-[2vw]">{whyMe.sub}</p>
        </Copy>
      </div>

      <div className="work-grid grid grid-cols-3 max-[1025px]:grid-cols-1">
        {whyMe.cards.map((card, i) => {
          const Icon = ICONS[card.icon] ?? ShieldCheck
          return (
            <div
              key={card.title}
              onMouseEnter={() => sweep(i, true)}
              onMouseLeave={() => sweep(i, false)}
              className={`work-card relative px-[4vw] pt-[2vw] pb-[3vw] h-[32vw] flex flex-col justify-between max-[1025px]:h-auto max-[1025px]:py-[6vw] max-[1025px]:px-[5vw] ${reduced ? '' : 'opacity-0'}`}
            >
              <div>
                <Icon size={50} color={ACCENT} strokeWidth={1.5} className="mb-[2.5vw] max-[1025px]:mb-[4vw]" />
                <h3 className="text-[2vw] font-normal mb-[2.5vw] max-[1025px]:text-[4.2vw] max-md:text-[5.8vw] max-[1025px]:mb-[2vw]">{card.title}</h3>
                <p className="text-[1.25vw] leading-normal text-white/80 max-[1025px]:text-[2.8vw] max-md:text-[4vw]">{card.text}</p>
              </div>
              <div className="relative mt-[3vw] h-px w-full bg-white/20">
                <span ref={(el) => (lines.current[i] = el)} className="absolute inset-0 h-px w-full will-change-transform" style={{ backgroundColor: ACCENT }} />
              </div>
            </div>
          )
        })}
      </div>
    </section>
  )
}
