import assert from 'node:assert/strict'
import test from 'node:test'
import { buildGuestOrderPayload } from './orderPayload.js'

test('guest checkout sends only service IDs and quantities, never browser prices or totals', () => {
  const payload = buildGuestOrderPayload({
    full_name: '  Client Name ',
    email: 'client@example.com',
    country_code: '+1',
    phone_number: '5550100',
    address_line_1: '1 Main St',
    address_line_2: '',
    city: 'Miami',
    state: 'Florida',
    postal_code: '',
    country: 'USA',
  }, [
    { id: 'service-id', quantity: 1, unitPrice: 0.01, lineTotal: 0.01 },
  ])

  assert.deepEqual(payload.items, [{ service_id: 'service-id', quantity: 1 }])
  assert.equal('unitPrice' in payload.items[0], false)
  assert.equal('price' in payload.items[0], false)
  assert.equal('subtotal' in payload, false)
})
