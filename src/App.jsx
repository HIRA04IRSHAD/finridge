import { useEffect, useRef, useState } from 'react'
import { Routes, Route, Link, NavLink, useLocation } from 'react-router-dom'
import Lenis from 'lenis'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { useGSAP } from '@gsap/react'
import { Preloader, Cursor, ScrollProgress, ClickSpark } from './fx.jsx'
import { LOGO, LINKEDIN, PHONE, EMAIL, ADDRESS } from './data.js'
import Home from './pages/Home.jsx'
import Services from './pages/Services.jsx'
import Careers from './pages/Careers.jsx'
import Contact from './pages/Contact.jsx'

gsap.registerPlugin(ScrollTrigger, useGSAP)
import { reduced } from './useReveal.js'

const LINKS = [['Home', '/'], ['Services', '/services'], ['Careers', '/careers'], ['About', '/#about'], ['Contact', '/contact']]
const Logo = () => <Link to="/" className="logo"><img src={LOGO} alt="FinRidge — Unlock your financial potential" /></Link>

export default function App() {
  const [menu, setMenu] = useState(false)
  const [ready, setReady] = useState(reduced)
  const lenisRef = useRef(null)
  const loc = useLocation()

  useEffect(() => {
    if (reduced) return
    const lenis = new Lenis({ lerp: 0.085 })
    lenisRef.current = lenis
    if (import.meta.env.DEV) Object.assign(window, { __lenis: lenis, __gsap: gsap })
    lenis.stop()
    lenis.on('scroll', ScrollTrigger.update)
    const tick = (t) => lenis.raf(t * 1000)
    gsap.ticker.add(tick); gsap.ticker.lagSmoothing(0)
    return () => { gsap.ticker.remove(tick); lenis.destroy() }
  }, [])
  useEffect(() => { if (ready) { lenisRef.current?.start(); ScrollTrigger.refresh() } }, [ready])
  useEffect(() => { if (menu) lenisRef.current?.stop(); else if (ready) lenisRef.current?.start(); document.body.style.overflow = menu ? 'hidden' : '' }, [menu, ready])

  // route change: page-transition wipe, then scroll to top or to #hash
  useEffect(() => {
    setMenu(false)
    const go = () => {
      const el = loc.hash && document.querySelector(loc.hash)
      if (el) lenisRef.current ? lenisRef.current.scrollTo(el, { offset: -70 }) : el.scrollIntoView()
      else { lenisRef.current ? lenisRef.current.scrollTo(0, { immediate: true }) : window.scrollTo(0, 0) }
      ScrollTrigger.refresh()
    }
    const t = setTimeout(go, 60)
    if (!reduced) gsap.fromTo('.wipe', { scaleY: 1, transformOrigin: 'top' }, { scaleY: 0, duration: 0.9, ease: 'expo.inOut', delay: 0.05 })
    return () => clearTimeout(t)
  }, [loc.pathname, loc.hash])

  useGSAP(() => {
    ScrollTrigger.create({ start: 60, end: 'max', toggleClass: { targets: '.nav', className: 'scrolled' } })
  })

  return (
    <>
      {!reduced && !ready && <Preloader onDone={() => setReady(true)} />}
      <div className="wipe" />
      <Cursor /><ClickSpark /><ScrollProgress />
      <header className="nav">
        <Logo />
        <nav className={menu ? 'open' : ''}>
          {LINKS.map(([l, h]) => (
            <NavLink key={h} to={h} end className={({ isActive }) => `roll ${isActive && !h.includes('#') ? 'active' : ''}`} data-t={l}><span>{l}</span></NavLink>
          ))}
          <Link className="btn gold sm" to="/contact#quote"><span>Get a Quote</span></Link>
        </nav>
        <button className={`burger ${menu ? 'x' : ''}`} aria-label="Menu" onClick={() => setMenu(!menu)}><span /><span /></button>
      </header>

      <main key={loc.pathname}>
        <Routes>
          <Route path="/" element={<Home ready={ready} />} />
          <Route path="/services" element={<Services />} />
          <Route path="/careers" element={<Careers />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="*" element={<Home ready={ready} />} />
        </Routes>
      </main>

      <footer className="foot">
        <div className="wrap foot-grid">
          <div><Logo /><p>Finridge Commercial Brokers LLC — retail finance solutions for Islamic and conventional banks across the UAE.</p></div>
          <div className="flinks">{LINKS.map(([l, h]) => <Link key={h} to={h}>{l}</Link>)}
            <a href={LINKEDIN} target="_blank" rel="noreferrer">LinkedIn ↗</a></div>
          <div className="fcontact"><a href={`tel:${PHONE.replace(/\s/g, '')}`}>{PHONE}</a><a href={`mailto:${EMAIL}`}>{EMAIL}</a><p>{ADDRESS}</p></div>
        </div>
        <div className="giant" aria-hidden>{'FINRIDGE'.split('').map((c, i) => <span key={i}>{c}</span>)}</div>
        <p className="copy">© {new Date().getFullYear()} Finridge. All rights reserved.</p>
      </footer>
    </>
  )
}
