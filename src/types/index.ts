export interface Appointment {
  id: string;
  client_name: string;
  client_email: string;
  phone: string;
  appointment_date: string;
  status: 'pending' | 'completed' | 'cancelled';
  preferred_contact_time: 'morning' | 'afternoon' | 'evening';
  address: string;
  notes?: string;
  created_at: string;
}

export type AppointmentFormData = Omit<Appointment, 'id' | 'created_at'>;

export type Admin = {
  id: string;
  email: string;
  created_at: Date;
}
