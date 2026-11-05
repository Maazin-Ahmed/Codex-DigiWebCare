import test from 'node:test'
import assert from 'node:assert/strict'
import { addCartItem, normalizeCart, removeCartItem, setCartItemQuantity, summarizeCart } from './cartModel.js'
import { readCart, writeCart } from './cartStorage.js'

test('cart adds by service ID and merges duplicates into one line', () => {
  const service = { id: 'svc-1', name: 'Web build', unitPrice: 25, currency: 'USD', pricingType: 'fixed', quantityAllowed: true, maxQuantity: 5 }
  const once = addCartItem([], service, 1)
  const twice = addCartItem(once, service, 2)
  assert.equal(twice.length, 1)
  assert.equal(twice[0].quantity, 3)
})

test('cart updates/removes quantities and calculates a rounded subtotal', () => {
  const items = normalizeCart([
    { id: 1, name: 'A', unitPrice: 10.1, currency: 'USD', quantity: 2, quantityAllowed: true, maxQuantity: 5 },
    { id: 2, name: 'B', unitPrice: 4.25, currency: 'USD', quantity: 1, quantityAllowed: true, maxQuantity: 5 },
  ])
  const changed = setCartItemQuantity(items, 1, 3)
  assert.equal(summarizeCart(changed).itemCount, 4)
  assert.equal(summarizeCart(changed).subtotal, 34.55)
  assert.equal(summarizeCart(changed).currencyConsistent, true)
  assert.equal(removeCartItem(changed, 2)[0].quantity, 3)
})

test('local cart restores valid snapshots and merges duplicate persisted IDs', () => {
  const backing = new Map()
  globalThis.window = { localStorage: {
    getItem: (key) => backing.get(key) ?? null,
    setItem: (key, value) => backing.set(key, value),
  } }
  writeCart([
    { id: 'svc-1', name: 'Web build', unitPrice: 25, currency: 'USD', quantity: 1, quantityAllowed: true, maxQuantity: 5, priceVerified: true, available: true },
    { id: 'svc-1', name: 'Web build', unitPrice: 25, currency: 'USD', quantity: 2, quantityAllowed: true, maxQuantity: 5 },
    { id: 'bad', name: 'Invalid', unitPrice: 'custom', quantity: 1 },
  ])
  assert.equal(readCart().length, 1)
  assert.equal(readCart()[0].quantity, 3)
  assert.equal(readCart()[0].priceVerified, false)
  assert.equal(readCart()[0].available, false)
  delete globalThis.window
})

test('quantity respects the service configuration', () => {
  const once = addCartItem([], { id: 'single', name: 'Fixed service', unitPrice: 100, currency: 'USD', pricingType: 'fixed', quantityAllowed: false, maxQuantity: 1 }, 4)
  const unchanged = setCartItemQuantity(once, 'single', 5)
  assert.equal(unchanged[0].quantity, 1)
  assert.equal(unchanged[0].quantityAllowed, false)
})
