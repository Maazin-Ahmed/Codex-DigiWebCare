import SiteHeader from '../components/SiteHeader.jsx'
import { SiteFooter } from '../components/BusinessSections.jsx'
import { useCart } from '../cart/CartContext.jsx'

const usd = (amount) => new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(amount)

function CartPage({ onNavigate }) {
  const { items, itemCount, subtotal, setQuantity, removeItem, clearCart } = useCart()

  const confirmClear = () => {
    if (window.confirm('Clear all services from your cart?')) clearCart()
  }

  return (
    <div className="site-shell site-shell--page">
      <SiteHeader currentPath="/cart" onNavigate={onNavigate} />
      <main className="page-content commerce-page">
        <section className="commerce-heading">
          <p className="eyebrow">Your order / DigiCare Web</p>
          <h1>Your cart</h1>
          <p>{itemCount ? `${itemCount} ${itemCount === 1 ? 'service' : 'services'} selected` : 'Review the services you have selected.'}</p>
        </section>

        {!items.length ? (
          <section className="commerce-empty" aria-live="polite">
            <h2>Your cart is empty.</h2>
            <p>Explore the service catalogue to choose a service.</p>
            <a className="button button--primary" href="/service" onClick={(event) => onNavigate?.(event, '/service')}>Continue shopping <span aria-hidden="true">↗</span></a>
          </section>
        ) : (
          <div className="cart-layout">
            <section className="cart-lines" aria-label="Cart services">
              {items.map((item) => (
                <article className="cart-line" key={item.id}>
                  <div className="cart-line__info">
                    <h2>{item.name}</h2>
                    <p>{usd(item.unitPrice)} <span>per service</span></p>
                  </div>
                  <div className="cart-line__quantity" aria-label={`Quantity for ${item.name}`}>
                    <button type="button" onClick={() => setQuantity(item.id, item.quantity - 1)} aria-label={`Decrease ${item.name} quantity`} disabled={item.quantity <= 1}>−</button>
                    <span aria-live="polite">{item.quantity}</span>
                    <button type="button" onClick={() => setQuantity(item.id, item.quantity + 1)} aria-label={`Increase ${item.name} quantity`} disabled={!item.quantityAllowed || (item.maxQuantity != null && item.quantity >= item.maxQuantity)}>+</button>
                  </div>
                  <strong className="cart-line__total">{usd(item.unitPrice * item.quantity)}</strong>
                  <button className="cart-line__remove" type="button" onClick={() => removeItem(item.id)}>Remove</button>
                </article>
              ))}
              <div className="cart-actions">
                <a href="/service" onClick={(event) => onNavigate?.(event, '/service')}>Continue shopping</a>
                <button type="button" onClick={confirmClear}>Clear cart</button>
              </div>
            </section>

            <aside className="cart-summary" aria-label="Cart summary">
              <p className="eyebrow">Summary</p>
              <div><span>Subtotal</span><strong>{usd(subtotal)}</strong></div>
              <p>Final order totals are confirmed by the server at checkout.</p>
              <a className="button button--primary" href="/checkout" onClick={(event) => onNavigate?.(event, '/checkout')}>Proceed to checkout <span aria-hidden="true">↗</span></a>
            </aside>
          </div>
        )}
      </main>
      <SiteFooter onNavigate={onNavigate} />
    </div>
  )
}

export default CartPage
