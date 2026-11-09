/**
 * ─────────────────────────────────────────────────────────────────────────────
 * ARCHIVO: Frontend/src/components/SearchModal.tsx
 * QUÉ ES: Búsqueda instantánea por nombre, casa, familia, género o notas.
 * DÓNDE SE VE: Modal al pulsar "Buscar fragancia..." en el Header.
 * SE RENDERIZA DESDE: App.tsx (<SearchModal ... />).
 * PROPS: isOpen, onClose, perfumes, onSelectPerfume.
 * QUÉ TOCAR:
 *   - Campos por los que busca → constante `results`.
 *   - Atajos de sugerencias → `quickShortcuts`.
 *   - Lista de resultados → bloque "Results List".
 * ─────────────────────────────────────────────────────────────────────────────
 */

import React, { useState } from 'react';
import { Search, X, ArrowRight } from 'lucide-react';
import { Perfume } from '../types';

interface SearchModalProps {
  isOpen: boolean;
  onClose: () => void;
  perfumes: Perfume[];
  onSelectPerfume: (perfume: Perfume) => void;
}

export const SearchModal: React.FC<SearchModalProps> = ({
  isOpen,
  onClose,
  perfumes,
  onSelectPerfume,
}) => {
  const [query, setQuery] = useState('');

  if (!isOpen) return null;

  // ── RESULTADOS DE BÚSQUEDA ─────────────────────────────────────────────────
  // Busca en nombre, casa, familia, género y en todas las notas aromáticas.
  const results = query.trim()
    ? perfumes.filter((p) => {
        const q = query.toLowerCase();
        return (
          p.name.toLowerCase().includes(q) ||
          p.house.toLowerCase().includes(q) ||
          p.family.toLowerCase().includes(q) ||
          p.gender.toLowerCase().includes(q) ||
          [...p.topNotes, ...p.heartNotes, ...p.baseNotes].some((n) =>
            n.toLowerCase().includes(q)
          )
        );
      })
    : [];

  const quickShortcuts = ['Oud', 'Vainilla', 'Bergamota', 'Hombre', 'Mujer', 'Unisex', 'Nicho', 'Cítrico'];

  return (
    <div
      role="dialog"
      aria-modal="true"
      className="fixed inset-0 z-50 overflow-y-auto bg-black/85 backdrop-blur-md flex items-start justify-center pt-20 p-4"
    >
      <div className="fixed inset-0 -z-10" onClick={onClose} />

      <div className="relative bg-[#111111] border border-[#262626] rounded-xl max-w-xl w-full p-6 shadow-2xl animate-in zoom-in-95 duration-200">
        <div className="flex items-center justify-between pb-3 border-b border-[#262626]">
          <div className="flex items-center gap-2 text-xs text-[#D4AF37] font-semibold uppercase tracking-wider">
            <Search className="w-4 h-4" />
            <span>Búsqueda Rápida de Fragancias</span>
          </div>
          <button
            onClick={onClose}
            className="p-1 text-[#B8B8B8] hover:text-[#FAF7F0] transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Search input */}
        <div className="mt-4 relative">
          <input
            autoFocus
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Escribe el nombre, casa o nota aromática..."
            className="w-full bg-[#050505] border border-[#333] focus:border-[#D4AF37] text-sm text-[#FAF7F0] px-4 py-3 rounded-lg outline-none"
          />
        </div>

        {/* Quick suggestions */}
        <div className="mt-3 flex flex-wrap items-center gap-1.5 text-xs">
          <span className="text-[#666] text-[11px]">Sugerencias:</span>
          {quickShortcuts.map((tag) => (
            <button
              key={tag}
              onClick={() => setQuery(tag)}
              className="px-2 py-0.5 rounded bg-[#050505] border border-[#262626] text-[#B8B8B8] hover:text-[#D4AF37] hover:border-[#D4AF37]/50 transition-colors text-[11px]"
            >
              {tag}
            </button>
          ))}
        </div>

        {/* Results List */}
        <div className="mt-5 max-h-80 overflow-y-auto space-y-2">
          {query.trim() && results.length === 0 && (
            <div className="py-8 text-center text-xs text-[#B8B8B8]">
              No encontramos fragancias para "{query}".
            </div>
          )}

          {results.map((perfume) => (
            <button
              key={perfume.id}
              onClick={() => {
                onClose();
                onSelectPerfume(perfume);
              }}
              className="w-full p-2.5 rounded-lg bg-[#080808] border border-[#262626] hover:border-[#D4AF37] flex items-center justify-between text-left transition-colors group cursor-pointer"
            >
              <div className="flex items-center gap-3">
                <img
                  src={perfume.image}
                  alt={perfume.name}
                  className="w-10 h-10 rounded object-cover border border-[#262626]"
                  referrerPolicy="no-referrer"
                />
                <div>
                  <span className="text-[10px] text-[#D4AF37] uppercase font-sans tracking-wider block">
                    {perfume.house}
                  </span>
                  <h4 className="font-serif text-sm font-semibold text-[#FAF7F0] group-hover:text-[#F5E6B3]">
                    {perfume.name}
                  </h4>
                  <span className="text-[10px] text-[#B8B8B8]">
                    {perfume.family} · {perfume.gender}
                  </span>
                </div>
              </div>

              <div className="text-right">
                <span className="font-mono text-xs text-[#FAF7F0] font-bold tabular-nums">
                  RD$ {perfume.sizes[0].priceDOP.toLocaleString()}
                </span>
                <span className="text-[10px] text-[#D4AF37] flex items-center justify-end gap-1 mt-0.5">
                  Ver <ArrowRight className="w-3 h-3" />
                </span>
              </div>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};
