'use client'
import { createServerClient, type CookieOptions } from '@supabase/ssr'
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs'
import { cookies } from 'next/headers'
import { env } from '@/config/env'

// Cliente para componentes del servidor
export function createClient() {
  const cookieStore = cookies()

  return createServerClient(
    env.supabase.url,
    env.supabase.anonKey,
    {
      cookies: {
        get(name: string) {
          return cookieStore.get(name)?.value
        },
        set(name: string, value: string, options: CookieOptions) {
          return
        },
        remove(name: string, options: CookieOptions) {
          return
        },
      },
    }
  )
}

// Cliente para componentes del cliente
export function createBrowserClient() {
  return createClientComponentClient({
    supabaseUrl: env.supabase.url,
    supabaseKey: env.supabase.anonKey,
  })
} 