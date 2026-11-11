/**
 * ─────────────────────────────────────────────────────────────────────────────
 * ARCHIVO: Frontend/src/components/Hero.tsx
 * QUÉ ES: Banner principal con slideshow cinematográfico automático (3 imágenes)
 *         que entran desde la derecha de forma fluida y lenta, más animaciones
 *         de entrada en cascada.
 * DÓNDE SE VE: Inicio → primer bloque después del Header.
 * QUÉ TOCAR:
 *   - Imágenes del slider → constante HERO_SLIDES.
 *   - Velocidad del cambio automático → HERO_SLIDE_INTERVAL_MS.
 *   - Textos y botones → bloque "Contenido del Hero".
 * ─────────────────────────────────────────────────────────────────────────────
 */

import React, { useEffect, useState } from 'react';
import { Sparkles } from 'lucide-react';

interface HeroProps {
  onShopClick: () => void;
  onExploreFeatured: () => void;
}

// Imágenes que se deslizan en el banner principal
const HERO_SLIDES = [
  {
    src: '/assets/images/hero_luxury_perfume_1793299734093.jpg',
    alt: "D' Victor Fragancias - Aeterna Private Reserve",
  },
  {
    src: '/assets/images/campaign_tobacco_gold_1793303201731.jpg',
    alt: "Bortnikoff Tabac Doré - Campaña D' Victor Fragancias",
  },
  {
    src: '/assets/images/campaign_azure_niche_1793303200950.jpg',
    alt: "M.Micallef DésirToxic - Campaña D' Victor Fragancias",
  },
  {
    src: '/assets/images/perfume_creed_aventus_1793299734804.jpg',
    alt: "Creed Aventus Imperial - Colección Privada D' Victor",
  },
  {
    src: '/assets/images/perfume_baccarat_rouge_1793299737267.jpg',
    alt: "Maison Francis Kurkdjian Baccarat Rouge 540 Extrait",
  },
] as const;

// Cada cuánto avanza solo el slider (en milisegundos)
const HERO_SLIDE_INTERVAL_MS = 7000;

// La primera imagen se repite al final para que el bucle sea continuo
const LOOP_CLONE_INDEX = HERO_SLIDES.length;
const RENDERED_SLIDES = [...HERO_SLIDES, HERO_SLIDES[0]];

export const Hero: React.FC<HeroProps> = ({ onShopClick, onExploreFeatured }) => {
  const [position, setPosition] = useState(0);
  const [skipTransition, setSkipTransition] = useState(false);

  const activeIndex = position % HERO_SLIDES.length;

  // Avance automático continuo (siempre activo, sin pausas)
  useEffect(() => {
    const intervalId = window.setInterval(() => {
      setPosition((prev) => (prev >= LOOP_CLONE_INDEX ? prev : prev + 1));
    }, HERO_SLIDE_INTERVAL_MS);

    return () => window.clearInterval(intervalId);
  }, []);

  // Al terminar la transición del clon, saltamos al inicio sin animación
  const handleTransitionEnd = () => {
    if (position === LOOP_CLONE_INDEX) {
      setSkipTransition(true);
      setPosition(0);
    }
  };

  // Respaldo por si el navegador no dispara transitionend (pestaña en segundo
  // plano, animaciones desactivadas, etc.): el slider nunca se queda trabado.
  useEffect(() => {
    if (position !== LOOP_CLONE_INDEX) return;

    const timeoutId = window.setTimeout(() => {
      setSkipTransition(true);
      setPosition(0);
    }, 2100);

    return () => window.clearTimeout(timeoutId);
  }, [position]);

  // Reactivamos la transición después de pintar el salto invisible
  useEffect(() => {
    if (!skipTransition) return;

    const timeoutId = window.setTimeout(() => setSkipTransition(false), 60);
    return () => window.clearTimeout(timeoutId);
  }, [skipTransition]);

  const goToSlide = (index: number) => {
    setPosition(index);
  };

  return (
    <section className="relative overflow-hidden bg-[#050505]">
      <div className="relative w-full min-h-[480px] h-[520px] sm:h-[600px] lg:h-[680px] bg-[#080808] flex items-center">
        {/* Slider de imágenes de fondo: cada imagen entra fluidamente desde la derecha */}
        <div className="absolute inset-0 overflow-hidden" aria-hidden="true">
          <div
            className={`hero-slides-track h-full ${skipTransition ? 'no-transition' : ''}`}
            style={{ transform: `translate3d(-${position * 100}%, 0, 0)` }}
            onTransitionEnd={handleTransitionEnd}
          >
            {RENDERED_SLIDES.map((slide, index) => (
              <div
                key={`${slide.src}-${index}`}
                className="hero-slide relative h-full w-full shrink-0"
              >
                <img
                  src={slide.src}
                  alt={slide.alt}
                  className={`hero-slide-image absolute inset-0 w-full h-full object-cover object-center ${
                    index % HERO_SLIDES.length === activeIndex ? 'is-active' : ''
                  }`}
                  referrerPolicy="no-referrer"
                  loading="eager"
                  draggable={false}
                />
              </div>
            ))}
          </div>
        </div>

        {/* Scrim con animación de entrada */}
        <div className="hero-scrim-anim absolute inset-0 bg-gradient-to-r from-black/85 via-black/50 to-transparent" />
        <div className="pointer-events-none absolute inset-x-0 bottom-0 h-32 bg-gradient-to-t from-black/60 to-transparent" />

        {/* Contenido del Hero con animaciones en cascada (stagger) */}
        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
          <div className="max-w-xl text-left">
            {/* Pretítulo */}
            <span className="hero-line-1 text-[11px] sm:text-xs uppercase tracking-[0.3em] font-sans font-semibold text-[#D4AF37] block mb-3">
              D' VICTOR PRIVATE RESERVE
            </span>

            {/* Título principal */}
            <h1 className="hero-line-2 font-serif text-4xl sm:text-5xl lg:text-7xl font-normal text-[#FAF7F0] tracking-tight leading-[1.05] mb-3">
              AETERNA <span className="italic font-light">1744</span>
            </h1>

            {/* Notas olfativas */}
            <p className="hero-line-3 font-sans text-sm sm:text-base text-[#F5E6B3] tracking-wider mb-8 font-light">
              Azafrán Persa. Oud de Assam. Ámbar Fundido.
            </p>

            {/* Botones de acción */}
            <div className="hero-btns flex flex-col sm:flex-row items-stretch sm:items-center gap-3 sm:gap-4 w-full sm:w-auto">
              <button
                onClick={onExploreFeatured}
                className="btn-impact w-full sm:w-auto text-center px-6 sm:px-8 py-3 sm:py-3.5 bg-transparent border border-[#FAF7F0] hover:bg-[#FAF7F0] hover:text-[#050505] text-[#FAF7F0] font-sans text-[11px] sm:text-xs uppercase tracking-[0.2em] font-medium transition-all duration-300 cursor-pointer"
              >
                Descubrir AETERNA 1744
              </button>

              <button
                onClick={onShopClick}
                className="btn-impact w-full sm:w-auto text-center px-6 py-3 sm:py-3.5 bg-[#D4AF37] hover:bg-[#FFD76A] text-[#050505] font-sans text-[11px] sm:text-xs uppercase tracking-[0.2em] font-semibold transition-all duration-300 cursor-pointer shadow-[0_0_30px_-5px_rgba(212,175,55,0.5)]"
              >
                Explorar Catálogo
              </button>
            </div>
          </div>
        </div>

        {/* Indicadores del slider */}
        <div className="hero-slide-dots absolute bottom-4 right-4 sm:bottom-7 sm:right-8 z-20 flex items-center gap-1.5 sm:gap-2">
          {HERO_SLIDES.map((slide, index) => (
            <button
              key={slide.src}
              type="button"
              onClick={() => goToSlide(index)}
              aria-label={`Ir a la imagen ${index + 1} de ${HERO_SLIDES.length}`}
              aria-current={index === activeIndex}
              className={`hero-slide-dot ${index === activeIndex ? 'is-active' : ''}`}
            />
          ))}
        </div>
      </div>

      {/* Trust Mini-Bar con animación de entrada */}
      <div className="hero-trust border-y border-[#1a1a1a] bg-[#080808] py-3 text-xs text-[#B8B8B8] font-sans">
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
            <span>Atención Personalizada &amp; WhatsApp VIP</span>
          </div>
        </div>
      </div>
    </section>
  );
};
