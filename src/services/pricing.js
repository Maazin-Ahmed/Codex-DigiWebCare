export function isSupportedCurrency(currency) {
  if (typeof currency !== 'string' || !/^[A-Z]{3}$/.test(currency)) return false
  try {
    new Intl.NumberFormat('en-US', { style: 'currency', currency }).format(0)
    return true
  } catch {
    return false
  }
}

export function formatCurrency(amount, currency) {
  const value = Number(amount)
  if (!Number.isFinite(value) || !isSupportedCurrency(currency)) return 'Price unavailable'
  const options = { style: 'currency', currency }
  if (Number.isInteger(value)) options.minimumFractionDigits = 0
  return new Intl.NumberFormat('en-US', options).format(value)
}

export function formatServicePrice(service) {
  if (service?.pricing_type === 'fixed') {
    return service.price === null || service.price === undefined
      ? 'Price unavailable'
      : formatCurrency(service.price, service.currency)
  }
  return service?.price_label || 'Pricing by enquiry'
}
