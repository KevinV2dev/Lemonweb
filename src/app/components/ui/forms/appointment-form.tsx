'use client'

import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import * as z from 'zod'
import { toast } from 'react-hot-toast'
import CustomDatePicker from '../calendar/date-picker'
import { createAppointment } from '@/services/appointments'

const appointmentSchema = z.object({
  client_name: z.string().min(1, 'Name is required'),
  client_email: z.string().email('Invalid email'),
  phone: z.string()
    .min(1, 'Phone number is required')
    .regex(/^[0-9]+$/, 'Only numbers are allowed')
    .min(10, 'Phone number must be at least 10 digits')
    .max(10, 'Phone number cannot exceed 10 digits'),
  appointment_date: z.date(),
  preferred_contact_time: z.enum(['morning', 'afternoon', 'evening'], {
    required_error: 'Please select a contact time'
  }),
  address: z.string().min(1, 'Address is required'),
  notes: z.string().optional()
})

type AppointmentFormData = z.infer<typeof appointmentSchema>

export function AppointmentForm() {
  const [isLoading, setIsLoading] = useState(false)
  const { register, handleSubmit, formState: { errors }, setValue, reset, watch } = useForm<AppointmentFormData>({
    resolver: zodResolver(appointmentSchema)
  })

  const onSubmit = async (data: AppointmentFormData) => {
    try {
      setIsLoading(true)
      await createAppointment(data)
      toast.success('Appointment scheduled successfully')
      reset()
    } catch (error) {
      console.error('Error scheduling appointment:', error)
      toast.error('Error scheduling appointment. Please try again.')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <div>
        <label htmlFor="client_name" className="block text-sm font-medium">Name</label>
        <input
          {...register('client_name')}
          type="text"
          className="mt-1 block w-full rounded-md border p-2"
        />
        {errors.client_name && (
          <p className="mt-1 text-sm text-red-600">{errors.client_name.message}</p>
        )}
      </div>

      <div>
        <label htmlFor="client_email" className="block text-sm font-medium">Email</label>
        <input
          {...register('client_email')}
          type="email"
          className="mt-1 block w-full rounded-md border p-2"
        />
        {errors.client_email && (
          <p className="mt-1 text-sm text-red-600">{errors.client_email.message}</p>
        )}
      </div>

      <div>
        <label htmlFor="phone" className="block text-sm font-medium">Phone</label>
        <input
          {...register('phone')}
          type="tel"
          pattern="[0-9]*"
          inputMode="numeric"
          onKeyPress={(e) => {
            if (!/[0-9]/.test(e.key)) {
              e.preventDefault()
            }
          }}
          onChange={(e) => {
            const value = e.target.value.replace(/[^0-9]/g, '')
            e.target.value = value
            register('phone').onChange(e)
          }}
          className="mt-1 block w-full rounded-md border p-2"
          maxLength={10}
          placeholder="Ex: 1234567890"
        />
        {errors.phone && (
          <p className="mt-1 text-sm text-red-600">{errors.phone.message}</p>
        )}
      </div>

      <div>
        <label className="block text-sm font-medium">Date</label>
        <CustomDatePicker
          selected={watch('appointment_date') ? new Date(watch('appointment_date')) : null}
          onChange={(date) => {
            if (date) {
              date.setHours(12, 0, 0, 0)
              setValue('appointment_date', date)
            }
          }}
          minDate={new Date()}
          placeholderText="Select a date"
          error={errors.appointment_date?.message}
        />
      </div>

      <div>
        <label htmlFor="preferred_contact_time" className="block text-sm font-medium">
          Preferred Contact Time
        </label>
        <select
          {...register('preferred_contact_time')}
          className="mt-1 block w-full rounded-md border p-2"
        >
          <option value="">Select a time</option>
          <option value="morning">Morning</option>
          <option value="afternoon">Afternoon</option>
          <option value="evening">Evening</option>
        </select>
        {errors.preferred_contact_time && (
          <p className="mt-1 text-sm text-red-600">{errors.preferred_contact_time.message}</p>
        )}
      </div>

      <div>
        <label htmlFor="address" className="block text-sm font-medium">Address</label>
        <textarea
          {...register('address')}
          className="mt-1 block w-full rounded-md border p-2"
          rows={3}
        />
        {errors.address && (
          <p className="mt-1 text-sm text-red-600">{errors.address.message}</p>
        )}
      </div>

      <div>
        <label htmlFor="notes" className="block text-sm font-medium">Additional Notes</label>
        <textarea
          {...register('notes')}
          className="mt-1 block w-full rounded-md border p-2"
          rows={3}
        />
      </div>

      <button
        type="submit"
        disabled={isLoading}
        className="w-full rounded-md bg-primary px-4 py-2 text-white hover:bg-primary/90 disabled:opacity-50"
      >
        {isLoading ? 'Scheduling...' : 'Schedule Appointment'}
      </button>
    </form>
  )
}
