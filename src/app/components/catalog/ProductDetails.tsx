import Image from 'next/image';
import { useRouter } from 'next/navigation';
import type { Product } from '@/types';

interface ProductDetailsProps {
  product: Product;
}

export function ProductDetails({ product }: ProductDetailsProps) {
  const router = useRouter();

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
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
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold text-night-lemon mb-2">
            {product.name}
          </h1>
          <div className="space-x-2">
            {product.category?.name && (
              <span className="text-silver-lemon">
                {product.category.name}
              </span>
            )}
            {product.category?.parent?.name && (
              <>
                <span className="text-silver-lemon">•</span>
                <span className="text-silver-lemon">
                  {product.category?.parent?.name}
                </span>
              </>
            )}
          </div>
        </div>

        <div className="space-y-4">
          <p className="text-silver-lemon">
            {product.description || 'No description available'}
          </p>
        </div>

        <button 
          onClick={() => router.push('/appointment')}
          className="bg-night-lemon text-white px-4 py-2 text-sm flex items-center gap-2 group cursor-pointer hover:bg-night-lemon/90 transition-colors"
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
    </div>
  );
} 