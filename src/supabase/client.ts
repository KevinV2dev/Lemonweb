'use client'

import { createClientComponentClient } from '@supabase/auth-helpers-nextjs'

// Crear una única instancia del cliente sin tipos específicos
export const supabase = createClientComponentClient()

// Exportar la misma instancia para mantener consistencia
export const createBrowserClient = () => supabase 