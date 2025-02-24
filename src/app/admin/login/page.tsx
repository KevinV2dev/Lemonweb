'use client'

import { useState } from 'react'
import { supabase } from '@/supabase/client'
import { useRouter } from 'next/navigation'
import { toast } from 'react-hot-toast'
import Image from 'next/image'
import { motion } from 'framer-motion'

export default function LoginPage() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const router = useRouter()

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    if (loading) return
    setLoading(true)

    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password
      })

      if (error) throw error

      if (data?.user?.email === 'lemonsimplify@gmail.com') {
        toast.success('Login successful')
        window.location.href = '/admin'
      } else {
        await supabase.auth.signOut()
        throw new Error('You do not have administrator permissions')
      }
      
    } catch (error: any) {
      console.error('Login error:', error)
      toast.error(error.message || 'Error logging in')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen w-full flex">
      {/* Panel izquierdo - Solo imagen con zoom */}
      <div className="hidden lg:flex lg:w-1/2 relative overflow-hidden">
        <motion.div
          initial={{ scale: 1 }}
          animate={{ scale: 1.1 }}
          transition={{ 
            duration: 10,
            repeat: Infinity,
            repeatType: "reverse",
            ease: "linear"
          }}
          className="absolute inset-0"
        >
          <Image
            src="/images/assets/closet-2.jpg"
            alt="Lemon interior design"
            fill
            className="object-cover"
            priority
            quality={100}
          />
        </motion.div>
      </div>

      {/* Panel derecho - Formulario */}
      <div className="w-full lg:w-1/2 flex flex-col justify-center items-center p-8 sm:p-12 bg-white">
        <motion.div
          initial={{ scale: 0.95, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.5 }}
          className="w-full max-w-md space-y-8"
        >
          {/* Logo principal centrado */}
          <div className="flex justify-center">
            <Image
              src="/icons/logotype.svg"
              alt="Lemon logo"
              width={200}
              height={42}
            />
          </div>

          {/* Texto descriptivo */}
          <div className="text-center mb-12">
            <motion.p
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ duration: 0.8, delay: 0.1, ease: [0.43, 0.13, 0.23, 0.96] }}
              className="text-lg text-silver-lemon max-w-md mx-auto"
            >
              Manage your content and keep the Lemon experience up to date
            </motion.p>
          </div>

          <form onSubmit={handleLogin} className="space-y-6">
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-night-lemon mb-2">
                Email
              </label>
              <input
                id="email"
                name="email"
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-4 py-3 rounded-none border-silver-lemon/30 bg-white
                          focus:ring-2 focus:ring-yellow-lemon focus:border-transparent
                          transition duration-200"
                placeholder="admin@lemon.com"
              />
            </div>

            <div>
              <label htmlFor="password" className="block text-sm font-medium text-night-lemon mb-2">
                Password
              </label>
              <input
                id="password"
                name="password"
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-4 py-3 rounded-none border-silver-lemon/30 bg-white
                          focus:ring-2 focus:ring-yellow-lemon focus:border-transparent
                          transition duration-200"
                placeholder="••••••••"
              />
            </div>

            <motion.button
              type="submit"
              disabled={loading}
              whileHover={{ scale: 1.01 }}
              whileTap={{ scale: 0.99 }}
              className="w-full bg-night-lemon text-white px-6 py-3
                        hover:bg-night-lemon/90 transition duration-200
                        flex items-center justify-center gap-2 group"
            >
              {loading ? (
                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
              ) : (
                <>
                  {loading ? 'Signing in...' : 'Sign in'}
                  <span className="transform transition-transform duration-200 ease-out group-hover:translate-x-1">
                    <Image
                      src="/icons/Vector.svg"
                      width={14}
                      height={14}
                      alt="Arrow right"
                    />
                  </span>
                </>
              )}
            </motion.button>
          </form>
        </motion.div>
      </div>
    </div>
  )
} 