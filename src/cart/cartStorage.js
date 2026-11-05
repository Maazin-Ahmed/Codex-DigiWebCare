import { normalizeCart } from './cartModel.js'

const CART_STORAGE_KEY = 'digicare-web-cart-v1'

export function readCart() {
  if (typeof window === 'undefined') return []

  try {
    const saved = window.localStorage.getItem(CART_STORAGE_KEY)
    const parsed = saved ? JSON.parse(saved) : []
    return normalizeCart(parsed, { applyQuantityLimits: false }).map((item) => ({
      ...item,
      available: false,
      priceVerified: false,
      unavailableReason: null,
    }))
  } catch {
    return []
  }
}

export function writeCart(items) {
  if (typeof window === 'undefined') return
  try {
    window.localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(items))
  } catch {
    // Storage can be disabled or full; the in-memory cart remains usable.
  }
}
