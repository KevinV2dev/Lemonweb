'use client'

import { Calendar, Package, Settings, LayoutDashboard, LogOut, BookOpen, Users, Download, Upload, FolderTree, X } from 'lucide-react'
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
      console.error('Error during logout:', error)
    }
  }

  const handleSectionChange = (section: string) => {
    onSectionChange(section)
    router.push(`/admin?section=${section}`, { scroll: false })
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
      title: 'Categories',
      id: 'categories',
      icon: <FolderTree className="w-5 h-5" />
    }
  ]

  return (
    <div className="w-64 h-full bg-white border-r border-gray-200 flex flex-col">
      <div className="h-16 px-6 border-b border-gray-200 flex items-center justify-between">
        <div className="flex items-center">
          <div className="w-8 h-8 flex items-center justify-center">
            <Image
              src="/icons/simbolo-black.svg"
              alt="Lemon Logo"
              width={28}
              height={28}
              priority
              className="w-7 h-7"
            />
          </div>
        </div>
        <button
          onClick={() => onSectionChange(currentSection)}
          className="p-2 hover:bg-gray-100 lg:hidden"
        >
          <X className="h-5 w-5 text-gray-500" />
        </button>
      </div>

      <div className="flex-1 overflow-y-auto">
        <div className="p-4">
          <nav className="space-y-1">
            {menuItems.map((item) => (
              <motion.button
                key={item.id}
                whileHover={{ x: 4 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => handleSectionChange(item.id)}
                className={`flex items-center w-full px-4 py-2.5 text-sm transition-colors ${
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
      </div>

      <div className="p-4 border-t border-gray-200">
        <motion.button
          whileHover={{ x: 4 }}
          whileTap={{ scale: 0.98 }}
          onClick={handleLogout}
          className="flex items-center w-full px-4 py-2.5 text-sm text-red-600 hover:bg-red-50 transition-colors"
        >
          <LogOut className="w-5 h-5" />
          <span className="ml-3 font-medium">Logout</span>
        </motion.button>
      </div>
    </div>
  )
} 