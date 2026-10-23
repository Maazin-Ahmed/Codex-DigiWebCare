import { useLayoutEffect, useRef } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { brand, featuredServices } from '../content.js'

gsap.registerPlugin(ScrollTrigger)

const clamp = (value, minimum, maximum) => Math.min(maximum, Math.max(minimum, value))

export function ServiceArtwork({ type }) {
  if (type === 'finance') {
    return (
      <div className="service-art service-art--finance" aria-hidden="true">
        <div className="service-art__finance-board">
          <div className="service-art__finance-head"><span /><span /><span /></div>
          <div className="service-art__finance-chart"><i /><i /><i /><i /><i /><i /></div>
          <div className="service-art__finance-rows"><span /><span /><span /></div>
        </div>
        <span className="service-art__finance-orbit" />
      </div>
    )
  }

  if (type === 'cloud') {
    return (
      <div className="service-art service-art--cloud" aria-hidden="true">
        <span className="service-art__cloud-ring" />
        <span className="service-art__cloud-link service-art__cloud-link--one" />
        <span className="service-art__cloud-link service-art__cloud-link--two" />
        <span className="service-art__cloud-link service-art__cloud-link--three" />
        <span className="service-art__cloud-node service-art__cloud-node--core" />
        <span className="service-art__cloud-node service-art__cloud-node--one" />
        <span className="service-art__cloud-node service-art__cloud-node--two" />
        <span className="service-art__cloud-node service-art__cloud-node--three" />
        <span className="service-art__cloud-node service-art__cloud-node--four" />
      </div>
    )
  }

  if (type === 'learning') {
    return (
      <div className="service-art service-art--learning" aria-hidden="true">
        <div className="service-art__learning-panel">
          <span className="service-art__learning-top" />
          <div className="service-art__learning-content"><i /><span /><span /><span /><b /></div>
          <div className="service-art__learning-side"><span /><span /><span /><span /></div>
        </div>
      </div>
    )
  }

  if (type === 'editorial' || type === 'publishing') {
    return (
      <div className={`service-art service-art--${type}`} aria-hidden="true">
        <div className="service-art__page service-art__page--back"><span /><span /><span /></div>
        <div className="service-art__page service-art__page--front"><b /><i /><i /><i /><i /><span /></div>
        {type === 'publishing' && <span className="service-art__book-spine" />}
      </div>
    )
  }

  if (type === 'retail' || type === 'ecommerce') {
    return (
      <div className={`service-art service-art--${type}`} aria-hidden="true">
        <div className="service-art__store-window">
          <span className="service-art__store-top" />
          <div className="service-art__store-items"><i /><i /><i /><i /></div>
          <span className="service-art__store-action" />
        </div>
        {type === 'ecommerce' && <span className="service-art__shopping-bag"><i /></span>}
      </div>
    )
  }

  if (type === 'registry' || type === 'legal') {
    return (
      <div className={`service-art service-art--${type}`} aria-hidden="true">
        <div className="service-art__document"><span /><span /><span /><span /></div>
        <div className="service-art__shield"><i /></div>
        <span className="service-art__seal" />
      </div>
    )
  }

  if (type === 'animation') {
    return (
      <div className="service-art service-art--animation" aria-hidden="true">
        <span className="service-art__animation-frame service-art__animation-frame--back"><i /></span>
        <span className="service-art__animation-frame service-art__animation-frame--middle"><i /></span>
        <span className="service-art__animation-frame service-art__animation-frame--front"><i /></span>
        <span className="service-art__animation-orbit" />
      </div>
    )
  }

  if (type === 'contact') {
    return (
      <div className="service-art service-art--contact" aria-hidden="true">
        <span className="service-art__contact-route service-art__contact-route--one" />
        <span className="service-art__contact-route service-art__contact-route--two" />
        <div className="service-art__contact-note"><span /><span /><span /></div>
        <span className="service-art__contact-node service-art__contact-node--one" />
        <span className="service-art__contact-node service-art__contact-node--two" />
        <span className="service-art__contact-node service-art__contact-node--three" />
      </div>
    )
  }

  if (type === 'marketing') {
    return (
      <div className="service-art service-art--marketing" aria-hidden="true">
        <div className="service-art__wash" />
        <div className="service-art__orbit service-art__orbit--one" />
        <div className="service-art__orbit service-art__orbit--two" />
        <div className="service-art__campaign-bars"><span /><span /><span /><span /></div>
      </div>
    )
  }

  if (type === 'web') {
    return (
      <div className="service-art service-art--web" aria-hidden="true">
        <div className="service-art__browser">
          <span className="service-art__browser-bar" />
          <span className="service-art__browser-bar service-art__browser-bar--short" />
          <div className="service-art__browser-grid">
            <span />
            <span />
            <span />
            <span />
            <span />
            <span />
          </div>
        </div>
        <span className="service-art__cursor" />
      </div>
    )
  }

  if (type === 'software') {
    return (
      <div className="service-art service-art--software" aria-hidden="true">
        <div className="service-art__console">
          <div className="service-art__console-top"><span /> <span /> <span /></div>
          <p><i>$</i> digicare / build --future</p>
          <p className="is-muted">mapping the moving parts</p>
          <p><i className="is-violet">+</i> <b>system.ready</b></p>
          <span className="service-art__console-caret" />
        </div>
        <div className="service-art__code-lines"><span /><span /><span /><span /></div>
      </div>
    )
  }

  if (type === 'transformation') {
    return (
      <div className="service-art service-art--transformation" aria-hidden="true">
        <div className="service-art__grid" />
        <div className="service-art__node service-art__node--a" />
        <div className="service-art__node service-art__node--b" />
        <div className="service-art__node service-art__node--c" />
        <div className="service-art__node service-art__node--d" />
        <span className="service-art__line service-art__line--a" />
        <span className="service-art__line service-art__line--b" />
        <span className="service-art__line service-art__line--c" />
        <span className="service-art__transformation-core" />
      </div>
    )
  }

  if (type === 'advertising') {
    return (
      <div className="service-art service-art--advertising" aria-hidden="true">
        <div className="service-art__search">
          <span className="service-art__search-mark">G</span>
          <span>find the next move</span>
          <span className="service-art__search-icon">⌕</span>
        </div>
        <div className="service-art__result service-art__result--active">
          <span>Campaign preview</span>
          <b>Search placement</b>
          <i>Keyword / audience / budget</i>
        </div>
        <div className="service-art__result"><span>Display placement</span><b>Audience selection</b></div>
      </div>
    )
  }

  return (
    <div className="service-art service-art--consulting" aria-hidden="true">
      <div className="service-art__axis service-art__axis--x" />
      <div className="service-art__axis service-art__axis--y" />
      <div className="service-art__route service-art__route--one" />
      <div className="service-art__route service-art__route--two" />
      <span className="service-art__waypoint service-art__waypoint--one" />
      <span className="service-art__waypoint service-art__waypoint--two" />
      <span className="service-art__waypoint service-art__waypoint--three" />
      <p className="service-art__consulting-tag">where next?</p>
    </div>
  )
}

function ServicesJourney({ onNavigate }) {
  const sectionRef = useRef(null)
  const viewportRef = useRef(null)
  const trackRef = useRef(null)
  const progressRef = useRef(null)

  useLayoutEffect(() => {
    const section = sectionRef.current
    const viewport = viewportRef.current
    const track = trackRef.current
    if (!section || !viewport || !track) return undefined

    const panels = Array.from(track.querySelectorAll('.service-panel'))
    const motionQuery = window.matchMedia('(prefers-reduced-motion: reduce)')

    let desktopActive = false
    let desktopCleanup = () => {}
    let mobileCleanup = () => {}
    let disposed = false

    const updatePanelStates = (progress = 0) => {
      const viewportBounds = viewport.getBoundingClientRect()
      const focusPoint = viewportBounds.left + viewportBounds.width * 0.52
      const panelBounds = panels.map((panel) => panel.getBoundingClientRect())

      panels.forEach((panel, index) => {
        const panelPoint = panelBounds[index].left + panelBounds[index].width / 2
        const focus = clamp(1 - Math.abs(focusPoint - panelPoint) / (viewportBounds.width * 0.58), 0, 1)
        panel.style.setProperty('--panel-focus', focus.toFixed(3))
      })

      if (progressRef.current) {
        progressRef.current.style.transform = `scaleX(${progress})`
      }
      section.style.setProperty('--journey-progress', progress)
    }

    const setupMobile = () => {
      mobileCleanup()
      // Reset track positioning
      track.style.transform = ''

      const onMobileScroll = () => {
        const maxScroll = Math.max(1, viewport.scrollWidth - viewport.clientWidth)
        const progress = clamp(viewport.scrollLeft / maxScroll, 0, 1)
        updatePanelStates(progress)
      }

      viewport.addEventListener('scroll', onMobileScroll, { passive: true })
      onMobileScroll()

      mobileCleanup = () => {
        viewport.removeEventListener('scroll', onMobileScroll)
      }
    }

    const setupDesktop = () => {
      desktopCleanup()
      mobileCleanup()
      desktopActive = window.innerWidth > 900 && !motionQuery.matches

      if (!desktopActive) {
        setupMobile()
        return
      }

      const getTravel = () => Math.max(1, track.scrollWidth - viewport.clientWidth)

      const context = gsap.context(() => {
        gsap.set(track, { x: 0 })
        updatePanelStates(0)

        gsap.to(track, {
          x: () => -getTravel(),
          ease: 'none',
          scrollTrigger: {
            trigger: section,
            pin: section,
            pinSpacing: true,
            start: 'top top',
            end: () => `+=${getTravel()}`,
            scrub: true,
            anticipatePin: 0,
            fastScrollEnd: false,
            invalidateOnRefresh: true,
            onUpdate: (self) => updatePanelStates(self.progress),
            onRefresh: (self) => updatePanelStates(self.progress),
          },
        })
      }, section)

      let resizeTimeout = 0
      const onResizeDebounced = () => {
        clearTimeout(resizeTimeout)
        resizeTimeout = setTimeout(() => {
          if (!disposed && desktopActive) {
            ScrollTrigger.refresh()
          }
        }, 150)
      }

      window.addEventListener('resize', onResizeDebounced)
      document.fonts?.ready.then(() => {
        if (!disposed && desktopActive) ScrollTrigger.refresh()
      })

      desktopCleanup = () => {
        clearTimeout(resizeTimeout)
        window.removeEventListener('resize', onResizeDebounced)
        context.revert()
      }
    }

    const handleWindowResize = () => {
      const shouldBeDesktop = window.innerWidth > 900 && !motionQuery.matches
      if (shouldBeDesktop !== desktopActive) {
        setupDesktop()
      }
    }

    window.addEventListener('resize', handleWindowResize)
    motionQuery.addEventListener('change', setupDesktop)
    setupDesktop()

    return () => {
      window.removeEventListener('resize', handleWindowResize)
      motionQuery.removeEventListener('change', setupDesktop)
      desktopCleanup()
      mobileCleanup()
      disposed = true
    }
  }, [])

  return (
    <section className="services-journey" id="services" ref={sectionRef} aria-labelledby="services-title">
      <div className="services-journey__pin">
        <div className="services-journey__header">
          <p className="services-journey__instruction">
            <span aria-hidden="true">↔</span>
            <span className="services-journey__instruction-text">Scroll to move through</span>
          </p>
        </div>

        <div className="services-journey__viewport" ref={viewportRef}>
          <div className="services-journey__track" ref={trackRef}>
            <div className="service-panel service-panel--intro">
              <div className="service-panel__intro-copy">
                <p className="eyebrow">{brand.name}</p>
                <h2 id="services-title">From first signal to lasting system.</h2>
                <p>
                  DigiCare Web is more than a digital solutions provider; it is a strategic partner for businesses
                  ready to thrive in a changing digital world.
                </p>
                <a className="button button--outline-light" href={`mailto:${brand.email}`}>
                  Talk to our team <span aria-hidden="true">↗</span>
                </a>
              </div>
              <div className="service-panel__intro-mark" aria-hidden="true"><img src="/favicon.png" alt="" /><i /></div>
            </div>

            {featuredServices.map((service) => (
              <a
                className={`service-panel service-panel--${service.visual} service-panel--link`}
                href={`/${service.slug}`}
                key={service.name}
                onClick={(event) => onNavigate?.(event, `/${service.slug}`)}
              >
                <ServiceArtwork type={service.visual} />
                <div className="service-panel__copy">
                  <p className="eyebrow">{service.label}</p>
                  <h3>{service.name}</h3>
                  <p>{service.line}</p>
                </div>
              </a>
            ))}
          </div>
        </div>

        <div className="services-journey__footer">
          <span>Digital transformation, in motion.</span>
          <div className="services-journey__progress" aria-hidden="true"><span ref={progressRef} /></div>
          <span>Keep moving / <b>{brand.name}</b></span>
        </div>
      </div>
    </section>
  )
}

export default ServicesJourney
