'use client'

import { createClientComponentClient } from '@supabase/auth-helpers-nextjs'
import { useRouter } from 'next/navigation'
import { toast } from 'react-hot-toast'

export function LogoutButton() {
  const router = useRouter()
  const supabase = createClientComponentClient()

  const handleLogout = async () => {
    try {
      const { error } = await supabase.auth.signOut()
      if (error) throw error

      toast.success('Sesión cerrada correctamente')
      router.push('/admin/login')
      router.refresh()
    } catch (error) {
      console.error('Error:', error)
      toast.error('Error al cerrar sesión')
    }
  }

  return (
    <button
      onClick={handleLogout}
      className="text-sm font-medium text-gray-700 hover:text-gray-800"
    >
      Cerrar sesión
    </button>
  )
} 