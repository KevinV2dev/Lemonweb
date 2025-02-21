'use client';

import React from 'react';
import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { productService } from '@/supabase/products';
import type { Product } from '@/types';
import { toast } from 'react-hot-toast';
import { X, Edit, Trash, Image as ImageIcon } from 'lucide-react';
import Image from 'next/image';

interface ProductDetailProps {
  productId: number;
  onClose: () => void;
  onEdit: (product: Product) => void;
  onDelete: (productId: number) => void;
}

export function ProductDetail({ productId, onClose, onEdit, onDelete }: ProductDetailProps) {
  const [product, setProduct] = useState<Product | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  useEffect(() => {
    loadProduct();
  }, [productId]);

  const loadProduct = async () => {
    try {
      const data = await productService.getProductById(productId);
      setProduct(data);
    } catch (error) {
      toast.error('Error al cargar el producto');
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading) {
    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-white" />
      </div>
    );
  }

  if (!product) return null;

  const images = [product.main_image, ...(product.additional_images?.map(img => img.image_url) || [])];

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white rounded-lg w-full max-w-4xl shadow-xl overflow-hidden"
      >
        <div className="flex justify-between items-center p-6 border-b">
          <h2 className="text-2xl font-semibold">{product.name}</h2>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
            <X className="w-6 h-6" />
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 p-6">
          {/* Galería de imágenes */}
          <div className="space-y-4">
            <div className="relative aspect-square rounded-lg overflow-hidden bg-gray-100">
              <Image
                src={images[currentImageIndex]}
                alt={product.name}
                fill
                className="object-cover"
              />
            </div>
            
            {images.length > 1 && (
              <div className="grid grid-cols-4 gap-2">
                {images.map((image, index) => (
                  <button
                    key={index}
                    onClick={() => setCurrentImageIndex(index)}
                    className={`relative aspect-square rounded-md overflow-hidden ${
                      currentImageIndex === index ? 'ring-2 ring-black' : ''
                    }`}
                  >
                    <Image
                      src={image}
                      alt={`${product.name} ${index + 1}`}
                      fill
                      className="object-cover"
                    />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Detalles del producto */}
          <div className="space-y-6">
            <div>
              <h3 className="text-lg font-medium">Descripción</h3>
              <p className="text-gray-600 mt-2">{product.description || 'Sin descripción'}</p>
            </div>

            <div>
              <h3 className="text-lg font-medium">Categoría</h3>
              <p className="text-gray-600 mt-2">{product.category?.name}</p>
            </div>

            <div>
              <h3 className="text-lg font-medium">Estado</h3>
              <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${
                product.active ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
              }`}>
                {product.active ? 'Activo' : 'Inactivo'}
              </span>
            </div>

            <div className="flex gap-4 pt-6">
              <button
                onClick={() => onEdit(product)}
                className="flex items-center gap-2 px-4 py-2 bg-black text-white rounded-md hover:bg-gray-800"
              >
                <Edit className="w-4 h-4" />
                Editar
              </button>
              <button
                onClick={() => {
                  if (window.confirm('¿Estás seguro de que quieres eliminar este producto?')) {
                    onDelete(product.id);
                  }
                }}
                className="flex items-center gap-2 px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700"
              >
                <Trash className="w-4 h-4" />
                Eliminar
              </button>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
} 