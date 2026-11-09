-- =====================================================
-- D' Victor Fragancias - Esquema para Supabase (PostgreSQL)
-- Ejecutar en: Dashboard > SQL Editor
-- Incluye: tablas, índices, triggers, funciones y políticas RLS
-- =====================================================

-- -----------------------------------------------------
-- 1. perfiles (reemplaza a "usuarios")
-- El login (email/contraseña y Google) lo maneja Supabase Auth
-- en auth.users. Aquí solo van los datos propios de la tienda.
-- -----------------------------------------------------
create table public.perfiles (
  id              uuid primary key references auth.users (id) on delete cascade,
  nombre          text not null,
  apellido        text,
  email           text unique,                 -- NULL en usuarios anónimos
  telefono        text,                        -- WhatsApp y entregas
  avatar_url      text,
  rol             text not null default 'cliente'
                  check (rol in ('cliente', 'admin')),
  activo          boolean not null default true,
  fecha_registro  timestamptz not null default now()
);

-- Función auxiliar: ¿el usuario actual es admin?
-- (security definer evita recursión de RLS sobre perfiles)
create or replace function public.es_admin()
returns boolean
language sql
stable
security definer
set search_path = ''
as $$
  select exists (
    select 1
    from public.perfiles
    where id = (select auth.uid())
      and rol = 'admin'
      and activo
  );
$$;

-- Crea el perfil automáticamente cuando alguien se registra
-- (con email o con Google). Google envía full_name, given_name,
-- family_name y avatar_url / picture en raw_user_meta_data.
create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = ''
as $$
begin
  insert into public.perfiles (id, nombre, apellido, email, avatar_url)
  values (
    new.id,
    coalesce(
      nullif(new.raw_user_meta_data->>'nombre', ''),
      nullif(new.raw_user_meta_data->>'given_name', ''),
      nullif(split_part(coalesce(new.raw_user_meta_data->>'full_name',
                                 new.raw_user_meta_data->>'name', ''), ' ', 1), ''),
      nullif(split_part(coalesce(new.email, ''), '@', 1), ''),
      'Cliente'
    ),
    coalesce(
      nullif(new.raw_user_meta_data->>'apellido', ''),
      nullif(new.raw_user_meta_data->>'family_name', '')
    ),
    new.email,
    coalesce(new.raw_user_meta_data->>'avatar_url',
             new.raw_user_meta_data->>'picture')
  );
  return new;
end;
$$;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();

-- -----------------------------------------------------
-- 2. marcas
-- -----------------------------------------------------
create table public.marcas (
  id           bigint generated always as identity primary key,
  nombre       text not null unique,
  slug         text not null unique,
  logo_url     text,
  descripcion  text,
  pais_origen  text
);

-- -----------------------------------------------------
-- 3. categorias (con subcategorías)
-- -----------------------------------------------------
create table public.categorias (
  id                  bigint generated always as identity primary key,
  categoria_padre_id  bigint references public.categorias (id) on delete set null,
  nombre              text not null,
  slug                text not null unique,
  imagen_url          text,
  activa              boolean not null default true
);

create index idx_categorias_padre on public.categorias (categoria_padre_id);

-- -----------------------------------------------------
-- 4. productos
-- -----------------------------------------------------
create table public.productos (
  id                   bigint generated always as identity primary key,
  marca_id             bigint not null references public.marcas (id) on delete restrict,
  categoria_id         bigint not null references public.categorias (id) on delete restrict,
  nombre               text not null,
  slug                 text not null unique,
  descripcion          text,
  tipo_perfumeria      text not null default 'Nicho'
                       check (tipo_perfumeria in ('Nicho', 'Diseñador')),
  genero               text not null
                       check (genero in ('Hombre', 'Mujer', 'Unisex')),
  concentracion        text not null
                       check (concentracion in ('EDC', 'EDT', 'EDP', 'Parfum', 'Extrait de Parfum')),
  familia_olfativa     text not null,

  -- Arrays nativos de Postgres: ARRAY['Bergamota','Azafrán']
  notas_salida         text[] not null default '{}',
  notas_corazon        text[] not null default '{}',
  notas_fondo          text[] not null default '{}',
  longevidad           text,
  estela               text check (estela in ('Íntima', 'Moderada', 'Pronunciada', 'Enorme')),
  ocasion_recomendada  text,
  batch_code_ejemplo   text,

  destacado            boolean not null default false,
  es_nuevo             boolean not null default false,
  activo               boolean not null default true,
  fecha_creacion       timestamptz not null default now()
);

create index idx_productos_marca         on public.productos (marca_id);
create index idx_productos_categoria     on public.productos (categoria_id);
create index idx_productos_activo_dest   on public.productos (activo, destacado);
create index idx_productos_genero        on public.productos (genero);
create index idx_productos_tipo          on public.productos (tipo_perfumeria);

-- -----------------------------------------------------
-- 5. variantes_producto (presentación, precio DOP y stock)
-- -----------------------------------------------------
create table public.variantes_producto (
  id             bigint generated always as identity primary key,
  producto_id    bigint not null references public.productos (id) on delete cascade,
  sku            text not null unique,
  tamano_ml      smallint not null check (tamano_ml > 0),
  precio         numeric(10,2) not null check (precio >= 0),
  precio_oferta  numeric(10,2),
  stock          integer not null default 0 check (stock >= 0),
  activa         boolean not null default true,

  unique (producto_id, tamano_ml),
  check (precio_oferta is null or (precio_oferta >= 0 and precio_oferta < precio))
);

-- -----------------------------------------------------
-- 6. imagenes_producto
-- -----------------------------------------------------
create table public.imagenes_producto (
  id            bigint generated always as identity primary key,
  producto_id   bigint not null references public.productos (id) on delete cascade,
  url           text not null,
  texto_alt     text,
  orden         smallint not null default 0,
  es_principal  boolean not null default false
);

create index idx_imagenes_producto_orden on public.imagenes_producto (producto_id, orden);

-- Solo una imagen principal por producto
create unique index uq_imagen_principal
  on public.imagenes_producto (producto_id)
  where es_principal;

-- -----------------------------------------------------
-- 7. carritos
-- Con Supabase conviene usar "anonymous sign-ins" para visitantes:
-- así también tienen auth.uid() y su carrito queda protegido por RLS.
-- token_sesion queda disponible si prefieres manejarlo desde un backend.
-- -----------------------------------------------------
create table public.carritos (
  id                   bigint generated always as identity primary key,
  usuario_id           uuid references public.perfiles (id) on delete cascade,
  token_sesion         text unique,
  fecha_creacion       timestamptz not null default now(),
  fecha_actualizacion  timestamptz not null default now(),

  check (usuario_id is not null or token_sesion is not null)
);

create index idx_carritos_usuario on public.carritos (usuario_id);

create or replace function public.set_fecha_actualizacion()
returns trigger
language plpgsql
set search_path = ''
as $$
begin
  new.fecha_actualizacion = now();
  return new;
end;
$$;

create trigger trg_carritos_actualizacion
  before update on public.carritos
  for each row execute function public.set_fecha_actualizacion();

-- -----------------------------------------------------
-- 8. items_carrito
-- -----------------------------------------------------
create table public.items_carrito (
  id           bigint generated always as identity primary key,
  carrito_id   bigint not null references public.carritos (id) on delete cascade,
  variante_id  bigint not null references public.variantes_producto (id) on delete cascade,
  cantidad     smallint not null default 1 check (cantidad >= 1),

  unique (carrito_id, variante_id)
);

create index idx_items_carrito_variante on public.items_carrito (variante_id);

-- -----------------------------------------------------
-- 9. cupones
-- -----------------------------------------------------
create table public.cupones (
  id                bigint generated always as identity primary key,
  codigo            text not null unique,
  tipo_descuento    text not null default 'porcentaje'
                    check (tipo_descuento in ('porcentaje', 'monto_fijo')),
  valor_descuento   numeric(10,2) not null check (valor_descuento > 0),
  compra_minima     numeric(10,2) not null default 0 check (compra_minima >= 0),
  usos_maximos      integer check (usos_maximos is null or usos_maximos > 0),
  usos_actuales     integer not null default 0 check (usos_actuales >= 0),
  activo            boolean not null default true,
  fecha_expiracion  timestamptz,

  check (tipo_descuento <> 'porcentaje' or valor_descuento <= 100),
  check (usos_maximos is null or usos_actuales <= usos_maximos)
);

-- -----------------------------------------------------
-- 10. pedidos
-- -----------------------------------------------------
create sequence public.pedidos_numero_seq start 100000;

create table public.pedidos (
  id               bigint generated always as identity primary key,
  numero_orden     text not null unique
                   default ('DV-' || nextval('public.pedidos_numero_seq')::text),
  usuario_id       uuid references public.perfiles (id) on delete set null,
  cupon_id         bigint references public.cupones (id) on delete set null,

  -- Contacto y entrega en República Dominicana
  nombre_completo  text not null,
  telefono         text not null,
  email            text not null,
  provincia        text not null,
  sector           text not null,
  direccion        text not null,
  notas            text,

  tipo_envio       text not null check (tipo_envio in ('express-sd', 'nacional')),
  metodo_pago      text not null
                   check (metodo_pago in ('contra-entrega', 'transferencia', 'tarjeta', 'whatsapp')),
  estado_pago      text not null default 'pendiente'
                   check (estado_pago in ('pendiente', 'confirmado', 'reembolsado')),
  estado_pedido    text not null default 'recibido'
                   check (estado_pedido in ('recibido', 'en_preparacion', 'despachado', 'entregado', 'cancelado')),

  -- Montos en DOP
  subtotal         numeric(10,2) not null check (subtotal >= 0),
  descuento        numeric(10,2) not null default 0 check (descuento >= 0),
  costo_envio      numeric(10,2) not null default 0 check (costo_envio >= 0),
  total            numeric(10,2) not null check (total >= 0),

  fecha_creacion   timestamptz not null default now(),

  check (total = subtotal - descuento + costo_envio)
);

create index idx_pedidos_usuario on public.pedidos (usuario_id);
create index idx_pedidos_cupon   on public.pedidos (cupon_id);
create index idx_pedidos_estado  on public.pedidos (estado_pedido);

-- -----------------------------------------------------
-- 11. items_pedido (copia inmutable de lo comprado)
-- -----------------------------------------------------
create table public.items_pedido (
  id               bigint generated always as identity primary key,
  pedido_id        bigint not null references public.pedidos (id) on delete cascade,
  variante_id      bigint not null references public.variantes_producto (id) on delete restrict,
  nombre_producto  text not null,               -- copia del nombre al comprar
  tamano_ml        smallint not null,           -- copia del tamaño al comprar
  precio_unitario  numeric(10,2) not null check (precio_unitario >= 0),
  cantidad         smallint not null default 1 check (cantidad >= 1),
  subtotal         numeric(10,2) not null check (subtotal >= 0),

  check (subtotal = precio_unitario * cantidad)
);

create index idx_items_pedido_pedido   on public.items_pedido (pedido_id);
create index idx_items_pedido_variante on public.items_pedido (variante_id);

-- -----------------------------------------------------
-- 12. resenas
-- -----------------------------------------------------
create table public.resenas (
  id            bigint generated always as identity primary key,
  producto_id   bigint not null references public.productos (id) on delete cascade,
  usuario_id    uuid not null references public.perfiles (id) on delete cascade,
  calificacion  smallint not null check (calificacion between 1 and 5),
  titulo        text,
  comentario    text,
  aprobada      boolean not null default false,
  fecha         timestamptz not null default now(),

  unique (producto_id, usuario_id)
);

create index idx_resenas_usuario on public.resenas (usuario_id);

-- -----------------------------------------------------
-- 13. favoritos
-- -----------------------------------------------------
create table public.favoritos (
  usuario_id   uuid   not null references public.perfiles (id) on delete cascade,
  producto_id  bigint not null references public.productos (id) on delete cascade,
  fecha        timestamptz not null default now(),

  primary key (usuario_id, producto_id)
);

create index idx_favoritos_producto on public.favoritos (producto_id);


-- =====================================================
-- SEGURIDAD: Row Level Security (RLS)
-- En Supabase la API es pública, así que sin RLS cualquiera
-- podría leer o modificar las tablas con la clave anon.
-- =====================================================
alter table public.perfiles           enable row level security;
alter table public.marcas             enable row level security;
alter table public.categorias         enable row level security;
alter table public.productos          enable row level security;
alter table public.variantes_producto enable row level security;
alter table public.imagenes_producto  enable row level security;
alter table public.carritos           enable row level security;
alter table public.items_carrito      enable row level security;
alter table public.cupones            enable row level security;
alter table public.pedidos            enable row level security;
alter table public.items_pedido       enable row level security;
alter table public.resenas            enable row level security;
alter table public.favoritos          enable row level security;

-- ---------- perfiles ----------
create policy "perfiles: ver el propio"
  on public.perfiles for select to authenticated
  using (id = (select auth.uid()));

create policy "perfiles: editar el propio"
  on public.perfiles for update to authenticated
  using (id = (select auth.uid()))
  with check (id = (select auth.uid()));

create policy "perfiles: admin todo"
  on public.perfiles for all to authenticated
  using (public.es_admin()) with check (public.es_admin());

-- El usuario solo puede cambiar estas columnas (no rol, activo ni email)
revoke update on public.perfiles from anon, authenticated;
grant update (nombre, apellido, telefono, avatar_url) on public.perfiles to authenticated;

-- ---------- catálogo: lectura pública, escritura solo admin ----------
create policy "marcas: lectura publica"
  on public.marcas for select to anon, authenticated using (true);
create policy "marcas: admin todo"
  on public.marcas for all to authenticated
  using (public.es_admin()) with check (public.es_admin());

create policy "categorias: lectura publica"
  on public.categorias for select to anon, authenticated using (activa);
create policy "categorias: admin todo"
  on public.categorias for all to authenticated
  using (public.es_admin()) with check (public.es_admin());

create policy "productos: lectura publica"
  on public.productos for select to anon, authenticated using (activo);
create policy "productos: admin todo"
  on public.productos for all to authenticated
  using (public.es_admin()) with check (public.es_admin());

create policy "variantes: lectura publica"
  on public.variantes_producto for select to anon, authenticated using (activa);
create policy "variantes: admin todo"
  on public.variantes_producto for all to authenticated
  using (public.es_admin()) with check (public.es_admin());

create policy "imagenes: lectura publica"
  on public.imagenes_producto for select to anon, authenticated using (true);
create policy "imagenes: admin todo"
  on public.imagenes_producto for all to authenticated
  using (public.es_admin()) with check (public.es_admin());

-- ---------- carritos: cada usuario maneja el suyo ----------
create policy "carritos: gestionar el propio"
  on public.carritos for all to authenticated
  using (usuario_id = (select auth.uid()))
  with check (usuario_id = (select auth.uid()));

create policy "items_carrito: gestionar los propios"
  on public.items_carrito for all to authenticated
  using (exists (
    select 1 from public.carritos c
    where c.id = items_carrito.carrito_id
      and c.usuario_id = (select auth.uid())
  ))
  with check (exists (
    select 1 from public.carritos c
    where c.id = items_carrito.carrito_id
      and c.usuario_id = (select auth.uid())
  ));

-- ---------- cupones: solo admin (validar desde función/Edge Function) ----------
create policy "cupones: admin todo"
  on public.cupones for all to authenticated
  using (public.es_admin()) with check (public.es_admin());

-- ---------- pedidos: el cliente solo los ve; se crean desde el servidor ----------
-- Los pedidos (incluidos los de invitados) deben crearse con una Edge Function
-- o RPC usando la service_role key, que recalcula precios y descuenta stock.
create policy "pedidos: ver los propios"
  on public.pedidos for select to authenticated
  using (usuario_id = (select auth.uid()));
create policy "pedidos: admin todo"
  on public.pedidos for all to authenticated
  using (public.es_admin()) with check (public.es_admin());

create policy "items_pedido: ver los propios"
  on public.items_pedido for select to authenticated
  using (exists (
    select 1 from public.pedidos p
    where p.id = items_pedido.pedido_id
      and p.usuario_id = (select auth.uid())
  ));
create policy "items_pedido: admin todo"
  on public.items_pedido for all to authenticated
  using (public.es_admin()) with check (public.es_admin());

-- ---------- reseñas ----------
create policy "resenas: ver aprobadas y las propias"
  on public.resenas for select to anon, authenticated
  using (aprobada or usuario_id = (select auth.uid()));
create policy "resenas: crear la propia (pendiente de aprobacion)"
  on public.resenas for insert to authenticated
  with check (usuario_id = (select auth.uid()) and aprobada = false);
create policy "resenas: borrar la propia"
  on public.resenas for delete to authenticated
  using (usuario_id = (select auth.uid()));
create policy "resenas: admin todo"
  on public.resenas for all to authenticated
  using (public.es_admin()) with check (public.es_admin());

-- ---------- favoritos ----------
create policy "favoritos: gestionar los propios"
  on public.favoritos for all to authenticated
  using (usuario_id = (select auth.uid()))
  with check (usuario_id = (select auth.uid()));

-- =====================================================
-- Para convertir a alguien en admin (ejecútalo tú, en el SQL Editor):
--   update public.perfiles set rol = 'admin' where email = 'tu@correo.com';
-- =====================================================
