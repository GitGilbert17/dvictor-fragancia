/**
 * ─────────────────────────────────────────────────────────────────────────────
 * ARCHIVO: src/components/AboutContact.tsx
 * QUÉ ES: Historia de la marca, showroom, políticas, preguntas frecuentes y
 *         formulario de contacto (simulado, sin backend).
 * DÓNDE SE VE: Inicio → bloque 6 ("Sobre Nosotros") y pestaña "Showroom".
 * SE RENDERIZA DESDE: App.tsx (dos veces).
 * PROPS: Ninguna (todo es contenido local).
 * QUÉ TOCAR:
 *   - Preguntas y respuestas → array `faqs`.
 *   - Envío del formulario → `handleContactSubmit` (solo muestra mensaje).
 *   - Historia → bloque "Story Section".
 *   - Dirección, horario y teléfono → tarjeta "Showroom Card".
 *   - WhatsApp → enlace `wa.me` del bloque "Contact Form & WhatsApp Channel".
 * ─────────────────────────────────────────────────────────────────────────────
 */

import React, { useState } from 'react';
import { MapPin, Phone, Mail, Clock, MessageCircle, ChevronDown, ShieldCheck, Truck, RotateCcw, Send, Check } from 'lucide-react';
import { BrandLogo } from './BrandLogo';

export const AboutContact: React.FC = () => {
  const [openFaq, setOpenFaq] = useState<number | null>(0);
  const [formSent, setFormSent] = useState(false);
  const [contactForm, setContactForm] = useState({
    name: '',
    phone: '',
    email: '',
    subject: 'Asesoría Olfativa Personalizada',
    message: '',
  });

  // ── PREGUNTAS FRECUENTES ───────────────────────────────────────────────────
  // Se renderizan como acordeón más abajo (bloque "FAQs Accordion").
  const faqs = [
    {
      q: '¿Cómo garantizan que los perfumes son 100% auténticos y originales?',
      a: 'En D’ Victor Fragancias operamos bajo una política de autenticidad absoluta. Cada botella es importada directamente desde los distribuidores oficiales europeos y estadounidenses de las casas matrices. Todos los frascos conservan su código de lote (Batch Code) original tanto en la caja como grabado en el frasco, perfectamente verificable en bases de datos globales como CheckFresh o CheckCosmetic.',
    },
    {
      q: '¿Cómo funcionan los envíos en Santo Domingo y hacia las provincias de República Dominicana?',
      a: 'En el Gran Santo Domingo contamos con mensajería privada express el mismo día para pedidos confirmados antes de las 3:00 PM. Para el resto de las provincias (Santiago, Punta Cana, La Romana, San Francisco de Macorís, etc.) despachamos vía Metro Pac, Caribe Pack o BM Cargo en 24 a 48 horas con guía de rastreo asegurada.',
    },
    {
      q: '¿Tienen tienda física donde pueda probar los aromas?',
      a: 'Sí, disponemos de un exclusivo Showroom & Private Atelier en el sector de Piantini, Santo Domingo. Atendemos mediante cita previa para ofrecer catas olfativas personalizadas, donde analizamos tu piel y tus notas predilectas en un ambiente privado y sofisticado.',
    },
    {
      q: '¿Qué formas de pago aceptan en República Dominicana?',
      a: 'Aceptamos transferencias y depósitos bancarios directos (Banco Popular Dominicano, Banreservas, BHD León), tarjetas de crédito y débito vía enlace seguro, y pago contra entrega (efectivo o verifone) para entregas en Santo Domingo.',
    },
    {
      q: '¿Cuál es la política de devoluciones y garantía de satisfacción?',
      a: 'Si tu producto llega con algún defecto físico en el atomizador o rotura durante el transporte, lo reemplazamos inmediatamente sin costo adicional. Por motivos de higiene y control de autenticidad, solo se aceptan devoluciones de perfumes con su celofán y precinto de fábrica intactos dentro de los 7 días posteriores a la recepción.',
    },
  ];

  // ── FORMULARIO DE CONTACTO (SIMULADO) ──────────────────────────────────────
  // No envía a ningún backend: solo muestra el mensaje de éxito y limpia
  // los campos después de 4 segundos.
  const handleContactSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setFormSent(true);
    setTimeout(() => {
      setFormSent(false);
      setContactForm({
        name: '',
        phone: '',
        email: '',
        subject: 'Asesoría Olfativa Personalizada',
        message: '',
      });
    }, 4000);
  };

  return (
    <section id="sobre-nosotros" className="py-16 bg-[#050505] border-t border-[#262626]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-20">
        {/* Story Section */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          <div className="lg:col-span-5 flex flex-col items-center text-center p-8 bg-[#111111] rounded-xl border border-[#262626] relative overflow-hidden">
            <div className="absolute top-0 right-0 w-32 h-32 bg-[#D4AF37]/10 rounded-full blur-2xl" />
            <BrandLogo variant="primary" size="lg" />
            <div className="mt-6 pt-6 border-t border-[#262626] w-full text-xs text-[#B8B8B8] space-y-2">
              <p className="font-serif italic text-base text-[#FAF7F0]">
                «El perfume es la forma más intensa del recuerdo.»
              </p>
              <p className="text-[11px] text-[#D4AF37] font-sans uppercase tracking-widest font-semibold">
                D’ Victor Private Atelier
              </p>
            </div>
          </div>

          <div className="lg:col-span-7 space-y-4">
            <span className="text-[11px] font-sans tracking-[0.28em] text-[#D4AF37] uppercase font-semibold">
              Nuestra Esencia
            </span>
            <h2 className="font-serif text-3xl sm:text-4xl text-[#FAF7F0] font-normal leading-tight">
              La Historia de D’ Victor Fragancias
            </h2>
            <div className="space-y-4 text-xs sm:text-sm text-[#B8B8B8] font-light leading-relaxed">
              <p>
                D’ Victor Fragancias nació en Santo Domingo como respuesta a una necesidad evidente entre los conocedores más exigentes de República Dominicana: el acceso fidedigno, transparente y sin concesiones a la alta perfumería de autor.
              </p>
              <p>
                Seleccionamos cada pieza de nuestro catálogo como quien cura una colección de arte. Desde las casas centenarias de París y Londres hasta las vanguardias nicho de Medio Oriente e Italia, nuestro compromiso inquebrantable es la <strong className="text-[#FAF7F0] font-medium">autenticidad certificada</strong> y una experiencia de atención tan distinguida como los aromas que custodiamos.
              </p>
              <p>
                Hoy servimos con orgullo a miles de clientes en todo el territorio nacional, combinando el encanto y la hospitalidad dominicana con el rigor olfativo más exigente del mundo.
              </p>
            </div>

            <div className="pt-4 flex flex-wrap gap-4 text-xs">
              <div className="px-4 py-2 rounded bg-[#111111] border border-[#262626] flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-[#D4AF37]" />
                <span className="text-[#FAF7F0]">100% Autenticidad Garantizada</span>
              </div>
              <div className="px-4 py-2 rounded bg-[#111111] border border-[#262626] flex items-center gap-2">
                <Truck className="w-4 h-4 text-[#D4AF37]" />
                <span className="text-[#FAF7F0]">Envíos a todo el país</span>
              </div>
            </div>
          </div>
        </div>

        {/* Showroom Info & Policies Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Showroom Card */}
          <div className="p-6 bg-[#111111] rounded-xl border border-[#262626] space-y-4">
            <div className="flex items-center gap-2.5 text-[#D4AF37]">
              <MapPin className="w-5 h-5" />
              <h3 className="font-serif text-base text-[#FAF7F0] font-semibold">
                Showroom Piantini
              </h3>
            </div>
            <p className="text-xs text-[#B8B8B8] leading-relaxed">
              Calle Federico Geraldino esq. Av. Roberto Pastoriza, Piantini, Santo Domingo, D.N., República Dominicana.
            </p>
            <div className="text-xs text-[#B8B8B8] space-y-1 pt-2 border-t border-[#1f1f1f]">
              <p className="flex items-center gap-2">
                <Clock className="w-3.5 h-3.5 text-[#D4AF37]" />
                <span>Lunes a Sábado: 10:00 AM - 7:30 PM</span>
              </p>
              <p className="flex items-center gap-2">
                <Phone className="w-3.5 h-3.5 text-[#D4AF37]" />
                <span className="font-mono text-[#FAF7F0]">+1 (829) 555-DVIC (3842)</span>
              </p>
            </div>
          </div>

          {/* Delivery Policy Card */}
          <div className="p-6 bg-[#111111] rounded-xl border border-[#262626] space-y-4">
            <div className="flex items-center gap-2.5 text-[#D4AF37]">
              <Truck className="w-5 h-5" />
              <h3 className="font-serif text-base text-[#FAF7F0] font-semibold">
                Políticas de Entrega
              </h3>
            </div>
            <div className="text-xs text-[#B8B8B8] space-y-2 leading-relaxed">
              <p>
                <strong className="text-[#FAF7F0]">Gran Santo Domingo:</strong> Entrega el mismo día ordenando antes de las 3:00 PM. Envío express gratis a partir de RD$ 8,000.
              </p>
              <p>
                <strong className="text-[#FAF7F0]">Provincias (Santiago, Bávaro, etc.):</strong> 24 a 48 horas mediante Metro Pac o Caribe Pack con seguro de mercancía total.
              </p>
            </div>
          </div>

          {/* Returns & Warranty Card */}
          <div className="p-6 bg-[#111111] rounded-xl border border-[#262626] space-y-4">
            <div className="flex items-center gap-2.5 text-[#D4AF37]">
              <RotateCcw className="w-5 h-5" />
              <h3 className="font-serif text-base text-[#FAF7F0] font-semibold">
                Garantía y Devoluciones
              </h3>
            </div>
            <div className="text-xs text-[#B8B8B8] space-y-2 leading-relaxed">
              <p>
                Cada fragancia sale con sello de seguridad inviolable. Ofrecemos 7 días de garantía para cambios si el producto conserva su envoltura y precinto original.
              </p>
              <p className="text-[#F5E6B3]">
                Garantía total de reemplazo inmediato en caso de anomalía en el atomizador de fábrica.
              </p>
            </div>
          </div>
        </div>

        {/* FAQs Accordion */}
        <div className="max-w-3xl mx-auto space-y-6">
          <div className="text-center">
            <span className="text-[11px] font-sans tracking-[0.28em] text-[#D4AF37] uppercase font-semibold">
              Claridad y Confianza
            </span>
            <h3 className="font-serif text-2xl sm:text-3xl text-[#FAF7F0] mt-1 font-normal">
              Preguntas Frecuentes
            </h3>
          </div>

          <div className="space-y-3">
            {faqs.map((faq, idx) => (
              <div
                key={idx}
                className="bg-[#111111] border border-[#262626] rounded-lg overflow-hidden transition-colors"
              >
                <button
                  onClick={() => setOpenFaq(openFaq === idx ? null : idx)}
                  className="w-full p-4 text-left flex items-center justify-between gap-4 font-serif text-sm sm:text-base text-[#FAF7F0] hover:text-[#D4AF37] transition-colors cursor-pointer"
                >
                  <span>{faq.q}</span>
                  <ChevronDown
                    className={`w-4 h-4 text-[#D4AF37] shrink-0 transition-transform duration-200 ${
                      openFaq === idx ? 'rotate-180' : ''
                    }`}
                  />
                </button>
                {openFaq === idx && (
                  <div className="px-4 pb-4 pt-1 text-xs text-[#B8B8B8] font-sans leading-relaxed border-t border-[#1f1f1f]">
                    {faq.a}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Contact Form & WhatsApp Channel */}
        <div className="bg-[#111111] border border-[#262626] rounded-xl p-8 max-w-4xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-center">
            <div className="md:col-span-5 space-y-4">
              <span className="text-[11px] font-sans tracking-[0.28em] text-[#D4AF37] uppercase font-semibold">
                Atención Personalizada
              </span>
              <h3 className="font-serif text-2xl text-[#FAF7F0] font-normal leading-snug">
                ¿Buscas una fragancia única o deseas agendar tu cata?
              </h3>
              <p className="text-xs text-[#B8B8B8] leading-relaxed">
                Escríbenos directamente o déjanos tus datos. Un asesor olfativo se comunicará contigo de manera inmediata.
              </p>

              <div className="pt-2">
                <a
                  href="https://wa.me/18295553842?text=Hola%20D%27%20Victor%20Fragancias,%20deseo%20asesoria%20personalizada"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 px-5 py-3 rounded-md bg-[#25D366] text-black font-sans text-xs font-semibold uppercase tracking-wider hover:bg-[#20ba59] transition-colors"
                >
                  <MessageCircle className="w-4 h-4" />
                  <span>Chat en WhatsApp Oficial</span>
                </a>
              </div>
            </div>

            <div className="md:col-span-7">
              {formSent ? (
                <div className="p-6 bg-[#080808] border border-[#22c55e]/40 rounded-lg text-center space-y-2">
                  <Check className="w-8 h-8 text-[#22c55e] mx-auto" />
                  <p className="font-serif text-lg text-[#FAF7F0]">
                    ¡Mensaje Recibido!
                  </p>
                  <p className="text-xs text-[#B8B8B8]">
                    Uno de nuestros sommeliers olfativos te contactará en breve vía WhatsApp o llamada.
                  </p>
                </div>
              ) : (
                <form onSubmit={handleContactSubmit} className="space-y-3 text-xs">
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-[#B8B8B8] mb-1 font-medium">Nombre</label>
                      <input
                        required
                        type="text"
                        value={contactForm.name}
                        onChange={(e) => setContactForm({ ...contactForm, name: e.target.value })}
                        placeholder="Tu nombre"
                        className="w-full bg-[#080808] border border-[#262626] text-[#FAF7F0] p-2.5 rounded focus:border-[#D4AF37] outline-none"
                      />
                    </div>
                    <div>
                      <label className="block text-[#B8B8B8] mb-1 font-medium">WhatsApp / Teléfono</label>
                      <input
                        required
                        type="tel"
                        value={contactForm.phone}
                        onChange={(e) => setContactForm({ ...contactForm, phone: e.target.value })}
                        placeholder="809-555-0000"
                        className="w-full bg-[#080808] border border-[#262626] text-[#FAF7F0] p-2.5 rounded focus:border-[#D4AF37] outline-none"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-[#B8B8B8] mb-1 font-medium">Motivo de contacto</label>
                    <select
                      value={contactForm.subject}
                      onChange={(e) => setContactForm({ ...contactForm, subject: e.target.value })}
                      className="w-full bg-[#080808] border border-[#262626] text-[#FAF7F0] p-2.5 rounded focus:border-[#D4AF37] outline-none"
                    >
                      <option value="Asesoría Olfativa Personalizada">Asesoría Olfativa Personalizada</option>
                      <option value="Cita para Cata en Showroom Piantini">Cita para Cata en Showroom Piantini</option>
                      <option value="Pregunta sobre Disponibilidad / Encargos Especiales">Pregunta sobre Disponibilidad / Encargos Especiales</option>
                      <option value="Seguimiento de Envío">Seguimiento de Envío</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-[#B8B8B8] mb-1 font-medium">Mensaje</label>
                    <textarea
                      required
                      rows={3}
                      value={contactForm.message}
                      onChange={(e) => setContactForm({ ...contactForm, message: e.target.value })}
                      placeholder="Cuéntanos tus aromas preferidos o tu consulta..."
                      className="w-full bg-[#080808] border border-[#262626] text-[#FAF7F0] p-2.5 rounded focus:border-[#D4AF37] outline-none"
                    />
                  </div>

                  <button
                    type="submit"
                    className="w-full py-3 bg-[#D4AF37] hover:bg-[#FFD76A] text-[#050505] rounded font-sans text-xs font-semibold uppercase tracking-[0.16em] transition-colors flex items-center justify-center gap-2 cursor-pointer"
                  >
                    <Send className="w-4 h-4" />
                    <span>Enviar Solicitud a D’ Victor</span>
                  </button>
                </form>
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
