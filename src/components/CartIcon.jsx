import { useCart } from '../cart/CartContext.jsx'

function CartIcon({ onNavigate }) {
  const { itemCount } = useCart()
  return (
    <a
      className="cart-icon"
      href="/cart"
      onClick={(event) => onNavigate?.(event, '/cart')}
      aria-label={`Shopping cart, ${itemCount} ${itemCount === 1 ? 'item' : 'items'}`}
    >
      <span aria-hidden="true">Cart</span>
      <span className="cart-icon__count" aria-live="polite">{itemCount}</span>
    </a>
  )
}

export default CartIcon
