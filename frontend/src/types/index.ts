// Challenge 1: Data Processing
export interface User {
  id: number;
  name: string;
  email: string;
  createdAt: string;
}

export interface UserRow extends User {
  orderCount: number;
  orderTotal: number;
}

export interface UserQuery {
  page: number;
  pageSize: number;
  search?: string;
  sortBy: 'name' | 'email' | 'createdAt' | 'orderTotal';
  sortDir: 'asc' | 'desc';
}

export interface UserResponse {
  items: UserRow[];
  total: number;
  page: number;
  pageSize: number;
}

export interface Order {
  id: number;
  userId: number;
  productId: number;
  amount: number;
  createdAt: string;
}

export interface OrderQuery {
  page: number;
  pageSize: number;
}

export interface OrderResponse {
  items: Order[];
  total: number;
  page: number;
  pageSize: number;
}

export interface Product {
  id: number;
  name: string;
  price: number;
}

// Challenge 2: Tree Hierarchy
export interface Node {
  id: string;
  parentId: string | null;
  name: string;
  hasChildren: boolean;
}

export interface SearchResult {
  id: string;
  name: string;
  path: Array<{ id: string; name: string }>;
}

export interface SearchResponse {
  items: SearchResult[];
}

// Challenge 3: Real-time Dashboard
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

// Common types
export interface ApiResponse<T> {
  data: T;
  error?: string;
}

export interface PaginationInfo {
  page: number;
  pageSize: number;
  total: number;
  totalPages: number;
}
