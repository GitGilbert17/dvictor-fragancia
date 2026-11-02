/**
 * ─────────────────────────────────────────────────────────────────────────────
 * ARCHIVO: src/components/PerfumeCarousel.tsx
 * QUÉ ES: Carrusel horizontal reutilizable de perfumes. Se usa para
 *         "Nuevas Llegadas" y "Los Más Vendidos".
 * DÓNDE SE VE: Inicio → bloques 2 y 4.
 * SE RENDERIZA DESDE: App.tsx (dos veces, con distinto título y `isHot`).
 * PROPS: title, subtitle, perfumes, onSelectPerfume, onAddToCart, onSeeMore,
 *        isHot (si es true muestra la llama roja en vez de "24h RD").
 * QUÉ TOCAR:
 *   - Flechas y desplazamiento → función `scroll`.
 *   - Encabezado y "Ver Todo" → bloque "Section Header".
 *   - Tarjeta de cada perfume → bloque "Carousel Track".
 *   - Puntos de paginación → bloque "Pagination Dots".
 * ─────────────────────────────────────────────────────────────────────────────
 */

import React, { useRef, useState } from 'react';
import { ChevronLeft, ChevronRight, Star, Flame, Eye, ShoppingBag } from 'lucide-react';
import { Perfume } from '../types';

interface PerfumeCarouselProps {
  title: string;
  subtitle?: string;
  perfumes: Perfume[];
  onSelectPerfume: (perfume: Perfume) => void;
  onAddToCart: (perfume: Perfume, sizeMl: number) => void;
  onSeeMore?: () => void;
  isHot?: boolean;
}

export const PerfumeCarousel: React.FC<PerfumeCarouselProps> = ({
  title,
  subtitle,
  perfumes,
  onSelectPerfume,
  onAddToCart,
  onSeeMore,
  isHot = false,
}) => {
  const scrollRef = useRef<HTMLDivElement>(null);
  const [scrollIndex, setScrollIndex] = useState(0);

  const scroll = (direction: 'left' | 'right') => {
    if (scrollRef.current) {
      const { scrollLeft, clientWidth } = scrollRef.current;
      const scrollAmount = clientWidth * 0.75;
      const newPos = direction === 'left' ? scrollLeft - scrollAmount : scrollLeft + scrollAmount;
      scrollRef.current.scrollTo({ left: newPos, behavior: 'smooth' });
    }
  };

  const handleScroll = () => {
    if (scrollRef.current) {
      const { scrollLeft, scrollWidth, clientWidth } = scrollRef.current;
      const maxScroll = scrollWidth - clientWidth;
      if (maxScroll > 0) {
        const ratio = scrollLeft / maxScroll;
        setScrollIndex(Math.round(ratio * 2));
      }
    }
  };

  return (
    <section className="py-10 bg-[#050505]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Minimalist Section Header with Hairline Divider (Inspire from MaxAroma Reference) */}
        <div className="relative flex items-center justify-between mb-8">
          <div className="absolute inset-0 flex items-center pointer-events-none" aria-hidden="true">
            <div className="w-full border-t border-[#222]" />
          </div>

          <div className="relative bg-[#050505] pr-4 flex items-center gap-2">
            <h2 className="font-serif text-xl sm:text-2xl text-[#FAF7F0] font-normal tracking-wide">
              {title}
            </h2>
            {subtitle && (
              <span className="text-xs text-[#B8B8B8] font-sans hidden sm:inline">
                · {subtitle}
              </span>
            )}
          </div>

          <div className="relative bg-[#050505] pl-4 flex items-center gap-4">
            {onSeeMore && (
              <button
                onClick={onSeeMore}
                className="text-xs uppercase tracking-wider font-sans text-[#B8B8B8] hover:text-[#D4AF37] transition-colors underline-offset-4 hover:underline"
              >
                Ver Todo
              </button>
            )}

            {/* Navigation Arrows */}
            <div className="hidden sm:flex items-center gap-1">
              <button
                onClick={() => scroll('left')}
                className="p-1.5 rounded text-[#B8B8B8] hover:text-[#FAF7F0] hover:bg-[#111] transition-colors"
                aria-label="Anterior"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>
              <button
                onClick={() => scroll('right')}
                className="p-1.5 rounded text-[#B8B8B8] hover:text-[#FAF7F0] hover:bg-[#111] transition-colors"
                aria-label="Siguiente"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>

        {/* Carousel Track */}
        <div
          ref={scrollRef}
          onScroll={handleScroll}
          className="flex gap-5 sm:gap-6 overflow-x-auto pb-4 snap-x snap-mandatory scrollbar-none scroll-smooth"
          style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
        >
          {perfumes.map((perfume) => {
            const minPrice = perfume.sizes[0].priceDOP;
            const maxPrice = perfume.sizes[perfume.sizes.length - 1].priceDOP;
            const priceText =
              perfume.sizes.length > 1
                ? `RD$ ${minPrice.toLocaleString()} - RD$ ${maxPrice.toLocaleString()}`
                : `RD$ ${minPrice.toLocaleString()}`;

            return (
              <div
                key={perfume.id}
                onClick={() => onSelectPerfume(perfume)}
                className="w-[200px] sm:w-[220px] md:w-[240px] shrink-0 snap-start group flex flex-col justify-between cursor-pointer text-center"
              >
                {/* Bottle Presentation Container (Minimalist, like reference 3 & 4) */}
                <div className="relative aspect-[3/4] bg-[#0c0c0c] rounded-md overflow-hidden flex items-center justify-center p-3 border border-transparent hover:border-[#D4AF37]/40 transition-all duration-300">
                  <img
                    src={perfume.image}
                    alt={perfume.name}
                    className="w-full h-full object-cover rounded object-center transition-transform duration-500 group-hover:scale-105"
                    referrerPolicy="no-referrer"
                    loading="lazy"
                  />

                  {/* Badge Marker */}
                  {isHot ? (
                    <div className="absolute top-2.5 right-2.5 text-[#ef4444] drop-shadow-[0_2px_4px_rgba(0,0,0,0.8)]">
                      <Flame className="w-4 h-4 fill-current animate-pulse" />
                    </div>
                  ) : (
                    <div className="absolute top-2 right-2 text-[9px] uppercase font-sans tracking-widest font-semibold px-1.5 py-0.5 bg-[#050505]/85 text-[#D4AF37] border border-[#D4AF37]/30 rounded">
                      24h RD
                    </div>
                  )}

                  {/* Quick Action Overlay */}
                  <div className="absolute inset-x-0 bottom-0 py-2 bg-gradient-to-t from-black via-black/80 to-transparent flex items-center justify-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        onAddToCart(perfume, perfume.sizes[0].ml);
                      }}
                      className="px-3 py-1 bg-[#D4AF37] hover:bg-[#FFD76A] text-[#050505] rounded text-[11px] font-sans font-semibold flex items-center gap-1 shadow-md"
                    >
                      <ShoppingBag className="w-3 h-3" />
                      <span>Añadir</span>
                    </button>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        onSelectPerfume(perfume);
                      }}
                      className="p-1 bg-[#1a1a1a] hover:bg-[#252525] text-[#FAF7F0] rounded"
                      title="Ver Detalles"
                    >
                      <Eye className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>

                {/* Typography Metadata (Clean, Unboxed) */}
                <div className="pt-3 flex flex-col items-center">
                  <h3 className="font-serif text-sm sm:text-base font-semibold text-[#FAF7F0] group-hover:text-[#F5E6B3] transition-colors leading-snug line-clamp-1">
                    {perfume.name}
                  </h3>
                  <span className="text-[10px] uppercase font-sans tracking-widest text-[#B8B8B8] mt-0.5">
                    por <strong className="text-[#D4AF37] font-medium">{perfume.house}</strong>
                  </span>
                  <span className="text-[11px] text-[#888] font-sans mt-0.5">
                    {perfume.gender} · {perfume.concentration}
                  </span>

                  {/* Rating Stars */}
                  <div className="flex items-center gap-0.5 mt-1 text-[#FFD76A]">
                    {[...Array(5)].map((_, i) => (
                      <Star
                        key={i}
                        className={`w-2.5 h-2.5 ${
                          i < Math.floor(perfume.rating) ? 'fill-current' : 'opacity-40'
                        }`}
                      />
                    ))}
                    <span className="text-[10px] text-[#777] font-sans ml-1">
                      ({perfume.reviewsCount})
                    </span>
                  </div>

                  {/* Price in Dominican Pesos */}
                  <div className="mt-1 font-mono text-xs sm:text-sm font-semibold text-[#FAF7F0] tabular-nums">
                    {priceText}
                  </div>

                  {/* Options Available dot indicator (Reference 3) */}
                  <div className="mt-1 flex items-center gap-1.5 text-[10px] text-[#B8B8B8]">
                    <span>{perfume.sizes.length} Presentaciones</span>
                    <span className="w-1.5 h-1.5 rounded-full bg-[#D4AF37]" />
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Pagination Dots */}
        <div className="flex justify-center items-center gap-2 mt-4">
          {[0, 1, 2].map((idx) => (
            <button
              key={idx}
              onClick={() => {
                if (scrollRef.current) {
                  const target = (scrollRef.current.scrollWidth - scrollRef.current.clientWidth) * (idx / 2);
                  scrollRef.current.scrollTo({ left: target, behavior: 'smooth' });
                }
              }}
              className={`h-1.5 rounded-full transition-all duration-300 ${
                scrollIndex === idx ? 'w-5 bg-[#D4AF37]' : 'w-1.5 bg-[#333]'
              }`}
              aria-label={`Ir al grupo ${idx + 1}`}
            />
          ))}
        </div>
      </div>
    </section>
  );
};
