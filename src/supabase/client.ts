'use client'

import { createClientComponentClient } from '@supabase/auth-helpers-nextjs'
import { Database } from '../types/database.types'

// Cliente para componentes del cliente
export function createBrowserClient() {
  return createClientComponentClient()
}

export const supabase = createClientComponentClient<Database>({
  supabaseUrl: process.env.NEXT_PUBLIC_SUPABASE_URL!,
  supabaseKey: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
}) 