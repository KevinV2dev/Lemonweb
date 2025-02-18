'use client'

import { Calendar, Package, Settings, LayoutDashboard, LogOut, BookOpen, Users, Download, Upload } from 'lucide-react'
import { motion } from 'framer-motion'
import { createBrowserClient } from '@/supabase/client'
import { useRouter } from 'next/navigation'
import { toast } from 'react-hot-toast'

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

  const handleBackup = async () => {
    try {
      const response = await fetch('/api/backup')
      if (!response.ok) throw new Error('Error generating backup')
      
      const blob = await response.blob()
      const url = window.URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      a.download = `backup-${new Date().toISOString().split('T')[0]}.json`
      document.body.appendChild(a)
      a.click()
      window.URL.revokeObjectURL(url)
      document.body.removeChild(a)
      
      toast.success('Backup created successfully')
    } catch (error) {
      toast.error('Error creating backup')
    }
  }

  const handleRestore = async () => {
    try {
      const input = document.createElement('input')
      input.type = 'file'
      input.accept = '.json'
      
      input.onchange = async (e) => {
        const file = (e.target as HTMLInputElement).files?.[0]
        if (!file) return

        const reader = new FileReader()
        reader.onload = async (e) => {
          try {
            const backupData = JSON.parse(e.target?.result as string)
            
            const response = await fetch('/api/backup', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify(backupData)
            })

            if (!response.ok) throw new Error('Error restoring backup')

            toast.success('Backup restored successfully')
            window.location.reload()
          } catch (error) {
            toast.error('Error restoring backup')
          }
        }
        reader.readAsText(file)
      }

      input.click()
    } catch (error) {
      toast.error('Error restoring backup')
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

        <motion.button
          whileHover={{ x: 4 }}
          whileTap={{ scale: 0.98 }}
          onClick={handleBackup}
          className="flex items-center w-full px-3 py-2 text-sm rounded-lg text-gray-600 hover:bg-gray-50 transition-colors"
        >
          <Download className="w-5 h-5" />
          <span className="ml-3">Create Backup</span>
        </motion.button>

        <motion.button
          whileHover={{ x: 4 }}
          whileTap={{ scale: 0.98 }}
          onClick={handleRestore}
          className="flex items-center w-full px-3 py-2 text-sm rounded-lg text-gray-600 hover:bg-gray-50 transition-colors"
        >
          <Upload className="w-5 h-5" />
          <span className="ml-3">Restore Backup</span>
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