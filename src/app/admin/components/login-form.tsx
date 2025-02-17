'use client'

import { useRouter, useSearchParams } from 'next/navigation'
import { toast } from 'react-hot-toast'
import { useState } from 'react'
import { createBrowserClient } from '@/supabase/client'

export function LoginForm() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [isLoading, setIsLoading] = useState(false)

  // Mostrar mensaje de error si viene en la URL
  const error = searchParams.get('error')
  if (error) {
    const errorMessages = {
      'session': 'Error de sesión. Por favor, inicia sesión nuevamente.',
      'no-admin': 'No tienes permisos de administrador.',
      'unknown': 'Error desconocido. Por favor, intenta de nuevo.'
    }
    toast.error(errorMessages[error as keyof typeof errorMessages] || 'Error al iniciar sesión')
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    
    try {
      const supabase = createBrowserClient()
      const { error: signInError } = await supabase.auth.signInWithPassword({
        email,
        password
      })

      if (signInError) throw signInError

      // Verificar si es admin
      const { data: admin, error: adminError } = await supabase
        .from('admins')
        .select('email')
        .eq('email', email)
        .single()

      if (adminError || !admin) {
        throw new Error('No tienes permisos de administrador')
      }

      toast.success('Inicio de sesión exitoso')
      router.push('/admin')
      router.refresh()
    } catch (error) {
      console.error('Error al iniciar sesión:', error)
      toast.error(error instanceof Error ? error.message : 'Error al iniciar sesión')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <form className="space-y-6" onSubmit={handleSubmit}>
      <div>
        <label className="block text-sm font-medium text-gray-700">
          Email
        </label>
        <div className="mt-1">
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-black focus:border-black"
            required
          />
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700">
          Contraseña
        </label>
        <div className="mt-1">
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-black focus:border-black"
            required
          />
        </div>
      </div>

      <div>
        <button
          type="submit"
          disabled={isLoading}
          className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-black hover:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-black disabled:opacity-50"
        >
          {isLoading ? 'Iniciando sesión...' : 'Iniciar sesión'}
        </button>
      </div>
    </form>
  )
} 