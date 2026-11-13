import { Router } from 'express';
import { AuthController } from '../controllers/authController.js';
import { authMiddleware } from '../middleware/auth.js';

const authRoutes = Router();

authRoutes.post('/login', AuthController.login);
authRoutes.get('/me', authMiddleware, AuthController.getProfile);
authRoutes.put('/profile', authMiddleware, AuthController.updateProfile);

export default authRoutes;
