/**
 * ─────────────────────────────────────────────────────────────────────────────
 * ARCHIVO: Frontend/src/components/PerfumeCarousel.tsx
 * QUÉ ES: Carrusel auto-scrolling continuo de lujo responsive adaptado a cualquier
 *         dispositivo con sistema de Scroll Reveal mediante Intersection Observer.
 *         Animación fluida de fade-in + slide-up al entrar al viewport y
 *         fade-out + slide-down al salir, con timing 0.6s ease-out y stagger escalonado.
 *         Soporte para arrastre con el mouse (inercia/momentum) y gestos táctiles.
 * DÓNDE SE VE: Inicio → bloques 2 ("Nuevas Llegadas") y 4 ("Los Más Vendidos").
 * SE RENDERIZA DESDE: App.tsx (dos veces, con distinto título y `isHot`).
 * ─────────────────────────────────────────────────────────────────────────────
 */

import React, { useRef, useState, useEffect } from 'react';
import { Star, Flame, Eye, ShoppingBag } from 'lucide-react';
import { Perfume } from '../types';
import { Reveal } from './Reveal';

interface PerfumeCarouselProps {
  title: string;
  subtitle?: string;
  perfumes: Perfume[];
  onSelectPerfume: (perfume: Perfume) => void;
  onAddToCart: (perfume: Perfume, sizeMl: number) => void;
  onSeeMore?: () => void;
  isHot?: boolean;
  enableScrollReveal?: boolean;
}

// ── COMPONENTE SCROLL REVEAL (INTERSECTION OBSERVER) ────────────────────────
// Detecta la visibilidad en el viewport. Al entrar aplica fade-in + slide-up
// con stagger; al salir aplica fade-out + slide-down (0.6s ease-out).
interface ScrollRevealCardProps {
  children: React.ReactNode;
  staggerIndex: number;
  enabled: boolean;
}

const ScrollRevealCard: React.FC<ScrollRevealCardProps> = ({
  children,
  staggerIndex,
  enabled,
}) => {
  const [isVisible, setIsVisible] = useState(!enabled);
  const cardRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!enabled) {
      setIsVisible(true);
      return;
    }

    const element = cardRef.current;
    if (!element) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          // Detecta entrada (true) y salida (false) del viewport
          setIsVisible(entry.isIntersecting);
        });
      },
      {
        root: null, // viewport de la pantalla
        threshold: 0.1, // Se dispara con 10% de visibilidad
        rootMargin: '0px',
      }
    );

    observer.observe(element);

    return () => {
      observer.disconnect();
    };
  }, [enabled]);

  if (!enabled) {
    return <>{children}</>;
  }

  // Stagger escalonado de 0.1s entre tarjetas consecutivas (ciclo de hasta 6 tarjetas)
  const staggerDelay = (staggerIndex % 6) * 0.1;

  return (
    <div
      ref={cardRef}
      style={{
        opacity: isVisible ? 1 : 0,
        // Al entrar: slide-up a translateY(0). Al salir: slide-down a translateY(30px)
        transform: isVisible ? 'translateY(0)' : 'translateY(30px)',
        // Animación suave de 0.6s ease-out
        transition: 'opacity 0.6s ease-out, transform 0.6s ease-out',
        // Escalonamiento (stagger) al aparecer, salida inmediata y suave al salir
        transitionDelay: isVisible ? `${staggerDelay}s` : '0s',
        willChange: 'opacity, transform',
      }}
      className="h-full w-full flex flex-col justify-between"
    >
      {children}
    </div>
  );
};

export const PerfumeCarousel: React.FC<PerfumeCarouselProps> = ({
  title,
  subtitle,
  perfumes,
  onSelectPerfume,
  onAddToCart,
  onSeeMore,
  isHot = false,
  enableScrollReveal,
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);

  // Activamos el scroll reveal si se solicita explícitamente o si es la sección "Nuevas Llegadas"
  const isRevealActive =
    enableScrollReveal !== undefined
      ? enableScrollReveal
      : title.toLowerCase().includes('llegadas');

  // Multiplicamos los items para asegurar longitud en monitores Ultra-Wide (4K / 3840px)
  const repeatCount = perfumes.length < 6 ? 4 : 2;
  const displayPerfumes = Array.from({ length: repeatCount }, () => perfumes).flat();

  // Estados y referencias de control de física e inercia
  const [isDragging, setIsDragging] = useState(false);
  const isPointerDownRef = useRef(false);
  const pointerTypeRef = useRef<string>('mouse');
  const isHoveredRef = useRef(false);
  const isDraggingRef = useRef(false);

  const startXRef = useRef(0);
  const startYRef = useRef(0);
  const isHorizontalScrollRef = useRef<boolean | null>(null);

  const lastXRef = useRef(0);
  const lastTimeRef = useRef(0);
  const currentXRef = useRef(0);
  const velocityRef = useRef(0); // píxeles por milisegundo

  useEffect(() => {
    let animationFrameId: number;
    let lastTimestamp = performance.now();

    const loop = (timestamp: number) => {
      const dt = Math.min((timestamp - lastTimestamp) / 1000, 0.1);
      lastTimestamp = timestamp;

      const track = trackRef.current;
      if (track) {
        const totalWidth = track.scrollWidth;
        const cycleWidth = totalWidth / repeatCount;

        if (cycleWidth > 0) {
          if (!isPointerDownRef.current) {
            // Inercia física al soltar el arrastre o tras usar la rueda
            if (Math.abs(velocityRef.current) > 0.005) {
              currentXRef.current += velocityRef.current * dt * 1000;
              velocityRef.current *= Math.pow(0.92, dt * 60);
            } else {
              velocityRef.current = 0;
              // Auto-scroll constante sólo si no se está haciendo hover con mouse
              if (!isHoveredRef.current) {
                const baseSpeed = cycleWidth / 20; // 20s por ciclo completo
                currentXRef.current -= baseSpeed * dt;
              }
            }

            // Loop infinito matemático continuo
            while (currentXRef.current <= -cycleWidth) {
              currentXRef.current += cycleWidth;
            }
            while (currentXRef.current > 0) {
              currentXRef.current -= cycleWidth;
            }

            track.style.transform = `translate3d(${currentXRef.current}px, 0, 0)`;
          }
        }
      }

      animationFrameId = requestAnimationFrame(loop);
    };

    animationFrameId = requestAnimationFrame(loop);

    return () => {
      cancelAnimationFrame(animationFrameId);
    };
  }, [repeatCount]);

  // Manejo de eventos unificados (Mouse, Touch, Pen, Trackpad)
  const handlePointerDown = (e: React.PointerEvent) => {
    if (e.button !== 0 && e.pointerType === 'mouse') return;
    if (!trackRef.current) return;

    pointerTypeRef.current = e.pointerType;
    isPointerDownRef.current = true;
    isDraggingRef.current = false;
    isHorizontalScrollRef.current = null;

    startXRef.current = e.clientX;
    startYRef.current = e.clientY;
    lastXRef.current = e.clientX;
    lastTimeRef.current = performance.now();
    velocityRef.current = 0;

    try {
      (e.currentTarget as HTMLElement).setPointerCapture(e.pointerId);
    } catch {
      // Ignorar si el navegador no soporta setPointerCapture
    }
  };

  const handlePointerMove = (e: React.PointerEvent) => {
    if (!isPointerDownRef.current || !trackRef.current) return;

    const deltaX = e.clientX - startXRef.current;
    const deltaY = e.clientY - startYRef.current;

    if (isHorizontalScrollRef.current === null) {
      if (Math.abs(deltaX) > 6 || Math.abs(deltaY) > 6) {
        isHorizontalScrollRef.current = Math.abs(deltaX) >= Math.abs(deltaY);
      }
    }

    if (isHorizontalScrollRef.current === false && pointerTypeRef.current === 'touch') {
      return;
    }

    if (!isDraggingRef.current && Math.abs(deltaX) > 4) {
      isDraggingRef.current = true;
      setIsDragging(true);
    }

    if (isDraggingRef.current) {
      const now = performance.now();
      const dt = now - lastTimeRef.current;
      const stepDelta = e.clientX - lastXRef.current;

      if (dt > 0) {
        const instantVelocity = stepDelta / dt;
        velocityRef.current = velocityRef.current * 0.35 + instantVelocity * 0.65;
      }

      lastXRef.current = e.clientX;
      lastTimeRef.current = now;

      const totalWidth = trackRef.current.scrollWidth;
      const cycleWidth = totalWidth / repeatCount;

      currentXRef.current += stepDelta;

      if (cycleWidth > 0) {
        while (currentXRef.current <= -cycleWidth) {
          currentXRef.current += cycleWidth;
        }
        while (currentXRef.current > 0) {
          currentXRef.current -= cycleWidth;
        }
      }

      trackRef.current.style.transform = `translate3d(${currentXRef.current}px, 0, 0)`;
    }
  };

  const handlePointerUp = (e: React.PointerEvent) => {
    if (!isPointerDownRef.current) return;
    isPointerDownRef.current = false;

    try {
      (e.currentTarget as HTMLElement).releasePointerCapture(e.pointerId);
    } catch {
      // Ignorar
    }

    if (pointerTypeRef.current === 'touch') {
      isHoveredRef.current = false;
    }

    const maxVelocity = 2.2;
    velocityRef.current = Math.max(-maxVelocity, Math.min(maxVelocity, velocityRef.current));

    setTimeout(() => {
      isDraggingRef.current = false;
      setIsDragging(false);
      isHorizontalScrollRef.current = null;
    }, 60);
  };

  const handleWheel = (e: React.WheelEvent) => {
    const delta = Math.abs(e.deltaX) > Math.abs(e.deltaY) ? e.deltaX : e.deltaY;
    if (Math.abs(delta) < 2) return;
    velocityRef.current = -delta * 0.012;
  };

  const renderCard = (perfume: Perfume, uniqueKey: string, index: number) => {
    const minPrice = perfume.sizes[0].priceDOP;
    const maxPrice = perfume.sizes[perfume.sizes.length - 1].priceDOP;
    const priceText =
      perfume.sizes.length > 1
        ? `RD$ ${minPrice.toLocaleString()} - RD$ ${maxPrice.toLocaleString()}`
        : `RD$ ${minPrice.toLocaleString()}`;

    return (
      <div
        key={uniqueKey}
        onClick={() => {
          if (isDraggingRef.current) return;
          onSelectPerfume(perfume);
        }}
        className="w-[150px] min-[380px]:w-[175px] sm:w-[215px] md:w-[240px] lg:w-[250px] shrink-0 group flex flex-col justify-between text-center select-none cursor-pointer"
      >
        <ScrollRevealCard staggerIndex={index} enabled={isRevealActive}>
          {/* Contenedor de la botella con aspect ratio adaptativo */}
          <div className="relative aspect-[3/4] bg-[#0c0c0c] rounded-md overflow-hidden flex items-center justify-center p-2.5 sm:p-3 border border-[#1f1f1f] hover:border-[#D4AF37]/50 transition-all duration-300">
            <img
              src={perfume.image}
              alt={perfume.name}
              draggable={false}
              className="w-full h-full object-cover rounded object-center transition-transform duration-500 group-hover:scale-105 pointer-events-none"
              referrerPolicy="no-referrer"
              loading="lazy"
            />

            {/* Badges adaptables a pantallas pequeñas */}
            {isHot ? (
              <div className="absolute top-2 right-2 text-[#ef4444] drop-shadow-[0_2px_4px_rgba(0,0,0,0.8)] pointer-events-none">
                <Flame className="w-3.5 h-3.5 sm:w-4 sm:h-4 fill-current animate-pulse" />
              </div>
            ) : (
              <div className="absolute top-1.5 right-1.5 sm:top-2 sm:right-2 text-[8px] sm:text-[9px] uppercase font-sans tracking-widest font-semibold px-1.5 py-0.5 bg-[#050505]/90 text-[#D4AF37] border border-[#D4AF37]/40 rounded pointer-events-none">
                24h RD
              </div>
            )}

            {/* Acciones rápidas (en desktop hover, en touch accesibles con un tap) */}
            <div className="absolute inset-x-0 bottom-0 py-2 bg-gradient-to-t from-black via-black/80 to-transparent hidden sm:flex items-center justify-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  if (isDraggingRef.current) return;
                  onAddToCart(perfume, perfume.sizes[0].ml);
                }}
                className="px-2.5 py-1 sm:px-3 sm:py-1 bg-[#D4AF37] hover:bg-[#FFD76A] text-[#050505] rounded text-[10px] sm:text-[11px] font-sans font-semibold flex items-center gap-1 shadow-md cursor-pointer"
              >
                <ShoppingBag className="w-3 h-3" />
                <span>Añadir</span>
              </button>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  if (isDraggingRef.current) return;
                  onSelectPerfume(perfume);
                }}
                className="p-1 bg-[#1a1a1a] hover:bg-[#252525] text-[#FAF7F0] rounded cursor-pointer"
                title="Ver Detalles"
              >
                <Eye className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>

          {/* Metadatos tipográficos responsivos */}
          <div className="pt-2.5 sm:pt-3 flex flex-col items-center pointer-events-none px-1">
            <h3 className="font-serif text-xs sm:text-sm md:text-base font-semibold text-[#FAF7F0] group-hover:text-[#F5E6B3] transition-colors leading-snug line-clamp-1">
              {perfume.name}
            </h3>
            <span className="text-[9px] sm:text-[10px] uppercase font-sans tracking-widest text-[#B8B8B8] mt-0.5 truncate max-w-full">
              por <strong className="text-[#D4AF37] font-medium">{perfume.house}</strong>
            </span>
            <span className="text-[10px] sm:text-[11px] text-[#888] font-sans mt-0.5">
              {perfume.gender} · {perfume.concentration}
            </span>

            {/* Calificación en estrellas */}
            <div className="flex items-center gap-0.5 mt-1 text-[#FFD76A]">
              {[...Array(5)].map((_, i) => (
                <Star
                  key={i}
                  className={`w-2 h-2 sm:w-2.5 sm:h-2.5 ${
                    i < Math.floor(perfume.rating) ? 'fill-current' : 'opacity-40'
                  }`}
                />
              ))}
              <span className="text-[9px] sm:text-[10px] text-[#777] font-sans ml-1">
                ({perfume.reviewsCount})
              </span>
            </div>

            {/* Precio adaptativo en RD$ */}
            <div className="mt-1 font-mono text-[11px] sm:text-xs md:text-sm font-semibold text-[#FAF7F0] tabular-nums">
              {priceText}
            </div>

            {/* Indicador de presentaciones */}
            <div className="mt-1 flex items-center gap-1.5 text-[9px] sm:text-[10px] text-[#B8B8B8]">
              <span>{perfume.sizes.length} Presentaciones</span>
              <span className="w-1.5 h-1.5 rounded-full bg-[#D4AF37]" />
            </div>
          </div>
        </ScrollRevealCard>
      </div>
    );
  };

  return (
    <section className="py-8 sm:py-10 bg-[#050505] overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Cabecera de sección responsive */}
        <Reveal className="relative flex items-center justify-between mb-6 sm:mb-8">
          <div className="absolute inset-0 flex items-center pointer-events-none" aria-hidden="true">
            <div className="w-full border-t border-[#222]" />
          </div>

          <div className="relative bg-[#050505] pr-3 sm:pr-4 flex items-center gap-2">
            <h2 className="font-serif text-lg sm:text-xl md:text-2xl text-[#FAF7F0] font-normal tracking-wide">
              {title}
            </h2>
            {subtitle && (
              <span className="text-[11px] sm:text-xs text-[#B8B8B8] font-sans hidden sm:inline">
                · {subtitle}
              </span>
            )}
          </div>

          <div className="relative bg-[#050505] pl-3 sm:pl-4 flex items-center gap-4">
            {onSeeMore && (
              <button
                onClick={onSeeMore}
                className="text-[11px] sm:text-xs uppercase tracking-wider font-sans text-[#B8B8B8] hover:text-[#D4AF37] transition-colors underline-offset-4 hover:underline cursor-pointer"
              >
                Ver Todo
              </button>
            )}
          </div>
        </Reveal>

        {/* Contenedor del carrusel con soporte touch-pan-y para móviles y drag para desktop */}
        <div
          ref={containerRef}
          onPointerDown={handlePointerDown}
          onPointerMove={handlePointerMove}
          onPointerUp={handlePointerUp}
          onPointerCancel={handlePointerUp}
          onMouseEnter={() => {
            if (typeof window !== 'undefined' && window.matchMedia('(hover: hover)').matches) {
              isHoveredRef.current = true;
            }
          }}
          onMouseLeave={() => {
            isHoveredRef.current = false;
          }}
          onWheel={handleWheel}
          style={{ touchAction: 'pan-y' }}
          className={`carousel-container overflow-hidden w-full pb-4 pt-1 select-none touch-pan-y ${
            isDragging ? 'cursor-grabbing' : 'cursor-grab'
          }`}
        >
          <div
            ref={trackRef}
            className="carousel-track flex gap-3.5 sm:gap-5 md:gap-6 pr-3.5 sm:pr-5 md:pr-6"
          >
            {displayPerfumes.map((perfume, index) =>
              renderCard(perfume, `${perfume.id}-${index}`, index)
            )}
          </div>
        </div>
      </div>
    </section>
  );
};
