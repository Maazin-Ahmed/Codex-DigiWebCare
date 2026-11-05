import { addCartItem, normalizeCart, removeCartItem, setCartItemQuantity } from './cartModel.js'

function withNotice(state, items, id) {
  const product = items.find((item) => item.id === String(id))
  const sequence = state.sequence + 1
  return {
    ...state,
    items,
    sequence,
    notice: product ? { id: product.id, name: product.name, sequence, dismissing: false } : state.notice,
  }
}

export function createCartState(items = []) {
  return { items: normalizeCart(items), sequence: 0, notice: null }
}

export function cartReducer(state, action) {
  if (action.type === 'add') {
    const previous = state.items.find((item) => item.id === String(action.service.id))
    const items = addCartItem(state.items, action.service, action.quantity)
    const updated = items.find((item) => item.id === String(action.service.id))
    if (!updated || updated.quantity <= (previous?.quantity ?? 0)) return { ...state, items }
    return withNotice(state, items, updated.id)
  }

  if (action.type === 'set-quantity') {
    const previous = state.items.find((item) => item.id === String(action.id))
    const items = setCartItemQuantity(state.items, action.id, action.quantity)
    const updated = items.find((item) => item.id === String(action.id))
    if (!previous || !updated || updated.quantity <= previous.quantity) return { ...state, items }
    return withNotice(state, items, updated.id)
  }

  if (action.type === 'remove') return { ...state, items: removeCartItem(state.items, action.id) }
  if (action.type === 'clear') return { ...state, items: [] }
  if (action.type === 'begin-dismiss-notice' && state.notice?.sequence === action.sequence) {
    return { ...state, notice: { ...state.notice, dismissing: true } }
  }
  if (action.type === 'dismiss-notice' && state.notice?.sequence === action.sequence) return { ...state, notice: null }
  return state
}

