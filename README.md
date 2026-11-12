# D’ Victor Fragancias

Tienda de perfumes de lujo para República Dominicana, construida con React 19, TypeScript, Vite 8, Tailwind CSS 4 y un backend con Node.js, Express y Prisma ORM conectado a Supabase (PostgreSQL).

---

## 🚀 Inicio Rápido

Desde la raíz del repositorio:

```bash
# 1. Instalar dependencias
npm install

# 2. Configurar variables de entorno (ver sección Backend abajo)
cp .env.example .env

# 3. Iniciar el servidor Backend (Terminal 1)
npm run server

# 4. Iniciar el Frontend (Terminal 2)
npm run dev
```

- **Frontend:** http://localhost:3000
- **Backend API:** http://localhost:4000/api

---

## 🛠️ Configuración y Uso del Backend

El backend se encuentra en la carpeta `backend/` y expone una API REST construida con Express y Prisma ORM para comunicarse con las tablas de tu base de datos en **Supabase**.

### 1. Variables de Entorno (`backend/.env`)
Configura tu archivo `backend/.env` (puedes guiarte de `backend/.env.example`):

```env
# Obtén tu URI en: Supabase Dashboard > Project Settings > Database > Connection string > URI
DATABASE_URL="postgresql://postgres:[TU_PASSWORD]@db.[TU_PROYECTO_REF].supabase.co:5432/postgres"
```

> **Nota:** Como tus tablas (`productos`, `categorias`, `usuarios`, `roles`) ya fueron creadas en Supabase, **no necesitas ejecutar migraciones**. El backend se conecta directamente a ellas.

---

### 2. Comandos del Backend y Base de Datos

| Comando | Descripción |
|---|---|
| `npm run server` | Inicia el servidor backend en http://localhost:4000 |
| `npm run server:dev` | Inicia el backend en modo desarrollo con recarga automática |
| `npm run prisma:generate` | Regenera el cliente de Prisma |
| `npm run prisma:seed` | *(Opcional)* Siembra los 14 perfumes iniciales en tu tabla `productos` si está vacía |
| `npm run prisma:studio` | Abre el panel visual web de Prisma en http://localhost:5555 |

---

### 3. Endpoints Principales de la API

| Método | Endpoint | Descripción |
|---|---|---|
| `GET` | `/api/productos` | Obtiene perfumes (soporta `?disponible=true`, `?destacado=true`, etc.) |
| `GET` | `/api/productos/destacados` | Perfumes favoritos para la página del cliente |
| `GET` | `/api/productos/disponibles` | Perfumes con stock disponible |
| `GET` | `/api/productos/:id` | Detalle de un perfume por ID |
| `POST` | `/api/productos` | Crear un perfume (**CRUD Administrador**) |
| `PUT` | `/api/productos/:id` | Actualizar un perfume (**CRUD Administrador**) |
| `DELETE` | `/api/productos/:id` | Eliminar un perfume (**CRUD Administrador**) |
| `PATCH` | `/api/productos/:id/toggle-disponible` | Alternar entre disponible y agotado con 1 clic |
| `PATCH` | `/api/productos/:id/toggle-destacado` | Alternar favorito/destacado con 1 clic |
| `GET` | `/api/categorias` | Lista de categorías (`Nicho`, `Diseñador`) |
| `GET` | `/api/health` | Estado del servidor y diagnóstico de conexión |

---

## 💻 Páginas de la Aplicación

> **Importante:** Las dos páginas son **completamente independientes**. La landing page pública no tiene ningún botón ni acceso visible hacia el panel de administración.

1. **Landing Page del Cliente (`/`):**
   - Muestra los perfumes disponibles y los favoritos/más destacados en carruseles y catálogo.
   - **Bolsa / Carrito:** Permite seleccionar presentaciones y perfumes. Incluye el botón directo **"Pedir por WhatsApp al Proveedor"**, que genera el mensaje formateado con los productos, subtotales y total en pesos dominicanos (RD$).
   - Los clientes acceden desde: `http://localhost:3000/`

2. **Panel de Administración (`/admin`) — URL privada:**
   - Página completamente separada (bundle de Vite independiente, sin código de la landing page).
   - Panel de control con métricas en tiempo real.
   - Búsqueda y filtros por estado y categoría.
   - Creación, edición y eliminación de perfumes en la base de datos de Supabase.
   - Botones rápidos para marcar perfumes como favoritos destacados o cambiar su disponibilidad.
   - Acceder desde: `http://localhost:3000/admin`

---

---

## 🔄 Trabajo en Progreso (Sesión Activa)

> **Contexto para retomar la sesión:** Se estaba implementando la separación total entre la landing page del cliente y el panel de administración usando **Vite Multi-Page App**.

### Lo que se completó en esta sesión:

- ✅ **Backend Express** completo (`backend/src/`) con rutas REST, controladores y repositorio dual (Prisma + fallback en memoria).
- ✅ **`productService.ts`** — cliente API en el frontend con fallback a datos locales.
- ✅ **`AdminProducts.tsx`** — CRUD completo del panel de administración.
- ✅ **`AdminPage.tsx`** — Wrapper del panel con su propio header, branding y botón "Ir a la Tienda".
- ✅ **`CartDrawer.tsx`** — Botón de WhatsApp con mensaje formateado en RD$.
- ✅ **`Frontend/admin.html`** — Nuevo punto de entrada HTML para la página del admin (Vite Multi-Page).
- ✅ **`Frontend/src/admin.tsx`** — Nuevo punto de entrada React para la página del admin.

### Lo que quedó pendiente (retomar aquí):

1. **Actualizar `Frontend/vite.config.ts`** — Agregar `rollupOptions.input` con las dos entradas (`main` → `index.html`, `admin` → `admin.html`) para que Vite genere dos bundles independientes.

2. **Limpiar `Frontend/src/App.tsx`** — Eliminar toda la lógica de detección de `/admin` (`isAdminPage`, `useEffect` del `popstate`/`hashchange`, el bloque `if (isAdminPage) return <AdminPage ...>`), así como los imports de `AdminPage` y los states que ya no se usarán en la landing page pública.

3. **Verificar que el build pase** — Correr `npm run build` y confirmar que se generan `dist/index.html` y `dist/admin.html` como bundles separados.

4. **Conectar Supabase** — El usuario debe pegar su `DATABASE_URL` real de Supabase en `backend/.env` y reiniciar el servidor con `npm run server` para ver el log: `✅ [Prisma] Conexión establecida exitosamente`.

### Prompt para continuar:

```
Continúa desde donde quedamos. Los archivos Frontend/admin.html y Frontend/src/admin.tsx
ya fueron creados. Ahora debes:

1. Actualizar Frontend/vite.config.ts para agregar Vite Multi-Page App con rollupOptions.input:
   - main: path.resolve(frontendDir, 'index.html')
   - admin: path.resolve(frontendDir, 'admin.html')

2. Limpiar Frontend/src/App.tsx: elimina isAdminPage, los useEffect de popstate/hashchange,
   el bloque "if (isAdminPage) return <AdminPage...>", y los imports de AdminPage.
   Mantén loadPerfumes y el estado de perfumes sincronizado con el backend.

3. Verificar que npm run build compile sin errores y genere dist/index.html y dist/admin.html.

El Header.tsx ya está limpio (sin botón Admin). El .gitignore ya excluye backend/.env.
```

---

## 📁 Estructura del Repositorio

| Carpeta | Contenido |
|---|---|
| [Frontend](Frontend/) | Aplicación React, componentes de cliente, panel admin, catálogo y bolsa |
| [backend](backend/) | Servidor Express, controladores, rutas, repositorio y configuración Prisma |
| [base-de-datos](base-de-datos/) | Esquema de Prisma (`schema.prisma`) adaptado a las tablas de Supabase |
| [documentos](documentos/README.md) | Documentación técnica, arquitectura detallada y guía del backend |
