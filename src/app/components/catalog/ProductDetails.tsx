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
          Back
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
        <div className="flex flex-col lg:min-h-full">
          <div className="pb-4 border-b border-heaven-lemon">
            <div className="flex flex-col gap-2">
              <div className="flex flex-wrap gap-2">
                {product.category?.name && (
                  <Badge>
                    {product.category.name} (Principal)
                  </Badge>
                )}
                {product.categories?.map((category) => (
                  category.id !== product.category_id && (
                    <Badge key={category.id}>
                      {category.name}
                    </Badge>
                  )
                ))}
              </div>
              <h1 className="text-2xl sm:text-3xl font-bold text-night-lemon">
                {product.name}
              </h1>
            </div>
          </div>

          <div className="mt-4">
            <p className="text-silver-lemon whitespace-pre-line">
              {product.description?.split('\n').map((line, index) => (
                <span key={index} className="block">
                  {line.trim().startsWith('•') ? (
                    <span className="block pl-4 relative">
                      <span className="absolute left-0">{line.trim()[0]}</span>
                      {line.trim().slice(1)}
                    </span>
                  ) : line}
                </span>
              )) || 'No description available'}
            </p>
          </div>

          {/* Botón "Get a quote" al final y ancho completo */}
          <button 
            onClick={() => router.push('/appointment')}
            className="w-full bg-night-lemon text-white py-3 text-sm flex items-center justify-center gap-2 group cursor-pointer hover:bg-night-lemon/90 transition-colors mt-8 lg:mt-auto"
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
    </>
  );
} 