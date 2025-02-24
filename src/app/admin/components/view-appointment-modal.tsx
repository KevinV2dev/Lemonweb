'use client'

import { useState } from 'react'
import { type Appointment } from '@/types'
import { format } from 'date-fns'
import { enUS } from 'date-fns/locale'
import { X, Copy, Check } from 'lucide-react'
import { toast } from 'react-hot-toast'

interface ViewAppointmentModalProps {
  appointment: Appointment
  isOpen: boolean
  onClose: () => void
}

export function ViewAppointmentModal({ 
  appointment, 
  isOpen, 
  onClose 
}: ViewAppointmentModalProps) {
  const [copiedFields, setCopiedFields] = useState<Record<string, boolean>>({})

  const handleCopy = async (text: string, field: string) => {
    try {
      await navigator.clipboard.writeText(text)
      setCopiedFields({ ...copiedFields, [field]: true })
      setTimeout(() => {
        setCopiedFields({ ...copiedFields, [field]: false })
      }, 2000)
      toast.success('Copied to clipboard')
    } catch (error) {
      toast.error('Failed to copy text')
    }
  }

  const CopyableField = ({ label, value, field }: { label: string, value: string, field: string }) => (
    <div>
      <label className="block text-sm font-medium text-gray-700 mb-1">
        {label}
      </label>
      <div className="relative">
        <div className="mt-1 block w-full border border-gray-200 px-3 py-2 bg-gray-50 text-gray-700">
          {value}
        </div>
        <button
          onClick={() => handleCopy(value, field)}
          className="absolute right-2 top-1/2 -translate-y-1/2 p-1 text-gray-400 hover:text-night-lemon transition-colors"
        >
          {copiedFields[field] ? (
            <Check className="w-4 h-4" />
          ) : (
            <Copy className="w-4 h-4" />
          )}
        </button>
      </div>
    </div>
  )

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white w-full max-w-md rounded-lg flex flex-col max-h-[90vh]">
        <div className="flex-none p-6 border-b border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-xl font-semibold text-night-lemon">
                {appointment.address === '[Contact Form]' ? 'Contact Request Details' : 'Appointment Details'}
              </h2>
              {appointment.address === '[Contact Form]' && (
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
          <CopyableField 
            label="Name"
            value={appointment.client_name}
            field="name"
          />

          <CopyableField 
            label="Email"
            value={appointment.client_email}
            field="email"
          />

          <CopyableField 
            label="Phone"
            value={appointment.phone}
            field="phone"
          />

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Preferred Contact Time
            </label>
            <div className="mt-1 block w-full border border-gray-200 px-3 py-2 bg-gray-50 text-gray-700">
              {appointment.preferred_contact_time === 'morning' ? 'Morning' : 
               appointment.preferred_contact_time === 'afternoon' ? 'Afternoon' : 'Evening'}
            </div>
          </div>

          <CopyableField 
            label="Address"
            value={appointment.address}
            field="address"
          />

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Status
            </label>
            <div className={`inline-flex items-center px-2.5 py-0.5 text-xs font-medium rounded-full
              ${appointment.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                appointment.status === 'completed' ? 'bg-green-100 text-green-800' :
                'bg-red-100 text-red-800'}`}
            >
              {appointment.status === 'pending' ? 'Pending' :
               appointment.status === 'completed' ? 'Completed' : 'Cancelled'}
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Date
            </label>
            <div className="mt-1 block w-full border border-gray-200 px-3 py-2 bg-gray-50 text-gray-700">
              {format(new Date(appointment.appointment_date), "MMMM d, yyyy", { locale: enUS })}
            </div>
          </div>

          <CopyableField 
            label="Message"
            value={appointment.notes || 'No message'}
            field="message"
          />

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Created At
            </label>
            <div className="mt-1 block w-full border border-gray-200 px-3 py-2 bg-gray-50 text-gray-700">
              {format(new Date(appointment.created_at), "MMMM d, yyyy HH:mm", { locale: enUS })}
            </div>
          </div>
        </div>

        <div className="flex-none p-6 border-t border-gray-200">
          <button
            onClick={onClose}
            className="w-full px-4 py-2 bg-gray-100 text-night-lemon hover:bg-gray-200 transition-colors"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  )
} 