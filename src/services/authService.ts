/**
 * ─────────────────────────────────────────────────────────────────────────────
 * ARCHIVO: src/services/authService.ts
 * QUÉ ES: Capa de autenticación de visitantes. Hoy usa localStorage con
 *         promesas para simular un backend; mañana se reemplaza el cuerpo de
 *         cada función por llamadas fetch/Supabase sin tocar los componentes.
 * DÓNDE SE VE: No se renderiza; lo consumen AuthContext y AccountView.
 * QUÉ TOCAR:
 *   - Credenciales demo → bloque "SEED DE USUARIOS DEMO".
 *   - Reglas de validación → `register` y `login`.
 *   - Migrar a backend real → cambiar las implementaciones por fetch.
 * ⚠️ ADVERTENCIA: auth de demostración. Las contraseñas se guardan en
 *    localStorage sin hash real: no es seguro para producción.
 * ─────────────────────────────────────────────────────────────────────────────
 */

import { Address, RegisterFormData, User } from '../types';

// ── Claves de localStorage ──────────────────────────────────────────────────
const USERS_KEY = 'dv_users';
const SESSION_KEY = 'dv_session';

// Usuario interno: el público `User` nunca expone la contraseña.
interface StoredUser extends User {
  password: string;
}

// ── Utilidades de almacenamiento ─────────────────────────────────────────────
const readUsers = (): StoredUser[] => {
  try {
    const saved = localStorage.getItem(USERS_KEY);
    return saved ? (JSON.parse(saved) as StoredUser[]) : [];
  } catch {
    return [];
  }
};

const writeUsers = (users: StoredUser[]) => {
  try {
    localStorage.setItem(USERS_KEY, JSON.stringify(users));
  } catch {
    // storage unavailable
  }
};

const toPublicUser = (stored: StoredUser): User => {
  const { password: _password, ...publicUser } = stored;
  return publicUser;
};

const generateId = () =>
  `usr-${Date.now().toString(36)}${Math.random().toString(36).slice(2, 8)}`;

// ── SEED DE USUARIOS DEMO ───────────────────────────────────────────────────
// Se siembra una sola vez si no existe ningún usuario. El admin es quien
// accede al panel administrativo; el cliente sirve para probar el checkout.
const seedUsers = () => {
  const users = readUsers();
  if (users.length > 0) return;
  writeUsers([
    {
      id: 'admin-dvictor',
      fullName: 'D’ Victor Administración',
      email: 'admin@dvictorfragancias.com',
      phone: '809-555-0100',
      password: 'dvictor2026',
      role: 'admin',
      addresses: [],
      createdAt: '2026-01-05T09:00:00.000Z',
    },
    {
      id: 'cliente-demo',
      fullName: 'Laura Peña Gómez',
      email: 'laura@ejemplo.com',
      phone: '829-555-3842',
      password: 'cliente2026',
      role: 'cliente',
      addresses: [
        {
          label: 'Casa',
          province: 'Distrito Nacional (Santo Domingo)',
          sector: 'Piantini',
          address: 'Calle Federico Geraldino, Torre Áurea, Apto 7B',
          isDefault: true,
        },
      ],
      createdAt: '2026-01-12T14:30:00.000Z',
    },
  ]);
};

// ── API pública (todas asíncronas para migrar a backend sin cambios) ────────

// Sesión actual: devuelve el usuario guardado o null si expiró/no existe.
export const getCurrentSession = async (): Promise<User | null> => {
  seedUsers();
  try {
    const userId = localStorage.getItem(SESSION_KEY);
    if (!userId) return null;
    const found = readUsers().find((u) => u.id === userId);
    return found ? toPublicUser(found) : null;
  } catch {
    return null;
  }
};

// Inicia sesión con email + contraseña. Persiste la sesión en localStorage.
export const login = async (email: string, password: string): Promise<User> => {
  seedUsers();
  const users = readUsers();
  const found = users.find(
    (u) => u.email.toLowerCase() === email.trim().toLowerCase()
  );
  if (!found || found.password !== password) {
    throw new Error('Correo o contraseña incorrectos.');
  }
  try {
    localStorage.setItem(SESSION_KEY, found.id);
  } catch {
    // storage unavailable
  }
  return toPublicUser(found);
};

// Registra un visitante nuevo. Falla si el correo ya existe.
export const register = async (data: RegisterFormData): Promise<User> => {
  seedUsers();
  const users = readUsers();
  const email = data.email.trim().toLowerCase();
  if (users.some((u) => u.email.toLowerCase() === email)) {
    throw new Error('Ya existe una cuenta con ese correo.');
  }
  if (data.password.length < 6) {
    throw new Error('La contraseña debe tener al menos 6 caracteres.');
  }
  const newUser: StoredUser = {
    id: generateId(),
    fullName: data.fullName.trim(),
    email,
    phone: data.phone.trim(),
    password: data.password,
    role: 'cliente',
    addresses: [],
    createdAt: new Date().toISOString(),
  };
  writeUsers([...users, newUser]);
  try {
    localStorage.setItem(SESSION_KEY, newUser.id);
  } catch {
    // storage unavailable
  }
  return toPublicUser(newUser);
};

// Cierra la sesión actual.
export const logout = async (): Promise<void> => {
  try {
    localStorage.removeItem(SESSION_KEY);
  } catch {
    // storage unavailable
  }
};

// Actualiza datos del perfil (nombre y teléfono).
export const updateProfile = async (
  userId: string,
  changes: { fullName?: string; phone?: string }
): Promise<User> => {
  const users = readUsers();
  const index = users.findIndex((u) => u.id === userId);
  if (index === -1) throw new Error('Usuario no encontrado.');
  const updated: StoredUser = {
    ...users[index],
    ...changes,
    fullName: (changes.fullName ?? users[index].fullName).trim(),
    phone: (changes.phone ?? users[index].phone).trim(),
  };
  users[index] = updated;
  writeUsers(users);
  return toPublicUser(updated);
};

// Agrega una dirección a la cuenta del usuario.
export const addAddress = async (userId: string, address: Address): Promise<User> => {
  const users = readUsers();
  const index = users.findIndex((u) => u.id === userId);
  if (index === -1) throw new Error('Usuario no encontrado.');
  const addresses = [...users[index].addresses, address].map((a) => ({
    ...a,
    // Solo puede haber una dirección principal.
    isDefault: address.isDefault ? true : a.isDefault && !address.isDefault,
  }));
  // Si es la primera dirección, se marca como principal.
  if (!addresses.some((a) => a.isDefault) && addresses.length > 0) {
    addresses[0].isDefault = true;
  }
  users[index] = { ...users[index], addresses };
  writeUsers(users);
  return toPublicUser(users[index]);
};

// Marca una dirección como principal.
export const setDefaultAddress = async (
  userId: string,
  addressLabel: string
): Promise<User> => {
  const users = readUsers();
  const index = users.findIndex((u) => u.id === userId);
  if (index === -1) throw new Error('Usuario no encontrado.');
  users[index] = {
    ...users[index],
    addresses: users[index].addresses.map((a) => ({
      ...a,
      isDefault: a.label === addressLabel,
    })),
  };
  writeUsers(users);
  return toPublicUser(users[index]);
};

// Elimina una dirección por su etiqueta.
export const removeAddress = async (
  userId: string,
  addressLabel: string
): Promise<User> => {
  const users = readUsers();
  const index = users.findIndex((u) => u.id === userId);
  if (index === -1) throw new Error('Usuario no encontrado.');
  let addresses = users[index].addresses.filter((a) => a.label !== addressLabel);
  if (addresses.length > 0 && !addresses.some((a) => a.isDefault)) {
    addresses[0].isDefault = true;
  }
  users[index] = { ...users[index], addresses };
  writeUsers(users);
  return toPublicUser(users[index]);
};
