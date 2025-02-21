'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { productService } from '@/supabase/products';
import type { Category } from '@/types';  // Importar tipo desde @/types

interface CategoryTabsProps {
  onCategoryChange: (categoryId: number | null) => void;
}

export function CategoryTabs({ onCategoryChange }: CategoryTabsProps) {
  const [categories, setCategories] = useState<Category[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<number | null>(null);

  useEffect(() => {
    loadCategories();
  }, []);

  const loadCategories = async () => {
    try {
      const data = await productService.getCategories();
      setCategories(data);
    } catch (error) {
      console.error('Error loading categories:', error);
    }
  };

  const handleCategoryClick = (categoryId: number | null) => {
    setSelectedCategory(categoryId);
    onCategoryChange(categoryId);
  };

  return (
    <div className="mb-8">
      <div className="border-b border-gray-200">
        <nav className="-mb-px flex space-x-8" aria-label="Tabs">
          <button
            onClick={() => handleCategoryClick(null)}
            className={`
              whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm
              ${!selectedCategory 
                ? 'border-black text-black'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'}
            `}
          >
            Todos
          </button>
          {categories.map((category) => (
            <button
              key={category.id}
              onClick={() => handleCategoryClick(category.id)}
              className={`
                whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm
                ${selectedCategory === category.id
                  ? 'border-black text-black'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'}
              `}
            >
              {category.name}
            </button>
          ))}
        </nav>
      </div>
    </div>
  );
} 