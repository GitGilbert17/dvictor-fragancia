import { prisma, isDatabaseReady } from '../config/prisma.js';
import { INITIAL_PRODUCTS, SEED_CATEGORIES, SeedProduct } from '../data/seedData.js';
import { serializeItem } from '../utils/serializer.js';

export interface ProductInput {
  nombre: string;
  marca: string;
  categoria_id?: number | bigint;
  imagen_url?: string;
  genero?: string;
  concentracion?: string;
  familia_olfativa?: string;
  notas_principales?: string;
  tamano_ml?: number;
  precio: number;
  destacado?: boolean;
  disponible?: boolean;
}

export interface ProductFilters {
  categoria_id?: number;
  destacado?: boolean;
  disponible?: boolean;
  genero?: string;
  search?: string;
}

// Estado en memoria para desarrollo / fallback sin base de datos activa
let localIdCounter = 1;
let localCategories = [...SEED_CATEGORIES];
let localProducts = INITIAL_PRODUCTS.map((p, idx) => {
  const cat = localCategories.find((c) => c.nombre === p.categoriaNombre) || localCategories[0];
  return {
    id: idx + 1,
    categoria_id: cat.id,
    usuario_id: null,
    nombre: p.nombre,
    marca: p.marca,
    imagen_url: p.imagen_url,
    genero: p.genero,
    concentracion: p.concentracion,
    familia_olfativa: p.familia_olfativa,
    notas_principales: p.notas_principales,
    tamano_ml: p.tamano_ml,
    precio: p.precio,
    destacado: p.destacado,
    disponible: p.disponible,
    fecha_creacion: new Date().toISOString(),
    categoria: { id: cat.id, nombre: cat.nombre },
  };
});
localIdCounter = localProducts.length + 1;

export class ProductRepository {
  /**
   * Obtiene todos los productos con filtros opcionales
   */
  static async findAll(filters: ProductFilters = {}) {
    if (isDatabaseReady()) {
      const where: any = {};

      if (filters.categoria_id !== undefined) {
        where.categoria_id = BigInt(filters.categoria_id);
      }
      if (filters.destacado !== undefined) {
        where.destacado = filters.destacado;
      }
      if (filters.disponible !== undefined) {
        where.disponible = filters.disponible;
      }
      if (filters.genero) {
        where.genero = filters.genero;
      }
      if (filters.search) {
        where.OR = [
          { nombre: { contains: filters.search, mode: 'insensitive' } },
          { marca: { contains: filters.search, mode: 'insensitive' } },
          { familia_olfativa: { contains: filters.search, mode: 'insensitive' } },
        ];
      }

      const products = await prisma.producto.findMany({
        where,
        include: {
          categoria: true,
        },
        orderBy: {
          id: 'desc',
        },
      });

      return serializeItem(products);
    }

    // Modo local / fallback
    let list = [...localProducts];

    if (filters.categoria_id !== undefined) {
      list = list.filter((p) => Number(p.categoria_id) === Number(filters.categoria_id));
    }
    if (filters.destacado !== undefined) {
      list = list.filter((p) => p.destacado === filters.destacado);
    }
    if (filters.disponible !== undefined) {
      list = list.filter((p) => p.disponible === filters.disponible);
    }
    if (filters.genero) {
      list = list.filter((p) => p.genero?.toLowerCase() === filters.genero?.toLowerCase());
    }
    if (filters.search) {
      const q = filters.search.toLowerCase();
      list = list.filter(
        (p) =>
          p.nombre?.toLowerCase().includes(q) ||
          p.marca?.toLowerCase().includes(q) ||
          p.familia_olfativa?.toLowerCase().includes(q) ||
          p.notas_principales?.toLowerCase().includes(q)
      );
    }

    return serializeItem(list);
  }

  /**
   * Obtiene los productos destacados (favoritos)
   */
  static async findFeatured() {
    return this.findAll({ destacado: true });
  }

  /**
   * Obtiene los productos disponibles en inventario
   */
  static async findAvailable() {
    return this.findAll({ disponible: true });
  }

  /**
   * Busca un producto por ID
   */
  static async findById(id: number | bigint) {
    if (isDatabaseReady()) {
      const product = await prisma.producto.findUnique({
        where: { id: BigInt(id) },
        include: { categoria: true },
      });
      return product ? serializeItem(product) : null;
    }

    const found = localProducts.find((p) => Number(p.id) === Number(id));
    return found ? serializeItem(found) : null;
  }

  /**
   * Crea un nuevo producto
   */
  static async create(data: ProductInput) {
    if (isDatabaseReady()) {
      const created = await prisma.producto.create({
        data: {
          nombre: data.nombre,
          marca: data.marca,
          categoria_id: data.categoria_id ? BigInt(data.categoria_id) : null,
          imagen_url: data.imagen_url || '/assets/images/hero_luxury_perfume_1793299734093.jpg',
          genero: data.genero || 'Unisex',
          concentracion: data.concentracion || 'Eau de Parfum',
          familia_olfativa: data.familia_olfativa || 'Amaderada',
          notas_principales: data.notas_principales || '',
          tamano_ml: data.tamano_ml || 50,
          precio: data.precio,
          destacado: data.destacado ?? false,
          disponible: data.disponible ?? true,
        },
        include: { categoria: true },
      });
      return serializeItem(created);
    }

    const catId = data.categoria_id ? Number(data.categoria_id) : 1;
    const cat = localCategories.find((c) => c.id === catId) || localCategories[0];
    const newProduct = {
      id: localIdCounter++,
      categoria_id: cat.id,
      usuario_id: null,
      nombre: data.nombre,
      marca: data.marca,
      imagen_url: data.imagen_url || '/assets/images/hero_luxury_perfume_1793299734093.jpg',
      genero: data.genero || 'Unisex',
      concentracion: data.concentracion || 'Eau de Parfum',
      familia_olfativa: data.familia_olfativa || 'Amaderada',
      notas_principales: data.notas_principales || '',
      tamano_ml: data.tamano_ml || 50,
      precio: Number(data.precio),
      destacado: data.destacado ?? false,
      disponible: data.disponible ?? true,
      fecha_creacion: new Date().toISOString(),
      categoria: { id: cat.id, nombre: cat.nombre },
    };

    localProducts.unshift(newProduct);
    return serializeItem(newProduct);
  }

  /**
   * Actualiza un producto existente
   */
  static async update(id: number | bigint, data: Partial<ProductInput>) {
    if (isDatabaseReady()) {
      const updateData: any = {};
      if (data.nombre !== undefined) updateData.nombre = data.nombre;
      if (data.marca !== undefined) updateData.marca = data.marca;
      if (data.categoria_id !== undefined) updateData.categoria_id = data.categoria_id ? BigInt(data.categoria_id) : null;
      if (data.imagen_url !== undefined) updateData.imagen_url = data.imagen_url;
      if (data.genero !== undefined) updateData.genero = data.genero;
      if (data.concentracion !== undefined) updateData.concentracion = data.concentracion;
      if (data.familia_olfativa !== undefined) updateData.familia_olfativa = data.familia_olfativa;
      if (data.notas_principales !== undefined) updateData.notas_principales = data.notas_principales;
      if (data.tamano_ml !== undefined) updateData.tamano_ml = data.tamano_ml;
      if (data.precio !== undefined) updateData.precio = data.precio;
      if (data.destacado !== undefined) updateData.destacado = data.destacado;
      if (data.disponible !== undefined) updateData.disponible = data.disponible;

      const updated = await prisma.producto.update({
        where: { id: BigInt(id) },
        data: updateData,
        include: { categoria: true },
      });
      return serializeItem(updated);
    }

    const index = localProducts.findIndex((p) => Number(p.id) === Number(id));
    if (index === -1) return null;

    const current = localProducts[index];
    const catId = data.categoria_id !== undefined ? Number(data.categoria_id) : current.categoria_id;
    const cat = localCategories.find((c) => c.id === catId) || current.categoria;

    const updated = {
      ...current,
      ...data,
      precio: data.precio !== undefined ? Number(data.precio) : current.precio,
      categoria_id: catId,
      categoria: cat,
    };

    localProducts[index] = updated;
    return serializeItem(updated);
  }

  /**
   * Elimina un producto por ID
   */
  static async delete(id: number | bigint) {
    if (isDatabaseReady()) {
      const deleted = await prisma.producto.delete({
        where: { id: BigInt(id) },
      });
      return serializeItem(deleted);
    }

    const index = localProducts.findIndex((p) => Number(p.id) === Number(id));
    if (index === -1) return null;

    const [deleted] = localProducts.splice(index, 1);
    return serializeItem(deleted);
  }

  /**
   * Alterna el estado de disponibilidad
   */
  static async toggleAvailability(id: number | bigint) {
    const current = await this.findById(id);
    if (!current) return null;
    return this.update(id, { disponible: !current.disponible });
  }

  /**
   * Alterna el estado de destacado (favorito)
   */
  static async toggleFeatured(id: number | bigint) {
    const current = await this.findById(id);
    if (!current) return null;
    return this.update(id, { destacado: !current.destacado });
  }

  /**
   * Lista todas las categorías
   */
  static async findCategories() {
    if (isDatabaseReady()) {
      const categories = await prisma.categoria.findMany({
        orderBy: { id: 'asc' },
      });
      return serializeItem(categories);
    }
    return serializeItem(localCategories);
  }
}
