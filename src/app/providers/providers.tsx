'use client'

import { Toaster } from 'react-hot-toast'
import SupabaseProvider from './supabase-provider'

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <SupabaseProvider>
      {children}
      <Toaster position="top-right" />
    </SupabaseProvider>
  )
} 