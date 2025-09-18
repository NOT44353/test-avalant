import { Router } from 'express';
import { z } from 'zod';
import { DataService } from '../services/DataService';
import { validateQuery, validateParams, asyncHandler } from '../middleware';

const router = Router();
const dataService = new DataService();

// Validation schemas
const seedQuerySchema = z.object({
  users: z.string().transform(Number).pipe(z.number().min(1).max(100000)),
  orders: z.string().transform(Number).pipe(z.number().min(1).max(1000000)),
  products: z.string().transform(Number).pipe(z.number().min(1).max(50000))
});

const userQuerySchema = z.object({
  page: z.string().transform(Number).pipe(z.number().min(1)).default('1'),
  pageSize: z.string().transform(Number).pipe(z.number().min(1).max(200)).default('50'),
  search: z.string().optional(),
  sortBy: z.enum(['name', 'email', 'createdAt', 'orderTotal']).default('name'),
  sortDir: z.enum(['asc', 'desc']).default('asc')
});

const orderQuerySchema = z.object({
  page: z.string().transform(Number).pipe(z.number().min(1)).default('1'),
  pageSize: z.string().transform(Number).pipe(z.number().min(1).max(200)).default('50')
});

const userIdSchema = z.object({
  id: z.string().transform(Number).pipe(z.number().min(1))
});

// Routes
router.post('/dev/seed', 
  validateQuery(seedQuerySchema),
  asyncHandler(async (req, res) => {
    const { users, orders, products } = req.query;
    const result = dataService.seedData(users, orders, products);
    
    res.json({
      message: 'Database seeded successfully',
      counts: result
    });
  })
);

router.get('/api/users',
  validateQuery(userQuerySchema),
  asyncHandler(async (req, res) => {
    const result = dataService.getUsers(req.query);
    res.json(result);
  })
);

router.get('/api/users/:id/orders',
  validateParams(userIdSchema),
  validateQuery(orderQuerySchema),
  asyncHandler(async (req, res) => {
    const { id } = req.params;
    const result = dataService.getUserOrders(id, req.query);
    res.json(result);
  })
);

router.get('/api/products',
  asyncHandler(async (req, res) => {
    const products = dataService.getProducts();
    res.json({ products });
  })
);

export default router;
