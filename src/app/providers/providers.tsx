'use client'

import { Toaster } from 'react-hot-toast'
import SupabaseProvider from './supabase-provider'
import LenisProvider from './lenis-provider'

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <SupabaseProvider>
      <LenisProvider>
        {children}
        <Toaster position="top-right" />
      </LenisProvider>
    </SupabaseProvider>
  )
} 