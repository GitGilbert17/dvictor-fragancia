/**
 * ─────────────────────────────────────────────────────────────────────────────
 * ARCHIVO: Frontend/src/components/AdminProfileModal.tsx
 * QUÉ ES: Modal de ajustes personales (tuerca) para que cualquier usuario
 *         administrador (SuperAdmin o Administrador) pueda cambiar su nombre,
 *         su nombre de usuario (@) y su contraseña de acceso.
 * ─────────────────────────────────────────────────────────────────────────────
 */

import React, { useState } from 'react';
import {
  Settings,
  X,
  User,
  Lock,
  Eye,
  EyeOff,
  Crown,
  Shield,
  CheckCircle2,
  AlertCircle,
  Loader2,
} from 'lucide-react';
import { AuthUser, authService } from '../services/authService';

interface AdminProfileModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentUser: AuthUser;
  onProfileUpdated: (updatedUser: AuthUser) => void;
}

export const AdminProfileModal: React.FC<AdminProfileModalProps> = ({
  isOpen,
  onClose,
  currentUser,
  onProfileUpdated,
}) => {
  const [nombre, setNombre] = useState(currentUser.nombre);
  const [username, setUsername] = useState(currentUser.email);
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [successMessage, setSuccessMessage] = useState('');

  if (!isOpen) return null;

  const isSuper = currentUser.role === 'SuperAdmin';

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage('');
    setSuccessMessage('');

    if (!nombre.trim()) {
      setErrorMessage('El nombre no puede estar vacío');
      return;
    }

    if (!username.trim()) {
      setErrorMessage('El nombre de usuario no puede estar vacío');
      return;
    }

    if (password) {
      if (password.length < 6) {
        setErrorMessage('La nueva contraseña debe tener mínimo 6 caracteres');
        return;
      }
      if (password !== confirmPassword) {
        setErrorMessage('Las contraseñas no coinciden');
        return;
      }
    }

    try {
      setIsLoading(true);
      const updatedUser = await authService.updateMyProfile({
        nombre: nombre.trim(),
        email: username.trim(),
        password: password ? password : undefined,
      });

      setSuccessMessage('¡Información actualizada exitosamente!');
      onProfileUpdated(updatedUser);
      setPassword('');
      setConfirmPassword('');

      setTimeout(() => {
        onClose();
      }, 1200);
    } catch (err: any) {
      setErrorMessage(err.message || 'Error al actualizar información');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in">
      <div className="bg-[#0c0c0c] border border-[#262626] rounded-2xl w-full max-w-md p-6 sm:p-8 shadow-2xl relative">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-5 right-5 text-[#666] hover:text-[#FAF7F0] transition-colors cursor-pointer"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Modal Header */}
        <div className="flex items-center gap-3.5 mb-6">
          <div className="w-11 h-11 rounded-xl bg-[#D4AF37]/10 border border-[#D4AF37]/30 flex items-center justify-center text-[#D4AF37]">
            <Settings className="w-5 h-5 animate-[spin_6s_linear_infinite]" />
          </div>
          <div>
            <h3 className="font-serif text-lg sm:text-xl text-[#FAF7F0] tracking-wide">
              Configuración de mi Cuenta
            </h3>
            <p className="text-xs text-[#777]">Actualiza tus datos de acceso personales</p>
          </div>
        </div>

        {/* User Identity & Role Card */}
        <div className="p-3.5 bg-[#141414] border border-[#222] rounded-xl flex items-center justify-between mb-5">
          <div className="flex items-center gap-2.5">
            <div
              className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-xs ${
                isSuper
                  ? 'bg-[#D4AF37]/20 text-[#D4AF37] border border-[#D4AF37]/40'
                  : 'bg-blue-500/20 text-blue-300 border border-blue-500/40'
              }`}
            >
              {currentUser.nombre.charAt(0).toUpperCase()}
            </div>
            <div>
              <div className="text-xs font-medium text-[#FAF7F0]">{currentUser.nombre}</div>
              <div className="text-[10px] text-[#777] font-mono">@{currentUser.email}</div>
            </div>
          </div>

          <div>
            {isSuper ? (
              <span className="inline-flex items-center gap-1 text-[10px] font-semibold bg-[#D4AF37]/15 text-[#D4AF37] px-2.5 py-1 rounded-full border border-[#D4AF37]/30">
                <Crown className="w-3 h-3" />
                SuperAdmin
              </span>
            ) : (
              <span className="inline-flex items-center gap-1 text-[10px] font-semibold bg-blue-500/15 text-blue-400 px-2.5 py-1 rounded-full border border-blue-500/30">
                <Shield className="w-3 h-3" />
                Administrador
              </span>
            )}
          </div>
        </div>

        {/* Alerts */}
        {errorMessage && (
          <div className="mb-4 flex items-center gap-2 p-3 bg-red-950/30 border border-red-800/40 rounded-xl text-xs text-red-400 animate-in fade-in">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{errorMessage}</span>
          </div>
        )}

        {successMessage && (
          <div className="mb-4 flex items-center gap-2 p-3 bg-green-950/30 border border-green-800/40 rounded-xl text-xs text-green-400 animate-in fade-in">
            <CheckCircle2 className="w-4 h-4 shrink-0" />
            <span>{successMessage}</span>
          </div>
        )}

        {/* Edit Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Full Name */}
          <div>
            <label className="block text-[11px] font-medium uppercase tracking-wider text-[#888] mb-1.5">
              Tu Nombre Completo
            </label>
            <div className="relative">
              <User className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-[#555]" />
              <input
                type="text"
                value={nombre}
                onChange={(e) => setNombre(e.target.value)}
                placeholder="Ej. Víctor o Carlos Pérez"
                className="w-full bg-[#141414] border border-[#282828] focus:border-[#D4AF37]/60 rounded-xl pl-10 pr-4 py-2.5 text-xs text-[#FAF7F0] outline-none"
              />
            </div>
          </div>

          {/* Username */}
          <div>
            <label className="block text-[11px] font-medium uppercase tracking-wider text-[#888] mb-1.5">
              Nombre de Usuario (Para iniciar sesión)
            </label>
            <div className="relative">
              <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-xs font-mono text-[#777] font-bold">@</span>
              <input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="usuario"
                className="w-full bg-[#141414] border border-[#282828] focus:border-[#D4AF37]/60 rounded-xl pl-9 pr-4 py-2.5 text-xs text-[#FAF7F0] outline-none font-mono"
              />
            </div>
          </div>

          <div className="pt-2 border-t border-[#1e1e1e]">
            <span className="text-[10px] uppercase tracking-wider font-semibold text-[#D4AF37]/80 block mb-3">
              Cambiar Contraseña (Opcional)
            </span>

            {/* New Password */}
            <div className="space-y-3">
              <div>
                <label className="block text-[11px] font-medium uppercase tracking-wider text-[#777] mb-1.5">
                  Nueva Contraseña
                </label>
                <div className="relative">
                  <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-[#555]" />
                  <input
                    type={showPassword ? 'text' : 'password'}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Dejar en blanco para no cambiar"
                    className="w-full bg-[#141414] border border-[#282828] focus:border-[#D4AF37]/60 rounded-xl pl-10 pr-10 py-2.5 text-xs text-[#FAF7F0] placeholder:text-[#555] outline-none"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-[#555] hover:text-[#999] cursor-pointer"
                    tabIndex={-1}
                  >
                    {showPassword ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                  </button>
                </div>
              </div>

              {/* Confirm Password (only required if password is entered) */}
              {password.length > 0 && (
                <div className="animate-in fade-in slide-in-from-top-1">
                  <label className="block text-[11px] font-medium uppercase tracking-wider text-[#777] mb-1.5">
                    Confirmar Nueva Contraseña
                  </label>
                  <div className="relative">
                    <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-[#555]" />
                    <input
                      type={showPassword ? 'text' : 'password'}
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      placeholder="Repite la nueva contraseña"
                      className="w-full bg-[#141414] border border-[#282828] focus:border-[#D4AF37]/60 rounded-xl pl-10 pr-4 py-2.5 text-xs text-[#FAF7F0] placeholder:text-[#555] outline-none"
                    />
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex items-center justify-end gap-3 pt-3">
            <button
              type="button"
              onClick={onClose}
              disabled={isLoading}
              className="px-4 py-2.5 rounded-xl text-xs text-[#999] hover:text-[#FAF7F0] bg-[#141414] hover:bg-[#1a1a1a] border border-[#252525] transition-colors cursor-pointer"
            >
              Cancelar
            </button>

            <button
              type="submit"
              disabled={isLoading}
              className="inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl text-xs font-semibold text-[#050505] bg-gradient-to-r from-[#D4AF37] to-[#E8C547] hover:from-[#E8C547] hover:to-[#F5D657] disabled:opacity-50 transition-all cursor-pointer shadow-md shadow-[#D4AF37]/15"
            >
              {isLoading ? (
                <>
                  <Loader2 className="w-3.5 h-3.5 animate-spin" />
                  Guardando...
                </>
              ) : (
                'Guardar Cambios'
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
