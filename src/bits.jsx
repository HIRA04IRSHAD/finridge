// Lightweight components modelled on React Bits (SplitText, ShinyText, SpotlightCard, CountUp, Magnet, LogoLoop)
import { useRef, useState, useEffect } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { useGSAP } from '@gsap/react'
gsap.registerPlugin(ScrollTrigger, useGSAP)

export function SplitText({ text, as: Tag = 'h2', className = '', delay = 0, scroll = true }) {
  const ref = useRef(null)
  useGSAP(() => {
    gsap.from(ref.current.querySelectorAll('.ch'), {
      yPercent: 110, opacity: 0, rotate: 6, duration: 0.9, ease: 'expo.out',
      stagger: 0.025, delay,
      scrollTrigger: scroll ? { trigger: ref.current, start: 'top 85%' } : undefined,
    })
  }, { scope: ref })
  return (
    <Tag ref={ref} className={`split ${className}`} aria-label={text}>
      {text.split(' ').map((w, i) => (
        <span className="w" aria-hidden key={i}>
          {[...w].map((c, j) => <span className="ch" key={j}>{c}</span>)}
          {' '}
        </span>
      ))}
    </Tag>
  )
}

export function ShinyText({ children, className = '' }) {
  return <span className={`shiny ${className}`}>{children}</span>
}

export function SpotlightCard({ children, className = '' }) {
  const ref = useRef(null)
  const move = (e) => {
    const r = ref.current.getBoundingClientRect()
    ref.current.style.setProperty('--mx', `${e.clientX - r.left}px`)
    ref.current.style.setProperty('--my', `${e.clientY - r.top}px`)
  }
  return <div ref={ref} onMouseMove={move} className={`spot ${className}`}>{children}</div>
}

export function CountUp({ to, suffix = '' }) {
  const ref = useRef(null)
  const [v, setV] = useState(0)
  useGSAP(() => {
    const o = { n: 0 }
    gsap.to(o, { n: to, duration: 2, ease: 'power3.out', onUpdate: () => setV(Math.round(o.n)),
      scrollTrigger: { trigger: ref.current, start: 'top 90%' } })
  })
  return <span ref={ref}>{v}{suffix}</span>
}

export function Magnet({ children, strength = 0.35 }) {
  const ref = useRef(null)
  useEffect(() => {
    const el = ref.current
    const xTo = gsap.quickTo(el, 'x', { duration: 0.5, ease: 'power3' })
    const yTo = gsap.quickTo(el, 'y', { duration: 0.5, ease: 'power3' })
    const mv = (e) => { const r = el.getBoundingClientRect()
      xTo((e.clientX - r.left - r.width / 2) * strength); yTo((e.clientY - r.top - r.height / 2) * strength) }
    const lv = () => { xTo(0); yTo(0) }
    el.addEventListener('mousemove', mv); el.addEventListener('mouseleave', lv)
    return () => { el.removeEventListener('mousemove', mv); el.removeEventListener('mouseleave', lv) }
  }, [strength])
  return <span ref={ref} style={{ display: 'inline-block' }}>{children}</span>
}

export function LogoLoop({ items }) {
  const row = [...items, ...items, ...items, ...items]
  return (
    <div className="loop"><div className="loop-track">
      {row.map((t, i) => <span key={i} className="loop-item">{t}<i>✦</i></span>)}
    </div></div>
  )
}
