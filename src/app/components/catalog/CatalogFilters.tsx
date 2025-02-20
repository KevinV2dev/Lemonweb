'use client';

import { Category } from '@/supabase/products';

interface CatalogFiltersProps {
  categories: Category[];
  onSearch: (value: string) => void;
  onCategoryChange: (category: string) => void;
}

export function CatalogFilters({ categories, onSearch, onCategoryChange }: CatalogFiltersProps) {
  return (
    <div className="mb-8">
      <div className="flex flex-col sm:flex-row gap-4 justify-between items-start sm:items-center">
        <h1 className="text-2xl font-bold text-[#1D1C19]">
          Our Collection
        </h1>
        
        <div className="flex gap-4">
          <input
            type="text"
            placeholder="Search products..."
            onChange={(e) => onSearch(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-md"
          />
          <select 
            className="px-4 py-2 border border-gray-300 rounded-md"
            onChange={(e) => onCategoryChange(e.target.value)}
          >
            <option value="">All Categories</option>
            {categories.map((category) => (
              <option key={category.id} value={category.id}>
                {category.name}
              </option>
            ))}
          </select>
        </div>
      </div>
    </div>
  );
} 