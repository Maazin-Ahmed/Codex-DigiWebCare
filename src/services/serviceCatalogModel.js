import { serviceCatalog as editorialServices } from '../content.js'

export function mapServiceRecord(row) {
  const editorial = editorialServices.find((service) => service.slug === row.slug)
  return {
    ...editorial,
    ...row,
    scope: row.short_description || row.description,
    // Keep `price` numeric for eligibility and cart calculations. Use
    // `price_label` only for display.
    packages: [],
  }
}
