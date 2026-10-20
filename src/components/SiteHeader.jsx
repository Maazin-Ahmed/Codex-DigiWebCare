import { useEffect, useState } from 'react'
import { brand, navigation } from '../content.js'
import BrandLogo from './BrandLogo.jsx'

function SiteHeader({ currentPath = '/', onNavigate, overlay = false }) {
  const [menuOpen, setMenuOpen] = useState(false)

  useEffect(() => {
    const closeOnEscape = (event) => {
      if (event.key === 'Escape') setMenuOpen(false)
    }

    document.addEventListener('keydown', closeOnEscape)
    return () => document.removeEventListener('keydown', closeOnEscape)
  }, [])

  useEffect(() => {
    document.body.classList.toggle('menu-is-open', menuOpen)
    return () => document.body.classList.remove('menu-is-open')
  }, [menuOpen])

  const handleLink = (event, href) => {
    setMenuOpen(false)
    onNavigate?.(event, href)
  }

  return (
    <header className={`site-header${overlay ? ' site-header--overlay' : ' site-header--page'}${menuOpen ? ' site-header--open' : ''}`}>
      <a className="wordmark" href="/" onClick={(event) => handleLink(event, '/')} aria-label={`${brand.name} home`}>
        <BrandLogo />
      </a>

      <nav className="site-header__nav" aria-label="Primary navigation">
        {navigation.map((item) => (
          <a
            className={currentPath === item.href ? 'is-current' : ''}
            href={item.href}
            key={item.href}
            onClick={(event) => handleLink(event, item.href)}
            aria-current={currentPath === item.href ? 'page' : undefined}
          >
            {item.label}
          </a>
        ))}
      </nav>

      <div className="header-meta">
        <a href={`mailto:${brand.email}`}>Start a conversation</a>
      </div>

      <button
        className="menu-button"
        type="button"
        aria-label={menuOpen ? 'Close navigation' : 'Open navigation'}
        aria-expanded={menuOpen}
        aria-controls="primary-navigation"
        onClick={() => setMenuOpen((current) => !current)}
      >
        <span />
        <span />
      </button>

      <div className="site-header__mobile-nav" id="primary-navigation" aria-hidden={!menuOpen}>
        <p className="eyebrow">{brand.name}</p>
        {navigation.map((item) => (
          <a
            className={currentPath === item.href ? 'is-current' : ''}
            href={item.href}
            key={item.href}
            tabIndex={menuOpen ? 0 : -1}
            onClick={(event) => handleLink(event, item.href)}
            aria-current={currentPath === item.href ? 'page' : undefined}
          >
            {item.label}
          </a>
        ))}
        <a className="site-header__mobile-contact" href={`mailto:${brand.email}`}>{brand.email} ↗</a>
      </div>
    </header>
  )
}

export default SiteHeader
