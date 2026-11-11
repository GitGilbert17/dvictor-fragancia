# Mapa del proyecto — D’ Victor Fragancias

## Qué hace la aplicación

Es una tienda de perfumes de nicho y diseñador para República Dominicana, con
precios en pesos dominicanos. Usa React 19, TypeScript, Vite 8, Tailwind CSS 4 e
iconos de `lucide-react`. Presenta una estética negra y dorada con las fuentes
Cormorant Garamond y Montserrat.

La aplicación tiene dos pestañas activas: Inicio y Catálogo. En Inicio aparecen
el hero con cinco imágenes, Nuevas Llegadas, campañas y Los Más Vendidos. El
catálogo permite buscar, filtrar por género, categoría, familia olfativa, casa y
precio máximo, y ordenar resultados.

La ficha de producto muestra presentaciones, cantidades, precios, notas y un
enlace de WhatsApp. La bolsa permite modificar cantidades, eliminar productos,
aplicar cupones y completar un checkout simulado con datos de entrega. Al
confirmarlo aparece un recibo local y se vacía la bolsa. No se envía el pedido a
un servidor ni se cobra ningún pago. Los enlaces de WhatsApp solo se abren cuando
el visitante los pulsa.

## Archivos

Todas las rutas de código de esta tabla son relativas a `Frontend/src/`.

| Archivo | Responsabilidad |
|---|---|
| `main.tsx` | Monta React en `#root` e importa los estilos |
| `App.tsx` | Estado global, navegación, carrito, favoritos y modales |
| `types.ts` | Tipos de perfumes, presentaciones, carrito, filtros y checkout |
| `data/perfumes.ts` | 14 perfumes estáticos, casas perfumeras y provincias |
| `index.css` | Tailwind, fuentes, animaciones y utilidades visuales |
| `components/Header.tsx` | Navegación, búsqueda, favoritos, bolsa y menú móvil |
| `components/Hero.tsx` | Slideshow principal y botones hacia ficha y catálogo |
| `components/PerfumeCarousel.tsx` | Carrusel continuo con arrastre e inercia |
| `components/Reveal.tsx` | Animación de aparición mediante IntersectionObserver |
| `components/CampaignBanners.tsx` | Banners y cuadrícula editorial |
| `components/Catalog.tsx` | Filtros, orden, tarjetas y acciones rápidas |
| `components/Footer.tsx` | Navegación y datos de contacto |
| `components/ProductDetailModal.tsx` | Ficha, presentaciones, precio y compra |
| `components/CartDrawer.tsx` | Bolsa y formulario de checkout |
| `components/SearchModal.tsx` | Búsqueda instantánea |
| `components/WishlistModal.tsx` | Productos favoritos |
| `components/OrderConfirmationModal.tsx` | Recibo local e instrucciones de pago |
| `components/BrandLogo.tsx` | Variantes de logo y respaldo SVG |
| `components/AboutContact.tsx` | Historia, showroom, FAQ y contacto simulado; no montado actualmente |
| `components/ScentQuizModal.tsx` | Quiz con recomendación local; no montado actualmente |
| `components/BrandSystemModal.tsx` | Manual visual interactivo; no montado actualmente |

Los componentes no montados se conservan. La reorganización no activa ni elimina
funcionalidades. El manual visual es un componente React, por lo que permanece
en el frontend; la documentación para desarrolladores vive en `documentos/`.

## Estado y persistencia

`App.tsx` administra `activeTab`, `tabKey`, `selectedPerfume`, `isCartOpen`,
`isSearchOpen`, `isWishlistOpen`, `orderConfirmation`, `cart` y `wishlist`.

- `dv_cart` guarda los ítems completos de la bolsa en `localStorage`.
- `dv_wishlist` guarda IDs; los favoritos iniciales son `tabac-dore-reserve` y
  `desirtoxic-azur-niche`.
- La confirmación de pedido solo existe en memoria durante la sesión.
- No hay backend ni base de datos, y no se utiliza Prisma.

## Datos del catálogo

| ID | Nombre |
|---|---|
| `tabac-dore-reserve` | Tabac Doré Niche Millésime |
| `desirtoxic-azur-niche` | DésirToxic Azur Élixir |
| `aeterna-golden-oudh` | Aeterna Nº III Golden Oudh |
| `nocturne-royal-reserve` | Nocturne Imperial Millésime |
| `maison-rubis-extrait` | Maison Du Rubis Cristallin 540 |
| `rose-etheree-royale` | Rose Éthérée Royale |
| `aurum-noctis-reserve` | Aurum Noctis Rare Oud |
| `angels-liquoreux-reserve` | Angels’ Liquoreux Gourmand |
| `sauvage-elixir-prive` | Sauvage Elixir Haute Concentration |
| `coco-mademoiselle-intense` | Coco Mademoiselle L’Intense |
| `elysium-pour-homme-parfum` | Elysium Pour Homme Superiore |
| `delina-la-rosee-speciale` | Delina La Rosée Petale |
| `baccarat-rouge-extrait-prive` | Rouge 540 Extrait Cristal |
| `aventus-creed-millesime` | Aventus Millésime Réserve |

Los IDs relacionan catálogo, campañas, búsqueda y favoritos. Cada presentación
tiene `ml`, `priceDOP` e `inStock`; las tarjetas y el filtro de precio usan la
primera presentación. Las imágenes están en `Frontend/public/assets/images/`.

## Dónde modificar las reglas existentes

| Regla o contenido | Valor actual / archivo |
|---|---|
| Envío gratis | Desde RD$ 8,000; `CartDrawer`, `Header`, `ProductDetailModal` |
| Envío SD / nacional | RD$ 350 / RD$ 500; `CartDrawer` |
| Cupones | `DVICTOR10` y `ELEGANCIA10`, 10%; `CartDrawer` |
| Precio retail simulado | 1.25 veces el precio; `ProductDetailModal` |
| Nuevas llegadas y más vendidos | Filtros en `App.tsx` |
| Catálogo, casas y provincias | `data/perfumes.ts` |
| WhatsApp | Buscar `18295553842` en `Frontend/src/` |
| Datos bancarios de ejemplo | `OrderConfirmationModal.tsx` |
| Paleta de marca | `BrandSystemModal.tsx` y clases Tailwind |
| Fuentes | `Frontend/index.html` e `index.css` |

## Limitaciones previas conservadas

- La ficha muestra un cupón activado por defecto, pero la bolsa aplica el
  descuento solo cuando se introduce el código. No se modificaron estas reglas.
- Tres banners editoriales referencian IDs inexistentes (`baccarat-rouge-540`,
  `creed-aventus` y `delina-rose`), por lo que esos clics no abren una ficha.
- El quiz conserva la respuesta de ocasión, pero filtra por género y perfil.
- Contacto y checkout son simulados. No existe una pasarela de pago.
- `express`, `dotenv` y `@google/genai` siguen declarados sin uso.

La advertencia antigua sobre el orden de hooks de `ProductDetailModal` estaba
desactualizada: los hooks ya precedían al retorno condicional antes de esta
reorganización. Las rutas de imágenes sí se han adaptado para incluirlas en el
build de producción.

Ver [arquitectura](ARQUITECTURA.md) para las conexiones entre carpetas y
[verificación](VERIFICACION.md) para los controles realizados.
