import { lazy, Suspense, useEffect, useRef, useState } from 'react'
import SignalFallback from './components/SignalFallback.jsx'
import ServicesJourney from './components/ServicesJourney.jsx'
import SiteHeader from './components/SiteHeader.jsx'
import {
  AboutSection,
  ContactSection,
  DifferentiatorsSection,
  FaqSection,
  LegalPage,
  NotFoundPage,
  PageHero,
  PaymentPage,
  PortfolioSection,
  ProcessSection,
  ServiceCatalog,
  ServiceDetailPage,
  SiteFooter,
} from './components/BusinessSections.jsx'
import { brand, featuredServices, serviceCatalog } from './content.js'
import './styles.css'

const Hero3D = lazy(() => import('./components/Hero3D.jsx'))

function HeroVisualSlot() {
  const [enhanced, setEnhanced] = useState(false)

  useEffect(() => {
    const query = window.matchMedia('(min-width: 901px) and (prefers-reduced-motion: no-preference)')
    const update = () => setEnhanced(query.matches)

    update()
    query.addEventListener('change', update)

    return () => query.removeEventListener('change', update)
  }, [])

  if (!enhanced) return <SignalFallback />

  return (
    <Suspense fallback={<SignalFallback />}>
      <Hero3D />
    </Suspense>
  )
}

const normalizePath = (path) => path.replace(/\/+$/, '') || '/'

function HomePage({ onNavigate }) {
  const heroRef = useRef(null)
  const [videoFailed, setVideoFailed] = useState(false)

  useEffect(() => {
    const hero = heroRef.current
    const motionQuery = window.matchMedia('(prefers-reduced-motion: reduce)')
    let animationFrame = 0

    const updateScroll = () => {
      if (motionQuery.matches) return

      cancelAnimationFrame(animationFrame)
      animationFrame = requestAnimationFrame(() => {
        const bounds = hero.getBoundingClientRect()
        const progress = Math.min(1, Math.max(0, -bounds.top / bounds.height))
        hero.style.setProperty('--scroll-shift', `${progress * 3}vh`)
      })
    }

    const updatePointer = (event) => {
      if (motionQuery.matches) return

      const x = (event.clientX / window.innerWidth - 0.5) * 10
      const y = (event.clientY / window.innerHeight - 0.5) * 6
      hero.style.setProperty('--pointer-x', `${x}px`)
      hero.style.setProperty('--pointer-y', `${y}px`)
    }

    const resetMotion = () => {
      if (motionQuery.matches) {
        hero.style.setProperty('--scroll-shift', '0vh')
        hero.style.setProperty('--pointer-x', '0px')
        hero.style.setProperty('--pointer-y', '0px')
      }
    }

    window.addEventListener('scroll', updateScroll, { passive: true })
    window.addEventListener('pointermove', updatePointer, { passive: true })
    motionQuery.addEventListener('change', resetMotion)
    updateScroll()

    return () => {
      cancelAnimationFrame(animationFrame)
      window.removeEventListener('scroll', updateScroll)
      window.removeEventListener('pointermove', updatePointer)
      motionQuery.removeEventListener('change', resetMotion)
    }
  }, [])

  return (
    <main className="site-shell">
      <section
        className={`hero${videoFailed ? ' hero--video-failed' : ''}`}
        ref={heroRef}
        aria-labelledby="hero-title"
      >
        <div className="hero__media" aria-hidden="true">
          {!videoFailed && (
            <video
              className="hero__video"
              autoPlay
              muted
              loop
              playsInline
              preload="metadata"
              poster="/media/eskay-hero-poster.jpg"
              onError={() => setVideoFailed(true)}
            >
              <source src="/media/eskay-hero.webm" type="video/webm" />
              <source src="/media/eskay-hero.mp4" type="video/mp4" />
            </video>
          )}
          <div className="hero__fallback" />
          <div className="hero__shade" />
          <div className="hero__grain" />
        </div>

        <div className="hero__visual" aria-hidden="true">
          <HeroVisualSlot />
        </div>

        <SiteHeader currentPath="/" onNavigate={onNavigate} overlay />

        <div className="hero__frame">
          <div className="hero__content">
            <p className="eyebrow hero__eyebrow">DigiCare Web / Florida, USA</p>
            <h1 id="hero-title" aria-label="Your digital transformation partner.">
              <span>Your digital</span>
              <span className="hero__title-accent">transformation</span>
              <span>partner.</span>
            </h1>
            <p className="hero__lede">
              We combine innovation, expertise, and technology to help businesses thrive in the digital age.
            </p>
            <div className="hero__actions">
              <a className="button button--primary" href="#services">
                Explore services
                <span aria-hidden="true">↗</span>
              </a>
              <a className="button button--text" href={`mailto:${brand.email}`}>
                Contact DigiCare Web
              </a>
            </div>
          </div>

          <aside className="hero__rail" aria-label={`${brand.name} service areas`}>
            <ul>
              {featuredServices.map((service) => <li key={service.name}>{service.name}</li>)}
            </ul>
          </aside>
        </div>
      </section>

      <ServicesJourney onNavigate={onNavigate} />

      <AboutSection />
      <DifferentiatorsSection />
      <ContactSection />
      <SiteFooter onNavigate={onNavigate} />
    </main>
  )
}

function AboutPage({ onNavigate }) {
  return (
    <div className="site-shell site-shell--page">
      <SiteHeader currentPath="/about-us" onNavigate={onNavigate} />
      <main className="page-content">
        <PageHero eyebrow="About DigiCare Web" title="Empowering your digital journey." lede="A dedicated partner for businesses navigating the ever-evolving digital landscape." visual="consulting" />
        <AboutSection page />
        <DifferentiatorsSection />
        <ProcessSection />
        <PortfolioSection />
        <ContactSection page />
      </main>
      <SiteFooter onNavigate={onNavigate} />
    </div>
  )
}

function ServicesPage({ onNavigate }) {
  return (
    <div className="site-shell site-shell--page">
      <SiteHeader currentPath="/service" onNavigate={onNavigate} />
      <main className="page-content">
        <PageHero eyebrow="Services / DigiCare Web" title="Services with a clear scope." lede="Explore digital marketing, technology, ecommerce, Amazon, advertising, and consulting services." visual="cloud" />
        <ServiceCatalog onNavigate={onNavigate} />
        <ProcessSection />
        <ContactSection page />
      </main>
      <SiteFooter onNavigate={onNavigate} />
    </div>
  )
}

function FaqPage({ onNavigate }) {
  return (
    <div className="site-shell site-shell--page">
      <SiteHeader currentPath="/faq" onNavigate={onNavigate} />
      <main className="page-content">
        <PageHero eyebrow="F.A.Q. / DigiCare Web" title="Start with the useful questions." lede="Straightforward answers about services, timelines, support, security, and working together." visual="learning" />
        <FaqSection />
        <ContactSection page />
      </main>
      <SiteFooter onNavigate={onNavigate} />
    </div>
  )
}

function ContactPage({ onNavigate }) {
  return (
    <div className="site-shell site-shell--page">
      <SiteHeader currentPath="/contact-us" onNavigate={onNavigate} />
      <main className="page-content">
        <PageHero eyebrow="Contacts / DigiCare Web" title="Bring us the next opportunity." lede="Questions, project conversations, and a clear route into the digital landscape." visual="contact" />
        <ContactSection page showDetails />
      </main>
      <SiteFooter onNavigate={onNavigate} />
    </div>
  )
}

function App() {
  const [route, setRoute] = useState(() => normalizePath(window.location.pathname))

  useEffect(() => {
    const handlePopState = () => setRoute(normalizePath(window.location.pathname))
    window.addEventListener('popstate', handlePopState)
    return () => window.removeEventListener('popstate', handlePopState)
  }, [])

  useEffect(() => {
    const service = serviceCatalog.find((item) => `/${item.slug}` === route)
    const pageTitle = service
      ? `${service.name} — DigiCare Web`
      : ({
          '/': 'DigiCare Web — Digital transformation partner',
          '/about-us': 'About DigiCare Web — Digital transformation partner',
          '/service': 'Services — DigiCare Web',
          '/faq': 'FAQ — DigiCare Web',
          '/contact-us': 'Contact DigiCare Web',
          '/privacy-policy': 'Privacy Policy — DigiCare Web',
          '/terms-and-conditions': 'Terms and Conditions — DigiCare Web',
          '/payment': 'Package request — DigiCare Web',
        }[route] || 'Page not found — DigiCare Web')
    const description = service
      ? `${service.name} from DigiCare Web: ${service.scope}`
      : 'DigiCare Web is a digital transformation partner for marketing, web, software, ecommerce, advertising, and business consulting.'
    document.title = pageTitle
    document.querySelector('meta[name="description"]')?.setAttribute('content', description)
  }, [route])

  const handleNavigate = (event, href) => {
    if (!href || !href.startsWith('/')) return
    event?.preventDefault()
    const [path, hash] = href.split('#')
    const nextPath = normalizePath(path || '/')
    window.history.pushState({}, '', href)
    setRoute(nextPath)
    if (hash && nextPath === route) {
      window.requestAnimationFrame(() => document.getElementById(hash)?.scrollIntoView({ behavior: 'smooth' }))
    } else {
      window.scrollTo({ top: 0, behavior: 'auto' })
    }
  }

  if (route === '/') return <HomePage onNavigate={handleNavigate} />
  if (route === '/about-us') return <AboutPage onNavigate={handleNavigate} />
  if (route === '/service') return <ServicesPage onNavigate={handleNavigate} />
  if (route === '/faq') return <FaqPage onNavigate={handleNavigate} />
  if (route === '/contact-us') return <ContactPage onNavigate={handleNavigate} />
  if (route === '/privacy-policy') return <LegalPage type="privacy" onNavigate={handleNavigate} />
  if (route === '/terms-and-conditions') return <LegalPage type="terms" onNavigate={handleNavigate} />
  if (route === '/payment') return <PaymentPage onNavigate={handleNavigate} />

  const service = serviceCatalog.find((item) => `/${item.slug}` === route)
  if (service) return <ServiceDetailPage service={service} onNavigate={handleNavigate} />

  return <NotFoundPage onNavigate={handleNavigate} />
}

export default App
