export type Database = {
  public: {
    Tables: {
      admins: {
        Row: {
          id: string
          email: string
          created_at: string
        }
        Insert: {
          id?: string
          email: string
          created_at?: string
        }
        Update: {
          id?: string
          email?: string
          created_at?: string
        }
      }
      appointments: {
        Row: {
          id: string
          client_name: string
          client_email: string
          appointment_date: string
          service: string
          status: string
          created_at: string
          notes?: string
        }
        Insert: {
          id?: string
          client_name: string
          client_email: string
          appointment_date: string
          service: string
          status?: string
          created_at?: string
          notes?: string
        }
        Update: {
          id?: string
          client_name?: string
          client_email?: string
          appointment_date?: string
          service?: string
          status?: string
          created_at?: string
          notes?: string
        }
      }
    }
  }
} 