'use client'

import { Calendar, Package, Settings, LayoutDashboard, LogOut, BookOpen, Users } from 'lucide-react'
import { motion } from 'framer-motion'
import { createBrowserClient } from '@/supabase/client'
import { useRouter } from 'next/navigation'

interface SidebarProps {
  currentSection: string
  onSectionChange: (section: string) => void
}

export function Sidebar({ currentSection, onSectionChange }: SidebarProps) {
  const router = useRouter()
  const supabase = createBrowserClient()

  const handleLogout = async () => {
    try {
      await supabase.auth.signOut()
      router.push('/admin/login')
    } catch (error) {
      console.error('Error al cerrar sesión:', error)
    }
  }

  const menuItems = [
    {
      title: 'Dashboard',
      id: 'dashboard',
      icon: <LayoutDashboard className="w-5 h-5" />
    },
    {
      title: 'Appointments',
      id: 'appointments',
      icon: <Calendar className="w-5 h-5" />
    },
    {
      title: 'Products',
      id: 'products',
      icon: <Package className="w-5 h-5" />
    }
  ]

  return (
    <div className="w-64 h-screen bg-white border-r border-gray-100 p-6">
      <div className="flex items-center gap-2 mb-8">
        <div className="w-8 h-8 bg-indigo-600 rounded-lg flex items-center justify-center">
          <BookOpen className="w-5 h-5 text-white" />
        </div>
        <span className="font-semibold text-xl">Lemon</span>
      </div>

      <div className="mb-8">
        <h2 className="text-xs font-semibold text-gray-400 mb-4 uppercase">Overview</h2>
        <nav className="space-y-1">
          {menuItems.map((item) => (
            <motion.button
              key={item.id}
              whileHover={{ x: 4 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => onSectionChange(item.id)}
              className={`flex items-center w-full px-3 py-2 text-sm rounded-lg transition-colors ${
                currentSection === item.id
                  ? 'bg-indigo-50 text-indigo-600'
                  : 'text-gray-600 hover:bg-gray-50'
              }`}
            >
              {item.icon}
              <span className="ml-3">{item.title}</span>
            </motion.button>
          ))}
        </nav>
      </div>

      <div className="space-y-1">
        <h2 className="text-xs font-semibold text-gray-400 mb-4 uppercase">Settings</h2>
        <motion.button
          whileHover={{ x: 4 }}
          whileTap={{ scale: 0.98 }}
          onClick={() => onSectionChange('settings')}
          className={`flex items-center w-full px-3 py-2 text-sm rounded-lg transition-colors ${
            currentSection === 'settings'
              ? 'bg-indigo-50 text-indigo-600'
              : 'text-gray-600 hover:bg-gray-50'
          }`}
        >
          <Settings className="w-5 h-5" />
          <span className="ml-3">Settings</span>
        </motion.button>

        <motion.button
          whileHover={{ x: 4 }}
          whileTap={{ scale: 0.98 }}
          onClick={handleLogout}
          className="flex items-center w-full px-3 py-2 text-sm rounded-lg text-red-600 hover:bg-red-50 transition-colors mt-2"
        >
          <LogOut className="w-5 h-5" />
          <span className="ml-3">Cerrar Sesión</span>
        </motion.button>
      </div>

      <div className="absolute bottom-6 left-6 right-6">
        <div className="flex items-center gap-3 px-3 py-3">
          <div className="w-10 h-10 rounded-full bg-gray-200 flex items-center justify-center">
            <Users className="w-5 h-5 text-gray-500" />
          </div>
          <div>
            <p className="text-sm font-medium text-gray-700">Admin User</p>
            <p className="text-xs text-gray-500">admin@lemon.com</p>
          </div>
        </div>
      </div>
    </div>
  )
} 