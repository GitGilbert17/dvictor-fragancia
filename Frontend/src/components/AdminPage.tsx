import React, { useState } from 'react';
import {
  ArrowLeft,
  Package,
  Users,
  Crown,
  Shield,
  LogOut,
  Settings,
} from 'lucide-react';
import { BrandLogo } from './BrandLogo';
import { AdminProducts } from './AdminProducts';
import { AdminUsers } from './AdminUsers';
import { AdminProfileModal } from './AdminProfileModal';
import { AuthUser } from '../services/authService';

interface AdminPageProps {
  currentUser: AuthUser;
  onLogout: () => void;
  onUserUpdated?: (user: AuthUser) => void;
  onProductsChanged?: () => void;
  onGoToStore: () => void;
}

export const AdminPage: React.FC<AdminPageProps> = ({
  currentUser,
  onLogout,
  onUserUpdated,
  onProductsChanged,
  onGoToStore,
}) => {
  const isSuper = currentUser.role === 'SuperAdmin';
  const [activeTab, setActiveTab] = useState<'productos' | 'usuarios'>('productos');
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);

  return (
    <div className="min-h-screen bg-[#070707] text-[#FAF7F0] font-sans selection:bg-[#D4AF37] selection:text-[#050505]">
      {/* Top Private Navigation Bar */}
      <header className="bg-[#0a0a0a] border-b border-[#1f1f1f] px-4 sm:px-8 py-3 flex items-center justify-between sticky top-0 z-50 backdrop-blur-md">
        {/* Left: Brand Identity */}
        <div className="flex items-center gap-3.5">
          <BrandLogo variant="monogram" size="sm" />
          <div>
            <div className="flex items-center gap-2">
              <span className="text-[10px] text-[#D4AF37] font-mono uppercase tracking-widest font-semibold">
                Panel Administrativo
              </span>
              {isSuper ? (
                <span className="inline-flex items-center gap-1 text-[10px] font-semibold bg-[#D4AF37]/15 text-[#D4AF37] px-2 py-0.5 rounded-full border border-[#D4AF37]/30">
                  <Crown className="w-3 h-3" />
                  Dueño
                </span>
              ) : (
                <span className="inline-flex items-center gap-1 text-[10px] font-semibold bg-blue-500/15 text-blue-400 px-2 py-0.5 rounded-full border border-blue-500/30">
                  <Shield className="w-3 h-3" />
                  Admin
                </span>
              )}
            </div>
            <div className="text-xs text-[#FAF7F0] font-serif">
              D’ Victor Fragancias Management
            </div>
          </div>
        </div>

        {/* Right: User Chip & Action Buttons */}
        <div className="flex items-center gap-2 sm:gap-2.5">
          {/* User identifier badge */}
          <div className="hidden md:flex items-center gap-2 px-3 py-1.5 bg-[#141414] border border-[#262626] rounded-xl text-xs">
            <div
              className={`w-6 h-6 rounded-full flex items-center justify-center font-bold text-[11px] ${
                isSuper
                  ? 'bg-[#D4AF37]/20 text-[#D4AF37] border border-[#D4AF37]/40'
                  : 'bg-blue-500/20 text-blue-300 border border-blue-500/40'
              }`}
            >
              {currentUser.nombre.charAt(0).toUpperCase()}
            </div>
            <div className="text-left">
              <div className="text-[11px] font-medium text-[#FAF7F0] leading-none">
                {currentUser.nombre}
              </div>
              <div className="text-[9px] text-[#777] font-mono mt-0.5">
                @{currentUser.email}
              </div>
            </div>
          </div>

          {/* Settings Gear Button (Tuerca para editar mi perfil) */}
          <button
            onClick={() => setIsSettingsOpen(true)}
            title="Mi Perfil y Contraseña (Editar mis datos)"
            className="flex items-center justify-center p-2 bg-[#141414] hover:bg-[#202020] text-[#999] hover:text-[#D4AF37] border border-[#262626] hover:border-[#D4AF37]/50 rounded-xl text-xs font-medium transition-all duration-200 cursor-pointer group"
          >
            <Settings className="w-4 h-4 group-hover:rotate-45 transition-transform duration-300" />
          </button>

          {/* Go to store button */}
          <button
            onClick={onGoToStore}
            title="Ver catálogo público de la tienda"
            className="flex items-center gap-1.5 px-3 py-2 bg-[#141414] hover:bg-[#1f1f1f] text-[#bbb] hover:text-[#D4AF37] border border-[#2a2a2a] rounded-xl text-xs font-medium transition-colors cursor-pointer"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Tienda Pública</span>
          </button>

          {/* Logout button */}
          <button
            onClick={onLogout}
            title="Cerrar Sesión"
            className="flex items-center gap-1.5 px-3 py-2 bg-red-950/20 hover:bg-red-950/50 text-red-400 hover:text-red-300 border border-red-900/40 rounded-xl text-xs font-medium transition-colors cursor-pointer"
          >
            <LogOut className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Cerrar Sesión</span>
          </button>
        </div>
      </header>

      {/* Role Navigation Tabs (Only visible if user has SuperAdmin role) */}
      {isSuper && (
        <div className="bg-[#0e0e0e] border-b border-[#1c1c1c] px-4 sm:px-8">
          <div className="max-w-7xl mx-auto flex items-center gap-2 pt-2">
            <button
              onClick={() => setActiveTab('productos')}
              className={`flex items-center gap-2 px-4 py-2.5 text-xs font-medium border-b-2 transition-all cursor-pointer ${
                activeTab === 'productos'
                  ? 'border-[#D4AF37] text-[#D4AF37] bg-[#D4AF37]/5 rounded-t-lg'
                  : 'border-transparent text-[#777] hover:text-[#FAF7F0] hover:bg-[#141414] rounded-t-lg'
              }`}
            >
              <Package className="w-4 h-4" />
              <span>Catálogo de Perfumes</span>
            </button>

            <button
              onClick={() => setActiveTab('usuarios')}
              className={`flex items-center gap-2 px-4 py-2.5 text-xs font-medium border-b-2 transition-all cursor-pointer ${
                activeTab === 'usuarios'
                  ? 'border-[#D4AF37] text-[#D4AF37] bg-[#D4AF37]/5 rounded-t-lg'
                  : 'border-transparent text-[#777] hover:text-[#FAF7F0] hover:bg-[#141414] rounded-t-lg'
              }`}
            >
              <Users className="w-4 h-4" />
              <span>Gestión de Administradores</span>
              <span className="text-[10px] font-mono bg-[#D4AF37]/20 text-[#D4AF37] px-1.5 py-0.2 rounded-full border border-[#D4AF37]/40">
                Dueño
              </span>
            </button>
          </div>
        </div>
      )}

      {/* Main Admin Content */}
      <main className="py-4">
        {activeTab === 'productos' || !isSuper ? (
          <AdminProducts onProductsChanged={onProductsChanged} />
        ) : (
          <AdminUsers currentUser={currentUser} />
        )}
      </main>

      {/* Modal de Configuración Personal (Tuerca) */}
      <AdminProfileModal
        isOpen={isSettingsOpen}
        onClose={() => setIsSettingsOpen(false)}
        currentUser={currentUser}
        onProfileUpdated={(updatedUser) => {
          onUserUpdated?.(updatedUser);
        }}
      />
    </div>
  );
};
