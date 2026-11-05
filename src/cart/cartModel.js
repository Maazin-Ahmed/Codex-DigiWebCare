import { isFixedPriceService } from '../services/serviceContact.js'

export function normalizeCart(items) {
  if (!Array.isArray(items)) return []
  return items.reduce((normalized, item) => {
    if (!item || (typeof item.id !== 'string' && typeof item.id !== 'number') || !String(item.id)) return normalized
    if (typeof item.name !== 'string' || !Number.isFinite(Number(item.unitPrice)) || Number(item.unitPrice) < 0) return normalized
    const quantityAllowed = item.quantityAllowed === true
    const configuredMax = Number(item.maxQuantity)
    const maxQuantity = Number.isInteger(configuredMax) && configuredMax > 0 ? configuredMax : (quantityAllowed ? null : 1)
    const quantity = Math.min(Math.floor(Number(item.quantity)), maxQuantity ?? Number.MAX_SAFE_INTEGER)
    if (!Number.isInteger(quantity) || quantity < 1) return normalized
    const id = String(item.id)
    const existing = normalized.find((entry) => entry.id === id)
    if (existing) existing.quantity = Math.min(existing.quantity + quantity, maxQuantity ?? Number.MAX_SAFE_INTEGER)
    else normalized.push({ id, name: item.name, unitPrice: Number(item.unitPrice), quantity, quantityAllowed, maxQuantity })
    return normalized
  }, [])
}

export function addCartItem(items, service, quantity = 1) {
  if (!service || !isFixedPriceService({ pricing_type: service.pricingType, price: service.unitPrice }) || service.id == null || !service.name || Number(service.unitPrice) < 0) {
    throw new Error('Only fixed-price services with a service ID, name, and numeric database price can be added.')
  }
  const addition = Math.max(1, Math.floor(Number(quantity) || 1))
  const next = normalizeCart(items)
  const id = String(service.id)
  const quantityAllowed = service.quantityAllowed === true
  const configuredMax = Number(service.maxQuantity)
  const maxQuantity = Number.isInteger(configuredMax) && configuredMax > 0 ? configuredMax : (quantityAllowed ? null : 1)
  const safeAddition = Math.min(addition, maxQuantity ?? Number.MAX_SAFE_INTEGER)
  const existing = next.find((item) => item.id === id)
  if (existing) {
    existing.name = service.name
    existing.unitPrice = Number(service.unitPrice)
    existing.quantityAllowed = quantityAllowed
    existing.maxQuantity = maxQuantity
    existing.quantity = Math.min(existing.quantity + safeAddition, maxQuantity ?? Number.MAX_SAFE_INTEGER)
    return next
  }
  return [...next, { id, name: service.name, unitPrice: Number(service.unitPrice), quantity: safeAddition, quantityAllowed, maxQuantity }]
}

export function setCartItemQuantity(items, id, quantity) {
  const nextQuantity = Math.floor(Number(quantity))
  if (nextQuantity < 1) return normalizeCart(items)
  return normalizeCart(items).map((item) => item.id === String(id)
    ? { ...item, quantity: Math.min(nextQuantity, item.maxQuantity ?? Number.MAX_SAFE_INTEGER) }
    : item)
}

export function removeCartItem(items, id) {
  return normalizeCart(items).filter((item) => item.id !== String(id))
}

export function summarizeCart(items) {
  const normalized = normalizeCart(items)
  return {
    itemCount: normalized.reduce((total, item) => total + item.quantity, 0),
    subtotal: Math.round(normalized.reduce((total, item) => total + item.unitPrice * item.quantity, 0) * 100) / 100,
  }
}

