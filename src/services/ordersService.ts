/**
 * ─────────────────────────────────────────────────────────────────────────────
 * ARCHIVO: src/services/ordersService.ts
 * QUÉ ES: Capa de pedidos. Guarda los pedidos reales del checkout en
 *         localStorage con promesas, para migrar a backend después.
 * DÓNDE SE VE: No se renderiza; lo consumen CartDrawer (crear), AccountView
 *             (mis pedidos) y AdminOrders (gestión).
 * QUÉ TOCAR:
 *   - Pedidos de ejemplo para el panel admin → bloque "SEED DE PEDIDOS DEMO".
 *   - Migrar a backend real → cambiar las implementaciones por fetch.
 * ─────────────────────────────────────────────────────────────────────────────
 */

import { Order, OrderItem, OrderStatus } from '../types';

const ORDERS_KEY = 'dv_orders';

// ── Utilidades de almacenamiento ─────────────────────────────────────────────
const readOrders = (): Order[] => {
  try {
    const saved = localStorage.getItem(ORDERS_KEY);
    return saved ? (JSON.parse(saved) as Order[]) : [];
  } catch {
    return [];
  }
};

const writeOrders = (orders: Order[]) => {
  try {
    localStorage.setItem(ORDERS_KEY, JSON.stringify(orders));
  } catch {
    // storage unavailable
  }
};

// ── SEED DE PEDIDOS DEMO ────────────────────────────────────────────────────
// Se siembra una sola vez para que el panel administrativo y las métricas
// tengan datos que mostrar desde el primer uso. Usa el catálogo estático.
const seedOrders = () => {
  const orders = readOrders();
  if (orders.length > 0) return;

  const daysAgo = (n: number) =>
    new Date(Date.now() - n * 24 * 60 * 60 * 1000).toISOString();

  const item = (
    perfumeId: string,
    perfumeName: string,
    house: string,
    image: string,
    sizeMl: number,
    priceDOP: number,
    quantity = 1
  ): OrderItem => ({ perfumeId, perfumeName, house, image, sizeMl, priceDOP, quantity });

  writeOrders([
    {
      id: 'DV-100234',
      userId: 'cliente-demo',
      customerName: 'Laura Peña Gómez',
      customerEmail: 'laura@ejemplo.com',
      customerPhone: '829-555-3842',
      items: [
        item(
          'aeterna-golden-oudh',
          'Aeterna Nº III Golden Oudh',
          'D’ Victor Private Reserve',
          '/src/assets/images/hero_luxury_perfume_1793299734093.jpg',
          100,
          18900
        ),
        item(
          'delina-la-rosee-speciale',
          'Delina La Rosée Petale',
          'Parfums de Marly Paris',
          '/src/assets/images/perfume_parfums_marly_delina_1793299736567.jpg',
          75,
          18400
        ),
      ],
      subtotal: 37300,
      discountPercent: 10,
      discountAmount: 3730,
      shippingCost: 0,
      total: 33570,
      couponCode: 'DVICTOR10',
      shippingAddress: {
        province: 'Distrito Nacional (Santo Domingo)',
        sector: 'Piantini',
        address: 'Calle Federico Geraldino, Torre Áurea, Apto 7B',
        deliveryType: 'express-sd',
      },
      paymentMethod: 'contra-entrega',
      status: 'entregado',
      createdAt: daysAgo(12),
    },
    {
      id: 'DV-100241',
      userId: 'cliente-demo',
      customerName: 'Laura Peña Gómez',
      customerEmail: 'laura@ejemplo.com',
      customerPhone: '829-555-3842',
      items: [
        item(
          'tabac-dore-reserve',
          'Tabac Doré Niche Millèsime',
          'Bortnikoff Parfums',
          '/src/assets/images/campaign_tobacco_gold_1793303201731.jpg',
          50,
          19500
        ),
      ],
      subtotal: 19500,
      discountPercent: 0,
      discountAmount: 0,
      shippingCost: 0,
      total: 19500,
      shippingAddress: {
        province: 'Distrito Nacional (Santo Domingo)',
        sector: 'Piantini',
        address: 'Calle Federico Geraldino, Torre Áurea, Apto 7B',
        deliveryType: 'express-sd',
      },
      paymentMethod: 'transferencia',
      status: 'enviado',
      createdAt: daysAgo(5),
    },
    {
      id: 'DV-100256',
      userId: 'cliente-demo',
      customerName: 'Laura Peña Gómez',
      customerEmail: 'laura@ejemplo.com',
      customerPhone: '829-555-3842',
      items: [
        item(
          'maison-rubis-extrait',
          'Maison Du Rubis Cristallin 540',
          'Maison Francis Kurkdjian',
          '/src/assets/images/perfume_baccarat_rouge_1793299737267.jpg',
          70,
          24800,
          1
        ),
        item(
          'elysium-pour-homme-parfum',
          'Elysium Pour Homme Superiore',
          'Roja Parfums London',
          '/src/assets/images/perfume_tomford_oud_1793299736566.jpg',
          50,
          17500,
          1
        ),
      ],
      subtotal: 42300,
      discountPercent: 0,
      discountAmount: 0,
      shippingCost: 0,
      total: 42300,
      shippingAddress: {
        province: 'Santiago de los Caballeros',
        sector: 'Bella Vista Norte',
        address: 'Av. Circunvalación, Plaza Crystal, Local 4',
        deliveryType: 'nacional',
      },
      paymentMethod: 'contra-entrega',
      status: 'confirmado',
      createdAt: daysAgo(2),
    },
    {
      id: 'DV-100262',
      userId: 'cliente-demo',
      customerName: 'Laura Peña Gómez',
      customerEmail: 'laura@ejemplo.com',
      customerPhone: '829-555-3842',
      items: [
        item(
          'coco-mademoiselle-intense',
          'Coco Mademoiselle L’Intense',
          'Chanel Paris',
          '/src/assets/images/perfume_baccarat_rouge_1793299737267.jpg',
          100,
          13800
        ),
      ],
      subtotal: 13800,
      discountPercent: 0,
      discountAmount: 0,
      shippingCost: 350,
      total: 14150,
      shippingAddress: {
        province: 'Distrito Nacional (Santo Domingo)',
        sector: 'Naco',
        address: 'Calle Máximo Gómez, Edif. Mirador, Apto 3A',
        deliveryType: 'express-sd',
      },
      paymentMethod: 'whatsapp',
      status: 'pendiente',
      createdAt: daysAgo(0),
    },
  ]);
};

// ── API pública (todas asíncronas para migrar a backend sin cambios) ────────

// Todos los pedidos (panel administrativo y métricas).
export const listOrders = async (): Promise<Order[]> => {
  seedOrders();
  return readOrders();
};

// Pedidos de un visitante concreto ("Mis Pedidos" en Mi Cuenta).
export const listOrdersByUser = async (userId: string): Promise<Order[]> => {
  seedOrders();
  return readOrders()
    .filter((o) => o.userId === userId)
    .sort((a, b) => b.createdAt.localeCompare(a.createdAt));
};

// Datos que necesita el checkout para crear el pedido.
export interface CreateOrderInput {
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
  province: string;
  sector: string;
  address: string;
  deliveryType: 'express-sd' | 'nacional';
  paymentMethod: Order['paymentMethod'];
  notes?: string;
}

// Crea un pedido real desde el checkout. Empieza en estado "pendiente".
export const createOrder = async (input: CreateOrderInput): Promise<Order> => {
  seedOrders();
  const order: Order = {
    id: `DV-${Math.floor(100000 + Math.random() * 900000)}`,
    userId: input.userId,
    customerName: input.customerName,
    customerEmail: input.customerEmail,
    customerPhone: input.customerPhone,
    items: input.items,
    subtotal: input.subtotal,
    discountPercent: input.discountPercent,
    discountAmount: input.discountAmount,
    shippingCost: input.shippingCost,
    total: input.total,
    couponCode: input.couponCode,
    shippingAddress: {
      province: input.province,
      sector: input.sector,
      address: input.address,
      deliveryType: input.deliveryType,
    },
    paymentMethod: input.paymentMethod,
    notes: input.notes,
    status: 'pendiente',
    createdAt: new Date().toISOString(),
  };
  writeOrders([order, ...readOrders()]);
  return order;
};

// Cambia el estado de un pedido (panel administrativo).
export const updateOrderStatus = async (
  orderId: string,
  status: OrderStatus
): Promise<Order> => {
  const orders = readOrders();
  const index = orders.findIndex((o) => o.id === orderId);
  if (index === -1) throw new Error('Pedido no encontrado.');
  orders[index] = { ...orders[index], status };
  writeOrders(orders);
  return orders[index];
};
