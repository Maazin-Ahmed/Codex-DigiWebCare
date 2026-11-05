import { brand } from '../content.js'
import { isSupportedCurrency } from './pricing.js'

export function buildServiceEnquiryMailto(serviceName) {
  const subject = `Service Enquiry - ${serviceName}`
  const body = `Hello,\n\nI was inquiring about ${serviceName}. Could you please share more details about the pricing, scope of work, and next steps?\n\nThank you.`
  return `mailto:${brand.email}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`
}

export function buildConsultationMailto(serviceName) {
  const subject = encodeURIComponent(`${serviceName} enquiry`)
  const body = encodeURIComponent(`Hello DigiCare Web,\n\nI would like to discuss ${serviceName}.\n\n`)
  return `mailto:${brand.email}?subject=${subject}&body=${body}`
}

export function serviceActionLabel(service) {
  if (service.pricing_type === 'fixed') return 'Add to Cart'
  if (service.pricing_type === 'range' || service.pricing_type === 'custom_quote') return 'Enquire About This Service'
  if (service.pricing_type === 'consultation') return service.cta || 'Book a consultation'
  return 'Explore service'
}

export function isCartServiceEligible(item, services) {
  const service = services.find((candidate) => String(candidate.id) === String(item.id))
  return Boolean(
    service
    && service.is_active
    && isFixedPriceService(service)
    && item.available === true
    && item.priceVerified === true
    && Number(item.unitPrice) === Number(service.price)
    && item.currency === service.currency,
  )
}

export function isFixedPriceService(service) {
  return Boolean(
    service?.pricing_type === 'fixed'
    && service.price !== null
    && service.price !== undefined
    && Number.isFinite(Number(service.price))
    && isSupportedCurrency(service.currency),
  )
}

export function buildServiceCartItem(service) {
  if (service?.is_active !== true || !isFixedPriceService(service)) {
    throw new Error('Only fixed-price services with a database price can be added to the cart.')
  }
  return {
    id: service.id,
    name: service.name,
    unitPrice: Number(service.price),
    currency: service.currency,
    quantityAllowed: service.quantity_allowed,
    maxQuantity: service.max_quantity,
    pricingType: service.pricing_type,
  }
}
