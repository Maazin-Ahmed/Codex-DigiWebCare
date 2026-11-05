export function buildGuestOrderPayload(form, items) {
  return {
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
  }
}
