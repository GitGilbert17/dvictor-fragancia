# Arquitectura y organización

## Estructura

```text
dvictor-fragancia/
├── Frontend/
│   ├── index.html
│   ├── metadata.json
│   ├── vite.config.ts
│   ├── tsconfig.json
│   ├── scripts/clean.mjs
│   ├── public/assets/
│   │   ├── images/        Imágenes del catálogo, hero y campañas
│   │   ├── logos/         Logos servidos por la web
│   │   ├── Img/           Fotografías originales conservadas
│   │   └── aistudio/      Recursos originales conservados
│   └── src/
│       ├── main.tsx
│       ├── App.tsx
│       ├── index.css
│       ├── types.ts
│       ├── components/
│       ├── data/perfumes.ts
│       └── assets/logos/  Copias originales conservadas
├── backend/              Reservado; sin servidor implementado
├── base-de-datos/
│   └── prisma/           Reservado; sin esquema, cliente ni migraciones
├── documentos/
├── package.json
├── package-lock.json
├── README.md
├── LICENSE
└── .gitignore
```

## Conexiones actuales

1. Los scripts del `package.json` raíz seleccionan `Frontend/vite.config.ts`.
2. Vite usa `Frontend/` como raíz de la aplicación y abre `Frontend/index.html`.
3. La URL `/src/main.tsx` del HTML se resuelve dentro de `Frontend/`; monta
   `App.tsx`, importa los estilos y conecta los componentes mediante imports relativos.
4. `Frontend/src/data/perfumes.ts` proporciona el catálogo estático, las casas y
   las provincias. Es información de demostración usada directamente en el
   navegador, por eso permanece en el frontend; no es una base de datos.
5. `Frontend/public/` sirve las URLs públicas sin incluir el nombre de la carpeta.
   `/assets/images/...` y `/assets/logos/...` funcionan en desarrollo y producción.
6. El alias `@` de Vite apunta a `Frontend/`, en concordancia con `@/*` de
   `Frontend/tsconfig.json`. Por ejemplo, `@/src/types` resuelve los tipos de la app.
7. Los archivos `.env*`, las dependencias y `dist/` permanecen en la raíz del
   repositorio. El comando `lint` selecciona explícitamente el proyecto TypeScript
   del frontend. Tailwind procesa sus componentes y estilos durante el build.
8. Los carritos guardados en `dv_cart` conservan sus cantidades y precios. Al
   cargarlos se actualiza el prefijo antiguo de imágenes `/src/assets/images/`
   a `/assets/images/`. Los IDs y la clave `dv_wishlist` permanecen iguales.

## Backend y base de datos

En la rama reorganizada no existe servidor, endpoint HTTP, esquema Prisma,
cliente Prisma, migración, conexión SQL ni integración Supabase. Los `.gitkeep`
permiten conservar las carpetas reservadas en Git. No requieren procesos ni
conexiones para ejecutar la tienda actual.

Cuando se implemente persistencia, los controladores, rutas y servicios irán en
`backend/`; los esquemas, migraciones, semillas y configuración de Prisma irán en
`base-de-datos/`. El servidor será quien acceda a la base de datos, y el frontend
consumirá la API. Esa integración todavía no está implementada.

Las dependencias `express`, `dotenv` y `@google/genai` ya estaban declaradas sin
uso en el código. Se conserva el archivo de bloqueo y sus versiones para que
esta reorganización no cambie las dependencias.
