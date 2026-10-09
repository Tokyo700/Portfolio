import { useRef, useState } from 'react'
import { ArrowUpRight, FileText, Mail, MapPin, Phone } from 'lucide-react'
import { siGithub } from '../data/brandIcons'
import { gsap, useGSAP } from '../hooks/gsap'
import { useReducedMotion } from '../hooks/useReducedMotion'
import { contact, profile } from '../data/portfolio'
import Copy from './Copy'
import RollButton from './RollButton'
import StringLine from './StringLine'

export function GithubIcon({ className }) {
  return (
    <svg viewBox="0 0 24 24" className={className} fill="currentColor" aria-hidden>
      <path d={siGithub.path} />
    </svg>
  )
}

export function LinkedinIcon({ className }) {
  return (
    <svg viewBox="0 0 24 24" className={className} fill="currentColor" aria-hidden>
      <path d="M20.45 20.45h-3.56v-5.57c0-1.33-.02-3.04-1.85-3.04-1.85 0-2.14 1.45-2.14 2.94v5.67H9.35V9h3.41v1.56h.05c.48-.9 1.64-1.85 3.37-1.85 3.6 0 4.27 2.37 4.27 5.46v6.28zM5.34 7.43a2.06 2.06 0 1 1 0-4.13 2.06 2.06 0 0 1 0 4.13zM7.12 20.45H3.56V9h3.56v11.45zM22.22 0H1.77C.79 0 0 .77 0 1.73v20.54C0 23.23.79 24 1.77 24h20.45c.98 0 1.78-.77 1.78-1.73V1.73C24 .77 23.2 0 22.22 0z" />
    </svg>
  )
}

const channels = [
  { label: 'Email', value: profile.email, href: `mailto:${profile.email}`, Icon: Mail },
  { label: 'Phone', value: profile.phone, href: `tel:${profile.phone.replace(/\s/g, '')}`, Icon: Phone },
  { label: 'LinkedIn', value: 'in/aditya-parihar007', href: profile.linkedin, Icon: LinkedinIcon, external: true },
  { label: 'GitHub', value: 'github.com/Tokyo700', href: profile.github, Icon: GithubIcon, external: true },
  { label: 'Resume', value: 'Download PDF', href: profile.resume, Icon: FileText, download: true },
]

const field =
  'w-full bg-white/[0.08] border border-white/15 px-[1.6vw] py-[1vw] text-[1.1vw] text-white outline-none transition-colors focus:border-[#f16b0d] focus:bg-white/[0.12] max-[1025px]:px-5 max-[1025px]:py-3.5 max-[1025px]:text-[2.2vw] max-md:text-[4vw]'

export default function Contact() {
  const sectionRef = useRef(null)
  const [status, setStatus] = useState('idle') // idle | sending | sent | mailto | error
  const reduced = useReducedMotion()

  useGSAP(() => {
    const els = gsap.utils.toArray('.contact-fade')
    if (reduced) {
      gsap.set(els, { opacity: 1, y: 0 })
      return
    }
    gsap.fromTo(els, { opacity: 0, y: 40 }, {
      opacity: 1,
      y: 0,
      duration: 0.9,
      stagger: 0.12,
      ease: 'power2.out',
      scrollTrigger: { trigger: sectionRef.current, start: 'top 65%', once: true },
    })
  }, { scope: sectionRef, dependencies: [reduced] })

  const onSubmit = async (e) => {
    e.preventDefault()
    const form = e.currentTarget
    const data = Object.fromEntries(new FormData(form))

    if (contact.formEndpoint) {
      setStatus('sending')
      try {
        const res = await fetch(contact.formEndpoint, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
          body: JSON.stringify(data),
        })
        if (!res.ok) throw new Error(res.statusText)
        form.reset()
        setStatus('sent')
      } catch {
        setStatus('error')
      }
      return
    }

    // no backend configured: hand the message to the visitor's email app
    const body = `${data.message}\n\n— ${data.name} (${data.email})`
    window.location.href = `mailto:${profile.email}?subject=${encodeURIComponent(data.subject || 'Hello Aditya')}&body=${encodeURIComponent(body)}`
    setStatus('mailto')
  }

  const note = {
    sending: 'Sending…',
    sent: 'Thanks! Your message is on its way — I’ll reply soon.',
    mailto: 'Your email app should open with the message ready to send.',
    error: `Something went wrong. Please email me directly at ${profile.email}.`,
  }[status]

  return (
    <section ref={sectionRef} id="contact" className="relative w-full bg-ink text-white py-[8vw] px-[4vw] overflow-hidden max-[1025px]:px-[5vw] max-[1025px]:py-[14vw]">
      <div className="absolute -right-[10vw] top-[10%] w-[45vw] h-[45vw] rounded-full bg-[#f16b0d]/20 blur-[10vw] pointer-events-none" />

      <div className="relative grid grid-cols-[minmax(0,1fr)_minmax(0,1.15fr)] gap-[5vw] items-start max-[1025px]:grid-cols-1 max-[1025px]:gap-[10vw]">
        <div>
          <span className="contact-fade opacity-0 inline-flex items-center gap-2 text-[1vw] tracking-[0.2em] text-[#ff7a2e] max-[1025px]:text-[2vw] max-md:text-[3.4vw]">
            <span className="w-2 h-2 rounded-full bg-[#3ddc84] blink" /> AVAILABLE FOR INTERNSHIPS
          </span>
          <Copy stagger={0.015} className="mt-[1.5vw] max-md:mt-4">
            <h2 className="text-[5vw] leading-[1.1] max-[1025px]:text-[7vw] max-md:text-[10vw]">
              {contact.heading[0]}
              <br />
              {contact.heading[1]}
            </h2>
          </Copy>
          <p className="contact-fade opacity-0 mt-[1.8vw] w-[85%] text-[1.25vw] leading-[1.55] text-white/70 max-[1025px]:w-full max-[1025px]:text-[2.5vw] max-md:text-[4.2vw] max-md:mt-5">
            {contact.sub}
          </p>

          <ul className="contact-fade opacity-0 mt-[3vw] max-md:mt-8">
            {channels.map(({ label, value, href, Icon, external, download }, i) => (
              <li key={label}>
                {i === 0 && <StringLine />}
                <a
                  href={href}
                  {...(external ? { target: '_blank', rel: 'noreferrer' } : {})}
                  {...(download ? { download: 'Aditya_Parihar_Resume.pdf' } : {})}
                  className="under-multi-parent group flex items-center justify-between gap-4 py-[1.3vw] max-[1025px]:py-4"
                >
                  <span className="flex items-center gap-[1.2vw] max-[1025px]:gap-4">
                    <span className="w-[2.6vw] h-[2.6vw] min-w-9 min-h-9 rounded-full border border-white/20 flex items-center justify-center transition-colors duration-300 group-hover:bg-white group-hover:text-black">
                      <Icon className="w-[45%] h-[45%]" />
                    </span>
                    <span className="text-[0.95vw] tracking-[0.15em] text-white/45 w-[7vw] uppercase max-[1025px]:text-[1.8vw] max-[1025px]:w-[16vw] max-md:text-[3vw] max-md:w-[20vw]">{label}</span>
                    <span className="under-multi text-[1.3vw] max-[1025px]:text-[2.6vw] max-md:text-[4vw]">{value}</span>
                  </span>
                  <ArrowUpRight className="w-[1.4vw] h-[1.4vw] min-w-4 min-h-4 text-white/50 transition-all duration-300 group-hover:text-white group-hover:translate-x-1 group-hover:-translate-y-1" />
                </a>
                <StringLine />
              </li>
            ))}
          </ul>

          <p className="contact-fade opacity-0 mt-[2vw] flex items-center gap-2 text-[1vw] text-white/45 max-[1025px]:text-[2vw] max-md:text-[3.4vw] max-md:mt-6">
            <MapPin className="w-4 h-4" /> {profile.location}
          </p>
        </div>

        <form
          onSubmit={onSubmit}
          className="contact-form contact-fade opacity-0 rounded-[2vw] bg-white/5 backdrop-blur-lg border border-white/10 p-[3vw] flex flex-col gap-[1.2vw] max-[1025px]:rounded-3xl max-[1025px]:p-8 max-[1025px]:gap-4 max-md:p-6"
        >
          <div className="flex items-baseline justify-between mb-[0.8vw] max-[1025px]:mb-2">
            <h3 className="text-[2.6vw] leading-none max-[1025px]:text-[5vw] max-md:text-[7.5vw]">Get in Touch</h3>
            <span className="text-[1vw] text-white/45 max-[1025px]:text-[2vw] max-md:text-[3.4vw]">Drop me a message</span>
          </div>
          <div className="grid grid-cols-2 gap-[1.2vw] max-md:grid-cols-1 max-[1025px]:gap-4">
            <input name="name" required placeholder="Your Name*" autoComplete="name" className={`${field} rounded-full`} />
            <input name="email" type="email" required placeholder="Email Address*" autoComplete="email" className={`${field} rounded-full`} />
          </div>
          <input name="subject" required placeholder="Subject*" className={`${field} rounded-full`} />
          <textarea
            name="message"
            required
            rows={5}
            placeholder="Your Message*"
            className={`${field} rounded-[1.6vw] resize-none max-[1025px]:rounded-3xl`}
          />
          <div className="flex items-center justify-between gap-4 mt-[0.8vw] flex-wrap max-[1025px]:mt-2">
            <RollButton type="submit" variant="flame" disabled={status === 'sending'}>
              {status === 'sending' ? 'Sending…' : 'Send Message'}
            </RollButton>
            <p aria-live="polite" className={`text-[1vw] max-w-[60%] max-[1025px]:text-[2vw] max-md:text-[3.4vw] max-md:max-w-full ${status === 'error' ? 'text-[#ff6b6b]' : 'text-white/60'}`}>
              {note}
            </p>
          </div>
        </form>
      </div>
    </section>
  )
}
