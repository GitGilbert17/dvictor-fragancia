import { Router } from 'express';
import productRoutes from './productRoutes.js';
import categoryRoutes from './categoryRoutes.js';
import authRoutes from './authRoutes.js';
import userRoutes from './userRoutes.js';
import { isDatabaseReady } from '../config/prisma.js';

const apiRouter = Router();

apiRouter.use('/productos', productRoutes);
apiRouter.use('/categorias', categoryRoutes);
apiRouter.use('/auth', authRoutes);
apiRouter.use('/usuarios', userRoutes);

// Health check y estado del sistema
apiRouter.get('/health', (_req, res) => {
  res.json({
    status: 'online',
    appName: 'D’ Victor Fragancias Backend API',
    database: isDatabaseReady() ? 'PostgreSQL (Prisma)' : 'Almacén Local Activo (Fallback)',
    version: '1.0.0',
    timestamp: new Date().toISOString(),
  });
});

export default apiRouter;
