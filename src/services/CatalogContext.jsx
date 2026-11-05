import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react'
import { serviceCatalog as editorialServices } from '../content.js'
import { fetchActiveCatalog } from './serviceApi.js'

const CatalogContext = createContext(null)

function enrichService(row) {
  const editorial = editorialServices.find((service) => service.slug === row.slug)
  return {
    ...editorial,
    ...row,
    scope: row.short_description || row.description,
    price: row.price_label,
    // The database has no package table. Never show stale hardcoded package prices.
    packages: [],
  }
}

export function CatalogProvider({ children }) {
  const [categories, setCategories] = useState([])
  const [services, setServices] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [reloadKey, setReloadKey] = useState(0)

  useEffect(() => {
    let active = true
    setLoading(true)
    setError('')
    fetchActiveCatalog()
      .then((catalog) => {
        if (!active) return
        setCategories(catalog.categories)
        setServices(catalog.services.map(enrichService))
      })
      .catch((reason) => {
        if (!active) return
        setError(reason?.message || 'The service catalogue could not be loaded.')
      })
      .finally(() => { if (active) setLoading(false) })
    return () => { active = false }
  }, [reloadKey])

  const retry = useCallback(() => setReloadKey((key) => key + 1), [])
  const value = useMemo(() => ({ categories, services, loading, error, retry }), [categories, services, loading, error, retry])
  return <CatalogContext.Provider value={value}>{children}</CatalogContext.Provider>
}

export function useCatalog() {
  const context = useContext(CatalogContext)
  if (!context) throw new Error('useCatalog must be used inside CatalogProvider.')
  return context
}
