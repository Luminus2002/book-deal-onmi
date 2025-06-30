import React from 'react';
import Header from './components/Header';
import SearchBar from './components/SearchBar';
import SearchResults from './components/SearchResults';
import WishlistView from './components/WishlistView';
import UserDashboard from './components/UserDashboard';
import VoiceButton from './components/VoiceButton';
import { AppProvider, useApp } from './context/AppContext';

const AppContent: React.FC = () => {
  const { currentView } = useApp();

  const renderCurrentView = () => {
    switch (currentView) {
      case 'wishlist':
        return <WishlistView />;
      case 'dashboard':
        return <UserDashboard />;
      default:
        return <SearchResults />;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors duration-200">
      <Header />
      
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-12">
        {/* Hero Section with Search */}
        {currentView === 'search' && (
          <div className="py-12 text-center">
            <div className="mb-8">
              <h1 className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-white mb-4">
                Find the Best
                <span className="bg-gradient-to-r from-primary-600 to-secondary-600 bg-clip-text text-transparent">
                  {' '}Book Deals
                </span>
              </h1>
              <p className="text-xl text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
                Compare prices across multiple retailers and discover amazing deals with our AI-powered book finder
              </p>
            </div>
            
            <SearchBar />
          </div>
        )}

        {/* Main Content */}
        <div className="py-6">
          {renderCurrentView()}
        </div>
      </main>

      {/* Voice Assistant Button */}
      <VoiceButton />
    </div>
  );
};

function App() {
  return (
    <AppProvider>
      <AppContent />
    </AppProvider>
  );
}

export default App;