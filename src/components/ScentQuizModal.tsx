/**
 * ─────────────────────────────────────────────────────────────────────────────
 * ARCHIVO: src/components/ScentQuizModal.tsx
 * QUÉ ES: "Asesor Olfativo": quiz de 3 preguntas que recomienda 3 perfumes.
 * DÓNDE SE VE: Modal al pulsar "Asesor Olfativo" en Header o Footer.
 * SE RENDERIZA DESDE: App.tsx (<ScentQuizModal ... />).
 * PROPS: isOpen, onClose, perfumes, onSelectPerfume, onAddToCart.
 * QUÉ TOCAR:
 *   - Preguntas y opciones → arrays dentro de cada `step` (1, 2 y 3).
 *   - Reglas de recomendación → constante `recommendedPerfumes`.
 *   - Fallback si no hay coincidencias → `finalResults`.
 *   - Resultado final → bloque "Step 4: Results".
 * ─────────────────────────────────────────────────────────────────────────────
 */

import React, { useState } from 'react';
import { X, Sparkles, ArrowRight, RotateCcw, Check, ShoppingBag, Eye } from 'lucide-react';
import { Perfume } from '../types';

interface ScentQuizModalProps {
  isOpen: boolean;
  onClose: () => void;
  perfumes: Perfume[];
  onSelectPerfume: (perfume: Perfume) => void;
  onAddToCart: (perfume: Perfume, sizeMl: number) => void;
}

export const ScentQuizModal: React.FC<ScentQuizModalProps> = ({
  isOpen,
  onClose,
  perfumes,
  onSelectPerfume,
  onAddToCart,
}) => {
  const [step, setStep] = useState(1);
  const [forWhom, setForWhom] = useState<string>('');
  const [occasion, setOccasion] = useState<string>('');
  const [scentProfile, setScentProfile] = useState<string>('');

  if (!isOpen) return null;

  const handleReset = () => {
    setStep(1);
    setForWhom('');
    setOccasion('');
    setScentProfile('');
  };

  // Recommendations calculated based on user answers
  // ── RECOMENDACIÓN DEL QUIZ ─────────────────────────────────────────────────
  // Filtra por género y familia olfativa según las respuestas. Si no hay
  // coincidencias, `finalResults` cae en los 3 primeros perfumes del catálogo.
  const recommendedPerfumes = perfumes.filter((p) => {
    // Gender compatibility
    if (forWhom === 'hombre' && p.gender === 'Mujer') return false;
    if (forWhom === 'mujer' && p.gender === 'Hombre') return false;

    // Profile match
    if (scentProfile === 'maderas' && p.family !== 'Amaderada' && p.family !== 'Cuero / Chipre') return false;
    if (scentProfile === 'dulce' && p.family !== 'Gourmand / Especiada' && p.family !== 'Oriental / Ámbar') return false;
    if (scentProfile === 'fresco' && p.family !== 'Cítrica / Fresca' && !p.topNotes.some(n => n.includes('Bergamota') || n.includes('Limón') || n.includes('Pera'))) return false;
    if (scentProfile === 'floral' && p.family !== 'Floral') return false;

    return true;
  }).slice(0, 3);

  // Fallback if strict filter yields 0
  const finalResults = recommendedPerfumes.length > 0 ? recommendedPerfumes : perfumes.slice(0, 3);

  return (
    <div
      role="dialog"
      aria-modal="true"
      className="fixed inset-0 z-50 overflow-y-auto bg-black/85 backdrop-blur-md flex items-center justify-center p-4 sm:p-6"
    >
      <div className="fixed inset-0 -z-10" onClick={onClose} />

      <div className="relative bg-[#111111] border border-[#262626] rounded-xl max-w-2xl w-full p-6 sm:p-8 shadow-2xl animate-in zoom-in-95 duration-200">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 text-[#B8B8B8] hover:text-[#FAF7F0] bg-[#050505] rounded-full border border-[#262626] transition-colors"
          aria-label="Cerrar test olfativo"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Header */}
        <div className="text-center mb-6">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#D4AF37]/10 border border-[#D4AF37]/30 text-[#D4AF37] text-[10px] uppercase font-sans tracking-widest font-semibold mb-2">
            <Sparkles className="w-3 h-3 text-[#FFD76A]" />
            <span>Asesor Olfativo Inteligente</span>
          </div>
          <h2 className="font-serif text-2xl sm:text-3xl text-[#FAF7F0] font-normal">
            Encuentra tu Fragancia de Firma
          </h2>
          <p className="text-xs text-[#B8B8B8] mt-1">
            Responde 3 preguntas y te mostraremos los perfumes que mejor complementan tu presencia y estilo de vida.
          </p>

          {/* Step indicator */}
          <div className="flex items-center justify-center gap-2 mt-4">
            {[1, 2, 3, 4].map((s) => (
              <div
                key={s}
                className={`h-1.5 rounded-full transition-all duration-300 ${
                  step >= s ? 'w-8 bg-[#D4AF37]' : 'w-4 bg-[#262626]'
                }`}
              />
            ))}
          </div>
        </div>

        {/* Step 1: ¿Para quién es? */}
        {step === 1 && (
          <div className="space-y-4">
            <h3 className="font-serif text-lg text-center text-[#FAF7F0]">
              Paso 1: ¿Para quién es la fragancia?
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
              {[
                { id: 'hombre', title: 'Para Caballero', desc: 'Presencia magnética, maderas, especias o cuero' },
                { id: 'mujer', title: 'Para Dama', desc: 'Sofisticación sublime, flores regias o dulzura envolvente' },
                { id: 'unisex', title: 'Aromas Compartidos / Unisex', desc: 'Obras de arte universales sin etiquetas de género' },
                { id: 'regalo', title: 'Es un Regalo Especial', desc: 'Selección de máxima aprobación y elogios garantizados' },
              ].map((opt) => (
                <button
                  key={opt.id}
                  onClick={() => {
                    setForWhom(opt.id);
                    setStep(2);
                  }}
                  className={`p-4 rounded-lg text-left border transition-all cursor-pointer ${
                    forWhom === opt.id
                      ? 'bg-[#D4AF37]/15 border-[#D4AF37] text-[#FAF7F0]'
                      : 'bg-[#080808] border-[#262626] hover:border-[#D4AF37]/50 text-[#B8B8B8] hover:text-[#FAF7F0]'
                  }`}
                >
                  <p className="font-serif text-sm font-semibold text-[#FAF7F0] mb-0.5">{opt.title}</p>
                  <p className="text-[11px] text-[#B8B8B8]">{opt.desc}</p>
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Step 2: Ocasión */}
        {step === 2 && (
          <div className="space-y-4">
            <h3 className="font-serif text-lg text-center text-[#FAF7F0]">
              Paso 2: ¿En qué momentos planeas usarla principalmente?
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
              {[
                { id: 'versatil', title: 'Firma Diaria & Oficina', desc: 'Elegancia limpia, no invasiva pero inolvidable' },
                { id: 'noche', title: 'Noches & Citas Románticas', desc: 'Seducción, calidez ambarina y halo misterioso' },
                { id: 'clima-calido', title: 'Calor Caribeño & Sol', desc: 'Cítricos chispeantes, brisa marina y vitalidad fresca' },
                { id: 'gala', title: 'Galas & Grandes Eventos', desc: 'Opulencia, proyección imponente y estela inolvidable' },
              ].map((opt) => (
                <button
                  key={opt.id}
                  onClick={() => {
                    setOccasion(opt.id);
                    setStep(3);
                  }}
                  className={`p-4 rounded-lg text-left border transition-all cursor-pointer ${
                    occasion === opt.id
                      ? 'bg-[#D4AF37]/15 border-[#D4AF37] text-[#FAF7F0]'
                      : 'bg-[#080808] border-[#262626] hover:border-[#D4AF37]/50 text-[#B8B8B8] hover:text-[#FAF7F0]'
                  }`}
                >
                  <p className="font-serif text-sm font-semibold text-[#FAF7F0] mb-0.5">{opt.title}</p>
                  <p className="text-[11px] text-[#B8B8B8]">{opt.desc}</p>
                </button>
              ))}
            </div>
            <div className="flex justify-between pt-2">
              <button
                onClick={() => setStep(1)}
                className="text-xs text-[#B8B8B8] hover:text-[#FAF7F0]"
              >
                ← Anterior
              </button>
            </div>
          </div>
        )}

        {/* Step 3: Sensación y acordes */}
        {step === 3 && (
          <div className="space-y-4">
            <h3 className="font-serif text-lg text-center text-[#FAF7F0]">
              Paso 3: ¿Qué tipo de sensaciones olfativas te atraen?
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
              {[
                { id: 'maderas', title: 'Maderas Nobles, Oud & Resinas', desc: 'Cedro, vetiver, humo misterioso y sándalo' },
                { id: 'dulce', title: 'Vainilla Bourbon, Coñac & Ámbar', desc: 'Calidez gourmand, canela y dulzura refinada' },
                { id: 'fresco', title: 'Cítricos Nobles & Frutas Reales', desc: 'Bergamota italiana, piña imperial y hierbas aromáticas' },
                { id: 'floral', title: 'Flores de Versalles & Rosa Turca', desc: 'Peonía, pétalos frescos de mayo y jazmín' },
              ].map((opt) => (
                <button
                  key={opt.id}
                  onClick={() => {
                    setScentProfile(opt.id);
                    setStep(4);
                  }}
                  className={`p-4 rounded-lg text-left border transition-all cursor-pointer ${
                    scentProfile === opt.id
                      ? 'bg-[#D4AF37]/15 border-[#D4AF37] text-[#FAF7F0]'
                      : 'bg-[#080808] border-[#262626] hover:border-[#D4AF37]/50 text-[#B8B8B8] hover:text-[#FAF7F0]'
                  }`}
                >
                  <p className="font-serif text-sm font-semibold text-[#FAF7F0] mb-0.5">{opt.title}</p>
                  <p className="text-[11px] text-[#B8B8B8]">{opt.desc}</p>
                </button>
              ))}
            </div>
            <div className="flex justify-between pt-2">
              <button
                onClick={() => setStep(2)}
                className="text-xs text-[#B8B8B8] hover:text-[#FAF7F0]"
              >
                ← Anterior
              </button>
            </div>
          </div>
        )}

        {/* Step 4: Results */}
        {step === 4 && (
          <div className="space-y-5">
            <div className="text-center">
              <span className="text-[11px] text-[#D4AF37] uppercase font-sans tracking-widest font-semibold">
                Tus Fragancias Ideales Seleccionadas
              </span>
              <p className="text-xs text-[#B8B8B8] mt-1">
                Basado en tu preferencia de notas y ocasión, estas son las joyas recomendadas de nuestro catálogo:
              </p>
            </div>

            <div className="space-y-3">
              {finalResults.map((perfume) => (
                <div
                  key={perfume.id}
                  className="p-3 bg-[#080808] border border-[#262626] hover:border-[#D4AF37]/60 rounded-lg flex items-center justify-between gap-4 transition-colors"
                >
                  <div className="flex items-center gap-3">
                    <img
                      src={perfume.image}
                      alt={perfume.name}
                      className="w-14 h-14 rounded object-cover border border-[#262626]"
                      referrerPolicy="no-referrer"
                    />
                    <div>
                      <span className="text-[10px] text-[#D4AF37] uppercase tracking-wider block font-sans">
                        {perfume.house}
                      </span>
                      <h4 className="font-serif text-sm font-semibold text-[#FAF7F0]">
                        {perfume.name}
                      </h4>
                      <p className="text-[11px] text-[#B8B8B8]">
                        {perfume.family} · {perfume.concentration}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <div className="text-right mr-2 hidden sm:block">
                      <span className="text-[10px] text-[#B8B8B8] block">Desde</span>
                      <span className="text-xs font-bold text-[#FAF7F0] font-mono tabular-nums">
                        RD$ {perfume.sizes[0].priceDOP.toLocaleString()}
                      </span>
                    </div>

                    <button
                      onClick={() => {
                        onClose();
                        onSelectPerfume(perfume);
                      }}
                      className="px-3 py-1.5 bg-[#050505] border border-[#D4AF37]/50 hover:border-[#D4AF37] text-xs text-[#FAF7F0] rounded hover:bg-[#111111] transition-colors flex items-center gap-1 cursor-pointer"
                    >
                      <Eye className="w-3.5 h-3.5 text-[#D4AF37]" />
                      <span className="hidden sm:inline">Ver Notas</span>
                    </button>

                    <button
                      onClick={() => {
                        onAddToCart(perfume, perfume.sizes[0].ml);
                      }}
                      className="px-3 py-1.5 bg-[#D4AF37] hover:bg-[#FFD76A] text-[#050505] text-xs font-semibold rounded transition-colors flex items-center gap-1 cursor-pointer"
                      title="Añadir a la bolsa"
                    >
                      <ShoppingBag className="w-3.5 h-3.5" />
                      <span>Añadir</span>
                    </button>
                  </div>
                </div>
              ))}
            </div>

            <div className="flex items-center justify-between pt-4 border-t border-[#262626]">
              <button
                onClick={handleReset}
                className="flex items-center gap-1.5 text-xs text-[#B8B8B8] hover:text-[#D4AF37] transition-colors cursor-pointer"
              >
                <RotateCcw className="w-3 h-3" />
                <span>Reiniciar Asesor Olfativo</span>
              </button>

              <button
                onClick={onClose}
                className="px-4 py-2 bg-[#1f1f1f] hover:bg-[#2a2a2a] text-xs text-[#FAF7F0] rounded transition-colors cursor-pointer"
              >
                Cerrar y Ver Catálogo Completo
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
