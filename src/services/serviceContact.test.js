import test from 'node:test'
import assert from 'node:assert/strict'
import { brand } from '../content.js'
import { buildServiceEnquiryMailto, buildServiceCartItem, isCartServiceEligible, isFixedPriceService, serviceActionLabel } from './serviceContact.js'
import { mapServiceRecord } from './serviceCatalogModel.js'

test('range/custom quote enquiry uses encoded service-specific subject and body', () => {
  const serviceName = 'Web & Software / Development'
  const href = buildServiceEnquiryMailto(serviceName)
  const parsed = new URL(href)
  assert.equal(parsed.protocol, 'mailto:')
  assert.equal(parsed.pathname, brand.email)
  assert.equal(parsed.searchParams.get('subject'), `Service Enquiry - ${serviceName}`)
  assert.equal(parsed.searchParams.get('body'), `Hello,\n\nI was inquiring about ${serviceName}. Could you please share more details about the pricing, scope of work, and next steps?\n\nThank you.`)
})

test('service action label follows the database pricing type', () => {
  assert.equal(serviceActionLabel({ pricing_type: 'fixed' }), 'Add to Cart')
  assert.equal(serviceActionLabel({ pricing_type: 'range' }), 'Enquire About This Service')
  assert.equal(serviceActionLabel({ pricing_type: 'custom_quote' }), 'Enquire About This Service')
  assert.equal(serviceActionLabel({ pricing_type: 'consultation', cta: 'Book a consultation' }), 'Book a consultation')
})

test('only fixed-price database services can be represented as cart items', () => {
  assert.throws(() => buildServiceCartItem({ id: 'range', name: 'Range service', pricing_type: 'range', price: null }))
  assert.throws(() => buildServiceCartItem({ id: 'quote', name: 'Quote service', pricing_type: 'custom_quote', price: null }))
  assert.throws(() => buildServiceCartItem({ id: 'inactive', name: 'Inactive service', pricing_type: 'fixed', price: 20, currency: 'USD', is_active: false }))
  const eligible = { id: 'fixed', name: 'Fixed service', pricing_type: 'fixed', price: 20, currency: 'USD', is_active: true, quantity_allowed: false, max_quantity: 1 }
  assert.deepEqual(buildServiceCartItem(eligible), {
    id: 'fixed', name: 'Fixed service', unitPrice: 20, currency: 'USD', quantityAllowed: false, maxQuantity: 1, pricingType: 'fixed',
  })
  assert.equal(isCartServiceEligible({ id: 'fixed', unitPrice: 20, currency: 'USD', available: true, priceVerified: true }, [eligible]), true)
  assert.equal(isCartServiceEligible({ id: 'fixed', unitPrice: 999, currency: 'USD', available: true, priceVerified: true }, [eligible]), false)
  assert.equal(isCartServiceEligible({ id: 'range' }, [{ id: 'range', pricing_type: 'range', is_active: true }]), false)
  assert.equal(isCartServiceEligible({ id: 'quote' }, [{ id: 'quote', pricing_type: 'custom_quote', is_active: true }]), false)
})

test('catalogue mapping retains the numeric DB price separately from its display label', () => {
  const service = mapServiceRecord({
    id: 'f4f196d6-fb6d-4c82-aded-7123b91b6e49',
    slug: 'amazon-store-management-services',
    name: 'Amazon Store Management Services',
    pricing_type: 'fixed',
    price: 2500,
    price_label: '$2,500',
    currency: 'USD',
    is_active: true,
    quantity_allowed: false,
    max_quantity: 1,
    short_description: 'Amazon store management.',
  })
  assert.equal(service.price, 2500)
  assert.equal(service.price_label, '$2,500')
  assert.equal(isFixedPriceService(service), true)
  assert.equal(buildServiceCartItem(service).unitPrice, 2500)
})
