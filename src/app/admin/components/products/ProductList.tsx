'use client';

import { useState, useEffect } from 'react';
import { productService } from '@/supabase/products';
import type { Product, Category } from '@/types';
import { toast } from 'react-hot-toast';
import { Eye, Edit, Trash, Search, X } from 'lucide-react';
import { ProductDetail } from './ProductDetail';
import { motion } from 'framer-motion';

interface ProductListProps {
  onEdit: (product: Product) => void;
  shouldRefresh?: boolean;
  onRefreshComplete?: () => void;
}

export function ProductList({ onEdit, shouldRefresh, onRefreshComplete }: ProductListProps) {
  const [products, setProducts] = useState<Product[]>([]);
  const [filteredProducts, setFilteredProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedProductId, setSelectedProductId] = useState<number | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<number | null>(null);
  const [deleteConfirmation, setDeleteConfirmation] = useState<{
    isOpen: boolean;
    productId: number | null;
    productName: string;
  }>({
    isOpen: false,
    productId: null,
    productName: ''
  });

  useEffect(() => {
    loadProducts();
    loadCategories();
  }, [shouldRefresh]);

  useEffect(() => {
    filterProducts();
  }, [searchTerm, selectedCategory, products]);

  const loadCategories = async () => {
    try {
      const data = await productService.getCategories();
      setCategories(data);
    } catch (error) {
      console.error('Error loading categories:', error);
    }
  };

  const loadProducts = async () => {
    try {
      const data = await productService.getProducts();
      setProducts(data);
      setFilteredProducts(data);
    } catch (error) {
      toast.error('Error loading products');
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  const filterProducts = () => {
    let filtered = [...products];

    if (selectedCategory) {
      filtered = filtered.filter(product => product.category_id === selectedCategory);
    }

    if (searchTerm) {
      const searchLower = searchTerm.toLowerCase();
      filtered = filtered.filter(product => 
        product.name.toLowerCase().includes(searchLower) ||
        (product.description?.toLowerCase() || '').includes(searchLower) ||
        product.category?.name?.toLowerCase().includes(searchLower) ||
        product.slug.toLowerCase().includes(searchLower)
      );
    }

    setFilteredProducts(filtered);
  };

  const handleDelete = async (productId: number) => {
    try {
      await productService.deleteProduct(productId);
      toast.success('Product deleted successfully');
      loadProducts();
      setDeleteConfirmation({
        isOpen: false,
        productId: null,
        productName: ''
      });
    } catch (error) {
      toast.error('Error deleting product');
      console.error(error);
    }
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900" />
      </div>
    );
  }

  return (
    <>
      <div className="p-4 space-y-4">
        <div className="flex flex-col lg:flex-row gap-4">
          <div className="flex-1">
            <div className="relative">
              <input
                type="text"
                placeholder="Search products..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-200 focus:outline-none focus:ring-2 focus:ring-night-lemon focus:border-transparent"
              />
              <Search className="absolute left-3 top-2.5 h-5 w-5 text-silver-lemon" />
            </div>
          </div>

          <select
            value={selectedCategory || ''}
            onChange={(e) => setSelectedCategory(e.target.value ? Number(e.target.value) : null)}
            className="px-4 py-2 border border-gray-200 focus:outline-none focus:ring-2 focus:ring-night-lemon focus:border-transparent"
          >
            <option value="">All categories</option>
            {categories.map((category) => (
              <option key={category.id} value={category.id}>
                {category.name}
              </option>
            ))}
          </select>
        </div>

        <div className="text-sm text-silver-lemon">
          {filteredProducts.length} {filteredProducts.length === 1 ? 'product' : 'products'} found
        </div>
      </div>

      {/* Vista móvil */}
      <div className="block lg:hidden">
        <div className="space-y-4">
          {filteredProducts.map((product) => (
            <div key={product.id} className="bg-white border border-gray-200 p-4 space-y-3">
              <div className="flex items-center space-x-4">
                <div className="h-16 w-16 bg-gray-100 overflow-hidden flex-shrink-0">
                  <img
                    src={product.main_image}
                    alt={product.name}
                    className="h-full w-full object-cover"
                  />
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="text-sm font-medium text-night-lemon truncate">{product.name}</h3>
                  <p className="text-sm text-silver-lemon mt-1">{product.category?.name}</p>
                  <span className={`inline-flex px-2 py-0.5 mt-2 text-xs font-medium rounded-full ${
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
              <div className="flex items-center justify-end space-x-2 pt-3 border-t border-gray-100">
                <button
                  onClick={() => setSelectedProductId(product.id)}
                  className="p-2 text-silver-lemon hover:text-night-lemon transition-colors"
                >
                  <Eye className="h-5 w-5" />
                </button>
                <button
                  onClick={() => onEdit(product)}
                  className="p-2 text-silver-lemon hover:text-night-lemon transition-colors"
                >
                  <Edit className="h-5 w-5" />
                </button>
                <button
                  onClick={() => setDeleteConfirmation({
                    isOpen: true,
                    productId: product.id,
                    productName: product.name
                  })}
                  className="p-2 text-red-600 hover:text-red-800 transition-colors"
                >
                  <Trash className="h-5 w-5" />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Vista desktop */}
      <div className="hidden lg:block">
        <div className="bg-white border border-gray-200">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead>
                <tr>
                  <th scope="col" className="sticky left-0 bg-white px-3 py-3.5 text-left text-xs font-medium text-silver-lemon uppercase tracking-wider">
                    Image
                  </th>
                  <th scope="col" className="px-3 py-3.5 text-left text-xs font-medium text-silver-lemon uppercase tracking-wider">
                    Name
                  </th>
                  <th scope="col" className="px-3 py-3.5 text-left text-xs font-medium text-silver-lemon uppercase tracking-wider">
                    Category
                  </th>
                  <th scope="col" className="px-3 py-3.5 text-left text-xs font-medium text-silver-lemon uppercase tracking-wider">
                    Status
                  </th>
                  <th scope="col" className="px-3 py-3.5 text-left text-xs font-medium text-silver-lemon uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {filteredProducts.map((product) => (
                  <tr key={product.id} className="hover:bg-gray-50">
                    <td className="sticky left-0 bg-white hover:bg-gray-50 px-3 py-4">
                      <div className="h-10 w-10 bg-gray-100 overflow-hidden">
                        <img
                          src={product.main_image}
                          alt={product.name}
                          className="h-full w-full object-cover"
                        />
                      </div>
                    </td>
                    <td className="px-3 py-4">
                      <div className="text-sm font-medium text-night-lemon">{product.name}</div>
                    </td>
                    <td className="px-3 py-4">
                      <div className="flex items-center gap-2">
                        <div className="text-sm text-silver-lemon">{product.category?.name}</div>
                        {product.categories && product.categories.length > 1 && (
                          <span className="inline-flex items-center px-2 py-0.5 text-xs font-medium bg-gray-100 text-night-lemon rounded-full">
                            +{product.categories.length - 1}
                          </span>
                        )}
                      </div>
                    </td>
                    <td className="px-3 py-4">
                      <span className={`inline-flex px-2 py-0.5 text-xs font-medium rounded-full ${
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
                    </td>
                    <td className="px-3 py-4">
                      <div className="flex items-center space-x-2">
                        <button
                          onClick={() => setSelectedProductId(product.id)}
                          className="p-2 text-silver-lemon hover:text-night-lemon transition-colors"
                        >
                          <Eye className="h-5 w-5" />
                        </button>
                        <button
                          onClick={() => onEdit(product)}
                          className="p-2 text-silver-lemon hover:text-night-lemon transition-colors"
                        >
                          <Edit className="h-5 w-5" />
                        </button>
                        <button
                          onClick={() => setDeleteConfirmation({
                            isOpen: true,
                            productId: product.id,
                            productName: product.name
                          })}
                          className="p-2 text-red-600 hover:text-red-800 transition-colors"
                        >
                          <Trash className="h-5 w-5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {deleteConfirmation.isOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white rounded-lg w-full max-w-md shadow-xl p-6"
          >
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-xl font-semibold text-night-lemon">Delete Product</h3>
              <button
                onClick={() => setDeleteConfirmation({
                  isOpen: false,
                  productId: null,
                  productName: ''
                })}
                className="text-gray-500 hover:text-gray-700"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            
            <p className="text-gray-600 mb-6">
              Are you sure you want to delete <span className="font-semibold">{deleteConfirmation.productName}</span>? This action cannot be undone.
            </p>

            <div className="flex justify-end gap-3">
              <button
                onClick={() => setDeleteConfirmation({
                  isOpen: false,
                  productId: null,
                  productName: ''
                })}
                className="px-4 py-2 text-gray-700 hover:bg-gray-100 rounded-md"
              >
                Cancel
              </button>
              <button
                onClick={() => deleteConfirmation.productId && handleDelete(deleteConfirmation.productId)}
                className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700"
              >
                Delete
              </button>
            </div>
          </motion.div>
        </div>
      )}

      {selectedProductId && (
        <ProductDetail
          productId={selectedProductId}
          onClose={() => setSelectedProductId(null)}
          onEdit={onEdit}
          onDelete={(id) => {
            handleDelete(id);
            setSelectedProductId(null);
          }}
        />
      )}
    </>
  );
} 