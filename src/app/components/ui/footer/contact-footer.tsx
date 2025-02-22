'use client'

import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import * as z from 'zod'
import { toast } from 'react-hot-toast'
import { createAppointment } from '@/services/appointments'

const contactSchema = z.object({
  client_name: z.string().min(1, 'Name is required'),
  client_email: z.string().email('Invalid email'),
  phone: z.string()
    .min(1, 'Phone number is required')
    .regex(/^[0-9]+$/, 'Numbers only')
    .min(10, 'Phone number must be at least 10 digits')
    .max(10, 'Phone number cannot exceed 10 digits'),
  preferred_contact_time: z.enum(['morning', 'afternoon', 'evening'], {
    required_error: 'Please select a contact time'
  }),
  notes: z.string().optional()
})

type ContactFormData = z.infer<typeof contactSchema>

export function ContactFooter() {
  const [isLoading, setIsLoading] = useState(false)
  const { register, handleSubmit, formState: { errors }, reset } = useForm<ContactFormData>({
    resolver: zodResolver(contactSchema)
  })

  const onSubmit = async (data: ContactFormData) => {
    try {
      setIsLoading(true)
      // Add a default date for the next day
      const tomorrow = new Date()
      tomorrow.setDate(tomorrow.getDate() + 1)
      tomorrow.setHours(12, 0, 0, 0)

      await createAppointment({
        ...data,
        appointment_date: tomorrow,
        address: 'To be assigned' // Required by backend
      })
      
      toast.success('Message sent successfully')
      reset()
    } catch (error) {
      console.error('Error sending message:', error)
      toast.error('Error sending message. Please try again.')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <footer className="bg-night-lemon text-white py-16">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
          {/* Contact Information */}
          <div>
            <h3 className="text-2xl font-bold mb-6">Get in Touch</h3>
            <p className="mb-4">
              Have a question or need help with your project?
              Leave your details and we'll get back to you.
            </p>
            <div className="space-y-2">
              <p>Email: lemonsimplify@gmail.com</p>
              <p>Phone: +1-801-661-8481</p>
            </div>
          </div>

          {/* Contact Form */}
          <div>
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
              <div>
                <input
                  {...register('client_name')}
                  type="text"
                  placeholder="Full Name"
                  className="w-full px-4 py-2 bg-white/10 border border-white/20 text-white placeholder-white/70 focus:outline-none focus:ring-2 focus:ring-white/50"
                />
                {errors.client_name && (
                  <p className="mt-1 text-sm text-yellow-lemon">{errors.client_name.message}</p>
                )}
              </div>

              <div>
                <input
                  {...register('client_email')}
                  type="email"
                  placeholder="Email"
                  className="w-full px-4 py-2 bg-white/10 border border-white/20 text-white placeholder-white/70 focus:outline-none focus:ring-2 focus:ring-white/50"
                />
                {errors.client_email && (
                  <p className="mt-1 text-sm text-yellow-lemon">{errors.client_email.message}</p>
                )}
              </div>

              <div>
                <input
                  {...register('phone')}
                  type="tel"
                  placeholder="Phone"
                  className="w-full px-4 py-2 bg-white/10 border border-white/20 text-white placeholder-white/70 focus:outline-none focus:ring-2 focus:ring-white/50"
                  maxLength={10}
                />
                {errors.phone && (
                  <p className="mt-1 text-sm text-yellow-lemon">{errors.phone.message}</p>
                )}
              </div>

              <div className="relative">
                <select
                  {...register('preferred_contact_time')}
                  className="w-full px-4 py-2 bg-white/10 border border-white/20 text-white placeholder-white/70 focus:outline-none focus:ring-2 focus:ring-white/50 appearance-none"
                >
                  <option value="" className="bg-night-lemon text-white">Preferred Contact Time</option>
                  <option value="morning" className="bg-night-lemon text-white">Morning</option>
                  <option value="afternoon" className="bg-night-lemon text-white">Afternoon</option>
                  <option value="evening" className="bg-night-lemon text-white">Evening</option>
                </select>
                {errors.preferred_contact_time && (
                  <p className="mt-1 text-sm text-yellow-lemon">{errors.preferred_contact_time.message}</p>
                )}
                <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none">
                  <svg className="w-4 h-4 fill-current" viewBox="0 0 20 20">
                    <path d="M7 10l5 5 5-5H7z" />
                  </svg>
                </div>
              </div>

              <div>
                <textarea
                  {...register('notes')}
                  placeholder="Message (optional)"
                  rows={3}
                  className="w-full px-4 py-2 bg-white/10 border border-white/20 text-white placeholder-white/70 focus:outline-none focus:ring-2 focus:ring-white/50"
                />
              </div>

              <button
                type="submit"
                disabled={isLoading}
                className="w-full bg-yellow-lemon text-night-lemon font-semibold py-2 px-4 hover:bg-yellow-lemon/90 transition-colors disabled:opacity-50"
              >
                {isLoading ? 'Sending...' : 'Send Message'}
              </button>
            </form>
          </div>
        </div>

        <div className="mt-12 pt-8 border-t border-white/20 text-center text-sm">
          <p>&copy; {new Date().getFullYear()} Lemon. All rights reserved.</p>
        </div>
      </div>
    </footer>
  )
} 