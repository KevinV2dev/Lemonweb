'use client';

import React from 'react';
import { useState, useEffect } from 'react';
import { Plus, GripVertical } from 'lucide-react';
import { productService } from '@/supabase/products';
import type { Category } from '@/types';
import { toast } from 'react-hot-toast';
import { CategoryModal } from './CategoryModal';
import { DragDropContext, Droppable, Draggable, DropResult } from 'react-beautiful-dnd';
import { StrictModeDroppable } from './StrictModeDroppable';

export function CategoryManager() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    loadCategories();
  }, []);

  const loadCategories = async () => {
    try {
      const data = await productService.getCategories();
      setCategories(data);
    } catch (error) {
      toast.error('Error loading categories');
      console.error('Error loading categories:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleDragEnd = async (result: DropResult) => {
    if (!result.destination) return;

    const items = Array.from(categories);
    const [reorderedItem] = items.splice(result.source.index, 1);
    items.splice(result.destination.index, 0, reorderedItem);

    const updatedCategories = items.map((item, index) => ({
      ...item,
      display_order: index
    }));

    setCategories(updatedCategories);

    try {
      await productService.reorderCategories(
        updatedCategories.map((cat, index) => ({
          id: cat.id,
          display_order: index
        }))
      );
      toast.success('Order updated successfully');
    } catch (error) {
      console.error('Error saving category order:', error);
      toast.error('Error saving order');
      loadCategories();
    }
  };

  const handleDelete = async (id: number) => {
    if (confirm('Are you sure you want to delete this category?')) {
      try {
        await productService.deleteCategory(id);
        setCategories(categories.filter(cat => cat.id !== id));
        toast.success('Category deleted successfully');
      } catch (error) {
        console.error('Error deleting category:', error);
        toast.error('Error deleting category');
      }
    }
  };

  const handleCreateSuccess = async () => {
    await loadCategories();
    setIsModalOpen(false);
    toast.success('Category created successfully');
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900" />
      </div>
    );
  }

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold">Categories</h2>
        <button
          onClick={() => setIsModalOpen(true)}
          className="flex items-center gap-2 px-4 py-2 bg-black text-white rounded-md hover:bg-gray-800"
        >
          <Plus className="w-4 h-4" />
          New Category
        </button>
      </div>

      <DragDropContext onDragEnd={handleDragEnd}>
        <StrictModeDroppable droppableId="categories">
          {(provided) => (
            <div
              {...provided.droppableProps}
              ref={provided.innerRef}
              className="space-y-2"
            >
              {categories.map((category, index) => (
                <Draggable
                  key={category.id}
                  draggableId={category.id.toString()}
                  index={index}
                >
                  {(provided, snapshot) => (
                    <div
                      ref={provided.innerRef}
                      {...provided.draggableProps}
                      className={`flex items-center justify-between p-4 bg-white rounded-lg shadow transition-all ${
                        snapshot.isDragging ? 'shadow-lg ring-2 ring-black ring-opacity-5' : 'hover:shadow-md'
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <div {...provided.dragHandleProps} className="cursor-move">
                          <GripVertical className="w-5 h-5 text-gray-400" />
                        </div>
                        <span className="font-medium">{category.name}</span>
                        <span className="text-sm text-gray-500">({category.slug})</span>
                      </div>
                      
                      <div className="flex items-center gap-4">
                        <span className="text-sm text-gray-400">
                          Order: {category.display_order}
                        </span>
                        <button
                          onClick={() => handleDelete(category.id)}
                          className="text-sm text-red-600 hover:text-red-800"
                        >
                          Delete
                        </button>
                      </div>
                    </div>
                  )}
                </Draggable>
              ))}
              {provided.placeholder}
            </div>
          )}
        </StrictModeDroppable>
      </DragDropContext>

      <CategoryModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSave={handleCreateSuccess}
      />
    </div>
  );
} 