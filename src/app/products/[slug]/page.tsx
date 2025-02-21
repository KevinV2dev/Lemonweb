'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import { Product, productService } from '@/supabase/products';

async function getProduct(slug: string) {
  try {
    const product = await productService.getProductBySlug(slug);
    return product;
  } catch (error) {
    console.error('Error fetching product:', error);
    return null;
  }
}

export default function ProductPage({ params }: { params: { slug: string } }) {
  const [product, setProduct] = useState<Product | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function loadProduct() {
      const data = await getProduct(params.slug);
      setProduct(data);
      setIsLoading(false);
    }
    loadProduct();
  }, [params.slug]);

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (!product) {
    return <div>Product not found</div>;
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Imagen del producto */}
        <div className="relative aspect-square w-full">
          <Image
            src={product.main_image}
            alt={product.name}
            fill
            className="object-cover rounded-lg"
            priority
          />
        </div>

        {/* Información del producto */}
        <div className="space-y-6">
          <h1 className="text-3xl font-bold text-gray-900">{product.name}</h1>
          <div className="prose max-w-none">
            <p className="text-gray-600">{product.description}</p>
          </div>
          <div>
            <h2 className="text-lg font-medium text-gray-900">Categoría</h2>
            <p className="mt-1 text-gray-600">{product.category?.name}</p>
          </div>
        </div>
      </div>
    </div>
  );
} 