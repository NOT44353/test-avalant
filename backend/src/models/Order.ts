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
