import { Request, Response } from 'express';
import { ProductRepository } from '../repositories/productRepository.js';

export class CategoryController {
  /**
   * GET /api/categorias
   * Lista todas las categorías disponibles
   */
  static async getCategories(req: Request, res: Response) {
    try {
      const categories = await ProductRepository.findCategories();
      res.json({
        success: true,
        count: categories.length,
        data: categories,
      });
    } catch (error: any) {
      console.error('Error al obtener categorías:', error);
      res.status(500).json({
        success: false,
        message: 'Error al obtener las categorías',
        error: error.message,
      });
    }
  }
}
