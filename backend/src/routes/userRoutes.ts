import { Router } from 'express';
import { UserController } from '../controllers/userController.js';
import { authMiddleware, requireSuperAdmin } from '../middleware/auth.js';

const userRoutes = Router();

// Todas las rutas de gestión de usuarios requieren autenticación y rol SuperAdmin
userRoutes.use(authMiddleware);
userRoutes.use(requireSuperAdmin);

userRoutes.get('/', UserController.listUsers);
userRoutes.post('/', UserController.createUser);
userRoutes.put('/:id', UserController.updateUser);
userRoutes.delete('/:id', UserController.deleteUser);

export default userRoutes;
