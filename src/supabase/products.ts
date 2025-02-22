import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';
import type { Product, Category, ProductImage, ProductColor, ProductMaterial, ProductAttribute } from '@/types';

export const supabase = createClientComponentClient();

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
    console.log('Iniciando getProducts');
    const { data: products, error: productsError } = await supabase
      .from('products')
      .select(`
        *,
        additional_images:product_images(*),
        category:category_id(*)
      `)
      .eq('active', true)
      .order('created_at', { ascending: false });

    if (productsError) throw productsError;
    console.log('Productos obtenidos:', products);

    // Obtener todas las categorías para cada producto
    const productsWithCategories = await Promise.all(products.map(async (product) => {
      console.log('Obteniendo categorías para producto:', product.id);
      const { data: categoryRelations, error: categoriesError } = await supabase
        .from('product_category_relations')
        .select(`
          category:category_id(*)
        `)
        .eq('product_id', product.id);

      if (categoriesError) throw categoriesError;
      console.log('Relaciones de categorías obtenidas:', categoryRelations);

      const categories = categoryRelations?.map(relation => relation.category) || [];
      console.log('Categorías procesadas:', categories);

      return {
        ...product,
        categories: categories
      };
    }));

    console.log('Productos con categorías:', productsWithCategories);
    return productsWithCategories;
  },

  async getProductBySlug(slug: string) {
    try {
      // Decodificar el slug por si viene con caracteres especiales
      const decodedSlug = decodeURIComponent(slug);
      
      const { data: product, error: productError } = await supabase
        .from('products')
        .select(`
          *,
          additional_images:product_images(*),
          category:category_id(*)
        `)
        .eq('slug', decodedSlug)
        .eq('active', true)
        .single();

      if (productError) {
        console.error('Error al obtener el producto:', productError);
        throw productError;
      }

      if (!product) {
        throw new Error('Producto no encontrado');
      }

      // Obtener las categorías del producto
      const { data: categoryRelations, error: categoriesError } = await supabase
        .from('product_category_relations')
        .select(`
          category:category_id(*)
        `)
        .eq('product_id', product.id);

      if (categoriesError) {
        console.error('Error al obtener las categorías:', categoriesError);
        throw categoriesError;
      }

      const categories = categoryRelations?.map(relation => relation.category) || [];

      return {
        ...product,
        categories: categories
      };
    } catch (error) {
      console.error('Error en getProductBySlug:', error);
      throw error;
    }
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
    console.log('Iniciando createProduct con datos:', productData);
    const { categories, ...productDataWithoutCategories } = productData;
    
    // Insertar el producto
    const { data: product, error: productError } = await supabase
      .from('products')
      .insert([{
        ...productDataWithoutCategories,
        category_id: categories && categories.length > 0 ? categories[0].id : null
      }])
      .select()
      .single();

    if (productError) throw productError;
    if (!product) throw new Error('Failed to create product');
    console.log('Producto creado:', product);

    // Si hay categorías, crear las relaciones
    if (categories && categories.length > 0) {
      console.log('Creando relaciones de categorías:', categories);
      const categoryRelations = categories.map(category => ({
        product_id: product.id,
        category_id: category.id
      }));

      const { error: relationsError } = await supabase
        .from('product_category_relations')
        .insert(categoryRelations);

      if (relationsError) {
        console.error('Error al crear relaciones:', relationsError);
        throw relationsError;
      }
      console.log('Relaciones de categorías creadas:', categoryRelations);
    }

    // Obtener el producto actualizado con todas sus relaciones
    const { data: updatedProduct, error: fetchError } = await supabase
      .from('products')
      .select(`
        *,
        additional_images:product_images(*),
        category:category_id(*)
      `)
      .eq('id', product.id)
      .single();

    if (fetchError) throw fetchError;
    if (!updatedProduct) throw new Error('Product not found after creation');

    // Obtener las categorías del producto
    const { data: categoryRelations, error: categoriesError } = await supabase
      .from('product_category_relations')
      .select(`
        category:category_id(*)
      `)
      .eq('product_id', product.id);

    if (categoriesError) throw categoriesError;

    return {
      ...updatedProduct,
      categories: categoryRelations?.map(relation => relation.category) || []
    };
  },

  async updateProduct(id: number, productData: Partial<Product>) {
    const { categories, ...productDataWithoutCategories } = productData;
    
    // Actualizar el producto
    const { error: productError } = await supabase
      .from('products')
      .update({
        ...productDataWithoutCategories,
        category_id: categories && categories.length > 0 ? categories[0].id : null
      })
      .eq('id', id);

    if (productError) throw productError;

    // Si se proporcionaron categorías, actualizar las relaciones
    if (categories) {
      console.log('Actualizando categorías para producto:', id, categories);
      // Eliminar relaciones existentes
      const { error: deleteError } = await supabase
        .from('product_category_relations')
        .delete()
        .eq('product_id', id);

      if (deleteError) throw deleteError;

      // Crear nuevas relaciones
      if (categories.length > 0) {
        const categoryRelations = categories.map(category => ({
          product_id: id,
          category_id: category.id
        }));

        const { error: relationsError } = await supabase
          .from('product_category_relations')
          .insert(categoryRelations);

        if (relationsError) throw relationsError;
        console.log('Nuevas relaciones de categorías creadas:', categoryRelations);
      }
    }

    // Obtener el producto actualizado con todas sus relaciones
    const { data: updatedProduct, error: fetchError } = await supabase
      .from('products')
      .select(`
        *,
        additional_images:product_images(*),
        category:category_id(*)
      `)
      .eq('id', id)
      .single();

    if (fetchError) throw fetchError;
    if (!updatedProduct) throw new Error('Product not found after update');

    // Obtener las categorías del producto
    const { data: categoryRelations, error: categoriesError } = await supabase
      .from('product_category_relations')
      .select(`
        category:category_id(*)
      `)
      .eq('product_id', id);

    if (categoriesError) throw categoriesError;
    console.log('Relaciones de categorías obtenidas después de actualizar:', categoryRelations);

    const updatedCategories = categoryRelations?.map(relation => relation.category) || [];
    console.log('Categorías procesadas después de actualizar:', updatedCategories);

    return {
      ...updatedProduct,
      categories: updatedCategories
    };
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
    // Obtener el último display_order
    const { data: categories } = await supabase
      .from('categories')
      .select('display_order')
      .order('display_order', { ascending: false })
      .limit(1);

    const nextDisplayOrder = categories && categories.length > 0 
      ? (categories[0].display_order + 1) 
      : 0;

    const { data, error } = await supabase
      .from('categories')
      .insert([{ 
        name: categoryData.name,
        slug: categoryData.slug,
        display_order: nextDisplayOrder
      }])
      .select()
      .single();

    if (error) {
      console.error('Error creating category:', error);
      throw error;
    }
    return data;
  },

  async uploadProductImage(file: File) {
    try {
      console.log('Iniciando subida de imagen:', { fileName: file.name, fileSize: file.size, fileType: file.type });

      const fileExt = file.name.split('.').pop();
      const fileName = `${Date.now()}.${fileExt}`;
      console.log('Nombre de archivo generado:', fileName);

      console.log('Intentando subir archivo a Supabase...');
      const { data, error: uploadError } = await supabase.storage
        .from('products')
        .upload(fileName, file);

      if (uploadError) {
        console.error('Error detallado de subida:', uploadError);
        throw uploadError;
      }

      console.log('Archivo subido exitosamente:', data);
      const { data: { publicUrl } } = supabase.storage
        .from('products')
        .getPublicUrl(fileName);

      console.log('URL pública generada:', publicUrl);
      return publicUrl;
    } catch (error) {
      console.error('Error completo:', error);
      if (error instanceof Error) {
        console.error('Mensaje de error:', error.message);
      }
      throw error;
    }
  },

  async deleteProductImage(imageUrl: string) {
    const fileName = imageUrl.split('/').pop();
    if (!fileName) return;

    const { error } = await supabase.storage
      .from('products')
      .remove([fileName]);

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
        category:category_id(*),
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
  },

  async getProductsByCategory(categoryId: string) {
    const { data, error } = await supabase
      .from('products')
      .select(`
        *,
        category:category_id(*),
        additional_images:product_images(*)
      `)
      .eq('category_id', categoryId)
      .eq('active', true)
      .order('created_at', { ascending: false });

    if (error) throw error;
    return data;
  }
}; 