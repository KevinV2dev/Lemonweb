import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { ArrowLeft } from 'lucide-react';
import { Badge } from '@/app/components/ui/Badge';
import type { Product } from '@/types';

interface ProductDetailsProps {
  product: Product;
}

export function ProductDetails({ product }: ProductDetailsProps) {
  const router = useRouter();

  return (
    <>
      {/* Botón de volver */}
      <div className="mb-8">
        <button 
          onClick={() => router.back()}
          className="bg-night-lemon text-white px-4 py-2 text-sm flex items-center gap-2 group hover:bg-night-lemon/90 transition-colors"
        >
          <ArrowLeft className="w-4 h-4 transition-transform group-hover:-translate-x-1" />
          Volver al catálogo
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 lg:gap-12">
        {/* Imagen del producto */}
        <div className="relative aspect-[4/3] overflow-hidden">
          <Image
            src={product.main_image}
            alt={product.name}
            fill
            className="object-cover"
            priority
          />
        </div>

        {/* Información del producto */}
        <div className="space-y-4">
          <div className="relative pb-4 border-b border-heaven-lemon">
            <div className="flex flex-col gap-2 pr-[140px]">
              {product.category?.name && (
                <Badge>{product.category.name}</Badge>
              )}
              <h1 className="text-2xl sm:text-3xl font-bold text-night-lemon">
                {product.name}
              </h1>
            </div>

            <button 
              onClick={() => router.push('/appointment')}
              className="absolute top-0 right-0 bg-night-lemon text-white px-4 py-2 text-sm flex items-center gap-2 group cursor-pointer hover:bg-night-lemon/90 transition-colors"
            >
              Get a quote
              <span className="transform transition-transform duration-200 ease-out group-hover:translate-x-[2px] group-hover:-translate-y-[2px]">
                <Image
                  src='/icons/Vector.svg'
                  width={12} 
                  height={12}
                  alt="Arrow right"
                  className="pointer-events-none"
                />
              </span>
            </button>
          </div>

          <div className="space-y-4">
            <p className="text-silver-lemon">
              {product.description || 'No description available'}
            </p>
          </div>
        </div>
      </div>
    </>
  );
} 