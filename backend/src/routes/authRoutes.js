import { Router } from 'express';
import { login, getMe, logout } from '../controllers/authController.js';
import { protect } from '../middleware/auth.js';

const router = Router();

router.post('/login', login);
router.get('/me', protect, getMe);
router.get('/logout', logout);

export default router;