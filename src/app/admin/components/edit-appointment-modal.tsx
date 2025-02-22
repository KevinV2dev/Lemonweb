'use client'

import { useState } from 'react'
import { type Appointment } from '@/types'
import { createBrowserClient } from '@/supabase/client'
import { toast } from 'react-hot-toast'
import CustomDatePicker from '@/app/components/ui/calendar/date-picker'

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
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 overflow-y-auto">
      <div className="bg-white rounded-lg max-w-md w-full p-6 max-h-[90vh] overflow-y-auto">
        <h2 className="text-lg font-semibold mb-4">Editar Cita</h2>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Nombre
            </label>
            <input
              type="text"
              value={formData.client_name}
              onChange={(e) => setFormData({...formData, client_name: e.target.value})}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-black focus:ring-black"
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
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-black focus:ring-black"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">
              Teléfono
            </label>
            <input
              type="tel"
              value={formData.phone}
              onChange={(e) => setFormData({...formData, phone: e.target.value})}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-black focus:ring-black"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">
              Horario de contacto preferido
            </label>
            <select
              value={formData.preferred_contact_time}
              onChange={(e) => setFormData({...formData, preferred_contact_time: e.target.value as Appointment['preferred_contact_time']})}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-black focus:ring-black"
              required
            >
              <option value="morning">Mañana</option>
              <option value="afternoon">Tarde</option>
              <option value="evening">Noche</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">
              Dirección
            </label>
            <textarea
              value={formData.address}
              onChange={(e) => setFormData({...formData, address: e.target.value})}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-black focus:ring-black"
              rows={2}
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">
              Estado
            </label>
            <select
              value={formData.status}
              onChange={(e) => {
                const newStatus = e.target.value as AppointmentStatus
                console.log('Cambiando status a:', newStatus)
                setFormData(prev => ({
                  ...prev,
                  status: newStatus
                }))
              }}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-black focus:ring-black"
            >
              <option value="pending">Pendiente</option>
              <option value="completed">Completada</option>
              <option value="cancelled">Cancelada</option>
            </select>
          </div>

          <div className="mt-4">
            <label htmlFor="appointment_date" className="block text-sm font-medium text-gray-700">
              Fecha
            </label>
            <CustomDatePicker
              selected={new Date(formData.appointment_date)}
              onChange={(date) => {
                if (date) {
                  // Mantener la hora actual al cambiar la fecha
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
              Notas
            </label>
            <textarea
              value={formData.notes || ''}
              onChange={(e) => setFormData({...formData, notes: e.target.value})}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-black focus:ring-black"
              rows={3}
            />
          </div>

          <div className="flex justify-end space-x-3 mt-6">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-black"
            >
              Cancelar
            </button>
            <button
              type="submit"
              disabled={isLoading}
              className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-black hover:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-black disabled:opacity-50"
            >
              {isLoading ? 'Guardando...' : 'Guardar cambios'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
} 