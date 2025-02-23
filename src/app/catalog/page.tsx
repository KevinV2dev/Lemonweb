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
  const [filteredProducts, setFilteredProducts] = useState<Product[]>([]);

  useEffect(() => {
    const loadData = async () => {
      try {
        const [productsData, categoriesData] = await Promise.all([
          productService.getProducts(true),
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

  useEffect(() => {
    filterProducts();
  }, [products, searchTerm, selectedCategory]);

  const filterProducts = () => {
    let filtered = [...products];

    if (selectedCategory) {
      filtered = filtered.filter(product => 
        product.category?.id.toString() === selectedCategory || 
        product.categories?.some(cat => cat.id.toString() === selectedCategory)
      );
    }

    if (searchTerm) {
      const searchLower = searchTerm.toLowerCase();
      filtered = filtered.filter(product => 
        product.name.toLowerCase().includes(searchLower) ||
        (product.description?.toLowerCase() || '').includes(searchLower) ||
        product.category?.name?.toLowerCase().includes(searchLower) ||
        product.categories?.some(cat => cat.name.toLowerCase().includes(searchLower))
      );
    }

    setFilteredProducts(filtered);
  };

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
