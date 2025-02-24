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
      <div className="bg-white w-full max-w-md rounded-lg flex flex-col max-h-[90vh]">
        <div className="flex-none p-6 border-b border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-xl font-semibold text-night-lemon">
                {formData.address === '[Contact Form]' ? 'Edit Contact Request' : 'Edit Appointment'}
              </h2>
              {formData.address === '[Contact Form]' && (
                <span className="inline-flex items-center px-2.5 py-0.5 mt-2 text-xs font-medium bg-blue-100 text-blue-800">
                  Contact Form Message
                </span>
              )}
            </div>
            <button
              onClick={onClose}
              className="text-gray-500 hover:text-gray-700"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>
        
        <div 
          className="flex-1 overflow-y-auto p-6 space-y-4"
          onWheel={(e) => {
            if (e.target instanceof HTMLElement) {
              const element = e.currentTarget;
              const isScrollable = element.scrollHeight > element.clientHeight;
              if (isScrollable) {
                e.stopPropagation();
              }
            }
          }}
          style={{
            scrollbarWidth: 'thin',
            scrollbarColor: '#CBD5E0 transparent'
          }}
        >
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Client Name
            </label>
            <div className="mt-1 block w-full border border-gray-200 px-3 py-2 bg-gray-50 text-gray-700">
              {formData.client_name}
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Email
            </label>
            <div className="mt-1 block w-full border border-gray-200 px-3 py-2 bg-gray-50 text-gray-700">
              {formData.client_email}
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Phone
            </label>
            <div className="mt-1 block w-full border border-gray-200 px-3 py-2 bg-gray-50 text-gray-700">
              {formData.phone}
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Preferred Contact Time
            </label>
            <div className="mt-1 block w-full border border-gray-200 px-3 py-2 bg-gray-50 text-gray-700">
              {formData.preferred_contact_time === 'morning' ? 'Morning' : 
               formData.preferred_contact_time === 'afternoon' ? 'Afternoon' : 'Evening'}
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Address
            </label>
            <div className="mt-1 block w-full border border-gray-200 px-3 py-2 bg-gray-50 text-gray-700">
              {formData.address}
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Status
            </label>
            <select
              value={formData.status}
              onChange={(e) => setFormData({ ...formData, status: e.target.value as 'pending' | 'completed' | 'cancelled' })}
              className="mt-1 block w-full border border-gray-200 px-3 py-2 bg-white text-gray-700 focus:outline-none focus:ring-2 focus:ring-night-lemon focus:border-transparent"
            >
              <option value="pending">Pending</option>
              <option value="completed">Completed</option>
              <option value="cancelled">Cancelled</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Message
            </label>
            <div className="mt-1 block w-full border border-gray-200 px-3 py-2 bg-gray-50 text-gray-700">
              {formData.notes || 'No message'}
            </div>
          </div>
        </div>

        <div className="flex-none p-6 border-t border-gray-200">
          <div className="flex gap-4">
            <button
              onClick={onClose}
              className="flex-1 px-4 py-2 bg-gray-100 text-night-lemon hover:bg-gray-200 transition-colors"
            >
              Cancel
            </button>
            <button
              onClick={handleSubmit}
              className="flex-1 px-4 py-2 bg-night-lemon text-white hover:bg-night-lemon/90 transition-colors"
            >
              Save Changes
            </button>
          </div>
        </div>
      </div>
    </div>
  )
} 