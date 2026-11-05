import { useEffect, useState } from 'react'
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
import { brand, serviceCatalog } from './content.js'
import { canonicalOrigin, canonicalPathFor, getPageMetadata } from './seo.js'
import CartPage from './pages/CartPage.jsx'
import CheckoutPage from './pages/CheckoutPage.jsx'
import OrderConfirmationPage from './pages/OrderConfirmationPage.jsx'
import { useCart } from './cart/CartContext.jsx'
import { useCatalog } from './services/CatalogContext.jsx'
import './styles.css'

const normalizePath = (path) => path.replace(/\/+$/, '') || '/'

function updatePageMetadata(route, service) {
  const metadata = getPageMetadata(route, service)
  const canonicalUrl = `${canonicalOrigin}${canonicalPathFor(route)}`
  const imageUrl = `${canonicalOrigin}/brand/digicare-web-logo.svg`

  document.title = metadata.title
  document.querySelector('meta[name="description"]')?.setAttribute('content', metadata.description)
  document.querySelector('meta[name="robots"]')?.setAttribute('content', metadata.noindex ? 'noindex, nofollow' : 'index, follow')
  document.querySelector('link[rel="canonical"]')?.setAttribute('href', canonicalUrl)
  document.querySelector('meta[property="og:title"]')?.setAttribute('content', metadata.title)
  document.querySelector('meta[property="og:description"]')?.setAttribute('content', metadata.description)
  document.querySelector('meta[property="og:url"]')?.setAttribute('content', canonicalUrl)
  document.querySelector('meta[property="og:image"]')?.setAttribute('content', imageUrl)
  document.querySelector('meta[name="twitter:title"]')?.setAttribute('content', metadata.title)
  document.querySelector('meta[name="twitter:description"]')?.setAttribute('content', metadata.description)
  document.querySelector('meta[name="twitter:image"]')?.setAttribute('content', imageUrl)

  const robots = document.querySelector('meta[name="robots"]')
  robots?.setAttribute('content', metadata.noindex ? 'noindex, follow' : 'index, follow')
}

function HomePage({ onNavigate }) {
  const [videoFailed, setVideoFailed] = useState(false)
  const [reducedMotion, setReducedMotion] = useState(() => window.matchMedia('(prefers-reduced-motion: reduce)').matches)

  useEffect(() => {
    const motionQuery = window.matchMedia('(prefers-reduced-motion: reduce)')
    const updateMotionPreference = () => setReducedMotion(motionQuery.matches)
    motionQuery.addEventListener('change', updateMotionPreference)
    return () => {
      motionQuery.removeEventListener('change', updateMotionPreference)
    }
  }, [])

  return (
    <main className="site-shell">
      <section
        className={`hero${videoFailed ? ' hero--video-failed' : ''}`}
        aria-labelledby="hero-title"
      >
        <div className="hero__media" aria-hidden="true">
          {!videoFailed && !reducedMotion && (
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
  const [orderConfirmation, setOrderConfirmation] = useState(null)
  const { clearCart } = useCart()
  const { services, loading: catalogLoading, error: catalogError, retry: retryCatalog } = useCatalog()

  useEffect(() => {
    const handlePopState = () => setRoute(normalizePath(window.location.pathname))
    window.addEventListener('popstate', handlePopState)
    return () => window.removeEventListener('popstate', handlePopState)
  }, [])

  useEffect(() => {
    const service = services.find((item) => `/${item.slug}` === route)
    updatePageMetadata(route, service)
  }, [route, services])

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

  const handleOrderCreated = (confirmation) => {
    setOrderConfirmation(confirmation)
    clearCart()
    window.history.pushState({}, '', '/order-confirmation')
    setRoute('/order-confirmation')
    window.scrollTo({ top: 0, behavior: 'auto' })
  }

  if (route === '/cart') return <CartPage onNavigate={handleNavigate} />
  if (route === '/checkout') return <CheckoutPage onNavigate={handleNavigate} onOrderCreated={handleOrderCreated} />
  if (route === '/order-confirmation') return <OrderConfirmationPage confirmation={orderConfirmation} onNavigate={handleNavigate} />

  if (route === '/') return <HomePage onNavigate={handleNavigate} />
  if (route === '/about-us') return <AboutPage onNavigate={handleNavigate} />
  if (route === '/service') return <ServicesPage onNavigate={handleNavigate} />
  if (route === '/faq') return <FaqPage onNavigate={handleNavigate} />
  if (route === '/contact-us') return <ContactPage onNavigate={handleNavigate} />
  if (route === '/privacy-policy') return <LegalPage type="privacy" onNavigate={handleNavigate} />
  if (route === '/terms-and-conditions') return <LegalPage type="terms" onNavigate={handleNavigate} />
  if (route === '/payment') return <PaymentPage onNavigate={handleNavigate} />

  const service = services.find((item) => `/${item.slug}` === route)
  if (service) return <ServiceDetailPage service={service} onNavigate={handleNavigate} />

  if (catalogLoading) return <ServiceRouteState onNavigate={handleNavigate} message="Loading service details…" />
  if (catalogError && serviceCatalog.some((item) => `/${item.slug}` === route)) {
    return <ServiceRouteState onNavigate={handleNavigate} message={`Service details could not be loaded. ${catalogError}`} retry={retryCatalog} />
  }

  return <NotFoundPage onNavigate={handleNavigate} />
}

function ServiceRouteState({ onNavigate, message, retry }) {
  return (
    <div className="site-shell site-shell--page">
      <SiteHeader currentPath="/service" onNavigate={onNavigate} />
      <main className="page-content commerce-page"><section className="commerce-empty" role={retry ? 'alert' : 'status'}><h1>Service information</h1><p>{message}</p>{retry && <button className="button button--outline" type="button" onClick={retry}>Try again</button>}</section></main>
      <SiteFooter onNavigate={onNavigate} />
    </div>
  )
}

export default App
