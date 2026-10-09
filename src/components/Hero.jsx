import { Suspense, lazy, useEffect, useRef, useState } from 'react'
import { useLenis } from 'lenis/react'
import { gsap, useGSAP } from '../hooks/gsap'
import { prefersReducedMotion } from '../hooks/useReducedMotion'
import { hero, profile } from '../data/portfolio'
import Copy from './Copy'
import ProjectCover from '../visuals/ProjectCover'

const HeroScene = lazy(() => import('../visuals/HeroScene'))

// tiles that scroll endlessly behind the hero (tripled so the loop never shows a gap)
const columnA = ['fl', 'kws', 'db']
const columnB = ['edgecast', 'warranty']
const triple = (list) => [...list, ...list, ...list]

function Lines({ text }) {
  return text.split('\n').map((line, i, arr) => (
    <span key={i}>
      {line}
      {i < arr.length - 1 && <br />}
    </span>
  ))
}

export default function Hero() {
  const sectionRef = useRef(null)
  const stageRef = useRef(null)
  const textRef = useRef(null)
  const visualRef = useRef(null)
  const parallaxRef = useRef(null)
  const gridRef = useRef(null)
  const progress = useRef(0)
  const introDone = useRef(false)

  const [headingOn, setHeadingOn] = useState(false)
  const [sideOn, setSideOn] = useState(false)
  const [sceneActive, setSceneActive] = useState(true)

  const lenis = useLenis()
  const lenisRef = useRef(lenis)
  lenisRef.current = lenis

  // always start at the top with scrolling locked until the intro finishes
  useEffect(() => {
    if ('scrollRestoration' in window.history) window.history.scrollRestoration = 'manual'
    window.scrollTo(0, 0)
  }, [])

  useEffect(() => {
    if (!introDone.current) lenis?.stop()
  }, [lenis])

  // intro: diagonal mask wipe → headline → side copy → header, then unlock scroll
  useEffect(() => {
    const state = { reveal: -40 }
    const tl = gsap.timeline()
    tl.to(state, {
      reveal: 125,
      duration: 3.5,
      ease: 'power2.out',
      onUpdate: () => visualRef.current?.style.setProperty('--reveal', `${state.reveal}%`),
    }, 0)
      .fromTo(visualRef.current, { opacity: 0 }, { opacity: 1, duration: 1.5, ease: 'power2.out' }, 0)
      .call(() => setHeadingOn(true), null, 1)
      .call(() => setSideOn(true), null, 1.5)
      .call(() => {
        gsap.fromTo('#header', { yPercent: -50, opacity: 0 }, {
          yPercent: 0,
          opacity: 1,
          duration: 0.8,
          ease: 'power3.out',
          onComplete: () => {
            introDone.current = true
            lenisRef.current?.start()
          },
        })
      }, null, 1.8)
    return () => tl.kill()
  }, [])

  // scroll: the hero card shrinks to half size and the project wall comes into focus behind it
  useGSAP(() => {
    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: sectionRef.current,
        start: 'top top',
        end: 'bottom bottom',
        scrub: true,
        invalidateOnRefresh: true,
        onUpdate: (self) => (progress.current = self.progress),
      },
    })
    tl.to(stageRef.current, { scale: 0.5, ease: 'power2.inOut', duration: 1 }, 0)
    gsap.set(gridRef.current, { filter: 'blur(24px)', opacity: 0.35 })
    tl.to(gridRef.current, { filter: 'blur(0px)', opacity: 1, ease: 'power2.out', duration: 0.18 }, 0.32)
  }, { scope: sectionRef })

  // cursor parallax: visual drifts more than the text for depth
  useEffect(() => {
    if (window.innerWidth <= 1024 || prefersReducedMotion()) return
    const s = { tx: 0, ty: 0, x: 0, y: 0 }
    const onMove = (e) => {
      s.tx = -((e.clientX / window.innerWidth) * 2 - 1)
      s.ty = -((e.clientY / window.innerHeight) * 2 - 1)
    }
    let raf
    const tick = () => {
      s.x += (s.tx - s.x) * 0.08
      s.y += (s.ty - s.y) * 0.08
      gsap.set(parallaxRef.current, { x: s.x * 30, y: s.y * 30 })
      gsap.set(textRef.current, { x: s.x * 12, y: s.y * 12 })
      raf = requestAnimationFrame(tick)
    }
    window.addEventListener('mousemove', onMove)
    raf = requestAnimationFrame(tick)
    return () => {
      window.removeEventListener('mousemove', onMove)
      cancelAnimationFrame(raf)
    }
  }, [])

  // pause the WebGL loop once the hero is off-screen
  useEffect(() => {
    const io = new IntersectionObserver(([entry]) => setSceneActive(entry.isIntersecting), { rootMargin: '100px' })
    io.observe(sectionRef.current)
    return () => io.disconnect()
  }, [])

  return (
    <section ref={sectionRef} id="top" className="relative w-full h-[300vh]">
      <div
        ref={stageRef}
        className="hero-bg w-full h-screen sticky top-0 z-[2] flex justify-between items-center overflow-hidden px-[4vw] max-[1025px]:px-[5vw] max-[1025px]:items-start max-[1025px]:pt-[30vw] max-md:pt-[34vw]"
      >
        <div ref={textRef} className="relative z-[1] w-full flex justify-between max-[1025px]:flex-col max-[1025px]:gap-8">
          <div className="w-[45%] max-[1025px]:w-[70%] max-md:w-full">
            <Copy stagger={0.015} start={headingOn} animateOnScroll={false}>
              <h1 className="text-[7.5vw] leading-[1.1] text-white max-[1025px]:text-[11vw] max-md:text-[14vw]">{hero.heading}</h1>
            </Copy>
          </div>
          <div className="w-[14%] flex flex-col justify-between text-end text-[1.25vw] leading-[1.2] py-[2vw] max-[1025px]:w-[50%] max-[1025px]:text-start max-[1025px]:text-[3.2vw] max-[1025px]:gap-4 max-md:text-[4.2vw] max-md:py-0">
            <Copy splitBy="lines" start={sideOn} animateOnScroll={false}>
              <p className="text-white">
                <Lines text={hero.sideTop} />
              </p>
            </Copy>
            <Copy splitBy="lines" start={sideOn} animateOnScroll={false}>
              <p className="text-white">
                <Lines text={hero.sideBottom} />
              </p>
            </Copy>
          </div>
        </div>

        <div ref={visualRef} className="hero-mask-reveal absolute inset-0 z-[2] opacity-0 pointer-events-none">
          <div ref={parallaxRef} className="absolute -inset-[40px]">
            {profile.photo ? (
              <img
                src={profile.photo}
                alt={`${profile.firstName} ${profile.lastName}`}
                className="absolute bottom-0 left-1/2 -translate-x-[45%] h-[92%] w-auto object-contain select-none"
                draggable={false}
              />
            ) : (
              <Suspense fallback={null}>
                <HeroScene progress={progress} active={sceneActive} />
              </Suspense>
            )}
          </div>
        </div>
      </div>

      <div ref={gridRef} className="absolute inset-0 w-full h-full bg-ink">
        <div className="w-full h-screen sticky top-0 px-[4vw] flex gap-[2.5vw] overflow-hidden">
          {[columnA, columnB].map((col, c) => (
            <div key={c} className={`w-1/2 h-fit flex flex-col gap-[2.5vw] ${c === 0 ? 'marquee-1' : 'marquee-2'}`}>
              {triple(col).map((type, i) => (
                <div key={i} className="relative w-full h-[27vw] shrink-0 overflow-hidden max-[1025px]:h-[45vw] max-md:h-[55vw]">
                  <ProjectCover type={type} />
                </div>
              ))}
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
