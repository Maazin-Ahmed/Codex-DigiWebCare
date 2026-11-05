import { supabase } from '../supabaseClient.js'

const CATEGORY_COLUMNS = 'id,name,slug,description,display_order,is_active'
const SERVICE_COLUMNS = 'id,category_id,name,slug,short_description,description,price,currency,is_active,quantity_allowed,max_quantity,display_order,pricing_type,price_min,price_max,price_label'

export async function fetchActiveCatalog() {
  const [categoriesResult, servicesResult] = await Promise.all([
    supabase.from('service_categories').select(CATEGORY_COLUMNS).eq('is_active', true).order('display_order', { ascending: true }),
    supabase.from('services').select(SERVICE_COLUMNS).eq('is_active', true).order('display_order', { ascending: true }),
  ])

  if (categoriesResult.error) throw categoriesResult.error
  if (servicesResult.error) throw servicesResult.error

  return { categories: categoriesResult.data ?? [], services: servicesResult.data ?? [] }
}
