/**
 * ─────────────────────────────────────────────────────────────────────────────
 * ARCHIVO: Frontend/src/components/AdminLogin.tsx
 * QUÉ ES: Pantalla de inicio de sesión para el Panel Administrativo.
 *         Diseño premium con el logo de la marca, inputs dorados y fondo
 *         oscuro consistente con la identidad visual de D' Victor.
 * DÓNDE SE VE: URL /admin — antes de entrar al panel de gestión.
 * ─────────────────────────────────────────────────────────────────────────────
 */

import React, { useState } from 'react';
import { Eye, EyeOff, Lock, User, AlertCircle, Loader2 } from 'lucide-react';
import { BrandLogo } from './BrandLogo';

interface AdminLoginProps {
  onLogin: (username: string, password: string) => Promise<boolean>;
}

export const AdminLogin: React.FC<AdminLoginProps> = ({ onLogin }) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!username.trim() || !password.trim()) {
      setError('Completa todos los campos');
      return;
    }

    setIsLoading(true);
    try {
      const success = await onLogin(username.trim(), password);
      if (!success) {
        setError('Credenciales incorrectas');
      }
    } catch {
      setError('Error al conectar con el servidor');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#050505] flex items-center justify-center p-4 relative overflow-hidden">
      {/* Subtle background glow */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-[#D4AF37]/[0.03] rounded-full blur-[120px]" />
        <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-[#D4AF37]/20 to-transparent" />
        <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-[#D4AF37]/10 to-transparent" />
      </div>

      {/* Login Card */}
      <div className="relative w-full max-w-md">
        {/* Logo Section */}
        <div className="flex flex-col items-center mb-10">
          <BrandLogo variant="primary" size="lg" showSubtitle={false} />
          <div className="mt-5 flex flex-col items-center gap-1.5">
            <div className="h-px w-16 bg-gradient-to-r from-transparent via-[#D4AF37]/60 to-transparent" />
            <span className="text-[10px] tracking-[0.4em] text-[#D4AF37]/70 uppercase font-sans font-medium">
              Panel Administrativo
            </span>
          </div>
        </div>

        {/* Form Card */}
        <div className="bg-[#0a0a0a] border border-[#1a1a1a] rounded-2xl p-8 shadow-2xl shadow-black/40">
          <div className="text-center mb-7">
            <h1 className="font-serif text-xl text-[#FAF7F0] tracking-wide">
              Iniciar Sesión
            </h1>
            <p className="text-xs text-[#888] mt-1.5 font-sans">
              Acceso exclusivo para administradores
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Username */}
            <div className="space-y-1.5">
              <label className="text-[11px] tracking-widest uppercase text-[#888] font-sans font-medium">
                Usuario
              </label>
              <div className="relative">
                <User className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-[#555]" />
                <input
                  type="text"
                  value={username}
                  onChange={(e) => { setUsername(e.target.value); setError(''); }}
                  placeholder="admin"
                  autoComplete="username"
                  autoFocus
                  className="w-full bg-[#111] border border-[#222] hover:border-[#333] focus:border-[#D4AF37]/50 focus:ring-1 focus:ring-[#D4AF37]/20 rounded-lg pl-11 pr-4 py-3 text-sm text-[#FAF7F0] placeholder:text-[#444] font-sans outline-none transition-all duration-200"
                />
              </div>
            </div>

            {/* Password */}
            <div className="space-y-1.5">
              <label className="text-[11px] tracking-widest uppercase text-[#888] font-sans font-medium">
                Contraseña
              </label>
              <div className="relative">
                <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-[#555]" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => { setPassword(e.target.value); setError(''); }}
                  placeholder="••••••••"
                  autoComplete="current-password"
                  className="w-full bg-[#111] border border-[#222] hover:border-[#333] focus:border-[#D4AF37]/50 focus:ring-1 focus:ring-[#D4AF37]/20 rounded-lg pl-11 pr-11 py-3 text-sm text-[#FAF7F0] placeholder:text-[#444] font-sans outline-none transition-all duration-200"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-[#555] hover:text-[#999] transition-colors cursor-pointer"
                  tabIndex={-1}
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            {/* Error Message */}
            {error && (
              <div className="flex items-center gap-2 text-[#ef4444] bg-[#ef4444]/10 border border-[#ef4444]/20 rounded-lg px-3.5 py-2.5 text-xs font-sans animate-[fadeIn_0.2s_ease-out]">
                <AlertCircle className="w-3.5 h-3.5 shrink-0" />
                <span>{error}</span>
              </div>
            )}

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isLoading}
              className="w-full relative bg-gradient-to-r from-[#D4AF37] via-[#E8C547] to-[#D4AF37] hover:from-[#E8C547] hover:via-[#F5D657] hover:to-[#E8C547] disabled:opacity-50 disabled:cursor-not-allowed text-[#050505] font-semibold text-sm tracking-wider uppercase py-3.5 rounded-lg transition-all duration-300 shadow-lg shadow-[#D4AF37]/10 hover:shadow-[#D4AF37]/25 cursor-pointer"
            >
              {isLoading ? (
                <span className="flex items-center justify-center gap-2">
                  <Loader2 className="w-4 h-4 animate-spin" />
                  Verificando...
                </span>
              ) : (
                'Acceder'
              )}
            </button>
          </form>
        </div>

        {/* Footer */}
        <div className="text-center mt-6 space-y-2.5">
          <div className="bg-[#0e0e0e] border border-[#1c1c1c] rounded-xl p-3 text-[11px] text-[#777] font-sans space-y-1">
            <div className="text-[#999] font-medium text-[10px] uppercase tracking-wider">Cuentas de Acceso:</div>
            <div>
              👑 <strong className="text-[#FAF7F0]">Dueño (SuperAdmin):</strong>{' '}
              <span className="text-[#D4AF37] font-mono">admin</span> /{' '}
              <span className="text-[#D4AF37] font-mono">dvictor2026</span>
            </div>
            <div>
              🛡️ <strong className="text-[#FAF7F0]">Administrador:</strong>{' '}
              <span className="text-blue-400 font-mono">carlos</span> /{' '}
              <span className="text-blue-400 font-mono">admin123</span>
            </div>
          </div>
          <div>
            <a
              href="/"
              className="text-[11px] text-[#555] hover:text-[#D4AF37] font-sans tracking-wider uppercase transition-colors duration-200"
            >
              ← Volver a la Tienda
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};
