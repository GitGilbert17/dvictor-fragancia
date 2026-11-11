/**
 * ─────────────────────────────────────────────────────────────────────────────
 * ARCHIVO: Frontend/src/components/Reveal.tsx
 * QUÉ ES: Wrapper reutilizable de Scroll Reveal. Muestra su contenido con un
 *         fade-in + slide-up fluido al entrar al viewport y lo desvanece al
 *         salir, para que la información e imágenes aparezcan/desaparezcan
 *         mientras se hace scroll.
 * DÓNDE SE VE: Catálogo, footer, cabeceras de carruseles y cualquier bloque
 *              que se envuelva con <Reveal>.
 * PROPS:
 *   - direction: 'up' (sube desde abajo), 'left' o 'right'.
 *   - delay: segundos de retraso (stagger entre elementos).
 *   - once: si es true, solo anima la primera vez y no se vuelve a ocultar.
 *   - as: etiqueta HTML a renderizar (div por defecto).
 * ─────────────────────────────────────────────────────────────────────────────
 */

import React, { useEffect, useRef, useState } from 'react';

type RevealDirection = 'up' | 'left' | 'right';

interface RevealProps {
  children: React.ReactNode;
  as?: React.ElementType;
  direction?: RevealDirection;
  delay?: number;
  once?: boolean;
  threshold?: number;
  className?: string;
  style?: React.CSSProperties;
}

export const Reveal: React.FC<RevealProps> = ({
  children,
  as: Tag = 'div',
  direction = 'up',
  delay = 0,
  once = false,
  threshold = 0.12,
  className = '',
  style,
}) => {
  const ref = useRef<HTMLElement>(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const element = ref.current;
    if (!element) return;

    // Respaldo para navegadores sin IntersectionObserver
    if (typeof IntersectionObserver === 'undefined') {
      setIsVisible(true);
      return;
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          if (once) observer.disconnect();
        } else if (!once) {
          setIsVisible(false);
        }
      },
      {
        root: null,
        threshold,
        rootMargin: '0px 0px -40px 0px',
      }
    );

    observer.observe(element);
    return () => observer.disconnect();
  }, [once, threshold]);

  const hiddenClass =
    direction === 'left'
      ? 'reveal-left'
      : direction === 'right'
        ? 'reveal-right'
        : 'reveal-hidden';

  return (
    <Tag
      ref={ref}
      className={`${isVisible ? 'reveal-visible' : hiddenClass} ${className}`}
      style={{
        ...style,
        transitionDelay: isVisible ? `${delay}s` : '0s',
      }}
    >
      {children}
    </Tag>
  );
};
