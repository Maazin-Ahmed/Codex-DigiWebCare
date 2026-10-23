import { brand } from '../content.js'

function BrandLogo({ className = '' }) {
  return (
    <span className={`brand-logo ${className}`.trim()} aria-label={brand.displayName}>
      <img
        src="/brand/digicare-web-logo.svg"
        alt="DigiCare Web"
        width="164"
        height="38"
        loading="eager"
        decoding="async"
      />
    </span>
  )
}

export default BrandLogo
