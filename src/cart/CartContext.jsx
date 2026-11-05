import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react'
import { readCart, writeCart } from './cartStorage.js'
import { addCartItem, removeCartItem, setCartItemQuantity, summarizeCart } from './cartModel.js'

const CartContext = createContext(null)

export function CartProvider({ children }) {
  const [items, setItems] = useState(readCart)

  useEffect(() => writeCart(items), [items])

  const addItem = useCallback((service, quantity = 1) => {
    setItems((current) => addCartItem(current, service, quantity))
  }, [])

  const setQuantity = useCallback((id, quantity) => setItems((current) => setCartItemQuantity(current, id, quantity)), [])

  const removeItem = useCallback((id) => setItems((current) => removeCartItem(current, id)), [])

  const clearCart = useCallback(() => setItems([]), [])

  const summary = summarizeCart(items)
  const value = useMemo(() => ({
    items,
    itemCount: summary.itemCount,
    subtotal: summary.subtotal,
    addItem,
    setQuantity,
    removeItem,
    clearCart,
  }), [items, summary.itemCount, summary.subtotal, addItem, setQuantity, removeItem, clearCart])

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>
}

export function useCart() {
  const context = useContext(CartContext)
  if (!context) throw new Error('useCart must be used inside CartProvider.')
  return context
}
