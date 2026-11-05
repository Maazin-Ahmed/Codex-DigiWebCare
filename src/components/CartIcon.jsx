import { useEffect, useRef, useState } from 'react'
import { useCart } from '../cart/CartContext.jsx'

function CartIcon({ onNavigate }) {
  const { itemCount, notice } = useCart()
  const previousCount = useRef(itemCount)
  const [pulseSequence, setPulseSequence] = useState(0)
  const [highlighted, setHighlighted] = useState(false)

  useEffect(() => {
    if (itemCount > previousCount.current) {
      setPulseSequence((sequence) => sequence + 1)
      setHighlighted(true)
      const timeout = window.setTimeout(() => setHighlighted(false), 700)
      previousCount.current = itemCount
      return () => window.clearTimeout(timeout)
    }
    previousCount.current = itemCount
    return undefined
  }, [itemCount])

  return (
    <div className="cart-control">
      <a
        className={`cart-icon${highlighted ? ' cart-icon--highlighted' : ''}`}
        href="/cart"
        onClick={(event) => onNavigate?.(event, '/cart')}
        aria-label={`Shopping cart, ${itemCount} ${itemCount === 1 ? 'item' : 'items'}`}
      >
        <span aria-hidden="true">Cart</span>
        <span key={pulseSequence} className={`cart-icon__count${pulseSequence ? ' cart-icon__count--bump' : ''}`} aria-hidden="true">{itemCount}</span>
      </a>
      {notice && (
        <div className={`cart-notice${notice.dismissing ? ' cart-notice--leaving' : ''}`} role="status" aria-live="polite" aria-atomic="true">
          <span className="cart-notice__success" aria-hidden="true">✓</span>
          <span className="cart-notice__copy"><strong>Added to cart</strong><span>{notice.name}</span></span>
          <a href="/cart" onClick={(event) => onNavigate?.(event, '/cart')}>View Cart</a>
        </div>
      )}
    </div>
  )
}

export default CartIcon
