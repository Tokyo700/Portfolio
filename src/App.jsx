import { useEffect } from 'react'
import { ScrollTrigger } from './hooks/gsap'
import SmoothScroll from './components/SmoothScroll'
import Header from './components/Header'
import Hero from './components/Hero'
import Projects from './components/Projects'
import WhyMe from './components/WhyMe'
import Skills from './components/Skills'
import Experience from './components/Experience'
import TechCloud from './components/TechCloud'
import Highlights from './components/Highlights'
import FAQ from './components/FAQ'
import Contact from './components/Contact'
import Footer from './components/Footer'

export default function App() {
  // re-measure every scroll trigger once fonts and images have settled
  useEffect(() => {
    const refresh = () => ScrollTrigger.refresh()
    document.fonts?.ready.then(refresh)
    window.addEventListener('load', refresh)
    return () => window.removeEventListener('load', refresh)
  }, [])

  return (
    <SmoothScroll>
      <Header />
      <main className="bg-ink overflow-x-clip">
        <Hero />
        <Projects />
        <WhyMe />
        <Skills />
        <Experience />
        <TechCloud />
        <Highlights />
        <FAQ />
        <Contact />
      </main>
      <Footer />
    </SmoothScroll>
  )
}
