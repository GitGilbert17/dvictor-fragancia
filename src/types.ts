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

// ── Usuarios y sesión (login de visitante + panel admin) ───────────────────
export type UserRole = 'cliente' | 'admin';

// Dirección guardada en la cuenta del visitante (checkout y "Mi Cuenta")
export interface Address {
  label: string;
  province: string;
  sector: string;
  address: string;
  isDefault?: boolean;
}

// Usuario público (sin contraseña). Lo consumen Header, CartDrawer y AccountView.
export interface User {
  id: string;
  fullName: string;
  email: string;
  phone: string;
  role: UserRole;
  addresses: Address[];
  createdAt: string;
}

// Registro de nuevos visitantes (AuthModal → authService.register)
export interface RegisterFormData {
  fullName: string;
  email: string;
  phone: string;
  password: string;
}

// ── Pedidos reales (checkout → ordersService → panel admin) ─────────────────
export type OrderStatus =
  | 'pendiente'
  | 'confirmado'
  | 'pagado'
  | 'enviado'
  | 'entregado'
  | 'cancelado';

// Ítem congelado de un pedido (sobrevive aunque el perfume cambie o se borre)
export interface OrderItem {
  perfumeId: string;
  perfumeName: string;
  house: string;
  image: string;
  sizeMl: number;
  priceDOP: number;
  quantity: number;
}

export interface Order {
  id: string;
  userId: string;
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  items: OrderItem[];
  subtotal: number;
  discountPercent: number;
  discountAmount: number;
  shippingCost: number;
  total: number;
  couponCode?: string;
  shippingAddress: {
    province: string;
    sector: string;
    address: string;
    deliveryType: 'express-sd' | 'nacional';
  };
  paymentMethod: CheckoutFormData['paymentMethod'];
  notes?: string;
  status: OrderStatus;
  createdAt: string;
}
