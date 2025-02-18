import { supabase } from '@/supabase/client'

export async function createAppointment(appointmentData: {
  client_name: string
  client_email: string
  phone: string
  appointment_date: Date
  preferred_contact_time: 'morning' | 'afternoon' | 'evening'
  address: string
  notes?: string
}) {
  const { data, error } = await supabase
    .from('appointments')
    .insert([
      {
        ...appointmentData,
        status: 'pending'
      }
    ])
    .select()
    .single()

  if (error) {
    console.error('Error creating appointment:', error)
    throw error
  }
  return data
} 