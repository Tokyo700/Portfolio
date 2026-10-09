# Aditya Parihar — Portfolio

A scroll-driven, 3D portfolio built with **React + Vite**, **GSAP ScrollTrigger**, **Lenis** smooth scrolling,
**Framer Motion** (`motion`) and **React Three Fiber**. The layout and motion language are modelled on the
*Elena Voss Portfolio Template* (by Hyperiux, listed on 21st.dev), rebuilt from scratch with my own content.

## Run it

```bash
npm install
npm run dev
```

Then open http://localhost:5173. Build for production with `npm run build` (output in `dist/`), preview with `npm run preview`.

## Edit the content

Everything you'd want to change lives in **`src/data/portfolio.js`** — name, links, hero text, projects,
skills, experience, highlights, FAQ and contact copy.

- **Use your own photo in the hero** – put a transparent PNG in `public/` (e.g. `public/me.png`) and set
  `profile.photo = '/me.png'`. Leave it `null` to keep the interactive 3D core.
- **Receive contact-form messages directly** – create a free form endpoint (Formspree, Web3Forms, Getform…)
  and paste its URL into `contact.formEndpoint`. While it's empty, the form opens the visitor's email app
  with the message pre-filled.
- **Project screenshots** – drop images into `public/projects/` and swap the matching cover in
  `src/visuals/ProjectCover.jsx` (EdgeCast already uses `public/projects/edgecast.png`).
- **Resume** – replace `public/Aditya_Parihar_Resume.pdf`.

## What's where

| Section | File | Motion |
| --- | --- | --- |
| Header | `components/Header.jsx` | fades in after the intro, hides on scroll down |
| Hero | `components/Hero.jsx`, `visuals/HeroScene.jsx` | diagonal mask reveal, split-text, cursor parallax, 3D core, card shrinks to reveal a project wall |
| Research & Projects | `components/Projects.jsx` | orange dome rises, pinned card stack with snapping progress rail |
| Why Work With Me | `components/WhyMe.jsx` | staggered fade-up, hover accent rule |
| Skills | `components/Skills.jsx` | vertical scroll drives a horizontal track, radial hover fill |
| Experience | `components/Experience.jsx` | preview follows the cursor between rows, elastic "plucked string" dividers |
| Toolkit | `components/TechCloud.jsx` | logos fly through 3D space with depth blur |
| Highlights | `components/Highlights.jsx` | Framer Motion carousel (drag / swipe, layout-animated badges) |
| FAQ | `components/FAQ.jsx` | GSAP accordion |
| Contact | `components/Contact.jsx` | contact form + direct links |
| Footer | `components/Footer.jsx` | glass card parallax over a molten glow |

Shared pieces: `components/Copy.jsx` (masked split-text reveal), `components/RollButton.jsx`
(rolling-letter button), `components/StringLine.jsx`, `components/SmoothScroll.jsx`.

All animations respect the visitor's *reduce motion* setting.
