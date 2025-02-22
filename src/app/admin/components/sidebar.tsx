'use client'

import { Calendar, Package, Settings, LayoutDashboard, LogOut, BookOpen, Users, Download, Upload, FolderTree } from 'lucide-react'
import { motion } from 'framer-motion'
import { createBrowserClient } from '@/supabase/client'
import { useRouter } from 'next/navigation'
import { toast } from 'react-hot-toast'
import Image from 'next/image'

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
    },
    {
      title: 'Categorías',
      id: 'categories',
      icon: <FolderTree className="w-5 h-5" />
    }
  ]

  return (
    <div className="w-64 bg-white h-full shadow-sm overflow-y-auto flex flex-col">
      <div className="flex-1">
        <div className="p-6">
          <div className="flex items-center justify-center mb-8">
            <Image
              src="/icons/group.svg"
              alt="Lemon"
              width={114}
              height={24}
              className="w-[90px] sm:w-[114px]"
            />
          </div>

          <div className="space-y-8">
            <div>
              <nav className="space-y-1">
                {menuItems.map((item) => (
                  <motion.button
                    key={item.id}
                    whileHover={{ x: 4 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => onSectionChange(item.id)}
                    className={`flex items-center w-full px-4 py-2.5 text-sm rounded-lg transition-colors ${
                      currentSection === item.id
                        ? 'bg-night-lemon text-white'
                        : 'text-gray-600 hover:bg-gray-50'
                    }`}
                  >
                    {item.icon}
                    <span className="ml-3 font-medium">{item.title}</span>
                  </motion.button>
                ))}
              </nav>
            </div>

            <div>
              <h2 className="text-xs font-semibold text-gray-400 px-4 mb-3 uppercase">Settings</h2>
              <nav className="space-y-1">
                <motion.button
                  whileHover={{ x: 4 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => onSectionChange('settings')}
                  className={`flex items-center w-full px-4 py-2.5 text-sm rounded-lg transition-colors ${
                    currentSection === 'settings'
                      ? 'bg-night-lemon text-white'
                      : 'text-gray-600 hover:bg-gray-50'
                  }`}
                >
                  <Settings className="w-5 h-5" />
                  <span className="ml-3 font-medium">Settings</span>
                </motion.button>

                <motion.button
                  whileHover={{ x: 4 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={handleBackup}
                  className="flex items-center w-full px-4 py-2.5 text-sm rounded-lg text-gray-600 hover:bg-gray-50 transition-colors"
                >
                  <Download className="w-5 h-5" />
                  <span className="ml-3 font-medium">Create Backup</span>
                </motion.button>

                <motion.button
                  whileHover={{ x: 4 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={handleRestore}
                  className="flex items-center w-full px-4 py-2.5 text-sm rounded-lg text-gray-600 hover:bg-gray-50 transition-colors"
                >
                  <Upload className="w-5 h-5" />
                  <span className="ml-3 font-medium">Restore Backup</span>
                </motion.button>
              </nav>
            </div>
          </div>
        </div>
      </div>

      <div className="p-6 border-t border-gray-200">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center">
            <Users className="w-5 h-5 text-gray-500" />
          </div>
          <div>
            <p className="text-sm font-medium text-gray-900">Admin User</p>
            <p className="text-xs text-gray-500">admin@lemon.com</p>
          </div>
        </div>
        <motion.button
          whileHover={{ x: 4 }}
          whileTap={{ scale: 0.98 }}
          onClick={handleLogout}
          className="flex items-center w-full px-4 py-2.5 text-sm rounded-lg text-red-600 hover:bg-red-50 transition-colors mt-4"
        >
          <LogOut className="w-5 h-5" />
          <span className="ml-3 font-medium">Cerrar Sesión</span>
        </motion.button>
      </div>
    </div>
  )
} 