import { prisma, isDatabaseReady } from '../config/prisma.js';
import { hashPassword, verifyPassword } from '../utils/security.js';
import { serializeItem } from '../utils/serializer.js';

export interface UserRecord {
  id: string;
  nombre: string;
  email: string;
  password_hash: string;
  rol_id: number;
  role: 'SuperAdmin' | 'Administrador';
  activo: boolean;
  fecha_creacion: string;
}

// SuperAdmin inicial por defecto en memoria (Dueño)
const DEFAULT_SUPERADMIN_HASH = hashPassword('dvictor2026');
// Administrador delegado inicial para pruebas
const DEFAULT_ADMIN_HASH = hashPassword('admin123');

let localUsers: UserRecord[] = [
  {
    id: 'usr-superadmin-01',
    nombre: 'Víctor (Dueño)',
    email: 'admin',
    password_hash: DEFAULT_SUPERADMIN_HASH,
    rol_id: 1,
    role: 'SuperAdmin',
    activo: true,
    fecha_creacion: new Date('2026-01-01T00:00:00Z').toISOString(),
  },
  {
    id: 'usr-admin-02',
    nombre: 'Carlos (Administrador)',
    email: 'carlos',
    password_hash: DEFAULT_ADMIN_HASH,
    rol_id: 2,
    role: 'Administrador',
    activo: true,
    fecha_creacion: new Date('2026-01-02T00:00:00Z').toISOString(),
  },
];

export class UserRepository {
  /**
   * Asegura que los roles existan en PostgreSQL si Prisma está conectado
   */
  private static async ensureRolesInDb() {
    if (!isDatabaseReady()) return;
    try {
      const superAdminRole = await prisma.role.findFirst({ where: { id: BigInt(1) } });
      if (!superAdminRole) {
        await prisma.role.create({
          data: {
            id: BigInt(1),
            nombre: 'SuperAdmin',
            descripcion: 'Dueño de la tienda con control total del sistema y gestión de usuarios',
          },
        });
      }
      const adminRole = await prisma.role.findFirst({ where: { id: BigInt(2) } });
      if (!adminRole) {
        await prisma.role.create({
          data: {
            id: BigInt(2),
            nombre: 'Administrador',
            descripcion: 'Administrador con acceso a catálogo y productos',
          },
        });
      }

      // Asegurar que exista al menos el SuperAdmin en BD
      const existingSuper = await prisma.usuario.findFirst({
        where: { OR: [{ email: 'admin' }, { email: 'admin@dvictor.com' }] },
      });
      if (!existingSuper) {
        await prisma.usuario.create({
          data: {
            nombre: 'Víctor (Dueño)',
            email: 'admin',
            password_hash: DEFAULT_SUPERADMIN_HASH,
            rol_id: BigInt(1),
            activo: true,
          },
        });
      }

      // Nota: no se recrea automáticamente el usuario de prueba "carlos"
      // para permitir que pueda eliminarse desde el panel si ya no se necesita.
    } catch (err) {
      console.warn('ℹ️ [UserRepository] Sincronización automática de roles diferida:', err);
    }
  }

  /**
   * Busca un usuario por email o por alias "admin"
   */
  static async findByEmailOrUsername(identifier: string): Promise<UserRecord | null> {
    const clean = identifier.trim().toLowerCase();

    if (isDatabaseReady()) {
      await this.ensureRolesInDb();
      try {
        let user = await prisma.usuario.findFirst({
          where: {
            OR: [
              { email: { equals: clean, mode: 'insensitive' } },
              clean === 'admin' ? { email: { equals: 'admin@dvictor.com', mode: 'insensitive' } } : {},
            ],
          },
          include: { rol: true },
        });

        if (user) {
          const roleName = (user.rol?.nombre === 'SuperAdmin' || Number(user.rol_id) === 1)
            ? 'SuperAdmin'
            : 'Administrador';

          return {
            id: user.id,
            nombre: user.nombre || 'Administrador',
            email: user.email || clean,
            password_hash: user.password_hash || '',
            rol_id: Number(user.rol_id || 2),
            role: roleName,
            activo: user.activo ?? true,
            fecha_creacion: user.fecha_creacion ? user.fecha_creacion.toISOString() : new Date().toISOString(),
          };
        }
      } catch (err) {
        console.warn('ℹ️ [UserRepository] Fallback temporal a memoria:', err);
      }
    }

    // Búsqueda en memoria
    const found = localUsers.find(
      (u) =>
        u.email.toLowerCase() === clean ||
        (clean === 'admin' && u.email.toLowerCase() === 'admin@dvictor.com') ||
        (clean === 'admin' && u.role === 'SuperAdmin')
    );

    return found ? { ...found } : null;
  }

  /**
   * Busca usuario por ID
   */
  static async findById(id: string): Promise<UserRecord | null> {
    if (isDatabaseReady()) {
      try {
        const user = await prisma.usuario.findUnique({
          where: { id },
          include: { rol: true },
        });
        if (user) {
          const roleName = (user.rol?.nombre === 'SuperAdmin' || Number(user.rol_id) === 1)
            ? 'SuperAdmin'
            : 'Administrador';
          return {
            id: user.id,
            nombre: user.nombre || '',
            email: user.email || '',
            password_hash: user.password_hash || '',
            rol_id: Number(user.rol_id || 2),
            role: roleName,
            activo: user.activo ?? true,
            fecha_creacion: user.fecha_creacion ? user.fecha_creacion.toISOString() : new Date().toISOString(),
          };
        }
      } catch (err) {
        console.warn('ℹ️ [UserRepository] Error en findById BD:', err);
      }
    }

    const found = localUsers.find((u) => u.id === id);
    return found ? { ...found } : null;
  }

  /**
   * Obtiene todos los usuarios administradores (excluye hashes)
   */
  static async findAll(): Promise<Omit<UserRecord, 'password_hash'>[]> {
    if (isDatabaseReady()) {
      await this.ensureRolesInDb();
      try {
        const users = await prisma.usuario.findMany({
          include: { rol: true },
          orderBy: { fecha_creacion: 'asc' },
        });

        if (users.length > 0) {
          return users.map((u) => ({
            id: u.id,
            nombre: u.nombre || 'Administrador',
            email: u.email || '',
            rol_id: Number(u.rol_id || 2),
            role: (u.rol?.nombre === 'SuperAdmin' || Number(u.rol_id) === 1) ? 'SuperAdmin' : 'Administrador',
            activo: u.activo ?? true,
            fecha_creacion: u.fecha_creacion ? u.fecha_creacion.toISOString() : new Date().toISOString(),
          }));
        }
      } catch (err) {
        console.warn('ℹ️ [UserRepository] Fallback en findAll:', err);
      }
    }

    return localUsers.map(({ password_hash, ...rest }) => ({ ...rest }));
  }

  /**
   * Crea un nuevo usuario con rol "Administrador" (rol_id = 2)
   */
  static async createAdmin(data: {
    nombre: string;
    email: string;
    password: string;
  }): Promise<Omit<UserRecord, 'password_hash'>> {
    const cleanEmail = data.email.trim().toLowerCase();

    // Validar duplicado
    const existing = await this.findByEmailOrUsername(cleanEmail);
    if (existing) {
      throw new Error('Ya existe un usuario con este correo electrónico');
    }

    const hashed = hashPassword(data.password);

    if (isDatabaseReady()) {
      try {
        const created = await prisma.usuario.create({
          data: {
            nombre: data.nombre.trim(),
            email: cleanEmail,
            password_hash: hashed,
            rol_id: BigInt(2), // Administrador
            activo: true,
          },
          include: { rol: true },
        });

        return {
          id: created.id,
          nombre: created.nombre || '',
          email: created.email || '',
          rol_id: 2,
          role: 'Administrador',
          activo: created.activo ?? true,
          fecha_creacion: created.fecha_creacion ? created.fecha_creacion.toISOString() : new Date().toISOString(),
        };
      } catch (err: any) {
        console.error('❌ [UserRepository] Error al guardar en BD:', err.message);
        throw new Error(err.message || 'No fue posible crear el usuario en la base de datos');
      }
    }

    // Guardar en memoria
    const newUser: UserRecord = {
      id: `usr-admin-${Date.now()}`,
      nombre: data.nombre.trim(),
      email: cleanEmail,
      password_hash: hashed,
      rol_id: 2,
      role: 'Administrador',
      activo: true,
      fecha_creacion: new Date().toISOString(),
    };
    localUsers.push(newUser);

    const { password_hash, ...safe } = newUser;
    return safe;
  }

  /**
   * Actualiza un usuario (nombre, email, password opcional, estado activo)
   */
  static async updateUser(
    id: string,
    data: {
      nombre?: string;
      email?: string;
      password?: string;
      activo?: boolean;
    }
  ): Promise<Omit<UserRecord, 'password_hash'>> {
    const user = await this.findById(id);
    if (!user) {
      throw new Error('Usuario no encontrado');
    }

    // Nota: se permite actualizar usuarios SuperAdmin (no a sí mismos mediante esta vía si aplica),
    // respetando las reglas de negocio definidas en la UI/controladores.

    const updates: any = {};
    if (data.nombre) updates.nombre = data.nombre.trim();
    if (data.email) updates.email = data.email.trim().toLowerCase();
    if (data.password) updates.password_hash = hashPassword(data.password);
    if (typeof data.activo === 'boolean') updates.activo = data.activo;

    if (isDatabaseReady()) {
      try {
        const updated = await prisma.usuario.update({
          where: { id },
          data: updates,
          include: { rol: true },
        });

        return {
          id: updated.id,
          nombre: updated.nombre || '',
          email: updated.email || '',
          rol_id: Number(updated.rol_id || 2),
          role: (updated.rol?.nombre === 'SuperAdmin' || Number(updated.rol_id) === 1) ? 'SuperAdmin' : 'Administrador',
          activo: updated.activo ?? true,
          fecha_creacion: updated.fecha_creacion ? updated.fecha_creacion.toISOString() : new Date().toISOString(),
        };
      } catch (err: any) {
        console.error('❌ [UserRepository] Error al actualizar en BD:', err.message);
        throw new Error(err.message || 'No fue posible actualizar el usuario en la base de datos');
      }
    }

    // Actualizar en memoria
    const index = localUsers.findIndex((u) => u.id === id);
    if (index !== -1) {
      localUsers[index] = {
        ...localUsers[index],
        ...updates,
      };
      const { password_hash, ...safe } = localUsers[index];
      return safe;
    }

    throw new Error('Usuario no encontrado');
  }

  /**
   * Elimina un usuario administrador
   */
  static async deleteUser(id: string, requesterId: string): Promise<void> {
    if (id === requesterId) {
      throw new Error('No puedes eliminar tu propia cuenta');
    }

    const user = await this.findById(id);
    if (!user) {
      throw new Error('Usuario no encontrado');
    }

    if (isDatabaseReady()) {
      try {
        await prisma.usuario.delete({ where: { id } });
        return;
      } catch (err: any) {
        console.error('❌ [UserRepository] Error al eliminar en BD:', err.message);
        throw new Error(err.message || 'No fue posible eliminar el usuario en la base de datos');
      }
    }

    localUsers = localUsers.filter((u) => u.id !== id);
  }
}
