import { Request, Response } from 'express';
import { UserRepository } from '../repositories/userRepository.js';
import { verifyPassword, generateToken } from '../utils/security.js';
import { AuthenticatedRequest } from '../middleware/auth.js';

export class AuthController {
  /**
   * POST /api/auth/login
   * Autentica con usuario o email y contraseña
   */
  static async login(req: Request, res: Response): Promise<void> {
    try {
      const { email, username, password } = req.body;
      const identifier = (email || username || '').trim();

      if (!identifier || !password) {
        res.status(400).json({
          success: false,
          message: 'Debe ingresar su usuario/correo y contraseña',
        });
        return;
      }

      const user = await UserRepository.findByEmailOrUsername(identifier);

      if (!user) {
        res.status(401).json({
          success: false,
          message: 'Credenciales inválidas: usuario o contraseña incorrectos',
        });
        return;
      }

      if (!user.activo) {
        res.status(403).json({
          success: false,
          message: 'Tu cuenta de administrador está inactiva. Contacta al dueño (SuperAdmin).',
        });
        return;
      }

      const isValidPassword = verifyPassword(password, user.password_hash);
      if (!isValidPassword) {
        res.status(401).json({
          success: false,
          message: 'Credenciales inválidas: usuario o contraseña incorrectos',
        });
        return;
      }

      const payload = {
        id: user.id,
        nombre: user.nombre,
        email: user.email,
        role: user.role,
        activo: user.activo,
      };

      const token = generateToken(payload);

      res.json({
        success: true,
        message: `Bienvenido, ${user.nombre}`,
        data: {
          user: payload,
          token,
        },
      });
    } catch (err: any) {
      console.error('Error en login:', err);
      res.status(500).json({
        success: false,
        message: 'Error interno en el servidor de autenticación',
        error: err.message,
      });
    }
  }

  /**
   * GET /api/auth/me
   * Retorna los datos del usuario actualmente autenticado
   */
  static async getProfile(req: AuthenticatedRequest, res: Response): Promise<void> {
    try {
      res.json({
        success: true,
        data: req.user,
      });
    } catch (err: any) {
      res.status(500).json({
        success: false,
        message: 'Error al consultar perfil',
      });
    }
  }

  /**
   * PUT /api/auth/profile
   * Actualiza la información personal del usuario autenticado (nombre, usuario/email, contraseña)
   */
  static async updateProfile(req: AuthenticatedRequest, res: Response): Promise<void> {
    try {
      const userId = req.user?.id;
      if (!userId) {
        res.status(401).json({
          success: false,
          message: 'Usuario no autenticado',
        });
        return;
      }

      const { nombre, email, password } = req.body;

      if (password && password.length < 6) {
        res.status(400).json({
          success: false,
          message: 'La nueva contraseña debe tener al menos 6 caracteres',
        });
        return;
      }

      const updated = await UserRepository.updateUser(userId, {
        nombre,
        email,
        password: password ? password : undefined,
      });

      const payload = {
        id: updated.id,
        nombre: updated.nombre,
        email: updated.email,
        role: updated.role,
        activo: updated.activo,
      };

      const token = generateToken(payload);

      res.json({
        success: true,
        message: 'Información de perfil actualizada con éxito',
        data: {
          user: payload,
          token,
        },
      });
    } catch (err: any) {
      console.error('Error al actualizar perfil:', err);
      res.status(400).json({
        success: false,
        message: err.message || 'No fue posible actualizar tu perfil',
      });
    }
  }
}
