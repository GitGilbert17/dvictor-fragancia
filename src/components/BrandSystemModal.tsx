/**
 * ─────────────────────────────────────────────────────────────────────────────
 * ARCHIVO: src/components/BrandSystemModal.tsx
 * QUÉ ES: Manual de identidad visual: logos, paleta, tipografías y reglas.
 * DÓNDE SE VE: Modal al pulsar "Logos" (Header) o "Identidad de Marca".
 * SE RENDERIZA DESDE: App.tsx (<BrandSystemModal ... />).
 * PROPS: isOpen, onClose.
 * QUÉ TOCAR:
 *   - Colores oficiales → array `colorPalette`.
 *   - Secciones del modal → estado `activeSection`.
 *   - Textos de tipografía / reglas → bloques "Section 3" y "Section 4".
 *   - Copiar HEX al portapapeles → `handleCopyHex`.
 * ─────────────────────────────────────────────────────────────────────────────
 */

import React, { useState } from 'react';
import { X, Copy, Check, Sparkles, Layers, Palette, Type, Shield } from 'lucide-react';
import { BrandLogo } from './BrandLogo';

interface BrandSystemModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const BrandSystemModal: React.FC<BrandSystemModalProps> = ({ isOpen, onClose }) => {
  const [copiedHex, setCopiedHex] = useState<string | null>(null);
  const [activeSection, setActiveSection] = useState<'logos' | 'colores' | 'tipografia' | 'reglas'>('logos');

  if (!isOpen) return null;

  // ── PALETA OFICIAL DE MARCA ────────────────────────────────────────────────
  // Se muestra en la sección "Paleta de Color" y se copia con `handleCopyHex`.
  const colorPalette = [
    {
      name: 'Negro Obsidiana',
      hex: '#050505',
      role: 'Base principal de la web y empaques de lujo',
      category: 'Base Principal',
      textColor: '#FAF7F0',
    },
    {
      name: 'Dorado Principal',
      hex: '#D4AF37',
      role: 'Acentos de alto valor, logotipo, botones primarios y sellos',
      category: 'Identidad de Marca',
      textColor: '#050505',
    },
    {
      name: 'Negro Carbón',
      hex: '#111111',
      role: 'Superficies estructurales, tarjetas de perfumes y contenedores',
      category: 'Superficie',
      textColor: '#FAF7F0',
    },
    {
      name: 'Champán Claro',
      hex: '#F5E6B3',
      role: 'Citas líricas, frases de elegancia y fondos de etiquetas claras',
      category: 'Acento Suave',
      textColor: '#050505',
    },
    {
      name: 'Dorado Luminoso',
      hex: '#FFD76A',
      role: 'Reflejos, bordes activos y pequeños destellos sutiles',
      category: 'Detalle',
      textColor: '#050505',
    },
    {
      name: 'Gris Elegante',
      hex: '#B8B8B8',
      role: 'Descripciones olfativas, notas secundarias y metadatos',
      category: 'Texto Secundario',
      textColor: '#050505',
    },
    {
      name: 'Blanco Cálido',
      hex: '#FAF7F0',
      role: 'Textos de alto contraste y títulos principales para máxima lectura',
      category: 'Lectura',
      textColor: '#050505',
    },
  ];

  const handleCopyHex = (hex: string) => {
    navigator.clipboard.writeText(hex);
    setCopiedHex(hex);
    setTimeout(() => setCopiedHex(null), 2000);
  };

  return (
    <div
      role="dialog"
      aria-modal="true"
      className="fixed inset-0 z-50 overflow-y-auto bg-black/90 backdrop-blur-md flex items-center justify-center p-3 sm:p-6"
    >
      <div className="fixed inset-0 -z-10" onClick={onClose} />

      <div className="relative bg-[#0b0b0b] border border-[#D4AF37]/40 rounded-xl max-w-4xl w-full p-6 sm:p-8 shadow-[0_20px_70px_rgba(212,175,55,0.15)] max-h-[92vh] overflow-y-auto animate-in zoom-in-95 duration-200">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 text-[#B8B8B8] hover:text-[#FAF7F0] bg-[#050505] rounded-full border border-[#262626] transition-colors"
          aria-label="Cerrar guía del sistema"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#D4AF37]/10 border border-[#D4AF37]/30 text-[#D4AF37] text-[10px] uppercase font-sans tracking-widest font-semibold mb-2">
            <Shield className="w-3.5 h-3.5 text-[#D4AF37]" />
            <span>Manual de Identidad Visual Oficial</span>
          </div>
          <h2 className="font-serif text-3xl sm:text-4xl text-[#FAF7F0] font-normal">
            D’ Victor Fragancias
          </h2>
          <p className="font-serif italic text-base text-[#F5E6B3] mt-1">
            «Logos para el Sistema & Arquitectura de Marca»
          </p>

          {/* Sub Navigation */}
          <div className="flex flex-wrap items-center justify-center gap-2 mt-6">
            <button
              onClick={() => setActiveSection('logos')}
              className={`px-3.5 py-1.5 rounded-md text-xs font-sans transition-colors cursor-pointer flex items-center gap-1.5 ${
                activeSection === 'logos'
                  ? 'bg-[#D4AF37] text-[#050505] font-semibold'
                  : 'bg-[#141414] text-[#B8B8B8] hover:text-[#FAF7F0]'
              }`}
            >
              <Layers className="w-3.5 h-3.5" />
              <span>Logos del Sistema</span>
            </button>
            <button
              onClick={() => setActiveSection('colores')}
              className={`px-3.5 py-1.5 rounded-md text-xs font-sans transition-colors cursor-pointer flex items-center gap-1.5 ${
                activeSection === 'colores'
                  ? 'bg-[#D4AF37] text-[#050505] font-semibold'
                  : 'bg-[#141414] text-[#B8B8B8] hover:text-[#FAF7F0]'
              }`}
            >
              <Palette className="w-3.5 h-3.5" />
              <span>Paleta de Color</span>
            </button>
            <button
              onClick={() => setActiveSection('tipografia')}
              className={`px-3.5 py-1.5 rounded-md text-xs font-sans transition-colors cursor-pointer flex items-center gap-1.5 ${
                activeSection === 'tipografia'
                  ? 'bg-[#D4AF37] text-[#050505] font-semibold'
                  : 'bg-[#141414] text-[#B8B8B8] hover:text-[#FAF7F0]'
              }`}
            >
              <Type className="w-3.5 h-3.5" />
              <span>Tipografías</span>
            </button>
            <button
              onClick={() => setActiveSection('reglas')}
              className={`px-3.5 py-1.5 rounded-md text-xs font-sans transition-colors cursor-pointer flex items-center gap-1.5 ${
                activeSection === 'reglas'
                  ? 'bg-[#D4AF37] text-[#050505] font-semibold'
                  : 'bg-[#141414] text-[#B8B8B8] hover:text-[#FAF7F0]'
              }`}
            >
              <Sparkles className="w-3.5 h-3.5" />
              <span>Reglas de Diseño</span>
            </button>
          </div>
        </div>

        {/* Section 1: Logos para el Sistema */}
        {activeSection === 'logos' && (
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Official Horizontal Logo */}
              <div className="p-6 bg-[#050505] rounded-xl border border-[#262626] flex flex-col items-center justify-between text-center relative group">
                <div className="w-full flex justify-between items-center text-[10px] uppercase tracking-wider text-[#D4AF37] mb-4">
                  <span>Versión Horizontal Oficial</span>
                  <span>Header / Web</span>
                </div>
                <div className="my-6 py-2 px-4 bg-[#080808] rounded-lg border border-[#1f1f1f] w-full flex items-center justify-center">
                  <img
                    src="/assets/logos/Logo2.png"
                    alt="Logo Oficial Horizontal"
                    className="max-h-24 w-auto object-contain drop-shadow-[0_2px_10px_rgba(212,175,55,0.3)]"
                  />
                </div>
                <div className="w-full text-left pt-4 border-t border-[#1f1f1f] text-[11px] text-[#B8B8B8]">
                  <strong className="text-[#FAF7F0] block mb-0.5">Logo Horizontal (Logo2.png)</strong>
                  Frasco dorado con tipografía «VICTOR FRAGANCIAS» para la barra de navegación, facturación proforma y membretes.
                </div>
              </div>

              {/* Official Square / Emblem Logo */}
              <div className="p-6 bg-[#050505] rounded-xl border border-[#262626] flex flex-col items-center justify-between text-center">
                <div className="w-full flex justify-between items-center text-[10px] uppercase tracking-wider text-[#D4AF37] mb-4">
                  <span>Versión Emblema Oficial</span>
                  <span>Packaging / Hero</span>
                </div>
                <div className="my-4 py-2 px-4 bg-[#080808] rounded-lg border border-[#1f1f1f] w-full flex items-center justify-center">
                  <img
                    src="/assets/logos/Logo.png"
                    alt="Logo Oficial Emblema"
                    className="max-h-36 w-auto object-contain drop-shadow-[0_2px_10px_rgba(212,175,55,0.3)]"
                  />
                </div>
                <div className="w-full text-left pt-4 border-t border-[#1f1f1f] text-[11px] text-[#B8B8B8]">
                  <strong className="text-[#FAF7F0] block mb-0.5">Emblema Central (Logo.png)</strong>
                  Frasco de perfume con monograma V y laurel dorado para empaques de lujo, sellos de lacre y certificados.
                </div>
              </div>
            </div>

            {/* Inverted Champagne preview on Carbon */}
            <div className="p-5 bg-[#111111] rounded-xl border border-[#D4AF37]/30 flex flex-col sm:flex-row items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                <BrandLogo variant="monogram" size="sm" />
                <div>
                  <h4 className="font-serif text-[#FAF7F0] text-base font-semibold">
                    Monograma en Champán Claro sobre Negro Carbón
                  </h4>
                  <p className="text-xs text-[#B8B8B8]">
                    Aplicación para tarjetas de agradecimiento y bolsitas de terciopelo.
                  </p>
                </div>
              </div>
              <div className="text-xs text-[#D4AF37] font-mono border border-[#D4AF37]/40 px-3 py-1.5 rounded">
                Archivos Oficiales Cargados
              </div>
            </div>
          </div>
        )}

        {/* Section 2: Paleta de Color */}
        {activeSection === 'colores' && (
          <div className="space-y-4">
            <p className="text-xs text-[#B8B8B8]">
              Haz clic en cualquier muestra de color para copiar su código hexadecimal oficial:
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
              {colorPalette.map((col) => (
                <button
                  key={col.hex}
                  onClick={() => handleCopyHex(col.hex)}
                  className="p-3.5 rounded-lg border border-[#262626] hover:border-[#D4AF37] bg-[#050505] flex items-center justify-between text-left transition-all group cursor-pointer"
                >
                  <div className="flex items-center gap-3">
                    <div
                      className="w-10 h-10 rounded-md border border-[#333] shadow-inner shrink-0"
                      style={{ backgroundColor: col.hex }}
                    />
                    <div>
                      <span className="text-[10px] text-[#D4AF37] uppercase tracking-wider block font-sans">
                        {col.category}
                      </span>
                      <strong className="font-serif text-sm text-[#FAF7F0] block">
                        {col.name}
                      </strong>
                      <span className="font-mono text-xs text-[#FAF7F0]/80">
                        {col.hex}
                      </span>
                    </div>
                  </div>

                  <div className="text-[#B8B8B8] group-hover:text-[#D4AF37]">
                    {copiedHex === col.hex ? (
                      <Check className="w-4 h-4 text-[#22c55e]" />
                    ) : (
                      <Copy className="w-4 h-4 opacity-50 group-hover:opacity-100" />
                    )}
                  </div>
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Section 3: Tipografía */}
        {activeSection === 'tipografia' && (
          <div className="space-y-6">
            <div className="p-6 bg-[#050505] rounded-xl border border-[#262626] space-y-3">
              <div className="flex items-center justify-between text-xs text-[#D4AF37]">
                <span className="uppercase tracking-widest font-semibold font-sans">
                  Tipografía con Serifa (Editorial & Lujo)
                </span>
                <span className="font-mono">Google Fonts: Cormorant Garamond</span>
              </div>
              <h3 className="font-serif text-3xl sm:text-4xl text-[#FAF7F0] font-normal">
                Cormorant Garamond
              </h3>
              <p className="font-serif italic text-xl text-[#F5E6B3]">
                «La esencia de la elegancia.»
              </p>
              <p className="text-xs text-[#B8B8B8] leading-relaxed pt-2 border-t border-[#1f1f1f]">
                Uso normativo: Para titulares, nombres de perfumes, citas líricas y frases elegantes.
                Aporta nobleza, calidez aristocrática y distinción sin rigidez.
              </p>
            </div>

            <div className="p-6 bg-[#050505] rounded-xl border border-[#262626] space-y-3">
              <div className="flex items-center justify-between text-xs text-[#D4AF37]">
                <span className="uppercase tracking-widest font-semibold font-sans">
                  Tipografía Sin Serifa (Funcional & Comercial)
                </span>
                <span className="font-mono">Google Fonts: Montserrat</span>
              </div>
              <h3 className="font-sans text-2xl font-semibold text-[#FAF7F0] tracking-wider uppercase">
                DESCUBRE TU PRÓXIMA FRAGANCIA
              </h3>
              <div className="flex gap-4 text-xs font-mono text-[#D4AF37] tabular-nums">
                <span>RD$ 18,900</span>
                <span>·</span>
                <span>RD$ 24,500</span>
                <span>·</span>
                <span>100 ml / 3.4 FL. OZ.</span>
              </div>
              <p className="text-xs text-[#B8B8B8] leading-relaxed pt-2 border-t border-[#1f1f1f]">
                Uso normativo: Para menús de navegación, botones, precios en pesos dominicanos, selectores y descripciones legibles.
              </p>
            </div>
          </div>
        )}

        {/* Section 4: Reglas de Diseño */}
        {activeSection === 'reglas' && (
          <div className="p-6 bg-[#050505] rounded-xl border border-[#262626] space-y-4">
            <h3 className="font-serif text-2xl text-[#FAF7F0] font-normal">
              Regla de Oro del Sistema D’ Victor
            </h3>
            <blockquote className="p-4 rounded bg-[#111111] border-l-2 border-[#D4AF37] font-serif text-base sm:text-lg text-[#F5E6B3] italic">
              «Usa el negro como base, el dorado para destacar y el blanco cálido para facilitar la lectura. No pongas brillos dorados en absolutamente todo; el contraste hace que el lujo se perciba mejor.»
            </blockquote>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-4 text-xs">
              <div className="p-3 bg-[#111111] rounded border border-[#262626]">
                <span className="text-[#FAF7F0] font-semibold block mb-1">
                  1. Negro como Base (60%)
                </span>
                <p className="text-[#B8B8B8]">
                  Negro obsidiana (#050505) y negro carbón (#111111) proveen la profundidad teatral donde las botellas resplandecen.
                </p>
              </div>

              <div className="p-3 bg-[#111111] rounded border border-[#262626]">
                <span className="text-[#D4AF37] font-semibold block mb-1">
                  2. Dorado para Destacar (10-15%)
                </span>
                <p className="text-[#B8B8B8]">
                  Dorado principal (#D4AF37) y destellos (#FFD76A) concentrados únicamente en CTAs, monograma, precios y acentos clave.
                </p>
              </div>

              <div className="p-3 bg-[#111111] rounded border border-[#262626]">
                <span className="text-[#FAF7F0] font-semibold block mb-1">
                  3. Blanco Cálido para Lectura (25-30%)
                </span>
                <p className="text-[#B8B8B8]">
                  Blanco cálido (#FAF7F0) garantiza una legibilidad impecable en párrafos, títulos y notas olfativas sin deslumbrar.
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Modal Footer */}
        <div className="mt-8 pt-4 border-t border-[#262626] flex items-center justify-between text-xs text-[#B8B8B8]">
          <span>D’ Victor Fragancias · Manual de Identidad de Marca</span>
          <button
            onClick={onClose}
            className="px-4 py-2 bg-[#D4AF37] hover:bg-[#FFD76A] text-[#050505] rounded font-semibold transition-colors cursor-pointer"
          >
            Entendido
          </button>
        </div>
      </div>
    </div>
  );
};
