export function ProductCardSkeleton() {
  return (
    <div className="bg-white relative animate-pulse">
      {/* Imagen skeleton */}
      <div className="aspect-[3/2] bg-gray-200" />

      <div className="p-1">
        <div className="p-4 pb-0">
          {/* Título y categoría skeleton */}
          <div className="flex items-center gap-2 mb-2">
            <div className="h-6 bg-gray-200 w-32 rounded" />
            <div className="h-4 bg-gray-200 w-4 rounded-full" />
            <div className="h-4 bg-gray-200 w-20 rounded" />
          </div>

          {/* Descripción skeleton */}
          <div className="space-y-2 mb-4">
            <div className="h-4 bg-gray-200 w-full rounded" />
            <div className="h-4 bg-gray-200 w-3/4 rounded" />
          </div>
        </div>

        {/* Botones skeleton */}
        <div className="flex items-start gap-3 justify-end">
          <div className="h-8 bg-gray-200 w-20 rounded" />
          <div className="h-8 bg-gray-200 w-28 rounded" />
        </div>
      </div>
    </div>
  );
} 