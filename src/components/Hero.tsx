import React from 'react';
import { ArrowRight, Sparkles } from 'lucide-react';

interface HeroProps {
  onShopClick: () => void;
  onExploreFeatured: () => void;
}

export const Hero: React.FC<HeroProps> = ({ onShopClick, onExploreFeatured }) => {
  return (
    <section className="relative overflow-hidden bg-[#050505]">
      {/* Full-width Minimalist Hero Banner inspired by MaxAroma Reference (image_b8ef482d.png) */}
      <div className="relative w-full h-[520px] sm:h-[600px] lg:h-[680px] bg-[#080808] flex items-center">
        {/* Background Photograph */}
        <img
          src="/src/assets/images/hero_luxury_perfume_1793299734093.jpg"
          alt="D’ Victor Fragancias - Oman Luxury Hommage Style Hero"
          className="absolute inset-0 w-full h-full object-cover object-center"
          referrerPolicy="no-referrer"
        />

        {/* Subtle Scrim for Typographic Contrast */}
        <div className="absolute inset-0 bg-gradient-to-r from-black/85 via-black/50 to-transparent" />

        {/* Hero Content (Clean, Minimalist, Editorial) */}
        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
          <div className="max-w-xl text-left">
            {/* House Pretitle */}
            <span className="text-[11px] sm:text-xs uppercase tracking-[0.3em] font-sans font-semibold text-[#D4AF37] block mb-3">
              D’ VICTOR PRIVATE RESERVE
            </span>

            {/* Title in Cormorant Garamond */}
            <h1 className="font-serif text-4xl sm:text-5xl lg:text-7xl font-normal text-[#FAF7F0] tracking-tight leading-[1.05] mb-3">
              AETERNA <span className="italic font-light">1744</span>
            </h1>

            {/* Olfactory Notes (Minimalist dot-separated prose) */}
            <p className="font-sans text-sm sm:text-base text-[#F5E6B3] tracking-wider mb-8 font-light">
              Azafrán Persa. Oud de Assam. Ámbar Fundido.
            </p>

            {/* Minimalist Action Buttons */}
            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
              <button
                onClick={onExploreFeatured}
                className="px-8 py-3.5 bg-transparent border border-[#FAF7F0] hover:bg-[#FAF7F0] hover:text-[#050505] text-[#FAF7F0] font-sans text-xs uppercase tracking-[0.2em] font-medium transition-all duration-300 cursor-pointer"
              >
                Descubrir AETERNA 1744
              </button>

              <button
                onClick={onShopClick}
                className="px-6 py-3.5 bg-[#D4AF37] hover:bg-[#FFD76A] text-[#050505] font-sans text-xs uppercase tracking-[0.2em] font-semibold transition-all duration-300 cursor-pointer"
              >
                Explorar Catálogo
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Trust Mini-Bar (Subtle, Clean) */}
      <div className="border-y border-[#1a1a1a] bg-[#080808] py-3 text-xs text-[#B8B8B8] font-sans">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <span className="w-1.5 h-1.5 rounded-full bg-[#D4AF37]" />
            <span>100% Auténticos Garantizados con Batch Code</span>
          </div>
          <div className="hidden md:flex items-center gap-2">
            <span className="w-1.5 h-1.5 rounded-full bg-[#D4AF37]" />
            <span>Envíos express en Santo Domingo y todas las provincias de RD</span>
          </div>
          <div className="flex items-center gap-2 text-[#D4AF37]">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Showroom Privado en Piantini</span>
          </div>
        </div>
      </div>
    </section>
  );
};
