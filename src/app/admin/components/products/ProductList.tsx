'use client';

import { useState, useEffect } from 'react';
import { Edit, Trash2 } from 'lucide-react';
import { motion } from 'framer-motion';
import { Product, productService } from '@/supabase/products';
import { toast } from 'react-hot-toast';
import Image from 'next/image';

interface ProductListProps {
  onEdit: (product: Product) => void;
}

export function ProductList({ onEdit }: ProductListProps) {
  const [products, setProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadProducts();
  }, []);

  const loadProducts = async () => {
    try {
      const data = await productService.getProducts();
      setProducts(data);
    } catch (error) {
      toast.error('Error al cargar los productos');
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleDelete = async (id: number) => {
    if (!confirm('¿Estás seguro de que quieres eliminar este producto?')) return;

    try {
      await productService.deleteProduct(id);
      setProducts(products.filter(p => p.id !== id));
      toast.success('Producto eliminado');
    } catch (error) {
      console.error('Error:', error);
      toast.error('Error al eliminar el producto');
    }
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900" />
      </div>
    );
  }

  return (
    <div className="p-6">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {products.length === 0 ? (
          <p className="text-gray-500 text-center col-span-full">No products added yet</p>
        ) : (
          products.map((product) => (
            <motion.div
              key={product.id}
              whileHover={{ y: -4 }}
              className="bg-white rounded-lg shadow-sm overflow-hidden border border-gray-100"
            >
              <div className="relative h-48">
                <Image
                  src={product.main_image}
                  alt={product.name}
                  fill
                  className="object-cover"
                />
              </div>
              <div className="p-4">
                <h3 className="text-lg font-semibold">{product.name}</h3>
                <p className="text-sm text-gray-500 mt-1">{product.category?.name}</p>
                <div className="mt-4 flex justify-end gap-2">
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className="p-2 text-blue-600 hover:bg-blue-50 rounded-md"
                    onClick={() => onEdit(product)}
                  >
                    <Edit className="w-5 h-5" />
                  </motion.button>
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className="p-2 text-red-600 hover:bg-red-50 rounded-md"
                    onClick={() => handleDelete(product.id)}
                  >
                    <Trash2 className="w-5 h-5" />
                  </motion.button>
                </div>
              </div>
            </motion.div>
          ))
        )}
      </div>
    </div>
  );
} 