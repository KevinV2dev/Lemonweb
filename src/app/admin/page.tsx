'use client'

import { useEffect, useState, Suspense } from 'react'
import { supabase } from '@/supabase/products'
import { format } from 'date-fns'
import { enUS } from 'date-fns/locale'
import { EditAppointmentModal } from './components/edit-appointment-modal'
import { toast } from 'react-hot-toast'
import { motion } from 'framer-motion'
import { Sidebar } from './components/sidebar'
import { Plus, Calendar, Users, Package, ChevronDown, Menu, Clock, Edit2, Trash2 } from 'lucide-react'
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
  const [currentSection, setCurrentSection] = useState(searchParams.get('section') || 'dashboard')
  const [isSidebarOpen, setIsSidebarOpen] = useState(false)
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
    // Actualizar la sección cuando cambie el parámetro de la URL
    const section = searchParams.get('section')
    if (section) {
      setCurrentSection(section)
    }
  }, [searchParams])

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
        format(new Date(appointment.appointment_date), "MMMM d, yyyy", { locale: enUS })
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
      setIsLoading(true);
      const { data: appointmentsData, error: appointmentsError } = await supabase
        .from('appointments')
        .select('*')
        .order('appointment_date', { ascending: true });

      if (appointmentsError) {
        console.error('Error cargando citas:', appointmentsError);
        toast.error('Error al cargar las citas');
        return;
      }

      setAppointments(appointmentsData || []);
      setFilteredAppointments(appointmentsData || []);
    } catch (error) {
      console.error('Error general:', error);
      toast.error('Error al cargar las citas');
    } finally {
      setIsLoading(false);
    }
  }

  const handleDelete = async (id: string) => {
    if (window.confirm('Are you sure you want to delete this appointment?')) {
      try {
        const { error } = await supabase
          .from('appointments')
          .delete()
          .eq('id', id)

        if (error) throw error

        setAppointments(prev => prev.filter(app => app.id !== id))
        toast.success('Appointment deleted successfully')
      } catch (error) {
        console.error('Error deleting:', error)
        toast.error('Error deleting appointment')
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
        return 'Pending'
      case 'completed':
        return 'Completed'
      case 'cancelled':
        return 'Cancelled'
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
      className="bg-white border border-gray-200"
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
          <div className="p-4 lg:p-8">
            <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4 mb-8">
              <h1 className="text-2xl font-semibold text-night-lemon">Dashboard Overview</h1>
              <div className="flex items-center gap-4">
                <button className="bg-night-lemon text-white px-4 py-2 flex items-center gap-2 group hover:bg-night-lemon/90 transition-colors">
                  Last 30 Days
                  <ChevronDown size={16} />
                </button>
              </div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
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
                0,
                <Package className="w-6 h-6 text-night-lemon" />,
                'text-night-lemon'
              )}
            </div>

            <div className="mt-8">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-lg font-semibold text-night-lemon">Recent Appointments</h2>
                <button 
                  onClick={() => handleSectionChange('appointments')}
                  className="text-night-lemon hover:text-night-lemon/80 text-sm font-medium"
                >
                  View all
                </button>
              </div>
              
              <div className="bg-white border border-gray-200">
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
                            {format(new Date(appointment.appointment_date), "MMMM d, yyyy", { locale: enUS })}
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
          </div>
        );

      case 'appointments':
        return (
          <div className="p-4 lg:p-8">
            <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4 mb-8">
              <h1 className="text-2xl font-semibold text-night-lemon">Appointments</h1>
              <div className="w-full lg:w-auto">
                <input
                  type="text"
                  placeholder="Search appointments..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full lg:w-auto px-4 h-10 bg-white border border-gray-200 focus:outline-none focus:ring-2 focus:ring-night-lemon focus:border-transparent"
                />
              </div>
            </div>

            {/* Vista móvil */}
            <div className="block lg:hidden">
              <div className="space-y-4">
                {sortedAppointments.map((appointment) => (
                  <div key={appointment.id} className="bg-white border border-gray-200 p-4 space-y-3">
                    <div className="flex justify-between items-start">
                      <div>
                        <span className="text-xs text-silver-lemon">#{appointment.appointment_id}</span>
                        <h3 className="text-sm font-medium text-night-lemon mt-1">{appointment.client_name}</h3>
                        <p className="text-xs text-silver-lemon">{appointment.client_email}</p>
                      </div>
                      <span className={`inline-flex items-center px-2 py-0.5 text-xs font-medium rounded-full ${getStatusColor(appointment.status)}`}>
                        {getStatusText(appointment.status)}
                      </span>
                    </div>
                    
                    <div className="space-y-2 text-sm">
                      <div className="flex items-center text-silver-lemon">
                        <Calendar className="w-4 h-4 mr-2" />
                        {format(new Date(appointment.appointment_date), "MMMM d, yyyy", { locale: enUS })}
                      </div>
                      <div className="flex items-center text-silver-lemon">
                        <Clock className="w-4 h-4 mr-2" />
                        {getPreferredContactTime(appointment.preferred_contact_time)}
                      </div>
                    </div>

                    <div className="flex items-center justify-end space-x-2 pt-3 border-t border-gray-100">
                      <button
                        onClick={() => {
                          setSelectedAppointment(appointment)
                          setIsModalOpen(true)
                        }}
                        className="inline-flex items-center px-3 py-1.5 text-sm bg-night-lemon text-white hover:bg-night-lemon/90 transition-colors gap-1.5"
                      >
                        <Edit2 size={14} />
                        Edit
                      </button>
                      <button
                        onClick={() => handleDelete(appointment.id)}
                        className="inline-flex items-center px-3 py-1.5 text-sm bg-red-600 text-white hover:bg-red-700 transition-colors gap-1.5"
                      >
                        <Trash2 size={14} />
                        Delete
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Vista desktop */}
            <div className="hidden lg:block">
              <div className="bg-white border border-gray-200">
                <div className="overflow-x-auto">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead>
                      <tr>
                        <SortableHeader column="appointment_id" label="ID" />
                        <SortableHeader column="client_name" label="Client" />
                        <SortableHeader column="appointment_date" label="Date" />
                        <SortableHeader column="preferred_contact_time" label="Time" />
                        <SortableHeader column="status" label="Status" />
                        <SortableHeader column="created_at" label="Created" />
                        <th className="px-3 py-3.5 text-left text-xs font-medium text-silver-lemon uppercase tracking-wider">Actions</th>
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
                            {format(new Date(appointment.appointment_date), "MMMM d, yyyy", { locale: enUS })}
                          </td>
                          <td className="px-3 py-4 text-sm text-night-lemon">
                            {getPreferredContactTime(appointment.preferred_contact_time)}
                          </td>
                          <td className="px-3 py-4">
                            <span className={`inline-flex items-center px-2 py-0.5 text-xs font-medium rounded-full ${getStatusColor(appointment.status)}`}>
                              {getStatusText(appointment.status)}
                            </span>
                          </td>
                          <td className="px-3 py-4 text-sm text-night-lemon">
                            {format(new Date(appointment.created_at), "MMM d yyyy, HH:mm", { locale: enUS })}
                          </td>
                          <td className="px-3 py-4">
                            <div className="flex items-center space-x-2">
                              <button
                                onClick={() => {
                                  setSelectedAppointment(appointment)
                                  setIsModalOpen(true)
                                }}
                                className="inline-flex items-center px-3 py-1.5 text-sm bg-night-lemon text-white hover:bg-night-lemon/90 transition-colors gap-1.5"
                              >
                                <Edit2 size={14} />
                                Edit
                              </button>
                              <button
                                onClick={() => handleDelete(appointment.id)}
                                className="inline-flex items-center px-3 py-1.5 text-sm bg-red-600 text-white hover:bg-red-700 transition-colors gap-1.5"
                              >
                                <Trash2 size={14} />
                                Delete
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          </div>
        );

      case 'products':
        return (
          <div className="p-4 lg:p-8">
            <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4 mb-8">
              <h1 className="text-2xl font-semibold text-night-lemon">Products</h1>
              <button
                onClick={() => {
                  setSelectedProduct(undefined);
                  setIsProductModalOpen(true);
                }}
                className="w-full lg:w-auto bg-night-lemon text-white px-4 py-2 flex items-center justify-center gap-2 group hover:bg-night-lemon/90 transition-colors"
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
          <div className="p-4 lg:p-8">
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

  const handleProductSave = async () => {
    setIsProductModalOpen(false);
    setSelectedProduct(undefined);
    setShouldRefreshProducts(true);
    toast.success('Product saved successfully');
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Overlay para móvil cuando el sidebar está abierto */}
      {isSidebarOpen && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 z-20 lg:hidden"
          onClick={() => setIsSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <div className={`
        fixed inset-y-0 left-0 z-30 w-64
        transform lg:transform-none lg:opacity-100
        ${isSidebarOpen ? 'translate-x-0 opacity-100' : '-translate-x-full opacity-0 lg:translate-x-0'}
        transition duration-200 ease-in-out
      `}>
        <Sidebar 
          currentSection={currentSection} 
          onSectionChange={(section) => {
            setCurrentSection(section);
            setIsSidebarOpen(false);
          }} 
        />
      </div>

      {/* Contenido principal */}
      <div className="lg:pl-64">
        {/* Header */}
        <header className="fixed top-0 right-0 left-0 lg:left-64 bg-white border-b border-gray-200 h-16 flex items-center px-4 lg:px-8 z-10">
          {/* Botón de menú para móvil */}
          <button
            onClick={() => setIsSidebarOpen(true)}
            className="p-2 lg:hidden"
          >
            <Menu className="h-6 w-6 text-gray-600" />
          </button>
          
          <h1 className="text-xl font-semibold text-night-lemon ml-2 lg:ml-0">Admin Panel</h1>
        </header>

        {/* Contenido principal con scroll */}
        <main className="pt-16 min-h-screen">
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
              toast.success('Appointment updated successfully')
            } catch (error) {
              console.error('Error updating:', error)
              toast.error('Error updating appointment')
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