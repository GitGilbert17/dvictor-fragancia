import { Response } from 'express';
import { UserRepository } from '../repositories/userRepository.js';
import { AuthenticatedRequest } from '../middleware/auth.js';

export class UserController {
  /**
   * GET /api/usuarios
   * Lista todos los administradores (Exclusivo SuperAdmin)
   */
  static async listUsers(req: AuthenticatedRequest, res: Response): Promise<void> {
    try {
      const users = await UserRepository.findAll();
      res.json({
        success: true,
        data: users,
      });
    } catch (err: any) {
      console.error('Error al listar usuarios:', err);
      res.status(500).json({
        success: false,
        message: 'Error al obtener la lista de usuarios',
        error: err.message,
      });
    }
  }

  /**
   * POST /api/usuarios
   * Crea un nuevo usuario con rol Administrador (Exclusivo SuperAdmin)
   */
  static async createUser(req: AuthenticatedRequest, res: Response): Promise<void> {
    try {
      const { nombre, email, password } = req.body;

      if (!nombre || !email || !password) {
        res.status(400).json({
          success: false,
          message: 'Debe ingresar nombre completo, correo electrónico y contraseña',
        });
        return;
      }

      if (password.length < 6) {
        res.status(400).json({
          success: false,
          message: 'La contraseña debe tener al menos 6 caracteres',
        });
        return;
      }

      const created = await UserRepository.createAdmin({
        nombre: nombre.trim(),
        email: email.trim(),
        password,
      });

      res.status(201).json({
        success: true,
        message: 'Administrador creado exitosamente',
        data: created,
      });
    } catch (err: any) {
      console.error('Error al crear usuario:', err);
      res.status(400).json({
        success: false,
        message: err.message || 'No fue posible crear el usuario',
      });
    }
  }

  /**
   * PUT /api/usuarios/:id
   * Actualiza datos de un usuario (Exclusivo SuperAdmin)
   */
  static async updateUser(req: AuthenticatedRequest, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      const { nombre, email, password, activo } = req.body;

      const updated = await UserRepository.updateUser(id, {
        nombre,
        email,
        password,
        activo,
      });

      res.json({
        success: true,
        message: 'Usuario actualizado correctamente',
        data: updated,
      });
    } catch (err: any) {
      console.error('Error al actualizar usuario:', err);
      res.status(400).json({
        success: false,
        message: err.message || 'No fue posible actualizar el usuario',
      });
    }
  }

  /**
   * DELETE /api/usuarios/:id
   * Elimina un usuario administrador (Exclusivo SuperAdmin)
   */
  static async deleteUser(req: AuthenticatedRequest, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      const requesterId = req.user?.id || '';

      await UserRepository.deleteUser(id, requesterId);

      res.json({
        success: true,
        message: 'Usuario eliminado satisfactoriamente',
      });
    } catch (err: any) {
      console.error('Error al eliminar usuario:', err);
      res.status(400).json({
        success: false,
        message: err.message || 'No fue posible eliminar el usuario',
      });
    }
  }
}
