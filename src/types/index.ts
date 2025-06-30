export interface Book {
  id: string;
  title: string;
  author: string;
  isbn: string;
  genre: string;
  rating: number;
  reviewCount: number;
  coverImage: string;
  description: string;
  publishedDate: string;
  pages: number;
  publisher: string;
}

export interface Price {
  retailer: string;
  price: number;
  originalPrice?: number;
  discount?: number;
  availability: 'in-stock' | 'out-of-stock' | 'limited';
  shipping: number;
  deliveryTime: string;
  url: string;
  logo: string;
}

export interface BookDeal {
  book: Book;
  prices: Price[];
  bestPrice: Price;
  savings: number;
  dealRating: 'excellent' | 'good' | 'fair';
  isWishlisted: boolean;
  alertActive: boolean;
}

export interface SearchFilters {
  genre: string[];
  priceRange: [number, number];
  rating: number;
  availability: string;
  sortBy: 'relevance' | 'price-low' | 'price-high' | 'rating' | 'newest';
}

export interface User {
  id: string;
  name: string;
  email: string;
  preferences: {
    favoriteGenres: string[];
    maxBudget: number;
    notifications: boolean;
  };
  wishlist: string[];
  alerts: PriceAlert[];
}

export interface PriceAlert {
  id: string;
  bookId: string;
  targetPrice: number;
  active: boolean;
  createdAt: string;
}

export interface SearchSuggestion {
  id: string;
  text: string;
  type: 'book' | 'author' | 'genre';
  count?: number;
}