/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { Header } from './components/Header';
import { Hero } from './components/Hero';
import { PerfumeCarousel } from './components/PerfumeCarousel';
import { CampaignBanners } from './components/CampaignBanners';
import { Catalog } from './components/Catalog';
import { ProductDetailModal } from './components/ProductDetailModal';
import { CartDrawer } from './components/CartDrawer';
import { AboutContact } from './components/AboutContact';
import { ScentQuizModal } from './components/ScentQuizModal';
import { BrandSystemModal } from './components/BrandSystemModal';
import { SearchModal } from './components/SearchModal';
import { WishlistModal } from './components/WishlistModal';
import { OrderConfirmationModal } from './components/OrderConfirmationModal';
import { Footer } from './components/Footer';
import { PERFUMES_DATA } from './data/perfumes';
import { Perfume, CartItem, CheckoutFormData } from './types';

export default function App() {
  const [activeTab, setActiveTab] = useState<string>('inicio');
  const [selectedPerfume, setSelectedPerfume] = useState<Perfume | null>(null);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isQuizOpen, setIsQuizOpen] = useState(false);
  const [isBrandSystemOpen, setIsBrandSystemOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isWishlistOpen, setIsWishlistOpen] = useState(false);
  const [orderConfirmation, setOrderConfirmation] = useState<{
    orderId: string;
    total: number;
    formData: CheckoutFormData;
  } | null>(null);

  // Persistent Cart state
  const [cart, setCart] = useState<CartItem[]>(() => {
    try {
      const saved = localStorage.getItem('dv_cart');
      return saved ? JSON.parse(saved) : [];
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
    const found = PERFUMES_DATA.find((p) => p.id === perfumeId);
    if (found) {
      setSelectedPerfume(found);
    }
  };

  const totalCartCount = cart.reduce((sum, item) => sum + item.quantity, 0);

  const handleNavigate = (tab: string) => {
    setActiveTab(tab);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleScrollToSection = (sectionId: string) => {
    const el = document.getElementById(sectionId);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  // Filter datasets for carousels
  const newArrivalsList = PERFUMES_DATA.filter((p) => p.isNew || p.id.includes('tabac') || p.id.includes('desir') || p.id.includes('elysium'));
  const bestSellersList = PERFUMES_DATA.filter((p) => p.isBestseller);

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
        onOpenBrandSystem={() => setIsBrandSystemOpen(true)}
        onOpenQuiz={() => setIsQuizOpen(true)}
        onScrollToSection={handleScrollToSection}
      />

      {/* Main Content Router */}
      <main className="flex-1">
        {activeTab === 'inicio' && (
          <>
            {/* 1. Minimalist Editorial Hero (Reference 1: Omanluxury style) */}
            <Hero
              onShopClick={() => handleScrollToSection('catalogo-completo')}
              onExploreFeatured={() => handleSelectPerfumeById('aeterna-golden-oudh')}
            />

            {/* 2. Dynamic Perfume Carousel: New Arrivals (Reference 3: MaxAroma New Arrivals) */}
            <div id="new-arrivals">
              <PerfumeCarousel
                title="Nuevas Llegadas"
                subtitle="New Arrivals 2026"
                perfumes={newArrivalsList.length > 0 ? newArrivalsList : PERFUMES_DATA.slice(0, 6)}
                onSelectPerfume={(perfume) => setSelectedPerfume(perfume)}
                onAddToCart={(perfume, sizeMl) => handleAddToCart(perfume, sizeMl, 1)}
                onSeeMore={() => handleNavigate('catalogo')}
              />
            </div>

            {/* 3. Advertising Campaign Spotlights & 4-Grid Editorial (References 4 & 5: Love Flame, Desirtoxic, Bortnikoff) */}
            <div id="campaigns">
              <CampaignBanners
                perfumes={PERFUMES_DATA}
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
              />
            </div>

            {/* 5. Clean Structured Catalog Section */}
            <div id="catalogo-completo" className="border-t border-[#1a1a1a]">
              <Catalog
                perfumes={PERFUMES_DATA}
                onSelectPerfume={(perfume) => setSelectedPerfume(perfume)}
                onAddToCart={(perfume, sizeMl) => handleAddToCart(perfume, sizeMl, 1)}
                wishlist={wishlist}
                onToggleWishlist={handleToggleWishlist}
              />
            </div>

            {/* 6. Sobre Nosotros & Showroom Piantini */}
            <AboutContact />
          </>
        )}

        {activeTab === 'catalogo' && (
          <div className="pt-4">
            <Catalog
              perfumes={PERFUMES_DATA}
              onSelectPerfume={(perfume) => setSelectedPerfume(perfume)}
              onAddToCart={(perfume, sizeMl) => handleAddToCart(perfume, sizeMl, 1)}
              wishlist={wishlist}
              onToggleWishlist={handleToggleWishlist}
            />
          </div>
        )}

        {activeTab === 'sobre-nosotros' && (
          <div className="pt-4">
            <AboutContact />
          </div>
        )}
      </main>

      {/* Footer */}
      <Footer
        onNavigate={handleNavigate}
        onOpenBrandSystem={() => setIsBrandSystemOpen(true)}
        onOpenQuiz={() => setIsQuizOpen(true)}
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

      {/* Scent Quiz Modal */}
      <ScentQuizModal
        isOpen={isQuizOpen}
        onClose={() => setIsQuizOpen(false)}
        perfumes={PERFUMES_DATA}
        onSelectPerfume={(perfume) => setSelectedPerfume(perfume)}
        onAddToCart={(perfume, sizeMl) => handleAddToCart(perfume, sizeMl, 1)}
      />

      {/* Official Brand System & Logos Modal */}
      <BrandSystemModal
        isOpen={isBrandSystemOpen}
        onClose={() => setIsBrandSystemOpen(false)}
      />

      {/* Instant Search Modal */}
      <SearchModal
        isOpen={isSearchOpen}
        onClose={() => setIsSearchOpen(false)}
        perfumes={PERFUMES_DATA}
        onSelectPerfume={(perfume) => setSelectedPerfume(perfume)}
      />

      {/* Wishlist Modal */}
      <WishlistModal
        isOpen={isWishlistOpen}
        onClose={() => setIsWishlistOpen(false)}
        wishlistIds={wishlist}
        perfumes={PERFUMES_DATA}
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
