import React from 'react';
import { Perfume } from '../types';

interface CampaignBannersProps {
  perfumes: Perfume[];
  onSelectPerfumeById: (perfumeId: string) => void;
}

export const CampaignBanners: React.FC<CampaignBannersProps> = ({
  perfumes,
  onSelectPerfumeById,
}) => {
  return (
    <div className="space-y-16 py-8 bg-[#050505]">
      {/* 2-Column Campaign Spotlight (Reference 4: image_242cb9fc.png) */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5 sm:gap-6">
          {/* Banner 1: Tabac Doré */}
          <div
            onClick={() => onSelectPerfumeById('tabac-dore-reserve')}
            className="group relative aspect-[4/3] sm:aspect-[16/11] rounded-lg overflow-hidden cursor-pointer bg-[#0c0c0c] border border-[#222] hover:border-[#D4AF37]/50 transition-all duration-500 shadow-xl"
          >
            <img
              src="/src/assets/images/campaign_tobacco_gold_1793303201731.jpg"
              alt="Bortnikoff Tabac Doré Campaign"
              className="w-full h-full object-cover object-center transition-transform duration-700 group-hover:scale-105"
              referrerPolicy="no-referrer"
            />
            {/* Subtle Gradient Scrim at bottom */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/30 to-transparent flex flex-col justify-end p-6 sm:p-8 text-center" />

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
                <span className="inline-block px-5 py-2 border border-[#D4AF37]/60 group-hover:border-[#D4AF37] group-hover:bg-[#D4AF37] group-hover:text-[#050505] text-[#FAF7F0] text-xs font-sans tracking-widest uppercase transition-all duration-300">
                  Explorar Fragancia
                </span>
              </div>
            </div>
          </div>

          {/* Banner 2: DesirToxic Azur */}
          <div
            onClick={() => onSelectPerfumeById('desirtoxic-azur-niche')}
            className="group relative aspect-[4/3] sm:aspect-[16/11] rounded-lg overflow-hidden cursor-pointer bg-[#0c0c0c] border border-[#222] hover:border-[#D4AF37]/50 transition-all duration-500 shadow-xl"
          >
            <img
              src="/src/assets/images/campaign_azure_niche_1793303200950.jpg"
              alt="M.Micallef DésirToxic Campaign"
              className="w-full h-full object-cover object-center transition-transform duration-700 group-hover:scale-105"
              referrerPolicy="no-referrer"
            />
            {/* Subtle Gradient Scrim at bottom */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/30 to-transparent flex flex-col justify-end p-6 sm:p-8 text-center" />

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
                <span className="inline-block px-5 py-2 border border-[#D4AF37]/60 group-hover:border-[#D4AF37] group-hover:bg-[#D4AF37] group-hover:text-[#050505] text-[#FAF7F0] text-xs font-sans tracking-widest uppercase transition-all duration-300">
                  Explorar Fragancia
                </span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 4-Grid Editorial Campaign: Trending Niche (Reference 5: image_d3e33d8f.png) */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-4">
        {/* Section Header with Hairline Divider */}
        <div className="relative flex items-center justify-between mb-8">
          <div className="absolute inset-0 flex items-center pointer-events-none" aria-hidden="true">
            <div className="w-full border-t border-[#222]" />
          </div>
          <div className="relative bg-[#050505] pr-4">
            <h2 className="font-serif text-xl sm:text-2xl text-[#FAF7F0] font-normal tracking-wide">
              Tendencias & Joyas Olfativas
            </h2>
          </div>
          <div className="relative bg-[#050505] pl-4">
            <span className="text-xs uppercase tracking-wider font-sans text-[#D4AF37]">
              Curaduría Exclusiva D’ Victor
            </span>
          </div>
        </div>

        {/* 2x2 Grid of Large Editorial Photos */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5 sm:gap-6">
          {/* Card 1: Aeterna Oudh */}
          <div
            onClick={() => onSelectPerfumeById('aeterna-golden-oudh')}
            className="group relative aspect-[4/3] rounded-lg overflow-hidden cursor-pointer bg-[#0c0c0c] border border-[#222] hover:border-[#D4AF37]/50 transition-all duration-500"
          >
            <img
              src="/src/assets/images/hero_luxury_perfume_1793299734093.jpg"
              alt="Aeterna Golden Oudh"
              className="w-full h-full object-cover object-center transition-transform duration-700 group-hover:scale-105"
              referrerPolicy="no-referrer"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/25 to-transparent flex flex-col justify-end p-6 text-center" />
            <div className="absolute inset-x-0 bottom-0 p-6 text-center flex flex-col items-center">
              <span className="text-[10px] uppercase tracking-[0.25em] font-sans font-semibold text-[#D4AF37] mb-1">
                Descubrir Ahora
              </span>
              <h3 className="font-serif text-xl sm:text-2xl text-[#FAF7F0] font-normal">
                D’ VICTOR: <span className="italic font-medium">AETERNA Nº III</span>
              </h3>
              <p className="text-xs text-[#B8B8B8] mt-1 font-sans">
                Oud de Assam · Azafrán Real · Ámbar Cristalino
              </p>
            </div>
          </div>

          {/* Card 2: Baccarat Rouge style */}
          <div
            onClick={() => onSelectPerfumeById('maison-rubis-extrait')}
            className="group relative aspect-[4/3] rounded-lg overflow-hidden cursor-pointer bg-[#0c0c0c] border border-[#222] hover:border-[#D4AF37]/50 transition-all duration-500"
          >
            <img
              src="/src/assets/images/perfume_baccarat_rouge_1793299737267.jpg"
              alt="Maison Du Rubis 540"
              className="w-full h-full object-cover object-center transition-transform duration-700 group-hover:scale-105"
              referrerPolicy="no-referrer"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/25 to-transparent flex flex-col justify-end p-6 text-center" />
            <div className="absolute inset-x-0 bottom-0 p-6 text-center flex flex-col items-center">
              <span className="text-[10px] uppercase tracking-[0.25em] font-sans font-semibold text-[#D4AF37] mb-1">
                Descubrir Ahora
              </span>
              <h3 className="font-serif text-xl sm:text-2xl text-[#FAF7F0] font-normal">
                MAISON FRANCIS KURKDJIAN: <span className="italic font-medium">RUBIS 540</span>
              </h3>
              <p className="text-xs text-[#B8B8B8] mt-1 font-sans">
                Jazmín de Egipto · Cedro del Atlas · Ámbar Gris Mineral
              </p>
            </div>
          </div>

          {/* Card 3: Creed Aventus style */}
          <div
            onClick={() => onSelectPerfumeById('nocturne-royal-reserve')}
            className="group relative aspect-[4/3] rounded-lg overflow-hidden cursor-pointer bg-[#0c0c0c] border border-[#222] hover:border-[#D4AF37]/50 transition-all duration-500"
          >
            <img
              src="/src/assets/images/perfume_creed_aventus_1793299734804.jpg"
              alt="Nocturne Imperial Millésime"
              className="w-full h-full object-cover object-center transition-transform duration-700 group-hover:scale-105"
              referrerPolicy="no-referrer"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/25 to-transparent flex flex-col justify-end p-6 text-center" />
            <div className="absolute inset-x-0 bottom-0 p-6 text-center flex flex-col items-center">
              <span className="text-[10px] uppercase tracking-[0.25em] font-sans font-semibold text-[#D4AF37] mb-1">
                Descubrir Ahora
              </span>
              <h3 className="font-serif text-xl sm:text-2xl text-[#FAF7F0] font-normal">
                CREED HERITAGE: <span className="italic font-medium">NOCTURNE IMPERIAL</span>
              </h3>
              <p className="text-xs text-[#B8B8B8] mt-1 font-sans">
                Piña Imperial · Abedul Ahumado · Cuero Curtido
              </p>
            </div>
          </div>

          {/* Card 4: Delina style */}
          <div
            onClick={() => onSelectPerfumeById('rose-etheree-royale')}
            className="group relative aspect-[4/3] rounded-lg overflow-hidden cursor-pointer bg-[#0c0c0c] border border-[#222] hover:border-[#D4AF37]/50 transition-all duration-500"
          >
            <img
              src="/src/assets/images/perfume_parfums_marly_delina_1793299736567.jpg"
              alt="Rose Éthérée Royale"
              className="w-full h-full object-cover object-center transition-transform duration-700 group-hover:scale-105"
              referrerPolicy="no-referrer"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/25 to-transparent flex flex-col justify-end p-6 text-center" />
            <div className="absolute inset-x-0 bottom-0 p-6 text-center flex flex-col items-center">
              <span className="text-[10px] uppercase tracking-[0.25em] font-sans font-semibold text-[#D4AF37] mb-1">
                Descubrir Ahora
              </span>
              <h3 className="font-serif text-xl sm:text-2xl text-[#FAF7F0] font-normal">
                PARFUMS DE MARLY: <span className="italic font-medium">ROSE ÉTHÉRÉE</span>
              </h3>
              <p className="text-xs text-[#B8B8B8] mt-1 font-sans">
                Rosa Turca · Lichi Rosa de Madagascar · Peonía Imperial
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};
