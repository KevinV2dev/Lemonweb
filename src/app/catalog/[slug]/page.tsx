'use client';

import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { mockProducts } from '@/app/data/mockProducts'; // Moveremos los datos mock a un archivo separado

interface ProductPageProps {
  params: {
    slug: string;
  };
}

export default function ProductPage({ params }: ProductPageProps) {
  const router = useRouter();
  const product = mockProducts.find(p => p.slug === params.slug);

  if (!product) {
    return <div>Product not found</div>;
  }

  return (
    <div className="px-[50px] py-[50px]">
      {/* Navegación */}
      <div className="mb-8">
        <button 
          onClick={() => router.back()}
          className="text-gray-600 hover:text-black transition-colors"
        >
          ← Back to Catalog
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
        {/* Imagen del producto */}
        <div className="relative aspect-[4/3] overflow-hidden rounded-lg">
          <Image
            src={product.image}
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
            <span className="text-gray-600">
              {product.category}
            </span>
          </div>

          <div className="space-y-4">
            <p className="text-gray-700">
              {product.description}
            </p>
            
            {/* Aquí podemos agregar más detalles del producto */}
          </div>

          <button 
            onClick={() => router.push('/appointment')}
            className="bg-[#1D1C19] text-white px-8 py-3 rounded-md hover:bg-black transition-colors"
          >
            Schedule a Visit
          </button>
        </div>
      </div>
    </div>
  );
} 