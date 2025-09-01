import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY

// Debug logging
console.log('Supabase URL:', supabaseUrl)
console.log('Supabase Anon Key:', supabaseAnonKey ? 'Present' : 'Missing')
console.log('Supabase Service Key:', supabaseServiceKey ? 'Present' : 'Missing')

// Only create clients if environment variables are available and valid
export const supabase = supabaseUrl && supabaseAnonKey && supabaseUrl.startsWith('http')
  ? createClient(supabaseUrl, supabaseAnonKey)
  : null

// For server-side operations that need elevated permissions
export const supabaseAdmin = supabaseUrl && supabaseServiceKey && supabaseUrl.startsWith('http')
  ? createClient(supabaseUrl, supabaseServiceKey)
  : null
