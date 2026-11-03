/**
 * ─────────────────────────────────────────────────────────────────────────────
 * ARCHIVO: src/components/CampaignBanners.tsx
 * QUÉ ES: Banners publicitarios con Scroll Reveal de alto impacto.
 * DÓNDE SE VE: Inicio → bloque 3 ("Campañas").
 * ─────────────────────────────────────────────────────────────────────────────
 */

import React, { useEffect, useRef } from 'react';
import { Perfume } from '../types';

interface CampaignBannersProps {
  perfumes: Perfume[];
  onSelectPerfumeById: (perfumeId: string) => void;
}

// Hook reutilizable para Scroll Reveal con IntersectionObserver
function useReveal(ref: React.RefObject<HTMLElement | null>, direction: 'up' | 'left' | 'right' = 'up', delay = 0) {
  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const classBase = direction === 'left' ? 'reveal-left' : direction === 'right' ? 'reveal-right' : 'reveal-hidden';
    el.classList.add(classBase);

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          el.style.transitionDelay = `${delay}s`;
          el.classList.add('reveal-visible', 'reveal-active');
          el.classList.remove(classBase);
        } else {
          el.style.transitionDelay = '0s';
          el.classList.remove('reveal-visible', 'reveal-active');
          el.classList.add(classBase);
        }
      },
      { threshold: 0.12, rootMargin: '0px 0px -40px 0px' }
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, [ref, direction, delay]);
}

export const CampaignBanners: React.FC<CampaignBannersProps> = ({
  onSelectPerfumeById,
}) => {
  const headingRef = useRef<HTMLDivElement>(null);
  const banner1Ref = useRef<HTMLDivElement>(null);
  const banner2Ref = useRef<HTMLDivElement>(null);
  const grid1Ref = useRef<HTMLDivElement>(null);
  const grid2Ref = useRef<HTMLDivElement>(null);
  const grid3Ref = useRef<HTMLDivElement>(null);
  const grid4Ref = useRef<HTMLDivElement>(null);

  useReveal(headingRef as React.RefObject<HTMLElement>, 'up', 0);
  useReveal(banner1Ref as React.RefObject<HTMLElement>, 'left', 0.1);
  useReveal(banner2Ref as React.RefObject<HTMLElement>, 'right', 0.2);
  useReveal(grid1Ref as React.RefObject<HTMLElement>, 'up', 0.0);
  useReveal(grid2Ref as React.RefObject<HTMLElement>, 'up', 0.12);
  useReveal(grid3Ref as React.RefObject<HTMLElement>, 'up', 0.24);
  useReveal(grid4Ref as React.RefObject<HTMLElement>, 'up', 0.36);

  return (
    <div className="space-y-16 py-8 bg-[#050505]">

      {/* Divider con shimmer dorado animado */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="gold-shimmer-line" />
      </div>

      {/* 2-Column Campaign Spotlight */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Encabezado de sección */}
        <div ref={headingRef} className="text-center mb-8">
          <span className="text-[10px] uppercase tracking-[0.3em] text-[#D4AF37] font-sans font-semibold">
            Campañas Exclusivas
          </span>
          <h2 className="font-serif text-2xl sm:text-3xl text-[#FAF7F0] mt-2 font-normal">
            Fragancias <span className="italic">Destacadas</span>
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-5 sm:gap-6">
          {/* Banner 1: Tabac Doré — entra desde la izquierda */}
          <div
            ref={banner1Ref}
            onClick={() => onSelectPerfumeById('tabac-dore-reserve')}
            className="hover-gold-glow group relative aspect-[4/3] sm:aspect-[16/11] rounded-lg overflow-hidden cursor-pointer bg-[#0c0c0c] border border-[#222] hover:border-[#D4AF37]/50 shadow-xl"
          >
            <img
              src="/src/assets/images/campaign_tobacco_gold_1793303201731.jpg"
              alt="Bortnikoff Tabac Doré Campaign"
              className="w-full h-full object-cover object-center transition-transform duration-700 group-hover:scale-105"
              referrerPolicy="no-referrer"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/30 to-transparent" />
            <div className="absolute inset-x-0 bottom-0 p-6 sm:p-8 text-center flex flex-col items-center">
              <span className="text-[10px] sm:text-[11px] uppercase tracking-[0.25em] font-sans font-semibold text-[#D4AF37] mb-1.5">
                Descubrir Novedades
              </span>
              <h3 className="font-serif text-2xl sm:text-3xl lg:text-4xl text-[#FAF7F0] font-normal leading-tight">
                BORTNIKOFF: <span className="italic">TABAC DORÉ</span>
              </h3>
              <p className="text-xs sm:text-sm text-[#F5E6B3] font-sans mt-1.5 max-w-sm font-light">
                Hojas de Tabaco Rubio · Vainilla Negra · Oud Añejo
              </p>
              <div className="mt-4">
                <span className="btn-impact inline-block px-5 py-2 border border-[#D4AF37]/60 group-hover:border-[#D4AF37] group-hover:bg-[#D4AF37] group-hover:text-[#050505] text-[#FAF7F0] text-xs font-sans tracking-widest uppercase transition-all duration-300">
                  Explorar Fragancia
                </span>
              </div>
            </div>
          </div>

          {/* Banner 2: DésirToxic Azur — entra desde la derecha */}
          <div
            ref={banner2Ref}
            onClick={() => onSelectPerfumeById('desirtoxic-azur-niche')}
            className="hover-gold-glow group relative aspect-[4/3] sm:aspect-[16/11] rounded-lg overflow-hidden cursor-pointer bg-[#0c0c0c] border border-[#222] hover:border-[#D4AF37]/50 shadow-xl"
          >
            <img
              src="/src/assets/images/campaign_azure_niche_1793303200950.jpg"
              alt="M.Micallef DésirToxic Campaign"
              className="w-full h-full object-cover object-center transition-transform duration-700 group-hover:scale-105"
              referrerPolicy="no-referrer"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/30 to-transparent" />
            <div className="absolute inset-x-0 bottom-0 p-6 sm:p-8 text-center flex flex-col items-center">
              <span className="text-[10px] sm:text-[11px] uppercase tracking-[0.25em] font-sans font-semibold text-[#D4AF37] mb-1.5">
                Alta Perfumería de Autor
              </span>
              <h3 className="font-serif text-2xl sm:text-3xl lg:text-4xl text-[#FAF7F0] font-normal leading-tight">
                M.MICALLEF: <span className="italic">DÉSIRTOXIC</span>
              </h3>
              <p className="text-xs sm:text-sm text-[#F5E6B3] font-sans mt-1.5 max-w-sm font-light">
                Cardamomo de Ceilán · Pachulí Fresco · Almizcle Blanco
              </p>
              <div className="mt-4">
                <span className="btn-impact inline-block px-5 py-2 border border-[#D4AF37]/60 group-hover:border-[#D4AF37] group-hover:bg-[#D4AF37] group-hover:text-[#050505] text-[#FAF7F0] text-xs font-sans tracking-widest uppercase transition-all duration-300">
                  Explorar Fragancia
                </span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Divider secundario */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="gold-shimmer-line" />
      </div>

      {/* 4-Grid Editorial Campaign con stagger escalonado */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-4">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5">

          <div
            ref={grid1Ref}
            onClick={() => onSelectPerfumeById('aeterna-golden-oudh')}
            className="hover-gold-glow group relative aspect-[3/4] rounded-md overflow-hidden cursor-pointer bg-[#0c0c0c] border border-[#222] hover:border-[#D4AF37]/50 shadow-lg"
          >
            <img
              src="/src/assets/images/perfume_tomford_oud_1793299736566.jpg"
              alt="Aeterna Golden Oudh"
              className="w-full h-full object-cover object-center transition-transform duration-700 group-hover:scale-110"
              referrerPolicy="no-referrer"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/20 to-transparent" />
            <div className="absolute inset-x-0 bottom-0 p-4 text-center">
              <span className="text-[9px] uppercase tracking-widest text-[#D4AF37] font-sans font-semibold">D' Victor Reserve</span>
              <h4 className="font-serif text-sm sm:text-lg text-[#FAF7F0] leading-tight mt-0.5">Aeterna Nº III</h4>
            </div>
          </div>

          <div
            ref={grid2Ref}
            onClick={() => onSelectPerfumeById('baccarat-rouge-540')}
            className="hover-gold-glow group relative aspect-[3/4] rounded-md overflow-hidden cursor-pointer bg-[#0c0c0c] border border-[#222] hover:border-[#D4AF37]/50 shadow-lg"
          >
            <img
              src="/src/assets/images/perfume_baccarat_rouge_1793299737267.jpg"
              alt="Baccarat Rouge 540"
              className="w-full h-full object-cover object-center transition-transform duration-700 group-hover:scale-110"
              referrerPolicy="no-referrer"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/20 to-transparent" />
            <div className="absolute inset-x-0 bottom-0 p-4 text-center">
              <span className="text-[9px] uppercase tracking-widest text-[#D4AF37] font-sans font-semibold">Maison Francis</span>
              <h4 className="font-serif text-sm sm:text-lg text-[#FAF7F0] leading-tight mt-0.5">Baccarat Rouge</h4>
            </div>
          </div>

          <div
            ref={grid3Ref}
            onClick={() => onSelectPerfumeById('creed-aventus')}
            className="hover-gold-glow group relative aspect-[3/4] rounded-md overflow-hidden cursor-pointer bg-[#0c0c0c] border border-[#222] hover:border-[#D4AF37]/50 shadow-lg"
          >
            <img
              src="/src/assets/images/perfume_creed_aventus_1793299734804.jpg"
              alt="Creed Aventus"
              className="w-full h-full object-cover object-center transition-transform duration-700 group-hover:scale-110"
              referrerPolicy="no-referrer"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/20 to-transparent" />
            <div className="absolute inset-x-0 bottom-0 p-4 text-center">
              <span className="text-[9px] uppercase tracking-widest text-[#D4AF37] font-sans font-semibold">Creed</span>
              <h4 className="font-serif text-sm sm:text-lg text-[#FAF7F0] leading-tight mt-0.5">Aventus</h4>
            </div>
          </div>

          <div
            ref={grid4Ref}
            onClick={() => onSelectPerfumeById('delina-rose')}
            className="hover-gold-glow group relative aspect-[3/4] rounded-md overflow-hidden cursor-pointer bg-[#0c0c0c] border border-[#222] hover:border-[#D4AF37]/50 shadow-lg"
          >
            <img
              src="/src/assets/images/perfume_parfums_marly_delina_1793299736567.jpg"
              alt="Parfums de Marly Delina"
              className="w-full h-full object-cover object-center transition-transform duration-700 group-hover:scale-110"
              referrerPolicy="no-referrer"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/20 to-transparent" />
            <div className="absolute inset-x-0 bottom-0 p-4 text-center">
              <span className="text-[9px] uppercase tracking-widest text-[#D4AF37] font-sans font-semibold">Parfums de Marly</span>
              <h4 className="font-serif text-sm sm:text-lg text-[#FAF7F0] leading-tight mt-0.5">Delina</h4>
            </div>
          </div>

        </div>
      </section>
    </div>
  );
};
