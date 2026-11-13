import React, { useState, useEffect } from 'react';
import {
  Plus,
  Search,
  Edit2,
  Trash2,
  Star,
  CheckCircle2,
  XCircle,
  RefreshCw,
  SlidersHorizontal,
  Package,
  Layers,
  Sparkles,
  AlertCircle,
  X,
  Upload,
} from 'lucide-react';
import {
  BackendProduct,
  BackendCategory,
  ProductFormData,
  productService,
} from '../services/productService';

interface AdminProductsProps {
  onProductsChanged?: () => void;
}

export const AdminProducts: React.FC<AdminProductsProps> = ({ onProductsChanged }) => {
  const [products, setProducts] = useState<BackendProduct[]>([]);
  const [categories, setCategories] = useState<BackendCategory[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [statusFilter, setStatusFilter] = useState<'all' | 'available' | 'out_of_stock' | 'featured'>('all');

  // Modales
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<BackendProduct | null>(null);
  const [deletingProduct, setDeletingProduct] = useState<BackendProduct | null>(null);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Form State
  const initialFormState: ProductFormData = {
    nombre: '',
    marca: '',
    categoria_id: 1,
    precio: 15000,
    tamano_ml: 50,
    stock: null,
    genero: 'Unisex',
    concentracion: 'Eau de Parfum',
    familia_olfativa: 'Amaderada',
    notas_principales: '',
    imagen_url: '/assets/images/hero_luxury_perfume_1793299734093.jpg',
    destacado: false,
    disponible: true,
  };

  const [formData, setFormData] = useState<ProductFormData>(initialFormState);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3500);
  };

  const loadData = async () => {
    setIsLoading(true);
    try {
      const [prods, cats] = await Promise.all([
        productService.getProducts(),
        productService.getCategories(),
      ]);
      setProducts(prods);
      setCategories(cats);
    } catch (error) {
      console.error('Error al cargar datos administrativos:', error);
      showToast('Error al conectar con el servidor.');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const notifyChange = () => {
    if (onProductsChanged) onProductsChanged();
  };

  // ── Acciones CRUD ──────────────────────────────────────────────────────────

  const handleOpenCreate = () => {
    setEditingProduct(null);
    setFormData(initialFormState);
    setIsFormOpen(true);
  };

  const handleOpenEdit = (prod: BackendProduct) => {
    setEditingProduct(prod);
    setFormData({
      nombre: prod.nombre,
      marca: prod.marca,
      categoria_id: prod.categoria_id ? Number(prod.categoria_id) : 1,
      precio: Number(prod.precio),
      tamano_ml: prod.tamano_ml || 50,
      stock: prod.stock ?? null,
      genero: prod.genero || 'Unisex',
      concentracion: prod.concentracion || 'Eau de Parfum',
      familia_olfativa: prod.familia_olfativa || 'Amaderada',
      notas_principales: prod.notas_principales || '',
      imagen_url: prod.imagen_url || '/assets/images/hero_luxury_perfume_1793299734093.jpg',
      destacado: prod.destacado ?? false,
      disponible: prod.disponible ?? true,
    });
    setIsFormOpen(true);
  };

  const handleSaveProduct = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.nombre.trim() || !formData.marca.trim()) {
      alert('Por favor completa el nombre y la marca del perfume.');
      return;
    }

    setIsSubmitting(true);
    try {
      if (editingProduct) {
        await productService.updateProduct(editingProduct.id, formData);
        showToast(`Perfume "${formData.nombre}" actualizado.`);
      } else {
        await productService.createProduct(formData);
        showToast(`Perfume "${formData.nombre}" agregado con éxito.`);
      }
      setIsFormOpen(false);
      await loadData();
      notifyChange();
    } catch (err: any) {
      alert(err.message || 'Error al guardar el perfume');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDeleteProduct = async () => {
    if (!deletingProduct) return;
    try {
      await productService.deleteProduct(deletingProduct.id);
      showToast(`Perfume "${deletingProduct.nombre}" eliminado del catálogo.`);
      setDeletingProduct(null);
      await loadData();
      notifyChange();
    } catch (err: any) {
      alert(err.message || 'Error al eliminar el perfume');
    }
  };

  const handleToggleAvailability = async (prod: BackendProduct) => {
    try {
      await productService.toggleAvailability(prod.id);
      setProducts((prev) =>
        prev.map((p) => (p.id === prod.id ? { ...p, disponible: !p.disponible } : p))
      );
      showToast(
        `"${prod.nombre}" ahora está ${!prod.disponible ? 'Disponible' : 'Agotado'}`
      );
      notifyChange();
    } catch (err: any) {
      alert(err.message || 'Error al actualizar disponibilidad');
    }
  };

  const handleToggleFeatured = async (prod: BackendProduct) => {
    try {
      await productService.toggleFeatured(prod.id);
      setProducts((prev) =>
        prev.map((p) => (p.id === prod.id ? { ...p, destacado: !p.destacado } : p))
      );
      showToast(
        `"${prod.nombre}" ${!prod.destacado ? 'destacado en favoritos' : 'retirado de favoritos'}`
      );
      notifyChange();
    } catch (err: any) {
      alert(err.message || 'Error al actualizar destacado');
    }
  };

  // ── Filtrado ───────────────────────────────────────────────────────────────

  const filteredProducts = products.filter((p) => {
    const matchSearch =
      p.nombre.toLowerCase().includes(search.toLowerCase()) ||
      p.marca.toLowerCase().includes(search.toLowerCase()) ||
      (p.familia_olfativa && p.familia_olfativa.toLowerCase().includes(search.toLowerCase()));

    const matchCategory =
      selectedCategory === 'all' ||
      (p.categoria && p.categoria.nombre.toLowerCase() === selectedCategory.toLowerCase()) ||
      String(p.categoria_id) === selectedCategory;

    let matchStatus = true;
    if (statusFilter === 'available') matchStatus = p.disponible === true;
    if (statusFilter === 'out_of_stock') matchStatus = p.disponible === false;
    if (statusFilter === 'featured') matchStatus = p.destacado === true;

    return matchSearch && matchCategory && matchStatus;
  });

  // Métricas
  const totalCount = products.length;
  const availableCount = products.filter((p) => p.disponible).length;
  const featuredCount = products.filter((p) => p.destacado).length;
  const outOfStockCount = totalCount - availableCount;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 animate-in fade-in duration-300">
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 bg-[#141414] border border-[#D4AF37] text-[#FAF7F0] px-4 py-3 rounded-lg shadow-2xl flex items-center gap-3 animate-in slide-in-from-bottom-5">
          <Sparkles className="w-5 h-5 text-[#D4AF37]" />
          <span className="text-sm font-medium">{toastMessage}</span>
        </div>
      )}

      {/* Header & Title */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-6 border-b border-[#262626]">
        <div>
          <div className="flex items-center gap-2 text-xs font-mono text-[#D4AF37] uppercase tracking-widest mb-1">
            <Package className="w-4 h-4" />
            <span>Panel de Administración D’ Victor</span>
          </div>
          <h1 className="font-serif text-2xl sm:text-3xl text-[#FAF7F0] font-normal tracking-wide">
            Gestión del Catálogo de Perfumes
          </h1>
          <p className="text-xs text-[#8E8E93] mt-1">
            Administra los perfumes visibles en la tienda: disponibilidad, favoritos destacados, precios e inventario.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={loadData}
            title="Recargar datos del servidor"
            className="p-2.5 bg-[#141414] hover:bg-[#1f1f1f] border border-[#262626] rounded-md text-[#B8B8B8] hover:text-[#FAF7F0] transition-colors cursor-pointer"
          >
            <RefreshCw className={`w-4 h-4 ${isLoading ? 'animate-spin' : ''}`} />
          </button>
          <button
            onClick={handleOpenCreate}
            className="flex items-center gap-2 px-4 py-2.5 bg-gradient-to-r from-[#D4AF37] to-[#B38F24] hover:from-[#FFD76A] hover:to-[#D4AF37] text-[#050505] rounded-md text-xs font-semibold uppercase tracking-wider transition-all duration-300 shadow-[0_4px_14px_rgba(212,175,55,0.25)] cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            <span>Agregar Perfume</span>
          </button>
        </div>
      </div>

      {/* KPI Stats Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 my-6">
        <div className="bg-[#111111] border border-[#262626] rounded-xl p-4">
          <div className="flex items-center justify-between text-xs text-[#8E8E93] mb-1">
            <span>Total Catálogo</span>
            <Layers className="w-4 h-4 text-[#D4AF37]" />
          </div>
          <div className="text-2xl font-bold font-mono text-[#FAF7F0]">{totalCount}</div>
          <span className="text-[10px] text-[#8E8E93]">Fragancias registradas</span>
        </div>

        <div className="bg-[#111111] border border-[#262626] rounded-xl p-4">
          <div className="flex items-center justify-between text-xs text-[#8E8E93] mb-1">
            <span>En Disponibilidad</span>
            <CheckCircle2 className="w-4 h-4 text-[#22c55e]" />
          </div>
          <div className="text-2xl font-bold font-mono text-[#22c55e]">{availableCount}</div>
          <span className="text-[10px] text-[#8E8E93]">Listos para compra inmediata</span>
        </div>

        <div className="bg-[#111111] border border-[#262626] rounded-xl p-4">
          <div className="flex items-center justify-between text-xs text-[#8E8E93] mb-1">
            <span>Favoritos Destacados</span>
            <Star className="w-4 h-4 text-[#D4AF37] fill-[#D4AF37]" />
          </div>
          <div className="text-2xl font-bold font-mono text-[#D4AF37]">{featuredCount}</div>
          <span className="text-[10px] text-[#8E8E93]">Visibles en carrusel principal</span>
        </div>

        <div className="bg-[#111111] border border-[#262626] rounded-xl p-4">
          <div className="flex items-center justify-between text-xs text-[#8E8E93] mb-1">
            <span>Agotados</span>
            <XCircle className="w-4 h-4 text-[#ef4444]" />
          </div>
          <div className="text-2xl font-bold font-mono text-[#ef4444]">{outOfStockCount}</div>
          <span className="text-[10px] text-[#8E8E93]">Requieren reposición</span>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-[#111111] border border-[#262626] rounded-xl p-4 mb-6 flex flex-col md:flex-row gap-4 items-center justify-between">
        <div className="relative w-full md:w-96">
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-[#8E8E93]" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Buscar por nombre, marca o aroma..."
            className="w-full pl-9 pr-4 py-2 bg-[#080808] border border-[#262626] rounded-md text-xs text-[#FAF7F0] placeholder-[#8E8E93] focus:outline-none focus:border-[#D4AF37]"
          />
        </div>

        <div className="flex flex-wrap items-center gap-2 w-full md:w-auto">
          {/* Categoría */}
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="bg-[#080808] border border-[#262626] text-xs text-[#FAF7F0] px-3 py-2 rounded-md focus:outline-none focus:border-[#D4AF37]"
          >
            <option value="all">Todas las Categorías</option>
            <option value="Nicho">Nicho</option>
            <option value="Diseñador">Diseñador</option>
          </select>

          {/* Estado */}
          <div className="flex rounded-md bg-[#080808] border border-[#262626] p-0.5 text-xs">
            <button
              onClick={() => setStatusFilter('all')}
              className={`px-3 py-1.5 rounded transition-colors ${
                statusFilter === 'all' ? 'bg-[#D4AF37] text-[#050505] font-semibold' : 'text-[#B8B8B8] hover:text-[#FAF7F0]'
              }`}
            >
              Todos
            </button>
            <button
              onClick={() => setStatusFilter('available')}
              className={`px-3 py-1.5 rounded transition-colors ${
                statusFilter === 'available' ? 'bg-[#D4AF37] text-[#050505] font-semibold' : 'text-[#B8B8B8] hover:text-[#FAF7F0]'
              }`}
            >
              Disponibles
            </button>
            <button
              onClick={() => setStatusFilter('featured')}
              className={`px-3 py-1.5 rounded transition-colors ${
                statusFilter === 'featured' ? 'bg-[#D4AF37] text-[#050505] font-semibold' : 'text-[#B8B8B8] hover:text-[#FAF7F0]'
              }`}
            >
              Favoritos
            </button>
            <button
              onClick={() => setStatusFilter('out_of_stock')}
              className={`px-3 py-1.5 rounded transition-colors ${
                statusFilter === 'out_of_stock' ? 'bg-[#D4AF37] text-[#050505] font-semibold' : 'text-[#B8B8B8] hover:text-[#FAF7F0]'
              }`}
            >
              Agotados
            </button>
          </div>
        </div>
      </div>

      {/* Table / List */}
      <div className="bg-[#111111] border border-[#262626] rounded-xl overflow-hidden shadow-2xl">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="bg-[#080808] border-b border-[#262626] text-[#8E8E93] uppercase font-mono tracking-wider text-[10px]">
                <th className="py-3.5 px-4">Perfume</th>
                <th className="py-3.5 px-4">Casa / Marca</th>
                <th className="py-3.5 px-4">Categoría / Familia</th>
                <th className="py-3.5 px-4">Presentación</th>
                <th className="py-3.5 px-4">Stock</th>
                <th className="py-3.5 px-4">Precio (DOP)</th>
                <th className="py-3.5 px-4 text-center">Favorito</th>
                <th className="py-3.5 px-4 text-center">Disponibilidad</th>
                <th className="py-3.5 px-4 text-right">Acciones</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#1f1f1f]">
              {isLoading ? (
                <tr>
                  <td colSpan={9} className="py-12 text-center text-[#8E8E93]">
                    <div className="flex flex-col items-center justify-center gap-2">
                      <RefreshCw className="w-6 h-6 animate-spin text-[#D4AF37]" />
                      <span>Cargando catálogo desde el backend...</span>
                    </div>
                  </td>
                </tr>
              ) : filteredProducts.length === 0 ? (
                <tr>
                  <td colSpan={9} className="py-12 text-center text-[#8E8E93]">
                    No se encontraron perfumes con los filtros seleccionados.
                  </td>
                </tr>
              ) : (
                filteredProducts.map((prod) => (
                  <tr key={prod.id} className="hover:bg-[#171717] transition-colors">
                    {/* Thumbnail & Name */}
                    <td className="py-3 px-4">
                      <div className="flex items-center gap-3">
                        <img
                          src={prod.imagen_url || '/assets/images/hero_luxury_perfume_1793299734093.jpg'}
                          alt={prod.nombre}
                          className="w-10 h-10 object-cover rounded bg-[#080808] border border-[#262626]"
                        />
                        <div>
                          <div className="font-serif text-[#FAF7F0] font-medium text-sm">
                            {prod.nombre}
                          </div>
                          <span className="text-[10px] text-[#8E8E93] font-mono">
                            {prod.concentracion || 'Eau de Parfum'}
                          </span>
                        </div>
                      </div>
                    </td>

                    {/* Brand */}
                    <td className="py-3 px-4 text-[#B8B8B8] font-medium">
                      {prod.marca}
                    </td>

                    {/* Category & Family */}
                    <td className="py-3 px-4">
                      <div className="flex flex-col">
                        <span className="inline-flex items-center text-[10px] px-2 py-0.5 rounded w-max bg-[#1f1f1f] text-[#D4AF37] font-semibold mb-0.5">
                          {prod.categoria?.nombre || 'Nicho'}
                        </span>
                        <span className="text-[10px] text-[#8E8E93]">
                          {prod.familia_olfativa || 'Amaderada'}
                        </span>
                      </div>
                    </td>

                    {/* Size */}
                    <td className="py-3 px-4 text-[#B8B8B8] font-mono">
                      {prod.tamano_ml || 50} ml
                    </td>

                    {/* Stock */}
                    <td className="py-3 px-4 text-[#B8B8B8] font-mono">
                      {prod.stock ?? '—'}
                    </td>

                    {/* Price */}
                    <td className="py-3 px-4 text-[#FAF7F0] font-mono font-bold">
                      RD$ {Number(prod.precio).toLocaleString()}
                    </td>

                    {/* Destacado Toggle (Star) */}
                    <td className="py-3 px-4 text-center">
                      <button
                        onClick={() => handleToggleFeatured(prod)}
                        title={prod.destacado ? 'Quitar de favoritos destacados' : 'Marcar como favorito destacado'}
                        className="p-1.5 rounded hover:bg-[#262626] transition-colors cursor-pointer"
                      >
                        <Star
                          className={`w-5 h-5 ${
                            prod.destacado
                              ? 'text-[#D4AF37] fill-[#D4AF37]'
                              : 'text-[#404040] hover:text-[#8E8E93]'
                          }`}
                        />
                      </button>
                    </td>

                    {/* Disponibilidad Toggle */}
                    <td className="py-3 px-4 text-center">
                      <button
                        onClick={() => handleToggleAvailability(prod)}
                        className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-semibold cursor-pointer transition-all ${
                          prod.disponible
                            ? 'bg-[#22c55e]/15 text-[#22c55e] border border-[#22c55e]/30 hover:bg-[#22c55e]/25'
                            : 'bg-[#ef4444]/15 text-[#ef4444] border border-[#ef4444]/30 hover:bg-[#ef4444]/25'
                        }`}
                      >
                        {prod.disponible ? (
                          <>
                            <CheckCircle2 className="w-3 h-3" />
                            <span>Disponible</span>
                          </>
                        ) : (
                          <>
                            <XCircle className="w-3 h-3" />
                            <span>Agotado</span>
                          </>
                        )}
                      </button>
                    </td>

                    {/* Actions */}
                    <td className="py-3 px-4 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <button
                          onClick={() => handleOpenEdit(prod)}
                          title="Editar perfume"
                          className="p-1.5 text-[#B8B8B8] hover:text-[#D4AF37] hover:bg-[#262626] rounded transition-colors cursor-pointer"
                        >
                          <Edit2 className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => setDeletingProduct(prod)}
                          title="Eliminar del catálogo"
                          className="p-1.5 text-[#B8B8B8] hover:text-[#ef4444] hover:bg-[#262626] rounded transition-colors cursor-pointer"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* ── MODAL DE CREAR / EDITAR PERFUME ─────────────────────────────────── */}
      {isFormOpen && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto">
          <div className="relative bg-[#111111] border border-[#262626] rounded-xl max-w-2xl w-full p-6 shadow-2xl my-8 animate-in zoom-in-95">
            <div className="flex items-center justify-between pb-4 border-b border-[#262626] mb-5">
              <h2 className="font-serif text-xl text-[#FAF7F0] font-normal">
                {editingProduct ? 'Editar Perfume' : 'Agregar Nuevo Perfume'}
              </h2>
              <button
                onClick={() => setIsFormOpen(false)}
                className="text-[#8E8E93] hover:text-[#FAF7F0] p-1 rounded"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveProduct} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {/* Nombre */}
                <div>
                  <label className="block text-[10px] text-[#D4AF37] uppercase font-semibold tracking-wider mb-1">
                    Nombre del Perfume *
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.nombre}
                    onChange={(e) => setFormData({ ...formData, nombre: e.target.value })}
                    placeholder="Ej. Tabac Doré Niche Millésime"
                    className="w-full px-3 py-2 bg-[#080808] border border-[#262626] rounded text-xs text-[#FAF7F0] focus:outline-none focus:border-[#D4AF37]"
                  />
                </div>

                {/* Marca */}
                <div>
                  <label className="block text-[10px] text-[#D4AF37] uppercase font-semibold tracking-wider mb-1">
                    Casa Perfumera / Marca *
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.marca}
                    onChange={(e) => setFormData({ ...formData, marca: e.target.value })}
                    placeholder="Ej. Bortnikoff Parfums"
                    className="w-full px-3 py-2 bg-[#080808] border border-[#262626] rounded text-xs text-[#FAF7F0] focus:outline-none focus:border-[#D4AF37]"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                {/* Categoría */}
                <div>
                  <label className="block text-[10px] text-[#D4AF37] uppercase font-semibold tracking-wider mb-1">
                    Categoría
                  </label>
                  <select
                    value={formData.categoria_id}
                    onChange={(e) => setFormData({ ...formData, categoria_id: Number(e.target.value) })}
                    className="w-full px-3 py-2 bg-[#080808] border border-[#262626] rounded text-xs text-[#FAF7F0] focus:outline-none focus:border-[#D4AF37]"
                  >
                    <option value={1}>Nicho</option>
                    <option value={2}>Diseñador</option>
                  </select>
                </div>

                {/* Precio en DOP */}
                <div>
                  <label className="block text-[10px] text-[#D4AF37] uppercase font-semibold tracking-wider mb-1">
                    Precio (RD$) *
                  </label>
                  <input
                    type="number"
                    required
                    min={0}
                    step={100}
                    value={formData.precio}
                    onChange={(e) => setFormData({ ...formData, precio: Number(e.target.value) })}
                    className="w-full px-3 py-2 bg-[#080808] border border-[#262626] rounded text-xs text-[#FAF7F0] font-mono focus:outline-none focus:border-[#D4AF37]"
                  />
                </div>

                {/* Presentación (ml) */}
                <div>
                  <label className="block text-[10px] text-[#D4AF37] uppercase font-semibold tracking-wider mb-1">
                    Tamaño (ml)
                  </label>
                  <input
                    type="number"
                    min={1}
                    value={formData.tamano_ml}
                    onChange={(e) => setFormData({ ...formData, tamano_ml: Number(e.target.value) })}
                    className="w-full px-3 py-2 bg-[#080808] border border-[#262626] rounded text-xs text-[#FAF7F0] font-mono focus:outline-none focus:border-[#D4AF37]"
                  />
                </div>

                {/* Stock */}
                <div>
                  <label className="block text-[10px] text-[#D4AF37] uppercase font-semibold tracking-wider mb-1">
                    Stock
                  </label>
                  <input
                    type="number"
                    min={0}
                    value={formData.stock ?? ''}
                    onChange={(e) => {
                      const v = e.target.value;
                      setFormData({ ...formData, stock: v === '' ? null : Number(v) });
                    }}
                    placeholder="Ej. 10"
                    className="w-full px-3 py-2 bg-[#080808] border border-[#262626] rounded text-xs text-[#FAF7F0] font-mono focus:outline-none focus:border-[#D4AF37]"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                {/* Género */}
                <div>
                  <label className="block text-[10px] text-[#D4AF37] uppercase font-semibold tracking-wider mb-1">
                    Género
                  </label>
                  <select
                    value={formData.genero}
                    onChange={(e) => setFormData({ ...formData, genero: e.target.value })}
                    className="w-full px-3 py-2 bg-[#080808] border border-[#262626] rounded text-xs text-[#FAF7F0] focus:outline-none focus:border-[#D4AF37]"
                  >
                    <option value="Unisex">Unisex</option>
                    <option value="Hombre">Hombre</option>
                    <option value="Mujer">Mujer</option>
                  </select>
                </div>

                {/* Concentración */}
                <div>
                  <label className="block text-[10px] text-[#D4AF37] uppercase font-semibold tracking-wider mb-1">
                    Concentración
                  </label>
                  <select
                    value={formData.concentracion}
                    onChange={(e) => setFormData({ ...formData, concentracion: e.target.value })}
                    className="w-full px-3 py-2 bg-[#080808] border border-[#262626] rounded text-xs text-[#FAF7F0] focus:outline-none focus:border-[#D4AF37]"
                  >
                    <option value="Extrait de Parfum">Extrait de Parfum</option>
                    <option value="Eau de Parfum">Eau de Parfum</option>
                    <option value="Parfum">Parfum</option>
                    <option value="Eau de Toilette">Eau de Toilette</option>
                  </select>
                </div>

                {/* Familia Olfativa */}
                <div>
                  <label className="block text-[10px] text-[#D4AF37] uppercase font-semibold tracking-wider mb-1">
                    Familia Olfativa
                  </label>
                  <select
                    value={formData.familia_olfativa}
                    onChange={(e) => setFormData({ ...formData, familia_olfativa: e.target.value })}
                    className="w-full px-3 py-2 bg-[#080808] border border-[#262626] rounded text-xs text-[#FAF7F0] focus:outline-none focus:border-[#D4AF37]"
                  >
                    <option value="Amaderada">Amaderada</option>
                    <option value="Oriental / Ámbar">Oriental / Ámbar</option>
                    <option value="Floral">Floral</option>
                    <option value="Cítrica / Fresca">Cítrica / Fresca</option>
                    <option value="Gourmand / Especiada">Gourmand / Especiada</option>
                    <option value="Cuero / Chipre">Cuero / Chipre</option>
                  </select>
                </div>
              </div>

              {/* Notas principales */}
              <div>
                <label className="block text-[10px] text-[#D4AF37] uppercase font-semibold tracking-wider mb-1">
                  Notas Principales (Separadas por comas)
                </label>
                <input
                  type="text"
                  value={formData.notas_principales}
                  onChange={(e) => setFormData({ ...formData, notas_principales: e.target.value })}
                  placeholder="Ej. Tabaco rubio, Vainilla de Tahití, Cacao, Oud Tailandés"
                  className="w-full px-3 py-2 bg-[#080808] border border-[#262626] rounded text-xs text-[#FAF7F0] focus:outline-none focus:border-[#D4AF37]"
                />
              </div>

              {/* URL de Imagen */}
              <div>
                <label className="block text-[10px] text-[#D4AF37] uppercase font-semibold tracking-wider mb-1">
                  URL o Ruta de la Imagen
                </label>
                <input
                  type="text"
                  value={formData.imagen_url}
                  onChange={(e) => setFormData({ ...formData, imagen_url: e.target.value })}
                  placeholder="/assets/images/..."
                  className="w-full px-3 py-2 bg-[#080808] border border-[#262626] rounded text-xs text-[#FAF7F0] focus:outline-none focus:border-[#D4AF37]"
                />
              </div>

              {/* Switches: Destacado & Disponible */}
              <div className="flex flex-col sm:flex-row gap-4 pt-2">
                <label className="flex items-center gap-2 cursor-pointer p-2.5 rounded bg-[#080808] border border-[#262626] flex-1">
                  <input
                    type="checkbox"
                    checked={formData.destacado}
                    onChange={(e) => setFormData({ ...formData, destacado: e.target.checked })}
                    className="accent-[#D4AF37] w-4 h-4"
                  />
                  <div>
                    <span className="text-xs font-semibold text-[#FAF7F0] block">Marcar como Destacado (Favorito)</span>
                    <span className="text-[10px] text-[#8E8E93]">Se mostrará en la sección de favoritos del cliente</span>
                  </div>
                </label>

                <label className="flex items-center gap-2 cursor-pointer p-2.5 rounded bg-[#080808] border border-[#262626] flex-1">
                  <input
                    type="checkbox"
                    checked={formData.disponible}
                    onChange={(e) => setFormData({ ...formData, disponible: e.target.checked })}
                    className="accent-[#22c55e] w-4 h-4"
                  />
                  <div>
                    <span className="text-xs font-semibold text-[#FAF7F0] block">Disponible para la Venta</span>
                    <span className="text-[10px] text-[#8E8E93]">Activa la opción de agregar a la bolsa</span>
                  </div>
                </label>
              </div>

              {/* Botones */}
              <div className="flex items-center justify-end gap-3 pt-4 border-t border-[#262626]">
                <button
                  type="button"
                  onClick={() => setIsFormOpen(false)}
                  className="px-4 py-2 text-xs text-[#B8B8B8] hover:text-[#FAF7F0] transition-colors"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="px-6 py-2 bg-gradient-to-r from-[#D4AF37] to-[#B38F24] hover:from-[#FFD76A] hover:to-[#D4AF37] text-[#050505] rounded text-xs font-semibold uppercase tracking-wider transition-all disabled:opacity-50 cursor-pointer shadow-[0_2px_10px_rgba(212,175,55,0.2)]"
                >
                  {isSubmitting ? 'Guardando...' : editingProduct ? 'Actualizar Perfume' : 'Crear Perfume'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ── MODAL DE CONFIRMACIÓN DE ELIMINACIÓN ────────────────────────────── */}
      {deletingProduct && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-[#111111] border border-[#ef4444]/40 rounded-xl max-w-md w-full p-6 text-center animate-in zoom-in-95">
            <div className="w-12 h-12 rounded-full bg-[#ef4444]/15 border border-[#ef4444]/40 text-[#ef4444] flex items-center justify-center mx-auto mb-4">
              <AlertCircle className="w-6 h-6" />
            </div>
            <h3 className="font-serif text-lg text-[#FAF7F0] mb-2 font-normal">
              ¿Eliminar "{deletingProduct.nombre}"?
            </h3>
            <p className="text-xs text-[#8E8E93] mb-6">
              Esta acción eliminará el perfume del catálogo de forma permanente.
            </p>
            <div className="flex items-center justify-center gap-3">
              <button
                onClick={() => setDeletingProduct(null)}
                className="px-4 py-2 text-xs text-[#B8B8B8] hover:text-[#FAF7F0] border border-[#262626] rounded transition-colors"
              >
                Cancelar
              </button>
              <button
                onClick={handleDeleteProduct}
                className="px-5 py-2 bg-[#ef4444] hover:bg-[#dc2626] text-white text-xs font-semibold rounded uppercase tracking-wider transition-colors cursor-pointer"
              >
                Sí, Eliminar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
