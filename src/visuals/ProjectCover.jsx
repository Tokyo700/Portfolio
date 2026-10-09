import { ShieldCheck } from 'lucide-react'

/*
 * Coded "screenshots" for each project. Everything is sized in container
 * query units (cqw) so a cover looks identical in the hero grid, the
 * project stack and anywhere else it is dropped.
 */

function MockNav({ brand, links, cta, tone = 'dark', mono = false, icon = null }) {
  const dark = tone === 'dark'
  return (
    <div className="flex items-center justify-between px-[4cqw] py-[2.4cqw] text-[1.2cqw] shrink-0">
      <span className={`flex items-center gap-[0.8cqw] font-semibold text-[1.7cqw] tracking-tight ${mono ? 'font-mono' : ''}`}>
        {icon}
        {brand}
      </span>
      <span className={`flex gap-[2.6cqw] ${dark ? 'text-white/60' : 'text-black/55'}`}>
        {links.map((l) => (
          <span key={l}>{l}</span>
        ))}
      </span>
      <span
        className={`px-[1.8cqw] py-[0.8cqw] rounded-full ${
          dark ? 'bg-white/10 border border-white/15 text-white' : 'bg-[#111] text-white'
        }`}
      >
        {cta}
      </span>
    </div>
  )
}

function Chip({ children, tone = 'dark' }) {
  return (
    <span
      className={`px-[1.3cqw] py-[0.55cqw] rounded-full text-[1.1cqw] whitespace-nowrap ${
        tone === 'dark' ? 'border border-white/15 text-white/75 bg-white/5' : 'border border-black/10 text-black/70 bg-black/[0.03]'
      }`}
    >
      {children}
    </span>
  )
}

/* ── 1. Hierarchical Federated IDS ───────────────────────── */
function FederatedCover() {
  const edges = [80, 200, 320]
  const clients = [
    ...[20, 42, 64, 86, 108, 130, 152].map((x) => ({ x: x - 10, e: 0 })),
    ...[164, 186, 208, 230, 252, 274].map((x) => ({ x: x - 22, e: 1 })),
    ...[262, 284, 306, 328, 350, 372, 394].map((x) => ({ x: x - 8, e: 2 })),
  ]
  const flagged = new Set([3, 9, 16])

  return (
    <div className="@container absolute inset-0 flex flex-col bg-[#0b0b10] text-white overflow-hidden">
      <div className="absolute -top-[20cqw] right-[5cqw] w-[45cqw] h-[45cqw] rounded-full bg-[#f16b0d]/25 blur-[8cqw]" />
      <MockNav brand="◆ FedIDS" links={['Topology', 'Datasets', 'Results']} cta="Ongoing" />
      <div className="relative flex-1 flex items-center gap-[3cqw] px-[4cqw] pb-[3cqw]">
        <div className="w-[47%] flex flex-col gap-[1.8cqw]">
          <span className="text-[1.1cqw] tracking-[0.2em] text-[#ff7a2e]">EDGE AI RESEARCH LAB</span>
          <h4 className="text-[5.1cqw] leading-[1.02] font-medium tracking-tight">
            Detect intrusions. Never pool raw traffic.
          </h4>
          <p className="text-[1.35cqw] text-white/55 leading-snug">
            Three-tier federated IDS — client → edge cluster → root — built with SAINT &amp; PyTorch.
          </p>
          <div className="flex flex-wrap gap-[0.8cqw]">
            <Chip>UNSW-NB15</Chip>
            <Chip>CIC IoMT 2024</Chip>
            <Chip>13 classes</Chip>
            <Chip>20 non-IID clients</Chip>
          </div>
        </div>
        <div className="relative flex-1 h-full rounded-[1.6cqw] border border-white/10 bg-white/[0.03] overflow-hidden">
          <svg viewBox="0 0 400 300" className="absolute inset-0 w-full h-full" preserveAspectRatio="xMidYMid meet">
            <defs>
              <radialGradient id="fl-glow">
                <stop offset="0" stopColor="#f16b0d" stopOpacity="0.9" />
                <stop offset="1" stopColor="#f16b0d" stopOpacity="0" />
              </radialGradient>
            </defs>
            {clients.map((c, i) => (
              <line key={`c${i}`} x1={c.x} y1={245} x2={edges[c.e]} y2={150} stroke="rgba(255,255,255,0.18)" strokeWidth="1" />
            ))}
            {edges.map((x) => (
              <line key={`e${x}`} x1={x} y1={150} x2={200} y2={58} stroke="#f16b0d" strokeOpacity="0.7" strokeWidth="1.4" className="flow-dash" />
            ))}
            <circle cx="200" cy="58" r="42" fill="url(#fl-glow)" />
            <circle cx="200" cy="58" r="15" fill="#f16b0d" />
            <circle cx="200" cy="58" r="22" fill="none" stroke="#f16b0d" strokeOpacity="0.5" className="pulse-ring" />
            <text x="200" y="24" textAnchor="middle" fill="rgba(255,255,255,0.7)" fontSize="11" fontFamily="monospace">root</text>
            {edges.map((x) => (
              <g key={`n${x}`}>
                <circle cx={x} cy={150} r="10" fill="#0b0b10" stroke="#fff" strokeWidth="1.5" />
                <circle cx={x} cy={150} r="3.5" fill="#fff" />
              </g>
            ))}
            <text x="320" y="128" textAnchor="middle" fill="rgba(255,255,255,0.5)" fontSize="10" fontFamily="monospace">edge cluster</text>
            {clients.map((c, i) => (
              <circle
                key={`d${i}`}
                cx={c.x}
                cy={245}
                r="5"
                fill={flagged.has(i) ? '#e61416' : 'rgba(255,255,255,0.85)'}
                className={flagged.has(i) ? 'blink' : ''}
              />
            ))}
            <text x="200" y="282" textAnchor="middle" fill="rgba(255,255,255,0.5)" fontSize="10" fontFamily="monospace">
              clients ×20 · raw data stays local
            </text>
          </svg>
        </div>
      </div>
    </div>
  )
}

/* ── 2. Voice activation + streaming ASR ─────────────────── */
function VoiceCover() {
  const bars = Array.from({ length: 44 }, (_, i) => {
    const h = 0.25 + Math.abs(Math.sin(i * 0.9) * Math.cos(i * 0.37)) * 0.75
    return { h, live: i >= 16 }
  })
  return (
    <div className="@container absolute inset-0 flex flex-col bg-[#F4EFE9] text-[#151515] overflow-hidden">
      <MockNav brand="sih-voice-kws" mono tone="light" links={['Firmware', 'Server', 'ASR']} cta="ISRO · SIH26172" />
      <div className="relative flex-1 flex items-center gap-[4cqw] px-[4cqw] pb-[3cqw]">
        <div className="w-[44%] flex flex-col gap-[2cqw]">
          <h4 className="font-serif text-[6cqw] leading-[1.02] tracking-tight">
            Wake.
            <br />
            Listen.
            <br />
            Transcribe.
          </h4>
          <p className="text-[1.4cqw] text-black/60 leading-snug w-[90%]">
            A TinyML wake-word engine on the ESP32-S3 streaming into a causal ASR — no cloud listener, no clipped first words.
          </p>
        </div>
        <div className="flex-1 h-[86%] rounded-[1.8cqw] bg-[#141414] text-white p-[2.6cqw] flex flex-col justify-between">
          <div className="flex items-center justify-between text-[1.15cqw]">
            <span className="flex items-center gap-[0.8cqw]">
              <span className="w-[0.9cqw] h-[0.9cqw] rounded-full bg-[#3ddc84] blink" />
              Wake word detected
            </span>
            <span className="font-mono text-white/50">ESP32-S3 · I2S DMA</span>
          </div>
          <div className="flex items-center gap-[0.45cqw] h-[45%]">
            {bars.map((b, i) => (
              <span
                key={i}
                className={`flex-1 rounded-full ${b.live ? 'bg-[#f16b0d] eq-bar' : 'bg-white/25'}`}
                style={{ height: `${b.h * 100}%`, animationDelay: `${(i % 7) * 0.12}s` }}
              />
            ))}
          </div>
          <div className="flex justify-between text-[1.05cqw] font-mono text-white/45 -mt-[1cqw]">
            <span>← 2 s pre-roll</span>
            <span>live stream →</span>
          </div>
          <div className="grid grid-cols-3 gap-[1cqw]">
            {[
              ['< 256 KB', 'RAM budget'],
              ['2 s', 'DMA pre-roll'],
              ['TFLite', 'Micro + causal ASR'],
            ].map(([v, l]) => (
              <div key={l} className="rounded-[1cqw] bg-white/[0.06] px-[1.4cqw] py-[1.1cqw]">
                <div className="text-[2.1cqw] leading-none">{v}</div>
                <div className="text-[1cqw] text-white/50 mt-[0.6cqw]">{l}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}

/* ── 3. EdgeCast (real screenshot) ───────────────────────── */
function EdgeCastCover() {
  return (
    <div className="absolute inset-0 bg-[#0a0c10]">
      <img
        src="/projects/edgecast.png"
        alt="EdgeCast — adaptive AI blending of weather forecasts"
        className="w-full h-full object-cover object-left-top"
        loading="lazy"
        draggable={false}
      />
    </div>
  )
}

/* ── 4. Digital Warranty & Asset Tracking ────────────────── */
function WarrantyCover() {
  const rows = [
    ['MacBook Air M2', 'Laptop', 'Active', 'bg-emerald-100 text-emerald-700'],
    ['Samsung Refrigerator', 'Appliance', 'Expiring', 'bg-amber-100 text-amber-700'],
    ['Dell UltraSharp 27', 'Monitor', 'Active', 'bg-emerald-100 text-emerald-700'],
    ['Bosch Washer', 'Appliance', 'Expired', 'bg-rose-100 text-rose-700'],
    ['iPhone 15', 'Phone', 'Active', 'bg-emerald-100 text-emerald-700'],
  ]
  return (
    <div className="@container absolute inset-0 flex flex-col bg-[#eef2f7] text-[#0f172a] overflow-hidden">
      <MockNav
        brand="Digital Warranty"
        tone="light"
        icon={<ShieldCheck className="w-[2cqw] h-[2cqw] text-[#2563eb]" strokeWidth={2.2} />}
        links={['Products', 'Maintenance', 'Admin']}
        cta="Register product"
      />
      <div className="relative flex-1 flex items-center gap-[3.5cqw] px-[4cqw] pb-[3cqw]">
        <div className="w-[40%] flex flex-col gap-[2cqw]">
          <h4 className="text-[4.8cqw] leading-[1.04] font-medium tracking-tight">Every warranty, tracked to the day.</h4>
          <p className="text-[1.35cqw] text-slate-500">Register products, upload invoices, log maintenance — with an admin console on top.</p>
          <div className="grid grid-cols-3 gap-[1cqw]">
            {[
              ['Products', 'bg-white'],
              ['Expiring', 'bg-white'],
              ['Service', 'bg-white'],
            ].map(([l, bg], i) => (
              <div key={l} className={`${bg} rounded-[1.2cqw] p-[1.3cqw] shadow-sm`}>
                <div className={`h-[0.6cqw] w-[60%] rounded-full ${['bg-blue-500', 'bg-amber-400', 'bg-violet-500'][i]}`} />
                <div className="text-[1.05cqw] text-slate-500 mt-[1cqw]">{l}</div>
              </div>
            ))}
          </div>
        </div>
        <div className="flex-1 rounded-[1.8cqw] bg-white shadow-[0_2cqw_5cqw_rgba(15,23,42,0.12)] p-[2.2cqw]">
          <div className="flex items-center justify-between mb-[1.4cqw]">
            <span className="text-[1.6cqw] font-medium">My products</span>
            <span className="text-[1.1cqw] text-slate-400">JWT · MongoDB</span>
          </div>
          <div className="divide-y divide-slate-100">
            {rows.map(([name, kind, status, cls]) => (
              <div key={name} className="flex items-center justify-between py-[1.15cqw] text-[1.25cqw]">
                <span className="flex items-center gap-[1.2cqw]">
                  <span className="w-[2.6cqw] h-[2.6cqw] rounded-[0.7cqw] bg-slate-100" />
                  <span>
                    <span className="block font-medium">{name}</span>
                    <span className="block text-[1cqw] text-slate-400">{kind}</span>
                  </span>
                </span>
                <span className={`px-[1.1cqw] py-[0.4cqw] rounded-full text-[1.05cqw] ${cls}`}>{status}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}

/* ── 5. Hostel Management DB ─────────────────────────────── */
function Table({ name, cols, className }) {
  return (
    <div className={`absolute rounded-[1cqw] border border-white/15 bg-[#161b22] overflow-hidden ${className}`}>
      <div className="px-[1.2cqw] py-[0.7cqw] bg-[#f16b0d] text-[#140a05] text-[1.15cqw] font-semibold">{name}</div>
      {cols.map(([c, k]) => (
        <div key={c} className="flex justify-between gap-[1.5cqw] px-[1.2cqw] py-[0.45cqw] text-[1.02cqw] border-t border-white/5">
          <span className="text-white/80">{c}</span>
          <span className={k === 'PK' ? 'text-[#f9c74f]' : k === 'FK' ? 'text-[#4cc9f0]' : 'text-white/35'}>{k}</span>
        </div>
      ))}
    </div>
  )
}

function DatabaseCover() {
  return (
    <div className="@container absolute inset-0 flex flex-col bg-[#0d1117] text-white overflow-hidden font-mono">
      <MockNav brand="hostel_db" mono links={['schema', 'constraints', 'queries']} cta="PostgreSQL" />
      <div className="relative flex-1 flex gap-[3cqw] px-[4cqw] pb-[3cqw]">
        <div className="w-[40%] flex flex-col justify-center gap-[2cqw]">
          <h4 className="text-[3.6cqw] leading-[1.1] font-sans font-medium tracking-tight">
            Normalized, constrained, ER-modelled.
          </h4>
          <pre className="text-[1.1cqw] leading-[1.55] rounded-[1.2cqw] bg-white/[0.04] border border-white/10 p-[1.6cqw] whitespace-pre text-white/70">
            <span className="text-[#ff7b72]">CREATE TABLE</span> allocations (
            {'\n'}  alloc_id   <span className="text-[#79c0ff]">SERIAL PRIMARY KEY</span>,
            {'\n'}  student_id <span className="text-[#79c0ff]">INT REFERENCES</span> students,
            {'\n'}  room_id    <span className="text-[#79c0ff]">INT REFERENCES</span> rooms,
            {'\n'}  from_date  <span className="text-[#79c0ff]">DATE NOT NULL</span>,
            {'\n'}  <span className="text-[#ff7b72]">CHECK</span> (to_date &gt; from_date)
            {'\n'});
          </pre>
        </div>
        <div className="relative flex-1">
          <svg className="absolute inset-0 w-full h-full" viewBox="0 0 100 100" preserveAspectRatio="none">
            <path d="M30 22 C 45 22, 45 50, 58 50" stroke="#4cc9f0" strokeOpacity="0.5" fill="none" strokeWidth="0.4" className="flow-dash" vectorEffect="non-scaling-stroke" />
            <path d="M30 75 C 45 75, 45 55, 58 55" stroke="#4cc9f0" strokeOpacity="0.5" fill="none" strokeWidth="0.4" className="flow-dash" vectorEffect="non-scaling-stroke" />
            <path d="M18 40 L 18 60" stroke="#4cc9f0" strokeOpacity="0.5" fill="none" strokeWidth="0.4" vectorEffect="non-scaling-stroke" />
          </svg>
          <Table name="students" className="left-0 top-[4%] w-[38%]" cols={[['student_id', 'PK'], ['name', 'text'], ['email', 'uniq'], ['phone', 'text']]} />
          <Table name="fees" className="left-0 top-[60%] w-[38%]" cols={[['fee_id', 'PK'], ['student_id', 'FK'], ['amount', 'num']]} />
          <Table name="allocations" className="right-0 top-[30%] w-[44%]" cols={[['alloc_id', 'PK'], ['student_id', 'FK'], ['room_id', 'FK'], ['from_date', 'date']]} />
        </div>
      </div>
    </div>
  )
}

const covers = {
  fl: FederatedCover,
  kws: VoiceCover,
  edgecast: EdgeCastCover,
  warranty: WarrantyCover,
  db: DatabaseCover,
}

export default function ProjectCover({ type }) {
  const Cover = covers[type] ?? FederatedCover
  return <Cover />
}
