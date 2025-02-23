'use client';

import React from 'react';
import { useState, useEffect } from 'react';
import { Plus, GripVertical, Trash2 } from 'lucide-react';
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
      <div className="flex justify-between items-center mb-8">
        <button
          onClick={() => setIsModalOpen(true)}
          className="w-full lg:w-auto bg-night-lemon text-white px-4 py-2 flex items-center justify-center gap-2 group hover:bg-night-lemon/90 transition-colors"
        >
          <Plus className="w-5 h-5" />
          New Category
        </button>
      </div>

      <DragDropContext onDragEnd={handleDragEnd}>
        <StrictModeDroppable droppableId="categories">
          {(provided) => (
            <div
              {...provided.droppableProps}
              ref={provided.innerRef}
              className="space-y-3"
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
                      className={`flex items-center justify-between p-4 bg-white border border-gray-200 transition-all ${
                        snapshot.isDragging ? 'shadow-lg ring-2 ring-night-lemon ring-opacity-5' : 'hover:border-night-lemon'
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <div {...provided.dragHandleProps} className="cursor-move">
                          <GripVertical className="w-5 h-5 text-gray-400" />
                        </div>
                        <span className="font-medium text-night-lemon">{category.name}</span>
                        <span className="text-sm text-silver-lemon">({category.slug})</span>
                      </div>
                      
                      <button
                        onClick={() => handleDelete(category.id)}
                        className="inline-flex items-center px-3 py-1.5 text-sm bg-red-600 text-white hover:bg-red-700 transition-colors gap-1.5"
                      >
                        <Trash2 size={14} />
                        Delete
                      </button>
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