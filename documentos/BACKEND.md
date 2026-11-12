# Guía del Backend y Conexión con Frontend — D’ Victor Fragancias

Este documento describe la arquitectura del backend implementado, la integración con la base de datos PostgreSQL mediante Prisma ORM, las rutas de la API REST y la comunicación con el Frontend (página del cliente y página del administrador).

---

## 1. Arquitectura del Backend

El backend está desarrollado con **Node.js**, **Express**, **TypeScript** y **Prisma ORM**.

```text
backend/
├── src/
│   ├── config/
│   │   ├── env.ts                   # Carga de variables de entorno (PORT, DATABASE_URL, etc.)
│   │   └── prisma.ts                # Instancia de PrismaClient y comprobación de conexión
│   ├── controllers/
│   │   ├── productController.ts     # Controladores CRUD y toggles rápidos
│   │   └── categoryController.ts    # Controladores de categorías
│   ├── data/
│   │   └── seedData.ts              # Catálogo inicial de 14 perfumes de alta gama
│   ├── prisma/
│   │   └── seed.ts                  # Script de siembra para PostgreSQL
│   ├── repositories/
│   │   └── productRepository.ts     # Capa de datos resiliente (Prisma Postgres + Fallback)
│   ├── routes/
│   │   ├── productRoutes.ts         # Endpoints /api/productos
│   │   ├── categoryRoutes.ts        # Endpoints /api/categorias
│   │   └── index.ts                 # Router principal y health check
│   ├── utils/
│   │   └── serializer.ts            # Serialización segura de BigInt y Decimal a JSON
│   └── server.ts                    # Punto de entrada Express (puerto 4000)
├── tsconfig.json                    # Configuración TypeScript del backend
└── .env                             # Variables de entorno locales
```

---

## 2. Endpoints de la API REST

**URL Base:** `http://localhost:4000/api`

### Catálogo y Clientes:
- **`GET /api/productos`**: Retorna la lista de perfumes. Acepta filtros por query string:
  - `?disponible=true`: Filtra solo perfumes disponibles en stock.
  - `?destacado=true`: Filtra solo perfumes favoritos/destacados.
  - `?categoria_id=1`: Filtra por categoría (1 = Nicho, 2 = Diseñador).
  - `?genero=Unisex`: Filtra por género (`Hombre`, `Mujer`, `Unisex`).
  - `?search=oud`: Búsqueda por nombre, marca o notas.
- **`GET /api/productos/destacados`**: Atajo directo para obtener los perfumes favoritos del inicio.
- **`GET /api/productos/disponibles`**: Atajo para obtener perfumes con disponibilidad de venta.
- **`GET /api/productos/:id`**: Retorna el detalle de un perfume específico por ID.
- **`GET /api/categorias`**: Lista las categorías disponibles (`Nicho`, `Diseñador`).
- **`GET /api/health`**: Diagnóstico del estado del servidor y conexión a PostgreSQL.

### Administración (CRUD de Productos):
- **`POST /api/productos`**: Crea un nuevo perfume.
  - **Body (JSON):**
    ```json
    {
      "nombre": "Tabac Doré Niche Millésime",
      "marca": "Bortnikoff Parfums",
      "categoria_id": 1,
      "precio": 19500,
      "tamano_ml": 50,
      "genero": "Unisex",
      "concentracion": "Extrait de Parfum",
      "familia_olfativa": "Gourmand / Especiada",
      "notas_principales": "Tabaco rubio, Vainilla de Tahití, Cacao",
      "imagen_url": "/assets/images/campaign_tobacco_gold_1793303201731.jpg",
      "destacado": true,
      "disponible": true
    }
    ```
- **`PUT /api/productos/:id`**: Actualiza campos de un perfume existente.
- **`DELETE /api/productos/:id`**: Elimina un perfume del catálogo.
- **`PATCH /api/productos/:id/toggle-disponible`**: Alterna con 1 clic entre disponible y agotado.
- **`PATCH /api/productos/:id/toggle-destacado`**: Alterna con 1 clic entre destacado/favorito y normal.

---

## 3. Integración con el Frontend

### A. Página del Cliente
1. **Catálogo dinámico:** `Frontend/src/App.tsx` consume `productService.getClientPerfumes()`, sincronizándose en tiempo real con las modificaciones hechas por el administrador.
2. **Favoritos / Destacados:** Se muestran en la sección "Los Más Vendidos / Iconos de la Alta Perfumería" y carruseles principales.
3. **Bolsa y WhatsApp:** Al agregar productos a la bolsa, el panel `CartDrawer.tsx` incluye el botón destacado:
   - **`Pedir por WhatsApp al Proveedor`**: Compila automáticamente la lista de perfumes seleccionados (nombre, presentación en ml, cantidades, precios unitarios y subtotal/total en RD$) y abre la conversación directa en WhatsApp (`https://wa.me/18295553842`).

### B. Página del Administrador (CRUD)
- Ubicada en `Frontend/src/components/AdminProducts.tsx`.
- Accesible desde el botón **`Admin`** en la barra de navegación superior.
- Incluye:
  - Tarjetas con métricas en tiempo real (Total Catálogo, En Disponibilidad, Favoritos Destacados, Agotados).
  - Buscador y filtros combinados por categoría y estado.
  - Botón **`+ Agregar Perfume`** con formulario modal completo.
  - Botón estrella para alternar **Favorito / Destacado** al instante.
  - Píldora de estado para alternar **Disponible / Agotado** al instante.
  - Opciones de **Editar** y **Eliminar** con modal de confirmación.

---

## 4. Comandos de Ejecución

### Iniciar Backend y Frontend:

1. **Iniciar el Servidor Backend:**
   ```bash
   npm run server
   ```
   *O en modo desarrollo con recarga automática:*
   ```bash
   npm run server:dev
   ```
   El servidor responderá en `http://localhost:4000`.

2. **Iniciar el Frontend (en otra terminal):**
   ```bash
   npm run dev
   ```
   La aplicación web abrirá en `http://localhost:3000`.

### Comandos de Base de Datos (Prisma):

- **Regenerar el cliente de Prisma:**
  ```bash
  npm run prisma:generate
  ```
- **Ejecutar migraciones en PostgreSQL:**
  ```bash
  npm run prisma:migrate
  ```
- **Sembrar datos iniciales en PostgreSQL:**
  ```bash
  npm run prisma:seed
  ```
- **Abrir panel visual Prisma Studio:**
  ```bash
  npm run prisma:studio
  ```

---

## 5. Conexión con PostgreSQL

El esquema Prisma se encuentra en:
`base-de-datos/prisma/schema.prisma`

Para apuntar a tu base de datos de PostgreSQL (Supabase, Neon, Railway o local), edita `DATABASE_URL` en el archivo `.env`:
```env
DATABASE_URL="postgresql://usuario:password@host:5432/nombre_db?schema=public"
```

> **Nota de Resiliencia:** Si la base de datos PostgreSQL aún no está encendida o configurada, el backend detecta la situación e inicia automáticamente con un repositorio sincronizado de alto rendimiento. Esto permite desarrollar, navegar y probar el CRUD completo inmediatamente sin bloqueos.
