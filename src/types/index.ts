export interface Appointment {
  id: string;
  appointment_id: string;
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

export interface Category {
  id: number;
  name: string;
  slug: string;
  created_at?: string;
  display_order: number;
}

export interface Product {
  id: number;
  name: string;
  slug: string;
  description?: string;
  category_id?: number;
  category?: Category;
  main_image: string;
  active: boolean;
  created_at?: string;
  updated_at?: string;
  additional_images?: ProductImage[];
  colors?: ProductColor[];
  materials?: ProductMaterial[];
  attributes?: ProductAttribute[];
}

export interface ProductImage {
  id: number;
  product_id: number;
  image_url: string;
  display_order: number;
  created_at: string;
}

export interface ProductColor {
  id: number;
  name: string;
  hex_code: string | null;
  description: string | null;
  created_at: string;
}

export interface ProductMaterial {
  id: number;
  name: string;
  description: string | null;
  created_at: string;
}

export interface ProductAttribute {
  id: number;
  product_id: number;
  name: string;
  value: string;
  created_at: string;
}
