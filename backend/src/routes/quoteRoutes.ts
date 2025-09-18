import { Router } from 'express';
import { z } from 'zod';
import { QuoteService } from '../services/QuoteService';
import { validateQuery, asyncHandler } from '../middleware';

const router = Router();
const quoteService = new QuoteService();

// Validation schemas
const snapshotQuerySchema = z.object({
  symbols: z.string().transform(str => str.split(',').map(s => s.trim()))
});

// Routes
router.get('/api/quotes/snapshot',
  validateQuery(snapshotQuerySchema),
  asyncHandler(async (req, res) => {
    const { symbols } = req.query;
    const snapshot = quoteService.getSnapshot(symbols);
    res.json(snapshot);
  })
);

router.get('/api/quotes/symbols',
  asyncHandler(async (req, res) => {
    const symbols = quoteService.getSymbols();
    res.json({ symbols });
  })
);

export default router;
