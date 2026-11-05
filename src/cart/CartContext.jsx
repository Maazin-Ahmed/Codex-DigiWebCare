import { createContext, useCallback, useContext, useEffect, useMemo, useReducer } from 'react'
import { readCart, writeCart } from './cartStorage.js'
import { summarizeCart } from './cartModel.js'
import { cartReducer, createCartState } from './cartReducer.js'
import { useCatalog } from '../services/CatalogContext.jsx'
import { buildServiceCartItem } from '../services/serviceContact.js'

const CartContext = createContext(null)

export function CartProvider({ children }) {
  const { services, loading: catalogLoading, error: catalogError } = useCatalog()
  const [state, dispatch] = useReducer(cartReducer, undefined, () => createCartState(readCart()))
  const { items, notice } = state

  useEffect(() => writeCart(items), [items])

  useEffect(() => {
    if (!catalogLoading && !catalogError) dispatch({ type: 'reconcile-catalog', services })
  }, [services, catalogLoading, catalogError])

  useEffect(() => {
    if (!notice) return undefined
    const timeout = window.setTimeout(() => {
      dispatch({ type: notice.dismissing ? 'dismiss-notice' : 'begin-dismiss-notice', sequence: notice.sequence })
    }, notice.dismissing ? 220 : 2780)
    return () => window.clearTimeout(timeout)
  }, [notice])

  const addItem = useCallback((service, quantity = 1) => {
    if (catalogLoading || catalogError) throw new Error('Service pricing must be verified before adding it to the cart.')
    const currentService = services.find((item) => String(item.id) === String(service?.id) && item.is_active === true)
    if (!currentService) throw new Error('This service is no longer available in the active catalogue.')
    dispatch({ type: 'add', service: buildServiceCartItem(currentService), quantity })
  }, [services, catalogLoading, catalogError])

  const setQuantity = useCallback((id, quantity) => dispatch({ type: 'set-quantity', id, quantity }), [])

  const removeItem = useCallback((id) => dispatch({ type: 'remove', id }), [])

  const clearCart = useCallback(() => dispatch({ type: 'clear' }), [])

  const summary = summarizeCart(items)
  const pricesVerified = !catalogLoading && !catalogError && items.every((item) => item.available && item.priceVerified)
  const value = useMemo(() => ({
    items,
    itemCount: summary.itemCount,
    subtotal: summary.subtotal,
    currency: summary.currency,
    currencyConsistent: summary.currencyConsistent,
    pricesVerified,
    catalogLoading,
    catalogError,
    notice,
    addItem,
    setQuantity,
    removeItem,
    clearCart,
  }), [items, summary.itemCount, summary.subtotal, summary.currency, summary.currencyConsistent, pricesVerified, catalogLoading, catalogError, notice, addItem, setQuantity, removeItem, clearCart])

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>
}

export function useCart() {
  const context = useContext(CartContext)
  if (!context) throw new Error('useCart must be used inside CartProvider.')
  return context
}
