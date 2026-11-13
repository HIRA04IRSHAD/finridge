import { useRef } from 'react'
import { Link } from 'react-router-dom'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { useGSAP } from '@gsap/react'
import { SplitText, SpotlightCard, Magnet, LogoLoop } from '../bits.jsx'
import { ScrollReveal, ScrollVelocity, TiltedCard } from '../fx.jsx'
import { PageHeader, CTA, Accordion } from '../shared.jsx'
import { useReveal } from '../useReveal.js'
import { PRODUCTS, STEPS, SERVICES, PARTNERS, FAQ } from '../data.js'

export default function Services() {
  const ref = useRef(null)
  useReveal(ref)
  useGSAP(() => {
    // product blocks: visual slides in from alternating sides, checklist ticks in
    gsap.utils.toArray('.product').forEach((p, i) => {
      gsap.from(p.querySelector('.p-visual'), { x: i % 2 ? 120 : -120, rotate: i % 2 ? 6 : -6, autoAlpha: 0, duration: 1.3, ease: 'expo.out', scrollTrigger: { trigger: p, start: 'top 75%' } })
      gsap.from(p.querySelectorAll('.checks li'), { x: 30, autoAlpha: 0, stagger: 0.08, duration: 0.7, ease: 'power3.out', scrollTrigger: { trigger: p.querySelector('.checks'), start: 'top 85%' } })
      gsap.to(p.querySelector('.p-card'), { yPercent: -18, ease: 'none', scrollTrigger: { trigger: p, start: 'top bottom', end: 'bottom top', scrub: true } })
    })
    // process timeline: line draws with scroll, steps light up
    gsap.from('.tl-line i', { scaleY: 0, ease: 'none', scrollTrigger: { trigger: '.timeline', start: 'top 70%', end: 'bottom 60%', scrub: true } })
    gsap.utils.toArray('.tl-step').forEach((s) => {
      ScrollTrigger.create({ trigger: s, start: 'top 65%', toggleClass: 'on' })
      gsap.from(s.querySelector('div'), { x: 40, autoAlpha: 0, duration: 0.8, ease: 'power3.out', scrollTrigger: { trigger: s, start: 'top 75%' } })
      gsap.from(s.querySelector('.tl-dot'), { scale: 0.4, duration: 0.8, ease: 'elastic.out(1,0.5)', scrollTrigger: { trigger: s, start: 'top 65%' } })
    })
  }, { scope: ref })

  return (
    <div ref={ref}>
      <PageHeader eyebrow="Our services" crumb="Services" title="We Offer"
        sub="Simple access to financial solutions through partnerships with leading UAE banks — transparent, efficient and tailored to you." />

      <section className="sec">
        <div className="wrap">
          <ScrollReveal text="From personal finance to everyday spending, we connect you with the right product from the right bank — and stay with you until it’s done." />
        </div>
        {PRODUCTS.map((p, i) => (
          <div key={p.id} id={p.id} className={`product wrap ${i % 2 ? 'flip' : ''}`}>
            <div className="p-visual">
              <div className="p-card">
                <span className="p-chip" />
                <span className="p-icon">{p.icon}</span>
                <strong>{p.title}</strong>
                <em>FinRidge × Partner Banks</em>
              </div>
            </div>
            <div className="p-copy">
              <span className="tag">0{i + 1}</span>
              <SplitText text={p.title} />
              <p className="body reveal">{p.lead}</p>
              <ul className="checks">{p.points.map((pt) => <li key={pt}><b>✓</b>{pt}</li>)}</ul>
              <div className="reveal"><Magnet><Link to="/contact" className="btn gold"><span>Apply for {p.title.toLowerCase()}</span></Link></Magnet></div>
            </div>
          </div>
        ))}
      </section>

      <ScrollVelocity text="Islamic & Conventional · Credit Cards · Personal Finance" />

      <section className="sec dark clip">
        <div className="wrap">
          <p className="eyebrow">How it works</p>
          <SplitText text="Four simple steps to approval." />
          <div className="timeline">
            <div className="tl-line"><i /></div>
            {STEPS.map(([t, d], i) => (
              <div key={t} className="tl-step">
                <span className="tl-dot">{i + 1}</span>
                <div><h3>{t}</h3><p>{d}</p></div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="sec">
        <div className="wrap">
          <p className="eyebrow">What sets us apart</p>
          <SplitText text="Service built on banking experience." />
          <div className="grid4 stagger">
            {SERVICES.map(([n, t, d]) => (
              <SpotlightCard key={n} className="light svc"><span className="big-n">{n}</span><h4>{t}</h4><p>{d}</p></SpotlightCard>
            ))}
          </div>
        </div>
      </section>

      <section className="sec partners">
        <p className="eyebrow center">Partnered with top UAE banks</p>
        <LogoLoop items={PARTNERS} />
      </section>

      <section className="sec principles-sec">
        <div className="wrap grid2">
          <div><p className="eyebrow">FAQ</p><SplitText text="Questions, answered." /><p className="body reveal">Can’t find what you’re looking for? <Link to="/contact" className="ulink">Contact our team</Link>.</p></div>
          <Accordion items={FAQ} />
        </div>
      </section>

      <CTA />
    </div>
  )
}
