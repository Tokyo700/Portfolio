import { useRef } from 'react'
import { useLenis } from 'lenis/react'
import { FileText, Mail } from 'lucide-react'
import { gsap, useGSAP } from '../hooks/gsap'
import { prefersReducedMotion } from '../hooks/useReducedMotion'
import { footer, profile } from '../data/portfolio'
import Logo from './Logo'
import RollButton from './RollButton'
import { GithubIcon, LinkedinIcon } from './Contact'

const socials = [
  { label: 'GitHub', href: profile.github, Icon: GithubIcon, external: true },
  { label: 'LinkedIn', href: profile.linkedin, Icon: LinkedinIcon, external: true },
  { label: 'Email', href: `mailto:${profile.email}`, Icon: Mail },
  { label: 'Resume', href: profile.resume, Icon: FileText, download: true },
]

export default function Footer() {
  const footerRef = useRef(null)
  const cardRef = useRef(null)
  const lenis = useLenis()

  useGSAP(() => {
    if (prefersReducedMotion() || window.innerWidth <= 1025) return
    gsap.fromTo(cardRef.current, { yPercent: 20 }, {
      yPercent: 0,
      ease: 'power1.out',
      scrollTrigger: { trigger: footerRef.current, start: 'top 60%', end: 'bottom bottom', scrub: true },
    })
  }, { scope: footerRef })

  return (
    <footer ref={footerRef} className="relative overflow-hidden bg-ink px-[4vw] pt-[10vw] max-[1025px]:px-[5vw] max-md:pt-[20vw]">
      {/* molten glow behind the glass card */}
      <div
        className="absolute inset-x-0 bottom-0 h-[85%] pointer-events-none"
        style={{
          background:
            'radial-gradient(70% 75% at 50% 100%, #f16b0d 0%, #e8420f 30%, rgba(230,20,22,0.55) 50%, rgba(7,7,7,0) 78%)',
        }}
      />
      <div className="absolute inset-x-0 bottom-0 h-[45%] pointer-events-none blur-3xl flame-gradient opacity-60" />

      <div className="relative z-[1]">
        <div
          ref={cardRef}
          className="rounded-[2rem] bg-black/5 border border-white/30 backdrop-blur-2xl px-12 py-12 flex flex-col gap-20 max-[1025px]:items-center max-[1025px]:gap-10 max-[1025px]:px-8 max-[1025px]:py-14 max-md:px-6 max-md:gap-10"
        >
          <div className="flex justify-between items-start gap-24 max-[1025px]:flex-col-reverse max-[1025px]:items-center max-[1025px]:gap-10">
            <Logo className="text-[3.4vw] max-[1025px]:text-[5.6vw] max-md:text-[7.4vw]" />
            <div className="flex flex-col gap-[2vw] items-end max-[1025px]:items-center max-[1025px]:text-center max-md:gap-[7vw]">
              <p className="text-[3.4vw] text-end w-[80%] leading-[1.15] max-[1025px]:text-[5vw] max-[1025px]:w-full max-[1025px]:text-center max-md:text-[7.5vw]">
                {footer.cta}
              </p>
              <RollButton
                href="#contact"
                onClick={(e) => {
                  e.preventDefault()
                  lenis ? lenis.scrollTo('#contact', { duration: 1.6 }) : document.querySelector('#contact')?.scrollIntoView()
                }}
              >
                Get in Touch
              </RollButton>
            </div>
          </div>

          <div className="flex w-full items-end justify-between gap-12 max-[1025px]:flex-col max-[1025px]:items-center max-[1025px]:text-center max-[1025px]:gap-10">
            <div className="w-fit">
              <h6 className="uppercase mb-5 text-[1.25vw] max-[1025px]:text-[2.4vw] max-md:text-[4vw]">Reach Out</h6>
              <ul className="space-y-2 text-[1.25vw] max-[1025px]:text-[2.4vw] max-md:text-[4vw]">
                <li className="under-multi-parent">
                  <a href={`tel:${profile.phone.replace(/\s/g, '')}`} className="under-multi">{profile.phone}</a>
                </li>
                <li className="under-multi-parent">
                  <a href={`mailto:${profile.email}`} className="under-multi">{profile.email}</a>
                </li>
              </ul>
            </div>
            <ul className="flex gap-4">
              {socials.map(({ label, href, Icon, external, download }) => (
                <li key={label} className="group">
                  <a
                    href={href}
                    aria-label={label}
                    {...(external ? { target: '_blank', rel: 'noreferrer' } : {})}
                    {...(download ? { download: 'Aditya_Parihar_Resume.pdf' } : {})}
                    className="relative isolate block rounded-full p-2.5 border border-white/60 overflow-hidden bg-white/5 text-white transition-transform duration-300 group-hover:scale-95 group-hover:text-black"
                  >
                    <span className="w-5 h-5 flex items-center justify-center">
                      <Icon className="w-full h-full transition-colors duration-300" />
                    </span>
                    <span className="absolute inset-0 -z-10 rounded-full bg-white scale-0 group-hover:scale-100 transition-transform duration-300" />
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="flex justify-between py-8 pt-12 text-lg max-md:flex-col max-md:gap-2 max-md:text-sm max-md:text-center max-md:py-6 max-md:pt-8">
          <p>Copyright © {profile.firstName} {profile.lastName} {new Date().getFullYear()}</p>
          <p>Designed &amp; built by {profile.firstName}</p>
        </div>
      </div>
    </footer>
  )
}
