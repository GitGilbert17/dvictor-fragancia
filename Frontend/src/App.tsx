/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

/**
 * ─────────────────────────────────────────────────────────────────────────────
 * ARCHIVO: Frontend/src/App.tsx
 * QUÉ ES: Componente raíz de la app. Guarda el estado global (carrito,
 *         wishlist, pestaña activa, modales) y decide qué se renderiza.
 * DÓNDE SE VE: Toda la página (Inicio / Catálogo / Showroom) + modales.
 * QUÉ TOCAR:
 *   - Estado y persistencia en localStorage → bloque "ESTADO GLOBAL".
 *   - Lógica de la bolsa → funciones `handleAddToCart`, `handleUpdateQuantity`,
 *     `handleRemoveFromCart`, `handleClearCart`.
 *   - Favoritos → `handleToggleWishlist`.
 *   - Pestañas / scroll → `handleNavigate`, `handleScrollToSection`.
 *   - Qué aparece en Inicio → bloque "ROUTER DE PESTAÑAS" (`activeTab`).
 *   - Orden de los modales → bloque "MODALES GLOBALES" al final del return.
 * ─────────────────────────────────────────────────────────────────────────────
 */

import React, { useState, useEffect, useRef } from 'react';
import { Header } from './components/Header';
import { Hero } from './components/Hero';
import { PerfumeCarousel } from './components/PerfumeCarousel';
import { CampaignBanners } from './components/CampaignBanners';
import { Catalog } from './components/Catalog';
import { ProductDetailModal } from './components/ProductDetailModal';
import { CartDrawer } from './components/CartDrawer';
import { SearchModal } from './components/SearchModal';
import { WishlistModal } from './components/WishlistModal';
import { OrderConfirmationModal } from './components/OrderConfirmationModal';
import { Footer } from './components/Footer';
import { AdminPage } from './components/AdminPage';
import { productService } from './services/productService';
import { PERFUMES_DATA } from './data/perfumes';
import { Perfume, CartItem, CheckoutFormData } from './types';

// ── ESTADO GLOBAL ───────────────────────────────────────────────────────────
// Pestaña activa, modales, carrito y wishlist. El carrito y la wishlist se
// hidratan desde localStorage para que sobrevivan al refrescar la página.
export default function App() {
  const [activeTab, setActiveTab] = useState<string>('inicio');
  // tabKey sube con cada cambio de tab para forzar remount y disparar la animación CSS
  const [tabKey, setTabKey] = useState(0);
  const [selectedPerfume, setSelectedPerfume] = useState<Perfume | null>(null);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isWishlistOpen, setIsWishlistOpen] = useState(false);
  const [orderConfirmation, setOrderConfirmation] = useState<{
    orderId: string;
    total: number;
    formData: CheckoutFormData;
  } | null>(null);

  // Separación de páginas: comprueba si la URL actual es la página del administrador (/admin o #admin)
  const [isAdminPage, setIsAdminPage] = useState(() => {
    if (typeof window === 'undefined') return false;
    const path = window.location.pathname.toLowerCase();
    const hash = window.location.hash.toLowerCase();
    return path === '/admin' || path.startsWith('/admin') || hash === '#admin' || hash.startsWith('#/admin');
  });

  useEffect(() => {
    const checkRoute = () => {
      const path = window.location.pathname.toLowerCase();
      const hash = window.location.hash.toLowerCase();
      setIsAdminPage(path === '/admin' || path.startsWith('/admin') || hash === '#admin' || hash.startsWith('#/admin'));
    };

    window.addEventListener('popstate', checkRoute);
    window.addEventListener('hashchange', checkRoute);
    return () => {
      window.removeEventListener('popstate', checkRoute);
      window.removeEventListener('hashchange', checkRoute);
    };
  }, []);

  // Catálogo sincronizado con el Backend (con respaldo de PERFUMES_DATA)
  const [perfumes, setPerfumes] = useState<Perfume[]>(PERFUMES_DATA);
  const [isLoadingPerfumes, setIsLoadingPerfumes] = useState(false);

  const loadPerfumes = async () => {
    try {
      setIsLoadingPerfumes(true);
      const data = await productService.getClientPerfumes();
      if (data && data.length > 0) {
        setPerfumes(data);
      }
    } catch (err) {
      console.warn('Backend no disponible, usando catálogo local:', err);
    } finally {
      setIsLoadingPerfumes(false);
    }
  };

  useEffect(() => {
    loadPerfumes();
  }, []);

  // Persistent Cart state
  const [cart, setCart] = useState<CartItem[]>(() => {
    try {
      const saved = localStorage.getItem('dv_cart');
      // Conserva los carritos anteriores al traslado de las imágenes a public/assets.
      return saved ? (JSON.parse(saved) as CartItem[]).map((item) => ({
        ...item,
        perfume: {
          ...item.perfume,
          image: item.perfume.image.replace(/^\/src\/assets\/images\//, '/assets/images/'),
        },
      })) : [];
    } catch {
      return [];
    }
  });

  // Persistent Wishlist state
  const [wishlist, setWishlist] = useState<string[]>(() => {
    try {
      const saved = localStorage.getItem('dv_wishlist');
      return saved ? JSON.parse(saved) : ['tabac-dore-reserve', 'desirtoxic-azur-niche'];
    } catch {
      return ['tabac-dore-reserve', 'desirtoxic-azur-niche'];
    }
  });

  useEffect(() => {
    try {
      localStorage.setItem('dv_cart', JSON.stringify(cart));
    } catch {
      // storage unavailable
    }
  }, [cart]);

  useEffect(() => {
    try {
      localStorage.setItem('dv_wishlist', JSON.stringify(wishlist));
    } catch {
      // storage unavailable
    }
  }, [wishlist]);

  // Cart operations
  const handleAddToCart = (perfume: Perfume, sizeMl: number, quantity: number = 1) => {
    const sizeConfig = perfume.sizes.find((s) => s.ml === sizeMl) || perfume.sizes[0];
    setCart((prevCart) => {
      const existingIndex = prevCart.findIndex(
        (item) => item.perfume.id === perfume.id && item.sizeMl === sizeMl
      );
      if (existingIndex > -1) {
        const next = [...prevCart];
        next[existingIndex].quantity += quantity;
        return next;
      } else {
        return [
          ...prevCart,
          {
            perfume,
            sizeMl,
            priceDOP: sizeConfig.priceDOP,
            quantity,
          },
        ];
      }
    });
  };

  const handleUpdateQuantity = (perfumeId: string, sizeMl: number, delta: number) => {
    setCart((prev) =>
      prev
        .map((item) => {
          if (item.perfume.id === perfumeId && item.sizeMl === sizeMl) {
            const newQty = item.quantity + delta;
            return newQty > 0 ? { ...item, quantity: newQty } : null;
          }
          return item;
        })
        .filter(Boolean) as CartItem[]
    );
  };

  const handleRemoveFromCart = (perfumeId: string, sizeMl: number) => {
    setCart((prev) =>
      prev.filter((item) => !(item.perfume.id === perfumeId && item.sizeMl === sizeMl))
    );
  };

  const handleClearCart = () => {
    setCart([]);
  };

  // Wishlist toggle
  const handleToggleWishlist = (perfumeId: string) => {
    setWishlist((prev) =>
      prev.includes(perfumeId)
        ? prev.filter((id) => id !== perfumeId)
        : [...prev, perfumeId]
    );
  };

  const handleOrderPlaced = (orderId: string, total: number, formData: CheckoutFormData) => {
    setOrderConfirmation({ orderId, total, formData });
    setCart([]);
    setIsCartOpen(false);
  };

  const handleSelectPerfumeById = (perfumeId: string) => {
    const found = perfumes.find((p) => p.id === perfumeId) || PERFUMES_DATA.find((p) => p.id === perfumeId);
    if (found) {
      setSelectedPerfume(found);
    }
  };

  const totalCartCount = cart.reduce((sum, item) => sum + item.quantity, 0);

  const handleNavigate = (tab: string) => {
    setActiveTab(tab);
    setTabKey((k) => k + 1);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleScrollToSection = (sectionId: string) => {
    const el = document.getElementById(sectionId);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  // Filtrar listas dinámicas para carruseles
  const newArrivalsList = perfumes.filter((p) => p.isNew || p.id.includes('tabac') || p.id.includes('desir') || p.id.includes('elysium'));
  const bestSellersList = perfumes.filter((p) => p.isBestseller);

  // ── PÁGINA INDEPENDIENTE DEL ADMINISTRADOR (/admin o #admin) ─────────────
  // Si la ruta es /admin, se renderiza exclusivamente la vista de administración,
  // totalmente aislada de la landing page pública.
  if (isAdminPage) {
    return (
      <AdminPage
        onProductsChanged={loadPerfumes}
        onGoToStore={() => {
          window.history.pushState({}, '', '/');
          setIsAdminPage(false);
          window.scrollTo({ top: 0, behavior: 'smooth' });
        }}
      />
    );
  }

  // ── LANDING PAGE PÚBLICA DEL CLIENTE ─────────────────────────────────────
  // Orden visual: Header → contenido según pestaña (Inicio/Catálogo) → Footer → modales.
  // Los clientes NO ven ningún acceso ni botón hacia el panel de administración.
  return (
    <div className="min-h-screen bg-[#050505] text-[#FAF7F0] flex flex-col font-sans selection:bg-[#D4AF37] selection:text-[#050505]">
      {/* Minimalist Top Bar (MaxAroma style: Zone 1 - Zone 2 - Zone 3) */}
      <Header
        activeTab={activeTab}
        onNavigate={handleNavigate}
        cartCount={totalCartCount}
        onOpenCart={() => setIsCartOpen(true)}
        wishlistCount={wishlist.length}
        onOpenWishlist={() => setIsWishlistOpen(true)}
        onOpenSearch={() => setIsSearchOpen(true)}
        onScrollToSection={handleScrollToSection}
      />

      {/* Main Content Router */}
      <main className="flex-1">
        {activeTab === 'inicio' && (
          <div key={`inicio-${tabKey}`} className="page-transition-enter">
            {/* 1. Minimalist Editorial Hero (Reference 1: Omanluxury style) */}
            <Hero
              onShopClick={() => handleNavigate('catalogo')}
              onExploreFeatured={() => handleSelectPerfumeById('aeterna-golden-oudh')}
            />

            {/* 2. Dynamic Perfume Carousel: New Arrivals (Reference 3: MaxAroma New Arrivals) */}
            <div id="new-arrivals">
              <PerfumeCarousel
                title="Nuevas Llegadas"
                subtitle="New Arrivals 2026"
                perfumes={newArrivalsList.length > 0 ? newArrivalsList : perfumes.slice(0, 6)}
                onSelectPerfume={(perfume) => setSelectedPerfume(perfume)}
                onAddToCart={(perfume, sizeMl) => handleAddToCart(perfume, sizeMl, 1)}
                onSeeMore={() => handleNavigate('catalogo')}
                enableScrollReveal={true}
              />
            </div>

            {/* 3. Advertising Campaign Spotlights & 4-Grid Editorial (References 4 & 5: Love Flame, Desirtoxic, Bortnikoff) */}
            <div id="campaigns">
              <CampaignBanners
                perfumes={perfumes}
                onSelectPerfumeById={handleSelectPerfumeById}
              />
            </div>

            {/* 4. Dynamic Perfume Carousel: Best Sellers (Reference 4: MaxAroma Best Sellers with hot badge) */}
            <div id="best-sellers">
              <PerfumeCarousel
                title="Los Más Vendidos"
                subtitle="Iconos de la Alta Perfumería"
                perfumes={bestSellersList}
                onSelectPerfume={(perfume) => setSelectedPerfume(perfume)}
                onAddToCart={(perfume, sizeMl) => handleAddToCart(perfume, sizeMl, 1)}
                onSeeMore={() => handleNavigate('catalogo')}
                isHot={true}
                enableScrollReveal={true}
              />
            </div>


          </div>
        )}

        {activeTab === 'catalogo' && (
          <div key={`catalogo-${tabKey}`} className="page-transition-enter pt-4">
            <Catalog
              perfumes={perfumes}
              onSelectPerfume={(perfume) => setSelectedPerfume(perfume)}
              onAddToCart={(perfume, sizeMl) => handleAddToCart(perfume, sizeMl, 1)}
              wishlist={wishlist}
              onToggleWishlist={handleToggleWishlist}
            />
          </div>
        )}
      </main>

      {/* Footer */}
      <Footer
        onNavigate={handleNavigate}
      />

      {/* PDP Modal (FragranceNet Reference 2) */}
      <ProductDetailModal
        perfume={selectedPerfume}
        onClose={() => setSelectedPerfume(null)}
        onAddToCart={handleAddToCart}
        isWishlisted={selectedPerfume ? wishlist.includes(selectedPerfume.id) : false}
        onToggleWishlist={handleToggleWishlist}
      />

      {/* Cart & Dominican Checkout Slide-over Drawer */}
      <CartDrawer
        isOpen={isCartOpen}
        onClose={() => setIsCartOpen(false)}
        items={cart}
        onUpdateQuantity={handleUpdateQuantity}
        onRemoveItem={handleRemoveFromCart}
        onClearCart={handleClearCart}
        onOrderPlaced={handleOrderPlaced}
      />

      {/* Instant Search Modal */}
      <SearchModal
        isOpen={isSearchOpen}
        onClose={() => setIsSearchOpen(false)}
        perfumes={perfumes}
        onSelectPerfume={(perfume) => setSelectedPerfume(perfume)}
      />

      {/* Wishlist Modal */}
      <WishlistModal
        isOpen={isWishlistOpen}
        onClose={() => setIsWishlistOpen(false)}
        wishlistIds={wishlist}
        perfumes={perfumes}
        onSelectPerfume={(perfume) => setSelectedPerfume(perfume)}
        onAddToCart={(perfume, sizeMl) => handleAddToCart(perfume, sizeMl, 1)}
        onToggleWishlist={handleToggleWishlist}
      />

      {/* Order Confirmation */}
      <OrderConfirmationModal
        orderInfo={orderConfirmation}
        onClose={() => setOrderConfirmation(null)}
      />
    </div>
  );
}
