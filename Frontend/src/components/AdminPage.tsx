import React from 'react';
import { ArrowLeft, ExternalLink } from 'lucide-react';
import { BrandLogo } from './BrandLogo';
import { AdminProducts } from './AdminProducts';

interface AdminPageProps {
  onProductsChanged?: () => void;
  onGoToStore: () => void;
}

export const AdminPage: React.FC<AdminPageProps> = ({ onProductsChanged, onGoToStore }) => {
  return (
    <div className="min-h-screen bg-[#070707] text-[#FAF7F0] font-sans selection:bg-[#D4AF37] selection:text-[#050505]">
      {/* Top Private Navigation Bar */}
      <header className="bg-[#0c0c0c] border-b border-[#222] px-4 sm:px-8 py-3.5 flex items-center justify-between sticky top-0 z-50">
        <div className="flex items-center gap-3">
          <BrandLogo variant="monogram" size="sm" />
          <div>
            <div className="text-[10px] text-[#D4AF37] font-mono uppercase tracking-widest font-semibold">
              Panel Administrativo Privado
            </div>
            <div className="text-xs text-[#FAF7F0] font-serif">
              D’ Victor Fragancias Management
            </div>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <span className="hidden sm:inline-flex items-center gap-1.5 text-[11px] text-[#22c55e] bg-[#22c55e]/10 px-2.5 py-1 rounded border border-[#22c55e]/30">
            <span className="w-1.5 h-1.5 rounded-full bg-[#22c55e] animate-pulse" />
            Servidor Backend Activo
          </span>
          <button
            onClick={onGoToStore}
            className="flex items-center gap-1.5 px-3 py-1.5 bg-[#171717] hover:bg-[#222] text-[#FAF7F0] hover:text-[#D4AF37] border border-[#2e2e2e] rounded-md text-xs font-medium transition-colors cursor-pointer"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Ir a la Tienda (Página del Cliente)</span>
          </button>
        </div>
      </header>

      {/* Main Admin Content */}
      <main className="py-4">
        <AdminProducts onProductsChanged={onProductsChanged} />
      </main>
    </div>
  );
};
