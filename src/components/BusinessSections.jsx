import ContactForm from './ContactForm.jsx'
import SiteHeader from './SiteHeader.jsx'
import BrandLogo from './BrandLogo.jsx'
import { ServiceArtwork } from './ServicesJourney.jsx'
import { brand, faqItems, privacySections, serviceCatalog, termsSections } from '../content.js'

export function PageHero({ eyebrow, title, lede, visual = 'transformation' }) {
  return (
    <section className={`page-hero page-hero--${visual}`} aria-labelledby="page-title">
      <div className="page-hero__grid" aria-hidden="true" />
      <div className="page-hero__copy">
        <p className="eyebrow">{eyebrow}</p>
        <h1 id="page-title">{title}</h1>
        <p className="page-hero__lede">{lede}</p>
      </div>
      <div className="page-hero__art" aria-hidden="true" style={{ '--panel-focus': 1 }}>
        <ServiceArtwork type={visual} />
      </div>
    </section>
  )
}

export function AboutSection({ page = false }) {
  return (
    <section className={`about-section${page ? ' about-section--page' : ''}`} id={page ? undefined : 'about'} aria-labelledby="about-title">
      <div className="about-section__visual" aria-hidden="true">
        <div className="about-section__visual-field" />
        <span>DC / WEB</span>
      </div>
      <div className="about-section__copy">
        <p className="eyebrow">About DigiCare Web</p>
        <h2 id="about-title">Your digital transformation partner.</h2>
        <p>
          At DigiCare Web, we are dedicated partners in navigating the ever-evolving digital landscape. With a
          commitment to innovation and excellence, we empower businesses to thrive in the digital age.
        </p>
        <p>
          We are more than a digital solutions provider. We are a strategic partner that combines expertise, creativity,
          and technology around the needs of each business.
        </p>
        <p>
          Whether you are a startup with a bold vision or an established enterprise seeking transformation, we provide
          the strategies and tools needed to move forward with confidence.
        </p>
      </div>
    </section>
  )
}

export function DifferentiatorsSection() {
  const points = [
    ['Expertise', 'Industry knowledge across digital marketing, technology, ecommerce, advertising, and consulting.'],
    ['Innovation', 'A commitment to current technology and practical solutions for changing business needs.'],
    ['Customization', 'Strategies and services shaped around each client’s goals, audience, and constraints.'],
    ['Client-centric', 'Close collaboration keeps the work connected to the client’s priorities and outcomes.'],
    ['Proven track record', 'The published company information describes experience across successful projects.'],
  ]

  return (
    <section className="differentiators-section" aria-labelledby="differentiators-title">
      <div className="section-heading section-heading--split">
        <div>
          <p className="eyebrow">How we work</p>
          <h2 id="differentiators-title">Clarity is part of the service.</h2>
        </div>
        <p>DigiCare Web’s published information emphasizes expertise, innovation, customization, client focus, and practical delivery.</p>
      </div>
      <ol className="differentiators-list">
        {points.map(([title, text]) => (
          <li key={title}>
            <h3>{title}</h3>
            <p>{text}</p>
          </li>
        ))}
      </ol>
    </section>
  )
}

export function CapabilityDirectory() {
  return (
    <section className="capability-directory" aria-labelledby="capability-title">
      <div className="section-heading section-heading--split">
        <div>
          <h2 id="capability-title">The full field of play.</h2>
        </div>
        <a className="button button--outline" href="/service">View service catalog <span aria-hidden="true">↗</span></a>
      </div>
      <ul className="capability-directory__list">
        {serviceCatalog.map((service) => (
          <li key={service.name}>
            <b><a href={`/${service.slug}`}>{service.name}</a></b>
            <em>{service.scope}</em>
            <i>{service.price}</i>
          </li>
        ))}
      </ul>
    </section>
  )
}

export function ProcessSection() {
  const steps = [
    ['Consultation', 'Understand the goals, challenges, audience, existing systems, and requirements.'],
    ['Strategy', 'Shape a tailored strategy aligned with the business objectives and available resources.'],
    ['Execution', 'Implement the agreed service with the right combination of expertise and technology.'],
    ['Monitoring', 'Track the work and refine the direction with useful feedback and data.'],
    ['Delivery', 'Measure success by the agreed scope and the client’s progress toward its goals.'],
  ]

  return (
    <section className="process-section" aria-labelledby="process-title">
      <div className="section-heading">
        <p className="eyebrow">Method / From brief to handover</p>
        <h2 id="process-title">A practical route through complexity.</h2>
      </div>
      <ol className="process-section__list">
        {steps.map(([title, text]) => (
          <li key={title}>
            <h3>{title}</h3>
            <p>{text}</p>
          </li>
        ))}
      </ol>
    </section>
  )
}

export function PortfolioSection() {
  return (
    <section className="portfolio-section" aria-labelledby="portfolio-title">
      <div className="portfolio-section__visual" aria-hidden="true"><span>?</span><i /></div>
      <div>
        <p className="eyebrow">Selected work</p>
        <h2 id="portfolio-title">A public case-study library is not published yet.</h2>
        <p>We won’t invent clients, logos, awards, testimonials, or performance numbers. Ask us about your brief and we’ll discuss the right next step.</p>
        <a className="button button--primary" href={`mailto:${brand.email}`}>Discuss a project <span aria-hidden="true">↗</span></a>
      </div>
    </section>
  )
}

export function FaqPreview() {
  return (
    <section className="faq-preview" aria-labelledby="faq-preview-title">
      <div className="section-heading section-heading--split">
        <div>
          <h2 id="faq-preview-title">Useful answers before the first call.</h2>
        </div>
        <a className="button button--outline" href="/faq">Read all F.A.Q. <span aria-hidden="true">↗</span></a>
      </div>
      <div className="faq-preview__list">
        {faqItems.slice(0, 4).map((item) => (
          <details key={item.question}>
            <summary>{item.question}<span aria-hidden="true">+</span></summary>
            <p>{item.answer}</p>
          </details>
        ))}
      </div>
    </section>
  )
}

export function ContactSection({ page = false, showDetails = false }) {
  return (
    <section className={`contact-section${page ? ' contact-section--page' : ''}`} id={page ? undefined : 'contact'} aria-labelledby="contact-title">
      <div className="contact-section__intro">
        <p className="eyebrow">Get in touch</p>
        <h2 id="contact-title">Let’s find the next move.</h2>
        <p>Whether you have questions about our services, need more information, or simply want to connect, the DigiCare Web team is here to assist.</p>
        {showDetails && (
          <div className="contact-details">
            <a href={`mailto:${brand.email}`}>{brand.email}</a>
            <a href={brand.phoneHref}>{brand.phone}</a>
            <span>{brand.address}</span>
          </div>
        )}
      </div>
      <ContactForm />
    </section>
  )
}

function ServiceCatalogCard({ service, onNavigate }) {
  const href = `/${service.slug}`

  return (
    <a className="catalog-card" href={href} onClick={(event) => onNavigate?.(event, href)}>
      <div className={`catalog-card__visual catalog-card__visual--${service.heroVisual || service.visual}`} aria-hidden="true">
        <ServiceArtwork type={service.heroVisual || service.visual} />
        <span className="catalog-card__visual-label">DigiCare Web / Service</span>
      </div>
      <div className="catalog-card__body">
        <div className="catalog-card__meta">
          <span className="eyebrow">Published price</span>
          <span className="catalog-card__price">{service.price}</span>
        </div>
        <h3 className="catalog-card__title">{service.name}</h3>
        <p className="catalog-card__description">{service.scope}</p>
        <span className="catalog-card__action">Explore service <span aria-hidden="true">↗</span></span>
      </div>
    </a>
  )
}

export function ServiceCatalog({ onNavigate }) {
  return (
    <section className="catalog-section" aria-labelledby="catalog-title">
      <div className="section-heading section-heading--split">
        <div>
          <p className="eyebrow">Service catalog</p>
          <h2 id="catalog-title">The details matter.</h2>
        </div>
        <p>Published prices are shown in US dollars where available. Custom scopes and final billing terms should be confirmed with DigiCare Web.</p>
      </div>
      <div className="catalog-grid">
        {serviceCatalog.map((service) => (
          <ServiceCatalogCard key={service.name} service={service} onNavigate={onNavigate} />
        ))}
      </div>
      <p className="catalog-note">Third-party costs such as advertising spend, hosting, domains, premium plugins or themes, stock media, and government or registry filing fees may be separate. Custom quotes require a conversation about scope.</p>
    </section>
  )
}

export function FaqSection() {
  return (
    <section className="faq-section" aria-labelledby="faq-title">
      <div className="section-heading">
        <p className="eyebrow">Answers / F.A.Q.</p>
        <h2 id="faq-title">Start with the useful questions.</h2>
      </div>
      <div className="faq-section__list">
        {faqItems.map((item, index) => (
          <details key={item.question} open={index === 0}>
            <summary>{item.question}<b aria-hidden="true">+</b></summary>
            <p>{item.answer}</p>
          </details>
        ))}
      </div>
    </section>
  )
}

export function LegalPage({ type, onNavigate }) {
  const isPrivacy = type === 'privacy'
  const sections = isPrivacy ? privacySections : termsSections
  const title = isPrivacy ? 'Privacy Policy' : 'Terms and Conditions'

  return (
    <div className="site-shell site-shell--page">
      <SiteHeader currentPath={isPrivacy ? '/privacy-policy' : '/terms-and-conditions'} onNavigate={onNavigate} />
      <main className="page-content">
        <PageHero eyebrow={`${brand.name} / ${title}`} title={title} lede="Published information governing communication, services, payments, and use of this website." visual="legal" />
        <section className="legal-section" aria-labelledby="legal-title">
          <div className="section-heading">
            <p className="eyebrow">{brand.copyright}</p>
            <h2 id="legal-title">Read the details before you begin.</h2>
          </div>
          <div className="legal-section__list">
            {sections.map(([heading, text]) => (
              <article key={heading}>
                <h3>{heading}</h3>
                <p>{text}</p>
              </article>
            ))}
          </div>
          <p className="legal-section__contact">Questions about this {isPrivacy ? 'policy' : 'agreement'} can be directed to <a href={`mailto:${brand.email}`}>{brand.email}</a>.</p>
        </section>
      </main>
      <SiteFooter onNavigate={onNavigate} />
    </div>
  )
}

export function SiteFooter({ onNavigate }) {
  const handleLink = (event, href) => onNavigate?.(event, href)

  return (
    <footer className="site-footer">
      <div className="site-footer__top">
        <a className="wordmark" href="/" onClick={(event) => handleLink(event, '/')} aria-label={`${brand.name} home`}>
          <BrandLogo />
        </a>
        <p>Empowering your digital journey.</p>
        <a className="button button--primary" href={`mailto:${brand.email}`}>Start a conversation <span aria-hidden="true">↗</span></a>
      </div>
      <div className="site-footer__bottom">
        <div className="site-footer__links">
          <a href="/about-us" onClick={(event) => handleLink(event, '/about-us')}>About Us</a>
          <a href="/service" onClick={(event) => handleLink(event, '/service')}>Services</a>
          <a href="/faq" onClick={(event) => handleLink(event, '/faq')}>F.A.Q.</a>
          <a href="/contact-us" onClick={(event) => handleLink(event, '/contact-us')}>Contacts</a>
          <a href="/privacy-policy" onClick={(event) => handleLink(event, '/privacy-policy')}>Privacy Policy</a>
          <a href="/terms-and-conditions" onClick={(event) => handleLink(event, '/terms-and-conditions')}>Terms</a>
        </div>
        <p>{brand.copyright} · {brand.address}, USA</p>
        <p><a href={brand.phoneHref}>{brand.phone}</a> · <a href={`mailto:${brand.email}`}>{brand.email}</a></p>
      </div>
      <div className="site-footer__legal">© {brand.copyright}. All Rights Reserved.</div>
    </footer>
  )
}

export function ServiceDetailPage({ service, onNavigate }) {
  return (
    <div className="site-shell site-shell--page">
      <SiteHeader currentPath="/service" onNavigate={onNavigate} />
      <main className="page-content">
        <section className="service-detail" aria-labelledby="service-detail-title">
          <div className="service-detail__intro">
            <p className="eyebrow">{brand.displayName} / Service</p>
            <h1 id="service-detail-title">{service.name}</h1>
            <p className="service-detail__headline">{service.headline}</p>
            {service.paragraphs.map((paragraph) => <p key={paragraph}>{paragraph}</p>)}
            <a className="button button--primary" href={`mailto:${brand.email}?subject=${encodeURIComponent(`${service.name} enquiry`)}&body=${encodeURIComponent(`Hello DigiCare Web,\n\nI would like to discuss ${service.name}.\n\n`)}`}>
              {service.cta || 'Discuss this service'} <span aria-hidden="true">↗</span>
            </a>
          </div>
          <div className={`service-detail__visual service-detail__visual--${service.visual}`} aria-hidden="true">
            <ServiceArtwork type={service.heroVisual || service.visual} />
          </div>
        </section>
        <section className="service-detail__benefits" aria-labelledby="service-benefits-title">
          <div className="section-heading">
            <p className="eyebrow">Scope / What matters</p>
            <h2 id="service-benefits-title">A clearer route into the work.</h2>
          </div>
          <ul>
            {service.benefits.map((benefit) => <li key={benefit}>{benefit}</li>)}
          </ul>
        </section>
        <section className="service-packages" aria-labelledby="service-packages-title">
          <div className="section-heading section-heading--split">
            <div>
              <p className="eyebrow">Published packages</p>
              <h2 id="service-packages-title">Choose the right starting point</h2>
            </div>
            <p>Published prices and package details are shown as listed. Contact DigiCare Web to confirm the current scope and terms.</p>
          </div>
          {service.packages.length > 0 ? (
            <div className={`service-packages__list${service.packages.length === 1 ? ' service-packages__list--single' : ''}`}>
              {service.packages.map((item) => (
                <article key={item.name}>
                  <h3>{item.name}</h3>
                  <p className="service-packages__price">{item.price}</p>
                  <ul aria-label={`${item.name} features`}>{item.features.map((feature) => <li key={feature}>{feature}</li>)}</ul>
                  <a className="button button--outline" href={`mailto:${brand.email}?subject=${encodeURIComponent(`${item.name} request`)}&body=${encodeURIComponent(`Hello DigiCare Web,\n\nI would like to request more information about ${item.name} (${item.price}) under ${service.name}.\n\n`)}`}>Request this package <span aria-hidden="true">↗</span></a>
                </article>
              ))}
            </div>
          ) : (
            <div className="service-packages__enquiry">
              <div>
                <p className="eyebrow">Published pricing</p>
                <p className="service-packages__price">{service.price}</p>
              </div>
              <div>
                <h3>Discuss this service</h3>
                <p>The published page lists a consultation rather than a priced package.</p>
              </div>
              <a className="button button--outline" href={`mailto:${brand.email}?subject=${encodeURIComponent(`${service.name} enquiry`)}`}>{service.cta || 'Enquire about this service'} <span aria-hidden="true">↗</span></a>
            </div>
          )}
        </section>
        <ContactSection page />
      </main>
      <SiteFooter onNavigate={onNavigate} />
    </div>
  )
}

export function PaymentPage({ onNavigate }) {
  return (
    <div className="site-shell site-shell--page">
      <SiteHeader currentPath="/service" onNavigate={onNavigate} />
      <main className="page-content">
        <PageHero eyebrow={`Package request / ${brand.name}`} title="Start with a package conversation." lede="The live payment provider is not configured in this React build. Request a package by email and the team can confirm scope, billing, and next steps." visual="finance" />
        <section className="payment-state" aria-labelledby="payment-title">
          <div>
            <p className="eyebrow">Payment configuration</p>
            <h2 id="payment-title">No payment is collected here yet.</h2>
            <p>The previous website exposes a payment route, but no approved gateway credentials or server-side integration are available in this repository. This honest state avoids collecting or implying payment without a configured provider.</p>
            <a className="button button--primary" href={`mailto:${brand.email}?subject=${encodeURIComponent('Package and payment enquiry')}`}>Request payment details <span aria-hidden="true">↗</span></a>
          </div>
          <div className="payment-state__mark" aria-hidden="true">$</div>
        </section>
      </main>
      <SiteFooter onNavigate={onNavigate} />
    </div>
  )
}

export function NotFoundPage({ onNavigate }) {
  return (
    <div className="site-shell site-shell--page">
      <SiteHeader currentPath="/" onNavigate={onNavigate} />
      <main className="page-content">
        <PageHero eyebrow={`${brand.name} / 404`} title="This route is not on the map." lede="The page you requested could not be found. Return to the homepage or explore the service catalog." visual="transformation" />
        <section className="not-found-section" aria-labelledby="not-found-title">
          <p className="eyebrow">Page not found</p>
          <h2 id="not-found-title">Choose a clearer direction.</h2>
          <div className="hero__actions">
            <a className="button button--primary" href="/" onClick={(event) => onNavigate?.(event, '/')}>Go home <span aria-hidden="true">↗</span></a>
            <a className="button button--outline" href="/service" onClick={(event) => onNavigate?.(event, '/service')}>View services</a>
          </div>
        </section>
      </main>
      <SiteFooter onNavigate={onNavigate} />
    </div>
  )
}
