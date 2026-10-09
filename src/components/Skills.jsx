import { useRef, useState } from 'react'
import { ArrowUpRight } from 'lucide-react'
import { gsap, useGSAP } from '../hooks/gsap'
import { useReducedMotion } from '../hooks/useReducedMotion'
import { skills } from '../data/portfolio'
import Copy from './Copy'

export default function Skills() {
  const sectionRef = useRef(null)
  const rowRef = useRef(null)
  const fills = useRef([])
  const reveal = useRef(skills.cards.map((_, i) => ({ value: i === 0 ? 100 : -40 })))
  const [active, setActive] = useState(0)
  const reduced = useReducedMotion()

  // horizontal track driven by vertical scroll
  useGSAP(() => {
    if (reduced) return
    const row = rowRef.current
    gsap.fromTo(row, { x: () => window.innerWidth * (window.innerWidth > 1025 ? 0.7 : 0.5) }, {
      x: () => -(row.scrollWidth - window.innerWidth),
      ease: 'none',
      scrollTrigger: {
        trigger: sectionRef.current,
        start: 'top 20%',
        end: 'bottom bottom',
        scrub: true,
        invalidateOnRefresh: true,
      },
    })
  }, { scope: sectionRef, dependencies: [reduced], revertOnUpdate: true })

  // orange radial fill blooms on the hovered card and fades from the last one
  const activate = (i) => {
    if (i === active) return
    const d = reduced ? 0 : 0.45
    const paint = (idx) => () => fills.current[idx]?.style.setProperty('--reveal', `${reveal.current[idx].value}%`)
    gsap.to(reveal.current[active], { value: -40, duration: d, ease: 'power2.out', onUpdate: paint(active) })
    gsap.to(reveal.current[i], { value: 100, duration: d, ease: 'power2.out', onUpdate: paint(i) })
    setActive(i)
  }

  return (
    <section
      ref={sectionRef}
      id="skills"
      className={`relative w-full bg-ink text-white ${reduced ? '' : 'h-[300vh]'}`}
    >
      <div className="relative pt-[6vw] px-[4vw] w-[60%] max-[1025px]:w-[85%] max-md:w-full max-[1025px]:px-[5vw] max-[1025px]:pt-[15vw]">
        <Copy stagger={0.015}>
          <h2 className="text-[5.5vw] leading-[1.2] max-[1025px]:text-[7vw] max-md:text-[9vw]">
            {skills.heading[0]}
            <br />
            {skills.heading[1]}
          </h2>
        </Copy>
        <div className="w-[75%] mt-[1.5vw] max-[1025px]:w-full max-[1025px]:mt-[5vw]">
          <Copy splitBy="lines">
            <p className="text-[1.25vw] leading-[1.5] text-white/90 max-[1025px]:text-[2.5vw] max-md:text-[4.2vw]">{skills.intro}</p>
          </Copy>
        </div>
      </div>

      <div className={reduced ? 'w-full pb-[6vw]' : 'w-full h-screen sticky top-0 overflow-hidden flex flex-col max-md:-mt-[20vw]'}>
        <div className={reduced ? '' : 'relative flex-1 flex items-center'}>
          <div
            ref={rowRef}
            className={
              reduced
                ? 'grid grid-cols-3 gap-[1.6vw] px-[4vw] pt-[5vw] max-[1025px]:grid-cols-2 max-md:grid-cols-1'
                : 'flex w-max gap-[1.6vw] px-[4vw] will-change-transform max-[1025px]:gap-[2.5vw] max-md:gap-[6vw]'
            }
          >
            {skills.cards.map((card, i) => (
              <a
                key={card.title}
                href="#projects"
                onMouseEnter={() => activate(i)}
                onFocus={() => activate(i)}
                className={`group relative shrink-0 rounded-lg p-[1.6vw] flex flex-col justify-between bg-[#161616] overflow-hidden border border-white/20 ${
                  reduced ? 'min-h-[22vw] max-md:min-h-0 max-md:p-[5vw]' : 'w-[27vw] h-[30vw] max-[1025px]:w-[55vw] max-[1025px]:h-[65vw] max-[1025px]:p-[3vw] max-md:w-[75vw] max-md:h-[85vw] max-md:p-[5vw]'
                }`}
              >
                <div
                  ref={(el) => {
                    fills.current[i] = el
                    el?.style.setProperty('--reveal', `${reveal.current[i].value}%`)
                  }}
                  className="absolute inset-0 flame-gradient radial-mask-bg-fill"
                />
                <div className="relative flex justify-between items-start">
                  <span className="text-[1vw] tracking-[0.2em] text-white/50 max-[1025px]:text-[2vw] max-md:text-[3.2vw]">0{i + 1}</span>
                  <span
                    className={`relative w-[3vw] h-[3vw] rounded-full flex items-center justify-center border border-white/30 overflow-hidden transition-colors duration-300 max-[1025px]:w-[7vw] max-[1025px]:h-[7vw] max-md:w-[9vw] max-md:h-[9vw] ${
                      active === i ? 'bg-white text-black' : 'text-white'
                    }`}
                  >
                    <ArrowUpRight size={20} className="transition-transform duration-300 group-hover:translate-x-[150%] group-hover:-translate-y-[150%]" />
                    <ArrowUpRight size={20} className="absolute -translate-x-[150%] translate-y-[150%] transition-transform duration-300 group-hover:translate-x-0 group-hover:translate-y-0" />
                  </span>
                </div>
                <div className="relative">
                  <h3 className="text-[2.5vw] font-normal mb-[1vw] max-[1025px]:text-[5vw] max-md:text-[6.5vw]">{card.title}</h3>
                  <ul className="space-y-[0.4vw] max-[1025px]:space-y-[1vw] max-md:space-y-[1.8vw]">
                    {card.items.map((item) => (
                      <li key={item} className="flex items-center gap-[0.7vw] text-[1.25vw] text-white max-[1025px]:text-[3vw] max-[1025px]:gap-[1.5vw] max-md:text-[4vw] max-md:gap-[2.5vw]">
                        <span className="size-1.5 bg-white rounded-full shrink-0" />
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </a>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
