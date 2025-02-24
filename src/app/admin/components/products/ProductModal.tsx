'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { X, Upload, Trash, Plus, Replace } from 'lucide-react';
import { toast } from 'react-hot-toast';
import { productService } from '@/supabase/products';
import type { Product, Category } from '@/types';
import Image from 'next/image';

interface ProductModalProps {
  isOpen: boolean;
  onClose: () => void;
  product?: Product;
  onSave: () => void;
}

export function ProductModal({ isOpen, onClose, product, onSave }: ProductModalProps) {
  const initialFormState = {
    name: product?.name || '',
    slug: product?.slug || '',
    description: product?.description || '',
    category_id: product?.category_id?.toString() || '',
    selectedCategories: product?.categories || [],
    main_image: product?.main_image || '',
    status: product?.status || 'draft',
    additional_images: product?.additional_images || []
  };

  const [formData, setFormData] = useState(initialFormState);
  const [categories, setCategories] = useState<Category[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [selectedImage, setSelectedImage] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string>('');
  const [isUploading, setIsUploading] = useState(false);

  useEffect(() => {
    loadCategories();
    if (product) {
      console.log('Producto recibido en modal:', product);
      setFormData({
        name: product.name,
        slug: product.slug,
        description: product.description || '',
        category_id: product.category_id?.toString() || '',
        selectedCategories: product.categories || [],
        main_image: product.main_image,
        status: product.status,
        additional_images: product.additional_images || []
      });
      setImagePreview(product.main_image);
    } else {
      setFormData(initialFormState);
      setSelectedImage(null);
      setImagePreview('');
    }
  }, [product, isOpen]);

  // Manejar el scroll del body cuando el modal está abierto
  useEffect(() => {
    if (isOpen) {
      document.body.classList.add('modal-open');
    } else {
      document.body.classList.remove('modal-open');
    }

    return () => {
      document.body.classList.remove('modal-open');
    };
  }, [isOpen]);

  const loadCategories = async () => {
    try {
      const data = await productService.getCategories();
      console.log('Categorías cargadas:', data);
      setCategories(data);
    } catch (error) {
      toast.error('Error loading categories');
      console.error(error);
    }
  };

  const handleImageSelect = (file: File) => {
    setSelectedImage(file);
    const previewUrl = URL.createObjectURL(file);
    setImagePreview(previewUrl);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (isLoading) return;

    try {
      setIsLoading(true);
      console.log('Estado del formulario antes de enviar:', formData);

      let mainImageUrl = formData.main_image;
      if (selectedImage) {
        setIsUploading(true);
        try {
          mainImageUrl = await productService.uploadProductImage(selectedImage);
        } catch (error) {
          console.error('Error uploading image:', error);
          toast.error('Error uploading image');
          return;
        } finally {
          setIsUploading(false);
        }
      }

      const productData = {
        name: formData.name,
        slug: formData.slug || formData.name
          .toLowerCase()
          .normalize('NFD')
          .replace(/[\u0300-\u036f]/g, '')  // Eliminar acentos
          .replace(/[^a-z0-9-]/g, '-')      // Reemplazar caracteres no alfanuméricos por guiones
          .replace(/-+/g, '-')              // Reemplazar múltiples guiones por uno solo
          .replace(/^-+|-+$/g, ''),         // Eliminar guiones al inicio y final
        description: formData.description,
        main_image: mainImageUrl,
        status: formData.status,
        category_id: formData.selectedCategories[0]?.id,
        categories: formData.selectedCategories.map(cat => ({
          id: cat.id,
          name: cat.name,
          slug: cat.slug,
          display_order: cat.display_order
        }))
      };

      console.log('Datos del producto a enviar:', productData);

      if (product) {
        if (selectedImage && product.main_image) {
          try {
            await productService.deleteProductImage(product.main_image);
          } catch (error) {
            console.error('Error deleting old image:', error);
          }
        }
        await productService.updateProduct(product.id, productData);
      } else {
        await productService.createProduct(productData as Omit<Product, 'id' | 'created_at' | 'updated_at'>);
      }

      toast.success(product ? 'Product updated successfully' : 'Product created successfully');
      onClose();
      if (onSave) onSave();
    } catch (error) {
      console.error('Error saving product:', error);
      toast.error('Error saving product');
    } finally {
      setIsLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white w-full max-w-4xl rounded-lg flex flex-col max-h-[90vh]"
      >
        <div className="flex-none p-6 border-b border-gray-200">
          <div className="flex justify-between items-center">
            <h2 className="text-xl font-semibold text-night-lemon">
              {product ? 'Edit Product' : 'New Product'}
            </h2>
            <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        <div 
          className="flex-1 overflow-y-auto p-6"
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
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Left column */}
              <div className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Name
                  </label>
                  <input
                    type="text"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-200 focus:outline-none focus:ring-2 focus:ring-night-lemon focus:border-transparent"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Description
                    <span className="text-xs text-gray-500 ml-2">
                      (Use • al inicio de línea para crear viñetas)
                    </span>
                  </label>
                  <div className="relative">
                    <div className="absolute right-2 top-2 flex gap-2 z-10">
                      <button
                        type="button"
                        onClick={() => {
                          const textarea = document.getElementById('description-textarea') as HTMLTextAreaElement;
                          if (!textarea) return;

                          const start = textarea.selectionStart;
                          const end = textarea.selectionEnd;
                          const text = textarea.value;
                          
                          // Si estamos al inicio de una línea o es la primera línea
                          const isStartOfLine = start === 0 || text.charAt(start - 1) === '\n';
                          const newText = isStartOfLine
                            ? text.slice(0, start) + '• ' + text.slice(end)
                            : text.slice(0, start) + '\n• ' + text.slice(end);

                          setFormData({ ...formData, description: newText });
                          
                          // Ajustar el cursor después de la viñeta
                          setTimeout(() => {
                            const newPosition = isStartOfLine ? start + 2 : start + 3;
                            textarea.setSelectionRange(newPosition, newPosition);
                            textarea.focus();
                          }, 0);
                        }}
                        className="p-1.5 bg-gray-100 hover:bg-gray-200 text-gray-600 text-sm flex items-center gap-1"
                      >
                        <span className="text-lg leading-none">•</span>
                        <span className="text-xs">Añadir viñeta</span>
                      </button>
                    </div>
                    <textarea
                      id="description-textarea"
                      value={formData.description}
                      onChange={(e) => {
                        let value = e.target.value;
                        value = value.split('\n').map(line => {
                          if (line.trim().startsWith('•')) {
                            return line;
                          } else if (line.trim().startsWith('*')) {
                            return line.replace('*', '•');
                          }
                          return line;
                        }).join('\n');
                        setFormData({ ...formData, description: value });
                      }}
                      onWheel={(e) => {
                        if (e.target instanceof HTMLTextAreaElement) {
                          const textarea = e.target;
                          const isScrollable = textarea.scrollHeight > textarea.clientHeight;
                          if (isScrollable) {
                            e.stopPropagation();
                          }
                        }
                      }}
                      className="w-full px-3 py-2 pr-28 border border-gray-200 focus:outline-none focus:ring-2 focus:ring-night-lemon focus:border-transparent min-h-[150px] resize-y overflow-y-auto"
                      style={{
                        scrollbarWidth: 'thin',
                        scrollbarColor: '#CBD5E0 transparent'
                      }}
                      rows={6}
                      placeholder="Describe el producto...&#10;• Usa viñetas para características&#10;• Cada línea que empiece con • o * se convertirá en viñeta"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Categories
                  </label>
                  <div className="space-y-2">
                    <div className="flex flex-wrap gap-2">
                      {formData.selectedCategories.map((category) => (
                        <div 
                          key={category.id}
                          className="bg-gray-100 px-3 py-1 flex items-center gap-2"
                        >
                          <span>{category.name}</span>
                          <button
                            type="button"
                            onClick={() => setFormData(prev => ({
                              ...prev,
                              selectedCategories: prev.selectedCategories.filter(c => c.id !== category.id)
                            }))}
                            className="text-gray-500 hover:text-gray-700"
                          >
                            ×
                          </button>
                        </div>
                      ))}
                    </div>

                    <div className="flex gap-2">
                      <select
                        value=""
                        onChange={(e) => {
                          const categoryId = parseInt(e.target.value);
                          if (categoryId) {
                            const category = categories.find(c => c.id === categoryId);
                            if (category && !formData.selectedCategories.some(c => c.id === category.id)) {
                              setFormData(prev => ({
                                ...prev,
                                selectedCategories: [...prev.selectedCategories, category]
                              }));
                            }
                          }
                          e.target.value = "";
                        }}
                        className="flex-1 px-3 py-2 border border-gray-200 focus:outline-none focus:ring-2 focus:ring-night-lemon focus:border-transparent"
                      >
                        <option value="">Add category</option>
                        {categories
                          .filter(category => !formData.selectedCategories.some(c => c.id === category.id))
                          .map((category) => (
                            <option key={category.id} value={category.id}>
                              {category.name}
                            </option>
                          ))
                        }
                      </select>
                    </div>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Status
                  </label>
                  <select
                    value={formData.status}
                    onChange={(e) => setFormData({ ...formData, status: e.target.value as 'published' | 'draft' | 'out_of_stock' | 'review' })}
                    className="w-full px-3 py-2 border border-gray-200 focus:outline-none focus:ring-2 focus:ring-night-lemon focus:border-transparent"
                  >
                    <option value="published">Published (Visible in catalog)</option>
                    <option value="draft">Draft (Hidden from catalog)</option>
                    <option value="out_of_stock">Out of Stock (Hidden from catalog)</option>
                    <option value="review">Under Review (Hidden from catalog)</option>
                  </select>
                  <p className="mt-1 text-sm text-silver-lemon">
                    {formData.status === 'published' && 'This product will be visible in the catalog'}
                    {formData.status === 'draft' && 'This product is a draft and will not be visible in the catalog'}
                    {formData.status === 'out_of_stock' && 'This product is out of stock and will be hidden from the catalog'}
                    {formData.status === 'review' && 'This product is under review and will not be visible until approved'}
                  </p>
                </div>
              </div>

              {/* Right column - Main Image */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Main Image
                </label>
                <div className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-gray-200 border-dashed">
                  {imagePreview ? (
                    <div className="relative">
                      <img
                        src={imagePreview}
                        alt="Preview"
                        className="max-h-64 object-contain"
                      />
                      <div className="absolute top-0 right-0 p-2 flex gap-2">
                        <button
                          type="button"
                          onClick={() => {
                            setSelectedImage(null);
                            setImagePreview('');
                            setFormData(prev => ({ ...prev, main_image: '' }));
                          }}
                          className="p-1 bg-white text-gray-500 hover:text-gray-700"
                        >
                          <Trash className="w-5 h-5" />
                        </button>
                        <label className="p-1 bg-white text-gray-500 hover:text-gray-700 cursor-pointer">
                          <Replace className="w-5 h-5" />
                          <input
                            type="file"
                            className="sr-only"
                            accept="image/*"
                            onChange={(e) => {
                              const file = e.target.files?.[0];
                              if (file) handleImageSelect(file);
                            }}
                          />
                        </label>
                      </div>
                    </div>
                  ) : (
                    <div className="space-y-1 text-center">
                      <Upload className="mx-auto h-12 w-12 text-gray-400" />
                      <div className="flex text-sm text-gray-600">
                        <label className="relative cursor-pointer font-medium text-night-lemon hover:text-night-lemon/80">
                          <span>Upload image</span>
                          <input
                            type="file"
                            className="sr-only"
                            accept="image/*"
                            onChange={(e) => {
                              const file = e.target.files?.[0];
                              if (file) handleImageSelect(file);
                            }}
                          />
                        </label>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </form>
        </div>

        <div className="flex-none p-6 border-t border-gray-200">
          <div className="flex justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 border border-gray-200 text-sm font-medium text-gray-700 hover:bg-gray-50"
            >
              Cancel
            </button>
            <button
              onClick={handleSubmit}
              disabled={isLoading}
              className="px-4 py-2 bg-night-lemon text-white text-sm font-medium hover:bg-night-lemon/90 disabled:opacity-50"
            >
              {isLoading ? 'Saving...' : product ? 'Update' : 'Create'}
            </button>
          </div>
        </div>
      </motion.div>
    </div>
  );
} 