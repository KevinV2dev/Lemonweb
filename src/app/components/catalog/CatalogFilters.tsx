'use client';

import { useState, useEffect, useRef } from 'react';
import { Search, ChevronDown } from 'lucide-react';
import { Category } from '@/supabase/products';
import { motion, AnimatePresence } from 'framer-motion';

interface CatalogFiltersProps {
  categories: Category[];
  onSearch: (value: string) => void;
  onCategoryChange: (categoryId: string) => void;
}

export function CatalogFilters({ categories, onSearch, onCategoryChange }: CatalogFiltersProps) {
  const [visibleCategories, setVisibleCategories] = useState<Category[]>([]);
  const [overflowCategories, setOverflowCategories] = useState<Category[]>([]);
  const [showMoreMenu, setShowMoreMenu] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<string>('');
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    calculateVisibleCategories();
    window.addEventListener('resize', calculateVisibleCategories);
    return () => window.removeEventListener('resize', calculateVisibleCategories);
  }, [categories]);

  const calculateVisibleCategories = () => {
    if (!containerRef.current) return;
    
    const containerWidth = containerRef.current.offsetWidth;
    const minCategoryWidth = 100; // Ancho mínimo por categoría
    const maxVisible = Math.floor(containerWidth / minCategoryWidth);

    // Si hay espacio suficiente, mostrar todas las categorías
    if (maxVisible >= categories.length) {
      setVisibleCategories(categories);
      setOverflowCategories([]);
    } else {
      // Si no hay espacio suficiente, mover el resto al menú More
      setVisibleCategories(categories.slice(0, maxVisible - 1)); // -1 para dejar espacio al botón More
      setOverflowCategories(categories.slice(maxVisible - 1));
    }
  };

  const handleCategoryClick = (categoryId: string) => {
    setSelectedCategory(categoryId);
    onCategoryChange(categoryId);
    setShowMoreMenu(false);
  };

  return (
    <div className="sticky top-0 z-50 bg-white border-b border-gray-200 shadow-sm">
      <div className="container px-4">
        <div className="flex items-center h-16">
          {/* Buscador */}
          <div className="relative w-64 flex-shrink-0">
            <input
              type="text"
              placeholder="Search products..."
              onChange={(e) => onSearch(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-full focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent"
            />
            <Search className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
          </div>

          {/* Categorías */}
          <div 
            ref={containerRef}
            className="flex items-center gap-4 ml-4 overflow-x-hidden flex-grow"
          >
            <button
              onClick={() => handleCategoryClick('')}
              className={`px-3 py-1.5 rounded-full text-sm transition-all whitespace-nowrap flex-shrink-0 ${
                selectedCategory === ''
                  ? 'bg-black text-white' 
                  : 'bg-gray-100 hover:bg-gray-200 text-gray-800'
              }`}
            >
              All
            </button>

            {visibleCategories.map((category) => (
              <button
                key={category.id}
                onClick={() => handleCategoryClick(category.id.toString())}
                className={`px-3 py-1.5 rounded-full text-sm transition-all whitespace-nowrap flex-shrink-0 ${
                  selectedCategory === category.id.toString()
                    ? 'bg-black text-white'
                    : 'bg-gray-100 hover:bg-gray-200 text-gray-800'
                }`}
              >
                {category.name}
              </button>
            ))}

            {overflowCategories.length > 0 && (
              <div className="relative flex-shrink-0">
                <button
                  onClick={() => setShowMoreMenu(!showMoreMenu)}
                  className="px-3 py-1.5 rounded-full bg-gray-100 hover:bg-gray-200 text-gray-800 flex items-center gap-1 text-sm"
                >
                  More
                  <ChevronDown className={`w-4 h-4 transition-transform ${showMoreMenu ? 'rotate-180' : ''}`} />
                </button>

                <AnimatePresence>
                  {showMoreMenu && (
                    <motion.div
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: 10 }}
                      className="absolute top-full right-0 mt-2 py-2 w-48 bg-white rounded-lg shadow-xl border border-gray-200 z-50"
                    >
                      {overflowCategories.map((category) => (
                        <button
                          key={category.id}
                          onClick={() => handleCategoryClick(category.id.toString())}
                          className={`w-full text-left px-4 py-2 text-sm ${
                            selectedCategory === category.id.toString()
                              ? 'bg-gray-100 text-black'
                              : 'text-gray-700 hover:bg-gray-50'
                          }`}
                        >
                          {category.name}
                        </button>
                      ))}
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
} 