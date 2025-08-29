import { Router } from 'express';
import {getProducts, getProductById, createProduct, updateProduct, deleteProduct, searchProducts} from '../controllers/productController.js';
import { protect } from '../middleware/auth.js';
import upload from '../config/multerConfig.js';

const router = Router();

// Rutas públicas
router.get('/', getProducts);
router.get('/search', searchProducts);
router.get('/:id', getProductById);

// Rutas protegidas (requieren autenticación)
router.post('/', protect, upload.single('image'), createProduct);
router.put('/:id', protect, upload.single('image'), updateProduct);
router.delete('/:id', protect, deleteProduct);

export default router;
