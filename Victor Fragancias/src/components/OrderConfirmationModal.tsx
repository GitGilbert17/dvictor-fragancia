import React from 'react';
import { CheckCircle2, MessageCircle, ShieldCheck, Truck, Copy, Check, ArrowRight } from 'lucide-react';
import { CheckoutFormData } from '../types';
import { BrandLogo } from './BrandLogo';

interface OrderConfirmationModalProps {
  orderInfo: {
    orderId: string;
    total: number;
    formData: CheckoutFormData;
  } | null;
  onClose: () => void;
}

export const OrderConfirmationModal: React.FC<OrderConfirmationModalProps> = ({
  orderInfo,
  onClose,
}) => {
  const [copiedAccount, setCopiedAccount] = React.useState(false);

  if (!orderInfo) return null;

  const { orderId, total, formData } = orderInfo;

  const handleCopyPopular = () => {
    navigator.clipboard.writeText('812-349812-0');
    setCopiedAccount(true);
    setTimeout(() => setCopiedAccount(false), 2000);
  };

  const generateWhatsAppConfirmation = () => {
    const text = encodeURIComponent(
      `¡Hola D’ Victor Fragancias! Acabo de registrar mi pedido en la web:\n` +
      `🔖 No. Orden: ${orderId}\n` +
      `👤 Cliente: ${formData.fullName}\n` +
      `📱 Teléfono: ${formData.phone}\n` +
      `📍 Dirección: ${formData.address}, ${formData.sector}, ${formData.province}\n` +
      `💳 Método de Pago: ${formData.paymentMethod}\n` +
      `💰 Total: RD$ ${total.toLocaleString()}\n` +
      `Quedo a la espera de la confirmación de despacho. ¡Muchas gracias!`
    );
    return `https://wa.me/18295553842?text=${text}`;
  };

  return (
    <div
      role="dialog"
      aria-modal="true"
      className="fixed inset-0 z-50 overflow-y-auto bg-black/90 backdrop-blur-md flex items-center justify-center p-4 sm:p-6"
    >
      <div className="fixed inset-0 -z-10" onClick={onClose} />

      <div className="relative bg-[#111111] border border-[#D4AF37]/40 rounded-xl max-w-lg w-full p-6 sm:p-8 shadow-2xl text-center animate-in zoom-in-95 duration-200">
        <div className="mb-4 flex justify-center">
          <BrandLogo variant="monogram" size="md" />
        </div>

        <div className="w-12 h-12 rounded-full bg-[#22c55e]/15 border border-[#22c55e]/40 text-[#22c55e] flex items-center justify-center mx-auto mb-3">
          <CheckCircle2 className="w-7 h-7" />
        </div>

        <span className="text-[10px] text-[#D4AF37] uppercase font-sans tracking-widest font-semibold block">
          Pedido Registrado con Éxito
        </span>
        <h2 className="font-serif text-2xl sm:text-3xl text-[#FAF7F0] mt-1 mb-2 font-normal">
          ¡Gracias, {formData.fullName}!
        </h2>

        <p className="text-xs text-[#B8B8B8] leading-relaxed mb-6">
          Hemos recibido tu solicitud de fragancias de lujo. Tu orden ha sido asignada a nuestro centro de despacho en Piantini, Santo Domingo.
        </p>

        {/* Order Details Receipt Box */}
        <div className="bg-[#080808] border border-[#262626] rounded-lg p-4 text-left text-xs space-y-2 mb-6">
          <div className="flex justify-between pb-2 border-b border-[#1f1f1f]">
            <span className="text-[#B8B8B8]">Número de Orden:</span>
            <span className="font-mono text-[#D4AF37] font-bold">{orderId}</span>
          </div>

          <div className="flex justify-between pb-2 border-b border-[#1f1f1f]">
            <span className="text-[#B8B8B8]">Total a Pagar:</span>
            <span className="font-mono text-[#FAF7F0] font-bold tabular-nums">
              RD$ {total.toLocaleString()}
            </span>
          </div>

          <div className="flex justify-between pb-2 border-b border-[#1f1f1f]">
            <span className="text-[#B8B8B8]">Destino de Entrega:</span>
            <span className="text-[#FAF7F0] text-right truncate max-w-[200px]">
              {formData.sector}, {formData.province}
            </span>
          </div>

          <div className="flex justify-between">
            <span className="text-[#B8B8B8]">Método de Pago:</span>
            <span className="text-[#FAF7F0] capitalize">
              {formData.paymentMethod === 'contra-entrega'
                ? 'Contra Entrega en SD'
                : formData.paymentMethod === 'transferencia'
                ? 'Transferencia Bancaria RD'
                : 'Coordinado por WhatsApp'}
            </span>
          </div>
        </div>

        {/* Payment instructions if bank transfer */}
        {formData.paymentMethod === 'transferencia' && (
          <div className="bg-[#141414] border border-[#D4AF37]/30 rounded-lg p-3 text-left text-xs mb-6 space-y-2">
            <div className="flex items-center justify-between">
              <span className="font-semibold text-[#FAF7F0]">Banco Popular Dominicano</span>
              <button
                onClick={handleCopyPopular}
                className="text-[10px] text-[#D4AF37] flex items-center gap-1 hover:underline cursor-pointer"
              >
                {copiedAccount ? <Check className="w-3 h-3 text-[#22c55e]" /> : <Copy className="w-3 h-3" />}
                <span>{copiedAccount ? 'Copiada' : 'Copiar Cuenta'}</span>
              </button>
            </div>
            <p className="text-[11px] text-[#B8B8B8]">
              Cta. Corriente en DOP: <strong className="text-[#FAF7F0] font-mono">812-349812-0</strong> <br />
              Titular: <span className="text-[#FAF7F0]">D’ Victor Fragancias SRL</span> (RNC: 132-94812-4)
            </p>
          </div>
        )}

        {/* Actions */}
        <div className="space-y-3">
          <a
            href={generateWhatsAppConfirmation()}
            target="_blank"
            rel="noopener noreferrer"
            className="w-full py-3 bg-[#25D366] hover:bg-[#20ba59] text-black font-sans text-xs font-semibold uppercase tracking-wider rounded-md flex items-center justify-center gap-2 transition-colors cursor-pointer"
          >
            <MessageCircle className="w-4 h-4" />
            <span>Confirmar Despacho por WhatsApp</span>
          </a>

          <button
            onClick={onClose}
            className="w-full py-2.5 bg-[#1f1f1f] hover:bg-[#2a2a2a] text-[#FAF7F0] text-xs font-sans rounded-md transition-colors cursor-pointer"
          >
            Seguir Explorando Perfumes
          </button>
        </div>
      </div>
    </div>
  );
};
