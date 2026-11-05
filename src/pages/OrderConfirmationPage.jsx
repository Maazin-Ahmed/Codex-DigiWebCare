import SiteHeader from '../components/SiteHeader.jsx'
import { SiteFooter } from '../components/BusinessSections.jsx'

const usd = (amount) => Number.isFinite(Number(amount))
  ? new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(Number(amount))
  : '—'

function OrderConfirmationPage({ confirmation, onNavigate }) {
  if (!confirmation) {
    return (
      <div className="site-shell site-shell--page">
        <SiteHeader currentPath="/order-confirmation" onNavigate={onNavigate} />
        <main className="page-content commerce-page"><section className="commerce-empty"><h1>Order confirmation unavailable</h1><p>Open this page after submitting a guest order.</p><a className="button button--primary" href="/service" onClick={(event) => onNavigate?.(event, '/service')}>Browse services <span aria-hidden="true">↗</span></a></section></main>
        <SiteFooter onNavigate={onNavigate} />
      </div>
    )
  }

  const { order, customer, billingAddress, items } = confirmation
  return (
    <div className="site-shell site-shell--page">
      <SiteHeader currentPath="/order-confirmation" onNavigate={onNavigate} />
      <main className="page-content commerce-page">
        <section className="commerce-heading">
          <p className="eyebrow">Order received / DigiCare Web</p>
          <h1>Order confirmation</h1>
          <p>Reference <strong>{order.order_number}</strong>. Payment is pending. This proforma confirmation is not proof of payment.</p>
        </section>
        <section className="confirmation-sheet" aria-label="Proforma order confirmation">
          <div className="confirmation-sheet__top"><h2>DigiCare Web</h2><button className="button button--outline" type="button" onClick={() => window.print()}>Print / save as PDF</button></div>
          <div className="confirmation-columns">
            <div><h3>Customer</h3><p>{customer.full_name}<br />{customer.email}<br />{customer.country_code} {customer.phone_number}</p></div>
            <div><h3>Billing address</h3><p>{billingAddress.address_line_1}{billingAddress.address_line_2 && <><br />{billingAddress.address_line_2}</>}<br />{billingAddress.city}, {billingAddress.state} {billingAddress.postal_code}<br />{billingAddress.country}</p></div>
          </div>
          <div className="confirmation-lines">
            {items.map((item) => <div key={item.id}><span>{item.name} × {item.quantity}</span><strong>{usd(item.lineTotal)}</strong></div>)}
          </div>
          <div className="confirmation-totals">
            <div><span>Subtotal</span><strong>{usd(order.subtotal)}</strong></div>
            <div><span>Tax</span><strong>{usd(order.tax_amount)}</strong></div>
            <div className="confirmation-totals__grand"><span>Total</span><strong>{usd(order.total_amount)}</strong></div>
            <div><span>Payment status</span><strong>Pending</strong></div>
          </div>
          <p className="confirmation-note">No payment was collected. This document is an order confirmation / proforma bill only.</p>
        </section>
      </main>
      <SiteFooter onNavigate={onNavigate} />
    </div>
  )
}

export default OrderConfirmationPage
