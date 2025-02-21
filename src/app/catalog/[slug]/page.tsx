'use client';

import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { useState, useEffect } from 'react';
import { Product, productService } from '@/supabase/products';
import { toast } from 'react-hot-toast';

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
              <span className="text-gray-600">
                {product.category?.name}
              </span>
              {product.category?.parent_id && (
                <>
                  <span className="text-gray-400">•</span>
                  <span className="text-gray-600">
                    {product.category?.name}
                  </span>
                </>
              )}
            </div>
          </div>

          <div className="space-y-4">
            <p className="text-gray-700">
              {product.description}
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
      {product.additional_images && product.additional_images.length > 0 && (
        <div className="mt-12">
          <h2 className="text-2xl font-semibold mb-6">Más imágenes</h2>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {product.additional_images.map((image) => (
              <div key={image.id} className="relative aspect-square rounded-lg overflow-hidden">
                <Image
                  src={image.image_url}
                  alt={product.name}
                  fill
                  className="object-cover hover:scale-105 transition-transform duration-300"
                />
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
} 