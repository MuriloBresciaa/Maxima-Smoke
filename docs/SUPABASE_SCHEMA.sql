-- ============================================================
-- Máxima Smoke E-commerce — Supabase Schema (3NF — UUID)
-- Execute this SQL in the Supabase Dashboard > SQL Editor
-- Both tables use UUID primary keys (gen_random_uuid()).
-- ============================================================

-- ─── CLEAN SLATE (uncomment if re-running from scratch) ───────
-- DROP TABLE IF EXISTS public.products CASCADE;
-- DROP TABLE IF EXISTS public.categories CASCADE;


-- ─── 1. Categories Table (parent) ────────────────────────────
CREATE TABLE IF NOT EXISTS public.categories (
  id    UUID         PRIMARY KEY DEFAULT gen_random_uuid(),
  name  VARCHAR(100) NOT NULL UNIQUE,
  slug  VARCHAR(100) NOT NULL UNIQUE   -- for future URL routing
);

-- RLS for categories — public read
ALTER TABLE public.categories ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Public can view categories"
  ON public.categories
  FOR SELECT
  USING (TRUE);

CREATE POLICY "Authenticated users can manage categories"
  ON public.categories
  FOR ALL
  TO authenticated
  USING (TRUE)
  WITH CHECK (TRUE);

-- Seed categories
INSERT INTO public.categories (name, slug) VALUES
  ('Pods Descartáveis',     'pods-descartaveis'),
  ('Essências de Narguile', 'essencias-de-narguile'),
  ('Sedas & Filtros',       'sedas-e-filtros'),
  ('Tabacos',               'tabacos'),
  ('Acessórios',            'acessorios')
ON CONFLICT (slug) DO NOTHING;


-- ─── 2. Products Table (child, FK → categories.id UUID) ───────
CREATE TABLE IF NOT EXISTS public.products (
  id           UUID           PRIMARY KEY DEFAULT gen_random_uuid(),
  name         VARCHAR(255)   NOT NULL,
  description  TEXT           NOT NULL DEFAULT '',
  price        NUMERIC(10, 2) NOT NULL CHECK (price >= 0),
  image_url    TEXT           NOT NULL DEFAULT '',
  category_id  UUID           NOT NULL REFERENCES public.categories(id) ON DELETE RESTRICT,
  stock        INTEGER        NOT NULL DEFAULT 0 CHECK (stock >= 0),
  is_active    BOOLEAN        NOT NULL DEFAULT TRUE,
  created_at   TIMESTAMPTZ    NOT NULL DEFAULT NOW(),
  updated_at   TIMESTAMPTZ    NOT NULL DEFAULT NOW()
);

-- Auto-update `updated_at` on row modification
CREATE OR REPLACE FUNCTION public.handle_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS set_products_updated_at ON public.products;
CREATE TRIGGER set_products_updated_at
  BEFORE UPDATE ON public.products
  FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();


-- ─── 3. Row Level Security ────────────────────────────────────
ALTER TABLE public.products ENABLE ROW LEVEL SECURITY;

-- Public anon users can SELECT active products (storefront)
CREATE POLICY "Public can view active products"
  ON public.products
  FOR SELECT
  USING (is_active = TRUE);

-- Only authenticated users can INSERT/UPDATE/DELETE
CREATE POLICY "Authenticated users can manage products"
  ON public.products
  FOR ALL
  TO authenticated
  USING (TRUE)
  WITH CHECK (TRUE);


-- ─── 4. Indexes ───────────────────────────────────────────────
CREATE INDEX IF NOT EXISTS idx_products_category_id  ON public.products (category_id);
CREATE INDEX IF NOT EXISTS idx_products_is_active    ON public.products (is_active);
CREATE INDEX IF NOT EXISTS idx_products_created_at   ON public.products (created_at DESC);


-- ─── 5. Seed Data — Produtos Iniciais ─────────────────────────
-- Resolves category_id by slug (safe & idempotent)
INSERT INTO public.products (name, description, price, image_url, category_id, stock, is_active)
VALUES
  (
    'Pod Descartável Ignite V15 — 1500 Puffs',
    'O Ignite V15 entrega 1500 puffs de sabor intenso com bateria embutida de 550mAh e líquido premium de 6ml. Design slim e resistente, perfeito para o dia a dia.',
    89.90,
    '',
    (SELECT id FROM public.categories WHERE slug = 'pods-descartaveis'),
    50,
    TRUE
  ),
  (
    'Essência Zomo Strong Mint — 50g',
    'Strong Mint da Zomo é uma das essências de hortelã mais refrescantes do mercado. Fumaça densa, sabor prolongado e aroma inconfundível. Ideal para narguile.',
    12.00,
    '',
    (SELECT id FROM public.categories WHERE slug = 'essencias-de-narguile'),
    120,
    TRUE
  ),
  (
    'Seda RAW Black Single Wide — Bloco 25un',
    'Seda RAW Black é produzida com carvão vegetal ativado em sua composição, proporcionando uma queima mais lenta e uniforme. Single Wide, ideal para cigarros finos.',
    15.00,
    '',
    (SELECT id FROM public.categories WHERE slug = 'sedas-e-filtros'),
    200,
    TRUE
  );


-- ─── Verification Queries ─────────────────────────────────────
-- Run these after applying to confirm everything is wired correctly:
--
-- SELECT p.id, p.name, p.price, c.name AS category, p.stock, p.is_active
-- FROM public.products p
-- JOIN public.categories c ON p.category_id = c.id;
--
-- SELECT * FROM public.categories ORDER BY name;
