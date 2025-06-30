import React from 'react';
import { Loader2, BookOpen } from 'lucide-react';

const LoadingState: React.FC = () => {
  return (
    <div className="flex flex-col items-center justify-center py-12">
      <div className="relative">
        <div className="animate-spin">
          <Loader2 className="h-12 w-12 text-primary-500" />
        </div>
        <BookOpen className="h-6 w-6 text-primary-600 absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2" />
      </div>
      <div className="mt-4 text-center">
        <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-1">
          Finding the best deals for you
        </h3>
        <p className="text-gray-600 dark:text-gray-400">
          Comparing prices across multiple retailers...
        </p>
      </div>
      
      {/* Animated dots */}
      <div className="flex space-x-1 mt-6">
        {[0, 1, 2].map((i) => (
          <div
            key={i}
            className="w-2 h-2 bg-primary-500 rounded-full animate-bounce"
            style={{ animationDelay: `${i * 0.1}s` }}
          />
        ))}
      </div>
    </div>
  );
};

export default LoadingState;