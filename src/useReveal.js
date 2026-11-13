import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { useGSAP } from '@gsap/react'
gsap.registerPlugin(ScrollTrigger, useGSAP)

export const reduced = typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches

// Shared scroll animations for any page: .reveal, .stagger, .clip
export function useReveal(scope) {
  useGSAP(() => {
    gsap.utils.toArray('.reveal', scope.current).forEach((n) =>
      gsap.from(n, { y: 60, autoAlpha: 0, duration: 1.1, ease: 'power3.out', scrollTrigger: { trigger: n, start: 'top 88%' } }))
    gsap.utils.toArray('.stagger', scope.current).forEach((g) =>
      gsap.from(g.children, { y: 50, autoAlpha: 0, scale: 0.96, duration: 0.9, ease: 'power3.out', stagger: 0.1, scrollTrigger: { trigger: g, start: 'top 85%' } }))
    gsap.utils.toArray('.clip', scope.current).forEach((s) =>
      gsap.fromTo(s, { clipPath: 'inset(6% 5% 0% 5% round 48px)' }, { clipPath: 'inset(0% 0% 0% 0% round 0px)', ease: 'none',
        scrollTrigger: { trigger: s, start: 'top bottom', end: 'top 25%', scrub: true } }))
    requestAnimationFrame(() => ScrollTrigger.refresh())
  }, { scope })
}
