import React from 'react';
import { BrandLogo } from './BrandLogo';
import { MapPin, Phone, Mail, Instagram, ShieldCheck, Heart } from 'lucide-react';

interface FooterProps {
  onNavigate: (tab: string) => void;
  onOpenBrandSystem: () => void;
  onOpenQuiz: () => void;
}

export const Footer: React.FC<FooterProps> = ({
  onNavigate,
  onOpenBrandSystem,
  onOpenQuiz,
}) => {
  return (
    <footer className="bg-[#050505] border-t border-[#1f1f1f] pt-16 pb-12 text-xs font-sans text-[#B8B8B8]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-10 pb-12 border-b border-[#1f1f1f]">
          {/* Column 1: Brand Info & Heraldry */}
          <div className="lg:col-span-4 space-y-4">
            <BrandLogo variant="horizontal" size="md" />
            <p className="font-serif italic text-sm text-[#F5E6B3] pt-1">
              «La esencia de la elegancia.»
            </p>
            <p className="text-xs text-[#B8B8B8] leading-relaxed max-w-sm">
              Boutique especializada en fragancias de nicho y diseñador en República Dominicana.
              Garantía estricta de 100% originalidad en cada frasco, con envíos express en Santo Domingo y todo el país.
            </p>
            <div className="flex items-center gap-3 pt-2 text-[#D4AF37]">
              <span className="flex items-center gap-1.5 text-[11px] font-medium">
                <ShieldCheck className="w-4 h-4" />
                Certificado de Autenticidad
              </span>
            </div>
          </div>

          {/* Column 2: Navegación Rápida */}
          <div className="lg:col-span-2 space-y-3">
            <span className="text-[10px] uppercase font-sans tracking-[0.2em] text-[#D4AF37] font-semibold block">
              Explorar
            </span>
            <ul className="space-y-2 text-xs">
              <li>
                <button
                  onClick={() => onNavigate('inicio')}
                  className="hover:text-[#FAF7F0] transition-colors"
                >
                  Inicio
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate('catalogo')}
                  className="hover:text-[#FAF7F0] transition-colors"
                >
                  Catálogo Completo
                </button>
              </li>
              <li>
                <button
                  onClick={onOpenQuiz}
                  className="hover:text-[#D4AF37] transition-colors"
                >
                  Asesor Olfativo VIP
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate('sobre-nosotros')}
                  className="hover:text-[#FAF7F0] transition-colors"
                >
                  Sobre Nosotros & Showroom
                </button>
              </li>
              <li>
                <button
                  onClick={onOpenBrandSystem}
                  className="text-[#D4AF37]/80 hover:text-[#D4AF37] transition-colors"
                >
                  Logos del Sistema
                </button>
              </li>
            </ul>
          </div>

          {/* Column 3: Familias & Casas */}
          <div className="lg:col-span-3 space-y-3">
            <span className="text-[10px] uppercase font-sans tracking-[0.2em] text-[#D4AF37] font-semibold block">
              Colecciones
            </span>
            <ul className="space-y-1.5 text-xs text-[#888]">
              <li>Perfumería Nicho de Autor</li>
              <li>Grandes Casas de Diseñador</li>
              <li>Maderas Nobles & Oud de Oriente</li>
              <li>Flores Reales & Rosa Turca</li>
              <li>Cítricos Frescos para el Caribe</li>
              <li>Gourmand, Vainilla & Coñac</li>
            </ul>
          </div>

          {/* Column 4: Contacto Showroom */}
          <div className="lg:col-span-3 space-y-3">
            <span className="text-[10px] uppercase font-sans tracking-[0.2em] text-[#D4AF37] font-semibold block">
              Showroom Piantini
            </span>
            <p className="text-xs text-[#B8B8B8] leading-relaxed">
              Santo Domingo, D.N., República Dominicana. <br />
              Atelier privado con cata olfativa guiada.
            </p>
            <div className="space-y-1 text-xs pt-1">
              <p className="text-[#FAF7F0]">
                WhatsApp: <span className="font-mono text-[#D4AF37]">+1 (829) 555-3842</span>
              </p>
              <p className="text-[#FAF7F0]">
                Email: <span className="font-mono text-[#FAF7F0]/80">contacto@dvictorfragancias.com</span>
              </p>
            </div>
            <div className="pt-2">
              <span className="text-[10px] text-[#B8B8B8] block mb-1">Pagos aceptados en RD:</span>
              <div className="flex flex-wrap gap-1.5 text-[10px] text-[#999]">
                <span className="px-1.5 py-0.5 rounded bg-[#111] border border-[#222]">Banco Popular</span>
                <span className="px-1.5 py-0.5 rounded bg-[#111] border border-[#222]">Banreservas</span>
                <span className="px-1.5 py-0.5 rounded bg-[#111] border border-[#222]">BHD</span>
                <span className="px-1.5 py-0.5 rounded bg-[#111] border border-[#222]">Contra Entrega</span>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-[11px] text-[#666]">
          <p>
            © {new Date().getFullYear()} D’ Victor Fragancias SRL. Todos los derechos reservados. Santo Domingo, República Dominicana.
          </p>
          <div className="flex items-center gap-6">
            <span>Precios en Pesos Dominicanos (DOP)</span>
            <span>·</span>
            <button
              onClick={onOpenBrandSystem}
              className="text-[#D4AF37] hover:underline"
            >
              Identidad de Marca
            </button>
          </div>
        </div>
      </div>
    </footer>
  );
};
