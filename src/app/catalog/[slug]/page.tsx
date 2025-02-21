'use client';

import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { useState, useEffect } from 'react';
import { productService } from '@/supabase/products';
import { toast } from 'react-hot-toast';
import React from 'react';
import { Category } from '@/types';
import { getProduct } from '@/supabase/products';
import type { Product } from '@/types';

interface ProductPageProps {
  params: {
    slug: string;
  };
}

export default function ProductPage({ params }: ProductPageProps) {
  const router = useRouter();
  const [product, setProduct] = useState<Product | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadProduct = async () => {
      try {
        const data = await productService.getProductBySlug(params.slug);
        setProduct(data);
      } catch (error) {
        console.error('Error loading product:', error);
        toast.error('Error al cargar el producto');
      } finally {
        setIsLoading(false);
      }
    };

    loadProduct();
  }, [params.slug]);

  if (isLoading) {
    return (
      <div className="px-[50px] py-[50px] flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900" />
      </div>
    );
  }

  if (!product) {
    return (
      <div className="px-[50px] py-[50px]">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900">Producto no encontrado</h1>
          <button
            onClick={() => router.back()}
            className="mt-4 text-indigo-600 hover:text-indigo-800"
          >
            ← Volver al catálogo
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="px-[50px] py-[50px]">
      {/* Navegación */}
      <div className="mb-8">
        <button 
          onClick={() => router.back()}
          className="text-gray-600 hover:text-black transition-colors"
        >
          ← Volver al catálogo
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
        {/* Imagen del producto */}
        <div className="relative aspect-[4/3] overflow-hidden rounded-lg">
          <Image
            src={product.main_image}
            alt={product.name}
            fill
            className="object-cover"
            priority
          />
        </div>

        {/* Información del producto */}
        <div className="space-y-6">
          <div>
            <h1 className="text-3xl font-bold text-[#1D1C19] mb-2">
              {product.name}
            </h1>
            <div className="space-x-2">
              {product.category?.name && (
                <span className="text-gray-600">
                  {product.category.name}
                </span>
              )}
              {product.category?.parent?.name && (
                <>
                  <span className="text-gray-400">•</span>
                  <span className="text-gray-600">
                    {product.category?.parent?.name}
                  </span>
                </>
              )}
            </div>
          </div>

          <div className="space-y-4">
            <p className="text-gray-700">
              {product.description || 'No description available'}
            </p>
          </div>

          <button 
            onClick={() => router.push('/appointment')}
            className="bg-[#1D1C19] text-white px-8 py-3 rounded-md hover:bg-black transition-colors"
          >
            Agendar una visita
          </button>
        </div>
      </div>

      {/* Galería de imágenes adicionales */}
      
    </div>
  );
} 