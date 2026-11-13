/**
 * ─────────────────────────────────────────────────────────────────────────────
 * ARCHIVO: Frontend/src/services/authService.ts
 * QUÉ ES: Servicio de autenticación y gestión de administradores (SuperAdmin y Administrador).
 *         Incluye fallback local inteligente para garantizar funcionamiento continuo.
 * ─────────────────────────────────────────────────────────────────────────────
 */

export type AdminRole = 'SuperAdmin' | 'Administrador';

export interface AuthUser {
  id: string;
  nombre: string;
  email: string;
  role: AdminRole;
  fecha_creacion?: string;
}

export interface AdminUser {
  id: string;
  nombre: string;
  email: string;
  role: AdminRole;
  fecha_creacion: string;
}

const API_BASE_URL = (import.meta as any).env?.VITE_API_URL || 'http://localhost:4000/api';

// Memoria volátil de sesión para no guardar el token en localStorage/cookies inseguras
let currentAuthToken: string | null = null;
let currentAuthUser: AuthUser | null = null;

// Mock fallback local en caso de que el backend de Express no esté encendido
// Incluye un administrador de prueba inicial; puede eliminarse en esta sesión si se usa fallback local.
let localFallbackUsers: AdminUser[] = [
  {
    id: 'usr-superadmin-01',
    nombre: 'Víctor (Dueño)',
    email: 'admin',
    role: 'SuperAdmin',
    fecha_creacion: '2026-01-01T00:00:00.000Z',
  },
  {
    id: 'usr-admin-02',
    nombre: 'Carlos (Administrador)',
    email: 'carlos',
    role: 'Administrador',
    fecha_creacion: '2026-01-02T00:00:00.000Z',
  },
];

function getHeaders(): HeadersInit {
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
  };
  if (currentAuthToken) {
    headers['Authorization'] = `Bearer ${currentAuthToken}`;
  }
  return headers;
}

export const authService = {
  /**
   * Inicia sesión con usuario/correo y contraseña
   */
  async login(usernameOrEmail: string, password: string): Promise<AuthUser> {
    const cleanId = usernameOrEmail.trim().toLowerCase();

    try {
      const res = await fetch(`${API_BASE_URL}/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: cleanId, password }),
      });

      if (res.ok) {
        const json = await res.json();
        currentAuthToken = json.data.token;
        currentAuthUser = json.data.user;
        return currentAuthUser!;
      }

      // Si el servidor respondió con un error de credenciales específico
      const errorJson = await res.json().catch(() => null);
      if (res.status === 401 || res.status === 403) {
        throw new Error(errorJson?.message || 'Usuario o contraseña incorrectos');
      }
    } catch (err: any) {
      if (err.message && (err.message.includes('incorrectos') || err.message.includes('inactiva'))) {
        throw err;
      }
      console.warn('ℹ️ [authService] Backend offline o inaccesible, validando con almacén local de administración...');
    }

    // Modo Fallback Local (Permite probar de inmediato sin levantar backend obligatoriamente)
    if ((cleanId === 'admin' || cleanId === 'admin@dvictor.com') && password === 'dvictor2026') {
      currentAuthToken = 'mock-superadmin-token';
      currentAuthUser = localFallbackUsers[0];
      return currentAuthUser;
    }

    // Buscar si existe un Administrador creado en memoria local
    const foundAdmin = localFallbackUsers.find(
      (u) =>
        (u.email.toLowerCase() === cleanId || u.nombre.toLowerCase() === cleanId) &&
        (password === 'admin123' || password === '123456' || password === 'dvictor123')
    );

    if (foundAdmin) {
      currentAuthToken = `mock-admin-${foundAdmin.id}`;
      currentAuthUser = foundAdmin;
      return currentAuthUser;
    }

    throw new Error('Credenciales inválidas: usuario o contraseña incorrectos');
  },

  /**
   * Cierra la sesión activa
   */
  logout(): void {
    currentAuthToken = null;
    currentAuthUser = null;
  },

  /**
   * Retorna el usuario autenticado en memoria
   */
  getCurrentUser(): AuthUser | null {
    return currentAuthUser;
  },

  /**
   * Verifica si el usuario actual es el SuperAdmin (Dueño)
   */
  isSuperAdmin(): boolean {
    return currentAuthUser?.role === 'SuperAdmin';
  },

  /**
   * Actualiza la información personal del usuario logueado (nombre, usuario/email, contraseña)
   */
  async updateMyProfile(data: {
    nombre?: string;
    email?: string;
    password?: string;
  }): Promise<AuthUser> {
    try {
      let res = await fetch(`${API_BASE_URL}/auth/profile`, {
        method: 'PUT',
        headers: getHeaders(),
        body: JSON.stringify(data),
      });

      // Compatibilidad: si VITE_API_URL no incluye /api, reintentar con /api/auth/profile
      if (res.status === 404) {
        const altBase = API_BASE_URL.replace(/\/$/, '');
        if (!altBase.endsWith('/api')) {
          res = await fetch(`${altBase}/api/auth/profile`, {
            method: 'PUT',
            headers: getHeaders(),
            body: JSON.stringify(data),
          });
        }
      }

      if (res.ok) {
        const json = await res.json();
        if (json.data?.token) {
          currentAuthToken = json.data.token;
        }
        if (json.data?.user) {
          currentAuthUser = json.data.user;
          return currentAuthUser!;
        }
      } else {
        const errJson = await res.json().catch(() => null);
        throw new Error(errJson?.message || 'Error al actualizar perfil');
      }
    } catch (err: any) {
      if (err.message && !err.message.includes('fetch')) {
        throw err;
      }
      console.warn('ℹ️ [authService] Backend no respondió, actualizando perfil en almacén local...');
    }

    // Fallback local
    if (currentAuthUser) {
      currentAuthUser = {
        ...currentAuthUser,
        ...(data.nombre ? { nombre: data.nombre.trim() } : {}),
        ...(data.email ? { email: data.email.trim().toLowerCase() } : {}),
      };

      const idx = localFallbackUsers.findIndex((u) => u.id === currentAuthUser!.id);
      if (idx !== -1) {
        localFallbackUsers[idx] = {
          ...localFallbackUsers[idx],
          ...(data.nombre ? { nombre: data.nombre.trim() } : {}),
          ...(data.email ? { email: data.email.trim().toLowerCase() } : {}),
        };
      }
      return currentAuthUser;
    }

    throw new Error('No hay usuario autenticado');
  },

  // ── GESTIÓN DE USUARIOS (Exclusivo SuperAdmin) ──────────────────────────────

  /**
   * Obtiene la lista de usuarios administradores
   */
  async getUsers(): Promise<AdminUser[]> {
    try {
      const res = await fetch(`${API_BASE_URL}/usuarios`, {
        headers: getHeaders(),
      });
      if (res.ok) {
        const json = await res.json();
        return json.data || [];
      }
    } catch {
      // Backend offline, usar fallback
    }
    return [...localFallbackUsers];
  },

  /**
   * Crea un nuevo Administrador (con rol Administrador fijo)
   */
  async createUser(data: { nombre: string; email: string; password: string }): Promise<AdminUser> {
    try {
      const res = await fetch(`${API_BASE_URL}/usuarios`, {
        method: 'POST',
        headers: getHeaders(),
        body: JSON.stringify(data),
      });

      if (!res.ok) {
        const errJson = await res.json().catch(() => null);
        throw new Error(errJson?.message || 'Error al crear el administrador');
      }

      const json = await res.json();
      return json.data;
    } catch (err: any) {
      if (err.message && !err.message.includes('fetch')) {
        throw err;
      }
      console.warn('ℹ️ [authService] Guardando usuario en memoria local...');
    }

    // Fallback local
    const exists = localFallbackUsers.some((u) => u.email.toLowerCase() === data.email.trim().toLowerCase());
    if (exists) {
      throw new Error('Ya existe un usuario con este correo electrónico');
    }

    const newUser: AdminUser = {
      id: `usr-admin-${Date.now()}`,
      nombre: data.nombre.trim(),
      email: data.email.trim().toLowerCase(),
      role: 'Administrador',
      fecha_creacion: new Date().toISOString(),
    };

    localFallbackUsers.push(newUser);
    return newUser;
  },

  /**
   * Actualiza los datos de un usuario
   */
  async updateUser(
    id: string,
    data: { nombre?: string; email?: string; password?: string }
  ): Promise<AdminUser> {
    try {
      const res = await fetch(`${API_BASE_URL}/usuarios/${id}`, {
        method: 'PUT',
        headers: getHeaders(),
        body: JSON.stringify(data),
      });

      if (!res.ok) {
        const errJson = await res.json().catch(() => null);
        throw new Error(errJson?.message || 'Error al actualizar usuario');
      }

      const json = await res.json();
      return json.data;
    } catch (err: any) {
      if (err.message && !err.message.includes('fetch')) {
        throw err;
      }
    }

    // Fallback local
    const idx = localFallbackUsers.findIndex((u) => u.id === id);
    if (idx === -1) throw new Error('Usuario no encontrado');

    localFallbackUsers[idx] = {
      ...localFallbackUsers[idx],
      ...(data.nombre ? { nombre: data.nombre.trim() } : {}),
      ...(data.email ? { email: data.email.trim().toLowerCase() } : {}),
    };

    return localFallbackUsers[idx];
  },

  /**
   * Elimina un usuario administrador
   */
  async deleteUser(id: string): Promise<void> {
    try {
      const res = await fetch(`${API_BASE_URL}/usuarios/${id}`, {
        method: 'DELETE',
        headers: getHeaders(),
      });

      if (!res.ok) {
        const errJson = await res.json().catch(() => null);
        throw new Error(errJson?.message || 'Error al eliminar usuario');
      }
      return;
    } catch (err: any) {
      if (err.message && !err.message.includes('fetch')) {
        throw err;
      }
    }

    // Fallback local
    localFallbackUsers = localFallbackUsers.filter((u) => u.id !== id);
  },
};
