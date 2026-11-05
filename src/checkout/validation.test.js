import test from 'node:test'
import assert from 'node:assert/strict'
import { validateGuestCheckout } from './validation.js'

const validGuest = {
  full_name: 'Casey Client', email: 'casey@example.com', country_code: '+1', phone_number: '5550100',
  address_line_1: '10 Main Street', address_line_2: '', city: 'Davie', state: 'Florida', postal_code: '', country: 'United States',
}

test('guest checkout accepts required contact and billing fields', () => {
  assert.deepEqual(validateGuestCheckout(validGuest), {})
})

test('guest checkout rejects missing required fields and malformed email', () => {
  const errors = validateGuestCheckout({ ...validGuest, full_name: '', email: 'invalid', phone_number: '', address_line_1: '' })
  assert.ok(errors.full_name)
  assert.ok(errors.email)
  assert.ok(errors.phone_number)
  assert.ok(errors.address_line_1)
})
