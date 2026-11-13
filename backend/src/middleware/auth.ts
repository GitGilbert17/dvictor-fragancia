import { Request, Response, NextFunction } from 'express';
import { verifyToken, UserPayload } from '../utils/security.js';

export interface AuthenticatedRequest extends Request {
  user?: UserPayload;
}

/**
 * Middleware para validar el token JWT en el encabezado Authorization
 */
export function authMiddleware(req: AuthenticatedRequest, res: Response, next: NextFunction): void {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    res.status(401).json({
      success: false,
      message: 'No autorizado: token no proporcionado o inválido',
    });
    return;
  }

  const token = authHeader.split(' ')[1];

  try {
    const payload = verifyToken(token);
    if (!payload.activo) {
      res.status(403).json({
        success: false,
        message: 'Acceso denegado: tu cuenta ha sido desactivada por el SuperAdmin',
      });
      return;
    }
    req.user = payload;
    next();
  } catch (err: any) {
    res.status(401).json({
      success: false,
      message: 'Sesión inválida o expirada. Por favor inicia sesión nuevamente.',
      error: err.message,
    });
  }
}

/**
 * Middleware que restringe el acceso EXCLUSIVAMENTE al rol SuperAdmin (Dueño)
 */
export function requireSuperAdmin(req: AuthenticatedRequest, res: Response, next: NextFunction): void {
  if (!req.user) {
    res.status(401).json({
      success: false,
      message: 'Usuario no autenticado',
    });
    return;
  }

  if (req.user.role !== 'SuperAdmin') {
    res.status(403).json({
      success: false,
      message: 'Acceso restringido: Solo el dueño (SuperAdmin) tiene permisos para gestionar usuarios administradores.',
    });
    return;
  }

  next();
}
