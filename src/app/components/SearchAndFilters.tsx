'use client';

import { Search } from 'lucide-react';
import { productService } from '@/supabase/products';
import type { Category } from '@/types';

interface SearchAndFiltersProps {
  categories: Category[];
  searchTerm: string;
  selectedCategory: number | null;
  onSearchChange: (value: string) => void;
  onCategoryChange: (categoryId: number | null) => void;
  totalProducts: number;
}

export function SearchAndFilters({
  categories,
  searchTerm,
  selectedCategory,
  onSearchChange,
  onCategoryChange,
  totalProducts
}: SearchAndFiltersProps) {
  return (
    <div className="border-b border-gray-200">
      <div className="container mx-auto px-4">
        <div className="flex flex-col md:flex-row items-center justify-between py-4 space-y-4 md:space-y-0">
          {/* Barra de búsqueda */}
          <div className="relative w-full md:w-96">
            <input
              type="text"
              placeholder="Search products..."
              value={searchTerm}
              onChange={(e) => onSearchChange(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-full focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent"
            />
            <Search className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
          </div>

          {/* Categorías */}
          <div className="flex flex-wrap justify-center gap-2">
            <button
              onClick={() => onCategoryChange(null)}
              className={`px-4 py-1.5 rounded-full text-sm transition-all ${
                !selectedCategory 
                  ? 'bg-black text-white' 
                  : 'bg-gray-100 hover:bg-gray-200 text-gray-800'
              }`}
            >
              All Products
            </button>

            {categories.map((category) => (
              <button
                key={category.id}
                onClick={() => onCategoryChange(category.id)}
                className={`px-4 py-1.5 rounded-full text-sm transition-all ${
                  selectedCategory === category.id
                    ? 'bg-black text-white'
                    : 'bg-gray-100 hover:bg-gray-200 text-gray-800'
                }`}
              >
                {category.name}
              </button>
            ))}
          </div>

          {/* Contador de resultados */}
          <div className="text-sm text-gray-500 whitespace-nowrap">
            {totalProducts} product{totalProducts !== 1 ? 's' : ''} found
          </div>
        </div>
      </div>
    </div>
  );
} 