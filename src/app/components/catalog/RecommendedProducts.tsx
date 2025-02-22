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
        // Primero intentamos obtener productos de la misma categoría
        const categoryProducts = await productService.getProductsByCategory(categoryId);
        let filteredProducts = categoryProducts.filter(p => p.id !== currentProduct.id);

        // Si no hay suficientes productos en la misma categoría (menos de 4)
        if (filteredProducts.length < 4) {
          // Obtenemos todos los productos
          const allProducts = await productService.getProducts();
          
          // Filtramos productos que no sean de la categoría actual y que no sean el producto actual
          const otherProducts = allProducts.filter(p => 
            p.id !== currentProduct.id && 
            p.category?.id.toString() !== categoryId
          );

          // Mezclamos los productos de otras categorías
          const shuffledOtherProducts = otherProducts.sort(() => Math.random() - 0.5);

          // Combinamos los productos de la misma categoría con otros hasta tener 4
          filteredProducts = [
            ...filteredProducts,
            ...shuffledOtherProducts.slice(0, 4 - filteredProducts.length)
          ];
        }

        // Barajamos el resultado final
        const shuffledProducts = filteredProducts.sort(() => Math.random() - 0.5);
        
        // Tomamos hasta 4 productos
        const selectedProducts = shuffledProducts.slice(0, 4);
        
        setRecommendedProducts(selectedProducts);
      } catch (error) {
        console.error('Error loading recommended products:', error);
      } finally {
        setIsLoading(false);
      }
    };

    loadRecommendedProducts();
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
        Productos Recomendados
      </h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-4">
        {recommendedProducts.map((product) => (
          <ProductCard key={product.id} {...product} />
        ))}
      </div>
    </div>
  );
} 