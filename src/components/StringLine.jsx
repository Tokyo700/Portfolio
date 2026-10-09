import { useEffect, useRef } from 'react'
import { useReducedMotion } from '../hooks/useReducedMotion'

// ── tiny plucked-string synth (Karplus–Strong) ───────────────
const NOTES = [146.83, 164.81, 196, 220, 261.63, 293.66, 329.63, 392]
let audio = null
let noteIndex = 0

function pluck(strength) {
  const Ctx = window.AudioContext ?? window.webkitAudioContext
  if (!Ctx) return
  // browsers only allow sound after the visitor has clicked/tapped the page
  if (navigator.userActivation && !navigator.userActivation.hasBeenActive) return
  audio ??= new Ctx()
  if (audio.state === 'suspended') audio.resume()

  const amount = Math.min(Math.abs(strength) / 60, 1)
  if (amount < 0.05) return

  noteIndex = (noteIndex + 1 + Math.floor(Math.random() * 2)) % NOTES.length
  const sr = audio.sampleRate
  const period = Math.max(2, Math.floor(sr / NOTES[noteIndex]))
  const length = Math.floor(sr * 2)
  const buffer = audio.createBuffer(1, length, sr)
  const data = buffer.getChannelData(0)
  const ring = new Float32Array(period).map(() => Math.random() * 2 - 1)
  const decay = 0.996 - (1 - amount) * 0.003
  for (let i = 0, p = 0; i < length; i++, p = (p + 1) % period) {
    const next = (ring[p] + ring[(p + 1) % period]) * 0.5 * decay
    data[i] = ring[p]
    ring[p] = next
  }

  const src = audio.createBufferSource()
  src.buffer = buffer
  const lowpass = audio.createBiquadFilter()
  lowpass.type = 'lowpass'
  lowpass.frequency.value = 750 + 700 * amount
  const gain = audio.createGain()
  const t = audio.currentTime
  const peak = 0.08 + 0.17 * amount
  gain.gain.setValueAtTime(0.0001, t)
  gain.gain.exponentialRampToValueAtTime(peak, t + 0.02)
  gain.gain.exponentialRampToValueAtTime(0.0001, t + 2)
  src.connect(lowpass).connect(gain).connect(audio.destination)
  src.start(t)
  src.stop(t + 2)
}

/**
 * A 1px divider that bends with the cursor and wobbles back when released,
 * like a plucked string.
 */
export default function StringLine({ color = 'rgba(255,255,255,0.4)', sound = true }) {
  const wrapRef = useRef(null)
  const pathRef = useRef(null)
  const offset = useRef(0)
  const phase = useRef(Math.PI / 2)
  const raf = useRef(null)
  const reduced = useReducedMotion()

  const draw = (y) => {
    const w = wrapRef.current?.offsetWidth ?? 0
    pathRef.current?.setAttribute('d', `M 0 50 Q ${w / 2} ${50 + y} ${w} 50`)
  }

  useEffect(() => {
    draw(0)
    const onResize = () => draw(offset.current)
    window.addEventListener('resize', onResize)
    return () => {
      window.removeEventListener('resize', onResize)
      cancelAnimationFrame(raf.current)
    }
  }, [])

  const settle = () => {
    draw(offset.current * Math.sin(phase.current))
    offset.current *= 0.95
    phase.current += 0.5
    if (Math.abs(offset.current) > 0.1) raf.current = requestAnimationFrame(settle)
    else {
      offset.current = 0
      phase.current = Math.PI / 2
      draw(0)
    }
  }

  const handlers = reduced
    ? {}
    : {
        onMouseEnter: () => {
          cancelAnimationFrame(raf.current)
          phase.current = Math.PI / 2
        },
        onMouseMove: (e) => {
          offset.current = Math.max(-70, Math.min(70, offset.current + e.movementY / 2))
          draw(offset.current)
        },
        onMouseLeave: () => {
          if (sound) pluck(offset.current)
          settle()
        },
      }

  return (
    <div ref={wrapRef} className="w-full">
      <div className="string-line">
        <span className="string-hit" {...handlers} />
        <svg>
          <path ref={pathRef} strokeWidth={1} fill="none" style={{ stroke: color }} />
        </svg>
      </div>
    </div>
  )
}
