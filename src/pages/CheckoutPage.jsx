import { useRef, useState } from 'react'
import SiteHeader from '../components/SiteHeader.jsx'
import { SiteFooter } from '../components/BusinessSections.jsx'
import { useCart } from '../cart/CartContext.jsx'
import { supabase } from '../supabaseClient.js'
import { validateGuestCheckout } from '../checkout/validation.js'
import { useCatalog } from '../services/CatalogContext.jsx'
import { isCartServiceEligible } from '../services/serviceContact.js'

const initialForm = {
  full_name: '', email: '', country_code: '', phone_number: '',
  address_line_1: '', address_line_2: '', city: '', state: '', postal_code: '', country: '',
}

const usd = (amount) => new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(amount)

function CheckoutPage({ onNavigate, onOrderCreated }) {
  const { items, subtotal } = useCart()
  const { services, loading: catalogLoading, error: catalogError, retry: retryCatalog } = useCatalog()
  const [form, setForm] = useState(initialForm)
  const [errors, setErrors] = useState({})
  const [requestError, setRequestError] = useState('')
  const [submitting, setSubmitting] = useState(false)
  const submittingRef = useRef(false)

  const update = (event) => {
    const { name, value } = event.target
    setForm((current) => ({ ...current, [name]: value }))
    setErrors((current) => ({ ...current, [name]: '' }))
    setRequestError('')
  }

  const submit = async (event) => {
    event.preventDefault()
    if (submittingRef.current) return
    const nextErrors = validateGuestCheckout(form)
    if (!items.length) {
      setRequestError('Your cart is empty. Add a service before checkout.')
      return
    }
    if (Object.keys(nextErrors).length) {
      setErrors(nextErrors)
      setRequestError('Please review the highlighted fields.')
      return
    }

    submittingRef.current = true
    setSubmitting(true)
    setRequestError('')
    try {
      const { data, error } = await supabase.functions.invoke('create-guest-order', {
        body: {
          customer: {
            full_name: form.full_name.trim(),
            email: form.email.trim(),
            country_code: form.country_code.trim(),
            phone_number: form.phone_number.trim(),
          },
          billing_address: {
            address_line_1: form.address_line_1.trim(),
            address_line_2: form.address_line_2.trim() || null,
            city: form.city.trim(),
            state: form.state.trim(),
            postal_code: form.postal_code.trim() || null,
            country: form.country.trim(),
          },
          items: items.map(({ id, quantity }) => ({ service_id: id, quantity })),
        },
      })
      if (error) throw error
      const order = data?.order ?? data
      const serverItems = order?.items
      const hasServerTotals = ['subtotal', 'tax_amount', 'total_amount'].every((field) => (
        order?.[field] !== null
        && order?.[field] !== undefined
        && Number.isFinite(Number(order[field]))
      ))
      if (!order?.order_number || !hasServerTotals || order.payment_status !== 'pending' || !Array.isArray(serverItems)) {
        throw new Error('The order service returned incomplete confirmation details.')
      }
      const confirmationItems = serverItems.map((item, index) => ({
        id: String(item.service_id ?? item.id ?? index),
        name: item.service_name_snapshot,
        unitPrice: Number(item.unit_price),
        quantity: Number(item.quantity),
        lineTotal: Number(item.line_total),
      }))
      if (confirmationItems.some((item) => !item.name || !Number.isFinite(item.unitPrice) || !Number.isInteger(item.quantity) || !Number.isFinite(item.lineTotal))) {
        throw new Error('The order service returned incomplete item details.')
      }

      const confirmation = {
        order,
        customer: { full_name: form.full_name.trim(), email: form.email.trim(), country_code: form.country_code.trim(), phone_number: form.phone_number.trim() },
        billingAddress: {
          address_line_1: form.address_line_1.trim(), address_line_2: form.address_line_2.trim(),
          city: form.city.trim(), state: form.state.trim(), postal_code: form.postal_code.trim(), country: form.country.trim(),
        },
        items: confirmationItems,
      }
      onOrderCreated(confirmation)
    } catch {
      setRequestError('We could not create the order. Please try again.')
    } finally {
      submittingRef.current = false
      setSubmitting(false)
    }
  }

  return (
    <div className="site-shell site-shell--page">
      <SiteHeader currentPath="/checkout" onNavigate={onNavigate} />
      <main className="page-content commerce-page">
        <section className="commerce-heading">
          <p className="eyebrow">Guest checkout / DigiCare Web</p>
          <h1>Billing details</h1>
          <p>No account is required. This order is a proforma confirmation; payment remains pending.</p>
        </section>
        {!items.length ? (
          <section className="commerce-empty">
            <h2>Your cart is empty.</h2>
            <a className="button button--primary" href="/service" onClick={(event) => onNavigate?.(event, '/service')}>Browse services <span aria-hidden="true">↗</span></a>
          </section>
        ) : catalogLoading ? (
          <section className="commerce-empty" role="status"><h2>Verifying your cart…</h2></section>
        ) : catalogError ? (
          <section className="commerce-empty" role="alert"><h2>Service details unavailable.</h2><p>We cannot verify which services may be checked out.</p><button className="button button--outline" type="button" onClick={retryCatalog}>Try again</button></section>
        ) : !items.every((item) => isCartServiceEligible(item, services)) ? (
          <section className="commerce-empty" role="alert"><h2>Cart needs an update.</h2><p>Only active fixed-price services can proceed to checkout. Remove other services from your cart.</p><a className="button button--primary" href="/cart" onClick={(event) => onNavigate?.(event, '/cart')}>Review cart <span aria-hidden="true">↗</span></a></section>
        ) : (
          <div className="checkout-layout">
            <form className="checkout-form" onSubmit={submit} noValidate>
              <fieldset>
                <legend>Contact information</legend>
                <CheckoutField name="full_name" label="Full name" value={form.full_name} error={errors.full_name} onChange={update} autoComplete="name" />
                <CheckoutField name="email" label="Email" value={form.email} error={errors.email} onChange={update} type="email" autoComplete="email" />
                <CheckoutField name="country_code" label="Country code" value={form.country_code} error={errors.country_code} onChange={update} autoComplete="tel-country-code" placeholder="+1" />
                <CheckoutField name="phone_number" label="Phone number" value={form.phone_number} error={errors.phone_number} onChange={update} type="tel" autoComplete="tel-national" />
              </fieldset>
              <fieldset>
                <legend>Billing address</legend>
                <CheckoutField name="address_line_1" label="Address line 1" value={form.address_line_1} error={errors.address_line_1} onChange={update} autoComplete="address-line1" />
                <CheckoutField name="address_line_2" label="Address line 2 (optional)" value={form.address_line_2} onChange={update} autoComplete="address-line2" />
                <CheckoutField name="city" label="City" value={form.city} error={errors.city} onChange={update} autoComplete="address-level2" />
                <CheckoutField name="state" label="State / region" value={form.state} error={errors.state} onChange={update} autoComplete="address-level1" />
                <CheckoutField name="postal_code" label="Postal code (optional)" value={form.postal_code} onChange={update} autoComplete="postal-code" />
                <CheckoutField name="country" label="Country" value={form.country} error={errors.country} onChange={update} autoComplete="country-name" />
              </fieldset>
              <p className="checkout-disclosure">No payment details are collected. The order confirmation is not proof of payment.</p>
              {requestError && <p className="checkout-error" role="alert">{requestError}</p>}
              <button className="button button--primary" type="submit" disabled={submitting}>{submitting ? 'Submitting…' : 'Create pending order'} <span aria-hidden="true">↗</span></button>
            </form>
            <aside className="cart-summary checkout-summary" aria-label="Order summary">
              <p className="eyebrow">Order summary</p>
              {items.map((item) => <div className="checkout-summary__item" key={item.id}><span>{item.name} × {item.quantity}</span><strong>{usd(item.unitPrice * item.quantity)}</strong></div>)}
              <div className="checkout-summary__subtotal"><span>Cart subtotal estimate</span><strong>{usd(subtotal)}</strong></div>
              <p>The server will recalculate prices and totals from the service catalogue.</p>
            </aside>
          </div>
        )}
      </main>
      <SiteFooter onNavigate={onNavigate} />
    </div>
  )
}

function CheckoutField({ name, label, value, error, onChange, ...props }) {
  return (
    <div className={`checkout-field${error ? ' checkout-field--error' : ''}`}>
      <label htmlFor={`checkout-${name}`}>{label}{!['address_line_2', 'postal_code'].includes(name) && <span aria-hidden="true"> *</span>}</label>
      <input id={`checkout-${name}`} name={name} value={value} onChange={onChange} aria-invalid={Boolean(error)} aria-describedby={error ? `checkout-${name}-error` : undefined} {...props} />
      {error && <small id={`checkout-${name}-error`}>{error}</small>}
    </div>
  )
}

export default CheckoutPage
