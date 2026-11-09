-- =====================================================
-- Base de datos: D' Victor Fragancias
-- Motor: PostgreSQL 15+ (Nativo de Supabase)
-- =====================================================

-- -----------------------------------------------------
-- 1. usuarios (Perfil público vinculado a Supabase Auth)
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS public.usuarios (
  id                UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  nombre            TEXT NOT NULL,
  apellido          TEXT,
  email             TEXT NOT NULL,
  telefono          TEXT,                       -- Para entregas locales y WhatsApp en RD
  avatar_url        TEXT,
  rol               TEXT NOT NULL DEFAULT 'cliente' CHECK (rol IN ('cliente', 'admin')),
  activo            BOOLEAN NOT NULL DEFAULT true,
  fecha_registro    TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

-- Trigger automático: Cuando alguien se registra con Google o Email en Supabase Auth,
-- se crea automáticamente su registro en la tabla pública de usuarios.
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.usuarios (id, email, nombre, apellido, avatar_url)
  VALUES (
    NEW.id,
    NEW.email,
    COALESCE(NEW.raw_user_meta_data->>'full_name', NEW.raw_user_meta_data->>'name', 'Cliente'),
    NEW.raw_user_meta_data->>'family_name',
    NEW.raw_user_meta_data->>'avatar_url'
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE OR REPLACE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE PROCEDURE public.handle_new_user();

-- -----------------------------------------------------
-- 2. marcas (Casas de perfumería)
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS public.marcas (
  id           BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  nombre       TEXT NOT NULL UNIQUE,
  slug         TEXT NOT NULL UNIQUE,
  logo_url     TEXT,
  descripcion  TEXT,
  pais_origen  TEXT
);

-- -----------------------------------------------------
-- 3. categorias (Taxonomía con subcategorías)
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS public.categorias (
  id                  BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  categoria_padre_id  BIGINT REFERENCES public.categorias(id) ON DELETE SET NULL,
  nombre              TEXT NOT NULL,
  slug                TEXT NOT NULL UNIQUE,
  imagen_url          TEXT,
  activa              BOOLEAN NOT NULL DEFAULT true
);

-- -----------------------------------------------------
-- 4. productos (Ficha técnica y olfativa completa)
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS public.productos (
  id                  BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  marca_id            BIGINT NOT NULL REFERENCES public.marcas(id) ON DELETE RESTRICT,
  categoria_id        BIGINT NOT NULL REFERENCES public.categorias(id) ON DELETE RESTRICT,
  nombre              TEXT NOT NULL,
  slug                TEXT NOT NULL UNIQUE,
  descripcion         TEXT,
  tipo_perfumeria     TEXT NOT NULL DEFAULT 'Nicho' CHECK (tipo_perfumeria IN ('Nicho', 'Diseñador')),
  genero              TEXT NOT NULL CHECK (genero IN ('Hombre', 'Mujer', 'Unisex')),
  concentracion       TEXT NOT NULL CHECK (concentracion IN ('EDC', 'EDT', 'EDP', 'Parfum', 'Extrait de Parfum')),
  familia_olfativa    TEXT NOT NULL,

  -- Pirámide olfativa almacenada en JSONB nativo de PostgreSQL
  notas_salida        JSONB DEFAULT '[]'::jsonb,
  notas_corazon       JSONB DEFAULT '[]'::jsonb,
  notas_fondo         JSONB DEFAULT '[]'::jsonb,
  longevidad          TEXT,                     -- Ej: '16+ horas'
  estela              TEXT CHECK (estela IN ('Íntima', 'Moderada', 'Pronunciada', 'Enorme')),
  ocasion_recomendada TEXT,
  batch_code_ejemplo  TEXT,

  -- Visualización y filtros
  destacado           BOOLEAN NOT NULL DEFAULT false, -- Los Más Vendidos
  es_nuevo            BOOLEAN NOT NULL DEFAULT false, -- Nuevas Llegadas
  activo              BOOLEAN NOT NULL DEFAULT true,
  fecha_creacion      TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

CREATE INDEX IF NOT EXISTS idx_productos_activo_destacado ON public.productos (activo, destacado);
CREATE INDEX IF NOT EXISTS idx_productos_es_nuevo ON public.productos (activo, es_nuevo);
CREATE INDEX IF NOT EXISTS idx_productos_genero ON public.productos (genero);
CREATE INDEX IF NOT EXISTS idx_productos_tipo ON public.productos (tipo_perfumeria);

-- -----------------------------------------------------
-- 5. variantes_producto (Tallas en ml y precios en RD$)
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS public.variantes_producto (
  id             BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  producto_id    BIGINT NOT NULL REFERENCES public.productos(id) ON DELETE CASCADE,
  sku            TEXT NOT NULL UNIQUE,
  tamano_ml      INTEGER NOT NULL CHECK (tamano_ml > 0),
  precio         NUMERIC(10,2) NOT NULL CHECK (precio >= 0),
  precio_oferta  NUMERIC(10,2) CHECK (precio_oferta IS NULL OR (precio_oferta >= 0 AND precio_oferta < precio)),
  stock          INTEGER NOT NULL DEFAULT 0 CHECK (stock >= 0),
  activa         BOOLEAN NOT NULL DEFAULT true,

  CONSTRAINT uq_variantes_producto_tamano UNIQUE (producto_id, tamano_ml)
);

-- -----------------------------------------------------
-- 6. imagenes_producto
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS public.imagenes_producto (
  id            BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  producto_id   BIGINT NOT NULL REFERENCES public.productos(id) ON DELETE CASCADE,
  url           TEXT NOT NULL,
  texto_alt     TEXT,
  orden         INTEGER NOT NULL DEFAULT 0,
  es_principal  BOOLEAN NOT NULL DEFAULT false
);

CREATE INDEX IF NOT EXISTS idx_imagenes_producto_orden ON public.imagenes_producto (producto_id, orden);

-- -----------------------------------------------------
-- 7. carritos (Visitantes o usuarios logueados)
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS public.carritos (
  id                   BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  usuario_id           UUID REFERENCES public.usuarios(id) ON DELETE SET NULL,
  token_sesion         TEXT UNIQUE,
  fecha_creacion       TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now()),
  fecha_actualizacion  TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now()),

  CONSTRAINT chk_carritos_dueno CHECK (usuario_id IS NOT NULL OR token_sesion IS NOT NULL)
);

CREATE INDEX IF NOT EXISTS idx_carritos_usuario ON public.carritos (usuario_id);

-- -----------------------------------------------------
-- 8. items_carrito
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS public.items_carrito (
  id           BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  carrito_id   BIGINT NOT NULL REFERENCES public.carritos(id) ON DELETE CASCADE,
  variante_id  BIGINT NOT NULL REFERENCES public.variantes_producto(id) ON DELETE CASCADE,
  cantidad     INTEGER NOT NULL DEFAULT 1 CHECK (cantidad >= 1),

  CONSTRAINT uq_items_carrito_variante UNIQUE (carrito_id, variante_id)
);

-- -----------------------------------------------------
-- 9. resenas
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS public.resenas (
  id            BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  producto_id   BIGINT NOT NULL REFERENCES public.productos(id) ON DELETE CASCADE,
  usuario_id    UUID NOT NULL REFERENCES public.usuarios(id) ON DELETE CASCADE,
  calificacion  SMALLINT NOT NULL CHECK (calificacion BETWEEN 1 AND 5),
  titulo        TEXT,
  comentario    TEXT,
  aprobada      BOOLEAN NOT NULL DEFAULT false,
  fecha         TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now()),

  CONSTRAINT uq_resenas_producto_usuario UNIQUE (producto_id, usuario_id)
);

CREATE INDEX IF NOT EXISTS idx_resenas_usuario ON public.resenas (usuario_id);

-- -----------------------------------------------------
-- 10. favoritos (Wishlist)
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS public.favoritos (
  usuario_id   UUID NOT NULL REFERENCES public.usuarios(id) ON DELETE CASCADE,
  producto_id  BIGINT NOT NULL REFERENCES public.productos(id) ON DELETE CASCADE,
  fecha        TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now()),

  PRIMARY KEY (usuario_id, producto_id)
);

CREATE INDEX IF NOT EXISTS idx_favoritos_producto ON public.favoritos (producto_id);

-- =====================================================
-- SEGURIDAD (Row Level Security - RLS de Supabase)
-- =====================================================
ALTER TABLE public.marcas ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.categorias ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.productos ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.variantes_producto ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.imagenes_producto ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.usuarios ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.favoritos ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.resenas ENABLE ROW LEVEL SECURITY;

-- Catálogo de libre lectura para cualquier visitante:
DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'Lectura pública de marcas') THEN
    CREATE POLICY "Lectura pública de marcas" ON public.marcas FOR SELECT USING (true);
  END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'Lectura pública de categorias') THEN
    CREATE POLICY "Lectura pública de categorias" ON public.categorias FOR SELECT USING (activa = true);
  END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'Lectura pública de productos') THEN
    CREATE POLICY "Lectura pública de productos" ON public.productos FOR SELECT USING (activo = true);
  END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'Lectura pública de variantes') THEN
    CREATE POLICY "Lectura pública de variantes" ON public.variantes_producto FOR SELECT USING (activa = true);
  END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'Lectura pública de imagenes') THEN
    CREATE POLICY "Lectura pública de imagenes" ON public.imagenes_producto FOR SELECT USING (true);
  END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'Lectura pública de resenas aprobadas') THEN
    CREATE POLICY "Lectura pública de resenas aprobadas" ON public.resenas FOR SELECT USING (aprobada = true);
  END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'Usuarios leen su propio perfil') THEN
    CREATE POLICY "Usuarios leen su propio perfil" ON public.usuarios FOR SELECT USING (auth.uid() = id);
  END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'Usuarios gestionan sus favoritos') THEN
    CREATE POLICY "Usuarios gestionan sus favoritos" ON public.favoritos FOR ALL USING (auth.uid() = usuario_id);
  END IF;
END $$;

/*
===============================================================================
  TABLAS EN RESERVA / INACTIVAS (FASE FUTURA PARA SUPABASE)
  Descomentar cuando el cliente requiera persistir órdenes y cupones en Supabase.
===============================================================================

-- -----------------------------------------------------
-- 11. cupones (Inactiva actualmente)
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS public.cupones (
  id                  BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  codigo              TEXT NOT NULL UNIQUE,
  tipo_descuento      TEXT NOT NULL DEFAULT 'porcentaje' CHECK (tipo_descuento IN ('porcentaje', 'monto_fijo')),
  valor_descuento     NUMERIC(10,2) NOT NULL,
  compra_minima       NUMERIC(10,2) DEFAULT 0,
  usos_maximos        INTEGER,
  usos_actuales       INTEGER NOT NULL DEFAULT 0,
  activo              BOOLEAN NOT NULL DEFAULT true,
  fecha_expiracion    TIMESTAMPTZ
);

-- -----------------------------------------------------
-- 12. pedidos (Inactiva actualmente)
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS public.pedidos (
  id                BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  numero_orden      TEXT NOT NULL UNIQUE,       -- Ej: 'DV-849201'
  usuario_id        UUID REFERENCES public.usuarios(id) ON DELETE SET NULL,
  cupon_id          BIGINT REFERENCES public.cupones(id) ON DELETE SET NULL,
  nombre_completo   TEXT NOT NULL,
  telefono          TEXT NOT NULL,
  email             TEXT NOT NULL,
  provincia         TEXT NOT NULL,
  sector            TEXT NOT NULL,
  direccion         TEXT NOT NULL,
  notas             TEXT,
  tipo_envio        TEXT NOT NULL CHECK (tipo_envio IN ('express-sd', 'nacional')),
  metodo_pago       TEXT NOT NULL CHECK (metodo_pago IN ('contra-entrega', 'transferencia', 'tarjeta', 'whatsapp')),
  estado_pago       TEXT NOT NULL DEFAULT 'pendiente' CHECK (estado_pago IN ('pendiente', 'confirmado', 'reembolsado')),
  estado_pedido     TEXT NOT NULL DEFAULT 'recibido' CHECK (estado_pedido IN ('recibido', 'en_preparacion', 'despachado', 'entregado', 'cancelado')),
  subtotal          NUMERIC(10,2) NOT NULL,
  descuento         NUMERIC(10,2) NOT NULL DEFAULT 0,
  costo_envio       NUMERIC(10,2) NOT NULL DEFAULT 0,
  total             NUMERIC(10,2) NOT NULL,
  fecha_creacion    TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

CREATE INDEX IF NOT EXISTS idx_pedidos_usuario ON public.pedidos (usuario_id);
CREATE INDEX IF NOT EXISTS idx_pedidos_estado ON public.pedidos (estado_pedido);

-- -----------------------------------------------------
-- 13. items_pedido (Inactiva actualmente)
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS public.items_pedido (
  id              BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  pedido_id       BIGINT NOT NULL REFERENCES public.pedidos(id) ON DELETE CASCADE,
  variante_id     BIGINT NOT NULL REFERENCES public.variantes_producto(id) ON DELETE RESTRICT,
  precio_unitario NUMERIC(10,2) NOT NULL,
  cantidad        INTEGER NOT NULL DEFAULT 1 CHECK (cantidad >= 1),
  subtotal        NUMERIC(10,2) NOT NULL
);

CREATE INDEX IF NOT EXISTS idx_items_pedido ON public.items_pedido (pedido_id);
===============================================================================
*/
