import { Request, Response } from 'express';
import { ProductRepository } from '../repositories/productRepository.js';

export class ProductController {
  /**
   * GET /api/productos
   * Obtiene la lista de perfumes con soporte para filtros
   */
  static async getProducts(req: Request, res: Response) {
    try {
      const { categoria_id, destacado, disponible, genero, search } = req.query;

      const filters: any = {};
      if (categoria_id) filters.categoria_id = parseInt(categoria_id as string, 10);
      if (destacado !== undefined) filters.destacado = destacado === 'true';
      if (disponible !== undefined) filters.disponible = disponible === 'true';
      if (genero) filters.genero = genero as string;
      if (search) filters.search = search as string;

      const products = await ProductRepository.findAll(filters);
      res.json({
        success: true,
        count: products.length,
        data: products,
      });
    } catch (error: any) {
      console.error('Error al obtener productos:', error);
      res.status(500).json({
        success: false,
        message: 'Error al obtener los productos',
        error: error.message,
      });
    }
  }

  /**
   * GET /api/productos/destacados
   * Obtiene perfumes favoritos/destacados para el cliente
   */
  static async getFeatured(req: Request, res: Response) {
    try {
      const products = await ProductRepository.findFeatured();
      res.json({
        success: true,
        count: products.length,
        data: products,
      });
    } catch (error: any) {
      console.error('Error al obtener productos destacados:', error);
      res.status(500).json({
        success: false,
        message: 'Error al obtener los productos destacados',
        error: error.message,
      });
    }
  }

  /**
   * GET /api/productos/disponibles
   * Obtiene perfumes con disponibilidad inmediata
   */
  static async getAvailable(req: Request, res: Response) {
    try {
      const products = await ProductRepository.findAvailable();
      res.json({
        success: true,
        count: products.length,
        data: products,
      });
    } catch (error: any) {
      console.error('Error al obtener productos disponibles:', error);
      res.status(500).json({
        success: false,
        message: 'Error al obtener los productos disponibles',
        error: error.message,
      });
    }
  }

  /**
   * GET /api/productos/:id
   * Obtiene un perfume por su identificador
   */
  static async getProductById(req: Request, res: Response) {
    try {
      const id = parseInt(req.params.id, 10);
      if (isNaN(id)) {
        return res.status(400).json({
          success: false,
          message: 'El ID proporcionado no es válido',
        });
      }

      const product = await ProductRepository.findById(id);
      if (!product) {
        return res.status(404).json({
          success: false,
          message: 'Producto no encontrado',
        });
      }

      res.json({
        success: true,
        data: product,
      });
    } catch (error: any) {
      console.error('Error al obtener el producto:', error);
      res.status(500).json({
        success: false,
        message: 'Error al obtener el producto',
        error: error.message,
      });
    }
  }

  /**
   * POST /api/productos
   * Crea un nuevo perfume (Panel Administrador)
   */
  static async createProduct(req: Request, res: Response) {
    try {
      const {
        nombre,
        marca,
        categoria_id,
        imagen_url,
        genero,
        concentracion,
        familia_olfativa,
        notas_principales,
        tamano_ml,
        precio,
        stock,
        destacado,
        disponible,
      } = req.body;

      if (!nombre || !marca || precio === undefined || precio === null) {
        return res.status(400).json({
          success: false,
          message: 'Los campos nombre, marca y precio son requeridos.',
        });
      }

      const newProduct = await ProductRepository.create({
        nombre,
        marca,
        categoria_id: categoria_id ? parseInt(categoria_id, 10) : undefined,
        imagen_url,
        genero,
        concentracion,
        familia_olfativa,
        notas_principales,
        tamano_ml: tamano_ml ? parseInt(tamano_ml, 10) : undefined,
        precio: parseFloat(precio),
        stock: stock !== undefined && stock !== null && stock !== '' ? parseInt(stock, 10) : null,
        destacado: destacado !== undefined ? Boolean(destacado) : false,
        disponible: disponible !== undefined ? Boolean(disponible) : true,
      });

      res.status(201).json({
        success: true,
        message: 'Perfume creado exitosamente',
        data: newProduct,
      });
    } catch (error: any) {
      console.error('Error al crear el perfume:', error);
      res.status(500).json({
        success: false,
        message: 'Error al registrar el producto',
        error: error.message,
      });
    }
  }

  /**
   * PUT /api/productos/:id
   * Actualiza los datos de un perfume existente (Panel Administrador)
   */
  static async updateProduct(req: Request, res: Response) {
    try {
      const id = parseInt(req.params.id, 10);
      if (isNaN(id)) {
        return res.status(400).json({
          success: false,
          message: 'El ID no es válido',
        });
      }

      const existing = await ProductRepository.findById(id);
      if (!existing) {
        return res.status(404).json({
          success: false,
          message: 'Producto no encontrado para actualizar',
        });
      }

      const body = { ...req.body };
      if (body.categoria_id !== undefined && body.categoria_id !== null && body.categoria_id !== '') {
        body.categoria_id = parseInt(body.categoria_id, 10);
      }
      if (body.tamano_ml !== undefined && body.tamano_ml !== null && body.tamano_ml !== '') {
        body.tamano_ml = parseInt(body.tamano_ml, 10);
      }
      if (body.precio !== undefined && body.precio !== null && body.precio !== '') {
        body.precio = parseFloat(body.precio);
      }
      if (body.stock !== undefined) {
        body.stock = body.stock === null || body.stock === '' ? null : parseInt(body.stock, 10);
      }

      const updated = await ProductRepository.update(id, body);
      res.json({
        success: true,
        message: 'Perfume actualizado exitosamente',
        data: updated,
      });
    } catch (error: any) {
      console.error('Error al actualizar producto:', error);
      res.status(500).json({
        success: false,
        message: 'Error al actualizar el producto',
        error: error.message,
      });
    }
  }

  /**
   * DELETE /api/productos/:id
   * Elimina un perfume (Panel Administrador)
   */
  static async deleteProduct(req: Request, res: Response) {
    try {
      const id = parseInt(req.params.id, 10);
      if (isNaN(id)) {
        return res.status(400).json({
          success: false,
          message: 'El ID no es válido',
        });
      }

      const existing = await ProductRepository.findById(id);
      if (!existing) {
        return res.status(404).json({
          success: false,
          message: 'Producto no encontrado para eliminar',
        });
      }

      const deleted = await ProductRepository.delete(id);
      res.json({
        success: true,
        message: 'Perfume eliminado exitosamente del catálogo',
        data: deleted,
      });
    } catch (error: any) {
      console.error('Error al eliminar producto:', error);
      res.status(500).json({
        success: false,
        message: 'Error al eliminar el producto',
        error: error.message,
      });
    }
  }

  /**
   * PATCH /api/productos/:id/toggle-disponible
   * Alterna rápidamente el estado disponible / agotado
   */
  static async toggleAvailability(req: Request, res: Response) {
    try {
      const id = parseInt(req.params.id, 10);
      if (isNaN(id)) {
        return res.status(400).json({ success: false, message: 'ID no válido' });
      }

      const updated = await ProductRepository.toggleAvailability(id);
      if (!updated) {
        return res.status(404).json({ success: false, message: 'Producto no encontrado' });
      }

      res.json({
        success: true,
        message: `Estado de disponibilidad cambiado a: ${updated.disponible ? 'Disponible' : 'Agotado'}`,
        data: updated,
      });
    } catch (error: any) {
      console.error('Error al alternar disponibilidad:', error);
      res.status(500).json({ success: false, message: 'Error interno', error: error.message });
    }
  }

  /**
   * PATCH /api/productos/:id/toggle-destacado
   * Alterna rápidamente el estado destacado (favorito)
   */
  static async toggleFeatured(req: Request, res: Response) {
    try {
      const id = parseInt(req.params.id, 10);
      if (isNaN(id)) {
        return res.status(400).json({ success: false, message: 'ID no válido' });
      }

      const updated = await ProductRepository.toggleFeatured(id);
      if (!updated) {
        return res.status(404).json({ success: false, message: 'Producto no encontrado' });
      }

      res.json({
        success: true,
        message: `Producto ${updated.destacado ? 'marcado como Destacado/Favorito' : 'retirado de Destacados'}`,
        data: updated,
      });
    } catch (error: any) {
      console.error('Error al alternar destacado:', error);
      res.status(500).json({ success: false, message: 'Error interno', error: error.message });
    }
  }
}
