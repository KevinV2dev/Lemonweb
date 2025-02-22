'use client';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { Badge } from '@/app/components/ui/Badge';
import type { Product } from '@/types';

export function ProductCard(product: Product) {
  const router = useRouter();

  return (
    <div className="bg-white relative group">
      {/* Borde animado */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute inset-0 w-[calc(100%+2px)] h-[calc(100%+2px)] -translate-x-[1px] -translate-y-[1px] transition-opacity duration-300 ease-in-out opacity-0 group-hover:opacity-100">
          <div className="absolute top-0 left-0 w-0 h-[1px] bg-heaven-lemon group-hover:w-full transition-[width] duration-[300ms] ease-in-out [transition-property:width]" />
          <div className="absolute top-0 right-0 w-[1px] h-0 bg-heaven-lemon group-hover:h-full transition-[height] duration-[300ms] delay-[300ms] ease-in-out [transition-property:height]" />
          <div className="absolute bottom-0 right-0 w-0 h-[1px] bg-heaven-lemon group-hover:w-full transition-[width] duration-[300ms] delay-[600ms] ease-in-out [transition-property:width]" style={{ transformOrigin: 'right' }} />
          <div className="absolute bottom-0 left-0 w-[1px] h-0 bg-heaven-lemon group-hover:h-full transition-[height] duration-[300ms] delay-[900ms] ease-in-out [transition-property:height]" />
        </div>
      </div>

      <div className="p-2 relative z-10">
        {/* Imagen */}
        <div 
          className="relative aspect-[3/2] overflow-hidden cursor-pointer"
          onClick={() => router.push(`/catalog/${product.slug}`)}
        >
          <Image
            src={product.main_image}
            alt={product.name}
            fill
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            quality={90}
            priority={false}
            className="object-cover"
          />
        </div>

        {/* Contenido */}
        <div className="relative">
          {/* Categorías */}
          <div className="p-4 pb-2">
            <div className="flex flex-wrap gap-1.5 mb-3">
              {product.categories ? (
                <>
                  {product.categories.slice(0, 3).map((category) => (
                    <Badge key={category.id}>
                      {category.name}
                    </Badge>
                  ))}
                  {product.categories.length > 3 && (
                    <Badge>
                      +{product.categories.length - 3}
                    </Badge>
                  )}
                </>
              ) : product.category?.name && (
                <Badge>
                  {product.category.name}
                </Badge>
              )}
            </div>

            {/* Título y descripción */}
            <div className="space-y-2">
              <h3 className="text-lg font-medium text-night-lemon line-clamp-1">
                {product.name}
              </h3>
              <p className="text-sm text-silver-lemon line-clamp-2 whitespace-pre-line">
                {product.description?.split('\n')
                  .filter(line => line.trim())
                  .slice(0, 2)
                  .map(line => line.trim().startsWith('•') ? line.trim().slice(1).trim() : line)
                  .join(' • ')}
              </p>
            </div>
          </div>

          {/* Botones */}
          <div className="p-4 pt-2 flex items-start gap-3 justify-end relative z-20">
            <button 
              onClick={() => router.push(`/catalog/${product.slug}`)}
              className="bg-night-lemon text-white px-4 py-2 text-sm cursor-pointer hover:bg-night-lemon/90 transition-colors"
            >
              Details
            </button>

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
      </div>
    </div>
  );
} 