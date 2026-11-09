/**
 * ─────────────────────────────────────────────────────────────────────────────
 * ARCHIVO: Frontend/src/components/WishlistModal.tsx
 * QUÉ ES: Lista de perfumes favoritos guardados en localStorage.
 * DÓNDE SE VE: Modal al pulsar el corazón del Header.
 * SE RENDERIZA DESDE: App.tsx (<WishlistModal ... />).
 * PROPS: isOpen, onClose, wishlistIds, perfumes, onSelectPerfume,
 *        onAddToCart, onToggleWishlist.
 * QUÉ TOCAR:
 *   - Filtrado de favoritos → constante `wishlistedPerfumes`.
 *   - Estado vacío → bloque `wishlistedPerfumes.length === 0`.
 *   - Acciones por ítem (añadir / quitar) → botones del map.
 * ─────────────────────────────────────────────────────────────────────────────
 */

import React from 'react';
import { X, Heart, Trash2, ShoppingBag, Eye } from 'lucide-react';
import { Perfume } from '../types';

interface WishlistModalProps {
  isOpen: boolean;
  onClose: () => void;
  wishlistIds: string[];
  perfumes: Perfume[];
  onSelectPerfume: (perfume: Perfume) => void;
  onAddToCart: (perfume: Perfume, sizeMl: number) => void;
  onToggleWishlist: (perfumeId: string) => void;
}

export const WishlistModal: React.FC<WishlistModalProps> = ({
  isOpen,
  onClose,
  wishlistIds,
  perfumes,
  onSelectPerfume,
  onAddToCart,
  onToggleWishlist,
}) => {
  if (!isOpen) return null;

  // ── FAVORITOS VISIBLES ─────────────────────────────────────────────────────
  // Cruza los IDs guardados (localStorage) con el catálogo actual.
  const wishlistedPerfumes = perfumes.filter((p) => wishlistIds.includes(p.id));

  return (
    <div
      role="dialog"
      aria-modal="true"
      className="fixed inset-0 z-50 overflow-y-auto bg-black/85 backdrop-blur-md flex items-center justify-center p-4"
    >
      <div className="fixed inset-0 -z-10" onClick={onClose} />

      <div className="relative bg-[#111111] border border-[#262626] rounded-xl max-w-lg w-full p-6 shadow-2xl animate-in zoom-in-95 duration-200">
        <div className="flex items-center justify-between pb-3 border-b border-[#262626]">
          <div className="flex items-center gap-2 text-xs text-[#D4AF37] font-semibold uppercase tracking-wider">
            <Heart className="w-4 h-4 fill-[#D4AF37]" />
            <span>Mis Fragancias Favoritas ({wishlistedPerfumes.length})</span>
          </div>
          <button
            onClick={onClose}
            className="p-1 text-[#B8B8B8] hover:text-[#FAF7F0] transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="mt-4 max-h-96 overflow-y-auto space-y-3">
          {wishlistedPerfumes.length === 0 ? (
            <div className="text-center py-12 text-xs text-[#B8B8B8]">
              <Heart className="w-8 h-8 text-[#333] mx-auto mb-2" />
              <p className="font-serif text-base text-[#FAF7F0] mb-1">
                No tienes perfumes guardados aún
              </p>
              <p>
                Haz clic en el icono del corazón en cualquier perfume para agregarlo a tu lista personal de deseos.
              </p>
            </div>
          ) : (
            wishlistedPerfumes.map((perfume) => (
              <div
                key={perfume.id}
                className="p-3 rounded-lg bg-[#080808] border border-[#262626] flex items-center justify-between gap-3"
              >
                <div
                  onClick={() => {
                    onClose();
                    onSelectPerfume(perfume);
                  }}
                  className="flex items-center gap-3 cursor-pointer group flex-1 min-w-0"
                >
                  <img
                    src={perfume.image}
                    alt={perfume.name}
                    className="w-12 h-12 rounded object-cover border border-[#262626] shrink-0"
                    referrerPolicy="no-referrer"
                  />
                  <div className="truncate">
                    <span className="text-[10px] text-[#D4AF37] uppercase font-sans block truncate">
                      {perfume.house}
                    </span>
                    <h4 className="font-serif text-sm font-semibold text-[#FAF7F0] group-hover:text-[#F5E6B3] truncate">
                      {perfume.name}
                    </h4>
                    <span className="font-mono text-xs text-[#FAF7F0] tabular-nums font-bold">
                      RD$ {perfume.sizes[0].priceDOP.toLocaleString()}
                    </span>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => {
                      onAddToCart(perfume, perfume.sizes[0].ml);
                    }}
                    className="p-2 rounded bg-[#D4AF37] hover:bg-[#FFD76A] text-[#050505] transition-colors"
                    title="Añadir a la bolsa"
                  >
                    <ShoppingBag className="w-3.5 h-3.5" />
                  </button>

                  <button
                    onClick={() => onToggleWishlist(perfume.id)}
                    className="p-2 rounded text-[#666] hover:text-red-400 hover:bg-[#1a1a1a] transition-colors"
                    title="Quitar de favoritos"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};
