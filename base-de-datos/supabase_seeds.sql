-- =====================================================
-- Carga inicial de datos para D' Victor Fragancias
-- Motor: PostgreSQL 15+ (Supabase)
-- =====================================================

-- 1. Marcas / Casas perfumeras
INSERT INTO public.marcas (nombre, slug, pais_origen) VALUES
('Bortnikoff Parfums', 'bortnikoff-parfums', 'Tailandia'),
('M.Micallef Paris', 'm-micallef-paris', 'Francia'),
('D’ Victor Private Reserve', 'd-victor-private-reserve', 'República Dominicana'),
('Roja Parfums', 'roja-parfums', 'Reino Unido'),
('Kilian Paris', 'kilian-paris', 'Francia'),
('Dior', 'dior', 'Francia'),
('Chanel', 'chanel', 'Francia'),
('Parfums de Marly', 'parfums-de-marly', 'Francia'),
('Maison Francis Kurkdjian', 'maison-francis-kurkdjian', 'Francia'),
('Creed', 'creed', 'Francia')
ON CONFLICT (slug) DO NOTHING;

-- 2. Categorías principales
INSERT INTO public.categorias (nombre, slug, activa) VALUES
('Perfumería Nicho', 'perfumeria-nicho', true),
('Perfumería Diseñador', 'perfumeria-disenador', true)
ON CONFLICT (slug) DO NOTHING;

-- 3. Productos estrella
-- Perfume 1: Tabac Doré Niche Millésime
INSERT INTO public.productos (
  marca_id, categoria_id, nombre, slug, descripcion,
  tipo_perfumeria, genero, concentracion, familia_olfativa,
  notas_salida, notas_corazon, notas_fondo,
  longevidad, estela, ocasion_recomendada, batch_code_ejemplo,
  destacado, es_nuevo, activo
) VALUES (
  (SELECT id FROM public.marcas WHERE slug = 'bortnikoff-parfums'),
  (SELECT id FROM public.categorias WHERE slug = 'perfumeria-nicho'),
  'Tabac Doré Niche Millésime',
  'tabac-dore-reserve',
  'Una oda embriagadora al tabaco curado al sol y a la resina dorada. Mezcla hojas de tabaco rubio envejecido con vainilla negra de Tahití, cacao amargo y una base majestuosa de oud tailandés.',
  'Nicho',
  'Unisex',
  'Extrait de Parfum',
  'Gourmand / Especiada',
  '["Hojas de Tabaco Rubio", "Cacao Silvestre", "Vainilla Negra"]'::jsonb,
  '["Bálsamo de Tolú", "Benjuí de Siam", "Higo Seco"]'::jsonb,
  '["Oud Tailandés Añejado", "Cedro del Himalaya", "Ámbar Cálido"]'::jsonb,
  '16+ horas',
  'Enorme',
  'Noches frescas, ocasiones de máxima elegancia y coleccionistas exigentes',
  'BORT-TAB-50',
  true, true, true
) ON CONFLICT (slug) DO NOTHING;

-- Perfume 2: DésirToxic Azur Élixir
INSERT INTO public.productos (
  marca_id, categoria_id, nombre, slug, descripcion,
  tipo_perfumeria, genero, concentracion, familia_olfativa,
  notas_salida, notas_corazon, notas_fondo,
  longevidad, estela, ocasion_recomendada, batch_code_ejemplo,
  destacado, es_nuevo, activo
) VALUES (
  (SELECT id FROM public.marcas WHERE slug = 'm-micallef-paris'),
  (SELECT id FROM public.categorias WHERE slug = 'perfumeria-nicho'),
  'DésirToxic Azur Élixir',
  'desirtoxic-azur-niche',
  'Un magnetismo azul y especiado que desafía las convenciones. Abre con cardamomo chispeante y bergamota soleada, evolucionando hacia un corazón de pachulí exótico, cannabis suave y almizcle cremoso.',
  'Nicho',
  'Unisex',
  'Eau de Parfum',
  'Cítrica / Fresca',
  '["Cardamomo de Ceilán", "Bergamota Fresca", "Limón Italiano"]'::jsonb,
  '["Acorde de Cannabis Suave", "Grosella Negra", "Canela"]'::jsonb,
  '["Pachulí de Indonesia", "Haba Tonka", "Almizcle Blanco", "Benjuí"]'::jsonb,
  '12+ horas',
  'Pronunciada',
  'Eventos diurnos de lujo, tardes en la marina y salidas sofisticadas',
  'MIC-DESIR-100',
  true, true, true
) ON CONFLICT (slug) DO NOTHING;

-- Perfume 3: Aeterna Nº III Golden Oudh
INSERT INTO public.productos (
  marca_id, categoria_id, nombre, slug, descripcion,
  tipo_perfumeria, genero, concentracion, familia_olfativa,
  notas_salida, notas_corazon, notas_fondo,
  longevidad, estela, ocasion_recomendada, batch_code_ejemplo,
  destacado, es_nuevo, activo
) VALUES (
  (SELECT id FROM public.marcas WHERE slug = 'd-victor-private-reserve'),
  (SELECT id FROM public.categorias WHERE slug = 'perfumeria-nicho'),
  'Aeterna Nº III Golden Oudh',
  'aeterna-golden-oudh',
  'Una obra maestra de calidez dorada y mística oriental. Combina el raro oud de Assam con toques de azafrán persa, ámbar fundido y resinas ceremoniales para una estela aristocrática e inolvidable.',
  'Nicho',
  'Unisex',
  'Extrait de Parfum',
  'Amaderada',
  '["Azafrán Real de Persia", "Bergamota Dorada", "Cardamomo de Ceilán"]'::jsonb,
  '["Oud de Assam Envejecido", "Rosa de Damasco", "Papiro Ahumado"]'::jsonb,
  '["Ámbar Cristalino", "Madera de Guayaco", "Vainilla Bourbon", "Almizcle Sedoso"]'::jsonb,
  '14+ horas',
  'Enorme',
  'Galas nocturnas, recepciones formales y ocasiones de alta distinción',
  'DV-AET-50',
  true, true, true
) ON CONFLICT (slug) DO NOTHING;

-- 4. Variantes de presentación y precios en RD$
INSERT INTO public.variantes_producto (producto_id, sku, tamano_ml, precio, stock, activa) VALUES
((SELECT id FROM public.productos WHERE slug = 'tabac-dore-reserve'), 'BORT-TAB-50ML', 50, 19500.00, 10, true),
((SELECT id FROM public.productos WHERE slug = 'tabac-dore-reserve'), 'BORT-TAB-100ML', 100, 29800.00, 5, true),
((SELECT id FROM public.productos WHERE slug = 'desirtoxic-azur-niche'), 'MIC-DES-50ML', 50, 15200.00, 12, true),
((SELECT id FROM public.productos WHERE slug = 'desirtoxic-azur-niche'), 'MIC-DES-100ML', 100, 23400.00, 7, true),
((SELECT id FROM public.productos WHERE slug = 'aeterna-golden-oudh'), 'DV-AET-50ML', 50, 12500.00, 15, true),
((SELECT id FROM public.productos WHERE slug = 'aeterna-golden-oudh'), 'DV-AET-100ML', 100, 18900.00, 8, true)
ON CONFLICT (sku) DO NOTHING;

-- 5. Imágenes asociadas a cada perfume
INSERT INTO public.imagenes_producto (producto_id, url, texto_alt, orden, es_principal) VALUES
((SELECT id FROM public.productos WHERE slug = 'tabac-dore-reserve'), '/assets/images/campaign_tobacco_gold_1793303201731.jpg', 'Tabac Doré Niche Millésime Botella', 1, true),
((SELECT id FROM public.productos WHERE slug = 'desirtoxic-azur-niche'), '/assets/images/campaign_azure_niche_1793303200950.jpg', 'DésirToxic Azur Élixir Frasco', 1, true),
((SELECT id FROM public.productos WHERE slug = 'aeterna-golden-oudh'), '/assets/images/hero_luxury_perfume_1793299734093.jpg', 'Aeterna Nº III Golden Oudh Portada', 1, true);
