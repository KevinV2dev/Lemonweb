'use client'

import { useEffect, useState } from 'react'
import { supabase } from '@/supabase/client'
import { format } from 'date-fns'
import { es } from 'date-fns/locale'
import { EditAppointmentModal } from './components/edit-appointment-modal'
import { toast } from 'react-hot-toast'
import { motion } from 'framer-motion'
import { Sidebar } from './components/sidebar'
import { Plus } from 'lucide-react'
import { useRouter } from 'next/navigation'
import { createBrowserClient } from '@/supabase/client'
import React from 'react'

interface Appointment {
  id: string
  client_name: string
  client_email: string
  phone: string
  appointment_date: string
  status: 'pending' | 'completed' | 'cancelled'
  preferred_contact_time: 'morning' | 'afternoon' | 'evening'
  address: string
  notes?: string
  created_at: string
  appointment_id: string
}

export default function AdminPage() {
  const router = useRouter()
  const supabase = createBrowserClient()
  const [appointments, setAppointments] = useState<Appointment[]>([])
  const [filteredAppointments, setFilteredAppointments] = useState<Appointment[]>([])
  const [searchTerm, setSearchTerm] = useState('')
  const [isLoading, setIsLoading] = useState(true)
  const [selectedAppointment, setSelectedAppointment] = useState<Appointment | null>(null)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [currentSection, setCurrentSection] = useState('appointments')
  const [sortConfig, setSortConfig] = useState<{
    key: keyof Appointment | null;
    direction: 'asc' | 'desc';
  }>({
    key: null,
    direction: 'asc'
  });

  useEffect(() => {
    const checkSession = async () => {
      const { data: { session } } = await supabase.auth.getSession()
  if (!session) {
        router.push('/admin/login')
      }
    }

    checkSession()
  }, [router, supabase.auth])

  useEffect(() => {
    fetchAppointments()
  }, [])

  useEffect(() => {
    const filtered = appointments.filter(appointment => {
      const searchLower = searchTerm.toLowerCase()
      return (
        appointment.client_name.toLowerCase().includes(searchLower) ||
        appointment.client_email.toLowerCase().includes(searchLower) ||
        appointment.phone.includes(searchLower) ||
        format(new Date(appointment.appointment_date), "d 'de' MMMM 'de' yyyy", { locale: es })
          .toLowerCase()
          .includes(searchLower) ||
        getPreferredContactTime(appointment.preferred_contact_time)
          .toLowerCase()
          .includes(searchLower) ||
        getStatusText(appointment.status)
          .toLowerCase()
          .includes(searchLower) ||
        appointment.appointment_id.toLowerCase().includes(searchLower)
      )
    })
    setFilteredAppointments(filtered)
  }, [searchTerm, appointments])

  async function fetchAppointments() {
    try {
      const { data, error } = await supabase
      .from('appointments')
      .select('*')
      .order('appointment_date', { ascending: true })

      if (error) throw error
      setAppointments(data || [])
      setFilteredAppointments(data || [])
    } catch (error) {
      console.error('Error al cargar citas:', error)
      toast.error('Error al cargar las citas')
    } finally {
      setIsLoading(false)
    }
  }

  const handleDelete = async (id: string) => {
    if (window.confirm('¿Estás seguro de que quieres eliminar esta cita?')) {
      try {
        const { error } = await supabase
          .from('appointments')
          .delete()
          .eq('id', id)

        if (error) throw error

        setAppointments(prev => prev.filter(app => app.id !== id))
        toast.success('Cita eliminada correctamente')
      } catch (error) {
        console.error('Error al eliminar:', error)
        toast.error('Error al eliminar la cita')
      }
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending':
        return 'bg-yellow-100 text-yellow-800'
      case 'completed':
        return 'bg-green-100 text-green-800'
      case 'cancelled':
        return 'bg-red-100 text-red-800'
      default:
        return 'bg-gray-100 text-gray-800'
    }
  }

  const getStatusText = (status: string) => {
    switch (status) {
      case 'pending':
        return 'Pendiente'
      case 'completed':
        return 'Completada'
      case 'cancelled':
        return 'Cancelada'
      default:
        return status
    }
  }

  const getPreferredContactTime = (time: string) => {
    switch (time) {
      case 'morning':
        return 'Morning'
      case 'afternoon':
        return 'Afternoon'
      case 'evening':
        return 'Evening'
      default:
        return time
    }
  }

  // Función para manejar el ordenamiento
  const handleSort = (key: keyof Appointment) => {
    setSortConfig((currentSort) => {
      if (currentSort.key === key) {
        return {
          key,
          direction: currentSort.direction === 'asc' ? 'desc' : 'asc'
        };
      }
      return {
        key,
        direction: 'asc'
      };
    });
  };

  // Función para ordenar las citas
  const sortedAppointments = React.useMemo(() => {
    const sorted = [...filteredAppointments];
    if (!sortConfig.key) return sorted;  // Si no hay key de ordenamiento, retornar el array original

    return sorted.sort((a, b) => {
      const key = sortConfig.key as keyof Appointment;
      
      // Manejo especial para fechas
      if (key === 'appointment_date') {
        return sortConfig.direction === 'asc'
          ? new Date(a.appointment_date).getTime() - new Date(b.appointment_date).getTime()
          : new Date(b.appointment_date).getTime() - new Date(a.appointment_date).getTime();
      }

      // Manejo especial para appointment_id (comparación numérica)
      if (key === 'appointment_id') {
        const aNum = parseInt(a.appointment_id);
        const bNum = parseInt(b.appointment_id);
        return sortConfig.direction === 'asc' ? aNum - bNum : bNum - aNum;
      }

      // Para el resto de campos
      const aValue = String(a[key]);
      const bValue = String(b[key]);
      
      if (sortConfig.direction === 'asc') {
        return aValue.localeCompare(bValue);
      }
      return bValue.localeCompare(aValue);
    });
  }, [filteredAppointments, sortConfig]);

  // Componente para el encabezado de columna ordenable
  const SortableHeader = ({ column, label }: { column: keyof Appointment; label: string }) => (
    <th 
      className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900 cursor-pointer hover:bg-gray-50"
      onClick={() => handleSort(column)}
    >
      <div className="flex items-center gap-2">
        {label}
        {sortConfig.key === column && (
          <span className="text-xs">
            {sortConfig.direction === 'asc' ? '↑' : '↓'}
          </span>
        )}
      </div>
    </th>
  );

  const renderContent = () => {
    switch (currentSection) {
      case 'dashboard':
        return (
          <div className="p-8">
            <h1 className="text-2xl font-semibold text-gray-900 mb-6">Dashboard</h1>
            <div className="grid grid-cols-1 gap-5 sm:grid-cols-3 mb-8">
              <motion.div
                whileHover={{ y: -4 }}
                transition={{ duration: 0.2 }}
                className="bg-white overflow-hidden shadow rounded-lg"
              >
                <div className="p-5">
                  <div className="flex items-center">
                    <div className="flex-shrink-0">
                      <svg className="h-6 w-6 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                    </div>
                    <div className="ml-5 w-0 flex-1">
                      <dl>
                        <dt className="text-sm font-medium text-gray-500 truncate">
                          Citas Pendientes
                        </dt>
                        <dd className="text-lg font-medium text-gray-900">
                          {appointments.filter(a => a.status === 'pending').length}
                        </dd>
                      </dl>
                    </div>
                  </div>
                </div>
              </motion.div>

              <motion.div
                whileHover={{ y: -4 }}
                transition={{ duration: 0.2 }}
                className="bg-white overflow-hidden shadow rounded-lg"
              >
                <div className="p-5">
                  <div className="flex items-center">
                    <div className="flex-shrink-0">
                      <svg className="h-6 w-6 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                    </div>
                    <div className="ml-5 w-0 flex-1">
                      <dl>
                        <dt className="text-sm font-medium text-gray-500 truncate">
                          Citas Completadas
                        </dt>
                        <dd className="text-lg font-medium text-gray-900">
                          {appointments.filter(a => a.status === 'completed').length}
                        </dd>
                      </dl>
                    </div>
                  </div>
                </div>
              </motion.div>

              <motion.div
                whileHover={{ y: -4 }}
                transition={{ duration: 0.2 }}
                className="bg-white overflow-hidden shadow rounded-lg"
              >
                <div className="p-5">
                  <div className="flex items-center">
                    <div className="flex-shrink-0">
                      <svg className="h-6 w-6 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M20 12H4" />
                      </svg>
                    </div>
                    <div className="ml-5 w-0 flex-1">
                      <dl>
                        <dt className="text-sm font-medium text-gray-500 truncate">
                          Citas Canceladas
                        </dt>
                        <dd className="text-lg font-medium text-gray-900">
                          {appointments.filter(a => a.status === 'cancelled').length}
                        </dd>
                      </dl>
                    </div>
                  </div>
                </div>
              </motion.div>
            </div>
          </div>
        )

      case 'appointments':
    return (
          <div className="min-h-screen bg-gray-50 py-8 overflow-x-hidden">
            {/* Stats Overview */}
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <div className="grid grid-cols-1 gap-5 sm:grid-cols-3 mb-8">
                <motion.div
                  whileHover={{ y: -4 }}
                  transition={{ duration: 0.2 }}
                  className="bg-white overflow-hidden shadow rounded-lg"
                >
                  <div className="p-5">
                    <div className="flex items-center">
                      <div className="flex-shrink-0">
                        <svg className="h-6 w-6 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                      </div>
                      <div className="ml-5 w-0 flex-1">
                        <dl>
                          <dt className="text-sm font-medium text-gray-500 truncate">
                            Citas Pendientes
                          </dt>
                          <dd className="text-lg font-medium text-gray-900">
                            {appointments.filter(a => a.status === 'pending').length}
                          </dd>
                        </dl>
                      </div>
                    </div>
                  </div>
                </motion.div>

                <motion.div
                  whileHover={{ y: -4 }}
                  transition={{ duration: 0.2 }}
                  className="bg-white overflow-hidden shadow rounded-lg"
                >
                  <div className="p-5">
                    <div className="flex items-center">
                      <div className="flex-shrink-0">
                        <svg className="h-6 w-6 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                      </div>
                      <div className="ml-5 w-0 flex-1">
                        <dl>
                          <dt className="text-sm font-medium text-gray-500 truncate">
                            Citas Completadas
                          </dt>
                          <dd className="text-lg font-medium text-gray-900">
                            {appointments.filter(a => a.status === 'completed').length}
                          </dd>
                        </dl>
                      </div>
                    </div>
                  </div>
                </motion.div>

                <motion.div
                  whileHover={{ y: -4 }}
                  transition={{ duration: 0.2 }}
                  className="bg-white overflow-hidden shadow rounded-lg"
                >
                  <div className="p-5">
                    <div className="flex items-center">
                      <div className="flex-shrink-0">
                        <svg className="h-6 w-6 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M20 12H4" />
                        </svg>
                      </div>
                      <div className="ml-5 w-0 flex-1">
                        <dl>
                          <dt className="text-sm font-medium text-gray-500 truncate">
                            Citas Canceladas
                          </dt>
                          <dd className="text-lg font-medium text-gray-900">
                            {appointments.filter(a => a.status === 'cancelled').length}
                          </dd>
                        </dl>
                      </div>
                    </div>
                  </div>
                </motion.div>
              </div>

              {/* Appointments Table */}
              <div className="bg-white shadow rounded-lg overflow-hidden">
            <div className="px-4 py-5 sm:p-6">
                  <div className="sm:flex sm:items-center sm:justify-between">
                    <div className="sm:flex-auto">
                      <h1 className="text-xl font-semibold text-gray-900">Citas</h1>
                      <p className="mt-2 text-sm text-gray-700">
                        Listado de todas las citas agendadas
                      </p>
                    </div>
                    <div className="mt-4 sm:mt-0 sm:flex-none">
                      <motion.input
                        whileFocus={{ scale: 1.01 }}
                        transition={{ duration: 0.2 }}
                        type="text"
                        placeholder="Buscar por nombre, email o teléfono..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="block w-full rounded-md border-gray-300 shadow-sm focus:border-black focus:ring-black sm:text-sm p-2"
                      />
                    </div>
                  </div>
                  
                  {isLoading ? (
                    <div className="flex justify-center items-center h-32">
                      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
                    </div>
                  ) : (
                    <div className="mt-8 flow-root">
                      <div className="-mx-4 -my-2 overflow-x-auto sm:-mx-6 lg:-mx-8">
                        <div className="inline-block min-w-full py-2 align-middle">
                          <table className="min-w-full divide-y divide-gray-300">
                            <thead>
                              <tr>
                                <SortableHeader column="appointment_id" label="ID" />
                                <SortableHeader column="client_name" label="Client" />
                                <SortableHeader column="client_email" label="Email" />
                                <SortableHeader column="phone" label="Phone" />
                                <SortableHeader column="appointment_date" label="Date" />
                                <SortableHeader column="preferred_contact_time" label="Contact" />
                                <SortableHeader column="status" label="Status" />
                                <th className="relative py-3.5 pl-3 pr-4 sm:pr-6">
                                  <span className="sr-only">Acciones</span>
                                </th>
                              </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-200 bg-white">
                              {sortedAppointments.map((appointment) => (
                                <tr key={appointment.id} className="hover:bg-gray-50">
                                  <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                                    {appointment.appointment_id}
                                  </td>
                                  <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-900">
                                    {appointment.client_name}
                                  </td>
                                  <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                                    {appointment.client_email}
                                  </td>
                                  <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                                    {appointment.phone}
                                  </td>
                                  <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                                    {format(new Date(appointment.appointment_date), "d 'de' MMMM 'de' yyyy 'a las' HH:mm", { locale: es })}
                                  </td>
                                  <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                                    {getPreferredContactTime(appointment.preferred_contact_time)}
                                  </td>
                                  <td className="whitespace-nowrap px-3 py-4 text-sm">
                                    <span className={`inline-flex rounded-full px-2 text-xs font-semibold leading-5 ${getStatusColor(appointment.status)}`}>
                                      {getStatusText(appointment.status)}
                                    </span>
                                  </td>
                                  <td className="relative whitespace-nowrap py-4 pl-3 pr-4 text-right text-sm font-medium sm:pr-6">
                                    <motion.button
                                      whileHover={{ scale: 1.05 }}
                                      whileTap={{ scale: 0.95 }}
                                      onClick={() => {
                                        setSelectedAppointment(appointment)
                                        setIsModalOpen(true)
                                      }}
                                      className="text-indigo-600 hover:text-indigo-900 mr-4"
                                    >
                                      Editar
                                    </motion.button>
                                    <motion.button
                                      whileHover={{ scale: 1.05 }}
                                      whileTap={{ scale: 0.95 }}
                                      onClick={() => handleDelete(appointment.id)}
                                      className="text-red-600 hover:text-red-900"
                                    >
                                      Eliminar
                                    </motion.button>
                                  </td>
                                </tr>
                              ))}
                            </tbody>
                          </table>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        )

      case 'products':
        return (
          <div className="p-8">
            <div className="flex justify-between items-center mb-6">
              <h1 className="text-2xl font-semibold text-gray-900">Products</h1>
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="px-4 py-2 bg-black text-white rounded-md hover:bg-gray-800 flex items-center"
              >
                <Plus className="w-5 h-5 mr-2" />
                Add Product
              </motion.button>
            </div>
            <div className="bg-white rounded-lg shadow p-6">
              <p className="text-gray-500 text-center">No products added yet</p>
            </div>
          </div>
        )

      case 'settings':
        return (
          <div className="p-8">
            <h1 className="text-2xl font-semibold text-gray-900 mb-6">Settings</h1>
            <div className="bg-white rounded-lg shadow p-6">
              <p className="text-gray-500">Settings coming soon...</p>
            </div>
          </div>
        )

      default:
        return null
    }
  }

  return (
    <div className="flex h-screen bg-gray-50">
      <Sidebar currentSection={currentSection} onSectionChange={setCurrentSection} />
      <div className="flex-1 overflow-hidden">
        <div className="p-8">
          {renderContent()}
        </div>
      </div>

      {selectedAppointment && (
        <EditAppointmentModal
          appointment={selectedAppointment}
          isOpen={isModalOpen}
          onClose={() => {
            setIsModalOpen(false)
            setSelectedAppointment(null)
          }}
          onUpdate={(updatedAppointment) => {
            console.log('Appointment antes de actualizar:', appointments)
            console.log('Appointment recibido para actualizar:', updatedAppointment)
            
            setAppointments(prev => {
              const updated = prev.map(app => 
                app.id === updatedAppointment.id ? updatedAppointment : app
              )
              console.log('Appointments después de actualizar:', updated)
              return updated
            })
            
            setFilteredAppointments(prev => {
              const updated = prev.map(app => 
                app.id === updatedAppointment.id ? updatedAppointment : app
              )
              console.log('FilteredAppointments después de actualizar:', updated)
              return updated
            })
            
            setIsModalOpen(false)
            setSelectedAppointment(null)
          }}
        />
      )}
    </div>
  )
} 