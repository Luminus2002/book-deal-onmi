import React, { useState } from 'react';
import { Filter, Grid, List, SortAsc } from 'lucide-react';
import DealCard from './DealCard';
import FilterPanel from './FilterPanel';
import LoadingState from './LoadingState';
import { useApp } from '../context/AppContext';

const SearchResults: React.FC = () => {
  const { books, isLoading, searchQuery } = useApp();
  const [showFilters, setShowFilters] = useState(false);
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');

  if (isLoading) {
    return <LoadingState />;
  }

  if (!searchQuery && books.length === 0) {
    return (
      <div className="text-center py-12">
        <div className="text-6xl mb-4">📚</div>
        <h3 className="text-xl font-medium text-gray-900 dark:text-white mb-2">
          Start your book search
        </h3>
        <p className="text-gray-600 dark:text-gray-400">
          Search for any book to find the best deals across multiple retailers
        </p>
      </div>
    );
  }

  if (searchQuery && books.length === 0) {
    return (
      <div className="text-center py-12">
        <div className="text-6xl mb-4">😔</div>
        <h3 className="text-xl font-medium text-gray-900 dark:text-white mb-2">
          No results found
        </h3>
        <p className="text-gray-600 dark:text-gray-400">
          Try adjusting your search terms or filters
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Results header */}
      <div className="flex items-center justify-between">
        <div>
          {searchQuery && (
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-1">
              Search Results
            </h2>
          )}
          <p className="text-gray-600 dark:text-gray-400">
            {books.length} {books.length === 1 ? 'book' : 'books'} found
            {searchQuery && ` for "${searchQuery}"`}
          </p>
        </div>

        <div className="flex items-center space-x-2">
          {/* View mode toggle */}
          <div className="flex bg-gray-100 dark:bg-gray-700 rounded-lg p-1">
            <button
              onClick={() => setViewMode('grid')}
              className={`p-2 rounded-md transition-colors ${
                viewMode === 'grid'
                  ? 'bg-white dark:bg-gray-600 shadow-sm'
                  : 'hover:bg-gray-200 dark:hover:bg-gray-600'
              }`}
            >
              <Grid className="h-4 w-4 text-gray-600 dark:text-gray-300" />
            </button>
            <button
              onClick={() => setViewMode('list')}
              className={`p-2 rounded-md transition-colors ${
                viewMode === 'list'
                  ? 'bg-white dark:bg-gray-600 shadow-sm'
                  : 'hover:bg-gray-200 dark:hover:bg-gray-600'
              }`}
            >
              <List className="h-4 w-4 text-gray-600 dark:text-gray-300" />
            </button>
          </div>

          {/* Filter toggle */}
          <button
            onClick={() => setShowFilters(!showFilters)}
            className="flex items-center space-x-2 px-4 py-2 bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 rounded-lg transition-colors"
          >
            <Filter className="h-4 w-4 text-gray-600 dark:text-gray-300" />
            <span className="text-gray-700 dark:text-gray-200">Filters</span>
          </button>
        </div>
      </div>

      <div className="lg:grid lg:grid-cols-4 lg:gap-6">
        {/* Filters sidebar */}
        <div className="lg:col-span-1">
          <FilterPanel isOpen={showFilters} onClose={() => setShowFilters(false)} />
        </div>

        {/* Results */}
        <div className="lg:col-span-3">
          <div className={`${
            viewMode === 'grid' 
              ? 'grid grid-cols-1 gap-6' 
              : 'space-y-4'
          }`}>
            {books.map((deal) => (
              <div
                key={deal.book.id}
                className="animate-fade-in"
              >
                <DealCard deal={deal} />
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default SearchResults;