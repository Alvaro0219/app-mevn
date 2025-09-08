import { Router } from 'express';
import { createSale, getSales, getSaleById } from '../controllers/saleController.js';
import { protect } from '../middleware/auth.js';

const router = Router();

// Rutas de ventas
router.post('/', protect, createSale);
router.get('/', protect, getSales);
router.get('/:id', protect, getSaleById);

export default router;