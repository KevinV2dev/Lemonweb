'use client';

import { useState, useEffect } from 'react';
import { productService } from '@/supabase/products';
import type { Product, Category } from '@/types';
import { ProductCard } from '@/app/components/catalog/ProductCard';
import { ProductCardSkeleton } from '@/app/components/catalog/ProductCardSkeleton';
import { CatalogFilters } from '@/app/components/catalog/CatalogFilters';
import { Navbar } from '@/app/components/ui/navbar';

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

  if (isLoading) {
    return (
      <div className="min-h-screen">
        <Navbar alwaysShowBackground />
        <div className="fixed top-[72px] left-0 right-0 z-40 bg-white shadow-sm">
          <CatalogFilters 
            categories={[]}
            onSearch={() => {}}
            onCategoryChange={() => {}}
          />
        </div>
        <div className="pt-[172px] px-[50px] pb-[50px]">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {renderSkeletons()}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen">
      <Navbar alwaysShowBackground />
      <div className="fixed top-[72px] left-0 right-0 z-40 bg-white shadow-sm">
        <CatalogFilters 
          categories={categories}
          onSearch={setSearchTerm}
          onCategoryChange={setSelectedCategory}
        />
      </div>
      <div className="pt-[172px] px-[50px] pb-[50px]">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
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
