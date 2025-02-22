'use client';

import { useRouter } from 'next/navigation';
import { useState, useEffect } from 'react';
import { productService } from '@/supabase/products';
import { toast } from 'react-hot-toast';
import { Navbar } from '@/app/components/ui/navbar';
import { ProductDetails } from '@/app/components/catalog/ProductDetails';
import { RecommendedProducts } from '@/app/components/catalog/RecommendedProducts';
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
      <div className="min-h-screen">
        <Navbar alwaysShowBackground />
        <div className="pt-[92px] px-[50px] pb-[50px] flex items-center justify-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900" />
        </div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="min-h-screen">
        <Navbar alwaysShowBackground />
        <div className="pt-[92px] px-[50px] pb-[50px]">
          <div className="text-center">
            <h1 className="text-2xl font-bold text-night-lemon">Producto no encontrado</h1>
            <button
              onClick={() => router.back()}
              className="mt-4 text-night-lemon hover:text-night-lemon/80 transition-colors"
            >
              ← Volver al catálogo
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen">
      <Navbar alwaysShowBackground />
      <div className="pt-[92px] px-4 sm:px-[50px] pb-[50px]">
        {/* Detalles del producto */}
        <ProductDetails product={product} />

        {/* Productos recomendados */}
        {product.category && (
          <RecommendedProducts 
            currentProduct={product} 
            categoryId={product.category.id.toString()} 
          />
        )}
      </div>
    </div>
  );
} 