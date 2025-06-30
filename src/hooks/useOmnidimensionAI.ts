import { useState, useCallback, useEffect } from 'react';

interface OmnidimensionResponse {
  response: string;
  confidence: number;
  suggestions?: string[];
  bookRecommendations?: Array<{
    title: string;
    author: string;
    reason: string;
  }>;
}

interface OmnidimensionAI {
  isLoaded: boolean;
  isProcessing: boolean;
  sendQuery: (query: string, context?: any) => Promise<OmnidimensionResponse | null>;
  getBookRecommendations: (preferences: any) => Promise<any>;
  analyzeSearchIntent: (query: string) => Promise<any>;
}

declare global {
  interface Window {
    OmnidimensionAI?: {
      query: (text: string, options?: any) => Promise<any>;
      recommend: (preferences: any) => Promise<any>;
      analyze: (data: any) => Promise<any>;
      isReady: () => boolean;
    };
  }
}

export const useOmnidimensionAI = (): OmnidimensionAI => {
  const [isLoaded, setIsLoaded] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);

  useEffect(() => {
    // Check if Omnidimension AI is loaded
    const checkAILoaded = () => {
      if (window.OmnidimensionAI && window.OmnidimensionAI.isReady()) {
        setIsLoaded(true);
      } else {
        setTimeout(checkAILoaded, 100);
      }
    };

    checkAILoaded();
  }, []);

  const sendQuery = useCallback(async (query: string, context?: any): Promise<OmnidimensionResponse | null> => {
    if (!isLoaded || !window.OmnidimensionAI) {
      console.warn('Omnidimension AI not loaded');
      return null;
    }

    setIsProcessing(true);
    try {
      const response = await window.OmnidimensionAI.query(query, {
        context: 'book_search',
        userContext: context,
        ...context
      });

      return {
        response: response.text || response.response || '',
        confidence: response.confidence || 0.8,
        suggestions: response.suggestions || [],
        bookRecommendations: response.bookRecommendations || []
      };
    } catch (error) {
      console.error('Omnidimension AI query error:', error);
      return null;
    } finally {
      setIsProcessing(false);
    }
  }, [isLoaded]);

  const getBookRecommendations = useCallback(async (preferences: any) => {
    if (!isLoaded || !window.OmnidimensionAI) {
      return null;
    }

    setIsProcessing(true);
    try {
      const recommendations = await window.OmnidimensionAI.recommend({
        type: 'books',
        preferences,
        context: 'deal_finder'
      });
      return recommendations;
    } catch (error) {
      console.error('Omnidimension AI recommendation error:', error);
      return null;
    } finally {
      setIsProcessing(false);
    }
  }, [isLoaded]);

  const analyzeSearchIntent = useCallback(async (query: string) => {
    if (!isLoaded || !window.OmnidimensionAI) {
      return null;
    }

    setIsProcessing(true);
    try {
      const analysis = await window.OmnidimensionAI.analyze({
        text: query,
        type: 'search_intent',
        domain: 'books'
      });
      return analysis;
    } catch (error) {
      console.error('Omnidimension AI analysis error:', error);
      return null;
    } finally {
      setIsProcessing(false);
    }
  }, [isLoaded]);

  return {
    isLoaded,
    isProcessing,
    sendQuery,
    getBookRecommendations,
    analyzeSearchIntent
  };
};