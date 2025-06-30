import React, { useState, useEffect, useRef } from 'react';
import { Search, X, Sparkles, Mic, MicOff } from 'lucide-react';
import { searchSuggestions } from '../data/mockData';
import { SearchSuggestion } from '../types';
import { useApp } from '../context/AppContext';
import { useVoiceRecognition } from '../hooks/useVoiceRecognition';

const SearchBar: React.FC = () => {
  const { searchQuery, searchBooks } = useApp();
  const [inputValue, setInputValue] = useState(searchQuery);
  const [suggestions, setSuggestions] = useState<SearchSuggestion[]>([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState(-1);
  const inputRef = useRef<HTMLInputElement>(null);

  const {
    isListening,
    transcript,
    isSupported: voiceSupported,
    startListening,
    stopListening,
    resetTranscript
  } = useVoiceRecognition();

  useEffect(() => {
    if (inputValue.length >= 2) {
      const filtered = searchSuggestions.filter(suggestion =>
        suggestion.text.toLowerCase().includes(inputValue.toLowerCase())
      );
      setSuggestions(filtered.slice(0, 6));
      setShowSuggestions(true);
    } else {
      setShowSuggestions(false);
      setSuggestions([]);
    }
    setSelectedIndex(-1);
  }, [inputValue]);

  useEffect(() => {
    if (transcript && !isListening) {
      setInputValue(transcript);
      handleSearch(transcript);
      resetTranscript();
    }
  }, [transcript, isListening]);

  const handleSearch = (query: string = inputValue) => {
    if (query.trim()) {
      searchBooks(query.trim());
      setShowSuggestions(false);
      setInputValue(query);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setSelectedIndex(prev => prev < suggestions.length - 1 ? prev + 1 : prev);
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setSelectedIndex(prev => prev > 0 ? prev - 1 : -1);
    } else if (e.key === 'Enter') {
      e.preventDefault();
      if (selectedIndex >= 0) {
        handleSearch(suggestions[selectedIndex].text);
      } else {
        handleSearch();
      }
    } else if (e.key === 'Escape') {
      setShowSuggestions(false);
      setSelectedIndex(-1);
    }
  };

  const handleVoiceToggle = () => {
    if (isListening) {
      stopListening();
    } else {
      startListening();
    }
  };

  const getSuggestionIcon = (type: string) => {
    switch (type) {
      case 'book': return '📚';
      case 'author': return '✍️';
      case 'genre': return '📂';
      default: return '🔍';
    }
  };

  return (
    <div className="relative w-full max-w-2xl mx-auto">
      <div className="relative">
        <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
          <Search className="h-5 w-5 text-gray-400" />
        </div>
        
        <input
          ref={inputRef}
          type="text"
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          onKeyDown={handleKeyDown}
          onFocus={() => inputValue.length >= 2 && setShowSuggestions(true)}
          placeholder="Search for books, authors, or genres..."
          className="w-full pl-12 pr-32 py-4 text-lg border-2 border-gray-200 dark:border-gray-700 rounded-xl bg-white dark:bg-gray-800 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:border-primary-500 dark:focus:border-primary-400 focus:ring-4 focus:ring-primary-100 dark:focus:ring-primary-900/20 transition-all duration-200"
        />

        <div className="absolute inset-y-0 right-0 flex items-center space-x-2 pr-4">
          {inputValue && (
            <button
              onClick={() => {
                setInputValue('');
                setShowSuggestions(false);
                inputRef.current?.focus();
              }}
              className="p-1 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors"
            >
              <X className="h-4 w-4" />
            </button>
          )}

          {voiceSupported && (
            <button
              onClick={handleVoiceToggle}
              className={`p-2 rounded-lg transition-all duration-200 ${
                isListening
                  ? 'bg-red-100 dark:bg-red-900/20 text-red-600 dark:text-red-400 animate-pulse'
                  : 'bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
              }`}
              title={isListening ? 'Stop listening' : 'Start voice search'}
            >
              {isListening ? <MicOff className="h-4 w-4" /> : <Mic className="h-4 w-4" />}
            </button>
          )}
          
          <button
            onClick={() => handleSearch()}
            className="bg-gradient-to-r from-primary-500 to-secondary-500 hover:from-primary-600 hover:to-secondary-600 text-white px-4 py-2 rounded-lg transition-all duration-200 transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2 dark:focus:ring-offset-gray-800"
          >
            <Search className="h-4 w-4" />
          </button>
        </div>
      </div>

      {/* Voice feedback */}
      {isListening && (
        <div className="flex items-center justify-center mt-2 text-sm text-red-600 dark:text-red-400">
          <div className="flex items-center space-x-2">
            <div className="w-2 h-2 bg-red-500 rounded-full animate-pulse" />
            <span>Listening... Speak now</span>
          </div>
        </div>
      )}

      {/* AI-powered search hint */}
      {!isListening && (
        <div className="flex items-center justify-center mt-2 text-sm text-gray-500 dark:text-gray-400">
          <Sparkles className="h-4 w-4 mr-1" />
          <span>AI-powered search with voice support and personalized recommendations</span>
        </div>
      )}

      {/* Suggestions dropdown */}
      {showSuggestions && suggestions.length > 0 && (
        <div className="absolute top-full left-0 right-0 mt-2 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl shadow-xl z-50 overflow-hidden animate-fade-in">
          {suggestions.map((suggestion, index) => (
            <button
              key={suggestion.id}
              onClick={() => handleSearch(suggestion.text)}
              className={`w-full px-4 py-3 text-left hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors flex items-center space-x-3 ${
                index === selectedIndex ? 'bg-primary-50 dark:bg-primary-900/20' : ''
              }`}
            >
              <span className="text-lg">{getSuggestionIcon(suggestion.type)}</span>
              <div className="flex-1">
                <div className="text-gray-900 dark:text-white">{suggestion.text}</div>
                <div className="text-xs text-gray-500 dark:text-gray-400 capitalize">
                  {suggestion.type}
                  {suggestion.count && ` • ${suggestion.count.toLocaleString()} results`}
                </div>
              </div>
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

export default SearchBar;