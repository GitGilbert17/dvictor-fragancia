/**
 * ─────────────────────────────────────────────────────────────────────────────
 * ARCHIVO: src/types.ts
 * QUÉ ES: Contrato de datos de toda la app. Aquí se define la forma de un
 *         perfume, una talla, un ítem del carrito, los filtros y el checkout.
 * DÓNDE SE VE: No se renderiza; lo consumen App, Catalog, modales y data.
 * QUÉ TOCAR:
 *   - Agregar un campo a un perfume → interfaz `Perfume`.
 *   - Cambiar filtros del catálogo → interfaz `FilterState`.
 *   - Cambiar datos del checkout → interfaz `CheckoutFormData`.
 * ─────────────────────────────────────────────────────────────────────────────
 */

// ── Categorías cerradas que alimentan los filtros del catálogo ──────────────
export type Gender = 'Hombre' | 'Mujer' | 'Unisex';

export type OlfactoryFamily =
  | 'Amaderada'
  | 'Oriental / Ámbar'
  | 'Floral'
  | 'Cítrica / Fresca'
  | 'Gourmand / Especiada'
  | 'Cuero / Chipre';

export type Concentration =
  | 'Extrait de Parfum'
  | 'Eau de Parfum'
  | 'Parfum'
  | 'Eau de Toilette';

// ── Presentación y precio de una talla (ej. 50 ml / 100 ml) ────────────────
export interface PerfumeSize {
  ml: number;
  priceDOP: number;
  inStock: boolean;
}

// ── Modelo principal: alimenta catálogo, carruseles, ficha, quiz y búsqueda ─
export interface Perfume {
  id: string;
  name: string;
  house: string;
  gender: Gender;
  category: 'Nicho' | 'Diseñador';
  family: OlfactoryFamily;
  concentration: Concentration;
  description: string;
  sizes: PerfumeSize[];
  selectedSizeIndex?: number;
  image: string;
  topNotes: string[];
  heartNotes: string[];
  baseNotes: string[];
  longevity: string; // e.g. "12+ horas"
  sillage: 'Íntima' | 'Moderada' | 'Pronunciada' | 'Enorme';
  bestOccasion: string;
  rating: number;
  reviewsCount: number;
  isBestseller?: boolean;
  isNew?: boolean;
  batchCodeExample: string;
}

// ── Ítem dentro de la bolsa (una talla concreta de un perfume) ──────────────
export interface CartItem {
  perfume: Perfume;
  sizeMl: number;
  priceDOP: number;
  quantity: number;
}

// ── Estado de los filtros del catálogo (Catalog.tsx) ────────────────────────
export interface FilterState {
  search: string;
  gender: 'Todos' | Gender;
  category: 'Todos' | 'Nicho' | 'Diseñador';
  family: 'Todos' | OlfactoryFamily;
  brand: 'Todas' | string;
  maxPrice: number;
  sortBy: 'featured' | 'price-asc' | 'price-desc' | 'name-asc';
}

// ── Datos del checkout dominicano (CartDrawer.tsx) ──────────────────────────
export interface CheckoutFormData {
  fullName: string;
  phone: string;
  email: string;
  province: string;
  sector: string;
  address: string;
  deliveryType: 'express-sd' | 'nacional';
  paymentMethod: 'contra-entrega' | 'transferencia' | 'tarjeta' | 'whatsapp';
  notes?: string;
}
