import { useEffect, useRef, useState } from 'react'
import { useLenis } from 'lenis/react'
import { gsap } from '../hooks/gsap'
import { prefersReducedMotion } from '../hooks/useReducedMotion'
import Logo from './Logo'
import RollButton from './RollButton'

export default function Header() {
  const ref = useRef(null)
  const [frosted, setFrosted] = useState(false)
  const lenis = useLenis()

  // hide on scroll down, reveal on scroll up
  useEffect(() => {
    let last = window.scrollY
    let hidden = false
    const onScroll = () => {
      const y = window.scrollY
      setFrosted(y > window.innerHeight * 0.4)
      if (!prefersReducedMotion()) {
        const delta = y - last
        if (delta > 0 && y > 0 && !hidden) {
          hidden = true
          gsap.to(ref.current, { yPercent: -100, duration: 0.5, ease: 'power3.out' })
        } else if (delta < 0 && hidden) {
          hidden = false
          gsap.to(ref.current, { yPercent: 0, duration: 0.5, ease: 'power3.out' })
        }
      }
      last = y
    }
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  const go = (target) => (e) => {
    e.preventDefault()
    lenis ? lenis.scrollTo(target, { duration: 2 }) : document.querySelector(target)?.scrollIntoView()
  }

  return (
    <header
      ref={ref}
      id="header"
      className={`fixed top-0 inset-x-0 z-[99] opacity-0 flex items-center justify-between px-[4vw] py-[1.5vw] transition-[backdrop-filter] duration-500 max-[1025px]:px-[5vw] max-[1025px]:py-[3vw] max-md:py-4 ${
        frosted ? 'backdrop-blur-lg' : 'backdrop-blur-none'
      }`}
    >
      <a href="#top" onClick={go('#top')} aria-label="Back to top" className="text-white">
        <Logo className="text-[1.9vw] max-[1025px]:text-[3.8vw] max-md:text-[5.2vw]" />
      </a>
      <RollButton href="#contact" onClick={go('#contact')}>
        Get in Touch
      </RollButton>
    </header>
  )
}
