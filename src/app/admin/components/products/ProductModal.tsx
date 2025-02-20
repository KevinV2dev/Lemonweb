'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Product, Category, productService } from '@/supabase/products';
import { toast } from 'react-hot-toast';
import { X } from 'lucide-react';
import { CategoryModal } from './CategoryModal';
import Image from 'next/image';

interface ProductModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (product: Product) => void;
  product?: Product;
}

export function ProductModal({ isOpen, onClose, onSave, product }: ProductModalProps) {
  const [categories, setCategories] = useState<Category[]>([]);
  const [formData, setFormData] = useState({
    name: product?.name || '',
    description: product?.description || '',
    category_id: product?.category_id || '',
    main_image: product?.main_image || '',
    slug: product?.slug || '',
    active: product?.active ?? true
  });
  const [isCategoryModalOpen, setIsCategoryModalOpen] = useState(false);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState(product?.main_image || '');

  useEffect(() => {
    loadCategories();
  }, []);

  const loadCategories = async () => {
    try {
      const data = await productService.getCategories();
      setCategories(data);
    } catch (error) {
      toast.error('Error al cargar las categorías');
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      let imageUrl = formData.main_image;

      // Si hay una nueva imagen, subirla
      if (imageFile) {
        try {
          const loadingToast = toast.loading('Subiendo imagen...');
          imageUrl = await productService.uploadProductImage(imageFile);
          toast.dismiss(loadingToast);
        } catch (error) {
          console.error('Error uploading image:', error);
          toast.error(error instanceof Error ? error.message : 'Error al subir la imagen');
          return;
        }
      }

      const loadingToast = toast.loading(product ? 'Actualizando producto...' : 'Creando producto...');

      let savedProduct;
      if (product?.id) {
        // Si estamos actualizando y hay una nueva imagen, eliminar la anterior
        if (imageFile && product.main_image) {
          try {
            await productService.deleteProductImage(product.main_image);
          } catch (error) {
            console.error('Error deleting old image:', error);
          }
        }

        savedProduct = await productService.updateProduct(product.id, {
          ...formData,
          main_image: imageUrl,
          category_id: parseInt(formData.category_id as string)
        });
      } else {
        savedProduct = await productService.createProduct({
          ...formData,
          main_image: imageUrl,
          category_id: parseInt(formData.category_id as string)
        });
      }

      toast.dismiss(loadingToast);
      toast.success(product ? 'Producto actualizado' : 'Producto creado');
      onSave(savedProduct);
    } catch (error) {
      console.error('Error:', error);
      toast.error(
        error instanceof Error 
          ? error.message 
          : 'Error al procesar el producto'
      );
    }
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setImageFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
        setFormData(prev => ({ ...prev, main_image: reader.result as string }));
      };
      reader.readAsDataURL(file);
    }
  };

  if (!isOpen) return null;

  return (
    <>
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 20 }}
          className="bg-white rounded-lg w-full max-w-2xl shadow-xl"
        >
          <div className="flex justify-between items-center p-6 border-b">
            <h2 className="text-xl font-semibold">
              {product ? 'Edit Product' : 'Add New Product'}
            </h2>
            <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
              <X className="w-5 h-5" />
            </button>
          </div>

          <form onSubmit={handleSubmit} className="p-6 space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Name
              </label>
              <input
                type="text"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-black"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Description
              </label>
              <textarea
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-black"
                rows={4}
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Category
              </label>
              <div className="flex gap-2">
                <select
                  value={formData.category_id}
                  onChange={(e) => setFormData({ ...formData, category_id: e.target.value })}
                  className="flex-1 px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-black"
                  required
                >
                  <option value="">Select a category</option>
                  {categories.map((category) => (
                    <option key={category.id} value={category.id}>
                      {category.name}
                    </option>
                  ))}
                </select>
                <button
                  type="button"
                  onClick={() => setIsCategoryModalOpen(true)}
                  className="px-3 py-2 bg-gray-100 text-gray-700 rounded-md hover:bg-gray-200"
                >
                  + New
                </button>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Product Image
              </label>
              <div className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-gray-300 border-dashed rounded-md">
                <div className="space-y-1 text-center">
                  {imagePreview ? (
                    <div className="relative w-full h-48 mb-4">
                      <Image
                        src={imagePreview}
                        alt="Preview"
                        fill
                        className="object-contain"
                      />
                    </div>
                  ) : (
                    <svg
                      className="mx-auto h-12 w-12 text-gray-400"
                      stroke="currentColor"
                      fill="none"
                      viewBox="0 0 48 48"
                    >
                      <path
                        d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8m-12 4h.02"
                        strokeWidth={2}
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                  )}
                  <div className="flex text-sm text-gray-600">
                    <label className="relative cursor-pointer bg-white rounded-md font-medium text-black hover:text-gray-700">
                      <span>Upload a file</span>
                      <input
                        type="file"
                        className="sr-only"
                        accept="image/*"
                        onChange={handleImageChange}
                      />
                    </label>
                  </div>
                </div>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Slug
              </label>
              <input
                type="text"
                value={formData.slug}
                onChange={(e) => setFormData({ ...formData, slug: e.target.value })}
                className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-black"
                required
              />
            </div>

            <div className="flex items-center">
              <input
                type="checkbox"
                checked={formData.active}
                onChange={(e) => setFormData({ ...formData, active: e.target.checked })}
                className="h-4 w-4 text-black focus:ring-black border-gray-300 rounded"
              />
              <label className="ml-2 block text-sm text-gray-900">
                Active
              </label>
            </div>

            <div className="flex justify-end gap-3 pt-4">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 text-gray-700 hover:bg-gray-100 rounded-md"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-4 py-2 bg-black text-white rounded-md hover:bg-gray-800"
              >
                {product ? 'Update' : 'Create'}
              </button>
            </div>
          </form>
        </motion.div>
      </div>

      <CategoryModal
        isOpen={isCategoryModalOpen}
        onClose={() => setIsCategoryModalOpen(false)}
        onSave={loadCategories}
      />
    </>
  );
} 