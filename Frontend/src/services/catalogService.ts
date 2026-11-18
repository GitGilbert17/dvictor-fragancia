/**
 * ─────────────────────────────────────────────────────────────────────────────
 * ARCHIVO: src/services/catalogService.ts
 * QUÉ ES: Capa de catálogo. Copia PERFUMES_DATA a localStorage la primera
 *         vez y luego sirve el CRUD que usa el panel administrativo. La tienda
 *         lee de aquí para reflejar los cambios del admin al instante.
 * DÓNDE SE VE: No se renderiza; lo consumen AdminProducts, ProductFormModal
 *             y App.tsx (catálogo de la tienda).
 * QUÉ TOCAR:
 *   - Migrar a backend real → cambiar las implementaciones por fetch.
 *   - Resetear el catálogo de demo → borrar la clave `dv_catalog` en
 *     localStorage y recargar.
 * ─────────────────────────────────────────────────────────────────────────────
 */

import { Perfume } from '../types';
import { PERFUMES_DATA } from '../data/perfumes';

const CATALOG_KEY = 'dv_catalog';

// ── Utilidades de almacenamiento ─────────────────────────────────────────────
const readCatalog = (): Perfume[] => {
  try {
    const saved = localStorage.getItem(CATALOG_KEY);
    return saved ? (JSON.parse(saved) as Perfume[]) : [];
  } catch {
    return [];
  }
};

const writeCatalog = (perfumes: Perfume[]) => {
  try {
    localStorage.setItem(CATALOG_KEY, JSON.stringify(perfumes));
  } catch {
    // storage unavailable
  }
};

// Siembra el catálogo la primera vez que se usa (o si se borró la clave).
const seedCatalog = () => {
  if (readCatalog().length === 0) {
    writeCatalog(PERFUMES_DATA);
  }
};

// Genera ids legibles a partir del nombre: "Oud Royal Extrait" → "oud-royal-extrait-…"
const generateId = (name: string) => {
  const slug = name
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '');
  return `${slug}-${Math.random().toString(36).slice(2, 6)}`;
};

// ── API pública (todas asíncronas para migrar a backend sin cambios) ────────

// Catálogo completo (tienda y panel).
export const listProducts = async (): Promise<Perfume[]> => {
  seedCatalog();
  return readCatalog();
};

// Un perfume por id (o null si no existe).
export const getProduct = async (id: string): Promise<Perfume | null> => {
  seedCatalog();
  return readCatalog().find((p) => p.id === id) ?? null;
};

// Crea un perfume nuevo. El id se genera automáticamente.
export const createProduct = async (perfume: Omit<Perfume, 'id'>): Promise<Perfume> => {
  seedCatalog();
  const created: Perfume = { ...perfume, id: generateId(perfume.name) };
  writeCatalog([created, ...readCatalog()]);
  return created;
};

// Actualiza un perfume existente (editado desde el panel).
export const updateProduct = async (perfume: Perfume): Promise<Perfume> => {
  seedCatalog();
  const catalog = readCatalog();
  const index = catalog.findIndex((p) => p.id === perfume.id);
  if (index === -1) throw new Error('Perfume no encontrado.');
  catalog[index] = perfume;
  writeCatalog(catalog);
  return perfume;
};

// Elimina un perfume del catálogo.
export const deleteProduct = async (perfumeId: string): Promise<void> => {
  seedCatalog();
  writeCatalog(readCatalog().filter((p) => p.id !== perfumeId));
};
