import { Router } from 'express';
import { z } from 'zod';
import { TreeService } from '../services/TreeService';
import { validateQuery, validateParams, asyncHandler } from '../middleware';

const router = Router();
const treeService = new TreeService();

// Validation schemas
const seedQuerySchema = z.object({
  breadth: z.string().transform(Number).pipe(z.number().min(1).max(50)).default('20'),
  depth: z.string().transform(Number).pipe(z.number().min(1).max(15)).default('10')
});

const searchQuerySchema = z.object({
  q: z.string().min(1),
  limit: z.string().transform(Number).pipe(z.number().min(1).max(1000)).default('100')
});

const nodeIdSchema = z.object({
  id: z.string().min(1)
});

// Routes
router.post('/dev/seed',
  validateQuery(seedQuerySchema),
  asyncHandler(async (req, res) => {
    const { breadth, depth } = req.query;
    const result = treeService.seedTree(breadth, depth);
    
    res.json({
      message: 'Tree seeded successfully',
      counts: result
    });
  })
);

router.get('/api/nodes/root',
  asyncHandler(async (req, res) => {
    const rootNodes = treeService.getRootNodes();
    res.json({ items: rootNodes });
  })
);

router.get('/api/nodes/:id/children',
  validateParams(nodeIdSchema),
  asyncHandler(async (req, res) => {
    const { id } = req.params;
    const children = treeService.getNodeChildren(id);
    res.json({ items: children });
  })
);

router.get('/api/search',
  validateQuery(searchQuerySchema),
  asyncHandler(async (req, res) => {
    const { q, limit } = req.query;
    const result = treeService.searchNodes(q, limit);
    res.json(result);
  })
);

router.get('/api/nodes/:id',
  validateParams(nodeIdSchema),
  asyncHandler(async (req, res) => {
    const { id } = req.params;
    const node = treeService.getNode(id);
    
    if (!node) {
      return res.status(404).json({ error: 'Node not found' });
    }
    
    res.json(node);
  })
);

export default router;
