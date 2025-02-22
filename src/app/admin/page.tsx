'use client'

import { useEffect, useState, Suspense } from 'react'
import { supabase } from '@/supabase/products'
import { format } from 'date-fns'
import { es } from 'date-fns/locale'
import { EditAppointmentModal } from './components/edit-appointment-modal'
import { toast } from 'react-hot-toast'
import { motion } from 'framer-motion'
import { Sidebar } from './components/sidebar'
import { Plus, Calendar, Users, Package, ChevronDown } from 'lucide-react'
import { useRouter, useSearchParams } from 'next/navigation'
import { createBrowserClient } from '@/supabase/client'
import React from 'react'
import { ProductList } from './components/products/ProductList'
import { ProductModal } from './components/products/ProductModal'
import type { Product } from '@/types'
import { CategoryManager } from './components/categories/CategoryManager'
import Image from 'next/image'

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

// Componente envuelto para useSearchParams
function AdminPageContent() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const supabase = createBrowserClient()
  const [appointments, setAppointments] = useState<Appointment[]>([])
  const [filteredAppointments, setFilteredAppointments] = useState<Appointment[]>([])
  const [searchTerm, setSearchTerm] = useState('')
  const [isLoading, setIsLoading] = useState(true)
  const [selectedAppointment, setSelectedAppointment] = useState<Appointment | null>(null)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [currentSection, setCurrentSection] = useState(searchParams.get('section') || 'appointments')
  const [sortConfig, setSortConfig] = useState<{
    key: keyof Appointment | null;
    direction: 'asc' | 'desc';
  }>({
    key: null,
    direction: 'asc'
  });
  const [isProductModalOpen, setIsProductModalOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<Product | undefined>();
  const [shouldRefreshProducts, setShouldRefreshProducts] = useState(false);

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

  const renderDashboardCard = (title: string, value: number, icon: React.ReactNode, color: string) => (
    <motion.div
      whileHover={{ y: -4 }}
      transition={{ duration: 0.2 }}
      className="bg-white overflow-hidden"
    >
      <div className="p-6 flex items-center justify-between">
        <div>
          <p className="text-sm text-silver-lemon font-medium">{title}</p>
          <p className="mt-2 text-3xl font-semibold text-night-lemon">{value}</p>
        </div>
        <div className={`p-3 ${color} bg-opacity-10 text-opacity-100`}>
          {icon}
        </div>
      </div>
    </motion.div>
  );

  const renderContent = () => {
    switch (currentSection) {
      case 'dashboard':
        return (
          <div className="p-8">
            <div className="flex items-center justify-between mb-8">
              <h1 className="text-2xl font-semibold text-night-lemon">Dashboard Overview</h1>
              <div className="flex items-center gap-4">
                <button className="bg-night-lemon text-white px-4 py-2 flex items-center gap-2 group hover:bg-night-lemon/90 transition-colors">
                  Last 30 Days
                  <ChevronDown size={16} />
                </button>
              </div>
            </div>
            
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-3 mb-8">
              {renderDashboardCard(
                'Total Appointments',
                appointments.length,
                <Calendar className="w-6 h-6 text-night-lemon" />,
                'text-night-lemon'
              )}
              {renderDashboardCard(
                'Active Clients',
                appointments.filter(a => a.status === 'pending').length,
                <Users className="w-6 h-6 text-night-lemon" />,
                'text-night-lemon'
              )}
              {renderDashboardCard(
                'Total Products',
                0, // Aquí deberías poner el número real de productos
                <Package className="w-6 h-6 text-night-lemon" />,
                'text-night-lemon'
              )}
            </div>

            <div className="bg-white p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-lg font-semibold text-night-lemon">Recent Appointments</h2>
                <button 
                  onClick={() => handleSectionChange('appointments')}
                  className="text-night-lemon hover:text-night-lemon/80 text-sm font-medium"
                >
                  View all
                </button>
              </div>
              
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead>
                    <tr>
                      <th className="px-3 py-3.5 text-left text-sm font-medium text-silver-lemon">ID</th>
                      <th className="px-3 py-3.5 text-left text-sm font-medium text-silver-lemon">Client</th>
                      <th className="px-3 py-3.5 text-left text-sm font-medium text-silver-lemon">Date</th>
                      <th className="px-3 py-3.5 text-left text-sm font-medium text-silver-lemon">Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200 bg-white">
                    {appointments.slice(0, 5).map((appointment) => (
                      <tr key={appointment.id} className="hover:bg-gray-50">
                        <td className="px-3 py-4 text-sm text-night-lemon">#{appointment.appointment_id}</td>
                        <td className="px-3 py-4 text-sm text-night-lemon">{appointment.client_name}</td>
                        <td className="px-3 py-4 text-sm text-night-lemon">
                          {format(new Date(appointment.appointment_date), "d 'de' MMMM, yyyy", { locale: es })}
                        </td>
                        <td className="px-3 py-4 text-sm">
                          <span className={`inline-flex items-center px-2.5 py-0.5 ${getStatusColor(appointment.status)}`}>
                            {getStatusText(appointment.status)}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        );

      case 'appointments':
        return (
          <div className="p-8">
            <div className="flex items-center justify-between mb-8">
              <h1 className="text-2xl font-semibold text-night-lemon">Appointments</h1>
              <div className="flex items-center gap-4">
                <input
                  type="text"
                  placeholder="Search appointments..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="px-4 h-10 bg-white border border-gray-200 focus:outline-none focus:ring-2 focus:ring-night-lemon focus:border-transparent"
                />
              </div>
            </div>

            <div className="bg-white">
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead>
                    <tr>
                      <SortableHeader column="appointment_id" label="ID" />
                      <SortableHeader column="client_name" label="Client" />
                      <SortableHeader column="appointment_date" label="Date" />
                      <SortableHeader column="preferred_contact_time" label="Time" />
                      <SortableHeader column="status" label="Status" />
                      <th className="px-3 py-3.5 text-left text-sm font-medium text-silver-lemon">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200">
                    {sortedAppointments.map((appointment) => (
                      <tr key={appointment.id} className="hover:bg-gray-50">
                        <td className="px-3 py-4 text-sm text-night-lemon">#{appointment.appointment_id}</td>
                        <td className="px-3 py-4">
                          <div>
                            <div className="text-sm text-night-lemon">{appointment.client_name}</div>
                            <div className="text-sm text-silver-lemon">{appointment.client_email}</div>
                          </div>
                        </td>
                        <td className="px-3 py-4 text-sm text-night-lemon">
                          {format(new Date(appointment.appointment_date), "d 'de' MMMM, yyyy", { locale: es })}
                        </td>
                        <td className="px-3 py-4 text-sm text-night-lemon">
                          {getPreferredContactTime(appointment.preferred_contact_time)}
                        </td>
                        <td className="px-3 py-4 text-sm">
                          <span className={`inline-flex items-center px-2.5 py-0.5 ${getStatusColor(appointment.status)}`}>
                            {getStatusText(appointment.status)}
                          </span>
                        </td>
                        <td className="px-3 py-4 text-sm text-night-lemon">
                          <button
                            onClick={() => {
                              setSelectedAppointment(appointment)
                              setIsModalOpen(true)
                            }}
                            className="text-night-lemon hover:text-night-lemon/80 mr-3"
                          >
                            Edit
                          </button>
                          <button
                            onClick={() => handleDelete(appointment.id)}
                            className="text-red-600 hover:text-red-800"
                          >
                            Delete
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        );

      case 'products':
        return (
          <div className="p-8">
            <div className="flex items-center justify-between mb-8">
              <h1 className="text-2xl font-semibold text-night-lemon">Products</h1>
              <button
                onClick={() => {
                  setSelectedProduct(undefined);
                  setIsProductModalOpen(true);
                }}
                className="bg-night-lemon text-white px-4 py-2 flex items-center gap-2 group hover:bg-night-lemon/90 transition-colors"
              >
                <Plus size={20} />
                Add Product
              </button>
            </div>
            
            <ProductList
              onEdit={handleEditProduct}
              shouldRefresh={shouldRefreshProducts}
              onRefreshComplete={() => setShouldRefreshProducts(false)}
            />
          </div>
        );

      case 'categories':
        return (
          <div className="p-8">
            <div className="flex items-center justify-between mb-8">
              <h1 className="text-2xl font-semibold text-night-lemon">Categories</h1>
            </div>
            <CategoryManager />
          </div>
        );

      default:
        return null;
    }
  };

  const handleEditProduct = (product: Product) => {
    setSelectedProduct(product);
    setIsProductModalOpen(true);
  }

  // Actualizar la URL cuando cambie la sección
  const handleSectionChange = (section: string) => {
    setCurrentSection(section);
    router.push(`/admin?section=${section}`, { scroll: false });
  };

  const handleProductSave = async (product: Product) => {
    setIsProductModalOpen(false);
    setSelectedProduct(undefined);
    // Forzar recarga de productos
    setShouldRefreshProducts(true);
    toast.success(product.id ? 'Producto actualizado' : 'Producto creado');
  };

  return (
    <div className="flex h-screen bg-gray-50">
      {/* Sidebar */}
      <Sidebar currentSection={currentSection} onSectionChange={handleSectionChange} />

      {/* Contenido principal */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Header */}
        <header className="bg-white border-b border-gray-200 h-16 flex items-center px-8">
          <h1 className="text-xl font-semibold text-night-lemon">Panel de Administración</h1>
        </header>

        {/* Contenido principal con scroll */}
        <main className="flex-1 overflow-y-auto bg-gray-50">
          {renderContent()}
        </main>
      </div>

      {/* Modales */}
      {isModalOpen && selectedAppointment && (
        <EditAppointmentModal
          isOpen={isModalOpen}
          appointment={selectedAppointment}
          onClose={() => {
            setIsModalOpen(false)
            setSelectedAppointment(null)
          }}
          onSave={async (updatedAppointment) => {
            try {
              const { error } = await supabase
                .from('appointments')
                .update({
                  status: updatedAppointment.status,
                  notes: updatedAppointment.notes
                })
                .eq('id', updatedAppointment.id)

              if (error) throw error

              setAppointments(prev =>
                prev.map(app =>
                  app.id === updatedAppointment.id ? updatedAppointment : app
                )
              )
              setIsModalOpen(false)
              setSelectedAppointment(null)
              toast.success('Cita actualizada correctamente')
            } catch (error) {
              console.error('Error al actualizar:', error)
              toast.error('Error al actualizar la cita')
            }
          }}
        />
      )}

      {isProductModalOpen && (
        <ProductModal
          isOpen={isProductModalOpen}
          product={selectedProduct}
          onClose={() => setIsProductModalOpen(false)}
          onSave={handleProductSave}
        />
      )}
    </div>
  );
}

// Componente principal con Suspense
export default function AdminPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <AdminPageContent />
    </Suspense>
  )
} 