'use client';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import type { Product } from '@/types';

type ProductCardProps = Product;

export function ProductCard({ name, description, main_image, slug, category }: ProductCardProps) {
  const router = useRouter();

  return (
    <div className="bg-white rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-shadow">
      {/* Imagen del producto */}
      <div className="relative aspect-[4/3] overflow-hidden">
        <Image
          src={main_image}
          alt={name}
          fill
          className="object-cover hover:scale-105 transition-transform duration-300"
        />
      </div>

      {/* Información del producto */}
      <div className="p-6">
        <div className="mb-2">
          <h3 className="text-xl font-semibold text-[#1D1C19]">
            {name}
          </h3>
          <span className="text-sm text-gray-500">
            {category?.name}
          </span>
        </div>
        <p className="text-gray-600 mb-4 line-clamp-2">
          {description}
        </p>
        <button 
          onClick={() => router.push(`/catalog/${slug}`)}
          className="bg-[#1D1C19] text-white px-6 py-2 rounded-md hover:bg-black transition-colors"
        >
          View Details
        </button>
      </div>
    </div>
  );
} 