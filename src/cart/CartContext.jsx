import { createContext, useCallback, useContext, useEffect, useMemo, useReducer } from 'react'
import { readCart, writeCart } from './cartStorage.js'
import { summarizeCart } from './cartModel.js'
import { cartReducer, createCartState } from './cartReducer.js'

const CartContext = createContext(null)

export function CartProvider({ children }) {
  const [state, dispatch] = useReducer(cartReducer, undefined, () => createCartState(readCart()))
  const { items, notice } = state

  useEffect(() => writeCart(items), [items])

  useEffect(() => {
    if (!notice) return undefined
    const timeout = window.setTimeout(() => {
      dispatch({ type: notice.dismissing ? 'dismiss-notice' : 'begin-dismiss-notice', sequence: notice.sequence })
    }, notice.dismissing ? 220 : 2780)
    return () => window.clearTimeout(timeout)
  }, [notice])

  const addItem = useCallback((service, quantity = 1) => {
    dispatch({ type: 'add', service, quantity })
  }, [])

  const setQuantity = useCallback((id, quantity) => dispatch({ type: 'set-quantity', id, quantity }), [])

  const removeItem = useCallback((id) => dispatch({ type: 'remove', id }), [])

  const clearCart = useCallback(() => dispatch({ type: 'clear' }), [])

  const summary = summarizeCart(items)
  const value = useMemo(() => ({
    items,
    itemCount: summary.itemCount,
    subtotal: summary.subtotal,
    notice,
    addItem,
    setQuantity,
    removeItem,
    clearCart,
  }), [items, summary.itemCount, summary.subtotal, notice, addItem, setQuantity, removeItem, clearCart])

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>
}

export function useCart() {
  const context = useContext(CartContext)
  if (!context) throw new Error('useCart must be used inside CartProvider.')
  return context
}
