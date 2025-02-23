import { useState, useEffect } from 'react';
import { ProductCard } from './ProductCard';
import type { Product } from '@/types';
import { productService } from '@/supabase/products';

interface RecommendedProductsProps {
  currentProduct: Product;
  categoryId: string;
}

export function RecommendedProducts({ currentProduct, categoryId }: RecommendedProductsProps) {
  const [recommendedProducts, setRecommendedProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadRecommendedProducts = async () => {
      try {
        setIsLoading(true);
        // Obtener productos de la misma categoría
        const categoryProducts = await productService.getProductsByCategory(categoryId);
        
        // Filtrar el producto actual y limitar a 4 productos
        const filteredProducts = categoryProducts
          .filter(product => product.id !== currentProduct.id)
          .slice(0, 4);

        setRecommendedProducts(filteredProducts);
      } catch (error) {
        console.error('Error loading recommended products:', error);
      } finally {
        setIsLoading(false);
      }
    };

    if (categoryId) {
      loadRecommendedProducts();
    }
  }, [categoryId, currentProduct.id]);

  if (isLoading) {
    return null;
  }

  if (recommendedProducts.length === 0) {
    return null;
  }

  return (
    <div className="mt-16">
      <h2 className="text-xl sm:text-2xl font-bold text-night-lemon mb-6 sm:mb-8">
       Recommended products

      </h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4 sm:gap-4">
        {recommendedProducts.map((product) => (
          <ProductCard key={product.id} {...product} />
        ))}
      </div>
    </div>
  );
} 