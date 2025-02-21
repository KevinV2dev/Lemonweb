import { createClient } from '@supabase/supabase-js';
import type { Product, Category, ProductImage, ProductColor, ProductMaterial, ProductAttribute } from '@/types';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

export const supabase = createClient(supabaseUrl, supabaseKey);

export async function getProduct(slug: string): Promise<Product> {
  const { data: product, error } = await supabase
    .from('products')
    .select(`
      *,
      category:category_id (
        id,
        name,
        slug,
        parent_id,
        type,
        created_at,
        display_order,
        parent:categories(*)
      )
    `)
    .eq('slug', slug)
    .single();

  if (error) throw error;
  return product;
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
      .order('display_order');

    if (error) {
      console.error('Error fetching categories:', error);
      throw error;
    }
    return data;
  },

  async getMaterials() {
    const { data, error } = await supabase
      .from('product_materials')
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
    try {
      // Si hay una nueva imagen y había una imagen anterior, eliminamos la anterior
      if (productData.main_image) {
        const { data: oldProduct } = await supabase
          .from('products')
          .select('main_image')
          .eq('id', id)
          .single();

        if (oldProduct?.main_image && oldProduct.main_image !== productData.main_image) {
          const oldFileName = oldProduct.main_image.split('/').pop();
          if (oldFileName) {
            await supabase.storage
              .from('products')
              .remove([oldFileName]);
          }
        }
      }

      // Actualizamos el producto
      const { data, error } = await supabase
        .from('products')
        .update(productData)
        .eq('id', id)
        .select('*, category:categories(*)')
        .single();

      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Error in updateProduct:', error);
      throw error;
    }
  },

  async deleteProduct(id: number) {
    try {
      // Primero obtenemos el producto para saber su imagen
      const { data: product, error: fetchError } = await supabase
        .from('products')
        .select('main_image')
        .eq('id', id)
        .single();

      if (fetchError) throw fetchError;

      // Eliminamos el producto de la base de datos
      const { error: deleteError } = await supabase
        .from('products')
        .delete()
        .eq('id', id);

      if (deleteError) throw deleteError;

      // Si el producto tenía una imagen, la eliminamos del storage
      if (product?.main_image) {
        const fileName = product.main_image.split('/').pop();
        if (fileName) {
          const { error: storageError } = await supabase.storage
            .from('products')
            .remove([fileName]);

          if (storageError) {
            console.error('Error deleting image from storage:', storageError);
          }
        }
      }
    } catch (error) {
      console.error('Error in deleteProduct:', error);
      throw error;
    }
  },

  async createCategory(categoryData: { name: string; slug: string; }) {
    const { data, error } = await supabase
      .from('categories')
      .insert([{ ...categoryData, type: 'category' }])
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
  },

  async getColors() {
    const { data, error } = await supabase
      .from('product_colors')
      .select('*')
      .order('name');
    if (error) throw error;
    return data;
  },

  async createColor(color: Omit<ProductColor, 'id' | 'created_at'>) {
    const { data, error } = await supabase
      .from('product_colors')
      .insert([color])
      .select()
      .single();
    if (error) throw error;
    return data;
  },

  async getProductAttributes(productId: number) {
    const { data, error } = await supabase
      .from('product_attributes')
      .select('*')
      .eq('product_id', productId)
      .order('name');
    if (error) throw error;
    return data;
  },

  async addProductAttribute(attribute: Omit<ProductAttribute, 'id' | 'created_at'>) {
    const { data, error } = await supabase
      .from('product_attributes')
      .insert([attribute])
      .select()
      .single();
    if (error) throw error;
    return data;
  },

  async addProductColor(productId: number, colorId: number) {
    const { error } = await supabase
      .from('product_color_relations')
      .insert([{ product_id: productId, color_id: colorId }]);
    if (error) throw error;
  },

  async addProductMaterial(productId: number, materialId: number) {
    const { error } = await supabase
      .from('product_material_relations')
      .insert([{ product_id: productId, material_id: materialId }]);
    if (error) throw error;
  },

  async getProductById(id: number) {
    const { data, error } = await supabase
      .from('products')
      .select(`
        *,
        category:categories(*),
        additional_images:product_images(*)
      `)
      .eq('id', id)
      .single();

    if (error) throw error;
    return data;
  },

  async createProductImage(imageData: { product_id: number; image_url: string; display_order: number }) {
    const { data, error } = await supabase
      .from('product_images')
      .insert([imageData])
      .select()
      .single();

    if (error) throw error;
    return data;
  },

  async updateCategoryOrder(categoryId: number, newOrder: number) {
    const { error } = await supabase
      .from('categories')
      .update({ display_order: newOrder })
      .eq('id', categoryId);

    if (error) {
      console.error('Error updating category order:', error);
      throw error;
    }
  },

  async reorderCategories(orderedCategories: { id: number, display_order: number }[]) {
    // Primero obtenemos las categorías actuales para mantener todos los campos requeridos
    const { data: currentCategories, error: fetchError } = await supabase
      .from('categories')
      .select('*')
      .in('id', orderedCategories.map(c => c.id));

    if (fetchError) {
      console.error('Error fetching current categories:', fetchError);
      throw fetchError;
    }

    // Creamos un mapa de las categorías actuales
    const categoryMap = new Map(currentCategories.map(cat => [cat.id, cat]));

    // Actualizamos solo el display_order manteniendo el resto de campos
    const updates = orderedCategories.map(({ id, display_order }) => ({
      ...categoryMap.get(id),
      display_order
    }));

    const { error: updateError } = await supabase
      .from('categories')
      .upsert(updates);

    if (updateError) {
      console.error('Error reordering categories:', updateError);
      throw updateError;
    }
  },

  async deleteCategory(id: number) {
    const { error } = await supabase
      .from('categories')
      .delete()
      .eq('id', id);

    if (error) {
      console.error('Error deleting category:', error);
      throw error;
    }
  }
}; 