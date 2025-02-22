'use client';

import { useState, useEffect, useRef } from 'react';
import { Search, ChevronDown } from 'lucide-react';
import type { Category } from '@/types';

import { Navbar } from '@/app/components/ui/navbar';

interface CatalogFiltersProps {
  categories: Category[];
  onSearch: (value: string) => void;
  onCategoryChange: (categoryId: string) => void;
}

export function CatalogFilters({ categories, onSearch, onCategoryChange }: CatalogFiltersProps) {
  const [selectedCategory, setSelectedCategory] = useState<string>('');
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [visibleCategories, setVisibleCategories] = useState<Category[]>([]);
  const [hiddenCategories, setHiddenCategories] = useState<Category[]>([]);
  
  const containerRef = useRef<HTMLDivElement>(null);
  const categoriesContainerRef = useRef<HTMLDivElement>(null);
  const allButtonRef = useRef<HTMLButtonElement>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const updateVisibleCategories = () => {
    if (!containerRef.current || !categoriesContainerRef.current || !allButtonRef.current) return;

    const container = containerRef.current;
    const categoriesContainer = categoriesContainerRef.current;
    const allButton = allButtonRef.current;
    
    // Espacio disponible = ancho total - buscador - padding - botón "All"
    const searchWidth = 256; // Ancho del buscador
    const padding = 32; // Padding total (16px * 2)
    const moreButtonWidth = 100; // Ancho aproximado del botón "Más"
    const allButtonWidth = allButton.offsetWidth;
    const gap = 16; // Espacio entre elementos

    const availableWidth = container.offsetWidth - searchWidth - padding - allButtonWidth - gap - moreButtonWidth;

    // Temporalmente hacemos visibles todas las categorías para medirlas
    setVisibleCategories(categories);
    setHiddenCategories([]);

    // Esperamos al siguiente frame para que el DOM se actualice
    requestAnimationFrame(() => {
      const buttons = Array.from(categoriesContainer.children) as HTMLElement[];
      let totalWidth = 0;
      let lastVisibleIndex = -1;

      // Empezamos desde 1 porque el índice 0 es el botón "All"
      for (let i = 1; i < buttons.length; i++) {
        const button = buttons[i];
        const buttonWidth = button.offsetWidth + gap;

        if (totalWidth + buttonWidth <= availableWidth) {
          totalWidth += buttonWidth;
          lastVisibleIndex = i - 1; // Restamos 1 porque empezamos desde el índice 1
        } else {
          break;
        }
      }

      // Actualizamos las categorías visibles y ocultas
      setVisibleCategories(categories.slice(0, lastVisibleIndex + 1));
      setHiddenCategories(categories.slice(lastVisibleIndex + 1));
    });
  };

  useEffect(() => {
    const observer = new ResizeObserver(() => {
      updateVisibleCategories();
    });

    if (containerRef.current) {
      observer.observe(containerRef.current);
    }

    return () => observer.disconnect();
  }, [categories]);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setIsDropdownOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleCategorySelect = (categoryId: string) => {
    setSelectedCategory(categoryId);
    onCategoryChange(categoryId);
    setIsDropdownOpen(false);
  };

  return (
    <header className="w-full bg-white border-b border-gray-200">
      <Navbar alwaysShowBackground />
      <div className="max-w-[1920px] px-4">
        <div ref={containerRef} className="flex [@media(min-width:1120px)]:flex-row flex-col py-4 [@media(min-width:1120px)]:py-4 gap-4">
          {/* Buscador */}
          <div className="[@media(min-width:1120px)]:w-64 w-full flex-shrink-0">
            <div className="relative">
              <input
                type="text"
                placeholder="Search products..."
                onChange={(e) => onSearch(e.target.value)}
                className="w-full h-10 pl-10 pr-4 bg-gray-50 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent"
              />
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
            </div>
          </div>

          {/* Contenedor de categorías */}
          <div className="flex-1 flex items-center gap-4 min-w-0">
            <div 
              ref={categoriesContainerRef}
              className="flex items-center gap-4 min-w-0 overflow-hidden"
            >
              {/* Botón "All" */}
              <button
                ref={allButtonRef}
                onClick={() => handleCategorySelect('')}
                className={`
                  px-4 h-10 rounded-lg text-sm font-medium transition-all whitespace-nowrap flex-shrink-0
                  ${selectedCategory === '' 
                    ? 'bg-black text-white' 
                    : 'bg-gray-50 hover:bg-gray-100 text-gray-700'
                  }
                `}
              >
                All Categories
              </button>

              {/* Categorías visibles */}
              {visibleCategories.map((category) => (
                <button
                  key={category.id}
                  onClick={() => handleCategorySelect(category.id.toString())}
                  className={`
                    px-4 h-10 rounded-lg text-sm font-medium transition-all whitespace-nowrap
                    ${selectedCategory === category.id.toString()
                      ? 'bg-black text-white'
                      : 'bg-gray-50 hover:bg-gray-100 text-gray-700'
                    }
                  `}
                >
                  {category.name}
                </button>
              ))}
            </div>

            {/* Botón "More" y dropdown */}
            {hiddenCategories.length > 0 && (
              <div className="relative flex-shrink-0">
                <button
                  onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                  className={`
                    px-4 h-10 rounded-lg text-sm font-medium transition-all whitespace-nowrap
                    flex items-center gap-2
                    ${isDropdownOpen 
                      ? 'bg-black text-white' 
                      : 'bg-gray-50 hover:bg-gray-100 text-gray-700'
                    }
                  `}
                >
                  More
                  <ChevronDown className={`w-4 h-4 transition-transform duration-200 ${isDropdownOpen ? 'rotate-180' : ''}`} />
                </button>

                {isDropdownOpen && (
                  <div
                    ref={dropdownRef}
                    className="absolute right-0 mt-2 py-2 w-56 bg-white rounded-lg shadow-xl border border-gray-200 z-[51]"
                  >
                    {hiddenCategories.map((category) => (
                      <button
                        key={category.id}
                        onClick={() => handleCategorySelect(category.id.toString())}
                        className={`
                          w-full px-4 py-2 text-sm text-left transition-colors
                          ${selectedCategory === category.id.toString()
                            ? 'bg-gray-100 text-black font-medium'
                            : 'text-gray-700 hover:bg-gray-50'
                          }
                        `}
                      >
                        {category.name}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
} 