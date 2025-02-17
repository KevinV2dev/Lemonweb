'use client'

import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import * as z from 'zod'
import { toast } from 'react-hot-toast'
import CustomDatePicker from '../calendar/date-picker'
import { createAppointment } from '@/services/appointments'

const appointmentSchema = z.object({
  client_name: z.string().min(1, 'El nombre es requerido'),
  client_email: z.string().email('Email inválido'),
  phone: z.string().min(1, 'El teléfono es requerido'),
  appointment_date: z.date(),
  preferred_contact_time: z.enum(['morning', 'afternoon', 'evening'], {
    required_error: 'Selecciona un horario de contacto'
  }),
  address: z.string().min(1, 'La dirección es requerida'),
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
      toast.success('Cita agendada con éxito')
      reset()
    } catch (error) {
      console.error('Error al agendar cita:', error)
      toast.error('Error al agendar la cita. Por favor, intenta de nuevo.')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <div>
        <label htmlFor="client_name" className="block text-sm font-medium">Nombre</label>
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
        <label htmlFor="phone" className="block text-sm font-medium">Teléfono</label>
        <input
          {...register('phone')}
          type="tel"
          className="mt-1 block w-full rounded-md border p-2"
        />
        {errors.phone && (
          <p className="mt-1 text-sm text-red-600">{errors.phone.message}</p>
        )}
      </div>

      <div>
        <label className="block text-sm font-medium">Fecha y Hora</label>
        <CustomDatePicker
          value={watch('appointment_date')}
          onChange={(date) => {
            if (date) {
              setValue('appointment_date', date)
            }
          }}
          error={errors.appointment_date?.message}
        />
      </div>

      <div>
        <label htmlFor="preferred_contact_time" className="block text-sm font-medium">
          Horario preferido para contacto
        </label>
        <select
          {...register('preferred_contact_time')}
          className="mt-1 block w-full rounded-md border p-2"
        >
          <option value="">Selecciona un horario</option>
          <option value="morning">Mañana (8am - 12pm)</option>
          <option value="afternoon">Tarde (12pm - 5pm)</option>
          <option value="evening">Noche (5pm - 8pm)</option>
        </select>
        {errors.preferred_contact_time && (
          <p className="mt-1 text-sm text-red-600">{errors.preferred_contact_time.message}</p>
        )}
      </div>

      <div>
        <label htmlFor="address" className="block text-sm font-medium">Dirección</label>
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
        <label htmlFor="notes" className="block text-sm font-medium">Notas adicionales</label>
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
        {isLoading ? 'Agendando...' : 'Agendar cita'}
      </button>
    </form>
  )
}
