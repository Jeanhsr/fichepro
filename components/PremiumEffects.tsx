import { useEffect } from 'react'
import { useRouter } from 'next/router'

export default function PremiumEffects() {
  const router = useRouter()

  useEffect(() => {
    // SCROLL REVEAL
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(e => {
        if (e.isIntersecting) {
          e.target.classList.add('visible')
          observer.unobserve(e.target)
        }
      })
    }, { threshold: 0.1, rootMargin: '0px 0px -40px 0px' })

    document.querySelectorAll('.reveal').forEach(el => observer.observe(el))

    // ANIMATED COUNTERS
    const animateCounter = (el: Element) => {
      const target = parseFloat(el.getAttribute('data-target') || '0')
      const suffix = el.getAttribute('data-suffix') || ''
      const duration = 1800
      const start = performance.now()

      const update = (now: number) => {
        const progress = Math.min((now - start) / duration, 1)
        const eased = 1 - Math.pow(1 - progress, 4)
        const current = target * eased
        el.textContent = (Number.isInteger(target) ? Math.round(current) : current.toFixed(1)) + suffix
        if (progress < 1) requestAnimationFrame(update)
      }
      requestAnimationFrame(update)
    }

    const counterObserver = new IntersectionObserver((entries) => {
      entries.forEach(e => {
        if (e.isIntersecting) {
          animateCounter(e.target)
          counterObserver.unobserve(e.target)
        }
      })
    }, { threshold: 0.5 })

    document.querySelectorAll('[data-counter]').forEach(el => counterObserver.observe(el))

    return () => {
      observer.disconnect()
      counterObserver.disconnect()
    }
  }, [router.pathname])

  return null
}
