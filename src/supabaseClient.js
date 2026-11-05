import { createClient } from '@supabase/supabase-js'

const viteEnv = import.meta.env ?? {}
const supabaseUrl = viteEnv.VITE_SUPABASE_URL?.trim()
const supabasePublishableKey = viteEnv.VITE_SUPABASE_PUBLISHABLE_KEY?.trim()

if (!supabaseUrl || !supabasePublishableKey) {
  throw new Error(
    'Supabase configuration is missing. Set VITE_SUPABASE_URL and VITE_SUPABASE_PUBLISHABLE_KEY.',
  )
}

// This is the only browser Supabase client. It must only use the publishable key.
export const supabase = createClient(supabaseUrl, supabasePublishableKey)

