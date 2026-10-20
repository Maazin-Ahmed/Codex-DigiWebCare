import { brand } from '../content.js'

function BrandLogo() {
  return (
    <span className="brand-logo" aria-label={brand.displayName}>
      <img src="/brand/digiweb-care-logo.webp" alt="DigiWeb" />
      <span className="brand-logo__care">Care</span>
    </span>
  )
}

export default BrandLogo
