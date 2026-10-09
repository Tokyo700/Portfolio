import { useCallback, useRef, useState } from 'react'
import { AnimatePresence, motion } from 'motion/react'
import { Gauge, Mic, Network, Radar, Users } from 'lucide-react'
import { gsap, useGSAP } from '../hooks/gsap'
import { useReducedMotion } from '../hooks/useReducedMotion'
import { highlights } from '../data/portfolio'
import Copy from './Copy'

const ICONS = { gauge: Gauge, radar: Radar, network: Network, mic: Mic, users: Users }

function Slide({ item, onSwipe }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 0 }}
      transition={{ duration: 0.25 }}
      drag="x"
      dragConstraints={{ left: 0, right: 0 }}
      onDragEnd={(_, info) => {
        if (info.offset.x > 100) onSwipe('prev')
        else if (info.offset.x < -100) onSwipe('next')
      }}
      className="pt-[8vw] pb-[4vw] px-[6vw] w-full h-full flex flex-col items-center justify-center gap-[2.5vw] text-center cursor-grab active:cursor-grabbing max-[1025px]:pt-[14vw] max-[1025px]:px-[8vw] max-[1025px]:gap-[4vw] max-md:pt-[22vw] max-md:px-[7vw] max-md:pb-[8vw] max-md:gap-[6vw]"
    >
      <div className="flex flex-col gap-[0.4vw] max-md:gap-2">
        <p className="text-[2.6vw] text-[#ff6b00] max-[1025px]:text-[4vw] max-md:text-[6.5vw]">{item.value}</p>
        <p className="text-[1.145vw] text-white max-[1025px]:text-[2.2vw] max-md:text-[3.6vw]">{item.label}</p>
      </div>
      <p className="text-[1.145vw] leading-[1.6] text-white/70 w-[82%] max-[1025px]:text-[2.2vw] max-[1025px]:w-full max-md:text-[3.6vw]">
        {item.text}
      </p>
    </motion.div>
  )
}

function NavButton({ dir, onClick }) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-label={dir === 'prev' ? 'Previous highlight' : 'Next highlight'}
      className="group relative size-12 rounded-full border border-white/20 flex items-center justify-center text-white/80 hover:text-white transition-colors cursor-pointer overflow-hidden max-md:size-10"
    >
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" className="relative z-[2]">
        <path
          d={dir === 'prev' ? 'M19 12H5M5 12L12 19M5 12L12 5' : 'M5 12H19M19 12L12 5M19 12L12 19'}
          stroke="currentColor"
          strokeWidth="1.6"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
      <span className="absolute inset-0 flame-gradient rounded-full scale-0 group-hover:scale-100 transition-transform duration-300 ease-in-out" />
    </button>
  )
}

export default function Highlights() {
  const sectionRef = useRef(null)
  const [index, setIndex] = useState(0)
  const reduced = useReducedMotion()
  const items = highlights.items
  const n = items.length

  useGSAP(() => {
    const els = gsap.utils.toArray('.highlight-fade')
    if (reduced) {
      gsap.set(els, { opacity: 1, y: 0 })
      return
    }
    gsap.fromTo(els, { opacity: 0, y: 40 }, {
      opacity: 1,
      y: 0,
      duration: 0.8,
      stagger: 0.12,
      ease: 'power2.out',
      scrollTrigger: { trigger: sectionRef.current, start: 'top 70%', once: true },
    })
  }, { scope: sectionRef, dependencies: [reduced] })

  const next = useCallback(() => setIndex((i) => (i + 1) % n), [n])
  const prev = useCallback(() => setIndex((i) => (i - 1 + n) % n), [n])

  return (
    <section ref={sectionRef} id="highlights" className="w-full bg-ink py-[7vw] px-[4vw] max-[1025px]:px-[5vw] max-[1025px]:py-[12vw]">
      <div className="w-full flex flex-col gap-[6vw] max-[1025px]:gap-[12vw]">
        <div className="w-full mx-auto">
          <Copy stagger={0.015}>
            <h2 className="text-[5.2vw] leading-[1.2] text-center max-[1025px]:text-[7vw] max-md:text-[8vw]">
              {highlights.heading[0]}
              <br />
              {highlights.heading[1]}
            </h2>
          </Copy>
        </div>

        <div className="relative max-md:mt-10">
          <div className="highlight-fade opacity-0 relative w-3/5 mx-auto rounded-[2vw] border border-white/10 bg-white/5 overflow-hidden h-[30vw] max-[1025px]:w-full max-[1025px]:rounded-[5vw] max-[1025px]:h-[52vw] max-md:h-[100vw]">
            <AnimatePresence mode="wait">
              <Slide key={items[index].value} item={items[index]} onSwipe={(d) => (d === 'next' ? next() : prev())} />
            </AnimatePresence>
          </div>

          {/* badge carousel: the active badge grows and sits in the middle */}
          <div className="highlight-fade opacity-0 flex w-full justify-center items-center absolute -top-[2vw] left-1/2 -translate-x-1/2 max-md:-top-[6vw]">
            {items.map((item, i) => {
              const rel = (i - index + n) % n
              const order = rel <= Math.floor(n / 2) ? rel : rel - n
              const isActive = order === 0
              const Icon = ICONS[item.icon] ?? Gauge
              return (
                <motion.button
                  key={item.value}
                  type="button"
                  onClick={() => setIndex(i)}
                  aria-label={`Show highlight: ${item.label}`}
                  aria-current={isActive}
                  layout
                  animate={{ scale: isActive ? 1.6 : 1 }}
                  transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
                  style={{ order, zIndex: isActive ? 10 : n - Math.abs(order) }}
                  className={`w-[5vw] h-[5vw] rounded-full overflow-hidden cursor-pointer max-[1025px]:w-[9vw] max-[1025px]:h-[9vw] max-md:w-[12vw] max-md:h-[12vw] ${
                    isActive
                      ? 'flame-gradient p-[0.3vw] mx-[2vw] max-md:mx-[4vw] max-md:p-[0.8vw]'
                      : `opacity-60 hover:opacity-100 ${order < 0 ? '-mr-[1vw]' : '-ml-[1vw]'}`
                  }`}
                >
                  <span className="w-full h-full rounded-full bg-[#1d1d1d] border border-white/10 flex items-center justify-center">
                    <Icon className="w-[45%] h-[45%] text-white" strokeWidth={1.6} />
                  </span>
                </motion.button>
              )
            })}
          </div>

          <div className="highlight-fade opacity-0 flex justify-center gap-3 mt-[3vw] max-md:mt-[8vw]">
            <NavButton dir="prev" onClick={prev} />
            <NavButton dir="next" onClick={next} />
          </div>
        </div>
      </div>
    </section>
  )
}
