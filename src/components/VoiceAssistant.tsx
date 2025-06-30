import React, { useState, useEffect } from 'react';
import { Mic, MicOff, Volume2, VolumeX, MessageCircle, X, Settings, Brain, Sparkles } from 'lucide-react';
import { useVoiceRecognition } from '../hooks/useVoiceRecognition';
import { useTextToSpeech } from '../hooks/useTextToSpeech';
import { useOmnidimensionAI } from '../hooks/useOmnidimensionAI';
import { useApp } from '../context/AppContext';
import { motion, AnimatePresence } from 'framer-motion';

interface VoiceAssistantProps {
  isOpen: boolean;
  onClose: () => void;
}

const VoiceAssistant: React.FC<VoiceAssistantProps> = ({ isOpen, onClose }) => {
  const { searchBooks, setCurrentView, books, wishlist } = useApp();
  const [isEnabled, setIsEnabled] = useState(true);
  const [showSettings, setShowSettings] = useState(false);
  const [selectedVoice, setSelectedVoice] = useState<string>('');
  const [speechRate, setSpeechRate] = useState(1);
  const [speechVolume, setSpeechVolume] = useState(1);
  const [conversationHistory, setConversationHistory] = useState<Array<{
    type: 'user' | 'assistant';
    message: string;
    timestamp: Date;
  }>>([]);

  const {
    isListening,
    transcript,
    confidence,
    isSupported: speechSupported,
    startListening,
    stopListening,
    resetTranscript,
    error
  } = useVoiceRecognition();

  const {
    speak,
    stop: stopSpeaking,
    isSpeaking,
    isSupported: ttsSupported,
    voices
  } = useTextToSpeech();

  const {
    isLoaded: aiLoaded,
    isProcessing: aiProcessing,
    sendQuery,
    getBookRecommendations,
    analyzeSearchIntent
  } = useOmnidimensionAI();

  useEffect(() => {
    if (transcript && !isListening && transcript.length > 0) {
      processVoiceCommand(transcript);
    }
  }, [transcript, isListening]);

  const addToConversation = (type: 'user' | 'assistant', message: string) => {
    setConversationHistory(prev => [...prev, {
      type,
      message,
      timestamp: new Date()
    }]);
  };

  const processVoiceCommand = async (command: string) => {
    const lowerCommand = command.toLowerCase().trim();
    addToConversation('user', command);
    
    // Use AI to analyze the command if available
    if (aiLoaded) {
      try {
        const intent = await analyzeSearchIntent(command);
        const aiResponse = await sendQuery(command, {
          currentBooks: books.length,
          wishlistCount: wishlist.length,
          intent: intent
        });

        if (aiResponse && aiResponse.response) {
          const responseText = aiResponse.response;
          addToConversation('assistant', responseText);
          
          // Execute the appropriate action based on AI analysis
          if (intent?.action === 'search' || lowerCommand.includes('search') || lowerCommand.includes('find')) {
            const searchTerm = intent?.searchTerm || command.replace(/search for|find book|find|search/gi, '').trim();
            if (searchTerm) {
              searchBooks(searchTerm);
            }
          } else if (intent?.action === 'navigate' || lowerCommand.includes('wishlist')) {
            setCurrentView('wishlist');
          } else if (lowerCommand.includes('dashboard')) {
            setCurrentView('dashboard');
          } else if (lowerCommand.includes('search page')) {
            setCurrentView('search');
          }

          // Speak the AI response
          speak(responseText, {
            rate: speechRate,
            volume: speechVolume,
            voice: voices.find(v => v.name === selectedVoice)
          });

          resetTranscript();
          return;
        }
      } catch (error) {
        console.error('AI processing error:', error);
      }
    }

    // Fallback to basic command processing
    let responseText = '';
    
    if (lowerCommand.includes('search for') || lowerCommand.includes('find book')) {
      const searchTerm = lowerCommand
        .replace(/search for|find book|find|search/gi, '')
        .trim();
      
      if (searchTerm) {
        searchBooks(searchTerm);
        responseText = `Searching for ${searchTerm}`;
      }
    }
    else if (lowerCommand.includes('show wishlist') || lowerCommand.includes('open wishlist')) {
      setCurrentView('wishlist');
      responseText = 'Opening your wishlist';
    }
    else if (lowerCommand.includes('show dashboard') || lowerCommand.includes('open dashboard')) {
      setCurrentView('dashboard');
      responseText = 'Opening your dashboard';
    }
    else if (lowerCommand.includes('go to search') || lowerCommand.includes('show search')) {
      setCurrentView('search');
      responseText = 'Going to search page';
    }
    else if (lowerCommand.includes('help') || lowerCommand.includes('what can you do')) {
      responseText = `I can help you search for books, navigate to your wishlist or dashboard, and provide AI-powered book recommendations. Try saying "search for atomic habits" or "show my wishlist".`;
    }
    else if (lowerCommand.includes('how many books') || lowerCommand.includes('book count')) {
      responseText = `I found ${books.length} books for you`;
    }
    else if (lowerCommand.includes('recommend') || lowerCommand.includes('suggestion')) {
      if (aiLoaded) {
        try {
          const recommendations = await getBookRecommendations({
            genres: ['fiction', 'self-help', 'mystery'],
            priceRange: [0, 50]
          });
          
          if (recommendations && recommendations.length > 0) {
            responseText = `I recommend checking out ${recommendations[0].title} by ${recommendations[0].author}. ${recommendations[0].reason}`;
          } else {
            responseText = 'Let me search for some great book deals for you';
            searchBooks('bestsellers');
          }
        } catch (error) {
          responseText = 'Let me search for some popular books for you';
          searchBooks('popular books');
        }
      } else {
        responseText = 'Let me search for some popular books for you';
        searchBooks('popular books');
      }
    }
    else {
      // Default search if no specific command detected
      searchBooks(command);
      responseText = `Searching for ${command}`;
    }
    
    addToConversation('assistant', responseText);
    speak(responseText, {
      rate: speechRate,
      volume: speechVolume,
      voice: voices.find(v => v.name === selectedVoice)
    });
    
    resetTranscript();
  };

  const handleVoiceToggle = () => {
    if (isListening) {
      stopListening();
    } else {
      startListening();
    }
  };

  const handleSpeechToggle = () => {
    if (isSpeaking) {
      stopSpeaking();
    } else {
      const welcomeMessage = aiLoaded 
        ? 'AI-powered voice assistant is ready to help you find the best book deals'
        : 'Voice assistant is ready to help you find the best book deals';
      
      speak(welcomeMessage, {
        rate: speechRate,
        volume: speechVolume,
        voice: voices.find(v => v.name === selectedVoice)
      });
    }
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 backdrop-blur-sm"
        onClick={onClose}
      >
        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.9, opacity: 0 }}
          className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl p-6 w-full max-w-md mx-4 max-h-[90vh] overflow-y-auto"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Header */}
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-gradient-to-r from-primary-500 to-secondary-500 rounded-full relative">
                <MessageCircle className="h-6 w-6 text-white" />
                {aiLoaded && (
                  <div className="absolute -top-1 -right-1 bg-green-500 rounded-full p-1">
                    <Brain className="h-3 w-3 text-white" />
                  </div>
                )}
              </div>
              <div>
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white flex items-center space-x-2">
                  <span>Voice Assistant</span>
                  {aiLoaded && <Sparkles className="h-4 w-4 text-yellow-500" />}
                </h3>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  {aiLoaded ? 'AI-powered assistant ready' : speechSupported && ttsSupported ? 'Ready to help' : 'Limited support'}
                </p>
              </div>
            </div>
            
            <div className="flex items-center space-x-2">
              <button
                onClick={() => setShowSettings(!showSettings)}
                className="p-2 text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200 transition-colors"
              >
                <Settings className="h-4 w-4" />
              </button>
              <button
                onClick={onClose}
                className="p-2 text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200 transition-colors"
              >
                <X className="h-5 w-5" />
              </button>
            </div>
          </div>

          {/* AI Status */}
          {aiProcessing && (
            <div className="mb-4 p-3 bg-blue-100 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg">
              <div className="flex items-center space-x-2">
                <div className="animate-spin">
                  <Brain className="h-4 w-4 text-blue-600 dark:text-blue-400" />
                </div>
                <span className="text-sm text-blue-700 dark:text-blue-300">
                  AI is thinking...
                </span>
              </div>
            </div>
          )}

          {/* Settings Panel */}
          {showSettings && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              className="mb-6 p-4 bg-gray-50 dark:bg-gray-700 rounded-lg space-y-4"
            >
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Voice
                </label>
                <select
                  value={selectedVoice}
                  onChange={(e) => setSelectedVoice(e.target.value)}
                  className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white text-sm focus:outline-none focus:ring-2 focus:ring-primary-500"
                >
                  <option value="">Default Voice</option>
                  {voices.map((voice) => (
                    <option key={voice.name} value={voice.name}>
                      {voice.name} ({voice.lang})
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Speech Rate: {speechRate}x
                </label>
                <input
                  type="range"
                  min="0.5"
                  max="2"
                  step="0.1"
                  value={speechRate}
                  onChange={(e) => setSpeechRate(Number(e.target.value))}
                  className="w-full"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Volume: {Math.round(speechVolume * 100)}%
                </label>
                <input
                  type="range"
                  min="0"
                  max="1"
                  step="0.1"
                  value={speechVolume}
                  onChange={(e) => setSpeechVolume(Number(e.target.value))}
                  className="w-full"
                />
              </div>
            </motion.div>
          )}

          {/* Voice Controls */}
          <div className="flex items-center justify-center space-x-4 mb-6">
            <button
              onClick={handleVoiceToggle}
              disabled={!speechSupported}
              className={`p-4 rounded-full transition-all duration-200 ${
                isListening
                  ? 'bg-red-500 hover:bg-red-600 text-white animate-pulse'
                  : 'bg-primary-500 hover:bg-primary-600 text-white'
              } ${!speechSupported ? 'opacity-50 cursor-not-allowed' : 'transform hover:scale-105'}`}
            >
              {isListening ? <MicOff className="h-6 w-6" /> : <Mic className="h-6 w-6" />}
            </button>

            <button
              onClick={handleSpeechToggle}
              disabled={!ttsSupported}
              className={`p-4 rounded-full transition-all duration-200 ${
                isSpeaking
                  ? 'bg-green-500 hover:bg-green-600 text-white animate-pulse'
                  : 'bg-secondary-500 hover:bg-secondary-600 text-white'
              } ${!ttsSupported ? 'opacity-50 cursor-not-allowed' : 'transform hover:scale-105'}`}
            >
              {isSpeaking ? <VolumeX className="h-6 w-6" /> : <Volume2 className="h-6 w-6" />}
            </button>
          </div>

          {/* Status */}
          <div className="text-center mb-4">
            {isListening && (
              <div className="flex items-center justify-center space-x-2 text-red-600 dark:text-red-400">
                <div className="w-2 h-2 bg-red-500 rounded-full animate-pulse" />
                <span className="text-sm font-medium">Listening...</span>
              </div>
            )}
            
            {isSpeaking && (
              <div className="flex items-center justify-center space-x-2 text-green-600 dark:text-green-400">
                <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
                <span className="text-sm font-medium">Speaking...</span>
              </div>
            )}

            {!isListening && !isSpeaking && (
              <span className="text-sm text-gray-500 dark:text-gray-400">
                {aiLoaded ? 'AI assistant ready' : 'Ready to help'}
              </span>
            )}
          </div>

          {/* Transcript */}
          {transcript && (
            <div className="mb-4 p-3 bg-gray-100 dark:bg-gray-700 rounded-lg">
              <p className="text-sm text-gray-700 dark:text-gray-300">
                <span className="font-medium">You said:</span> "{transcript}"
              </p>
              {confidence > 0 && (
                <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                  Confidence: {Math.round(confidence * 100)}%
                </p>
              )}
            </div>
          )}

          {/* Conversation History */}
          {conversationHistory.length > 0 && (
            <div className="mb-4 max-h-40 overflow-y-auto space-y-2">
              {conversationHistory.slice(-3).map((entry, index) => (
                <div
                  key={index}
                  className={`p-2 rounded-lg text-sm ${
                    entry.type === 'user'
                      ? 'bg-primary-100 dark:bg-primary-900/20 text-primary-800 dark:text-primary-200 ml-4'
                      : 'bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-200 mr-4'
                  }`}
                >
                  <span className="font-medium">
                    {entry.type === 'user' ? 'You: ' : 'Assistant: '}
                  </span>
                  {entry.message}
                </div>
              ))}
            </div>
          )}

          {/* Error */}
          {error && (
            <div className="mb-4 p-3 bg-red-100 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg">
              <p className="text-sm text-red-700 dark:text-red-300">
                Error: {error}
              </p>
            </div>
          )}

          {/* Help Text */}
          <div className="text-center">
            <p className="text-xs text-gray-500 dark:text-gray-400 mb-2">
              {aiLoaded ? 'Try asking naturally:' : 'Try saying:'}
            </p>
            <div className="space-y-1 text-xs text-gray-600 dark:text-gray-300">
              {aiLoaded ? (
                <>
                  <p>"Find me some good mystery books"</p>
                  <p>"What books would you recommend?"</p>
                  <p>"Show me my wishlist"</p>
                  <p>"Help me find a book about habits"</p>
                </>
              ) : (
                <>
                  <p>"Search for Atomic Habits"</p>
                  <p>"Show my wishlist"</p>
                  <p>"Open dashboard"</p>
                  <p>"Help" for more commands</p>
                </>
              )}
            </div>
          </div>

          {/* Browser Support Warning */}
          {(!speechSupported || !ttsSupported) && (
            <div className="mt-4 p-3 bg-yellow-100 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-lg">
              <p className="text-sm text-yellow-700 dark:text-yellow-300">
                {!speechSupported && !ttsSupported
                  ? 'Voice features are not supported in this browser.'
                  : !speechSupported
                  ? 'Voice recognition is not supported in this browser.'
                  : 'Text-to-speech is not supported in this browser.'
                }
              </p>
            </div>
          )}

          {/* AI Status */}
          {aiLoaded && (
            <div className="mt-4 p-3 bg-green-100 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg">
              <div className="flex items-center space-x-2">
                <Brain className="h-4 w-4 text-green-600 dark:text-green-400" />
                <span className="text-sm text-green-700 dark:text-green-300">
                  AI-powered assistant is active
                </span>
              </div>
            </div>
          )}
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};

export default VoiceAssistant;