import { createClient } from '@supabase/supabase-js'

const supabaseUrl = 'https://ljbdxhavypffoelqyvuu.supabase.co'
const supabaseAnonKey = 'sb_publishable_C9J9_JW0A-m9B-ELRNwsCQ_-Q51QgVT'

export const supabase = createClient(supabaseUrl, supabaseAnonKey)
