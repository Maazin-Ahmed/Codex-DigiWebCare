const REQUIRED_FIELDS = ['full_name', 'country_code', 'phone_number', 'address_line_1', 'city', 'state', 'country']

export function validateGuestCheckout(form) {
  const errors = {}
  if (String(form.full_name ?? '').trim().length < 2) errors.full_name = 'Enter your full name.'
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(String(form.email ?? '').trim())) errors.email = 'Enter a valid email address.'
  for (const field of REQUIRED_FIELDS) {
    if (field !== 'full_name' && !String(form[field] ?? '').trim()) errors[field] = 'This field is required.'
  }
  return errors
}
