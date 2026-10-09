import { useRef } from 'react'
import { ArrowUpRight } from 'lucide-react'
import { gsap, useGSAP } from '../hooks/gsap'
import { useReducedMotion } from '../hooks/useReducedMotion'
import { projects } from '../data/portfolio'
import Copy from './Copy'
import ProjectCover from '../visuals/ProjectCover'

export default function Projects() {
  const sectionRef = useRef(null)
  const domeRef = useRef(null)
  const progressRef = useRef(null)
  const dots = useRef([])
  const cards = useRef([])
  const reduced = useReducedMotion()
  const n = projects.length
  const steps = n - 1

  useGSAP(() => {
    // pinned stack: each card slides up over the previous one, which dims
    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: sectionRef.current,
        start: '10% top',
        end: 'bottom bottom',
        scrub: true,
        ...(reduced ? {} : { snap: { snapTo: 1 / steps, duration: { min: 0.2, max: 0.6 }, ease: 'power1.inOut' } }),
      },
    })
    gsap.set(progressRef.current, { scaleY: 0 })
    gsap.set(dots.current[0], { backgroundColor: '#ffffff', borderColor: '#ffffff' })
    dots.current.slice(1).forEach((d) => gsap.set(d, { backgroundColor: '#F06A0E', borderColor: 'rgba(255,255,255,0.5)' }))
    cards.current.slice(1).forEach((c) => gsap.set(c, reduced ? { opacity: 0 } : { yPercent: 100 }))

    tl.to(progressRef.current, { scaleY: 1, ease: 'none', duration: steps }, 0)
    for (let i = 0; i < steps; i++) {
      tl.to(cards.current[i + 1], reduced ? { opacity: 1, ease: 'none', duration: 1 } : { yPercent: 0, ease: 'power2.inOut', duration: 1 }, i)
      tl.to(cards.current[i], { filter: 'brightness(0.3)', ease: 'power2.inOut', duration: 1 }, i)
      tl.set(dots.current[i + 1], { backgroundColor: '#ffffff', borderColor: '#ffffff' }, i + 1)
    }

    if (reduced) return
    // curved orange dome rising over the project wall
    const st = { trigger: sectionRef.current, start: 'top bottom', end: '30% bottom', scrub: true }
    gsap.to(domeRef.current, { yPercent: window.innerWidth > 1024 ? -70 : -50, ease: 'none', scrollTrigger: st })
    gsap.fromTo(domeRef.current, { clipPath: 'ellipse(150% 100% at 50% 100%)' }, { clipPath: 'ellipse(60% 100% at 50% 100%)', ease: 'power2.out', scrollTrigger: { ...st } })
  }, { scope: sectionRef, dependencies: [reduced], revertOnUpdate: true })

  // ~75vh of scroll per card transition
  const height = `${Math.round((100 + 75 * steps) / 0.9)}vh`

  return (
    <section ref={sectionRef} id="projects" className="relative w-full text-white pt-[8vw] max-md:pt-[30vw]" style={{ height }}>
      <div ref={domeRef} className="flame-gradient w-full h-[50vh] absolute top-0 left-0 z-[2] will-change-[clip-path]" />

      <div className="flame-gradient w-full h-screen sticky top-0 z-[3] flex flex-col items-center justify-center gap-[4vw] px-[4vw] overflow-hidden max-[1025px]:gap-10 max-[1025px]:px-[5vw] max-md:gap-8">
        <Copy stagger={0.015}>
          <h2 className="text-[5.5vw] text-center leading-[1.1] max-[1025px]:text-[6.5vw] max-md:text-[9vw]">Research &amp; Projects</h2>
        </Copy>

        <div className="w-full flex items-center gap-[4vw] max-md:flex-col max-md:items-start max-md:gap-8">
          <div className="w-[32%] relative shrink-0 [--row:7vw] max-md:w-full max-md:[--row:12vw]">
            <div className="absolute left-[4.5px] w-px bg-white/20" style={{ top: 'calc(var(--row) / 2)', height: `calc(${steps} * var(--row))` }} />
            <div
              ref={progressRef}
              className="absolute left-[4.5px] w-px bg-white origin-top"
              style={{ top: 'calc(var(--row) / 2)', height: `calc(${steps} * var(--row))` }}
            />
            <div className="flex flex-col">
              {projects.map((p, i) => (
                <div key={p.name} className="relative flex items-center gap-[1.2vw] max-md:gap-[4vw]" style={{ height: 'var(--row)' }}>
                  <span ref={(el) => (dots.current[i] = el)} className="w-[10px] h-[10px] rounded-full border shrink-0 bg-[#F06A0E]" />
                  <div className="min-w-0">
                    <h3 className="text-[1.5vw] font-normal leading-tight max-[1025px]:text-[1.9vw] max-md:text-[4.6vw]">
                      {p.link ? (
                        <a href={p.link} target="_blank" rel="noreferrer" className="under-multi-parent inline-flex items-center gap-1">
                          <span className="under-multi">{p.name}</span>
                          <ArrowUpRight className="w-[1.1em] h-[1.1em] opacity-70" />
                        </a>
                      ) : (
                        p.name
                      )}
                    </h3>
                    <p className="text-[1vw] text-white/85 mt-[0.2vw] max-[1025px]:text-[1.35vw] max-md:text-[3.3vw]">{p.tags.join('  •  ')}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="w-full h-[38vw] relative rounded-xl overflow-hidden max-md:h-[62vw] max-md:rounded-lg">
            {projects.map((p, i) => (
              <div
                key={p.name}
                ref={(el) => (cards.current[i] = el)}
                className="absolute inset-0 rounded-xl overflow-hidden bg-[#F4EFE9] will-change-transform max-md:rounded-lg"
                style={{ zIndex: i + 1 }}
              >
                <ProjectCover type={p.cover} />
                {p.link && (
                  <a
                    href={p.link}
                    target="_blank"
                    rel="noreferrer"
                    aria-label={`Open ${p.title}`}
                    className="group absolute right-[1.4vw] bottom-[1.4vw] z-10 w-[3.4vw] h-[3.4vw] min-w-10 min-h-10 rounded-full bg-white text-black flex items-center justify-center overflow-hidden shadow-lg"
                  >
                    <ArrowUpRight className="w-1/2 h-1/2 transition-transform duration-300 group-hover:translate-x-[150%] group-hover:-translate-y-[150%]" />
                    <ArrowUpRight className="absolute w-1/2 h-1/2 -translate-x-[150%] translate-y-[150%] transition-transform duration-300 group-hover:translate-x-0 group-hover:translate-y-0" />
                  </a>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* soft orange glow that bleeds into the next (black) section */}
      <div className="absolute w-full h-[60vh] bottom-[-10%] left-0 overflow-hidden pointer-events-none max-[1025px]:bottom-[-13%]">
        <div className="flame-gradient w-[115%] h-[40vh] absolute bottom-[35%] left-[-7.5%] z-[2] blur-2xl max-[1025px]:bottom-[50%] max-[1025px]:blur-lg" />
      </div>
    </section>
  )
}
