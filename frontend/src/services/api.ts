import axios from 'axios';
import { UserResponse, UserQuery, OrderResponse, OrderQuery, SearchResponse, QuoteSnapshot } from '../types';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001';

const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor
api.interceptors.request.use(
  (config) => {
    console.log(`🚀 ${config.method?.toUpperCase()} ${config.url}`);
    return config;
  },
  (error) => {
    console.error('❌ Request error:', error);
    return Promise.reject(error);
  }
);

// Response interceptor
api.interceptors.response.use(
  (response) => {
    console.log(`✅ ${response.status} ${response.config.url}`);
    return response;
  },
  (error) => {
    console.error('❌ Response error:', error.response?.status, error.response?.data);
    return Promise.reject(error);
  }
);

// Challenge 1: Data Processing API
export const dataApi = {
  // Seed database
  seedData: async (users: number, orders: number, products: number) => {
    const response = await api.post(`/dev/seed?users=${users}&orders=${orders}&products=${products}`);
    return response.data;
  },

  // Get users with pagination, sorting, and filtering
  getUsers: async (query: UserQuery): Promise<UserResponse> => {
    const params = new URLSearchParams();
    params.append('page', query.page.toString());
    params.append('pageSize', query.pageSize.toString());
    params.append('sortBy', query.sortBy);
    params.append('sortDir', query.sortDir);
    
    if (query.search) {
      params.append('search', query.search);
    }

    const response = await api.get(`/api/users?${params.toString()}`);
    return response.data;
  },

  // Get user orders
  getUserOrders: async (userId: number, query: OrderQuery): Promise<OrderResponse> => {
    const params = new URLSearchParams();
    params.append('page', query.page.toString());
    params.append('pageSize', query.pageSize.toString());

    const response = await api.get(`/api/users/${userId}/orders?${params.toString()}`);
    return response.data;
  },

  // Get products
  getProducts: async () => {
    const response = await api.get('/api/products');
    return response.data;
  },
};

// Challenge 2: Tree Hierarchy API
export const treeApi = {
  // Seed tree
  seedTree: async (breadth: number, depth: number) => {
    const response = await api.post(`/dev/seed?breadth=${breadth}&depth=${depth}`);
    return response.data;
  },

  // Get root nodes
  getRootNodes: async () => {
    const response = await api.get('/api/nodes/root');
    return response.data;
  },

  // Get node children
  getNodeChildren: async (nodeId: string) => {
    const response = await api.get(`/api/nodes/${nodeId}/children`);
    return response.data;
  },

  // Search nodes
  searchNodes: async (query: string, limit: number = 100): Promise<SearchResponse> => {
    const response = await api.get(`/api/search?q=${encodeURIComponent(query)}&limit=${limit}`);
    return response.data;
  },

  // Get single node
  getNode: async (nodeId: string) => {
    const response = await api.get(`/api/nodes/${nodeId}`);
    return response.data;
  },
};

// Challenge 3: Real-time Dashboard API
export const quoteApi = {
  // Get quote snapshot
  getSnapshot: async (symbols: string[]): Promise<QuoteSnapshot> => {
    const symbolsParam = symbols.join(',');
    const response = await api.get(`/api/quotes/snapshot?symbols=${symbolsParam}`);
    return response.data;
  },

  // Get available symbols
  getSymbols: async () => {
    const response = await api.get('/api/quotes/symbols');
    return response.data;
  },
};

export default api;
