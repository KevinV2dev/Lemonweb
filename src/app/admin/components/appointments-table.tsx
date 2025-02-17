'use client'

import { format } from 'date-fns'
import { es } from 'date-fns/locale'
import { type Appointment } from '@/types'
import { createBrowserClient } from '@/supabase/client'
import { toast } from 'react-hot-toast'
import { useState } from 'react'
import { EditAppointmentModal } from './edit-appointment-modal'

interface AppointmentsTableProps {
  appointments: Appointment[]
}

export function AppointmentsTable({ appointments: initialAppointments }: AppointmentsTableProps) {
  const [appointments, setAppointments] = useState(initialAppointments)
  const [editingAppointment, setEditingAppointment] = useState<Appointment | null>(null)
  const supabase = createBrowserClient()

  const handleDelete = async (id: string) => {
    if (!confirm('¿Estás seguro de eliminar esta cita?')) return

    try {
      const { error } = await supabase
        .from('appointments')
        .delete()
        .eq('id', id)

      if (error) throw error

      setAppointments(appointments.filter(app => app.id !== id))
      toast.success('Cita eliminada correctamente')
    } catch (error) {
      console.error('Error:', error)
      toast.error('Error al eliminar la cita')
    }
  }

  const handleStatusChange = async (id: string, status: Appointment['status']) => {
    try {
      const { error } = await supabase
        .from('appointments')
        .update({ status })
        .eq('id', id)

      if (error) throw error

      setAppointments(appointments.map(app => 
        app.id === id ? { ...app, status } : app
      ))
      toast.success('Estado actualizado correctamente')
    } catch (error) {
      console.error('Error:', error)
      toast.error('Error al actualizar el estado')
    }
  }

  const handleEdit = (appointment: Appointment) => {
    setEditingAppointment(appointment)
  }

  const handleUpdateAppointment = (updatedAppointment: Appointment) => {
    setAppointments(appointments.map(app => 
      app.id === updatedAppointment.id ? updatedAppointment : app
    ))
    setEditingAppointment(null)
  }

  if (!appointments || appointments.length === 0) {
    return (
      <div className="text-center py-4">
        <p className="text-gray-500">No hay citas agendadas</p>
      </div>
    )
  }

  return (
    <>
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Cliente
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Email
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Fecha
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Estado
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Acciones
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {appointments.map((appointment) => (
              <tr key={appointment.id}>
                <td className="px-6 py-4 whitespace-nowrap">
                  {appointment.client_name}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  {appointment.client_email}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  {format(new Date(appointment.appointment_date), "PPpp", { locale: es })}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <select
                    value={appointment.status}
                    onChange={(e) => handleStatusChange(appointment.id, e.target.value as Appointment['status'])}
                    className="rounded-md border-gray-300 shadow-sm focus:border-black focus:ring-black"
                  >
                    <option value="pending">Pendiente</option>
                    <option value="confirmed">Confirmada</option>
                    <option value="cancelled">Cancelada</option>
                  </select>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                  <button 
                    onClick={() => handleEdit(appointment)}
                    className="text-indigo-600 hover:text-indigo-900 mr-4"
                  >
                    Editar
                  </button>
                  <button 
                    onClick={() => handleDelete(appointment.id)}
                    className="text-red-600 hover:text-red-900"
                  >
                    Eliminar
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {editingAppointment && (
        <EditAppointmentModal
          appointment={editingAppointment}
          onClose={() => setEditingAppointment(null)}
          onUpdate={handleUpdateAppointment}
        />
      )}
    </>
  )
} 