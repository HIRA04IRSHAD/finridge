import { useRef, useState } from 'react'
import { Link } from 'react-router-dom'
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
        <Magnet><Link to="/contact" className="btn white"><span>Get a Quote →</span></Link></Magnet>
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

export function ContactForm({ product = 'Credit Card' }) {
  const [sent, setSent] = useState(false)
  return (
    <form className="form reveal" onSubmit={(e) => {
      e.preventDefault()
      const f = new FormData(e.target)
      setSent(true)
      location.href = `mailto:${EMAIL}?subject=${encodeURIComponent(f.get('product') + ' enquiry')}&body=${encodeURIComponent(`Name: ${f.get('first')} ${f.get('last')}\nMonthly income (AED): ${f.get('income')}\nPhone: ${f.get('phone')}\nEmail: ${f.get('email')}\n\n${f.get('msg') || ''}`)}`
    }}>
      <h3>Send an enquiry</h3>
      <label>I’m interested in<select name="product" defaultValue={product}><option>Credit Card</option><option>Personal Loan</option><option>Careers</option><option>Other</option></select></label>
      <div className="row"><input name="first" placeholder="First name" required /><input name="last" placeholder="Last name" /></div>
      <input name="income" type="number" placeholder="Fixed monthly income (AED)" />
      <div className="row"><input name="phone" type="tel" placeholder="Phone number" required /><input name="email" type="email" placeholder="Email" /></div>
      <textarea name="msg" rows="3" placeholder="Message (optional)" />
      <Magnet><button className="btn gold"><span>{sent ? 'Opening your email app…' : 'Submit enquiry'}</span></button></Magnet>
      <small>Submitting opens your email app with the details filled in.</small>
    </form>
  )
}
