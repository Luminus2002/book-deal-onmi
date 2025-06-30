import { BookDeal, SearchSuggestion } from '../types';

export const mockBooks: BookDeal[] = [
  {
    book: {
      id: '1',
      title: 'The Seven Husbands of Evelyn Hugo',
      author: 'Taylor Jenkins Reid',
      isbn: '9781501161933',
      genre: 'Fiction',
      rating: 4.8,
      reviewCount: 48392,
      coverImage: 'https://images.pexels.com/photos/1029141/pexels-photo-1029141.jpeg?auto=compress&cs=tinysrgb&w=300&h=400&fit=crop',
      description: 'A captivating story of love, ambition, and the price of fame.',
      publishedDate: '2017-06-13',
      pages: 400,
      publisher: 'Atria Books'
    },
    prices: [
      {
        retailer: 'Amazon',
        price: 12.99,
        originalPrice: 16.99,
        discount: 24,
        availability: 'in-stock',
        shipping: 0,
        deliveryTime: '2-3 days',
        url: '#',
        logo: '📚'
      },
      {
        retailer: 'Barnes & Noble',
        price: 14.50,
        originalPrice: 16.99,
        discount: 15,
        availability: 'in-stock',
        shipping: 5.99,
        deliveryTime: '3-5 days',
        url: '#',
        logo: '📖'
      },
      {
        retailer: 'Book Depository',
        price: 13.75,
        availability: 'limited',
        shipping: 0,
        deliveryTime: '5-7 days',
        url: '#',
        logo: '📘'
      }
    ],
    bestPrice: {
      retailer: 'Amazon',
      price: 12.99,
      originalPrice: 16.99,
      discount: 24,
      availability: 'in-stock',
      shipping: 0,
      deliveryTime: '2-3 days',
      url: '#',
      logo: '📚'
    },
    savings: 4.00,
    dealRating: 'excellent',
    isWishlisted: false,
    alertActive: false
  },
  {
    book: {
      id: '2',
      title: 'Atomic Habits',
      author: 'James Clear',
      isbn: '9780735211292',
      genre: 'Self-Help',
      rating: 4.7,
      reviewCount: 125847,
      coverImage: 'https://images.pexels.com/photos/1125817/pexels-photo-1125817.jpeg?auto=compress&cs=tinysrgb&w=300&h=400&fit=crop',
      description: 'An easy & proven way to build good habits & break bad ones.',
      publishedDate: '2018-10-16',
      pages: 320,
      publisher: 'Avery'
    },
    prices: [
      {
        retailer: 'Amazon',
        price: 18.99,
        originalPrice: 27.00,
        discount: 30,
        availability: 'in-stock',
        shipping: 0,
        deliveryTime: '1-2 days',
        url: '#',
        logo: '📚'
      },
      {
        retailer: 'Target',
        price: 19.49,
        originalPrice: 27.00,
        discount: 28,
        availability: 'in-stock',
        shipping: 0,
        deliveryTime: '2-3 days',
        url: '#',
        logo: '🎯'
      }
    ],
    bestPrice: {
      retailer: 'Amazon',
      price: 18.99,
      originalPrice: 27.00,
      discount: 30,
      availability: 'in-stock',
      shipping: 0,
      deliveryTime: '1-2 days',
      url: '#',
      logo: '📚'
    },
    savings: 8.01,
    dealRating: 'excellent',
    isWishlisted: true,
    alertActive: true
  },
  {
    book: {
      id: '3',
      title: 'The Thursday Murder Club',
      author: 'Richard Osman',
      isbn: '9780525557340',
      genre: 'Mystery',
      rating: 4.5,
      reviewCount: 67293,
      coverImage: 'https://images.pexels.com/photos/1130980/pexels-photo-1130980.jpeg?auto=compress&cs=tinysrgb&w=300&h=400&fit=crop',
      description: 'A clever mystery featuring four unlikely amateur sleuths.',
      publishedDate: '2020-09-03',
      pages: 368,
      publisher: 'Pamela Dorman Books'
    },
    prices: [
      {
        retailer: 'Barnes & Noble',
        price: 15.99,
        originalPrice: 17.99,
        discount: 11,
        availability: 'in-stock',
        shipping: 0,
        deliveryTime: '2-3 days',
        url: '#',
        logo: '📖'
      },
      {
        retailer: 'Amazon',
        price: 16.20,
        availability: 'in-stock',
        shipping: 0,
        deliveryTime: '1-2 days',
        url: '#',
        logo: '📚'
      }
    ],
    bestPrice: {
      retailer: 'Barnes & Noble',
      price: 15.99,
      originalPrice: 17.99,
      discount: 11,
      availability: 'in-stock',
      shipping: 0,
      deliveryTime: '2-3 days',
      url: '#',
      logo: '📖'
    },
    savings: 2.00,
    dealRating: 'good',
    isWishlisted: false,
    alertActive: false
  }
];

export const searchSuggestions: SearchSuggestion[] = [
  { id: '1', text: 'The Seven Husbands of Evelyn Hugo', type: 'book' },
  { id: '2', text: 'Atomic Habits', type: 'book' },
  { id: '3', text: 'James Clear', type: 'author', count: 12 },
  { id: '4', text: 'Fiction', type: 'genre', count: 2847 },
  { id: '5', text: 'Self-Help', type: 'genre', count: 1923 },
  { id: '6', text: 'Mystery', type: 'genre', count: 1456 },
  { id: '7', text: 'Taylor Jenkins Reid', type: 'author', count: 8 },
  { id: '8', text: 'The Thursday Murder Club', type: 'book' }
];

export const genres = [
  'Fiction',
  'Non-Fiction',
  'Mystery',
  'Romance',
  'Science Fiction',
  'Fantasy',
  'Biography',
  'Self-Help',
  'History',
  'Business',
  'Health',
  'Travel',
  'Cooking',
  'Art',
  'Science'
];