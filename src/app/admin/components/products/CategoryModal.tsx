'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { X } from 'lucide-react';
import { toast } from 'react-hot-toast';
import { productService } from '@/supabase/products';

interface CategoryModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: () => void;
}

export function CategoryModal({ isOpen, onClose, onSave }: CategoryModalProps) {
  const [name, setName] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const slug = name.toLowerCase().replace(/\s+/g, '-');
      await productService.createCategory({ name, slug });
      toast.success('Categoría creada');
      onSave();
      onClose();
      setName('');
    } catch (error) {
      console.error(error);
      toast.error('Error al crear la categoría');
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
        className="bg-white rounded-lg w-full max-w-md shadow-xl"
      >
        <div className="flex justify-between items-center p-6 border-b">
          <h2 className="text-xl font-semibold">Add Category</h2>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6">
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Category Name
              </label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-black"
                required
              />
            </div>
          </div>

          <div className="mt-6 flex justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-gray-700 hover:bg-gray-100 rounded-md"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isLoading}
              className="px-4 py-2 bg-black text-white rounded-md hover:bg-gray-800 disabled:opacity-50"
            >
              {isLoading ? 'Creating...' : 'Create Category'}
            </button>
          </div>
        </form>
      </motion.div>
    </div>
  );
} 