'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';

export interface ProjectColor {
  name: string;
  code?: string;
  hex?: string;
  image?: string;
}

export interface ProjectItem {
  id: string; // unique key: slug-color-dimension
  productId: string;
  slug: string;
  name: string;
  image: string;
  color: ProjectColor | null;
  dimension: string | null;
  quantity: number;
  price: string;
  url: string;
}

interface ProjectContextType {
  items: ProjectItem[];
  addItem: (item: Omit<ProjectItem, 'id'>) => void;
  removeItem: (id: string) => void;
  updateQuantity: (id: string, quantity: number) => void;
  clearProject: () => void;
  isOpen: boolean;
  setIsOpen: (isOpen: boolean) => void;
  itemCount: number;
}

const ProjectContext = createContext<ProjectContextType | undefined>(undefined);

export function ProjectProvider({ children }: { children: React.ReactNode }) {
  const [items, setItems] = useState<ProjectItem[]>([]);
  const [isOpen, setIsOpen] = useState(false);
  const [isLoaded, setIsLoaded] = useState(false);

  // Load items from localStorage on mount
  useEffect(() => {
    try {
      const stored = localStorage.getItem('kochlik_project_folder');
      if (stored) {
        setItems(JSON.parse(stored));
      }
    } catch (e) {
      console.error('Failed to load project folder items:', e);
    }
    setIsLoaded(true);
  }, []);

  // Save items to localStorage whenever they change
  useEffect(() => {
    if (!isLoaded) return;
    try {
      localStorage.setItem('kochlik_project_folder', JSON.stringify(items));
    } catch (e) {
      console.error('Failed to save project folder items:', e);
    }
  }, [items, isLoaded]);

  const addItem = (newItem: Omit<ProjectItem, 'id'>) => {
    const key = `${newItem.slug}-${newItem.color ? newItem.color.name : 'default'}-${newItem.dimension || 'default'}`;

    setItems((prevItems) => {
      const existingIndex = prevItems.findIndex((item) => item.id === key);
      if (existingIndex > -1) {
        const updated = [...prevItems];
        updated[existingIndex].quantity += newItem.quantity;
        return updated;
      }
      return [...prevItems, { ...newItem, id: key }];
    });
  };

  const removeItem = (id: string) => {
    setItems((prevItems) => prevItems.filter((item) => item.id !== id));
  };

  const updateQuantity = (id: string, quantity: number) => {
    setItems((prevItems) =>
      prevItems
        .map((item) => {
          if (item.id === id) {
            return { ...item, quantity: Math.max(1, quantity) };
          }
          return item;
        })
    );
  };

  const clearProject = () => {
    setItems([]);
  };

  // Calculate total number of items (sum of quantities)
  const itemCount = items.reduce((sum, item) => sum + item.quantity, 0);

  return (
    <ProjectContext.Provider
      value={{
        items,
        addItem,
        removeItem,
        updateQuantity,
        clearProject,
        isOpen,
        setIsOpen,
        itemCount,
      }}
    >
      {children}
    </ProjectContext.Provider>
  );
}

export function useProject() {
  const context = useContext(ProjectContext);
  if (!context) {
    throw new Error('useProject must be used within a ProjectProvider');
  }
  return context;
}
