// Extra effects modelled on React Bits: Preloader, Cursor, RotatingText, ScrollReveal, ScrollVelocity, TiltedCard, ScrollProgress, ClickSpark
import { useEffect, useRef, useState } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { useGSAP } from '@gsap/react'
gsap.registerPlugin(ScrollTrigger, useGSAP)

export function Preloader({ onDone }) {
  const ref = useRef(null)
  const [n, setN] = useState(0)
  useGSAP(() => {
    const o = { v: 0 }
    const tl = gsap.timeline({ onComplete: onDone })
    tl.to(o, { v: 100, duration: 1.6, ease: 'power2.inOut', onUpdate: () => setN(Math.round(o.v)) })
      .to('.pl-word span', { yPercent: -130, autoAlpha: 0, duration: 0.6, ease: 'power3.in' }, '-=0.2')
      .to('.pl-panel', { yPercent: -100, stagger: 0.08, duration: 0.9, ease: 'expo.inOut' }, '-=0.2')
  }, { scope: ref })
  return (
    <div className="preloader" ref={ref}>
      {[0, 1, 2, 3, 4].map((i) => <div key={i} className="pl-panel" />)}
      <div className="pl-word"><span><img src={`${import.meta.env.BASE_URL}finridge-logo.jpeg`} alt="FinRidge — Unlock your financial potential" /></span></div>
      <div className="pl-count">{n}%</div>
    </div>
  )
}

export function Cursor() {
  const dot = useRef(null), ring = useRef(null)
  useEffect(() => {
    if (matchMedia('(pointer: coarse)').matches) return
    const dx = gsap.quickTo(dot.current, 'x', { duration: 0.1 }), dy = gsap.quickTo(dot.current, 'y', { duration: 0.1 })
    const rx = gsap.quickTo(ring.current, 'x', { duration: 0.5, ease: 'power3' }), ry = gsap.quickTo(ring.current, 'y', { duration: 0.5, ease: 'power3' })
    const mv = (e) => { dx(e.clientX); dy(e.clientY); rx(e.clientX); ry(e.clientY)
      const hot = e.target.closest('a,button,.tilt,input,select')
      ring.current.classList.toggle('hot', !!hot) }
    addEventListener('mousemove', mv)
    return () => removeEventListener('mousemove', mv)
  }, [])
  return <><div ref={ring} className="c-ring" /><div ref={dot} className="c-dot" /></>
}

export function RotatingText({ words, interval = 2200 }) {
  const [i, setI] = useState(0)
  const ref = useRef(null)
  useEffect(() => { const t = setInterval(() => setI((x) => (x + 1) % words.length), interval); return () => clearInterval(t) }, [words, interval])
  useGSAP(() => {
    gsap.fromTo(ref.current.querySelectorAll('.rc'), { yPercent: 120, rotateX: -80, opacity: 0 },
      { yPercent: 0, rotateX: 0, opacity: 1, stagger: 0.035, duration: 0.7, ease: 'back.out(1.6)' })
  }, { dependencies: [i], scope: ref })
  return (
    <span className="rot" ref={ref} key={i}>
      {[...words[i]].map((c, j) => <span className="rc" key={j}>{c === ' ' ? ' ' : c}</span>)}
    </span>
  )
}

export function ScrollReveal({ text }) {
  const ref = useRef(null)
  useGSAP(() => {
    gsap.fromTo(ref.current.querySelectorAll('.sw'), { opacity: 0.12, filter: 'blur(6px)', y: 8 },
      { opacity: 1, filter: 'blur(0px)', y: 0, stagger: 0.05, ease: 'none',
        scrollTrigger: { trigger: ref.current, start: 'top 80%', end: 'bottom 45%', scrub: true } })
  }, { scope: ref })
  return <p className="sreveal" ref={ref}>{text.split(' ').map((w, i) => <span className="sw" key={i}>{w} </span>)}</p>
}

export function ScrollVelocity({ text, dir = 1 }) {
  const ref = useRef(null)
  useEffect(() => {
    const track = ref.current
    let x = 0, boost = 0, skew = gsap.quickTo(track, 'skewX', { duration: 0.4 })
    const st = ScrollTrigger.create({ onUpdate: (s) => { boost = gsap.utils.clamp(-25, 25, s.getVelocity() / 120); skew(-boost * 0.4 * dir) } })
    const tick = () => {
      x -= (1 + Math.abs(boost)) * dir * 0.6
      boost *= 0.92
      const w = track.scrollWidth / 2
      if (x <= -w) x += w; if (x > 0) x -= w
      gsap.set(track, { x })
    }
    gsap.ticker.add(tick)
    return () => { gsap.ticker.remove(tick); st.kill() }
  }, [dir])
  const row = Array(8).fill(text)
  return <div className="vel"><div className="vel-track" ref={ref}>{[...row, ...row].map((t, i) => <span key={i}>{t}<i>✦</i></span>)}</div></div>
}

export function TiltedCard({ children, className = '' }) {
  const ref = useRef(null)
  const mv = (e) => {
    const r = ref.current.getBoundingClientRect()
    const px = (e.clientX - r.left) / r.width - 0.5, py = (e.clientY - r.top) / r.height - 0.5
    gsap.to(ref.current, { rotateY: px * 14, rotateX: -py * 14, duration: 0.5, ease: 'power3.out' })
    ref.current.style.setProperty('--mx', `${(px + 0.5) * 100}%`); ref.current.style.setProperty('--my', `${(py + 0.5) * 100}%`)
  }
  const lv = () => gsap.to(ref.current, { rotateY: 0, rotateX: 0, duration: 0.8, ease: 'elastic.out(1,0.5)' })
  return <div className="tilt-wrap"><div ref={ref} onMouseMove={mv} onMouseLeave={lv} className={`tilt ${className}`}>{children}</div></div>
}

export function ScrollProgress() {
  const ref = useRef(null)
  useGSAP(() => { gsap.to(ref.current, { scaleX: 1, ease: 'none', scrollTrigger: { start: 0, end: 'max', scrub: 0.3 } }) })
  return <div className="progress" ref={ref} />
}

export function ClickSpark() {
  useEffect(() => {
    const click = (e) => {
      for (let i = 0; i < 8; i++) {
        const s = document.createElement('i'); s.className = 'spark'; document.body.appendChild(s)
        const a = (i / 8) * Math.PI * 2
        gsap.fromTo(s, { x: e.clientX, y: e.clientY, rotate: (a * 180) / Math.PI, scaleX: 1 },
          { x: e.clientX + Math.cos(a) * 36, y: e.clientY + Math.sin(a) * 36, scaleX: 0, duration: 0.5, ease: 'power3.out', onComplete: () => s.remove() })
      }
    }
    addEventListener('click', click)
    return () => removeEventListener('click', click)
  }, [])
  return null
}
