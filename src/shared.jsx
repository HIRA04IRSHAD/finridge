import { useRef, useState, useEffect } from 'react'
import { Link, useLocation } from 'react-router-dom'
import gsap from 'gsap'
import { useGSAP } from '@gsap/react'
import { SplitText, ShinyText, Magnet } from './bits.jsx'
import { EMAIL } from './data.js'

// Inner-page hero: breadcrumb, animated title, floating orbs + grid
export function PageHeader({ eyebrow, title, sub, crumb }) {
  const ref = useRef(null)
  useGSAP(() => {
    gsap.from('.ph-fade', { y: 30, autoAlpha: 0, duration: 1, ease: 'power3.out', stagger: 0.1, delay: 0.3 })
    gsap.from('.orb', { scale: 0, autoAlpha: 0, duration: 1.6, ease: 'elastic.out(1,0.6)', stagger: 0.15 })
    gsap.to('.ph-inner', { yPercent: 30, autoAlpha: 0, ease: 'none', scrollTrigger: { trigger: ref.current, start: 'top top', end: 'bottom top', scrub: true } })
    gsap.to('.ph-grid', { backgroundPosition: '0px 120px', ease: 'none', scrollTrigger: { trigger: ref.current, start: 'top top', end: 'bottom top', scrub: true } })
  }, { scope: ref })
  return (
    <section className="page-head" ref={ref}>
      <div className="ph-grid" /><div className="orb a" /><div className="orb b" />
      <div className="ph-inner wrap">
        <p className="crumb ph-fade"><Link to="/">Home</Link> <span>/</span> {crumb}</p>
        <p className="eyebrow ph-fade"><ShinyText>{eyebrow}</ShinyText></p>
        <SplitText as="h1" text={title} scroll={false} delay={0.15} />
        {sub && <p className="lead ph-fade">{sub}</p>}
      </div>
    </section>
  )
}

export function CTA({ title = 'Ready to unlock your financial potential?', text = 'Talk to our advisors about credit cards and personal finance from leading UAE banks.' }) {
  return (
    <section className="cta-band clip">
      <div className="wrap cta-inner">
        <div><SplitText text={title} /><p className="reveal">{text}</p></div>
        <Magnet><Link to="/contact#quote" className="btn white"><span>Get a Quote →</span></Link></Magnet>
      </div>
    </section>
  )
}

export function Accordion({ items }) {
  const [open, setOpen] = useState(0)
  return (
    <div className="acc stagger">
      {items.map(([q, a], i) => (
        <div key={q} className={`acc-item ${open === i ? 'open' : ''}`}>
          <button onClick={() => setOpen(open === i ? -1 : i)} aria-expanded={open === i}>
            <span>{q}</span><i>+</i>
          </button>
          <div className="acc-body"><div><p>{a}</p></div></div>
        </div>
      ))}
    </div>
  )
}

const PRODUCT_FROM_QUERY = { 'credit-card': 'Credit Card', 'credit-cards': 'Credit Card', 'personal-finance': 'Personal Finance', 'islamic': 'Islamic Finance', 'islamic-finance': 'Islamic Finance', 'careers': 'Careers' }
const ROLES = ['Credit Card Sales', 'Personal Finance Sales', 'Team Leader – Credit Card Sales', 'Team Leader – Personal Finance', 'Accounts & Admin Manager']

// Quote / application form. Reads ?product= and ?role= so buttons across the site can pre-fill it.
export function ContactForm() {
  const { search } = useLocation()
  const q = new URLSearchParams(search)
  const [product, setProduct] = useState(PRODUCT_FROM_QUERY[(q.get('product') || '').toLowerCase()] || 'Credit Card')
  const [role, setRole] = useState(ROLES.includes(q.get('role')) ? q.get('role') : ROLES[0])
  const [sent, setSent] = useState(false)
  useEffect(() => {
    const p = PRODUCT_FROM_QUERY[(q.get('product') || '').toLowerCase()]
    if (p) setProduct(p)
    if (ROLES.includes(q.get('role'))) setRole(q.get('role'))
    setSent(false)
  }, [search])
  const job = product === 'Careers'
  return (
    <form id="quote" className="form reveal" onSubmit={(e) => {
      e.preventDefault()
      const f = new FormData(e.target)
      const name = `${f.get('first')} ${f.get('last')}`.trim()
      const lines = [`Request type: ${product}`, `Name: ${name}`, `Mobile: ${f.get('phone')}`, `Email: ${f.get('email')}`]
      if (job) lines.push(`Role: ${role}`)
      else lines.push(`Fixed monthly income (AED): ${f.get('income') || '—'}`)
      if (f.get('msg')) lines.push('', 'Message:', f.get('msg'))
      lines.push('', 'Sent from the FinRidge website quote form.')
      const subject = job ? `Job application: ${role} — ${name}` : `Quote request: ${product} — ${name}`
      setSent(true)
      location.href = `mailto:${EMAIL}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(lines.join('\n'))}`
    }}>
      <h3>{job ? 'Apply for a role' : 'Get a quote'}</h3>
      <label>I’m interested in
        <select name="product" value={product} onChange={(e) => setProduct(e.target.value)}>
          <option>Credit Card</option><option>Personal Finance</option><option>Islamic Finance</option><option>Careers</option>
        </select>
      </label>
      {job && (
        <label>Role
          <select name="role" value={role} onChange={(e) => setRole(e.target.value)}>{ROLES.map((r) => <option key={r}>{r}</option>)}</select>
        </label>
      )}
      <div className="row"><input name="first" placeholder="First name" autoComplete="given-name" required /><input name="last" placeholder="Last name" autoComplete="family-name" required /></div>
      {!job && <input name="income" type="number" inputMode="numeric" min="0" placeholder="Fixed monthly income (AED)" />}
      <div className="row"><input name="phone" type="tel" inputMode="tel" placeholder="Mobile (+971 …)" autoComplete="tel" required /><input name="email" type="email" placeholder="Email" autoComplete="email" required /></div>
      <textarea name="msg" rows="3" placeholder="Message (optional)" />
      <label className="consent-row"><input type="checkbox" required /> I agree that FinRidge may contact me about this request.</label>
      <Magnet><button className="btn gold"><span>{sent ? 'Opening your email app…' : job ? 'Send my application' : 'Request my quote'}</span></button></Magnet>
      <small>{sent ? 'Your email app should now be open with your details — press Send to finish.' : 'Submitting opens your email app with your details filled in, addressed to info@finridge.net.'}</small>
    </form>
  )
}

const PARTNER_LOGOS = [
  ['Dubai Islamic Bank', 'partner-dib.webp', 560],
  ['Emirates Islamic', 'partner-ei.webp', 553],
  ['Sharjah Islamic Bank', 'partner-sib.webp', 525],
]
// Trusted partners: real bank logos with their names
export function PartnerLogos() {
  return (
    <div className="tp-grid stagger">
      {PARTNER_LOGOS.map(([name, file, w]) => (
        <figure className="tp-card" key={name}>
          <div className="tp-logo"><img src={`${import.meta.env.BASE_URL}partners/${file}`} alt={`${name} logo`} loading="lazy" width={w} height="160" /></div>
          <figcaption>{name}</figcaption>
        </figure>
      ))}
    </div>
  )
}
