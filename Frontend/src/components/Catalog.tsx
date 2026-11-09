/**
 * ─────────────────────────────────────────────────────────────────────────────
 * ARCHIVO: Frontend/src/components/Catalog.tsx
 * QUÉ ES: Catálogo completo con buscador, filtros, orden y grid de tarjetas.
 * DÓNDE SE VE: Inicio → bloque 5 ("Catálogo") y pestaña "Catálogo".
 * SE RENDERIZA DESDE: App.tsx (dos veces).
 * PROPS: perfumes, onSelectPerfume, onAddToCart, wishlist, onToggleWishlist,
 *        initialFilter (opcional; hoy no se usa desde App).
 * QUÉ TOCAR:
 *   - Filtros y orden → estado `filters` + `filteredPerfumes`.
 *   - Barra de búsqueda / género / orden → bloque "Search & Top Action Bar".
 *   - Panel lateral de filtros → bloque "Filters Sidebar".
 *   - Tarjeta de producto → bloque "Product Grid Area".
 *   - Precio máximo del slider → min/max en el input range.
 * ─────────────────────────────────────────────────────────────────────────────
 */

import React, { useState, useMemo } from 'react';
import { Search, SlidersHorizontal, Heart, ShoppingBag, Eye, RotateCcw, Check, Sparkles } from 'lucide-react';
import { Perfume, FilterState, Gender, OlfactoryFamily } from '../types';
import { HOUSES_LIST } from '../data/perfumes';
import { Reveal } from './Reveal';

interface CatalogProps {
  perfumes: Perfume[];
  onSelectPerfume: (perfume: Perfume) => void;
  onAddToCart: (perfume: Perfume, sizeMl: number) => void;
  wishlist: string[];
  onToggleWishlist: (perfumeId: string) => void;
  initialFilter?: Partial<FilterState>;
}

export const Catalog: React.FC<CatalogProps> = ({
  perfumes,
  onSelectPerfume,
  onAddToCart,
  wishlist,
  onToggleWishlist,
  initialFilter,
}) => {
  const [filters, setFilters] = useState<FilterState>({
    search: initialFilter?.search || '',
    gender: initialFilter?.gender || 'Todos',
    category: initialFilter?.category || 'Todos',
    family: initialFilter?.family || 'Todos',
    brand: initialFilter?.brand || 'Todas',
    maxPrice: initialFilter?.maxPrice || 45000,
    sortBy: initialFilter?.sortBy || 'featured',
  });

  const [showFiltersMobile, setShowFiltersMobile] = useState(false);
  const [addedItemNotification, setAddedItemNotification] = useState<string | null>(null);

  const families: OlfactoryFamily[] = [
    'Amaderada',
    'Oriental / Ámbar',
    'Floral',
    'Cítrica / Fresca',
    'Gourmand / Especiada',
    'Cuero / Chipre',
  ];

  // ── LÓGICA DE FILTRADO Y ORDEN ─────────────────────────────────────────────
  // Aplica búsqueda por nombre/casa/familia/notas, género, categoría, familia,
  // casa y precio máximo. Luego ordena según `filters.sortBy`.
  const filteredPerfumes = useMemo(() => {
    return perfumes
      .filter((perfume) => {
        // Search filter
        if (filters.search.trim()) {
          const q = filters.search.toLowerCase();
          const matchName = perfume.name.toLowerCase().includes(q);
          const matchHouse = perfume.house.toLowerCase().includes(q);
          const matchFamily = perfume.family.toLowerCase().includes(q);
          const matchNotes = [
            ...perfume.topNotes,
            ...perfume.heartNotes,
            ...perfume.baseNotes,
          ].some((note) => note.toLowerCase().includes(q));
          if (!matchName && !matchHouse && !matchFamily && !matchNotes) return false;
        }

        // Gender filter
        if (filters.gender !== 'Todos' && perfume.gender !== filters.gender) {
          return false;
        }

        // Category filter
        if (filters.category !== 'Todos' && perfume.category !== filters.category) {
          return false;
        }

        // Olfactory family filter
        if (filters.family !== 'Todos' && perfume.family !== filters.family) {
          return false;
        }

        // Brand filter
        if (filters.brand !== 'Todas' && perfume.house !== filters.brand) {
          return false;
        }

        // Price filter (based on default base size price)
        const basePrice = perfume.sizes[0].priceDOP;
        if (basePrice > filters.maxPrice) {
          return false;
        }

        return true;
      })
      .sort((a, b) => {
        if (filters.sortBy === 'price-asc') {
          return a.sizes[0].priceDOP - b.sizes[0].priceDOP;
        }
        if (filters.sortBy === 'price-desc') {
          return b.sizes[0].priceDOP - a.sizes[0].priceDOP;
        }
        if (filters.sortBy === 'name-asc') {
          return a.name.localeCompare(b.name);
        }
        // Featured
        return (b.isBestseller ? 1 : 0) - (a.isBestseller ? 1 : 0);
      });
  }, [perfumes, filters]);

  // ── AÑADIR RÁPIDO ──────────────────────────────────────────────────────────
  // Añade la primera talla del perfume y muestra "Agregado" por 1.8 s.
  const handleQuickAdd = (e: React.MouseEvent, perfume: Perfume) => {
    e.stopPropagation();
    const defaultSize = perfume.sizes[0];
    onAddToCart(perfume, defaultSize.ml);
    setAddedItemNotification(perfume.id);
    setTimeout(() => {
      setAddedItemNotification(null);
    }, 1800);
  };

  const handleResetFilters = () => {
    setFilters({
      search: '',
      gender: 'Todos',
      category: 'Todos',
      family: 'Todos',
      brand: 'Todas',
      maxPrice: 45000,
      sortBy: 'featured',
    });
  };

  return (
    <section id="catalogo-section" className="py-12 bg-[#050505] min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <Reveal className="text-center max-w-2xl mx-auto mb-10">
          <span className="text-[11px] font-sans tracking-[0.28em] text-[#D4AF37] uppercase font-semibold">
            Colección Selecta
          </span>
          <h2 className="font-serif text-3xl sm:text-4xl lg:text-5xl text-[#FAF7F0] mt-2 mb-3 font-normal">
            Catálogo de Perfumes
          </h2>
          <p className="font-sans text-xs sm:text-sm text-[#B8B8B8] leading-relaxed">
            Precios oficiales en Pesos Dominicanos (RD$). Cada botella incluye certificado de originalidad y número de lote verificable.
          </p>
        </Reveal>

        {/* Search & Top Action Bar */}
        <Reveal delay={0.08} className="bg-[#111111] p-4 rounded-lg border border-[#262626] mb-8 flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4">
          {/* Search Input */}
          <div className="relative flex-1">
            <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-[#B8B8B8]" />
            <input
              type="text"
              value={filters.search}
              onChange={(e) => setFilters({ ...filters, search: e.target.value })}
              placeholder="Buscar por perfume, casa, notas (ej. Oud, Vainilla, Bergamota)..."
              className="w-full bg-[#050505] border border-[#262626] focus:border-[#D4AF37] text-xs sm:text-sm text-[#FAF7F0] pl-10 pr-4 py-2.5 rounded-md outline-none transition-colors placeholder:text-[#666]"
            />
            {filters.search && (
              <button
                onClick={() => setFilters({ ...filters, search: '' })}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-[#B8B8B8] hover:text-[#FAF7F0]"
              >
                Limpiar
              </button>
            )}
          </div>

          {/* Quick Segmented Gender Control */}
          <div className="flex items-center gap-1 bg-[#050505] p-1 rounded-md border border-[#262626] w-full sm:w-auto overflow-x-auto">
            {(['Todos', 'Hombre', 'Mujer', 'Unisex'] as const).map((genderOption) => (
              <button
                key={genderOption}
                onClick={() => setFilters({ ...filters, gender: genderOption })}
                className={`flex-1 sm:flex-initial text-center px-2.5 sm:px-3 py-1.5 text-xs font-sans font-medium rounded transition-colors whitespace-nowrap cursor-pointer ${
                  filters.gender === genderOption
                    ? 'bg-[#D4AF37] text-[#050505] font-semibold shadow-sm'
                    : 'text-[#B8B8B8] hover:text-[#FAF7F0]'
                }`}
              >
                {genderOption}
              </button>
            ))}
          </div>

          {/* Sort & Mobile Filter Toggle */}
          <div className="flex items-center gap-2 w-full sm:w-auto">
            <select
              value={filters.sortBy}
              onChange={(e) =>
                setFilters({ ...filters, sortBy: e.target.value as FilterState['sortBy'] })
              }
              className="flex-1 sm:flex-initial bg-[#050505] border border-[#262626] text-[#FAF7F0] text-xs px-3 py-2.5 rounded-md focus:border-[#D4AF37] outline-none cursor-pointer"
            >
              <option value="featured">Destacados / Más vendidos</option>
              <option value="price-asc">Precio: Menor a Mayor</option>
              <option value="price-desc">Precio: Mayor a Menor</option>
              <option value="name-asc">Nombre: A a la Z</option>
            </select>

            <button
              onClick={() => setShowFiltersMobile(!showFiltersMobile)}
              className="lg:hidden flex items-center justify-center gap-1.5 px-3 py-2.5 bg-[#050505] border border-[#262626] text-xs text-[#D4AF37] rounded-md shrink-0 cursor-pointer"
            >
              <SlidersHorizontal className="w-3.5 h-3.5" />
              <span>Filtros</span>
            </button>
          </div>
        </Reveal>

        {/* Main Grid Layout with Desktop Sidebar Filter */}
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Filters Sidebar (Always visible on desktop, toggleable on mobile) */}
          <Reveal
            as="aside"
            direction="left"
            className={`lg:col-span-1 space-y-6 bg-[#111111] p-5 rounded-lg border border-[#262626] h-fit ${
              showFiltersMobile ? 'block' : 'hidden lg:block'
            }`}
          >
            <div className="flex items-center justify-between pb-3 border-b border-[#262626]">
              <span className="font-serif text-base text-[#FAF7F0] font-semibold tracking-wide">
                Filtros de Búsqueda
              </span>
              <button
                onClick={handleResetFilters}
                className="flex items-center gap-1 text-[11px] text-[#B8B8B8] hover:text-[#D4AF37] transition-colors"
                title="Restablecer todos los filtros"
              >
                <RotateCcw className="w-3 h-3" />
                <span>Restablecer</span>
              </button>
            </div>

            {/* Category / Typology */}
            <div>
              <label className="block text-[11px] font-sans uppercase tracking-wider text-[#D4AF37] font-semibold mb-2">
                Categoría
              </label>
              <div className="space-y-1.5 text-xs">
                {(['Todos', 'Nicho', 'Diseñador'] as const).map((cat) => (
                  <button
                    key={cat}
                    onClick={() => setFilters({ ...filters, category: cat })}
                    className={`block w-full text-left px-2.5 py-1.5 rounded transition-colors ${
                      filters.category === cat
                        ? 'bg-[#D4AF37]/15 text-[#D4AF37] font-semibold'
                        : 'text-[#B8B8B8] hover:text-[#FAF7F0] hover:bg-[#050505]'
                    }`}
                  >
                    {cat === 'Todos' ? 'Todas las Categorías' : `Perfumería ${cat}`}
                  </button>
                ))}
              </div>
            </div>

            {/* Olfactory Family */}
            <div>
              <label className="block text-[11px] font-sans uppercase tracking-wider text-[#D4AF37] font-semibold mb-2">
                Familia Olfativa
              </label>
              <div className="space-y-1 text-xs">
                <button
                  onClick={() => setFilters({ ...filters, family: 'Todos' })}
                  className={`block w-full text-left px-2.5 py-1.5 rounded transition-colors ${
                    filters.family === 'Todos'
                      ? 'bg-[#D4AF37]/15 text-[#D4AF37] font-semibold'
                      : 'text-[#B8B8B8] hover:text-[#FAF7F0] hover:bg-[#050505]'
                  }`}
                >
                  Todas las familias
                </button>
                {families.map((fam) => (
                  <button
                    key={fam}
                    onClick={() => setFilters({ ...filters, family: fam })}
                    className={`block w-full text-left px-2.5 py-1.5 rounded transition-colors ${
                      filters.family === fam
                        ? 'bg-[#D4AF37]/15 text-[#D4AF37] font-semibold'
                        : 'text-[#B8B8B8] hover:text-[#FAF7F0] hover:bg-[#050505]'
                    }`}
                  >
                    {fam}
                  </button>
                ))}
              </div>
            </div>

            {/* Brand / House */}
            <div>
              <label className="block text-[11px] font-sans uppercase tracking-wider text-[#D4AF37] font-semibold mb-2">
                Casa Perfumera
              </label>
              <select
                value={filters.brand}
                onChange={(e) => setFilters({ ...filters, brand: e.target.value })}
                className="w-full bg-[#050505] border border-[#262626] text-xs text-[#FAF7F0] p-2.5 rounded focus:border-[#D4AF37] outline-none"
              >
                {HOUSES_LIST.map((h) => (
                  <option key={h} value={h}>
                    {h}
                  </option>
                ))}
              </select>
            </div>

            {/* Price Range in DOP */}
            <div>
              <div className="flex items-center justify-between text-[11px] font-sans uppercase tracking-wider text-[#D4AF37] font-semibold mb-2">
                <span>Precio Máximo</span>
                <span className="text-[#FAF7F0] font-mono tabular-nums">
                  RD$ {filters.maxPrice.toLocaleString()}
                </span>
              </div>
              <input
                type="range"
                min="8000"
                max="45000"
                step="1000"
                value={filters.maxPrice}
                onChange={(e) => setFilters({ ...filters, maxPrice: Number(e.target.value) })}
                className="w-full accent-[#D4AF37] bg-[#262626] h-1.5 rounded cursor-pointer"
              />
              <div className="flex justify-between text-[10px] text-[#B8B8B8] mt-1 tabular-nums">
                <span>RD$ 8,000</span>
                <span>RD$ 45,000</span>
              </div>
            </div>

            {/* Delivery Assurance */}
            <div className="pt-3 border-t border-[#262626] text-[11px] text-[#B8B8B8] space-y-2">
              <p className="flex items-center gap-1.5 text-[#F5E6B3]">
                <Sparkles className="w-3.5 h-3.5 text-[#D4AF37] shrink-0" />
                <span>¿Dudas sobre cuál elegir?</span>
              </p>
              <p className="text-[10px] leading-relaxed">
                Nuestros asesores en Santo Domingo te ayudan por WhatsApp en tiempo real.
              </p>
            </div>
          </Reveal>

          {/* Product Grid Area */}
          <div className="lg:col-span-3">
            {/* Results count */}
            <div className="flex items-center justify-between mb-4 text-xs text-[#B8B8B8]">
              <span>
                Mostrando <strong className="text-[#FAF7F0] tabular-nums">{filteredPerfumes.length}</strong> fragancias exclusivas
              </span>
              {(filters.search ||
                filters.gender !== 'Todos' ||
                filters.category !== 'Todos' ||
                filters.family !== 'Todos' ||
                filters.brand !== 'Todas' ||
                filters.maxPrice < 45000) && (
                <span className="text-[#D4AF37] text-[11px]">
                  Filtros activos aplicados
                </span>
              )}
            </div>

            {filteredPerfumes.length === 0 ? (
              <div className="bg-[#111111] border border-[#262626] rounded-lg p-12 text-center">
                <p className="font-serif text-xl text-[#FAF7F0] mb-2">
                  No se encontraron fragancias con los filtros seleccionados
                </p>
                <p className="text-xs text-[#B8B8B8] mb-6 max-w-md mx-auto">
                  Prueba a ajustar el rango de precios o restablecer la búsqueda para explorar toda nuestra cava de perfumes.
                </p>
                <button
                  onClick={handleResetFilters}
                  className="px-6 py-2.5 bg-[#D4AF37] text-[#050505] rounded-md font-sans text-xs font-semibold uppercase tracking-wider hover:bg-[#FFD76A] transition-colors"
                >
                  Restablecer Filtros
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6">
                {filteredPerfumes.map((perfume, index) => {
                  const defaultSize = perfume.sizes[0];
                  const isWishlisted = wishlist.includes(perfume.id);
                  const isJustAdded = addedItemNotification === perfume.id;

                  return (
                    <Reveal key={perfume.id} delay={(index % 3) * 0.08} className="h-full">
                      <article
                        onClick={() => onSelectPerfume(perfume)}
                        className="group h-full bg-[#111111] border border-[#262626] hover:border-[#D4AF37]/50 rounded-lg overflow-hidden transition-all duration-300 flex flex-col justify-between cursor-pointer hover:-translate-y-1 hover:shadow-[0_10px_30px_rgba(0,0,0,0.6)]"
                      >
                      {/* Card Image Area (65-75% visual weight) */}
                      <div className="relative aspect-[4/3] bg-[#0c0c0c] overflow-hidden">
                        <img
                          src={perfume.image}
                          alt={`${perfume.name} - ${perfume.house}`}
                          className="w-full h-full object-cover object-center transition-transform duration-700 group-hover:scale-105"
                          referrerPolicy="no-referrer"
                          loading="lazy"
                        />

                        {/* Badges */}
                        <div className="absolute top-3 left-3 flex flex-col gap-1 items-start">
                          {perfume.isBestseller && (
                            <span className="text-[9px] tracking-[0.16em] uppercase font-sans font-semibold px-2 py-0.5 bg-[#D4AF37] text-[#050505] rounded-xs shadow-sm">
                              Bestseller
                            </span>
                          )}
                          {perfume.isNew && (
                            <span className="text-[9px] tracking-[0.16em] uppercase font-sans font-semibold px-2 py-0.5 bg-[#050505]/90 text-[#FFD76A] border border-[#D4AF37]/40 rounded-xs">
                              Lanzamiento
                            </span>
                          )}
                        </div>

                        {/* Top Right Wishlist Toggle */}
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            onToggleWishlist(perfume.id);
                          }}
                          className="absolute top-3 right-3 p-2 rounded-full bg-[#050505]/70 hover:bg-[#050505] text-[#FAF7F0] border border-[#262626] transition-colors"
                          aria-label={isWishlisted ? 'Quitar de favoritos' : 'Añadir a favoritos'}
                        >
                          <Heart
                            className={`w-3.5 h-3.5 ${
                              isWishlisted
                                ? 'fill-[#D4AF37] text-[#D4AF37]'
                                : 'text-[#FAF7F0]'
                            }`}
                          />
                        </button>

                        {/* Quick View Hover Strip */}
                        <div className="absolute inset-x-0 bottom-0 py-2 bg-gradient-to-t from-[#050505] via-[#050505]/80 to-transparent flex items-center justify-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                          <span className="text-[11px] text-[#FAF7F0] font-medium flex items-center gap-1">
                            <Eye className="w-3.5 h-3.5 text-[#D4AF37]" />
                            <span>Ver detalles y notas</span>
                          </span>
                        </div>
                      </div>

                      {/* Content Area */}
                      <div className="p-4 flex flex-col flex-1 justify-between">
                        <div>
                          {/* House & Concentration */}
                          <div className="flex items-center justify-between text-[11px] text-[#B8B8B8] mb-1">
                            <span className="uppercase tracking-wider font-sans font-medium text-[#D4AF37]">
                              {perfume.house}
                            </span>
                            <span className="font-sans text-[10px]">{perfume.concentration}</span>
                          </div>

                          {/* Perfume Name */}
                          <h3 className="font-serif text-lg font-semibold text-[#FAF7F0] group-hover:text-[#F5E6B3] transition-colors leading-snug line-clamp-1 mb-1">
                            {perfume.name}
                          </h3>

                          {/* Olfactory Family & Gender (Zero-pill clean metadata with dot separator) */}
                          <div className="text-[11px] text-[#B8B8B8] flex items-center gap-1.5 mb-3">
                            <span>{perfume.family}</span>
                            <span>·</span>
                            <span>{perfume.gender}</span>
                            <span>·</span>
                            <span>{defaultSize.ml} ml</span>
                          </div>
                        </div>

                        {/* Price & Action Button */}
                        <div className="pt-3 border-t border-[#1f1f1f] flex items-center justify-between gap-2">
                          <div className="flex flex-col">
                            <span className="text-[9px] uppercase tracking-wider text-[#B8B8B8] font-sans">
                              Desde
                            </span>
                            <span className="font-sans font-bold text-sm sm:text-base text-[#FAF7F0] tabular-nums">
                              RD$ {defaultSize.priceDOP.toLocaleString()}
                            </span>
                          </div>

                          <button
                            onClick={(e) => handleQuickAdd(e, perfume)}
                            disabled={!defaultSize.inStock}
                            className={`px-3.5 py-2 rounded-md font-sans text-xs font-semibold tracking-wider uppercase transition-all duration-200 flex items-center gap-1.5 cursor-pointer whitespace-nowrap ${
                              isJustAdded
                                ? 'bg-[#22c55e] text-white'
                                : 'bg-gradient-to-r from-[#D4AF37] to-[#B38F24] hover:from-[#FFD76A] hover:to-[#D4AF37] text-[#050505]'
                            }`}
                            aria-label={`Añadir ${perfume.name} al carrito`}
                          >
                            {isJustAdded ? (
                              <>
                                <Check className="w-3.5 h-3.5" />
                                <span>Agregado</span>
                              </>
                            ) : (
                              <>
                                <ShoppingBag className="w-3.5 h-3.5" />
                                <span>Añadir</span>
                              </>
                            )}
                          </button>
                        </div>
                      </div>
                      </article>
                    </Reveal>
                  );
                })}
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
};
