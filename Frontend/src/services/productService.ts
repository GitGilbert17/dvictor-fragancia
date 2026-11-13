/**
 * Servicio de comunicación Frontend <-> Backend para el catálogo de perfumes
 */

import { Perfume, Gender, OlfactoryFamily, Concentration } from '../types';
import { PERFUMES_DATA } from '../data/perfumes';

const API_BASE_URL = (import.meta as any).env?.VITE_API_URL || 'http://localhost:4000/api';

export interface BackendProduct {
  id: number;
  nombre: string;
  marca: string;
  categoria_id?: number | null;
  categoria?: { id: number; nombre: string } | null;
  usuario_id?: string | null;
  imagen_url?: string | null;
  genero?: string | null;
  concentracion?: string | null;
  familia_olfativa?: string | null;
  notas_principales?: string | null;
  tamano_ml?: number | null;
  precio: number;
  stock?: number | null;
  destacado?: boolean;
  disponible?: boolean;
  fecha_creacion?: string;
}

export interface BackendCategory {
  id: number;
  nombre: string;
}

export interface ProductFormData {
  nombre: string;
  marca: string;
  categoria_id?: number;
  imagen_url?: string;
  genero?: string;
  concentracion?: string;
  familia_olfativa?: string;
  notas_principales?: string;
  tamano_ml?: number;
  precio: number;
  stock?: number | null;
  destacado?: boolean;
  disponible?: boolean;
}

/**
 * Convierte un producto del Backend (schema Prisma) al contrato de datos `Perfume` del Frontend
 */
export function backendProductToPerfume(bp: BackendProduct): Perfume {
  // Buscar si ya existía en PERFUMES_DATA para enriquecer notas u opciones si aplica
  const match = PERFUMES_DATA.find(
    (p) =>
      p.name.toLowerCase() === bp.nombre.toLowerCase() ||
      p.id === String(bp.id) ||
      (bp.id && String(bp.id) === p.id)
  );

  const notesList = bp.notas_principales
    ? bp.notas_principales.split(',').map((n) => n.trim()).filter(Boolean)
    : match?.topNotes || ['Aromas Exclusivos'];

  const categoryName = (bp.categoria?.nombre || match?.category || 'Nicho') as 'Nicho' | 'Diseñador';

  return {
    id: String(bp.id),
    name: bp.nombre,
    house: bp.marca,
    gender: (bp.genero || match?.gender || 'Unisex') as Gender,
    category: categoryName === 'Diseñador' ? 'Diseñador' : 'Nicho',
    family: (bp.familia_olfativa || match?.family || 'Amaderada') as OlfactoryFamily,
    concentration: (bp.concentracion || match?.concentration || 'Eau de Parfum') as Concentration,
    description:
      match?.description ||
      `Fragancia de alta distinción creada por ${bp.marca}. Notas olfativas: ${bp.notas_principales || bp.familia_olfativa}.`,
    sizes: [
      {
        ml: bp.tamano_ml || 50,
        priceDOP: Number(bp.precio),
        inStock: bp.disponible ?? true,
      },
      ...(match && match.sizes.length > 1
        ? match.sizes.slice(1).map((s) => ({
            ...s,
            inStock: bp.disponible ?? true,
          }))
        : []),
    ],
    image: bp.imagen_url || match?.image || '/assets/images/hero_luxury_perfume_1793299734093.jpg',
    topNotes: notesList.slice(0, 3),
    heartNotes: match?.heartNotes || notesList.slice(1, 4),
    baseNotes: match?.baseNotes || [bp.familia_olfativa || 'Maderas Nobles', 'Ámbar Cálido'],
    longevity: match?.longevity || '12+ horas',
    sillage: match?.sillage || 'Pronunciada',
    bestOccasion: match?.bestOccasion || 'Ocasiones especiales y uso cotidiano de distinción',
    rating: match?.rating || 4.9,
    reviewsCount: match?.reviewsCount || 24,
    isBestseller: bp.destacado ?? match?.isBestseller ?? false,
    isNew: match?.isNew ?? false,
    batchCodeExample: match?.batchCodeExample || `DV-${bp.id}-2026`,
  };
}

// ── Llamadas API ─────────────────────────────────────────────────────────────

export const productService = {
  /**
   * Obtiene todos los productos del backend
   */
  async getProducts(filters?: {
    categoria_id?: number;
    destacado?: boolean;
    disponible?: boolean;
    genero?: string;
    search?: string;
  }): Promise<BackendProduct[]> {
    try {
      const params = new URLSearchParams();
      if (filters?.categoria_id !== undefined) params.append('categoria_id', String(filters.categoria_id));
      if (filters?.destacado !== undefined) params.append('destacado', String(filters.destacado));
      if (filters?.disponible !== undefined) params.append('disponible', String(filters.disponible));
      if (filters?.genero) params.append('genero', filters.genero);
      if (filters?.search) params.append('search', filters.search);

      const url = `${API_BASE_URL}/productos${params.toString() ? `?${params.toString()}` : ''}`;
      const res = await fetch(url);
      if (!res.ok) throw new Error(`HTTP error ${res.status}`);
      const json = await res.json();
      return json.data || [];
    } catch (error) {
      console.warn('Fallo al conectar con el backend en /api/productos. Usando catálogo estático como respaldo.');
      // Adaptar PERFUMES_DATA a formato BackendProduct
      return PERFUMES_DATA.map((p, idx) => ({
        id: idx + 1,
        nombre: p.name,
        marca: p.house,
        categoria_id: p.category === 'Diseñador' ? 2 : 1,
        categoria: { id: p.category === 'Diseñador' ? 2 : 1, nombre: p.category },
        imagen_url: p.image,
        genero: p.gender,
        concentracion: p.concentration,
        familia_olfativa: p.family,
        notas_principales: p.topNotes.join(', '),
        tamano_ml: p.sizes[0]?.ml || 50,
        precio: p.sizes[0]?.priceDOP || 15000,
        destacado: p.isBestseller ?? false,
        disponible: true,
      }));
    }
  },

  /**
   * Obtiene productos adaptados al tipo `Perfume` para el catálogo del cliente
   */
  async getClientPerfumes(onlyAvailable = false): Promise<Perfume[]> {
    const raw = await this.getProducts(onlyAvailable ? { disponible: true } : undefined);
    return raw.map(backendProductToPerfume);
  },

  /**
   * Obtiene perfumes destacados (favoritos)
   */
  async getFeaturedPerfumes(): Promise<Perfume[]> {
    try {
      const res = await fetch(`${API_BASE_URL}/productos/destacados`);
      if (!res.ok) throw new Error(`HTTP error ${res.status}`);
      const json = await res.json();
      return (json.data as BackendProduct[]).map(backendProductToPerfume);
    } catch {
      return PERFUMES_DATA.filter((p) => p.isBestseller);
    }
  },

  /**
   * Obtiene las categorías
   */
  async getCategories(): Promise<BackendCategory[]> {
    try {
      const res = await fetch(`${API_BASE_URL}/categorias`);
      if (!res.ok) throw new Error(`HTTP error ${res.status}`);
      const json = await res.json();
      return json.data || [];
    } catch {
      return [
        { id: 1, nombre: 'Nicho' },
        { id: 2, nombre: 'Diseñador' },
      ];
    }
  },

  /**
   * Crea un producto (Panel Administrador)
   */
  async createProduct(data: ProductFormData): Promise<BackendProduct> {
    const res = await fetch(`${API_BASE_URL}/productos`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    if (!res.ok) {
      const err = await res.json();
      throw new Error(err.message || 'Error al crear el perfume');
    }
    const json = await res.json();
    return json.data;
  },

  /**
   * Actualiza un producto existente (Panel Administrador)
   */
  async updateProduct(id: number | string, data: Partial<ProductFormData>): Promise<BackendProduct> {
    const res = await fetch(`${API_BASE_URL}/productos/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    if (!res.ok) {
      const err = await res.json();
      throw new Error(err.message || 'Error al actualizar el perfume');
    }
    const json = await res.json();
    return json.data;
  },

  /**
   * Elimina un producto (Panel Administrador)
   */
  async deleteProduct(id: number | string): Promise<void> {
    const res = await fetch(`${API_BASE_URL}/productos/${id}`, {
      method: 'DELETE',
    });
    if (!res.ok) {
      const err = await res.json();
      throw new Error(err.message || 'Error al eliminar el perfume');
    }
  },

  /**
   * Alterna disponibilidad (disponible / agotado)
   */
  async toggleAvailability(id: number | string): Promise<BackendProduct> {
    const res = await fetch(`${API_BASE_URL}/productos/${id}/toggle-disponible`, {
      method: 'PATCH',
    });
    if (!res.ok) {
      const err = await res.json();
      throw new Error(err.message || 'Error al cambiar la disponibilidad');
    }
    const json = await res.json();
    return json.data;
  },

  /**
   * Alterna estado destacado / favorito
   */
  async toggleFeatured(id: number | string): Promise<BackendProduct> {
    const res = await fetch(`${API_BASE_URL}/productos/${id}/toggle-destacado`, {
      method: 'PATCH',
    });
    if (!res.ok) {
      const err = await res.json();
      throw new Error(err.message || 'Error al alternar destacado');
    }
    const json = await res.json();
    return json.data;
  },
};
