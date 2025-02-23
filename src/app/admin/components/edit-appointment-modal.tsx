'use client'

import { useState } from 'react'
import { type Appointment } from '@/types'
import { createBrowserClient } from '@/supabase/client'
import { toast } from 'react-hot-toast'
import CustomDatePicker from '@/app/components/ui/calendar/date-picker'
import { X } from 'lucide-react'

type AppointmentStatus = 'pending' | 'completed' | 'cancelled';

interface EditAppointmentModalProps {
  appointment: Appointment;
  isOpen: boolean;
  onClose: () => void;
  onSave: (appointment: Appointment) => Promise<void>;
}

export function EditAppointmentModal({ 
  appointment, 
  isOpen, 
  onClose, 
  onSave 
}: EditAppointmentModalProps) {
  const [formData, setFormData] = useState(appointment)
  const [isLoading, setIsLoading] = useState(false)
  const supabase = createBrowserClient()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    
    try {
      // Primero hacemos el update
      const updateData = {
        client_name: formData.client_name,
        client_email: formData.client_email,
        phone: formData.phone,
        appointment_date: formData.appointment_date,
        status: formData.status as AppointmentStatus, // Aseguramos el tipo
        preferred_contact_time: formData.preferred_contact_time,
        address: formData.address,
        notes: formData.notes
      }
      
      console.log('Datos a enviar:', updateData)

      const { error: updateError } = await supabase
        .from('appointments')
        .update(updateData)
        .eq('id', appointment.id)

      if (updateError) {
        console.error('Error al actualizar:', updateError)
        throw updateError
      }

      // Luego obtenemos el registro actualizado
      const { data: updatedData, error: fetchError } = await supabase
        .from('appointments')
        .select('*')
        .eq('id', appointment.id)
        .single()

      if (fetchError) {
        console.error('Error al obtener datos actualizados:', fetchError)
        throw fetchError
      }

      if (updatedData) {
        console.log('Datos actualizados:', updatedData)
        await onSave(updatedData as Appointment)
        toast.success('Cita actualizada correctamente')
      } else {
        console.error('No se recibieron datos actualizados')
        toast.error('Error al actualizar: no se recibieron datos')
      }
    } catch (error) {
      console.error('Error detallado:', error)
      toast.error('Error al actualizar la cita')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white w-full max-w-md p-6 max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-semibold text-night-lemon">Edit Appointment</h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700"
          >
            <X className="w-5 h-5" />
          </button>
        </div>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Name
            </label>
            <input
              type="text"
              value={formData.client_name}
              onChange={(e) => setFormData({...formData, client_name: e.target.value})}
              className="mt-1 block w-full border border-gray-200 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-night-lemon focus:border-transparent"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">
              Email
            </label>
            <input
              type="email"
              value={formData.client_email}
              onChange={(e) => setFormData({...formData, client_email: e.target.value})}
              className="mt-1 block w-full border border-gray-200 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-night-lemon focus:border-transparent"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">
              Phone
            </label>
            <input
              type="tel"
              value={formData.phone}
              onChange={(e) => {
                const numericValue = e.target.value.replace(/[^0-9]/g, '').slice(0, 20);
                setFormData({...formData, phone: numericValue});
              }}
              className="mt-1 block w-full border border-gray-200 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-night-lemon focus:border-transparent"
              maxLength={20}
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">
              Preferred Contact Time
            </label>
            <select
              value={formData.preferred_contact_time}
              onChange={(e) => setFormData({...formData, preferred_contact_time: e.target.value as Appointment['preferred_contact_time']})}
              className="mt-1 block w-full border border-gray-200 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-night-lemon focus:border-transparent"
              required
            >
              <option value="morning">Morning</option>
              <option value="afternoon">Afternoon</option>
              <option value="evening">Evening</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">
              Address
            </label>
            <textarea
              value={formData.address}
              onChange={(e) => setFormData({...formData, address: e.target.value})}
              className="mt-1 block w-full border border-gray-200 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-night-lemon focus:border-transparent resize-none"
              rows={2}
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">
              Status
            </label>
            <select
              value={formData.status}
              onChange={(e) => {
                const newStatus = e.target.value as AppointmentStatus
                console.log('Changing status to:', newStatus)
                setFormData(prev => ({
                  ...prev,
                  status: newStatus
                }))
              }}
              className="mt-1 block w-full border border-gray-200 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-night-lemon focus:border-transparent"
            >
              <option value="pending">Pending</option>
              <option value="completed">Completed</option>
              <option value="cancelled">Cancelled</option>
            </select>
          </div>

          <div>
            <label htmlFor="appointment_date" className="block text-sm font-medium text-gray-700">
              Date
            </label>
            <CustomDatePicker
              selected={new Date(formData.appointment_date)}
              onChange={(date) => {
                if (date) {
                  const currentDate = new Date(formData.appointment_date)
                  date.setHours(currentDate.getHours())
                  date.setMinutes(currentDate.getMinutes())
                  setFormData({...formData, appointment_date: date.toISOString()})
                }
              }}
              error={undefined}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">
              Message
            </label>
            <textarea
              value={formData.notes || ''}
              onChange={(e) => setFormData({...formData, notes: e.target.value})}
              className="mt-1 block w-full border border-gray-200 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-night-lemon focus:border-transparent overflow-y-auto"
              rows={3}
            />
          </div>

          <div className="flex justify-end space-x-3 mt-6">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 border border-gray-200 text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-night-lemon"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isLoading}
              className="px-4 py-2 text-sm font-medium text-white bg-night-lemon hover:bg-night-lemon/90 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-night-lemon disabled:opacity-50"
            >
              {isLoading ? 'Saving...' : 'Save changes'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
} 