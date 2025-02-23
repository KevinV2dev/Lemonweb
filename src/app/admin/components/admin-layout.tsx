'use client'

import { useRouter } from 'next/navigation'
import { createBrowserClient } from '@/supabase/client'
import { toast } from 'react-hot-toast'
import { useState } from 'react'
import { Menu, X } from 'lucide-react'
import { Sidebar } from './sidebar'
import Image from 'next/image'

export function AdminLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter()
  const supabase = createBrowserClient()
  const [isLoggingOut, setIsLoggingOut] = useState(false)
  const [currentSection, setCurrentSection] = useState('dashboard')
  const [isSidebarOpen, setIsSidebarOpen] = useState(false)

  const handleLogout = async () => {
    if (isLoggingOut) return
    setIsLoggingOut(true)
    try {
      const { error } = await supabase.auth.signOut()
      if (error) throw error
      toast.success('Sesión cerrada correctamente')
      router.push('/admin/login')
    } catch (error) {
      console.error('Error al cerrar sesión:', error)
      toast.error(error instanceof Error ? error.message : 'Error al cerrar sesión')
    } finally {
      setIsLoggingOut(false)
    }
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Overlay para móvil cuando el sidebar está abierto */}
      {isSidebarOpen && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 z-20 lg:hidden"
          onClick={() => setIsSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <div className={`
        fixed inset-y-0 left-0 z-30 w-64
        transform lg:transform-none lg:opacity-100
        ${isSidebarOpen ? 'translate-x-0 opacity-100' : '-translate-x-full opacity-0 lg:translate-x-0'}
        transition duration-200 ease-in-out
      `}>
        <Sidebar 
          currentSection={currentSection} 
          onSectionChange={(section) => {
            setCurrentSection(section);
            setIsSidebarOpen(false);
          }} 
        />
      </div>

      {/* Header */}
      <header className="fixed top-0 right-0 left-0 lg:left-64 bg-white border-b border-gray-200 h-16 flex items-center px-4 lg:px-8 z-10">
        {/* Botón de menú para móvil */}
        <button
          onClick={() => setIsSidebarOpen(true)}
          className="p-2 lg:hidden"
        >
          <Menu className="h-6 w-6 text-gray-600" />
        </button>
        
        <h1 className="text-xl font-semibold text-night-lemon ml-2 lg:ml-0">Admin Panel</h1>
      </header>

      {/* Contenido principal */}
      <main className={`
        lg:pl-64 pt-[60px] lg:pt-0
        min-h-screen
        transition-all duration-300
      `}>
        <div className="max-w-7xl mx-auto p-4 sm:p-6 lg:p-8">
          {children}
        </div>
      </main>
    </div>
  )
} 