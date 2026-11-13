import { useRef } from 'react'
import gsap from 'gsap'
import { useGSAP } from '@gsap/react'
import { SplitText, SpotlightCard } from '../bits.jsx'
import { PageHeader, Accordion, ContactForm } from '../shared.jsx'
import { useReveal } from '../useReveal.js'
import { PHONE, EMAIL, ADDRESS, POBOX, LINKEDIN, FAQ } from '../data.js'

export default function Contact() {
  const ref = useRef(null)
  useReveal(ref)
  useGSAP(() => {
    gsap.from('.c-card', { y: 80, rotate: (i) => (i - 1) * 4, autoAlpha: 0, stagger: 0.12, duration: 1.1, ease: 'expo.out', scrollTrigger: { trigger: '.c-cards', start: 'top 85%' } })
    gsap.from('.map-wrap', { clipPath: 'circle(0% at 50% 50%)', duration: 1.6, ease: 'expo.inOut', scrollTrigger: { trigger: '.map-wrap', start: 'top 80%' } })
  }, { scope: ref })

  const cards = [
    ['☎', 'Call us', PHONE, `tel:${PHONE.replace(/\s/g, '')}`],
    ['✉', 'Email us', EMAIL, `mailto:${EMAIL}`],
    ['in', 'Follow us', 'LinkedIn', LINKEDIN],
  ]
  return (
    <div ref={ref}>
      <PageHeader eyebrow="Contact us" crumb="Contact" title="Let’s talk finance" sub="Connect with us for further details — our advisors are ready to help." />

      <section className="sec">
        <div className="wrap">
          <div className="c-cards">
            {cards.map(([i, t, v, h]) => (
              <a key={t} href={h} target={h.startsWith('http') ? '_blank' : undefined} rel="noreferrer" className="c-card">
                <SpotlightCard className="light"><span className="c-ic">{i}</span><small>{t}</small><strong>{v}</strong></SpotlightCard>
              </a>
            ))}
          </div>

          <div className="grid2 contact-grid">
            <div>
              <p className="eyebrow">UAE head office</p>
              <SplitText text="Visit our Dubai office." />
              <p className="body reveal">{ADDRESS}<br />{POBOX}</p>
              <div className="map-wrap reveal">
                <iframe title="FinRidge office map" loading="lazy" referrerPolicy="no-referrer-when-downgrade"
                  src={`https://www.google.com/maps?q=${encodeURIComponent('Business Venue Building, Umm Hurair Road, Oud Metha, Dubai')}&output=embed`} />
              </div>
            </div>
            <ContactForm />
          </div>
        </div>
      </section>

      <section className="sec principles-sec">
        <div className="wrap grid2">
          <div><p className="eyebrow">FAQ</p><SplitText text="Before you reach out." /></div>
          <Accordion items={FAQ} />
        </div>
      </section>
    </div>
  )
}
