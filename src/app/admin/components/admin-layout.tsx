'use client'

import { useRouter } from 'next/navigation'
import { createBrowserClient } from '@/supabase/client'
import { toast } from 'react-hot-toast'
import { useState } from 'react'

export function AdminLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter()
  const supabase = createBrowserClient()
  const [isLoggingOut, setIsLoggingOut] = useState(false)

  const handleLogout = async () => {
    if (isLoggingOut) return
    
    setIsLoggingOut(true)
    try {
      const { error } = await supabase.auth.signOut()
      if (error) throw error
      
      toast.success('Sesión cerrada correctamente')
      router.push('/admin/login')
      router.refresh()
    } catch (error) {
      console.error('Error al cerrar sesión:', error)
      toast.error(error instanceof Error ? error.message : 'Error al cerrar sesión')
    } finally {
      setIsLoggingOut(false)
    }
  }

  return (
    <div className="flex h-screen bg-gray-100">
      {/* Sidebar */}
      <div className="w-64 bg-white shadow-sm">
        <div className="h-full flex flex-col">
          <div className="flex-1 flex flex-col pt-5 pb-4 overflow-y-auto">
            <div className="flex items-center flex-shrink-0 px-4">
              <h1 className="text-xl font-semibold">Panel Admin</h1>
            </div>
            <nav className="mt-5 flex-1 px-2 space-y-1">
              <a
                href="/admin"
                className="bg-gray-100 text-gray-900 group flex items-center px-2 py-2 text-sm font-medium rounded-md"
              >
                📅 Citas
              </a>
            </nav>
          </div>
          <div className="flex-shrink-0 flex border-t border-gray-200 p-4">
            <button
              onClick={handleLogout}
              disabled={isLoggingOut}
              className="flex-shrink-0 w-full group block disabled:opacity-50"
            >
              <div className="flex items-center">
                <div>
                  <p className="text-sm font-medium text-gray-700 group-hover:text-gray-900">
                    {isLoggingOut ? 'Cerrando sesión...' : 'Cerrar sesión'}
                  </p>
                </div>
              </div>
            </button>
          </div>
        </div>
      </div>

      {/* Main content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        <main className="flex-1 overflow-x-hidden overflow-y-auto bg-gray-100">
          <div className="py-6">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-8">
              {children}
            </div>
          </div>
        </main>
      </div>
    </div>
  )
} 