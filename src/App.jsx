import { useEffect, useRef, useState } from 'react'
import Lenis from 'lenis'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { useGSAP } from '@gsap/react'
import * as THREE from 'three'
import NET from 'vanta/dist/vanta.net.min'
import { SplitText, ShinyText, SpotlightCard, CountUp, Magnet, LogoLoop } from './bits.jsx'
import { Preloader, Cursor, ScrollReveal, ScrollVelocity, TiltedCard, ScrollProgress, ClickSpark } from './fx.jsx'

gsap.registerPlugin(ScrollTrigger, useGSAP)
const reduced = typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches

const SERVICES = [
  ['01', 'Specialized Sales', 'A dedicated sales force that champions our partner banks’ products to retail and corporate clients.'],
  ['02', 'Excellence in Quality', 'We onboard the right customers and hold every interaction to a high service standard.'],
  ['03', 'Fully Compliant', 'Every process follows the governance, regulatory and policy requirements our partners set.'],
  ['04', 'Safe Handling', 'Personal and financial data is protected with rigorous, bank-grade care.'],
]
const PILLARS = ['Extensive Industry Experience', 'Strong Industry Network', 'Client-Focused Approach', 'Regulatory Compliance Expertise']
const PRINCIPLES = [
  ['Customer-Centric', 'Customers stay at the centre of every decision we make — from first call to final approval.'],
  ['Financial Inclusion', 'Making credit and finance accessible to more people across the UAE.'],
  ['Trust & Transparency', 'Clear terms, honest advice and relationships built to last.'],
  ['Innovation & Adaptability', 'Evolving with the market so our partners and clients stay ahead.'],
]
const JOBS = [
  ['Credit Card Sales', 'Results-driven representatives to grow our card portfolio.'],
  ['Personal Finance Sales', 'Specialists who match clients with the right loan.'],
  ['Team Leader – Credit Card Sales', 'Lead, coach and motivate a high-performing card team.'],
  ['Team Leader – Personal Finance', 'Drive a personal finance sales team to its targets.'],
  ['Accounts & Admin Manager', 'Oversee finance and administration functions.'],
]

function Hero({ ready }) {
  const el = useRef(null)
  const tl = useRef(null)
  useEffect(() => {
    if (reduced || window.innerWidth < 700) return
    const fx = NET({ el: el.current, THREE, mouseControls: true, touchControls: true, gyroControls: false,
      color: 0x6cc04a, backgroundColor: 0x14284b, points: 12, maxDistance: 22, spacing: 16, showDots: true })
    return () => fx.destroy()
  }, [])
  useGSAP(() => {
    tl.current = gsap.timeline({ paused: true })
      .from('.hero h1 .hl > span', { yPercent: 120, rotate: 4, duration: 1.2, ease: 'expo.out', stagger: 0.12 })
      .from('.hero .fade', { y: 30, autoAlpha: 0, duration: 1, ease: 'power3.out', stagger: 0.1 }, '-=0.8')
      .from('.hero .orb', { scale: 0, autoAlpha: 0, duration: 1.6, ease: 'elastic.out(1,0.6)', stagger: 0.15 }, '<')
    gsap.to('.hero-inner', { yPercent: 35, autoAlpha: 0, scale: 0.94, ease: 'none',
      scrollTrigger: { trigger: '.hero', start: 'top top', end: 'bottom top', scrub: true } })
    gsap.to('.orb.a', { y: -160, ease: 'none', scrollTrigger: { trigger: '.hero', start: 'top top', end: 'bottom top', scrub: true } })
    gsap.to('.orb.b', { y: -320, ease: 'none', scrollTrigger: { trigger: '.hero', start: 'top top', end: 'bottom top', scrub: true } })
  }, { scope: el })
  useEffect(() => { if (ready) tl.current?.play() }, [ready])
  return (
    <section className="hero" ref={el} id="home">
      <div className="orb a" /><div className="orb b" />
      <div className="hero-inner">
        <p className="eyebrow fade"><ShinyText>Finridge Commercial Brokers · Dubai</ShinyText></p>
        <h1>
          <span className="hl"><span>Build Your</span></span>
          <span className="hl"><span className="gold-t">Dream</span></span>
        </h1>
        <p className="lead fade">Unlock your financial potential</p>
        <div className="row fade">
          <Magnet><a href="#contact" className="btn gold"><span>Get a Quote</span></a></Magnet>
          <Magnet strength={0.2}><a href="#offer" className="btn ghost"><span>Explore offers</span></a></Magnet>
        </div>
      </div>
      <div className="scroll-hint fade">Scroll</div>
    </section>
  )
}

export default function App() {
  const [menu, setMenu] = useState(false)
  const [ready, setReady] = useState(reduced)
  const lenisRef = useRef(null)
  useEffect(() => { if (menu) lenisRef.current?.stop(); else if (ready) lenisRef.current?.start(); document.body.style.overflow = menu ? 'hidden' : '' }, [menu, ready])

  useEffect(() => {
    if (reduced) return
    const lenis = new Lenis({ anchors: { offset: -70 }, lerp: 0.085 })
    lenisRef.current = lenis
    lenis.stop()
    lenis.on('scroll', ScrollTrigger.update)
    const tick = (t) => lenis.raf(t * 1000)
    gsap.ticker.add(tick); gsap.ticker.lagSmoothing(0)
    return () => { gsap.ticker.remove(tick); lenis.destroy() }
  }, [])
  useEffect(() => { if (ready) { lenisRef.current?.start(); ScrollTrigger.refresh() } }, [ready])

  useGSAP(() => {
    gsap.utils.toArray('.reveal').forEach((n) =>
      gsap.from(n, { y: 60, autoAlpha: 0, duration: 1.1, ease: 'power3.out', scrollTrigger: { trigger: n, start: 'top 88%' } }))
    gsap.utils.toArray('.stagger').forEach((g) =>
      gsap.from(g.children, { y: 50, autoAlpha: 0, scale: 0.96, duration: 0.9, ease: 'power3.out', stagger: 0.1, scrollTrigger: { trigger: g, start: 'top 85%' } }))

    // dark sections grow from a rounded inset window
    gsap.utils.toArray('.clip').forEach((s) =>
      gsap.fromTo(s, { clipPath: 'inset(6% 5% 0% 5% round 48px)' }, { clipPath: 'inset(0% 0% 0% 0% round 0px)', ease: 'none',
        scrollTrigger: { trigger: s, start: 'top bottom', end: 'top 25%', scrub: true } }))

    // offer cards fly in with 3D rotation
    gsap.from('.offer .tilt-wrap', { y: 140, rotateX: 35, autoAlpha: 0, transformPerspective: 900, stagger: 0.15, duration: 1.3, ease: 'expo.out',
      scrollTrigger: { trigger: '.offer .cards', start: 'top 85%' } })

    // stat line draw
    gsap.from('.stats', { '--line': 0, duration: 1.4, ease: 'expo.out', scrollTrigger: { trigger: '.stats', start: 'top 90%' } })

    const mm = gsap.matchMedia()
    mm.add('(min-width: 900px) and (prefers-reduced-motion: no-preference)', () => {
      // pinned horizontal services, cards rotate in as they travel
      const track = document.querySelector('.h-track')
      const tween = gsap.to(track, { x: () => -(track.scrollWidth - window.innerWidth + 80), ease: 'none',
        scrollTrigger: { trigger: '.h-wrap', pin: true, scrub: 1, end: () => '+=' + track.scrollWidth, invalidateOnRefresh: true } })
      gsap.utils.toArray('.h-card').forEach((c) =>
        gsap.from(c, { rotate: 8, y: 80, scale: 0.85, opacity: 0.3, ease: 'none',
          scrollTrigger: { trigger: c, containerAnimation: tween, start: 'left 100%', end: 'left 55%', scrub: true } }))
      gsap.to('.h-progress i', { scaleX: 1, ease: 'none', scrollTrigger: { trigger: '.h-wrap', start: 'top top', end: () => '+=' + track.scrollWidth, scrub: true } })

      // stacking principle cards
      const cards = gsap.utils.toArray('.stack-card')
      cards.forEach((c, i) => {
        if (i === cards.length - 1) return
        gsap.to(c, { scale: 0.9 - (cards.length - i) * 0.015, filter: 'brightness(0.7)', ease: 'none',
          scrollTrigger: { trigger: cards[i + 1], start: 'top bottom', end: 'top 20%', scrub: true } })
      })

      // giant footer word
      gsap.from('.giant span', { yPercent: 100, stagger: 0.05, ease: 'none',
        scrollTrigger: { trigger: '.foot', start: 'top 90%', end: 'bottom bottom', scrub: true } })
    })

    ScrollTrigger.create({ start: 60, end: 'max', toggleClass: { targets: '.nav', className: 'scrolled' } })
  })

  const links = [['Home', '#home'], ['Services', '#services'], ['Careers', '#careers'], ['About', '#about'], ['Contact', '#contact']]
  return (
    <>
      {!reduced && !ready && <Preloader onDone={() => setReady(true)} />}
      <Cursor /><ClickSpark /><ScrollProgress />
      <header className="nav">
        <a href="#home" className="logo"><img src={`${import.meta.env.BASE_URL}finridge-logo.jpeg`} alt="FinRidge — Unlock your financial potential" /></a>
        <nav className={menu ? 'open' : ''}>
          {links.map(([l, h]) => <a key={h} href={h} className="roll" data-t={l} onClick={() => setMenu(false)}><span>{l}</span></a>)}
          <a className="btn gold sm" href="#contact" onClick={() => setMenu(false)}><span>Get a Quote</span></a>
        </nav>
        <button className={`burger ${menu ? 'x' : ''}`} aria-label="Menu" onClick={() => setMenu(!menu)}><span /><span /></button>
      </header>

      <Hero ready={ready} />

      <ScrollVelocity text="Credit Cards · Personal Finance · Islamic & Conventional Banking" />

      <section className="sec" id="about">
        <div className="wrap">
          <p className="eyebrow">About us</p>
          <ScrollReveal text="Finridge is a trusted UAE brokerage connecting individuals and businesses with the right banking solutions — an independent partner delivering retail finance for Islamic and conventional banks." />
          <div className="grid2 mv stagger">
            <SpotlightCard className="light"><h4>Mission</h4><p>To be a leading distributor and partner for conventional and Islamic banks — built on service, relationships and growth.</p></SpotlightCard>
            <SpotlightCard className="light"><h4>Vision</h4><p>To be the channel partner of choice for banks and financial institutions.</p></SpotlightCard>
          </div>
        </div>
        <div className="wrap stats stagger">
          <div><strong><CountUp to={3} /></strong><span>Partner banks</span></div>
          <div><strong><CountUp to={2} /></strong><span>Core products</span></div>
          <div><strong><CountUp to={5} /></strong><span>Open roles</span></div>
          <div><strong><CountUp to={100} suffix="%" /></strong><span>Compliance focus</span></div>
        </div>
      </section>

      <section className="sec dark clip offer" id="offer">
        <div className="wrap">
          <p className="eyebrow">What we offer</p>
          <SplitText text="Finance that fits your next move." />
          <div className="cards">
            <TiltedCard>
              <div className="card-icon">▭</div><span className="tag">01</span><h3>Credit Cards</h3>
              <p>A reliable, convenient way to pay — for individuals and businesses — from top UAE banks.</p>
              <a href="#contact" className="arrow">Apply <b>→</b></a>
            </TiltedCard>
            <TiltedCard>
              <div className="card-icon">◎</div><span className="tag">02</span><h3>Personal Finance</h3>
              <p>Flexible loans for travel, education, debt consolidation or the unexpected.</p>
              <a href="#contact" className="arrow">Apply <b>→</b></a>
            </TiltedCard>
          </div>
        </div>
      </section>

      <section className="h-wrap" id="services">
        <div className="h-head">
          <p className="eyebrow">Our services</p>
          <h2 className="h2">Deep banking experience across the UAE &amp; Indian markets.</h2>
        </div>
        <div className="h-track">
          {SERVICES.map(([n, t, d]) => (
            <SpotlightCard key={n} className="h-card"><span className="big">{n}</span><h3>{t}</h3><p>{d}</p></SpotlightCard>
          ))}
        </div>
        <div className="h-progress"><i /></div>
      </section>

      <section className="sec partners">
        <p className="eyebrow center">Our trusted partners</p>
        <LogoLoop items={['Dubai Islamic Bank', 'Emirates Islamic', 'Sharjah Islamic Bank']} />
      </section>

      <section className="sec principles-sec">
        <div className="wrap">
          <p className="eyebrow">Why Finridge</p>
          <SplitText text="Our founding principles." />
          <div className="pillars stagger">{PILLARS.map((p) => <div key={p} className="pill">{p}</div>)}</div>
          <div className="stack">
            {PRINCIPLES.map(([t, d], i) => (
              <div key={t} className="stack-card" style={{ top: `${110 + i * 22}px` }}>
                <span className="num">0{i + 1}</span>
                <div><h3>{t}</h3><p>{d}</p></div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="sec dark clip" id="careers">
        <div className="wrap">
          <p className="eyebrow">Careers · Dubai, UAE</p>
          <SplitText text="Looking for a job in Dubai?" />
          <p className="body reveal">Freshers and experienced professionals with relevant skills — join our team and unlock opportunities at Finridge. Work-life balance, diversity, competitive incentives and real impact.</p>
          <ul className="jobs stagger">
            {JOBS.map(([t, d]) => (
              <li key={t}><a href="#contact"><div><h4>{t}</h4><p>{d}</p></div><span>Dubai, UAE <b>→</b></span></a></li>
            ))}
          </ul>
        </div>
      </section>

      <ScrollVelocity text="Let’s talk finance · Get a quote today" dir={-1} />

      <section className="sec" id="contact">
        <div className="wrap grid2">
          <div>
            <p className="eyebrow">Contact us</p>
            <SplitText text="Let’s talk finance." />
            <div className="info stagger">
              <a href="tel:+97147034555">+971 4703 4555</a>
              <a href="mailto:info@finridge.net">info@finridge.net</a>
              <p>Office 310, Business Venue Building, Umm Hurair Road, Oud Metha, Dubai, UAE · P.O. Box 45592</p>
            </div>
          </div>
          <form className="form reveal" onSubmit={(e) => { e.preventDefault()
            const f = new FormData(e.target)
            location.href = `mailto:info@finridge.net?subject=${encodeURIComponent(f.get('product') + ' enquiry')}&body=${encodeURIComponent(`Name: ${f.get('first')} ${f.get('last')}\nMonthly income (AED): ${f.get('income')}\nPhone: ${f.get('phone')}\nEmail: ${f.get('email')}`)}` }}>
            <select name="product"><option>Credit Card</option><option>Personal Loan</option></select>
            <div className="row"><input name="first" placeholder="First name" required /><input name="last" placeholder="Last name" /></div>
            <input name="income" type="number" placeholder="Fixed monthly income (AED)" />
            <input name="phone" type="tel" placeholder="Phone number" required />
            <input name="email" type="email" placeholder="Email" />
            <Magnet><button className="btn gold"><span>Submit enquiry</span></button></Magnet>
          </form>
        </div>
      </section>

      <footer className="foot">
        <div className="wrap foot-grid">
          <div><a href="#home" className="logo"><img src={`${import.meta.env.BASE_URL}finridge-logo.jpeg`} alt="FinRidge — Unlock your financial potential" /></a><p>Finridge Commercial Brokers LLC — retail finance solutions for Islamic and conventional banks across the UAE.</p></div>
          <div className="flinks">{links.map(([l, h]) => <a key={h} href={h}>{l}</a>)}
            <a href="https://www.linkedin.com/company/finridge-commercial-brokers-llc/" target="_blank" rel="noreferrer">LinkedIn ↗</a></div>
        </div>
        <div className="giant" aria-hidden>{'FINRIDGE'.split('').map((c, i) => <span key={i}>{c}</span>)}</div>
        <p className="copy">© {new Date().getFullYear()} Finridge. All rights reserved.</p>
      </footer>
    </>
  )
}
