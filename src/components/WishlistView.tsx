import React from 'react';
import { Heart, ShoppingCart, Bell } from 'lucide-react';
import DealCard from './DealCard';
import { useApp } from '../context/AppContext';

const WishlistView: React.FC = () => {
  const { books, wishlist } = useApp();
  
  const wishlistBooks = books.filter(deal => wishlist.includes(deal.book.id));

  if (wishlist.length === 0) {
    return (
      <div className="text-center py-12">
        <div className="mb-6">
          <Heart className="h-16 w-16 text-gray-300 dark:text-gray-600 mx-auto mb-4" />
        </div>
        <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
          Your wishlist is empty
        </h3>
        <p className="text-gray-600 dark:text-gray-400 mb-6">
          Save books you're interested in to keep track of their prices
        </p>
        <button
          onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
          className="bg-gradient-to-r from-primary-500 to-secondary-500 hover:from-primary-600 hover:to-secondary-600 text-white px-6 py-3 rounded-lg font-medium transition-all duration-200 transform hover:scale-105"
        >
          Start Shopping
        </button>
      </div>
    );
  }

  const totalSavings = wishlistBooks.reduce((sum, deal) => sum + deal.savings, 0);
  const averageRating = wishlistBooks.reduce((sum, deal) => sum + deal.book.rating, 0) / wishlistBooks.length;

  return (
    <div className="space-y-6">
      {/* Wishlist header */}
      <div className="bg-gradient-to-r from-primary-50 to-secondary-50 dark:from-primary-900/10 dark:to-secondary-900/10 rounded-xl p-6">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
              Your Wishlist
            </h2>
            <p className="text-gray-600 dark:text-gray-400">
              {wishlist.length} {wishlist.length === 1 ? 'book' : 'books'} saved
            </p>
          </div>
          
          <div className="flex items-center space-x-6">
            <div className="text-center">
              <div className="text-2xl font-bold text-green-600 dark:text-green-400">
                ${totalSavings.toFixed(2)}
              </div>
              <div className="text-sm text-gray-500 dark:text-gray-400">
                Total Savings
              </div>
            </div>
            
            <div className="text-center">
              <div className="text-2xl font-bold text-yellow-600 dark:text-yellow-400">
                {averageRating.toFixed(1)}★
              </div>
              <div className="text-sm text-gray-500 dark:text-gray-400">
                Average Rating
              </div>
            </div>
          </div>
        </div>

        <div className="flex items-center space-x-4 mt-4">
          <button className="flex items-center space-x-2 bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg transition-colors">
            <ShoppingCart className="h-4 w-4" />
            <span>Buy All Best Deals</span>
          </button>
          
          <button className="flex items-center space-x-2 bg-gray-600 hover:bg-gray-700 text-white px-4 py-2 rounded-lg transition-colors">
            <Bell className="h-4 w-4" />
            <span>Set Price Alerts</span>
          </button>
        </div>
      </div>

      {/* Wishlist items */}
      <div className="grid grid-cols-1 gap-6">
        {wishlistBooks.map((deal) => (
          <div key={deal.book.id} className="animate-fade-in">
            <DealCard deal={deal} />
          </div>
        ))}
      </div>
    </div>
  );
};

export default WishlistView;