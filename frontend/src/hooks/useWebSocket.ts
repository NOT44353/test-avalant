import { useEffect, useRef, useCallback, useState } from 'react';
import { Quote } from '../types';
import { wsService } from '../services/websocket';

export function useWebSocket(symbols: string[]) {
  const quotesRef = useRef<Map<string, Quote>>(new Map());
  const [, forceUpdate] = useState({});

  const updateQuotes = useCallback((quote: Quote) => {
    quotesRef.current.set(quote.symbol, quote);
    forceUpdate({});
  }, []);

  useEffect(() => {
    const connectAndSubscribe = async () => {
      try {
        await wsService.connect();
        wsService.addSubscriber(updateQuotes);
        wsService.subscribe(symbols);
      } catch (error) {
        console.error('Failed to connect to WebSocket:', error);
      }
    };

    connectAndSubscribe();

    return () => {
      wsService.removeSubscriber(updateQuotes);
      wsService.unsubscribe(symbols);
    };
  }, [symbols, updateQuotes]);

  const getQuotes = useCallback(() => {
    return Array.from(quotesRef.current.values());
  }, []);

  const getQuote = useCallback((symbol: string) => {
    return quotesRef.current.get(symbol);
  }, []);

  return {
    quotes: getQuotes(),
    getQuote,
    isConnected: wsService.isConnected()
  };
}
