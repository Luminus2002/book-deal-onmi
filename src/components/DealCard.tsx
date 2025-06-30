import React, { useState } from 'react';
import { Heart, Star, TrendingDown, Bell, ExternalLink, Truck, Clock } from 'lucide-react';
import { BookDeal } from '../types';
import { useApp } from '../context/AppContext';

interface DealCardProps {
  deal: BookDeal;
}

const DealCard: React.FC<DealCardProps> = ({ deal }) => {
  const { toggleWishlist } = useApp();
  const [showAllPrices, setShowAllPrices] = useState(false);

  const getDealBadgeColor = (rating: string) => {
    switch (rating) {
      case 'excellent': return 'bg-green-100 dark:bg-green-900/20 text-green-700 dark:text-green-300 border-green-200 dark:border-green-800';
      case 'good': return 'bg-blue-100 dark:bg-blue-900/20 text-blue-700 dark:text-blue-300 border-blue-200 dark:border-blue-800';
      case 'fair': return 'bg-yellow-100 dark:bg-yellow-900/20 text-yellow-700 dark:text-yellow-300 border-yellow-200 dark:border-yellow-800';
      default: return 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300';
    }
  };

  const getAvailabilityColor = (availability: string) => {
    switch (availability) {
      case 'in-stock': return 'text-green-600 dark:text-green-400';
      case 'limited': return 'text-yellow-600 dark:text-yellow-400';
      case 'out-of-stock': return 'text-red-600 dark:text-red-400';
      default: return 'text-gray-600 dark:text-gray-400';
    }
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 shadow-sm hover:shadow-md transition-all duration-200 overflow-hidden group">
      <div className="p-6">
        <div className="flex flex-col lg:flex-row gap-6">
          {/* Book Cover */}
          <div className="flex-shrink-0">
            <div className="relative">
              <img
                src={deal.book.coverImage}
                alt={deal.book.title}
                className="w-32 h-48 object-cover rounded-lg shadow-md mx-auto lg:mx-0"
                loading="lazy"
              />
              {deal.savings > 0 && (
                <div className="absolute -top-2 -right-2 bg-red-500 text-white text-xs font-bold px-2 py-1 rounded-full">
                  Save ${deal.savings.toFixed(2)}
                </div>
              )}
            </div>
          </div>

          {/* Book Info */}
          <div className="flex-1">
            <div className="flex items-start justify-between mb-2">
              <div>
                <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-1 group-hover:text-primary-600 dark:group-hover:text-primary-400 transition-colors">
                  {deal.book.title}
                </h3>
                <p className="text-gray-600 dark:text-gray-300 mb-2">
                  by {deal.book.author}
                </p>
              </div>
              
              <div className="flex items-center space-x-2">
                <span className={`px-2 py-1 text-xs font-medium rounded-full border ${getDealBadgeColor(deal.dealRating)}`}>
                  {deal.dealRating} deal
                </span>
                <button
                  onClick={() => toggleWishlist(deal.book.id)}
                  className={`p-2 rounded-full transition-colors ${
                    deal.isWishlisted
                      ? 'bg-red-100 dark:bg-red-900/20 text-red-600 dark:text-red-400'
                      : 'bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
                  }`}
                >
                  <Heart className={`h-4 w-4 ${deal.isWishlisted ? 'fill-current' : ''}`} />
                </button>
              </div>
            </div>

            {/* Rating and Reviews */}
            <div className="flex items-center space-x-4 mb-3">
              <div className="flex items-center space-x-1">
                <div className="flex">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      className={`h-4 w-4 ${
                        i < Math.floor(deal.book.rating)
                          ? 'text-yellow-400 fill-current'
                          : 'text-gray-300 dark:text-gray-600'
                      }`}
                    />
                  ))}
                </div>
                <span className="text-sm font-medium text-gray-900 dark:text-white">
                  {deal.book.rating}
                </span>
                <span className="text-sm text-gray-500 dark:text-gray-400">
                  ({deal.book.reviewCount.toLocaleString()} reviews)
                </span>
              </div>
              <span className="text-sm text-gray-500 dark:text-gray-400">
                {deal.book.genre}
              </span>
            </div>

            {/* Description */}
            <p className="text-gray-600 dark:text-gray-300 text-sm mb-4 line-clamp-2">
              {deal.book.description}
            </p>

            {/* Best Price */}
            <div className="bg-gradient-to-r from-primary-50 to-secondary-50 dark:from-primary-900/10 dark:to-secondary-900/10 rounded-lg p-4 mb-4">
              <div className="flex items-center justify-between">
                <div>
                  <div className="flex items-center space-x-2 mb-1">
                    <span className="text-lg">{deal.bestPrice.logo}</span>
                    <span className="font-medium text-gray-900 dark:text-white">
                      {deal.bestPrice.retailer}
                    </span>
                    <span className={`text-xs ${getAvailabilityColor(deal.bestPrice.availability)}`}>
                      {deal.bestPrice.availability.replace('-', ' ')}
                    </span>
                  </div>
                  
                  <div className="flex items-center space-x-2">
                    <span className="text-2xl font-bold text-gray-900 dark:text-white">
                      ${deal.bestPrice.price.toFixed(2)}
                    </span>
                    {deal.bestPrice.originalPrice && (
                      <>
                        <span className="text-sm text-gray-500 dark:text-gray-400 line-through">
                          ${deal.bestPrice.originalPrice.toFixed(2)}
                        </span>
                        <span className="text-sm font-medium text-green-600 dark:text-green-400 flex items-center">
                          <TrendingDown className="h-3 w-3 mr-1" />
                          {deal.bestPrice.discount}% off
                        </span>
                      </>
                    )}
                  </div>

                  <div className="flex items-center space-x-4 mt-2 text-xs text-gray-500 dark:text-gray-400">
                    <div className="flex items-center space-x-1">
                      <Truck className="h-3 w-3" />
                      <span>{deal.bestPrice.shipping === 0 ? 'Free shipping' : `$${deal.bestPrice.shipping} shipping`}</span>
                    </div>
                    <div className="flex items-center space-x-1">
                      <Clock className="h-3 w-3" />
                      <span>{deal.bestPrice.deliveryTime}</span>
                    </div>
                  </div>
                </div>

                <div className="flex flex-col space-y-2">
                  <a
                    href={deal.bestPrice.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="bg-gradient-to-r from-primary-500 to-secondary-500 hover:from-primary-600 hover:to-secondary-600 text-white px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 transform hover:scale-105 flex items-center space-x-2"
                  >
                    <span>Buy Now</span>
                    <ExternalLink className="h-3 w-3" />
                  </a>
                  
                  <button className="flex items-center space-x-2 text-xs text-gray-600 dark:text-gray-300 hover:text-primary-600 dark:hover:text-primary-400 transition-colors">
                    <Bell className="h-3 w-3" />
                    <span>Price Alert</span>
                  </button>
                </div>
              </div>
            </div>

            {/* Other Prices */}
            {deal.prices.length > 1 && (
              <div>
                <button
                  onClick={() => setShowAllPrices(!showAllPrices)}
                  className="text-sm text-primary-600 dark:text-primary-400 hover:text-primary-700 dark:hover:text-primary-300 transition-colors mb-2"
                >
                  {showAllPrices ? 'Hide' : 'Show'} all prices ({deal.prices.length})
                </button>

                {showAllPrices && (
                  <div className="space-y-2">
                    {deal.prices.filter(price => price.retailer !== deal.bestPrice.retailer).map((price, index) => (
                      <div key={index} className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
                        <div className="flex items-center space-x-2">
                          <span className="text-sm">{price.logo}</span>
                          <span className="text-sm font-medium text-gray-900 dark:text-white">
                            {price.retailer}
                          </span>
                          <span className={`text-xs ${getAvailabilityColor(price.availability)}`}>
                            {price.availability.replace('-', ' ')}
                          </span>
                        </div>
                        
                        <div className="flex items-center space-x-3">
                          <div className="text-right">
                            <div className="flex items-center space-x-1">
                              <span className="font-medium text-gray-900 dark:text-white">
                                ${price.price.toFixed(2)}
                              </span>
                              {price.originalPrice && (
                                <span className="text-xs text-gray-500 dark:text-gray-400 line-through">
                                  ${price.originalPrice.toFixed(2)}
                                </span>
                              )}
                            </div>
                            <div className="text-xs text-gray-500 dark:text-gray-400">
                              {price.shipping === 0 ? 'Free shipping' : `+$${price.shipping} shipping`}
                            </div>
                          </div>
                          
                          <a
                            href={price.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="bg-gray-200 dark:bg-gray-600 hover:bg-gray-300 dark:hover:bg-gray-500 text-gray-700 dark:text-gray-200 px-3 py-1 rounded text-xs transition-colors"
                          >
                            View
                          </a>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default DealCard;