import { DataService } from '../src/services/DataService';

describe('DataService', () => {
  let dataService: DataService;

  beforeEach(() => {
    dataService = new DataService();
  });

  describe('seedData', () => {
    it('should seed data with correct counts', () => {
      const result = dataService.seedData(100, 1000, 50);
      
      expect(result.users).toBe(100);
      expect(result.orders).toBe(1000);
      expect(result.products).toBe(50);
    });

    it('should handle large datasets', () => {
      const result = dataService.seedData(50000, 500000, 10000);
      
      expect(result.users).toBe(50000);
      expect(result.orders).toBe(500000);
      expect(result.products).toBe(10000);
    });
  });

  describe('getUsers', () => {
    beforeEach(() => {
      dataService.seedData(100, 1000, 50);
    });

    it('should return paginated users', () => {
      const result = dataService.getUsers({
        page: 1,
        pageSize: 10,
        sortBy: 'name',
        sortDir: 'asc'
      });

      expect(result.items).toHaveLength(10);
      expect(result.total).toBe(100);
      expect(result.page).toBe(1);
      expect(result.pageSize).toBe(10);
    });

    it('should filter users by search term', () => {
      const result = dataService.getUsers({
        page: 1,
        pageSize: 50,
        search: 'User 1',
        sortBy: 'name',
        sortDir: 'asc'
      });

      expect(result.items.length).toBeGreaterThan(0);
      expect(result.items.every(user => 
        user.name.includes('User 1') || user.email.includes('User 1')
      )).toBe(true);
    });

    it('should sort users correctly', () => {
      const result = dataService.getUsers({
        page: 1,
        pageSize: 10,
        sortBy: 'name',
        sortDir: 'asc'
      });

      const names = result.items.map(user => user.name);
      const sortedNames = [...names].sort();
      expect(names).toEqual(sortedNames);
    });

    it('should include order aggregations', () => {
      const result = dataService.getUsers({
        page: 1,
        pageSize: 10,
        sortBy: 'name',
        sortDir: 'asc'
      });

      expect(result.items[0]).toHaveProperty('orderCount');
      expect(result.items[0]).toHaveProperty('orderTotal');
      expect(typeof result.items[0].orderCount).toBe('number');
      expect(typeof result.items[0].orderTotal).toBe('number');
    });
  });

  describe('getUserOrders', () => {
    beforeEach(() => {
      dataService.seedData(10, 100, 20);
    });

    it('should return user orders', () => {
      const result = dataService.getUserOrders(1, {
        page: 1,
        pageSize: 10
      });

      expect(result.items).toBeDefined();
      expect(result.total).toBeGreaterThanOrEqual(0);
      expect(result.page).toBe(1);
      expect(result.pageSize).toBe(10);
    });

    it('should only return orders for specified user', () => {
      const result = dataService.getUserOrders(1, {
        page: 1,
        pageSize: 50
      });

      expect(result.items.every(order => order.userId === 1)).toBe(true);
    });
  });
});
