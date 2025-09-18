export interface Quote {
  symbol: string;
  price: number;
  ts: string;
}

export interface QuoteSnapshot {
  [symbol: string]: Quote;
}

export interface WebSocketMessage {
  type: 'subscribe' | 'unsubscribe';
  symbols: string[];
}

export interface WebSocketResponse {
  symbol: string;
  price: number;
  ts: string;
}
