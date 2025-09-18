import { User, UserRow, UserQuery, UserResponse, Order, OrderQuery, OrderResponse, Product } from '../models';

export class DataService {
  private users: User[] = [];
  private products: Product[] = [];
  private orders: Order[] = [];
  private userOrderMap: Map<number, { count: number; total: number }> = new Map();

  constructor() {
    this.initializeData();
  }

  private initializeData(): void {
    // Initialize with empty data - will be populated by seed endpoint
  }

  public seedData(usersCount: number, ordersCount: number, productsCount: number): { users: number; orders: number; products: number } {
    // Clear existing data
    this.users = [];
    this.products = [];
    this.orders = [];
    this.userOrderMap.clear();

    // Generate products
    for (let i = 1; i <= productsCount; i++) {
      this.products.push({
        id: i,
        name: `Product ${i}`,
        price: Math.random() * 1000 + 10
      });
    }

    // Generate users
    for (let i = 1; i <= usersCount; i++) {
      this.users.push({
        id: i,
        name: `User ${i}`,
        email: `user${i}@example.com`,
        createdAt: new Date(Date.now() - Math.random() * 365 * 24 * 60 * 60 * 1000).toISOString()
      });
    }

    // Generate orders
    for (let i = 1; i <= ordersCount; i++) {
      const userId = Math.floor(Math.random() * usersCount) + 1;
      const productId = Math.floor(Math.random() * productsCount) + 1;
      const amount = Math.random() * 1000 + 1;

      this.orders.push({
        id: i,
        userId,
        productId,
        amount,
        createdAt: new Date(Date.now() - Math.random() * 30 * 24 * 60 * 60 * 1000).toISOString()
      });
    }

    // Precompute user order aggregations
    this.computeUserOrderAggregations();

    return {
      users: this.users.length,
      orders: this.orders.length,
      products: this.products.length
    };
  }

  private computeUserOrderAggregations(): void {
    this.userOrderMap.clear();
    
    for (const order of this.orders) {
      const existing = this.userOrderMap.get(order.userId) || { count: 0, total: 0 };
      this.userOrderMap.set(order.userId, {
        count: existing.count + 1,
        total: existing.total + order.amount
      });
    }
  }

  public getUsers(query: UserQuery): UserResponse {
    let filteredUsers = [...this.users];

    // Apply search filter
    if (query.search) {
      const searchLower = query.search.toLowerCase();
      filteredUsers = filteredUsers.filter(user => 
        user.name.toLowerCase().includes(searchLower) ||
        user.email.toLowerCase().includes(searchLower)
      );
    }

    // Apply sorting
    filteredUsers.sort((a, b) => {
      let aValue: any;
      let bValue: any;

      switch (query.sortBy) {
        case 'name':
          aValue = a.name;
          bValue = b.name;
          break;
        case 'email':
          aValue = a.email;
          bValue = b.email;
          break;
        case 'createdAt':
          aValue = new Date(a.createdAt).getTime();
          bValue = new Date(b.createdAt).getTime();
          break;
        case 'orderTotal':
          aValue = this.userOrderMap.get(a.id)?.total || 0;
          bValue = this.userOrderMap.get(b.id)?.total || 0;
          break;
        default:
          aValue = a.name;
          bValue = b.name;
      }

      if (query.sortDir === 'desc') {
        return bValue > aValue ? 1 : bValue < aValue ? -1 : 0;
      } else {
        return aValue > bValue ? 1 : aValue < bValue ? -1 : 0;
      }
    });

    // Apply pagination
    const total = filteredUsers.length;
    const startIndex = (query.page - 1) * query.pageSize;
    const endIndex = startIndex + query.pageSize;
    const paginatedUsers = filteredUsers.slice(startIndex, endIndex);

    // Convert to UserRow with aggregations
    const userRows: UserRow[] = paginatedUsers.map(user => {
      const orderData = this.userOrderMap.get(user.id) || { count: 0, total: 0 };
      return {
        ...user,
        orderCount: orderData.count,
        orderTotal: orderData.total
      };
    });

    return {
      items: userRows,
      total,
      page: query.page,
      pageSize: query.pageSize
    };
  }

  public getUserOrders(userId: number, query: OrderQuery): OrderResponse {
    const userOrders = this.orders.filter(order => order.userId === userId);
    
    const total = userOrders.length;
    const startIndex = (query.page - 1) * query.pageSize;
    const endIndex = startIndex + query.pageSize;
    const paginatedOrders = userOrders.slice(startIndex, endIndex);

    return {
      items: paginatedOrders,
      total,
      page: query.page,
      pageSize: query.pageSize
    };
  }

  public getProducts(): Product[] {
    return [...this.products];
  }
}
