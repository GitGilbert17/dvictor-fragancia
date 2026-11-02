# Mapa del Proyecto — D’ Victor Fragancias

Documento de referencia para el equipo. Explica qué hay en el repositorio, qué
se ve en la página, dónde está cada cosa y qué tocar para cambiarla.

> Este archivo es solo documentación. No afecta la ejecución de la app.

---

## 1. Resumen

| Aspecto | Detalle |
|---|---|
| Proyecto | Boutique de perfumes de lujo **D’ Victor Fragancias** |
| Tipo | SPA (Single Page Application) de una sola página con pestañas |
| Stack | React 19 + TypeScript + Vite 8 + Tailwind CSS 4 |
| Iconos | `lucide-react` |
| Backend | **No hay**. Carrito, checkout y formulario son simulados |
| Persistencia | `localStorage` (`dv_cart`, `dv_wishlist`) |
| Idioma | Español |
| Moneda | Peso dominicano (RD$ / DOP) |
| Estética | Negro obsidiana `#050505`, dorado `#D4AF37`, blanco cálido `#FAF7F0` |
| Tipografías | Cormorant Garamond (títulos) + Montserrat (texto) |

### Cómo ejecutar

```bash
npm install          # instalar dependencias
npm run dev          # desarrollo en http://localhost:3000
npm run lint         # verificar TypeScript
npm run build        # build de producción
npm run preview      # previsualizar el build
```

> Nota: el proyecto fija `esbuild ^0.25` y `vite ^8.3`, que pide `esbuild ^0.27`.
> Si `npm install` falla con `ERESOLVE`, usar `npm install --legacy-peer-deps`.

---

## 2. Estructura de carpetas

```
.
├─ index.html                  Metadatos SEO + fuentes de Google
├─ vite.config.ts              Plugins React/Tailwind y alias "@"
├─ tsconfig.json               Configuración de TypeScript
├─ package.json                Scripts y dependencias
├─ metadata.json               Nombre/descripción del proyecto
├─ public/
│  ├─ assets/Img/              Fotos de perfumes (no usadas por el código actual)
│  └─ assets/logos/            Logo.png y Logo2.png (sí se usan)
├─ src/
│  ├─ main.tsx                 Punto de entrada de React
│  ├─ App.tsx                  Estado global, pestañas y modales
│  ├─ index.css                Tailwind + estilos globales
│  ├─ types.ts                 Interfaces y tipos
│  ├─ data/perfumes.ts         Catálogo, casas y provincias
│  ├─ assets/
│  │  ├─ images/               Imágenes usadas por el catálogo y banners
│  │  └─ logos/                Copia de los logos
│  └─ components/              Header, Hero, catálogo, modales, etc.
└─ docs/MAPA-PROYECTO.md       Este documento
```

---

## 3. Mapa de archivos

| Archivo | Qué hace | Dónde se ve |
|---|---|---|
| `src/App.tsx` | Estado global, router de pestañas, carrito, wishlist y modales | Toda la app |
| `src/main.tsx` | Monta `<App />` en `#root` | Arranque |
| `src/types.ts` | Contratos: `Perfume`, `CartItem`, `FilterState`, `CheckoutFormData` | No se renderiza |
| `src/data/perfumes.ts` | 12 perfumes + `HOUSES_LIST` + `PROVINCES_RD` | Catálogo y checkout |
| `src/index.css` | Tailwind, fuentes, scrollbar y utilidades doradas | Global |
| `src/components/Header.tsx` | Barra fija: promo, logo, menú, buscador, bolsa | Arriba de todo |
| `src/components/Hero.tsx` | Banner principal AETERNA 1744 + sellos | Inicio, bloque 1 |
| `src/components/PerfumeCarousel.tsx` | Carrusel horizontal reutilizable | Inicio, bloques 2 y 4 |
| `src/components/CampaignBanners.tsx` | 2 banners + grid editorial de 4 | Inicio, bloque 3 |
| `src/components/Catalog.tsx` | Buscador, filtros, orden y grid | Inicio bloque 5 y pestaña Catálogo |
| `src/components/AboutContact.tsx` | Historia, showroom, políticas, FAQ y contacto | Inicio bloque 6 y pestaña Showroom |
| `src/components/Footer.tsx` | Marca, navegación, colecciones y contacto | Pie de página |
| `src/components/ProductDetailModal.tsx` | Ficha del perfume | Modal de producto |
| `src/components/CartDrawer.tsx` | Bolsa + checkout | Panel derecho |
| `src/components/ScentQuizModal.tsx` | Quiz de recomendación | Modal “Asesor Olfativo” |
| `src/components/SearchModal.tsx` | Búsqueda instantánea | Modal lupa |
| `src/components/WishlistModal.tsx` | Favoritos guardados | Modal corazón |
| `src/components/BrandSystemModal.tsx` | Manual de marca | Modal “Logos” |
| `src/components/OrderConfirmationModal.tsx` | Recibo del pedido | Modal tras comprar |
| `src/components/BrandLogo.tsx` | Logo con variantes y fallback SVG | Header, Footer, About, Recibo |

---

## 4. Mapa de la página

### Pestaña “Inicio” (`activeTab === 'inicio'`)

| Orden | Bloque | Componente | Ancla |
|---|---|---|---|
| — | Header fijo | `Header` | — |
| 1 | Hero AETERNA 1744 | `Hero` | — |
| 2 | Nuevas Llegadas | `PerfumeCarousel` | `#new-arrivals` |
| 3 | Campañas y tendencias | `CampaignBanners` | `#campaigns` |
| 4 | Los Más Vendidos | `PerfumeCarousel` | `#best-sellers` |
| 5 | Catálogo | `Catalog` | `#catalogo-completo` |
| 6 | Sobre nosotros y showroom | `AboutContact` | — |
| — | Footer | `Footer` | — |

### Otras pestañas

- **Catálogo** (`catalogo`): solo `Catalog`.
- **Showroom** (`sobre-nosotros`): solo `AboutContact`.

### Modales globales

Siempre están montados; se muestran u ocultan por estado:

| Modal | Se abre desde |
|---|---|
| `ProductDetailModal` | Clic en un perfume |
| `CartDrawer` | Botón “Bolsa” |
| `ScentQuizModal` | “Asesor Olfativo” |
| `BrandSystemModal` | “Logos” / “Identidad de Marca” |
| `SearchModal` | “Buscar fragancia...” |
| `WishlistModal` | Icono corazón |
| `OrderConfirmationModal` | Confirmar pedido |

---

## 5. Estado global (`src/App.tsx`)

| Estado | Tipo | Para qué |
|---|---|---|
| `activeTab` | `string` | Pestaña actual: `inicio`, `catalogo`, `sobre-nosotros` |
| `selectedPerfume` | `Perfume \| null` | Abre/cierra la ficha |
| `isCartOpen` | `boolean` | Bolsa lateral |
| `isQuizOpen` | `boolean` | Asesor olfativo |
| `isBrandSystemOpen` | `boolean` | Manual de marca |
| `isSearchOpen` | `boolean` | Buscador |
| `isWishlistOpen` | `boolean` | Favoritos |
| `orderConfirmation` | `{ orderId, total, formData } \| null` | Recibo |
| `cart` | `CartItem[]` | Bolsa (persistida) |
| `wishlist` | `string[]` | IDs favoritos (persistidos) |

**localStorage**

- `dv_cart`: ítems de la bolsa.
- `dv_wishlist`: IDs de favoritos. Si no existe, arranca con
  `tabac-dore-reserve` y `desirtoxic-azur-niche`.

---

## 6. Datos del catálogo

`PERFUMES_DATA` contiene 12 perfumes. Los `id` son referencias fijas usadas por
banners, wishlist por defecto y enlaces:

| ID | Nombre | Casa |
|---|---|---|
| `tabac-dore-reserve` | Tabac Doré Niche Millésime | Bortnikoff Parfums |
| `desirtoxic-azur-niche` | DésirToxic Azur Élixir | M.Micallef Paris |
| `aeterna-golden-oudh` | Aeterna Nº III Golden Oudh | D’ Victor Private Reserve |
| `nocturne-royal-reserve` | Nocturne Imperial Millésime | Creed Heritage |
| `maison-rubis-extrait` | Maison Du Rubis Cristallin 540 | Maison Francis Kurkdjian |
| `rose-etheree-royale` | Rose Éthérée Royale | Parfums de Marly Paris |
| `aurum-noctis-reserve` | Aurum Noctis Rare Oud | Tom Ford Private Blend |
| `angels-liquoreux-reserve` | Angels’ Liquoreux Gourmand | Kilian Paris |
| `sauvage-elixir-prive` | Sauvage Elixir Haute Concentration | Dior Collection Privée |
| `coco-mademoiselle-intense` | Coco Mademoiselle L’Intense | Chanel Paris |
| `elysium-pour-homme-parfum` | Elysium Pour Homme Superiore | Roja Parfums London |
| `delina-la-rosee-speciale` | Delina La Rosée Petale | Parfums de Marly Paris |

**Campos de un perfume:** `id`, `name`, `house`, `gender`, `category`, `family`,
`concentration`, `description`, `sizes[]`, `image`, `topNotes[]`, `heartNotes[]`,
`baseNotes[]`, `longevity`, `sillage`, `bestOccasion`, `rating`, `reviewsCount`,
`isBestseller`, `isNew`, `batchCodeExample`.

**Tallas:** cada `sizes[]` tiene `ml`, `priceDOP` e `inStock`. La primera talla es
la que se usa por defecto en tarjetas y filtros de precio.

---

## 7. Reglas de negocio (hardcodes)

| Regla | Valor | Dónde |
|---|---|---|
| Envío gratis desde | RD$ 8,000 | `Header`, `CartDrawer`, `ProductDetailModal` |
| Envío Express SD | RD$ 350 | `CartDrawer` |
| Envío nacional | RD$ 500 | `CartDrawer` |
| Cupones | `DVICTOR10`, `ELEGANCIA10` (10%) | `CartDrawer`, `ProductDetailModal` |
| Precio “retail” | 1.25× el precio real | `ProductDetailModal` |
| WhatsApp | `+1 (829) 555-3842` / `18295553842` | Header, About, ProductDetail, OrderConfirmation, Footer |
| Banco | Popular `812-349812-0`, RNC `132-94812-4` | `OrderConfirmationModal` |
| Dirección | Calle Federico Geraldino esq. Roberto Pastoriza, Piantini | `AboutContact` |
| Email | `contacto@dvictorfragancias.com` | `Footer` |

---

## 8. Dónde cambiar cada cosa

| Quiero cambiar... | Voy a... |
|---|---|
| Textos del hero | `src/components/Hero.tsx` |
| Imagen del hero | `<img>` de `Hero.tsx` |
| Promo del header / umbral de envío | `Header.tsx` → “Top micro promo bar” |
| Enlaces del menú | `Header.tsx` → “Zone 2” + `handleNavClick` |
| Banners de campaña | `CampaignBanners.tsx` |
| Qué perfumes salen en “Nuevas Llegadas” | `App.tsx` → `newArrivalsList` |
| Qué perfumes salen en “Best Sellers” | `App.tsx` → `bestSellersList` (campo `isBestseller`) |
| Filtros del catálogo | `Catalog.tsx` → `filteredPerfumes` |
| Precio máximo del slider | `Catalog.tsx` → `input type="range"` (min/max) |
| Agregar un perfume | `src/data/perfumes.ts` → `PERFUMES_DATA` |
| Agregar una casa al filtro | `src/data/perfumes.ts` → `HOUSES_LIST` |
| Provincias del checkout | `src/data/perfumes.ts` → `PROVINCES_RD` |
| Colores de marca | `src/components/BrandSystemModal.tsx` + clases Tailwind |
| Tipografías | `src/index.css` + `index.html` |
| Datos bancarios | `OrderConfirmationModal.tsx` |
| Número de WhatsApp | Buscar `18295553842` en `src/` |

---

## 9. Advertencias y deuda técnica

1. **Bug de hooks en `ProductDetailModal`** (no corregido):
   `if (!perfume) return null` está antes de los `useState`. React puede lanzar
   “Rendered more hooks than during the previous render” al abrir la ficha.
   Solución: mover los hooks arriba del `return null`.

2. **Precio con cupón inconsistente:** la ficha muestra el precio con 10% de
   descuento por defecto, pero `handleAddToCart` envía el precio sin descuento.
   La bolsa solo aplica el cupón si el usuario lo escribe.

3. **Imágenes en `/src/assets/images/...`:** funcionan en desarrollo, pero Vite
   no las copia al build de producción (solo copia `public/`). Revisar antes de
   desplegar; lo ideal es moverlas a `public/assets/` o importarlas.

4. **Sin backend:** pedidos, formulario de contacto y newsletter son simulados
   (`setTimeout`). No se guarda nada en una base de datos.

5. **Dependencias sin uso:** `@google/genai`, `express`, `dotenv`. `metadata.json`
   menciona Gemini pero no hay código que lo use.

6. **JSON sin comentarios:** `package.json`, `tsconfig.json` y `metadata.json` no
   admiten comentarios; su explicación vive en este documento.

7. **Ramas del repositorio:** además de `main`, existen `feature/admin-panel`,
   `feature/components`, `feature/landing` y `feature/supabase` en `origin`.

---

## 10. Convención de comentarios en el código

Cada archivo de `src/` empieza con un bloque:

```
/**
 * ARCHIVO: ...
 * QUÉ ES: ...
 * DÓNDE SE VE: ...
 * PROPS / SE RENDERIZA DESDE: ...
 * QUÉ TOCAR: ...
 */
```

Dentro de los archivos:

- En TypeScript: `// ── SECCIÓN: ... ──`
- En JSX: `{/* ── SECCIÓN: ... ── */}`

Los comentarios son solo guías: no cambian la lógica ni los estilos.
