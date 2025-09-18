import { WebSocketMessage, WebSocketResponse, Quote } from '../types';

export class WebSocketService {
  private ws: WebSocket | null = null;
  private reconnectAttempts = 0;
  private maxReconnectAttempts = 5;
  private reconnectDelay = 1000;
  private subscribers: Set<(quote: Quote) => void> = new Set();
  private isConnecting = false;

  constructor(private url: string) {}

  connect(): Promise<void> {
    return new Promise((resolve, reject) => {
      if (this.isConnecting || (this.ws && this.ws.readyState === WebSocket.OPEN)) {
        resolve();
        return;
      }

      this.isConnecting = true;

      try {
        this.ws = new WebSocket(this.url);

        this.ws.onopen = () => {
          console.log('🔌 WebSocket connected');
          this.isConnecting = false;
          this.reconnectAttempts = 0;
          resolve();
        };

        this.ws.onmessage = (event) => {
          try {
            const data: WebSocketResponse = JSON.parse(event.data);
            this.notifySubscribers(data);
          } catch (error) {
            console.error('❌ Error parsing WebSocket message:', error);
          }
        };

        this.ws.onclose = (event) => {
          console.log('🔌 WebSocket closed:', event.code, event.reason);
          this.isConnecting = false;
          this.ws = null;

          if (!event.wasClean && this.reconnectAttempts < this.maxReconnectAttempts) {
            this.scheduleReconnect();
          }
        };

        this.ws.onerror = (error) => {
          console.error('❌ WebSocket error:', error);
          this.isConnecting = false;
          reject(error);
        };

        // Set up ping/pong for connection health
        this.setupHeartbeat();

      } catch (error) {
        this.isConnecting = false;
        reject(error);
      }
    });
  }

  private setupHeartbeat(): void {
    if (!this.ws) return;

    const pingInterval = setInterval(() => {
      if (this.ws && this.ws.readyState === WebSocket.OPEN) {
        this.ws.ping();
      } else {
        clearInterval(pingInterval);
      }
    }, 15000);
  }

  private scheduleReconnect(): void {
    const delay = this.reconnectDelay * Math.pow(2, this.reconnectAttempts);
    this.reconnectAttempts++;

    console.log(`🔄 Reconnecting in ${delay}ms (attempt ${this.reconnectAttempts}/${this.maxReconnectAttempts})`);

    setTimeout(() => {
      this.connect().catch((error) => {
        console.error('❌ Reconnection failed:', error);
      });
    }, delay);
  }

  subscribe(symbols: string[]): void {
    if (!this.ws || this.ws.readyState !== WebSocket.OPEN) {
      console.warn('⚠️ WebSocket not connected, cannot subscribe');
      return;
    }

    const message: WebSocketMessage = {
      type: 'subscribe',
      symbols
    };

    this.ws.send(JSON.stringify(message));
    console.log('📡 Subscribed to symbols:', symbols);
  }

  unsubscribe(symbols: string[]): void {
    if (!this.ws || this.ws.readyState !== WebSocket.OPEN) {
      console.warn('⚠️ WebSocket not connected, cannot unsubscribe');
      return;
    }

    const message: WebSocketMessage = {
      type: 'unsubscribe',
      symbols
    };

    this.ws.send(JSON.stringify(message));
    console.log('📡 Unsubscribed from symbols:', symbols);
  }

  addSubscriber(callback: (quote: Quote) => void): void {
    this.subscribers.add(callback);
  }

  removeSubscriber(callback: (quote: Quote) => void): void {
    this.subscribers.delete(callback);
  }

  private notifySubscribers(quote: Quote): void {
    this.subscribers.forEach(callback => {
      try {
        callback(quote);
      } catch (error) {
        console.error('❌ Error in subscriber callback:', error);
      }
    });
  }

  disconnect(): void {
    if (this.ws) {
      this.ws.close(1000, 'Client disconnect');
      this.ws = null;
    }
    this.subscribers.clear();
  }

  getConnectionState(): number {
    return this.ws?.readyState ?? WebSocket.CLOSED;
  }

  isConnected(): boolean {
    return this.ws?.readyState === WebSocket.OPEN;
  }
}

// Singleton instance
const WS_URL = import.meta.env.VITE_WS_URL || 'ws://localhost:3001';
export const wsService = new WebSocketService(WS_URL);
