import { useEffect, useRef } from 'react'
import { Link } from 'react-router-dom'
import gsap from 'gsap'
import { useGSAP } from '@gsap/react'
import * as THREE from 'three'
import NET from 'vanta/dist/vanta.net.min'
import { SplitText, ShinyText, SpotlightCard, CountUp, Magnet, LogoLoop } from '../bits.jsx'
import { ScrollReveal, ScrollVelocity, TiltedCard } from '../fx.jsx'
import { CTA } from '../shared.jsx'
import { useReveal } from '../useReveal.js'
import { reduced } from '../useReveal.js'
import { SERVICES, PILLARS, PRINCIPLES, PARTNERS, JOBS, PRODUCTS } from '../data.js'

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
      scrollTrigger: { trigger: el.current, start: 'top top', end: 'bottom top', scrub: true } })
    gsap.to('.orb.a', { y: -160, ease: 'none', scrollTrigger: { trigger: el.current, start: 'top top', end: 'bottom top', scrub: true } })
    gsap.to('.orb.b', { y: -320, ease: 'none', scrollTrigger: { trigger: el.current, start: 'top top', end: 'bottom top', scrub: true } })
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
          <Magnet><Link to="/contact" className="btn gold"><span>Get a Quote</span></Link></Magnet>
          <Magnet strength={0.2}><Link to="/services" className="btn ghost"><span>Explore services</span></Link></Magnet>
        </div>
      </div>
      <div className="scroll-hint fade">Scroll</div>
    </section>
  )
}

export default function Home({ ready }) {
  const ref = useRef(null)
  useReveal(ref)
  useGSAP(() => {
    gsap.from('.offer .tilt-wrap', { y: 140, rotateX: 35, autoAlpha: 0, transformPerspective: 900, stagger: 0.15, duration: 1.3, ease: 'expo.out',
      scrollTrigger: { trigger: '.offer .cards', start: 'top 85%' } })
    gsap.from('.stats', { '--line': 0, duration: 1.4, ease: 'expo.out', scrollTrigger: { trigger: '.stats', start: 'top 90%' } })
    const mm = gsap.matchMedia()
    mm.add('(min-width: 900px) and (prefers-reduced-motion: no-preference)', () => {
      const track = ref.current.querySelector('.h-track')
      const tween = gsap.to(track, { x: () => -(track.scrollWidth - window.innerWidth + 80), ease: 'none',
        scrollTrigger: { trigger: '.h-wrap', pin: true, scrub: 1, end: () => '+=' + track.scrollWidth, invalidateOnRefresh: true } })
      gsap.utils.toArray('.h-card').forEach((c) =>
        gsap.from(c, { rotate: 8, y: 80, scale: 0.85, opacity: 0.3, ease: 'none',
          scrollTrigger: { trigger: c, containerAnimation: tween, start: 'left 100%', end: 'left 55%', scrub: true } }))
      gsap.to('.h-progress i', { scaleX: 1, ease: 'none', scrollTrigger: { trigger: '.h-wrap', start: 'top top', end: () => '+=' + track.scrollWidth, scrub: true } })
      const cards = gsap.utils.toArray('.stack-card')
      cards.forEach((c, i) => {
        if (i === cards.length - 1) return
        gsap.to(c, { scale: 0.9 - (cards.length - i) * 0.015, filter: 'brightness(0.7)', ease: 'none',
          scrollTrigger: { trigger: cards[i + 1], start: 'top bottom', end: 'top 20%', scrub: true } })
      })
    })
  }, { scope: ref })

  return (
    <div ref={ref}>
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
            {PRODUCTS.map((p, i) => (
              <TiltedCard key={p.id}>
                <div className="card-icon">{p.icon}</div><span className="tag">0{i + 1}</span><h3>{p.title}</h3>
                <p>{p.lead}</p>
                <Link to={`/services#${p.id}`} className="arrow">Learn more <b>→</b></Link>
              </TiltedCard>
            ))}
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
        <LogoLoop items={PARTNERS} />
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
          <p className="body reveal">Freshers and experienced professionals with relevant skills — join our team and unlock opportunities at Finridge.</p>
          <ul className="jobs stagger">
            {JOBS.slice(0, 3).map((j) => (
              <li key={j.t}><Link to="/careers#roles"><div><h4>{j.t}</h4><p>{j.d}</p></div><span>Dubai, UAE <b>→</b></span></Link></li>
            ))}
          </ul>
          <div className="reveal" style={{ marginTop: 40 }}><Magnet><Link to="/careers" className="btn gold"><span>View all {JOBS.length} roles</span></Link></Magnet></div>
        </div>
      </section>

      <ScrollVelocity text="Let’s talk finance · Get a quote today" dir={-1} />
      <CTA />
    </div>
  )
}
