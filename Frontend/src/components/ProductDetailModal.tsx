/**
 * ─────────────────────────────────────────────────────────────────────────────
 * ARCHIVO: Frontend/src/components/ProductDetailModal.tsx
 * QUÉ ES: Ficha completa del perfume (PDP): galería, precios, cupón, tallas,
 *         cantidad, botón de bolsa, WhatsApp y pirámide de notas.
 * DÓNDE SE VE: Modal que se abre al pulsar cualquier perfume.
 * SE RENDERIZA DESDE: App.tsx (<ProductDetailModal ... />).
 * PROPS: perfume (o null), onClose, onAddToCart, isWishlisted,
 *        onToggleWishlist.
 * QUÉ TOCAR:
 *   - Cálculo de precios y cupón → constantes `regularPrice`, `ourPrice`,
 *     `couponDiscount`, `finalPriceWithCoupon`.
 *   - Tallas → map de `perfume.sizes`.
 *   - Cantidad → estado `quantity`.
 *   - WhatsApp → `generateWhatsAppLink`.
 *   - Notas aromáticas → bloques "Top / Heart / Base Notes".
 *
 * Los hooks se ejecutan antes del retorno condicional para conservar su orden.
 * ─────────────────────────────────────────────────────────────────────────────
 */

import React, { useState } from 'react';
import { X, Heart, ShoppingBag, MessageCircle, Star, Truck, Check, Sparkles, ShieldCheck } from 'lucide-react';
import { Perfume, PerfumeSize } from '../types';

interface ProductDetailModalProps {
  perfume: Perfume | null;
  onClose: () => void;
  onAddToCart: (perfume: Perfume, sizeMl: number, quantity: number) => void;
  isWishlisted: boolean;
  onToggleWishlist: (perfumeId: string) => void;
}

export const ProductDetailModal: React.FC<ProductDetailModalProps> = ({
  perfume,
  onClose,
  onAddToCart,
  isWishlisted,
  onToggleWishlist,
}) => {
  const [selectedSizeIndex, setSelectedSizeIndex] = useState(0);
  const [couponActivated, setCouponActivated] = useState(true);
  const [quantity, setQuantity] = useState(1);
  const [isAddedFeedback, setIsAddedFeedback] = useState(false);

  if (!perfume) return null;

  const currentSize: PerfumeSize = perfume.sizes[selectedSizeIndex] || perfume.sizes[0];
  // ── PRECIOS Y CUPÓN ────────────────────────────────────────────────────────
  // `regularPrice` es un precio "retail" simulado (1.25× el real).
  // ⚠️ El cupón aparece activado por defecto y se muestra el precio con 10%,
  //    pero `handleAddToCart` envía `currentSize.priceDOP` SIN descuento.
  //    Por eso el precio de la ficha no coincide con el de la bolsa.
  const regularPrice = Math.round(currentSize.priceDOP * 1.25);
  const ourPrice = currentSize.priceDOP;
  const couponDiscount = Math.round(ourPrice * 0.1);
  const finalPriceWithCoupon = couponActivated ? ourPrice - couponDiscount : ourPrice;
  const totalSavings = (regularPrice - finalPriceWithCoupon) * quantity;

  const handleAddToCart = () => {
    onAddToCart(perfume, currentSize.ml, quantity);
    setIsAddedFeedback(true);
    setTimeout(() => setIsAddedFeedback(false), 2000);
  };

  const generateWhatsAppLink = () => {
    const text = encodeURIComponent(
      `¡Hola D’ Victor Fragancias! Me interesa ordenar:\n` +
      `✨ Perfume: ${perfume.name}\n` +
      `🏛 Casa: ${perfume.house}\n` +
      `📏 Presentación: ${currentSize.ml} ml (${quantity} unidad${quantity > 1 ? 'es' : ''})\n` +
      `💰 Precio final con cupón: RD$ ${(finalPriceWithCoupon * quantity).toLocaleString()}\n` +
      `📍 Lugar de entrega en República Dominicana: `
    );
    return `https://wa.me/18295553842?text=${text}`;
  };

  return (
    <div
      role="dialog"
      aria-modal="true"
      className="fixed inset-0 z-50 overflow-y-auto bg-black/85 backdrop-blur-md flex items-center justify-center p-3 sm:p-6"
    >
      <div className="fixed inset-0 -z-10" onClick={onClose} />

      <div className="relative bg-[#0d0d0d] border border-[#2a2a2a] rounded-xl max-w-5xl w-full max-h-[94vh] overflow-y-auto shadow-2xl animate-in zoom-in-95 duration-200">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 z-20 p-2 text-[#B8B8B8] hover:text-[#FAF7F0] bg-[#1a1a1a] rounded-full border border-[#333] transition-colors"
          aria-label="Cerrar ventana de producto"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Breadcrumb Bar (FragranceNet style: Reference 2) */}
        <div className="px-6 py-3 border-b border-[#222] bg-[#080808] text-[11px] font-sans text-[#888] flex items-center gap-1.5 overflow-x-auto whitespace-nowrap">
          <button onClick={onClose} className="hover:text-[#D4AF37]">
            INICIO
          </button>
          <span>/</span>
          <span className="hover:text-[#D4AF37]">FRAGANCIAS</span>
          <span>/</span>
          <span className="uppercase text-[#B8B8B8]">{perfume.house}</span>
          <span>/</span>
          <span className="text-[#FAF7F0] font-medium uppercase">{perfume.name}</span>
        </div>

        <div className="p-6 sm:p-8 grid grid-cols-1 md:grid-cols-12 gap-8 items-start">
          {/* Left Column: FragranceNet Style Gallery */}
          <div className="md:col-span-5 flex flex-col items-center">
            <div className="relative w-full aspect-[4/5] bg-[#080808] rounded-lg border border-[#222] overflow-hidden flex items-center justify-center p-4">
              <img
                src={perfume.image}
                alt={perfume.name}
                className="w-full h-full object-cover rounded-md"
                referrerPolicy="no-referrer"
              />

              {/* Heart Wishlist */}
              <button
                onClick={() => onToggleWishlist(perfume.id)}
                className="absolute top-3 right-3 p-2 rounded-full bg-[#111]/80 hover:bg-[#111] text-[#FAF7F0] border border-[#333] transition-colors"
              >
                <Heart
                  className={`w-4 h-4 ${
                    isWishlisted ? 'fill-[#D4AF37] text-[#D4AF37]' : 'text-[#FAF7F0]'
                  }`}
                />
              </button>

              <span className="absolute bottom-3 right-3 text-[10px] uppercase font-sans tracking-wider px-2 py-0.5 bg-[#050505]/90 text-[#D4AF37] border border-[#D4AF37]/40 rounded">
                {perfume.gender}
              </span>
            </div>

            {/* Authenticity Certificate Box */}
            <div className="mt-4 w-full p-3 bg-[#080808] border border-[#222] rounded text-xs text-[#B8B8B8] flex items-center justify-between">
              <span className="flex items-center gap-1.5 text-[#D4AF37] font-semibold text-[11px]">
                <ShieldCheck className="w-4 h-4" />
                100% Original
              </span>
              <span className="font-mono text-[#FAF7F0] text-[11px]">
                Batch: {perfume.batchCodeExample}
              </span>
            </div>
          </div>

          {/* Right Column: Pricing, Size Selection & Purchase (Reference 2) */}
          <div className="md:col-span-7 flex flex-col justify-between">
            <div>
              {/* Brand House */}
              <span className="text-xs uppercase tracking-[0.25em] font-sans font-bold text-[#D4AF37] block mb-1">
                {perfume.house}
              </span>

              {/* Fragrance Full Title */}
              <h1 className="font-serif text-2xl sm:text-3xl text-[#FAF7F0] font-normal leading-tight mb-1">
                {perfume.name}
              </h1>

              {/* Subtitle / Concentration */}
              <p className="text-xs text-[#B8B8B8] font-sans mb-3">
                {perfume.concentration} · {currentSize.ml} ml (Presentación Oficial en Caja)
              </p>

              {/* Rating and Reviews */}
              <div className="flex items-center gap-2 mb-4 text-xs">
                <div className="flex text-[#FFD76A]">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      className={`w-3.5 h-3.5 ${
                        i < Math.floor(perfume.rating) ? 'fill-current' : 'opacity-40'
                      }`}
                    />
                  ))}
                </div>
                <span className="text-[#D4AF37] font-medium font-sans underline cursor-pointer">
                  {perfume.reviewsCount} valoraciones verificadas
                </span>
              </div>

              {/* Price Calculation Box with Coupon (FragranceNet style) */}
              <div className="p-4 bg-[#080808] border border-[#262626] rounded-lg mb-6 space-y-1.5 text-xs">
                <div className="flex items-center justify-between text-[#888]">
                  <span>Precio Retail Sugerido:</span>
                  <span className="line-through font-mono tabular-nums">
                    RD$ {(regularPrice * quantity).toLocaleString()}
                  </span>
                </div>

                <div className="flex items-center justify-between text-[#FAF7F0]">
                  <span>Precio D’ Victor Fragancias:</span>
                  <span className="font-mono font-semibold tabular-nums">
                    RD$ {(ourPrice * quantity).toLocaleString()}
                  </span>
                </div>

                <div className="pt-2 border-t border-[#1f1f1f] flex items-baseline justify-between">
                  <div className="flex flex-col">
                    <span className="text-xs font-semibold text-[#D4AF37] uppercase tracking-wider">
                      Precio con Cupón DVICTOR10:
                    </span>
                    <span className="text-[10px] text-[#22c55e]">
                      Ahorras RD$ {totalSavings.toLocaleString()} (Descuento exclusivo)
                    </span>
                  </div>
                  <span className="font-mono font-bold text-2xl text-[#FAF7F0] tabular-nums">
                    RD$ {(finalPriceWithCoupon * quantity).toLocaleString()}
                  </span>
                </div>

                {/* Coupon activator pill */}
                <div className="pt-2 flex items-center justify-between">
                  <button
                    onClick={() => setCouponActivated(!couponActivated)}
                    className="px-3 py-1 bg-[#22c55e]/15 border border-[#22c55e]/40 hover:bg-[#22c55e]/25 text-[#22c55e] rounded text-[11px] font-sans font-medium flex items-center gap-1.5 transition-colors cursor-pointer"
                  >
                    <Check className="w-3.5 h-3.5" />
                    <span>{couponActivated ? 'Cupón "DVICTOR10" Activado' : 'Activar Cupón 10%'}</span>
                  </button>
                  <span className="text-[10px] text-[#888]">Aplicado al instante</span>
                </div>
              </div>

              {/* Size Option Boxes (FragranceNet Reference 2: 2x2 grid of presentations) */}
              <div className="mb-6">
                <label className="block text-[11px] uppercase tracking-wider font-sans text-[#D4AF37] font-semibold mb-2">
                  Selecciona tu Presentación:
                </label>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5">
                  {perfume.sizes.map((s, idx) => (
                    <button
                      key={s.ml}
                      onClick={() => setSelectedSizeIndex(idx)}
                      className={`p-3 rounded-lg border text-left transition-all cursor-pointer ${
                        selectedSizeIndex === idx
                          ? 'bg-[#141414] border-[#D4AF37] ring-1 ring-[#D4AF37]'
                          : 'bg-[#080808] border-[#222] hover:border-[#444]'
                      }`}
                    >
                      <span className="text-xs font-semibold text-[#FAF7F0] block">
                        {s.ml} ml
                      </span>
                      <span className="text-[10px] text-[#888] block">
                        {(s.ml / 29.57).toFixed(1)} fl. oz.
                      </span>
                      <span className="font-mono text-xs font-bold text-[#D4AF37] mt-1 block tabular-nums">
                        RD$ {s.priceDOP.toLocaleString()}
                      </span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Stepper + Primary Add to Bag Button */}
              <div className="space-y-3 mb-6">
                <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2.5 sm:gap-3">
                  {/* Stepper */}
                  <div className="flex items-center bg-[#080808] border border-[#2a2a2a] rounded px-3 py-2 text-xs">
                    <button
                      onClick={() => setQuantity(Math.max(1, quantity - 1))}
                      className="text-[#888] hover:text-[#FAF7F0] px-1 text-sm font-bold"
                    >
                      -
                    </button>
                    <span className="px-3 font-mono text-[#FAF7F0] tabular-nums font-semibold">
                      {quantity}
                    </span>
                    <button
                      onClick={() => setQuantity(quantity + 1)}
                      className="text-[#888] hover:text-[#FAF7F0] px-1 text-sm font-bold"
                    >
                      +
                    </button>
                  </div>

                  {/* Primary Add to Bag CTA */}
                  <button
                    onClick={handleAddToCart}
                    className={`flex-1 py-3.5 px-6 rounded font-sans text-xs uppercase tracking-[0.2em] font-semibold transition-all duration-300 flex items-center justify-center gap-2 cursor-pointer ${
                      isAddedFeedback
                        ? 'bg-[#22c55e] text-white'
                        : 'bg-[#D4AF37] hover:bg-[#FFD76A] text-[#050505] shadow-[0_4px_16px_rgba(212,175,55,0.3)]'
                    }`}
                  >
                    {isAddedFeedback ? (
                      <>
                        <Check className="w-4 h-4" />
                        <span>¡Agregado a la Bolsa!</span>
                      </>
                    ) : (
                      <>
                        <ShoppingBag className="w-4 h-4" />
                        <span>AÑADIR A LA BOLSA</span>
                      </>
                    )}
                  </button>
                </div>

                {/* WhatsApp Direct Buy */}
                <a
                  href={generateWhatsAppLink()}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full py-2.5 px-4 bg-[#080808] hover:bg-[#141414] border border-[#25D366]/40 hover:border-[#25D366] text-[#25D366] rounded text-xs font-sans font-medium flex items-center justify-center gap-2 transition-colors cursor-pointer"
                >
                  <MessageCircle className="w-4 h-4" />
                  <span>Comprar Directo por WhatsApp (Asesor VIP D’ Victor)</span>
                </a>
              </div>

              {/* Free Shipping & Payments Banner (Reference 2) */}
              <div className="p-3 bg-[#080808] border border-[#222] rounded text-xs text-[#B8B8B8] space-y-1">
                <div className="flex items-center gap-2 text-[#FAF7F0] font-semibold text-[11px]">
                  <Truck className="w-4 h-4 text-[#D4AF37]" />
                  <span>ENVÍO EXPRESS GRATIS (en órdenes superiores a RD$ 8,000)</span>
                </div>
                <p className="text-[10px] text-[#888]">
                  Paga contra entrega en Santo Domingo o vía transferencia Banco Popular, Banreservas y BHD León.
                </p>
              </div>

              {/* Visual Olfactory Notes Section (Reference 2: FragranceNet Top / Heart / Base Notes with badges) */}
              <div className="mt-6 pt-5 border-t border-[#222] space-y-3">
                <span className="text-[11px] uppercase tracking-wider font-sans text-[#D4AF37] font-semibold block">
                  Pirámide de Notas Aromáticas:
                </span>

                {/* Top Notes */}
                <div className="flex flex-col sm:flex-row sm:items-center gap-2 text-xs">
                  <span className="w-28 uppercase text-[10px] tracking-wider text-[#888] font-semibold shrink-0">
                    NOTAS DE SALIDA:
                  </span>
                  <div className="flex flex-wrap gap-1.5">
                    {perfume.topNotes.map((note, idx) => (
                      <span
                        key={idx}
                        className="px-2.5 py-1 rounded bg-[#141414] border border-[#2a2a2a] text-[#FAF7F0] text-[11px] flex items-center gap-1.5"
                      >
                        <span className="w-2 h-2 rounded-full bg-[#FFD76A]" />
                        <span>{note}</span>
                      </span>
                    ))}
                  </div>
                </div>

                {/* Heart Notes */}
                <div className="flex flex-col sm:flex-row sm:items-center gap-2 text-xs">
                  <span className="w-28 uppercase text-[10px] tracking-wider text-[#888] font-semibold shrink-0">
                    NOTAS DE CORAZÓN:
                  </span>
                  <div className="flex flex-wrap gap-1.5">
                    {perfume.heartNotes.map((note, idx) => (
                      <span
                        key={idx}
                        className="px-2.5 py-1 rounded bg-[#141414] border border-[#2a2a2a] text-[#FAF7F0] text-[11px] flex items-center gap-1.5"
                      >
                        <span className="w-2 h-2 rounded-full bg-[#D4AF37]" />
                        <span>{note}</span>
                      </span>
                    ))}
                  </div>
                </div>

                {/* Base Notes */}
                <div className="flex flex-col sm:flex-row sm:items-center gap-2 text-xs">
                  <span className="w-28 uppercase text-[10px] tracking-wider text-[#888] font-semibold shrink-0">
                    NOTAS DE FONDO:
                  </span>
                  <div className="flex flex-wrap gap-1.5">
                    {perfume.baseNotes.map((note, idx) => (
                      <span
                        key={idx}
                        className="px-2.5 py-1 rounded bg-[#141414] border border-[#2a2a2a] text-[#FAF7F0] text-[11px] flex items-center gap-1.5"
                      >
                        <span className="w-2 h-2 rounded-full bg-[#888]" />
                        <span>{note}</span>
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
