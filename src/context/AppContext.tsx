import React, { createContext, useContext, useState, ReactNode } from 'react';
import { BookDeal, SearchFilters, User } from '../types';
import { mockBooks } from '../data/mockData';
import { useLocalStorage } from '../hooks/useLocalStorage';

interface AppContextType {
  books: BookDeal[];
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  filters: SearchFilters;
  setFilters: (filters: SearchFilters) => void;
  wishlist: string[];
  toggleWishlist: (bookId: string) => void;
  isLoading: boolean;
  setIsLoading: (loading: boolean) => void;
  searchBooks: (query: string) => void;
  currentView: 'search' | 'wishlist' | 'dashboard';
  setCurrentView: (view: 'search' | 'wishlist' | 'dashboard') => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};

interface AppProviderProps {
  children: ReactNode;
}

export const AppProvider: React.FC<AppProviderProps> = ({ children }) => {
  const [books, setBooks] = useState<BookDeal[]>(mockBooks);
  const [searchQuery, setSearchQuery] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [currentView, setCurrentView] = useState<'search' | 'wishlist' | 'dashboard'>('search');
  const [wishlist, setWishlist] = useLocalStorage<string[]>('wishlist', []);
  
  const [filters, setFilters] = useState<SearchFilters>({
    genre: [],
    priceRange: [0, 100],
    rating: 0,
    availability: 'all',
    sortBy: 'relevance'
  });

  const toggleWishlist = (bookId: string) => {
    setWishlist(prev => 
      prev.includes(bookId) 
        ? prev.filter(id => id !== bookId)
        : [...prev, bookId]
    );
    
    setBooks(prev => prev.map(deal => 
      deal.book.id === bookId 
        ? { ...deal, isWishlisted: !deal.isWishlisted }
        : deal
    ));
  };

  const searchBooks = (query: string) => {
    setIsLoading(true);
    setSearchQuery(query);
    
    // Simulate API call
    setTimeout(() => {
      if (query.trim()) {
        const filtered = mockBooks.filter(deal =>
          deal.book.title.toLowerCase().includes(query.toLowerCase()) ||
          deal.book.author.toLowerCase().includes(query.toLowerCase()) ||
          deal.book.genre.toLowerCase().includes(query.toLowerCase())
        );
        setBooks(filtered);
      } else {
        setBooks(mockBooks);
      }
      setIsLoading(false);
    }, 800);
  };

  const value: AppContextType = {
    books,
    searchQuery,
    setSearchQuery,
    filters,
    setFilters,
    wishlist,
    toggleWishlist,
    isLoading,
    setIsLoading,
    searchBooks,
    currentView,
    setCurrentView
  };

  return (
    <AppContext.Provider value={value}>
      {children}
    </AppContext.Provider>
  );
};