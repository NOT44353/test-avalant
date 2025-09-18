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
