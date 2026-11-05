import assert from 'node:assert/strict'
import test from 'node:test'
import { cartReducer, createCartState } from './cartReducer.js'
import { summarizeCart } from './cartModel.js'
import { readCart, writeCart } from './cartStorage.js'

const fixedService = (id, name, unitPrice = 125) => ({
  id,
  name,
  unitPrice,
  pricingType: 'fixed',
  quantityAllowed: true,
  maxQuantity: 5,
})

test('adding distinct items updates the live count and replaces the single notice', () => {
  let state = createCartState()
  state = cartReducer(state, { type: 'add', service: fixedService('one', 'First service') })
  assert.equal(summarizeCart(state.items).itemCount, 1)
  assert.equal(state.notice.name, 'First service')

  state = cartReducer(state, { type: 'add', service: fixedService('two', 'Second service') })
  assert.equal(summarizeCart(state.items).itemCount, 2)
  assert.equal(state.notice.name, 'Second service')
  assert.equal(state.notice.sequence, 2)
})

test('adding an existing item merges quantity and shows feedback only when quantity increases', () => {
  let state = createCartState()
  state = cartReducer(state, { type: 'add', service: fixedService('one', 'First service') })
  state = cartReducer(state, { type: 'add', service: fixedService('one', 'Updated name'), quantity: 2 })
  assert.equal(state.items[0].quantity, 3)
  assert.equal(summarizeCart(state.items).itemCount, 3)
  assert.equal(state.notice.name, 'Updated name')
  assert.equal(state.notice.sequence, 2)

  state = cartReducer(state, { type: 'add', service: { ...fixedService('one', 'Updated name'), maxQuantity: 3 } })
  assert.equal(state.items[0].quantity, 3)
  assert.equal(state.notice.sequence, 2)
})

test('manual quantity increases notify; decreases and removals do not create notices', () => {
  let state = cartReducer(createCartState(), { type: 'add', service: fixedService('one', 'First service') })
  const firstNoticeSequence = state.notice.sequence

  state = cartReducer(state, { type: 'set-quantity', id: 'one', quantity: 2 })
  assert.equal(state.notice.sequence, firstNoticeSequence + 1)
  assert.equal(state.items[0].quantity, 2)

  const increasedNoticeSequence = state.notice.sequence
  state = cartReducer(state, { type: 'set-quantity', id: 'one', quantity: 1 })
  assert.equal(state.notice.sequence, increasedNoticeSequence)
  state = cartReducer(state, { type: 'remove', id: 'one' })
  assert.equal(summarizeCart(state.items).itemCount, 0)
  assert.equal(state.notice.sequence, increasedNoticeSequence)
})

test('restored cart state starts with the correct count and no stale add notification', () => {
  const state = createCartState([{ ...fixedService('one', 'Saved service'), quantity: 2 }])
  assert.equal(summarizeCart(state.items).itemCount, 2)
  assert.equal(state.notice, null)
})

test('cart state survives storage write and restore after a simulated reload', () => {
  const previousWindow = globalThis.window
  const storage = new Map()
  globalThis.window = {
    localStorage: {
      getItem: (key) => storage.get(key) ?? null,
      setItem: (key, value) => storage.set(key, value),
    },
  }

  try {
    const original = createCartState()
    const withItem = cartReducer(original, { type: 'add', service: fixedService('one', 'Saved service') })
    writeCart(withItem.items)
    const restored = createCartState(readCart())
    assert.equal(restored.items[0].id, 'one')
    assert.equal(restored.items[0].quantity, 1)
    assert.equal(summarizeCart(restored.items).itemCount, 1)
    assert.equal(restored.notice, null)
  } finally {
    if (previousWindow === undefined) delete globalThis.window
    else globalThis.window = previousWindow
  }
})

test('only the matching notice timer can dismiss a repeated-add notification', () => {
  let state = cartReducer(createCartState(), { type: 'add', service: fixedService('one', 'First service') })
  state = cartReducer(state, { type: 'add', service: fixedService('two', 'Second service') })
  const currentSequence = state.notice.sequence
  state = cartReducer(state, { type: 'dismiss-notice', sequence: currentSequence - 1 })
  assert.equal(state.notice.name, 'Second service')
  state = cartReducer(state, { type: 'dismiss-notice', sequence: currentSequence })
  assert.equal(state.notice, null)
})
