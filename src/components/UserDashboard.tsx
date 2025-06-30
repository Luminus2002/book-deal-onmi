import React from 'react';
import { User, Settings, Bell, TrendingDown, Heart, Clock, Award } from 'lucide-react';
import { useApp } from '../context/AppContext';

const UserDashboard: React.FC = () => {
  const { wishlist, books } = useApp();
  
  const wishlistBooks = books.filter(deal => wishlist.includes(deal.book.id));
  const totalSavings = wishlistBooks.reduce((sum, deal) => sum + deal.savings, 0);

  const stats = [
    {
      icon: Heart,
      label: 'Wishlist Items',
      value: wishlist.length,
      color: 'text-red-500'
    },
    {
      icon: TrendingDown,
      label: 'Total Savings',
      value: `$${totalSavings.toFixed(2)}`,
      color: 'text-green-500'
    },
    {
      icon: Bell,
      label: 'Active Alerts',
      value: 3,
      color: 'text-blue-500'
    },
    {
      icon: Award,
      label: 'Books Found',
      value: 147,
      color: 'text-purple-500'
    }
  ];

  const recentActivity = [
    {
      type: 'price_drop',
      book: 'Atomic Habits',
      message: 'Price dropped by $2.50',
      time: '2 hours ago',
      color: 'text-green-600'
    },
    {
      type: 'wishlist_add',
      book: 'The Seven Husbands of Evelyn Hugo',
      message: 'Added to wishlist',
      time: '1 day ago',
      color: 'text-blue-600'
    },
    {
      type: 'alert_set',
      book: 'The Thursday Murder Club',
      message: 'Price alert set for $12.00',
      time: '2 days ago',
      color: 'text-yellow-600'
    }
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-gradient-to-r from-primary-500 to-secondary-500 rounded-xl p-6 text-white">
        <div className="flex items-center space-x-4">
          <div className="p-3 bg-white/20 rounded-full">
            <User className="h-8 w-8" />
          </div>
          <div>
            <h2 className="text-2xl font-bold">Welcome back, Reader!</h2>
            <p className="opacity-90">Here's your personalized book deal dashboard</p>
          </div>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, index) => (
          <div
            key={index}
            className="bg-white dark:bg-gray-800 p-6 rounded-xl border border-gray-200 dark:border-gray-700 hover:shadow-md transition-shadow"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 dark:text-gray-400">{stat.label}</p>
                <p className="text-2xl font-bold text-gray-900 dark:text-white mt-1">
                  {stat.value}
                </p>
              </div>
              <stat.icon className={`h-8 w-8 ${stat.color}`} />
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Activity */}
        <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-6">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center">
            <Clock className="h-5 w-5 mr-2" />
            Recent Activity
          </h3>
          
          <div className="space-y-4">
            {recentActivity.map((activity, index) => (
              <div key={index} className="flex items-start space-x-3 p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
                <div className={`w-2 h-2 rounded-full mt-2 ${activity.color.replace('text-', 'bg-')}`} />
                <div className="flex-1">
                  <p className="text-sm font-medium text-gray-900 dark:text-white">
                    {activity.book}
                  </p>
                  <p className="text-sm text-gray-600 dark:text-gray-300">
                    {activity.message}
                  </p>
                  <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                    {activity.time}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Preferences */}
        <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-6">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center">
            <Settings className="h-5 w-5 mr-2" />
            Preferences
          </h3>
          
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-700 dark:text-gray-300">Price drop notifications</span>
              <label className="relative inline-flex items-center cursor-pointer">
                <input type="checkbox" className="sr-only peer" defaultChecked />
                <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary-300 dark:peer-focus:ring-primary-800 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-primary-600"></div>
              </label>
            </div>
            
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-700 dark:text-gray-300">New book recommendations</span>
              <label className="relative inline-flex items-center cursor-pointer">
                <input type="checkbox" className="sr-only peer" defaultChecked />
                <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary-300 dark:peer-focus:ring-primary-800 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-primary-600"></div>
              </label>
            </div>
            
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-700 dark:text-gray-300">Weekly deal digest</span>
              <label className="relative inline-flex items-center cursor-pointer">
                <input type="checkbox" className="sr-only peer" />
                <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary-300 dark:peer-focus:ring-primary-800 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-primary-600"></div>
              </label>
            </div>

            <div className="pt-4 border-t border-gray-200 dark:border-gray-600">
              <label className="block text-sm text-gray-700 dark:text-gray-300 mb-2">
                Maximum budget per book
              </label>
              <div className="flex items-center space-x-2">
                <span className="text-sm text-gray-500">$</span>
                <input
                  type="number"
                  defaultValue="50"
                  className="flex-1 p-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white text-sm focus:outline-none focus:ring-2 focus:ring-primary-500"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm text-gray-700 dark:text-gray-300 mb-2">
                Favorite genres
              </label>
              <div className="flex flex-wrap gap-2">
                {['Fiction', 'Mystery', 'Self-Help', 'Biography'].map((genre) => (
                  <span
                    key={genre}
                    className="px-3 py-1 text-xs bg-primary-100 dark:bg-primary-900/20 text-primary-700 dark:text-primary-300 rounded-full"
                  >
                    {genre}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserDashboard;