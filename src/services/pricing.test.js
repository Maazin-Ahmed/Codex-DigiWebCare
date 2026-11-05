import assert from 'node:assert/strict'
import test from 'node:test'
import { buildServiceCartItem, isCartServiceEligible } from './serviceContact.js'
import { formatCurrency, formatServicePrice } from './pricing.js'
import { mapServiceRecord } from './serviceCatalogModel.js'
import { reconcileCartItems, summarizeCart } from '../cart/cartModel.js'
import { readCart } from '../cart/cartStorage.js'

const liveFixedServices = [
  { id: '5415abc6-7bee-40d7-a34a-d19f7e7b7872', name: 'LMS/CMS Development Services', slug: 'lms-cms-development-services', price: 10000, price_label: '$3,000', currency: 'USD', pricing_type: 'fixed', is_active: true, quantity_allowed: false, max_quantity: 1 },
  { id: '5f4486e5-2894-4982-9e81-230cb930e77f', name: 'Web Development Solutions', slug: 'web-development-solutions', price: 750, price_label: '$750', currency: 'USD', pricing_type: 'fixed', is_active: true, quantity_allowed: false, max_quantity: 1 },
  { id: 'f24c341b-754e-4100-8881-4899554a7c1e', name: 'Content Development Services', slug: 'content-development-services', price: 800, price_label: '$800', currency: 'USD', pricing_type: 'fixed', is_active: true, quantity_allowed: false, max_quantity: 1 },
  { id: 'f4f196d6-fb6d-4c82-aded-7123b91b6e49', name: 'Amazon Store Management Services', slug: 'amazon-store-management-services', price: 2500, price_label: '$2,500', currency: 'USD', pricing_type: 'fixed', is_active: true, quantity_allowed: false, max_quantity: 1 },
  { id: 'b8e18d9c-de6b-4993-9d64-ea5dcd08698f', name: 'Amazon Brand Registry Services', slug: 'amazon-brand-registry-services', price: 2500, price_label: '$2,500', currency: 'USD', pricing_type: 'fixed', is_active: true, quantity_allowed: false, max_quantity: 1 },
]

test('all live active fixed-price records display the numeric catalogue price used by cart', () => {
  for (const row of liveFixedServices) {
    const service = mapServiceRecord(row)
    const cartItem = buildServiceCartItem(service)
    assert.equal(formatServicePrice(service), formatCurrency(row.price, row.currency), row.slug)
    assert.equal(cartItem.id, row.id, row.slug)
    assert.equal(cartItem.unitPrice, row.price, row.slug)
    assert.equal(cartItem.currency, row.currency, row.slug)
  }
})

test('LMS/CMS stale display label cannot override the live numeric price in page, cart or subtotal', () => {
  const row = liveFixedServices[0]
  const service = mapServiceRecord(row)
  const savedLine = {
    id: row.id,
    name: row.name,
    unitPrice: 3000,
    currency: 'USD',
    quantity: 1,
    quantityAllowed: false,
    maxQuantity: 1,
  }
  const [reconciled] = reconcileCartItems([savedLine], [service])

  assert.equal(row.price_label, '$3,000')
  assert.equal(formatServicePrice(service), '$3,000')
  assert.equal(reconciled.unitPrice, 10000)
  assert.equal(reconciled.priceVerified, true)
  assert.equal(summarizeCart([reconciled]).subtotal, 10000)
})

test('reconciliation recalculates multiple service lines and enforces current quantity limits', () => {
  const records = liveFixedServices.slice(1, 4).map(mapServiceRecord)
  const saved = records.map((service) => ({
    id: service.id,
    name: service.name,
    unitPrice: 1,
    currency: 'USD',
    quantity: 1,
    quantityAllowed: true,
    maxQuantity: 5,
  }))
  saved[0].quantity = 2
  const reconciled = reconcileCartItems(saved, records)
  assert.deepEqual(reconciled.map((item) => item.unitPrice), [750, 800, 2500])
  assert.equal(reconciled[0].quantity, 1)
  assert.equal(summarizeCart(reconciled).subtotal, 4050)
})

test('unavailable catalogue records remain in cart but have no verified price', () => {
  const saved = [{ id: 'former-service', name: 'Saved service', unitPrice: 45, currency: 'USD', quantity: 2, quantityAllowed: true, maxQuantity: 4 }]
  const [line] = reconcileCartItems(saved, [])
  assert.equal(line.id, 'former-service')
  assert.equal(line.quantity, 2)
  assert.equal(line.available, false)
  assert.equal(line.priceVerified, false)
  assert.match(line.unavailableReason, /no longer available/)
  assert.equal(isCartServiceEligible(line, []), false)
})

test('stale localStorage price is untrusted on load and refreshed from the active catalogue', () => {
  const previousWindow = globalThis.window
  let saved = JSON.stringify([{
    id: liveFixedServices[0].id,
    name: liveFixedServices[0].name,
    unitPrice: 3000,
    currency: 'USD',
    quantity: 1,
    quantityAllowed: false,
    maxQuantity: 1,
    priceVerified: true,
    available: true,
  }])
  globalThis.window = { localStorage: {
    getItem: () => saved,
    setItem: (_key, value) => { saved = value },
  } }

  try {
    const [loaded] = readCart()
    assert.equal(loaded.unitPrice, 3000)
    assert.equal(loaded.priceVerified, false)
    const [refreshed] = reconcileCartItems([loaded], [mapServiceRecord(liveFixedServices[0])])
    assert.equal(refreshed.unitPrice, 10000)
    assert.equal(refreshed.priceVerified, true)
  } finally {
    if (previousWindow === undefined) delete globalThis.window
    else globalThis.window = previousWindow
  }
})

test('reconciliation preserves quantity that is valid under the current catalogue limits', () => {
  const currentService = {
    id: 'quantity-service', name: 'Quantity service', price: 15, currency: 'USD',
    pricing_type: 'fixed', is_active: true, quantity_allowed: true, max_quantity: 5,
  }
  const [line] = reconcileCartItems([{
    id: currentService.id, name: currentService.name, unitPrice: 15, currency: 'USD',
    quantity: 3, quantityAllowed: false, maxQuantity: 1,
  }], [currentService])
  assert.equal(line.quantity, 3)
  assert.equal(line.maxQuantity, 5)
})

test('currency formatting is shared and does not apply conversion', () => {
  assert.equal(formatCurrency(10000, 'USD'), '$3,000')
  assert.equal(formatCurrency(34.55, 'USD'), '$34.55')
  assert.equal(formatCurrency(100, 'unknown'), 'Price unavailable')
})
