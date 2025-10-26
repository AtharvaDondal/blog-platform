import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface BlogStore {
  // UI state
  sidebarOpen: boolean;
  toggleSidebar: () => void;
  
  // Filter state
  selectedCategoryId: string | null;
  setSelectedCategoryId: (id: string | null) => void;
  
  // View preferences
  viewMode: 'grid' | 'list';
  setViewMode: (mode: 'grid' | 'list') => void;
}

export const useBlogStore = create<BlogStore>()(
  persist(
    (set) => ({
      // UI state
      sidebarOpen: false,
      toggleSidebar: () => set((state) => ({ sidebarOpen: !state.sidebarOpen })),
      
      // Filter state
      selectedCategoryId: null,
      setSelectedCategoryId: (id) => set({ selectedCategoryId: id }),
      
      // View preferences
      viewMode: 'grid',
      setViewMode: (mode) => set({ viewMode: mode }),
    }),
    {
      name: 'blog-store',
    }
  )
);