import { Quote, QuoteSnapshot, WebSocketMessage, WebSocketResponse } from '../models';
import { WebSocket } from 'ws';

export class QuoteService {
  private quotes: Map<string, Quote> = new Map();
  private subscribers: Set<WebSocket> = new Set();
  private updateInterval: NodeJS.Timeout | null = null;
  private symbols: string[] = ['AAPL', 'MSFT', 'GOOG', 'AMZN', 'TSLA', 'META', 'NVDA', 'NFLX', 'AMD', 'INTC'];

  constructor() {
    this.initializeQuotes();
  }

  private initializeQuotes(): void {
    // Initialize with random prices
    for (const symbol of this.symbols) {
      this.quotes.set(symbol, {
        symbol,
        price: Math.random() * 1000 + 50,
        ts: new Date().toISOString()
      });
    }
  }

  public getSnapshot(symbols: string[]): QuoteSnapshot {
    const snapshot: QuoteSnapshot = {};
    
    for (const symbol of symbols) {
      const quote = this.quotes.get(symbol);
      if (quote) {
        snapshot[symbol] = quote;
      }
    }
    
    return snapshot;
  }

  public subscribe(client: WebSocket, message: WebSocketMessage): void {
    this.subscribers.add(client);
    
    // Send current quotes for subscribed symbols
    for (const symbol of message.symbols) {
      const quote = this.quotes.get(symbol);
      if (quote) {
        client.send(JSON.stringify(quote));
      }
    }
  }

  public unsubscribe(client: WebSocket): void {
    this.subscribers.delete(client);
  }

  public startUpdates(updatesPerSecond: number = 20): void {
    if (this.updateInterval) {
      clearInterval(this.updateInterval);
    }

    const intervalMs = 1000 / updatesPerSecond;
    this.updateInterval = setInterval(() => {
      this.updateQuotes();
    }, intervalMs);
  }

  public stopUpdates(): void {
    if (this.updateInterval) {
      clearInterval(this.updateInterval);
      this.updateInterval = null;
    }
  }

  private updateQuotes(): void {
    const updatedQuotes: Quote[] = [];
    
    for (const symbol of this.symbols) {
      const currentQuote = this.quotes.get(symbol);
      if (!currentQuote) continue;

      // Generate new price with some volatility
      const volatility = 0.02; // 2% volatility
      const change = (Math.random() - 0.5) * volatility;
      const newPrice = Math.max(0.01, currentQuote.price * (1 + change));

      const updatedQuote: Quote = {
        symbol,
        price: Math.round(newPrice * 100) / 100,
        ts: new Date().toISOString()
      };

      this.quotes.set(symbol, updatedQuote);
      updatedQuotes.push(updatedQuote);
    }

    // Broadcast updates to all subscribers
    this.broadcastUpdates(updatedQuotes);
  }

  private broadcastUpdates(quotes: Quote[]): void {
    const deadClients: WebSocket[] = [];

    for (const client of this.subscribers) {
      try {
        if (client.readyState === WebSocket.OPEN) {
          for (const quote of quotes) {
            client.send(JSON.stringify(quote));
          }
        } else {
          deadClients.push(client);
        }
      } catch (error) {
        console.error('Error broadcasting to client:', error);
        deadClients.push(client);
      }
    }

    // Remove dead clients
    for (const client of deadClients) {
      this.subscribers.delete(client);
    }
  }

  public getSymbols(): string[] {
    return [...this.symbols];
  }

  public addSymbol(symbol: string): void {
    if (!this.symbols.includes(symbol)) {
      this.symbols.push(symbol);
      this.quotes.set(symbol, {
        symbol,
        price: Math.random() * 1000 + 50,
        ts: new Date().toISOString()
      });
    }
  }

  public removeSymbol(symbol: string): void {
    const index = this.symbols.indexOf(symbol);
    if (index > -1) {
      this.symbols.splice(index, 1);
      this.quotes.delete(symbol);
    }
  }
}
