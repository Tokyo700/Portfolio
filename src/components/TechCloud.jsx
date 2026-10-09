import { useRef } from 'react'
import {
  siBurpsuite,
  siCplusplus,
  siEspressif,
  siFastapi,
  siKalilinux,
  siMongodb,
  siPostgresql,
  siPython,
  siPytorch,
  siScikitlearn,
  siTensorflow,
  siWireshark,
} from '../data/brandIcons'
import { gsap, useGSAP } from '../hooks/gsap'
import { useReducedMotion } from '../hooks/useReducedMotion'
import { techCloud } from '../data/portfolio'
import Copy from './Copy'

const ICONS = {
  python: [siPython, 'Python'],
  pytorch: [siPytorch, 'PyTorch'],
  tensorflow: [siTensorflow, 'TensorFlow'],
  kali: [siKalilinux, 'Kali Linux'],
  wireshark: [siWireshark, 'Wireshark'],
  postgresql: [siPostgresql, 'PostgreSQL'],
  cpp: [siCplusplus, 'C++'],
  scikit: [siScikitlearn, 'scikit-learn'],
  mongodb: [siMongodb, 'MongoDB'],
  fastapi: [siFastapi, 'FastAPI'],
  espressif: [siEspressif, 'ESP32'],
  burp: [siBurpsuite, 'Burp Suite'],
}

// brand colours that are too dark to read on near-black get lifted
const LIFT = { cplusplus: '#3d8fd6', kalilinux: '#7fa8c0', wireshark: '#3aa0d8', postgresql: '#6b8cff', python: '#4b8bd4' }

function TechLogo({ id }) {
  const [icon, label] = ICONS[id] ?? []
  if (!icon) return null
  const color = LIFT[icon.slug] ?? `#${icon.hex}`
  return (
    <span className="flex items-center gap-[0.8vw] max-md:gap-[2vw]">
      <svg viewBox="0 0 24 24" className="h-[2.8vw] w-[2.8vw] shrink-0 max-md:h-[7vw] max-md:w-[7vw]" fill={color} aria-hidden>
        <path d={icon.path} />
      </svg>
      <span className="text-[1.6vw] font-medium text-white/90 whitespace-nowrap max-md:text-[3.6vw]">{label}</span>
    </span>
  )
}

/* Logos fly out of the distance, pass the camera and blur away. */
export default function TechCloud() {
  const sectionRef = useRef(null)
  const gridRef = useRef(null)
  const reduced = useReducedMotion()

  useGSAP(() => {
    const items = gsap.utils.toArray('.cloud-item', gridRef.current)
    if (!items.length) return
    if (reduced) {
      gsap.set(items, { opacity: 0.6 })
      return
    }
    const desktop = window.innerWidth > 1024
    const tl = gsap.timeline({
      defaults: { ease: 'none' },
      scrollTrigger: { trigger: sectionRef.current, start: 'top 20%', end: 'bottom center', scrub: true },
    })
    const inDur = desktop ? 1.5 : 4
    const outDur = desktop ? 1.5 : 3.5
    const groupGap = inDur + 0.4
    const itemGap = desktop ? 0.4 : 0.5

    // random little waves of 2–3 logos
    const groups = []
    for (let i = 0; i < items.length; ) {
      const size = Math.min(items.length - i, gsap.utils.random(2, 3, 1))
      groups.push(items.slice(i, i + size))
      i += size
    }
    groups.forEach((group, g) => {
      group.forEach((el, j) => {
        const at = g * groupGap + j * itemGap
        gsap.set(el, {
          transformOrigin: '0% 0%',
          opacity: 0,
          filter: 'blur(10px)',
          x: desktop ? gsap.utils.random(-180, 180) : 0,
          y: gsap.utils.random(-180, 180),
          z: desktop ? gsap.utils.random(-2200, -1600) : gsap.utils.random(-550, -400),
        })
        tl.to(el, { z: 0, opacity: 1, filter: 'blur(0px)', duration: inDur }, at).to(el, {
          z: desktop ? gsap.utils.random(1400, 1800) : gsap.utils.random(500, 700),
          opacity: 0,
          filter: 'blur(10px)',
          duration: outDur,
        }, at + inDur)
      })
    })
  }, { scope: sectionRef, dependencies: [reduced] })

  return (
    <section ref={sectionRef} id="toolkit" className="relative w-full h-[240vh] text-center z-[2] bg-ink">
      <div className="sticky top-0 w-full h-screen flex items-center justify-center">
        <div className="w-3/5 max-lg:w-4/5">
          <Copy stagger={0.015}>
            <h3 className="text-[5.2vw] text-white leading-[1.2] max-lg:text-[7vw] max-md:text-[8.5vw]">{techCloud.heading}</h3>
          </Copy>
        </div>
      </div>
      <div className="sticky top-0 -mt-[100vh] z-20 h-screen w-full overflow-hidden flex items-center justify-center pointer-events-none">
        <div ref={gridRef} className="grid grid-cols-4 gap-[3vw] perspective-[350vw] max-md:grid-cols-3 max-md:gap-[6vw]">
          {techCloud.logos.map((id) => (
            <div key={id} className="cloud-item flex h-[8vw] w-[16vw] items-center justify-center max-md:h-[20vw] max-md:w-[28vw]">
              <TechLogo id={id} />
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
