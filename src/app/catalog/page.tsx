'use client';

import { useState, useEffect } from 'react';
import { productService } from '@/supabase/products';
import type { Product, Category } from '@/types';
import { ProductCard } from '@/app/components/catalog/ProductCard';
import { ProductCardSkeleton } from '@/app/components/catalog/ProductCardSkeleton';
import { CatalogFilters } from '@/app/components/catalog/CatalogFilters';

export default function CatalogPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [isFiltering, setIsFiltering] = useState(false);

  useEffect(() => {
    const loadData = async () => {
      try {
        const [productsData, categoriesData] = await Promise.all([
          productService.getProducts(),
          productService.getCategories()
        ]);
        setProducts(productsData);
        setCategories(categoriesData);
      } catch (error) {
        console.error('Error loading catalog data:', error);
      } finally {
        setIsLoading(false);
      }
    };

    loadData();
  }, []);

  // Efecto para mostrar skeleton durante el filtrado
  useEffect(() => {
    setIsFiltering(true);
    const filterTimer = setTimeout(() => {
      setIsFiltering(false);
    }, 300);

    return () => clearTimeout(filterTimer);
  }, [searchTerm, selectedCategory]);

  const filteredProducts = products.filter(product => {
    const matchesSearch = product.name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = !selectedCategory || product.category?.id.toString() === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const renderSkeletons = () => {
    return Array(8).fill(0).map((_, index) => (
      <ProductCardSkeleton key={`skeleton-${index}`} />
    ));
  };

  return (
    <div className="min-h-screen">
      <div className="sticky top-[88px] md:top-[88px] lg:top-[88px] [@media(min-width:1120px)]:top-[108px] left-0 right-0 z-40 bg-white shadow-sm">
        <CatalogFilters 
          categories={categories}
          onSearch={setSearchTerm}
          onCategoryChange={setSelectedCategory}
        />
      </div>
      <div className="mt-[108px] px-4 py-8">
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
          {isFiltering ? renderSkeletons() : (
            filteredProducts.map((product) => (
              <ProductCard key={product.id} {...product} />
            ))
          )}
        </div>
      </div>
    </div>
  );
}
