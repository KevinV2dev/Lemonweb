import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

export const supabase = createClient(supabaseUrl, supabaseKey);

export interface Product {
  id: number;
  name: string;
  slug: string;
  description: string;
  category_id: number;
  main_image: string;
  active: boolean;
  created_at: string;
  updated_at: string;
  category?: Category;
  additional_images?: ProductImage[];
}

export interface Category {
  id: number;
  name: string;
  slug: string;
  created_at: string;
}

export interface ProductImage {
  id: number;
  product_id: number;
  image_url: string;
  display_order: number;
  created_at: string;
}

export const productService = {
  async getProducts() {
    const { data, error } = await supabase
      .from('products')
      .select(`
        *,
        category:categories(*)
      `)
      .eq('active', true)
      .order('created_at', { ascending: false });

    if (error) throw error;
    return data;
  },

  async getProductBySlug(slug: string) {
    const { data, error } = await supabase
      .from('products')
      .select(`
        *,
        category:categories(*),
        additional_images:product_images(*)
      `)
      .eq('slug', slug)
      .eq('active', true)
      .single();

    if (error) throw error;
    return data;
  },

  async getCategories() {
    const { data, error } = await supabase
      .from('categories')
      .select('*')
      .order('name');

    if (error) throw error;
    return data;
  },

  async createProduct(productData: Omit<Product, 'id' | 'created_at' | 'updated_at'>) {
    const { data, error } = await supabase
      .from('products')
      .insert([productData])
      .select('*, category:categories(*)')
      .single();

    if (error) throw error;
    return data;
  },

  async updateProduct(id: number, productData: Partial<Product>) {
    const { data, error } = await supabase
      .from('products')
      .update(productData)
      .eq('id', id)
      .select('*, category:categories(*)')
      .single();

    if (error) throw error;
    return data;
  },

  async deleteProduct(id: number) {
    const { error } = await supabase
      .from('products')
      .delete()
      .eq('id', id);

    if (error) throw error;
  },

  async createCategory(categoryData: { name: string; slug: string }) {
    const { data, error } = await supabase
      .from('categories')
      .insert([categoryData])
      .select()
      .single();

    if (error) throw error;
    return data;
  },

  async uploadProductImage(file: File) {
    try {
      // Verificar la sesión
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        throw new Error('Debes estar autenticado para subir imágenes');
      }

      const fileExt = file.name.split('.').pop();
      const fileName = `${Date.now()}-${Math.random()}.${fileExt}`;
      const filePath = `${fileName}`;

      // Intentar subir el archivo
      const { data, error: uploadError } = await supabase.storage
        .from('products')
        .upload(filePath, file, {
          cacheControl: '3600',
          upsert: false
        });

      if (uploadError) {
        console.error('Upload error:', uploadError);
        throw uploadError;
      }

      // Obtener la URL pública
      const { data: { publicUrl } } = supabase.storage
        .from('products')
        .getPublicUrl(filePath);

      return publicUrl;
    } catch (error) {
      console.error('Error uploading image:', error);
      if (error instanceof Error) {
        throw new Error(`Error al subir la imagen: ${error.message}`);
      }
      throw new Error('Error al subir la imagen');
    }
  },

  async deleteProductImage(imageUrl: string) {
    const filePath = imageUrl.split('/').pop();
    if (!filePath) return;

    const { error } = await supabase.storage
      .from('products')
      .remove([`product-images/${filePath}`]);

    if (error) throw error;
  }
}; 