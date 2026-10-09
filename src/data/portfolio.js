// ─────────────────────────────────────────────────────────────
//  All portfolio content lives here. Edit this file to update
//  text, links and projects — the components read from it.
// ─────────────────────────────────────────────────────────────

export const profile = {
  firstName: 'Aditya',
  lastName: 'Parihar',
  role: 'AI Security & Edge AI',
  tagline: 'CS Student\nSRM University AP',
  email: 'adityaparihar914@gmail.com',
  phone: '+91 82877 90184',
  location: 'Andhra Pradesh · Gurugram, India',
  github: 'https://github.com/Tokyo700',
  linkedin: 'https://www.linkedin.com/in/aditya-parihar007',
  resume: '/Aditya_Parihar_Resume.pdf',
  // Drop a transparent PNG of yourself into /public (e.g. /public/me.png)
  // and set this to '/me.png' to show a portrait instead of the 3D core.
  photo: null,
}

export const hero = {
  heading: 'Securing the Minds of Machines',
  sideTop: 'AI Security &\nEdge AI',
  sideBottom: 'CS Student\nSRM University AP',
}

// cover: which visual to render for the project (see src/visuals/ProjectCover.jsx)
export const projects = [
  {
    name: 'Federated IDS',
    title: 'Hierarchical Federated Learning for Intrusion Detection',
    tags: ['AI Security', 'PyTorch · SAINT'],
    status: 'Ongoing · Edge AI Research Lab',
    cover: 'fl',
    link: null,
  },
  {
    name: 'Voice Activation & ASR',
    title: 'Low-Latency Voice Activation & Streaming ASR',
    tags: ['ISRO · SIH26172', 'ESP32-S3 · TFLite Micro'],
    cover: 'kws',
    link: 'https://github.com/Tokyo700/sih-voice-kws',
  },
  {
    name: 'EdgeCast',
    title: 'Adaptive AI Blending of Weather Forecasts',
    tags: ['SIH26081', 'LightGBM · FastAPI'],
    cover: 'edgecast',
    link: 'https://nwp-forecast.vercel.app',
  },
  {
    name: 'Warranty & Asset Tracker',
    title: 'Digital Warranty & Asset Tracking',
    tags: ['Full Stack', 'React · Express · MongoDB'],
    cover: 'warranty',
    link: 'https://github.com/Tokyo700/Digital-Warranty-Asset-Tracking',
  },
  {
    name: 'Hostel Management DB',
    title: 'Hostel Management Database System',
    tags: ['Database Systems', 'PostgreSQL · ER Modeling'],
    cover: 'db',
    link: null,
  },
]

export const whyMe = {
  heading: 'Why Work With Me?',
  sub: 'Security-first engineering, from model to metal',
  cards: [
    {
      icon: 'shield',
      title: 'Attacker’s Mindset',
      text: 'I look at every system the way an adversary would — threat assessment, risk analysis and hands-on tooling with Wireshark, Nmap, Burp Suite and Kali Linux.',
    },
    {
      icon: 'cpu',
      title: 'AI That Runs at the Edge',
      text: 'From federated intrusion detection across 20 non-IID clients to wake-word models squeezed under 256 KB of RAM on an ESP32-S3 — ML that respects real hardware.',
    },
    {
      icon: 'database',
      title: 'Solid Backend Foundations',
      text: 'Normalized PostgreSQL schemas, leakage-safe data pipelines and clean APIs with FastAPI and Express — the unglamorous groundwork that keeps systems correct.',
    },
  ],
}

export const skills = {
  heading: ['Security That Thinks', 'Like an Attacker'],
  intro:
    'I’m a Computer Science student targeting AI Security roles, working where cybersecurity, backend development and database systems meet. My toolkit runs from Python, C/C++ and PostgreSQL to privacy-preserving machine learning for network intrusion detection — and I like building things that hold up when someone tries to break them.',
  cards: [
    { title: 'AI Security', items: ['Federated Learning', 'ML Intrusion Detection', 'TinyML / Edge AI', 'Privacy-Preserving ML'] },
    { title: 'AI / ML', items: ['PyTorch', 'TensorFlow / TFLite Micro', 'LightGBM', 'scikit-learn'] },
    { title: 'Security Tools', items: ['Wireshark', 'Nmap', 'Burp Suite', 'Kali Linux'] },
    { title: 'Languages', items: ['Python', 'C', 'C++', 'SQL'] },
    { title: 'Backend & Data', items: ['PostgreSQL', 'MongoDB', 'FastAPI', 'Node.js / Express'] },
    { title: 'Foundations', items: ['Data Structures & Algorithms', 'Computer Architecture', 'Assembly Basics', 'Linux'] },
  ],
}

// visual: which preview to render on hover (see src/visuals/ExperienceVisual.jsx)
export const experience = {
  heading: ['Experience and', 'Recognition'],
  items: [
    { title: 'Cybersecurity Intern — LaunchED Global × IIT Bombay', meta: 'FEB – MAR 2025 · REMOTE · WITH SJMSOM, IIT BOMBAY', visual: 'intern' },
    { title: 'Google Gemini Campus Ambassador', meta: '2025 · GOOGLE GEMINI PROGRAM', visual: 'gemini' },
    { title: 'Team Lead — Smart India Hackathon 2026', meta: '6-MEMBER TEAM · TWO ISRO PROBLEM STATEMENTS', visual: 'sih' },
    { title: 'B.Sc. (Hons.) Computer Science — SRM University AP', meta: 'EXPECTED 2028 · ANDHRA PRADESH', visual: 'srm' },
    { title: 'MongoDB Certification', meta: 'QUALIFIED · NOSQL DATABASE FUNDAMENTALS', visual: 'mongo' },
    { title: 'Malware Analysis & Cybersecurity Mentorship', meta: 'UDEMY · BTECH WALLAH × LAUNCHED GLOBAL', visual: 'malware' },
  ],
}

// logo keys are defined in src/components/TechCloud.jsx (paths live in src/data/brandIcons.js)
export const techCloud = {
  heading: 'Fluent in the Tools That Secure and Power Modern AI.',
  logos: ['python', 'pytorch', 'tensorflow', 'kali', 'wireshark', 'postgresql', 'cpp', 'scikit', 'mongodb', 'fastapi', 'espressif', 'burp'],
}

export const highlights = {
  heading: ['Don’t Take My Word for It,', 'Take It from the Numbers'],
  items: [
    {
      value: '0.32 → 0.90',
      label: 'Heatwave detection (POD) · EdgeCast',
      icon: 'gauge',
      text: 'Calibrated next-day district alerts in English and Telugu for 59 districts of Andhra Pradesh and Telangana, raising heatwave probability of detection from 0.32 to 0.90 on a year the model never saw.',
    },
    {
      value: '9–18% lower',
      label: 'Wind RMSE vs. any single source · EdgeCast',
      icon: 'radar',
      text: 'A blender that learns per-grid-point trust weights across ML and physical forecast models — and delivers the best max-temperature RMSE at all five lead days.',
    },
    {
      value: '20 clients',
      label: 'Non-IID federated IDS · Edge AI Research Lab',
      icon: 'network',
      text: 'A three-tier client → edge cluster → root intrusion detection system trained across UNSW-NB15 and CIC IoMT 2024 without ever centralising raw network traffic.',
    },
    {
      value: '< 256 KB',
      label: 'RAM budget on ESP32-S3 · ISRO SIH26172',
      icon: 'mic',
      text: 'On-device wake-word detection with a 2-second DMA pre-roll buffer feeding a causal streaming ASR model exported to TFLite — no first-word clipping, no always-on cloud listener.',
    },
    {
      value: '6 members',
      label: 'Team lead · Smart India Hackathon 2026',
      icon: 'users',
      text: 'Led a six-member team across two ISRO problem statements, owning model training and the security of the audio stream end to end.',
    },
  ],
}

export const faq = {
  heading: 'Frequently Asked Questions',
  items: [
    {
      q: 'Who is Aditya Parihar and what do you focus on?',
      a: 'I’m a Computer Science student at SRM University AP (B.Sc. Hons., expected 2028) working toward AI Security roles. My focus sits where cybersecurity, backend development and database systems meet — with hands-on work in Python, C/C++, PostgreSQL and privacy-preserving ML for network intrusion detection.',
    },
    {
      q: 'What kind of roles or collaborations are you looking for?',
      a: 'Internships and research collaborations in AI security, ML-based intrusion detection, edge / TinyML systems and backend engineering. I’m happy to join security teams, research labs or product teams that want systems that are both intelligent and hard to break.',
    },
    {
      q: 'What are you researching right now?',
      a: 'Hierarchical federated learning for intrusion detection: a three-tier (client → edge cluster → root) federated IDS built with SAINT and PyTorch, trained across UNSW-NB15 and CIC IoMT 2024 over 20 non-IID clients, with a leakage-safe preprocessing pipeline and a two-machine federated deployment over HTTP.',
    },
    {
      q: 'Which tools and languages do you work with?',
      a: 'Python, C, C++ and SQL day to day; PyTorch, TensorFlow / TFLite Micro, LightGBM and scikit-learn for ML; Wireshark, Nmap, Burp Suite and Kali Linux for security work; and PostgreSQL, MongoDB, FastAPI and Node.js on the backend.',
    },
    {
      q: 'How do you keep your security skills sharp?',
      a: 'Through structured learning and constant building — a cybersecurity internship with LaunchED Global in collaboration with SJMSOM, IIT Bombay, a malware analysis course, the BTech Wallah × LaunchED cybersecurity mentorship program, MongoDB certification, and shipping hackathon projects under real deadlines.',
    },
  ],
}

export const contact = {
  heading: ['Let’s Build Something', 'Secure Together'],
  sub: 'Open to internships, research collaborations and interesting security problems. Drop a message and I’ll get back to you.',
  // Optional: paste a Formspree / Web3Forms / Getform endpoint here to receive
  // messages directly. When empty, the form opens the visitor's email app.
  formEndpoint: '',
}

export const footer = {
  cta: 'Have a Problem Worth Securing?',
}
