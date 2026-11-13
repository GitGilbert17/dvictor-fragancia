/**
 * ─────────────────────────────────────────────────────────────────────────────
 * ARCHIVO: Frontend/src/components/AdminUsers.tsx
 * QUÉ ES: Panel de gestión de usuarios administradores.
 *         EXCLUSIVO para el rol SuperAdmin (Dueño).
 * DÓNDE SE VE: Pestaña "Administradores" dentro de /admin cuando el usuario logueado es SuperAdmin.
 * ─────────────────────────────────────────────────────────────────────────────
 */

import React, { useState, useEffect } from 'react';
import {
  Users,
  UserPlus,
  Crown,
  Shield,
  Edit2,
  Trash2,
  CheckCircle2,
  AlertCircle,
  X,
  Mail,
  Lock,
  User,
  Search,
  RefreshCw,
} from 'lucide-react';
import { AdminUser, AuthUser, authService } from '../services/authService';

interface AdminUsersProps {
  currentUser: AuthUser;
}

export const AdminUsers: React.FC<AdminUsersProps> = ({ currentUser }) => {
  const [users, setUsers] = useState<AdminUser[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [search, setSearch] = useState('');

  // Modales
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [editingUser, setEditingUser] = useState<AdminUser | null>(null);
  const [deletingUser, setDeletingUser] = useState<AdminUser | null>(null);
  const [toastMessage, setToastMessage] = useState<{ text: string; type: 'success' | 'error' } | null>(null);

  // Form State para Crear
  const [newName, setNewName] = useState('');
  const [newEmail, setNewEmail] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formError, setFormError] = useState('');

  // Form State para Editar
  const [editName, setEditName] = useState('');
  const [editEmail, setEditEmail] = useState('');
  const [editPassword, setEditPassword] = useState('');

  const showToast = (text: string, type: 'success' | 'error' = 'success') => {
    setToastMessage({ text, type });
    setTimeout(() => setToastMessage(null), 3500);
  };

  const loadUsers = async () => {
    try {
      setIsLoading(true);
      const data = await authService.getUsers();
      setUsers(data);
    } catch (err: any) {
      showToast('Error al cargar la lista de administradores', 'error');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadUsers();
  }, []);

  const handleCreateUser = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormError('');

    if (!newName.trim() || !newEmail.trim() || !newPassword.trim()) {
      setFormError('Por favor completa todos los campos requeridos');
      return;
    }

    if (newPassword.length < 6) {
      setFormError('La contraseña debe tener mínimo 6 caracteres');
      return;
    }

    try {
      setIsSubmitting(true);
      await authService.createUser({
        nombre: newName.trim(),
        email: newEmail.trim(),
        password: newPassword,
      });

      showToast(`Administrador "${newName}" creado exitosamente`);
      setIsCreateOpen(false);
      setNewName('');
      setNewEmail('');
      setNewPassword('');
      loadUsers();
    } catch (err: any) {
      setFormError(err.message || 'Error al crear el usuario');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleOpenEdit = (user: AdminUser) => {
    setEditingUser(user);
    setEditName(user.nombre);
    setEditEmail(user.email);
    setEditPassword('');
    setFormError('');
  };

  const handleUpdateUser = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingUser) return;
    setFormError('');

    try {
      setIsSubmitting(true);
      await authService.updateUser(editingUser.id, {
        nombre: editName.trim(),
        email: editEmail.trim(),
        password: editPassword.trim() ? editPassword : undefined,
      });

      showToast(`Usuario "${editName}" actualizado con éxito`);
      setEditingUser(null);
      loadUsers();
    } catch (err: any) {
      setFormError(err.message || 'Error al actualizar usuario');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDeleteUser = async () => {
    if (!deletingUser) return;
    try {
      setIsSubmitting(true);
      await authService.deleteUser(deletingUser.id);
      showToast(`Usuario "${deletingUser.nombre}" eliminado`);
      setDeletingUser(null);
      loadUsers();
    } catch (err: any) {
      showToast(err.message || 'Error al eliminar usuario', 'error');
    } finally {
      setIsSubmitting(false);
    }
  };

  const filteredUsers = users.filter((u) => {
    const q = search.toLowerCase();
    return u.nombre.toLowerCase().includes(q) || u.email.toLowerCase().includes(q) || u.role.toLowerCase().includes(q);
  });

  // (conteo total mostrado en tarjeta de métricas)

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6">
      {/* Toast Alert */}
      {toastMessage && (
        <div
          className={`fixed bottom-6 right-6 z-50 flex items-center gap-3 px-4 py-3 rounded-xl shadow-2xl border backdrop-blur-md transition-all duration-300 animate-in fade-in slide-in-from-bottom-5 ${
            toastMessage.type === 'success'
              ? 'bg-[#152515]/90 border-[#22c55e]/40 text-[#4ade80]'
              : 'bg-[#251515]/90 border-[#ef4444]/40 text-[#f87171]'
          }`}
        >
          {toastMessage.type === 'success' ? (
            <CheckCircle2 className="w-5 h-5 shrink-0" />
          ) : (
            <AlertCircle className="w-5 h-5 shrink-0" />
          )}
          <span className="text-sm font-medium">{toastMessage.text}</span>
        </div>
      )}

      {/* Hero / Header Section */}
      <div className="bg-[#0c0c0c] border border-[#1e1e1e] rounded-2xl p-6 sm:p-8 relative overflow-hidden">
        {/* Glow accent */}
        <div className="absolute top-0 right-0 w-80 h-80 bg-[#D4AF37]/5 rounded-full blur-3xl pointer-events-none" />

        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 relative z-10">
          <div>
            <div className="flex items-center gap-2.5 mb-2">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-semibold uppercase tracking-wider bg-[#D4AF37]/15 text-[#D4AF37] border border-[#D4AF37]/30">
                <Crown className="w-3.5 h-3.5" />
                Control de Acceso — Dueño
              </span>
            </div>
            <h1 className="font-serif text-2xl sm:text-3xl text-[#FAF7F0] tracking-wide">
              Gestión de Administradores
            </h1>
            <p className="text-sm text-[#888] mt-1 max-w-2xl font-sans">
              Gestión de usuarios del panel de administración.
            </p>
          </div>

          <button
            onClick={() => {
              setIsCreateOpen(true);
              setFormError('');
            }}
            className="inline-flex items-center justify-center gap-2 px-5 py-3 rounded-xl font-medium text-sm text-[#050505] bg-gradient-to-r from-[#D4AF37] via-[#E8C547] to-[#D4AF37] hover:from-[#E8C547] hover:to-[#F5D657] shadow-lg shadow-[#D4AF37]/15 hover:shadow-[#D4AF37]/25 transition-all duration-300 cursor-pointer shrink-0"
          >
            <UserPlus className="w-4 h-4" />
            <span>Nuevo Administrador</span>
          </button>
        </div>

        {/* Quick Metric Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mt-6 pt-6 border-t border-[#1a1a1a]">
          <div className="bg-[#121212] border border-[#222] rounded-xl p-4 flex items-center gap-3.5">
            <div className="w-10 h-10 rounded-lg bg-[#D4AF37]/10 border border-[#D4AF37]/25 flex items-center justify-center text-[#D4AF37]">
              <Users className="w-5 h-5" />
            </div>
            <div>
              <div className="text-xs uppercase tracking-wider text-[#777]">Usuarios</div>
              <div className="text-2xl font-sans font-semibold tracking-tight text-[#FAF7F0] tabular-nums">
                {users.length}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Search and Filter Bar */}
      <div className="flex flex-col sm:flex-row gap-4 items-center justify-between">
        <div className="relative w-full sm:w-80">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-[#555]" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Buscar por nombre o usuario..."
            className="w-full bg-[#0d0d0d] border border-[#222] hover:border-[#333] focus:border-[#D4AF37]/50 rounded-xl pl-10 pr-4 py-2.5 text-xs text-[#FAF7F0] placeholder:text-[#555] outline-none transition-colors"
          />
        </div>

        <button
          onClick={loadUsers}
          className="inline-flex items-center gap-1.5 px-3.5 py-2 text-xs text-[#888] hover:text-[#FAF7F0] bg-[#111] hover:bg-[#181818] border border-[#222] rounded-xl transition-colors cursor-pointer self-end sm:self-auto"
        >
          <RefreshCw className={`w-3.5 h-3.5 ${isLoading ? 'animate-spin text-[#D4AF37]' : ''}`} />
          <span>Actualizar lista</span>
        </button>
      </div>

      {/* Users Table */}
      <div className="bg-[#0b0b0b] border border-[#1a1a1a] rounded-2xl overflow-hidden shadow-xl">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-[#121212] border-b border-[#1f1f1f] text-[#888] uppercase tracking-wider text-[10px]">
              <tr>
                <th className="px-6 py-4">Nombre / Usuario</th>
                <th className="px-6 py-4">Rol en la Plataforma</th>
                <th className="px-6 py-4">Alcance de Permisos</th>
                <th className="px-6 py-4 text-right">Acciones</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#171717]">
              {isLoading ? (
                <tr>
                  <td colSpan={4} className="px-6 py-12 text-center text-[#777]">
                    <div className="flex flex-col items-center gap-3">
                      <RefreshCw className="w-6 h-6 animate-spin text-[#D4AF37]" />
                      <span>Cargando administradores...</span>
                    </div>
                  </td>
                </tr>
              ) : filteredUsers.length === 0 ? (
                <tr>
                  <td colSpan={4} className="px-6 py-12 text-center text-[#777]">
                    No se encontraron usuarios administradores con ese criterio.
                  </td>
                </tr>
              ) : (
                filteredUsers.map((u) => {
                  const isSuper = u.role === 'SuperAdmin';
                  const isSelf = u.id === currentUser.id || u.email.toLowerCase() === currentUser.email.toLowerCase();

                  return (
                    <tr
                      key={u.id}
                      className="hover:bg-[#111]/70 transition-colors"
                    >
                      {/* Name & Username */}
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <div
                            className={`w-9 h-9 rounded-full flex items-center justify-center font-serif text-sm font-bold border ${
                              isSuper
                                ? 'bg-[#D4AF37]/15 border-[#D4AF37]/40 text-[#D4AF37]'
                                : 'bg-blue-500/15 border-blue-500/30 text-blue-300'
                            }`}
                          >
                            {u.nombre.charAt(0).toUpperCase()}
                          </div>
                          <div>
                            <div className="text-sm font-medium text-[#FAF7F0] flex items-center gap-2">
                              {u.nombre}
                              {isSelf && (
                                <span className="text-[10px] bg-[#222] text-[#888] px-1.5 py-0.5 rounded border border-[#333]">
                                  Tú
                                </span>
                              )}
                            </div>
                            <div className="text-xs text-[#777] flex items-center gap-1 mt-0.5 font-mono">
                              <span className="text-[#D4AF37]/80 font-bold">@</span>
                              <span>{u.email}</span>
                            </div>
                          </div>
                        </div>
                      </td>

                      {/* Role Badge */}
                      <td className="px-6 py-4">
                        {isSuper ? (
                          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-semibold bg-[#D4AF37]/15 text-[#D4AF37] border border-[#D4AF37]/30">
                            <Crown className="w-3.5 h-3.5" />
                            SuperAdmin
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-semibold bg-blue-500/15 text-blue-400 border border-blue-500/30">
                            <Shield className="w-3.5 h-3.5" />
                            Administrador
                          </span>
                        )}
                      </td>

                      {/* Permissions Description */}
                      <td className="px-6 py-4">
                        <div className="text-xs text-[#999]">
                          {isSuper ? (
                            <span className="text-[#D4AF37]/90 font-medium">
                              Control Total (Catálogo + Gestión de Usuarios)
                            </span>
                          ) : (
                            <span className="text-[#bbb]">
                              CRUD Productos, Stock, Precios y Catálogo
                            </span>
                          )}
                        </div>
                      </td>

                      {/* Actions */}
                      <td className="px-6 py-4 text-right">
                        <div className="inline-flex items-center gap-1.5">
                          {/* Edit */}
                          <button
                            onClick={() => handleOpenEdit(u)}
                            disabled={isSelf}
                            title={isSelf ? 'Usa la configuración de tu cuenta (tuerca) para editarte' : 'Editar datos de administrador'}
                            className={`p-2 border rounded-lg transition-colors ${
                              isSelf
                                ? 'bg-[#121212] text-[#555] border-[#222] cursor-not-allowed opacity-60'
                                : 'bg-[#151515] hover:bg-[#202020] text-[#999] hover:text-[#FAF7F0] border-[#252525] cursor-pointer'
                            }`}
                          >
                            <Edit2 className="w-3.5 h-3.5" />
                          </button>

                          {/* Delete */}
                          <button
                            onClick={() => setDeletingUser(u)}
                            disabled={isSelf}
                            title={isSelf ? 'No puedes eliminar tu propia cuenta' : 'Eliminar administrador'}
                            className={`p-2 border rounded-lg transition-colors ${
                              isSelf
                                ? 'bg-[#121212] text-[#555] border-[#222] cursor-not-allowed opacity-60'
                                : 'bg-[#151515] hover:bg-red-950/30 text-[#999] hover:text-red-400 border border-[#252525] hover:border-red-900/40 cursor-pointer'
                            }`}
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* MODAL: Crear Administrador */}
      {isCreateOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in">
          <div className="bg-[#0e0e0e] border border-[#242424] rounded-2xl w-full max-w-md p-6 sm:p-8 shadow-2xl relative">
            <button
              onClick={() => setIsCreateOpen(false)}
              className="absolute top-5 right-5 text-[#666] hover:text-[#FAF7F0] transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="flex items-center gap-3 mb-5">
              <div className="w-10 h-10 rounded-xl bg-blue-500/10 border border-blue-500/30 flex items-center justify-center text-blue-400">
                <UserPlus className="w-5 h-5" />
              </div>
              <div>
                <h3 className="font-serif text-lg text-[#FAF7F0]">Crear Nuevo Administrador</h3>
                <p className="text-xs text-[#777]">Acceso delegado para gestión del catálogo</p>
              </div>
            </div>

            {formError && (
              <div className="mb-4 flex items-center gap-2 p-3 bg-red-950/30 border border-red-800/40 rounded-xl text-xs text-red-400">
                <AlertCircle className="w-4 h-4 shrink-0" />
                <span>{formError}</span>
              </div>
            )}

            <form onSubmit={handleCreateUser} className="space-y-4">
              <div>
                <label className="block text-[11px] font-medium uppercase tracking-wider text-[#888] mb-1.5">
                  Nombre Completo
                </label>
                <div className="relative">
                  <User className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-[#555]" />
                  <input
                    type="text"
                    value={newName}
                    onChange={(e) => setNewName(e.target.value)}
                    placeholder="Ej. Juan Pérez"
                    className="w-full bg-[#141414] border border-[#282828] focus:border-[#D4AF37]/60 rounded-xl pl-10 pr-4 py-2.5 text-xs text-[#FAF7F0] placeholder:text-[#555] outline-none"
                    autoFocus
                  />
                </div>
              </div>

              <div>
                <label className="block text-[11px] font-medium uppercase tracking-wider text-[#888] mb-1.5">
                  Nombre de Usuario (Para iniciar sesión)
                </label>
                <div className="relative">
                  <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-xs font-mono text-[#777] font-bold">@</span>
                  <input
                    type="text"
                    value={newEmail}
                    onChange={(e) => setNewEmail(e.target.value)}
                    placeholder="Ej. carlos o pedro2026"
                    className="w-full bg-[#141414] border border-[#282828] focus:border-[#D4AF37]/60 rounded-xl pl-9 pr-4 py-2.5 text-xs text-[#FAF7F0] placeholder:text-[#555] outline-none font-mono"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[11px] font-medium uppercase tracking-wider text-[#888] mb-1.5">
                  Contraseña Temporal
                </label>
                <div className="relative">
                  <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-[#555]" />
                  <input
                    type="password"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    placeholder="Mínimo 6 caracteres"
                    className="w-full bg-[#141414] border border-[#282828] focus:border-[#D4AF37]/60 rounded-xl pl-10 pr-4 py-2.5 text-xs text-[#FAF7F0] placeholder:text-[#555] outline-none"
                  />
                </div>
              </div>

              <div className="p-3 bg-[#131313] border border-[#222] rounded-xl text-[11px] text-[#888] flex items-start gap-2.5">
                <Shield className="w-4 h-4 text-blue-400 shrink-0 mt-0.5" />
                <span>
                  Este usuario recibirá el rol <strong>Administrador</strong>. Podrá añadir y editar perfumes, pero no podrá ver esta sección de usuarios.
                </span>
              </div>

              <div className="flex items-center justify-end gap-3 pt-3">
                <button
                  type="button"
                  onClick={() => setIsCreateOpen(false)}
                  className="px-4 py-2.5 rounded-xl text-xs text-[#999] hover:text-[#FAF7F0] bg-[#141414] hover:bg-[#1a1a1a] border border-[#252525] transition-colors cursor-pointer"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="px-5 py-2.5 rounded-xl text-xs font-semibold text-[#050505] bg-gradient-to-r from-[#D4AF37] to-[#E8C547] hover:from-[#E8C547] hover:to-[#F5D657] disabled:opacity-50 transition-all cursor-pointer shadow-md shadow-[#D4AF37]/15"
                >
                  {isSubmitting ? 'Creando...' : 'Crear Administrador'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL: Editar Administrador */}
      {editingUser && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in">
          <div className="bg-[#0e0e0e] border border-[#242424] rounded-2xl w-full max-w-md p-6 sm:p-8 shadow-2xl relative">
            <button
              onClick={() => setEditingUser(null)}
              className="absolute top-5 right-5 text-[#666] hover:text-[#FAF7F0] transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="flex items-center gap-3 mb-5">
              <div className="w-10 h-10 rounded-xl bg-[#D4AF37]/10 border border-[#D4AF37]/30 flex items-center justify-center text-[#D4AF37]">
                <Edit2 className="w-5 h-5" />
              </div>
              <div>
                <h3 className="font-serif text-lg text-[#FAF7F0]">Editar Administrador</h3>
                <p className="text-xs text-[#777]">{editingUser.email}</p>
              </div>
            </div>

            {formError && (
              <div className="mb-4 flex items-center gap-2 p-3 bg-red-950/30 border border-red-800/40 rounded-xl text-xs text-red-400">
                <AlertCircle className="w-4 h-4 shrink-0" />
                <span>{formError}</span>
              </div>
            )}

            <form onSubmit={handleUpdateUser} className="space-y-4">
              <div>
                <label className="block text-[11px] font-medium uppercase tracking-wider text-[#888] mb-1.5">
                  Nombre Completo
                </label>
                <input
                  type="text"
                  value={editName}
                  onChange={(e) => setEditName(e.target.value)}
                  className="w-full bg-[#141414] border border-[#282828] focus:border-[#D4AF37]/60 rounded-xl px-4 py-2.5 text-xs text-[#FAF7F0] outline-none"
                />
              </div>

              <div>
                <label className="block text-[11px] font-medium uppercase tracking-wider text-[#888] mb-1.5">
                  Nombre de Usuario
                </label>
                <div className="relative">
                  <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-xs font-mono text-[#777] font-bold">@</span>
                  <input
                    type="text"
                    value={editEmail}
                    onChange={(e) => setEditEmail(e.target.value)}
                    className="w-full bg-[#141414] border border-[#282828] focus:border-[#D4AF37]/60 rounded-xl pl-9 pr-4 py-2.5 text-xs text-[#FAF7F0] outline-none font-mono"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[11px] font-medium uppercase tracking-wider text-[#888] mb-1.5">
                  Nueva Contraseña (Dejar vacío para conservar la actual)
                </label>
                <input
                  type="password"
                  value={editPassword}
                  onChange={(e) => setEditPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full bg-[#141414] border border-[#282828] focus:border-[#D4AF37]/60 rounded-xl px-4 py-2.5 text-xs text-[#FAF7F0] placeholder:text-[#555] outline-none"
                />
              </div>

              <div className="p-3.5 bg-[#141414] border border-[#252525] rounded-xl text-[11px] text-[#777]">
                Los cambios de nombre, usuario o contraseña se aplicarán la próxima vez que inicie sesión.
              </div>

              <div className="flex items-center justify-end gap-3 pt-3">
                <button
                  type="button"
                  onClick={() => setEditingUser(null)}
                  className="px-4 py-2.5 rounded-xl text-xs text-[#999] hover:text-[#FAF7F0] bg-[#141414] hover:bg-[#1a1a1a] border border-[#252525] transition-colors cursor-pointer"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="px-5 py-2.5 rounded-xl text-xs font-semibold text-[#050505] bg-gradient-to-r from-[#D4AF37] to-[#E8C547] hover:from-[#E8C547] hover:to-[#F5D657] disabled:opacity-50 transition-all cursor-pointer shadow-md shadow-[#D4AF37]/15"
                >
                  {isSubmitting ? 'Guardando...' : 'Guardar Cambios'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL: Confirmar Eliminación */}
      {deletingUser && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in">
          <div className="bg-[#0e0e0e] border border-red-900/30 rounded-2xl w-full max-w-sm p-6 text-center shadow-2xl">
            <div className="w-12 h-12 rounded-full bg-red-500/10 border border-red-500/30 flex items-center justify-center text-red-400 mx-auto mb-4">
              <Trash2 className="w-6 h-6" />
            </div>
            <h3 className="font-serif text-lg text-[#FAF7F0] mb-1">¿Eliminar Administrador?</h3>
            <p className="text-xs text-[#888] mb-6">
              Esta acción revocará de inmediato el acceso de <strong>{deletingUser.nombre}</strong> ({deletingUser.email}).
            </p>

            <div className="flex items-center justify-center gap-3">
              <button
                type="button"
                onClick={() => setDeletingUser(null)}
                className="px-4 py-2.5 rounded-xl text-xs text-[#999] hover:text-[#FAF7F0] bg-[#141414] border border-[#252525] cursor-pointer"
              >
                Cancelar
              </button>
              <button
                type="button"
                onClick={handleDeleteUser}
                disabled={isSubmitting}
                className="px-5 py-2.5 rounded-xl text-xs font-semibold text-white bg-red-600 hover:bg-red-700 transition-colors cursor-pointer"
              >
                {isSubmitting ? 'Eliminando...' : 'Sí, Eliminar'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
