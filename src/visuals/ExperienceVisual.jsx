import { Bug, GraduationCap, ShieldCheck, Trophy } from 'lucide-react'
import { siGooglegemini, siMongodb } from '../data/brandIcons'

/* Hover previews for the Experience list (sized with cqw like the covers). */

function BrandIcon({ icon, className, color }) {
  return (
    <svg viewBox="0 0 24 24" className={className} fill={color ?? `#${icon.hex}`} aria-hidden>
      <path d={icon.path} />
    </svg>
  )
}

function Frame({ bg, children, className = '' }) {
  return (
    <div className={`@container absolute inset-0 overflow-hidden ${className}`} style={{ background: bg }}>
      {children}
    </div>
  )
}

function Caption({ kicker, title, dark = true }) {
  return (
    <div className="absolute left-[5cqw] bottom-[5cqw] right-[5cqw]">
      <div className={`text-[2cqw] tracking-[0.18em] uppercase ${dark ? 'text-white/55' : 'text-black/50'}`}>{kicker}</div>
      <div className={`text-[6cqw] leading-[1.02] tracking-tight mt-[1.2cqw] ${dark ? 'text-white' : 'text-[#141414]'}`}>{title}</div>
    </div>
  )
}

const visuals = {
  intern: () => (
    <Frame bg="radial-gradient(80% 90% at 85% 10%, #f16b0d 0%, rgba(241,107,13,0) 60%), #0c0705">
      <ShieldCheck className="absolute right-[6cqw] top-[6cqw] w-[20cqw] h-[20cqw] text-white/90" strokeWidth={1} />
      <Caption kicker="Feb – Mar 2025 · Remote" title={<>Cybersecurity<br />Internship</>} />
    </Frame>
  ),
  gemini: () => (
    <Frame bg="radial-gradient(70% 90% at 80% 20%, rgba(66,133,244,0.55), transparent 60%), radial-gradient(60% 80% at 20% 90%, rgba(217,101,112,0.5), transparent 60%), #0b0b14">
      <BrandIcon icon={siGooglegemini} color="#ffffff" className="absolute right-[7cqw] top-[7cqw] w-[17cqw] h-[17cqw]" />
      <Caption kicker="Google Gemini Program · 2025" title={<>Campus<br />Ambassador</>} />
    </Frame>
  ),
  sih: () => (
    <Frame bg="linear-gradient(120deg, #f16b0d, #e61416)">
      <div className="absolute right-[5cqw] top-[2cqw] text-[22cqw] leading-none font-medium text-white/15 tracking-tighter">SIH</div>
      <Trophy className="absolute left-[5cqw] top-[6cqw] w-[11cqw] h-[11cqw] text-white" strokeWidth={1.2} />
      <Caption kicker="Smart India Hackathon 2026 · ISRO" title={<>Team Lead,<br />6 members</>} />
    </Frame>
  ),
  srm: () => (
    <Frame bg="#F4EFE9">
      <GraduationCap className="absolute right-[6cqw] top-[6cqw] w-[18cqw] h-[18cqw] text-[#e8620f]" strokeWidth={1} />
      <Caption dark={false} kicker="B.Sc. (Hons.) Computer Science" title={<>SRM University AP<br /><span className="text-black/40">Class of 2028</span></>} />
    </Frame>
  ),
  mongo: () => (
    <Frame bg="radial-gradient(80% 90% at 85% 15%, rgba(0,237,100,0.28), transparent 60%), #001e2b">
      <BrandIcon icon={siMongodb} color="#00ed64" className="absolute right-[8cqw] top-[6cqw] w-[16cqw] h-[16cqw]" />
      <Caption kicker="Certification" title={<>MongoDB<br />Certified</>} />
    </Frame>
  ),
  malware: () => (
    <Frame bg="#050505" className="font-mono">
      <div className="absolute inset-[5cqw] text-[1.9cqw] leading-[1.7] text-[#3ddc84]/80">
        <div><span className="text-white/40">$</span> file sample.bin</div>
        <div className="text-white/50">PE32 executable (GUI) Intel 80386</div>
        <div><span className="text-white/40">$</span> strings -n 8 sample.bin | grep -i http</div>
        <div className="text-[#ff5f56]">http://c2.example/beacon?id=…</div>
        <div><span className="text-white/40">$</span> <span className="blink">▌</span></div>
      </div>
      <Bug className="absolute right-[6cqw] top-[6cqw] w-[13cqw] h-[13cqw] text-[#ff5f56]" strokeWidth={1.2} />
      <Caption kicker="Udemy · BTech Wallah × LaunchED" title="Malware Analysis" />
    </Frame>
  ),
}

export default function ExperienceVisual({ type }) {
  const V = visuals[type] ?? visuals.intern
  return <V />
}
