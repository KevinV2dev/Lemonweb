'use client';

import React from 'react';
import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { productService } from '@/supabase/products';
import type { Product } from '@/types';
import { toast } from 'react-hot-toast';
import { X, Edit2, Trash2, Image as ImageIcon } from 'lucide-react';
import Image from 'next/image';

interface ProductDetailProps {
  productId: number;
  onClose: () => void;
  onEdit: (product: Product) => void;
  onDelete: (productId: number) => void;
}

export function ProductDetail({ productId, onClose, onEdit, onDelete }: ProductDetailProps) {
  const [product, setProduct] = useState<Product | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  useEffect(() => {
    loadProduct();
    // Prevenir scroll en el body
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [productId]);

  const loadProduct = async () => {
    try {
      const data = await productService.getProducts();
      const productWithCategories = data.find(p => p.id === productId);
      if (productWithCategories) {
        setProduct(productWithCategories);
      }
    } catch (error) {
      toast.error('Error loading product');
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading) {
    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-white" />
      </div>
    );
  }

  if (!product) return null;

  const images = [product.main_image, ...(product.additional_images?.map(img => img.image_url) || [])];

  return (
    <div className="fixed inset-0 z-50">
      <div className="absolute inset-0 bg-black bg-opacity-50" onClick={onClose} />
      
      {/* Modal Container */}
      <div className="fixed inset-0 pointer-events-none p-4">
        <div className="flex items-center justify-center min-h-full">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="relative bg-white w-[calc(100%-32px)] max-w-4xl rounded-lg shadow-xl pointer-events-auto max-h-[calc(100vh-32px)] flex flex-col"
          >
            {/* Header - Fixed */}
            <div className="flex-none border-b border-gray-200 rounded-t-lg">
              <div className="flex justify-between items-center p-4">
                <h2 className="text-xl font-semibold text-night-lemon">Product Details</h2>
                <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* Content - Scrollable */}
            <div 
              className="overflow-y-auto flex-1"
              onWheel={(e) => {
                if (e.target instanceof HTMLElement) {
                  const element = e.currentTarget;
                  const isScrollable = element.scrollHeight > element.clientHeight;
                  if (isScrollable) {
                    e.stopPropagation();
                  }
                }
              }}
              style={{
                scrollbarWidth: 'thin',
                scrollbarColor: '#CBD5E0 transparent'
              }}
            >
              <div className="p-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Image Gallery */}
                  <div className="space-y-4">
                    <div className="relative aspect-square bg-gray-100 border border-gray-200">
                      <Image
                        src={images[currentImageIndex]}
                        alt={product.name}
                        fill
                        className="object-contain"
                      />
                    </div>
                    
                    {images.length > 1 && (
                      <div className="grid grid-cols-4 gap-2">
                        {images.map((image, index) => (
                          <button
                            key={index}
                            onClick={() => setCurrentImageIndex(index)}
                            className={`relative aspect-square bg-gray-100 border ${
                              currentImageIndex === index ? 'border-night-lemon' : 'border-gray-200'
                            }`}
                          >
                            <Image
                              src={image}
                              alt={`${product.name} ${index + 1}`}
                              fill
                              className="object-contain"
                            />
                          </button>
                        ))}
                      </div>
                    )}
                  </div>

                  {/* Product Details */}
                  <div className="space-y-6">
                    <div>
                      <h3 className="text-sm font-medium text-silver-lemon mb-1">Description</h3>
                      <p className="text-night-lemon">{product.description || 'No description'}</p>
                    </div>

                    <div>
                      <h3 className="text-sm font-medium text-silver-lemon mb-1">Category</h3>
                      <div className="flex flex-wrap gap-2">
                        {product.categories?.map((category) => (
                          <span 
                            key={category.id} 
                            className={`inline-flex items-center px-3 py-1 text-sm font-medium ${
                              category.id === product.category_id 
                                ? 'bg-night-lemon text-white'
                                : 'bg-gray-100 text-night-lemon'
                            }`}
                          >
                            {category.name}
                            {category.id === product.category_id && (
                              <span className="ml-2 text-xs text-white/75">(Principal)</span>
                            )}
                          </span>
                        ))}
                      </div>
                    </div>

                    <div>
                      <h3 className="text-sm font-medium text-silver-lemon mb-1">Status</h3>
                      <span className={`inline-flex items-center px-3 py-1 text-sm font-medium ${
                        product.status === 'published'
                          ? 'bg-green-100 text-green-800'
                          : product.status === 'draft'
                          ? 'bg-gray-100 text-gray-800'
                          : product.status === 'out_of_stock'
                          ? 'bg-red-100 text-red-800'
                          : 'bg-yellow-100 text-yellow-800'
                      }`}>
                        {product.status === 'published' && 'Published'}
                        {product.status === 'draft' && 'Draft'}
                        {product.status === 'out_of_stock' && 'Out of Stock'}
                        {product.status === 'review' && 'Under Review'}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Footer - Fixed */}
            <div className="flex-none border-t border-gray-200">
              <div className="flex justify-end gap-3 p-4">
                <button
                  onClick={() => onEdit(product)}
                  className="inline-flex items-center px-4 py-2 bg-night-lemon text-white hover:bg-night-lemon/90 transition-colors gap-2"
                >
                  <Edit2 size={16} />
                  Edit
                </button>
                <button
                  onClick={() => {
                    if (window.confirm('Are you sure you want to delete this product?')) {
                      onDelete(product.id);
                    }
                  }}
                  className="inline-flex items-center px-4 py-2 bg-red-600 text-white hover:bg-red-700 transition-colors gap-2"
                >
                  <Trash2 size={16} />
                  Delete
                </button>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
} 