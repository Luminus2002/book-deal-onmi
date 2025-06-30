import React from 'react';
import { Filter, X, Star } from 'lucide-react';
import { SearchFilters } from '../types';
import { genres } from '../data/mockData';
import { useApp } from '../context/AppContext';

interface FilterPanelProps {
  isOpen: boolean;
  onClose: () => void;
}

const FilterPanel: React.FC<FilterPanelProps> = ({ isOpen, onClose }) => {
  const { filters, setFilters } = useApp();

  const handleGenreToggle = (genre: string) => {
    setFilters({
      ...filters,
      genre: filters.genre.includes(genre)
        ? filters.genre.filter(g => g !== genre)
        : [...filters.genre, genre]
    });
  };

  const handlePriceRangeChange = (min: number, max: number) => {
    setFilters({
      ...filters,
      priceRange: [min, max]
    });
  };

  const handleRatingChange = (rating: number) => {
    setFilters({
      ...filters,
      rating: filters.rating === rating ? 0 : rating
    });
  };

  const clearFilters = () => {
    setFilters({
      genre: [],
      priceRange: [0, 100],
      rating: 0,
      availability: 'all',
      sortBy: 'relevance'
    });
  };

  const activeFiltersCount = 
    filters.genre.length + 
    (filters.rating > 0 ? 1 : 0) + 
    (filters.priceRange[0] > 0 || filters.priceRange[1] < 100 ? 1 : 0) +
    (filters.availability !== 'all' ? 1 : 0);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 lg:relative lg:inset-auto">
      {/* Mobile overlay */}
      <div 
        className="lg:hidden fixed inset-0 bg-black bg-opacity-50"
        onClick={onClose}
      />
      
      {/* Filter panel */}
      <div className="fixed right-0 top-0 h-full w-80 bg-white dark:bg-gray-800 shadow-xl lg:relative lg:w-full lg:h-auto lg:shadow-none lg:bg-transparent lg:dark:bg-transparent transform transition-transform lg:transform-none">
        <div className="p-6 lg:p-4">
          {/* Header */}
          <div className="flex items-center justify-between mb-6 lg:mb-4">
            <div className="flex items-center space-x-2">
              <Filter className="h-5 w-5 text-gray-600 dark:text-gray-300" />
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                Filters
              </h3>
              {activeFiltersCount > 0 && (
                <span className="bg-primary-100 dark:bg-primary-900/20 text-primary-700 dark:text-primary-300 text-xs px-2 py-1 rounded-full">
                  {activeFiltersCount}
                </span>
              )}
            </div>
            
            <div className="flex items-center space-x-2">
              {activeFiltersCount > 0 && (
                <button
                  onClick={clearFilters}
                  className="text-sm text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200 transition-colors"
                >
                  Clear all
                </button>
              )}
              <button 
                onClick={onClose}
                className="lg:hidden p-2 text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200 transition-colors"
              >
                <X className="h-5 w-5" />
              </button>
            </div>
          </div>

          {/* Sort By */}
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Sort By
            </label>
            <select
              value={filters.sortBy}
              onChange={(e) => setFilters({ ...filters, sortBy: e.target.value as any })}
              className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary-500"
            >
              <option value="relevance">Relevance</option>
              <option value="price-low">Price: Low to High</option>
              <option value="price-high">Price: High to Low</option>
              <option value="rating">Rating</option>
              <option value="newest">Newest</option>
            </select>
          </div>

          {/* Price Range */}
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Price Range
            </label>
            <div className="flex items-center space-x-4">
              <div className="flex-1">
                <input
                  type="number"
                  min="0"
                  value={filters.priceRange[0]}
                  onChange={(e) => handlePriceRangeChange(Number(e.target.value), filters.priceRange[1])}
                  className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white text-sm focus:outline-none focus:ring-2 focus:ring-primary-500"
                  placeholder="Min"
                />
              </div>
              <span className="text-gray-500 dark:text-gray-400">to</span>
              <div className="flex-1">
                <input
                  type="number"
                  min="0"
                  value={filters.priceRange[1]}
                  onChange={(e) => handlePriceRangeChange(filters.priceRange[0], Number(e.target.value))}
                  className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white text-sm focus:outline-none focus:ring-2 focus:ring-primary-500"
                  placeholder="Max"
                />
              </div>
            </div>
          </div>

          {/* Rating */}
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Minimum Rating
            </label>
            <div className="flex space-x-2">
              {[1, 2, 3, 4, 5].map((rating) => (
                <button
                  key={rating}
                  onClick={() => handleRatingChange(rating)}
                  className={`flex items-center space-x-1 px-3 py-2 rounded-lg transition-colors ${
                    filters.rating >= rating
                      ? 'bg-yellow-100 dark:bg-yellow-900/20 text-yellow-700 dark:text-yellow-300'
                      : 'bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
                  }`}
                >
                  <Star className={`h-4 w-4 ${filters.rating >= rating ? 'fill-current' : ''}`} />
                  <span className="text-sm">{rating}+</span>
                </button>
              ))}
            </div>
          </div>

          {/* Availability */}
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Availability
            </label>
            <div className="space-y-2">
              {[
                { value: 'all', label: 'All' },
                { value: 'in-stock', label: 'In Stock' },
                { value: 'limited', label: 'Limited Stock' }
              ].map(({ value, label }) => (
                <label key={value} className="flex items-center">
                  <input
                    type="radio"
                    name="availability"
                    value={value}
                    checked={filters.availability === value}
                    onChange={(e) => setFilters({ ...filters, availability: e.target.value })}
                    className="mr-2 text-primary-500 focus:ring-primary-500"
                  />
                  <span className="text-sm text-gray-700 dark:text-gray-300">{label}</span>
                </label>
              ))}
            </div>
          </div>

          {/* Genres */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Genres
            </label>
            <div className="grid grid-cols-2 gap-2 max-h-48 overflow-y-auto">
              {genres.map((genre) => (
                <button
                  key={genre}
                  onClick={() => handleGenreToggle(genre)}
                  className={`text-left px-3 py-2 rounded-lg text-sm transition-colors ${
                    filters.genre.includes(genre)
                      ? 'bg-primary-100 dark:bg-primary-900/20 text-primary-700 dark:text-primary-300 border border-primary-200 dark:border-primary-800'
                      : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
                  }`}
                >
                  {genre}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FilterPanel;