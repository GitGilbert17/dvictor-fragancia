/**
 * ─────────────────────────────────────────────────────────────────────────────
 * ARCHIVO: src/components/CartDrawer.tsx
 * QUÉ ES: Bolsa lateral + checkout dominicano en dos pasos.
 * DÓNDE SE VE: Panel derecho al pulsar "Bolsa" en el Header.
 * SE RENDERIZA DESDE: App.tsx (<CartDrawer ... />).
 * PROPS: isOpen, onClose, items, onUpdateQuantity, onRemoveItem,
 *        onClearCart, onOrderPlaced.
 * QUÉ TOCAR:
 *   - Envío gratis / costos → `shippingThreshold`, `shippingCost`.
 *   - Cupones válidos → `handleApplyCoupon` (DVICTOR10 / ELEGANCIA10).
 *   - Datos del formulario → estado `formData` (tipo en types.ts).
 *   - Totales → `subtotal`, `discountAmount`, `finalTotal`.
 *   - Provincias → PROVINCES_RD en data/perfumes.ts.
 *   - Métodos de pago → bloque "Payment method".
 * ─────────────────────────────────────────────────────────────────────────────
 */

import React, { useState } from 'react';
import { X, Trash2, ShoppingBag, ArrowRight, ShieldCheck, CheckCircle2, MessageCircle, Truck } from 'lucide-react';
import { CartItem, CheckoutFormData } from '../types';
import { PROVINCES_RD } from '../data/perfumes';

interface CartDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  items: CartItem[];
  onUpdateQuantity: (perfumeId: string, sizeMl: number, delta: number) => void;
  onRemoveItem: (perfumeId: string, sizeMl: number) => void;
  onClearCart: () => void;
  onOrderPlaced: (orderId: string, total: number, formData: CheckoutFormData) => void;
}

export const CartDrawer: React.FC<CartDrawerProps> = ({
  isOpen,
  onClose,
  items,
  onUpdateQuantity,
  onRemoveItem,
  onClearCart,
  onOrderPlaced,
}) => {
  const [step, setStep] = useState<'cart' | 'checkout'>('cart');
  const [couponCode, setCouponCode] = useState('');
  const [appliedDiscountPercent, setAppliedDiscountPercent] = useState<number>(0);
  const [couponError, setCouponError] = useState('');
  const [couponSuccess, setCouponSuccess] = useState('');

  const [formData, setFormData] = useState<CheckoutFormData>({
    fullName: '',
    phone: '',
    email: '',
    province: 'Distrito Nacional (Santo Domingo)',
    sector: '',
    address: '',
    deliveryType: 'express-sd',
    paymentMethod: 'contra-entrega',
    notes: '',
  });

  if (!isOpen) return null;

  // ── TOTALES Y ENVÍO ────────────────────────────────────────────────────────
  // Envío gratis desde RD$ 8,000. Si no califica: RD$ 350 (SD) o RD$ 500 (nacional).
  const subtotal = items.reduce((acc, item) => acc + item.priceDOP * item.quantity, 0);
  const discountAmount = Math.round((subtotal * appliedDiscountPercent) / 100);
  const shippingThreshold = 8000;
  const isShippingFree = subtotal >= shippingThreshold;
  const shippingCost = isShippingFree ? 0 : formData.deliveryType === 'express-sd' ? 350 : 500;
  const finalTotal = Math.max(0, subtotal - discountAmount + shippingCost);

  // ── CUPONES VÁLIDOS ────────────────────────────────────────────────────────
  // DVICTOR10 y ELEGANCIA10 aplican 10% sobre el subtotal.
  const handleApplyCoupon = (e: React.FormEvent) => {
    e.preventDefault();
    setCouponError('');
    setCouponSuccess('');
    const code = couponCode.trim().toUpperCase();
    if (code === 'DVICTOR10' || code === 'ELEGANCIA10') {
      setAppliedDiscountPercent(10);
      setCouponSuccess('¡Cupón del 10% aplicado con éxito!');
    } else {
      setCouponError('Código no válido. Usa "DVICTOR10" para 10% de descuento.');
    }
  };

  // ── CONFIRMAR PEDIDO (SIMULADO) ────────────────────────────────────────────
  // Genera un ID aleatorio y notifica a App. No hay backend ni pasarela real:
  // el pedido solo vive en el estado y se confirma por WhatsApp.
  const handleProcessOrder = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.fullName || !formData.phone || !formData.address) {
      alert('Por favor completa tu nombre, teléfono y dirección de entrega.');
      return;
    }

    const orderId = `DV-${Math.floor(100000 + Math.random() * 900000)}`;
    onOrderPlaced(orderId, finalTotal, formData);
  };

  return (
    <div
      role="dialog"
      aria-modal="true"
      className="fixed inset-0 z-50 overflow-hidden bg-black/80 backdrop-blur-sm flex justify-end"
    >
      {/* Backdrop */}
      <div className="fixed inset-0" onClick={onClose} />

      {/* Drawer Container */}
      <div className="relative z-10 w-full max-w-lg bg-[#111111] border-l border-[#262626] h-full flex flex-col justify-between shadow-2xl animate-in slide-in-from-right duration-300">
        {/* Header */}
        <div className="p-5 border-b border-[#262626] flex items-center justify-between bg-[#080808]">
          <div className="flex items-center gap-2">
            <ShoppingBag className="w-5 h-5 text-[#D4AF37]" />
            <h2 className="font-serif text-lg text-[#FAF7F0] font-semibold">
              {step === 'cart' ? 'Bolsa de Compras' : 'Finalizar Pedido'}
            </h2>
            <span className="text-xs text-[#B8B8B8] font-mono tabular-nums">
              ({items.reduce((s, i) => s + i.quantity, 0)} ítems)
            </span>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-[#B8B8B8] hover:text-[#FAF7F0] hover:bg-[#1a1a1a] rounded transition-colors"
            aria-label="Cerrar bolsa"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Free shipping status bar */}
        <div className="bg-[#050505] px-5 py-2.5 border-b border-[#1f1f1f] text-xs">
          {isShippingFree ? (
            <p className="text-[#22c55e] flex items-center gap-1.5 font-medium">
              <CheckCircle2 className="w-4 h-4" />
              <span>¡Felicidades! Calificas para Envío Express Gratis en RD</span>
            </p>
          ) : (
            <div>
              <p className="text-[#B8B8B8] mb-1">
                Agrega <strong className="text-[#D4AF37] font-mono tabular-nums">RD$ {(shippingThreshold - subtotal).toLocaleString()}</strong> más para <span className="text-[#FAF7F0] font-medium">Envío Gratis</span>
              </p>
              <div className="w-full bg-[#262626] h-1.5 rounded-full overflow-hidden">
                <div
                  className="bg-[#D4AF37] h-full transition-all duration-300"
                  style={{ width: `${Math.min(100, (subtotal / shippingThreshold) * 100)}%` }}
                />
              </div>
            </div>
          )}
        </div>

        {/* Scrollable Content */}
        <div className="flex-1 overflow-y-auto p-5 space-y-4">
          {items.length === 0 ? (
            <div className="text-center py-16">
              <ShoppingBag className="w-12 h-12 text-[#333] mx-auto mb-3" />
              <p className="font-serif text-lg text-[#FAF7F0] mb-1">
                Tu bolsa está vacía
              </p>
              <p className="text-xs text-[#B8B8B8] max-w-xs mx-auto mb-6">
                Descubre nuestra selección de alta perfumería y añade tu fragancia de firma.
              </p>
              <button
                onClick={onClose}
                className="px-6 py-2.5 bg-[#D4AF37] text-[#050505] rounded-md font-sans text-xs font-semibold uppercase tracking-wider hover:bg-[#FFD76A] transition-colors"
              >
                Explorar Perfumes
              </button>
            </div>
          ) : step === 'cart' ? (
            /* Item list */
            <div className="space-y-4">
              {items.map((item) => (
                <div
                  key={`${item.perfume.id}-${item.sizeMl}`}
                  className="p-3 bg-[#080808] border border-[#262626] rounded-lg flex items-center gap-3"
                >
                  <img
                    src={item.perfume.image}
                    alt={item.perfume.name}
                    className="w-16 h-16 object-cover rounded bg-[#111111] shrink-0 border border-[#262626]"
                    referrerPolicy="no-referrer"
                  />
                  <div className="flex-1 min-w-0">
                    <span className="text-[10px] text-[#D4AF37] font-sans uppercase tracking-wider block truncate">
                      {item.perfume.house}
                    </span>
                    <h3 className="font-serif text-sm font-semibold text-[#FAF7F0] truncate">
                      {item.perfume.name}
                    </h3>
                    <div className="text-[11px] text-[#B8B8B8]">
                      {item.sizeMl} ml · {item.perfume.concentration}
                    </div>
                    <div className="text-xs font-bold font-sans text-[#FAF7F0] mt-1 tabular-nums">
                      RD$ {(item.priceDOP * item.quantity).toLocaleString()}
                    </div>
                  </div>

                  {/* Quantity Stepper */}
                  <div className="flex flex-col items-end gap-2 shrink-0">
                    <button
                      onClick={() => onRemoveItem(item.perfume.id, item.sizeMl)}
                      className="text-[#666] hover:text-red-400 p-1 transition-colors"
                      aria-label="Eliminar ítem"
                      title="Eliminar"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>

                    <div className="flex items-center bg-[#111111] border border-[#262626] rounded text-xs">
                      <button
                        onClick={() => onUpdateQuantity(item.perfume.id, item.sizeMl, -1)}
                        className="px-2 py-0.5 text-[#B8B8B8] hover:text-[#FAF7F0]"
                      >
                        -
                      </button>
                      <span className="px-2 font-mono text-[#FAF7F0] tabular-nums">
                        {item.quantity}
                      </span>
                      <button
                        onClick={() => onUpdateQuantity(item.perfume.id, item.sizeMl, 1)}
                        className="px-2 py-0.5 text-[#B8B8B8] hover:text-[#FAF7F0]"
                      >
                        +
                      </button>
                    </div>
                  </div>
                </div>
              ))}

              {/* Coupon Form */}
              <div className="pt-2">
                <form onSubmit={handleApplyCoupon} className="flex gap-2">
                  <input
                    type="text"
                    value={couponCode}
                    onChange={(e) => setCouponCode(e.target.value)}
                    placeholder="Código de cortesía (ej. DVICTOR10)"
                    className="flex-1 bg-[#080808] border border-[#262626] focus:border-[#D4AF37] text-xs text-[#FAF7F0] px-3 py-2 rounded outline-none uppercase"
                  />
                  <button
                    type="submit"
                    className="px-3 py-2 bg-[#1f1f1f] hover:bg-[#2a2a2a] text-xs font-medium text-[#FAF7F0] rounded transition-colors whitespace-nowrap cursor-pointer"
                  >
                    Aplicar
                  </button>
                </form>
                {couponSuccess && (
                  <p className="text-[11px] text-[#22c55e] mt-1">{couponSuccess}</p>
                )}
                {couponError && (
                  <p className="text-[11px] text-red-400 mt-1">{couponError}</p>
                )}
              </div>
            </div>
          ) : (
            /* Checkout Step */
            <form id="checkout-form" onSubmit={handleProcessOrder} className="space-y-4 text-xs">
              <div className="flex items-center justify-between pb-2 border-b border-[#262626]">
                <span className="font-semibold text-[#FAF7F0] uppercase tracking-wider text-[11px]">
                  Datos de Entrega en República Dominicana
                </span>
                <button
                  type="button"
                  onClick={() => setStep('cart')}
                  className="text-[11px] text-[#D4AF37] hover:underline"
                >
                  ← Volver a la bolsa
                </button>
              </div>

              <div>
                <label className="block text-[#B8B8B8] mb-1 font-medium">
                  Nombre Completo *
                </label>
                <input
                  required
                  type="text"
                  value={formData.fullName}
                  onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                  placeholder="Ej. Juan Pérez"
                  className="w-full bg-[#080808] border border-[#262626] text-[#FAF7F0] p-2 rounded focus:border-[#D4AF37] outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-[#B8B8B8] mb-1 font-medium">
                    Teléfono / WhatsApp *
                  </label>
                  <input
                    required
                    type="tel"
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    placeholder="809-555-0199"
                    className="w-full bg-[#080808] border border-[#262626] text-[#FAF7F0] p-2 rounded focus:border-[#D4AF37] outline-none"
                  />
                </div>
                <div>
                  <label className="block text-[#B8B8B8] mb-1 font-medium">
                    Correo Electrónico
                  </label>
                  <input
                    type="email"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    placeholder="correo@ejemplo.com"
                    className="w-full bg-[#080808] border border-[#262626] text-[#FAF7F0] p-2 rounded focus:border-[#D4AF37] outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[#B8B8B8] mb-1 font-medium">
                  Provincia / Ciudad *
                </label>
                <select
                  value={formData.province}
                  onChange={(e) => setFormData({ ...formData, province: e.target.value })}
                  className="w-full bg-[#080808] border border-[#262626] text-[#FAF7F0] p-2 rounded focus:border-[#D4AF37] outline-none"
                >
                  {PROVINCES_RD.map((prov) => (
                    <option key={prov} value={prov}>
                      {prov}
                    </option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-[#B8B8B8] mb-1 font-medium">
                    Sector / Ensanche *
                  </label>
                  <input
                    required
                    type="text"
                    value={formData.sector}
                    onChange={(e) => setFormData({ ...formData, sector: e.target.value })}
                    placeholder="Ej. Piantini, Bella Vista..."
                    className="w-full bg-[#080808] border border-[#262626] text-[#FAF7F0] p-2 rounded focus:border-[#D4AF37] outline-none"
                  />
                </div>
                <div>
                  <label className="block text-[#B8B8B8] mb-1 font-medium">
                    Dirección exacta *
                  </label>
                  <input
                    required
                    type="text"
                    value={formData.address}
                    onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                    placeholder="Calle, Edificio, Apto..."
                    className="w-full bg-[#080808] border border-[#262626] text-[#FAF7F0] p-2 rounded focus:border-[#D4AF37] outline-none"
                  />
                </div>
              </div>

              {/* Delivery method */}
              <div>
                <label className="block text-[#D4AF37] mb-1 font-semibold uppercase tracking-wider text-[10px]">
                  Modalidad de Entrega
                </label>
                <div className="space-y-1.5">
                  <label className="flex items-center gap-2 p-2 rounded bg-[#080808] border border-[#262626] cursor-pointer">
                    <input
                      type="radio"
                      name="deliveryType"
                      checked={formData.deliveryType === 'express-sd'}
                      onChange={() => setFormData({ ...formData, deliveryType: 'express-sd' })}
                      className="accent-[#D4AF37]"
                    />
                    <span className="flex-1 text-[#FAF7F0]">
                      Envío Express Mismo Día (Gran Santo Domingo)
                    </span>
                    <span className="font-mono text-[#D4AF37] tabular-nums">
                      {isShippingFree ? 'GRATIS' : 'RD$ 350'}
                    </span>
                  </label>

                  <label className="flex items-center gap-2 p-2 rounded bg-[#080808] border border-[#262626] cursor-pointer">
                    <input
                      type="radio"
                      name="deliveryType"
                      checked={formData.deliveryType === 'nacional'}
                      onChange={() => setFormData({ ...formData, deliveryType: 'nacional' })}
                      className="accent-[#D4AF37]"
                    />
                    <span className="flex-1 text-[#FAF7F0]">
                      Nacional / Provincias (Metro Pac / Caribe Pack 24-48h)
                    </span>
                    <span className="font-mono text-[#D4AF37] tabular-nums">
                      {isShippingFree ? 'GRATIS' : 'RD$ 500'}
                    </span>
                  </label>
                </div>
              </div>

              {/* Payment method */}
              <div>
                <label className="block text-[#D4AF37] mb-1 font-semibold uppercase tracking-wider text-[10px]">
                  Método de Pago
                </label>
                <div className="space-y-1.5">
                  <label className="flex items-center gap-2 p-2 rounded bg-[#080808] border border-[#262626] cursor-pointer">
                    <input
                      type="radio"
                      name="paymentMethod"
                      checked={formData.paymentMethod === 'contra-entrega'}
                      onChange={() => setFormData({ ...formData, paymentMethod: 'contra-entrega' })}
                      className="accent-[#D4AF37]"
                    />
                    <span className="text-[#FAF7F0]">
                      Pago contra entrega (Efectivo o Verifone al recibir en SD)
                    </span>
                  </label>

                  <label className="flex items-center gap-2 p-2 rounded bg-[#080808] border border-[#262626] cursor-pointer">
                    <input
                      type="radio"
                      name="paymentMethod"
                      checked={formData.paymentMethod === 'transferencia'}
                      onChange={() => setFormData({ ...formData, paymentMethod: 'transferencia' })}
                      className="accent-[#D4AF37]"
                    />
                    <span className="text-[#FAF7F0]">
                      Transferencia bancaria (Banco Popular / Banreservas / BHD)
                    </span>
                  </label>

                  <label className="flex items-center gap-2 p-2 rounded bg-[#080808] border border-[#262626] cursor-pointer">
                    <input
                      type="radio"
                      name="paymentMethod"
                      checked={formData.paymentMethod === 'whatsapp'}
                      onChange={() => setFormData({ ...formData, paymentMethod: 'whatsapp' })}
                      className="accent-[#D4AF37]"
                    />
                    <span className="text-[#FAF7F0]">
                      Finalizar y coordinar vía WhatsApp con Asesor D’ Victor
                    </span>
                  </label>
                </div>
              </div>
            </form>
          )}
        </div>

        {/* Footer Summary & Action */}
        {items.length > 0 && (
          <div className="p-5 border-t border-[#262626] bg-[#080808] space-y-3">
            <div className="space-y-1 text-xs">
              <div className="flex justify-between text-[#B8B8B8]">
                <span>Subtotal</span>
                <span className="font-mono text-[#FAF7F0] tabular-nums">
                  RD$ {subtotal.toLocaleString()}
                </span>
              </div>
              {appliedDiscountPercent > 0 && (
                <div className="flex justify-between text-[#22c55e]">
                  <span>Descuento de Cortesía ({appliedDiscountPercent}%)</span>
                  <span className="font-mono tabular-nums">
                    - RD$ {discountAmount.toLocaleString()}
                  </span>
                </div>
              )}
              <div className="flex justify-between text-[#B8B8B8]">
                <span>Envío estimado</span>
                <span className="font-mono text-[#FAF7F0] tabular-nums">
                  {isShippingFree ? 'Gratis' : `RD$ ${shippingCost.toLocaleString()}`}
                </span>
              </div>
              <div className="pt-2 border-t border-[#262626] flex justify-between text-sm sm:text-base font-bold text-[#FAF7F0]">
                <span className="font-serif">Total en Pesos Dominicanos</span>
                <span className="text-[#D4AF37] font-mono tabular-nums">
                  RD$ {finalTotal.toLocaleString()}
                </span>
              </div>
            </div>

            {step === 'cart' ? (
              <button
                onClick={() => setStep('checkout')}
                className="w-full py-3 bg-gradient-to-r from-[#D4AF37] to-[#B38F24] hover:from-[#FFD76A] hover:to-[#D4AF37] text-[#050505] rounded-md font-sans text-xs font-semibold uppercase tracking-[0.16em] transition-all duration-300 flex items-center justify-center gap-2 cursor-pointer shadow-[0_4px_16px_rgba(212,175,55,0.25)]"
              >
                <span>Proceder al Pago</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            ) : (
              <button
                type="submit"
                form="checkout-form"
                className="w-full py-3 bg-gradient-to-r from-[#D4AF37] to-[#B38F24] hover:from-[#FFD76A] hover:to-[#D4AF37] text-[#050505] rounded-md font-sans text-xs font-semibold uppercase tracking-[0.16em] transition-all duration-300 flex items-center justify-center gap-2 cursor-pointer shadow-[0_4px_16px_rgba(212,175,55,0.25)]"
              >
                <CheckCircle2 className="w-4 h-4" />
                <span>Confirmar Pedido (RD$ {finalTotal.toLocaleString()})</span>
              </button>
            )}

            <div className="flex items-center justify-center gap-4 text-[10px] text-[#B8B8B8] pt-1">
              <span className="flex items-center gap-1">
                <ShieldCheck className="w-3 h-3 text-[#D4AF37]" />
                Original 100%
              </span>
              <span>·</span>
              <span className="flex items-center gap-1">
                <Truck className="w-3 h-3 text-[#D4AF37]" />
                Entrega Garantizada
              </span>
              <span>·</span>
              <span>Santo Domingo, RD</span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
