# Database & API Integrations — Máxima Smoke E-commerce

## Backend Architecture
This is a **headless e-commerce** frontend. There is no traditional backend server. The architecture relies on:

### 1. Product Catalog — Headless CMS
- **Primary Option:** Supabase (PostgreSQL + Row Level Security + Realtime).
- **Alternative:** Sanity.io (if richer content editing is needed).
- **Data Model (conceptual):**
  - `products` — id, name, slug, description, price, compare_at_price, images[], category_id, brand_id, stock, is_active, seo_title, seo_description, weight_grams.
  - `categories` — id, name, slug, parent_id (hierarchical: Cigarros, Tabaco, Narguile, Sedas, Essências, Acessórios).
  - `brands` — id, name, slug, logo_url (e.g., RAW, Bali Shag, Adalya, Ziggy).
  - `product_variants` — id, product_id, name (e.g., "50g", "25g"), price, stock, sku.

### 2. Payment Gateway
- **Mercado Pago (Primary):** PIX, Boleto, Credit Card. Brazilian standard. Use Checkout Pro (redirect) or Checkout Bricks (inline).
- **Stripe (Secondary):** International credit cards. Use Stripe Checkout or Payment Links.
- **Webhook Flow:** Payment confirmation → Update order status → Send confirmation email (Resend/SendGrid).

### 3. Shipping — Correios API
- **Address Lookup:** ViaCEP API (`https://viacep.com.br/ws/{cep}/json/`) for auto-fill.
- **Rate Calculation:** Correios SIGEP Web or MelhorEnvio API for freight quotes.
- **Origin CEP:** `13025-201` (Cambuí, Campinas/SP).
- **Supported Services:** PAC (economical), SEDEX (express), Mini Envios (small items).
- **Weight/Dimensions:** Must be stored per product for accurate calculation.

### 4. Order Management
- **Storage:** Supabase `orders` table.
  - `orders` — id, customer_email, customer_name, items (JSONB), subtotal, shipping_cost, total, payment_method, payment_status, shipping_tracking, status (pending, paid, shipped, delivered), created_at.
- **Status Flow:** `pending` → `paid` (webhook) → `shipped` (manual) → `delivered` (tracking update).

### 5. Authentication (Optional — Phase 2)
- Guest checkout first (higher conversion).
- Supabase Auth for repeat customers (order history, saved addresses).

## Environment Variables Needed
```env
# Supabase
SUPABASE_URL=
SUPABASE_ANON_KEY=

# Mercado Pago
MERCADO_PAGO_ACCESS_TOKEN=
MERCADO_PAGO_PUBLIC_KEY=

# Stripe (optional)
STRIPE_SECRET_KEY=
STRIPE_PUBLISHABLE_KEY=

# Correios / MelhorEnvio
MELHOR_ENVIO_TOKEN=

# Email
RESEND_API_KEY=
```
