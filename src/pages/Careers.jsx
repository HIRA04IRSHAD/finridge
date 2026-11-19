import { useRef, useState } from 'react'
import { Link } from 'react-router-dom'
import gsap from 'gsap'
import { useGSAP } from '@gsap/react'
import { SplitText, SpotlightCard, CountUp, Magnet } from '../bits.jsx'
import { ScrollReveal, ScrollVelocity, TiltedCard } from '../fx.jsx'
import { PageHeader, CTA } from '../shared.jsx'
import { useReveal } from '../useReveal.js'
import { CULTURE, JOBS, HIRING, EMAIL } from '../data.js'

function Role({ job, open, onToggle }) {
  const body = useRef(null)
  useGSAP(() => {
    gsap.to(body.current, { height: open ? 'auto' : 0, duration: 0.6, ease: 'expo.inOut' })
  }, { dependencies: [open] })
  const apply = `/contact?product=careers&role=${encodeURIComponent(job.t)}#quote`
  return (
    <li className={`role ${open ? 'open' : ''}`}>
      <button className="role-head" onClick={onToggle} aria-expanded={open}>
        <div><h3>{job.t}</h3><p>{job.d}</p></div>
        <div className="role-meta"><span className="chip">Dubai, UAE</span><span className="chip">{job.type}</span><i>+</i></div>
      </button>
      <div className="role-body" ref={body} style={{ height: 0 }}>
        <div className="role-inner">
          <h4>What you’ll do</h4>
          <ul>{job.r.map((r) => <li key={r}>{r}</li>)}</ul>
          <Magnet><Link to={apply} className="btn gold"><span>Apply now →</span></Link></Magnet>
        </div>
      </div>
    </li>
  )
}

export default function Careers() {
  const ref = useRef(null)
  const [open, setOpen] = useState(0)
  useReveal(ref)
  useGSAP(() => {
    gsap.from('.culture .tilt-wrap', { y: 120, rotateX: 30, autoAlpha: 0, transformPerspective: 900, stagger: 0.12, duration: 1.2, ease: 'expo.out',
      scrollTrigger: { trigger: '.culture', start: 'top 80%' } })
    gsap.from('.hire-step', { y: 60, autoAlpha: 0, stagger: 0.15, duration: 0.9, ease: 'back.out(1.6)', scrollTrigger: { trigger: '.hire', start: 'top 80%' } })
    gsap.from('.hire-line i', { scaleX: 0, ease: 'none', scrollTrigger: { trigger: '.hire', start: 'top 75%', end: 'bottom 60%', scrub: true } })
  }, { scope: ref })

  return (
    <div ref={ref}>
      <PageHeader eyebrow="Careers · Dubai, UAE" crumb="Careers" title="Join Our Team"
        sub="Unlocking opportunities at FinRidge — for freshers and experienced professionals alike." />

      <section className="sec">
        <div className="wrap">
          <p className="eyebrow">Why work with us</p>
          <ScrollReveal text="We build lasting relationships between candidates and businesses — with bespoke growth paths, competitive incentives and a team that genuinely cares about your well-being." />
          <div className="stats stagger">
            <div><strong><CountUp to={JOBS.length} /></strong><span>Open roles</span></div>
            <div><strong><CountUp to={3} /></strong><span>Partner banks</span></div>
            <div><strong><CountUp to={2} /></strong><span>Product lines</span></div>
            <div><strong>DXB</strong><span>Based in Dubai</span></div>
          </div>
        </div>
      </section>

      <section className="sec dark clip">
        <div className="wrap">
          <p className="eyebrow">Our culture</p>
          <SplitText text="A place to grow, together." />
          <div className="culture">
            {CULTURE.map(([t, d], i) => (
              <TiltedCard key={t} className="small">
                <div className="card-icon">{['☼', '◍', '✦', '➚'][i]}</div>
                <h3>{t}</h3><p>{d}</p>
              </TiltedCard>
            ))}
          </div>
        </div>
      </section>

      <section className="sec" id="roles">
        <div className="wrap">
          <p className="eyebrow">Open positions</p>
          <SplitText text="Find your role." />
          <ul className="roles stagger">
            {JOBS.map((j, i) => <Role key={j.t} job={j} open={open === i} onToggle={() => setOpen(open === i ? -1 : i)} />)}
          </ul>
        </div>
      </section>

      <ScrollVelocity text="We’re hiring · Dubai, UAE · Join FinRidge" dir={-1} />

      <section className="sec principles-sec">
        <div className="wrap">
          <p className="eyebrow">Hiring process</p>
          <SplitText text="From application to day one." />
          <div className="hire">
            <div className="hire-line"><i /></div>
            {HIRING.map(([t, d], i) => (
              <div key={t} className="hire-step"><span>{i + 1}</span><h4>{t}</h4><p>{d}</p></div>
            ))}
          </div>
        </div>
      </section>

      <CTA title="Don’t see the right role?" text={`Send your CV to ${EMAIL} — we’re always meeting talented people.`} />
    </div>
  )
}
