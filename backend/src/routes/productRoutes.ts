import { Router } from 'express';
import { ProductController } from '../controllers/productController.js';

const router = Router();

// Rutas de lectura para clientes y catálogo
router.get('/', ProductController.getProducts);
router.get('/destacados', ProductController.getFeatured);
router.get('/disponibles', ProductController.getAvailable);
router.get('/:id', ProductController.getProductById);

// Rutas de administración (CRUD)
router.post('/', ProductController.createProduct);
router.put('/:id', ProductController.updateProduct);
router.delete('/:id', ProductController.deleteProduct);

// Acciones rápidas de administración
router.patch('/:id/toggle-disponible', ProductController.toggleAvailability);
router.patch('/:id/toggle-destacado', ProductController.toggleFeatured);

export default router;
