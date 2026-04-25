# Tech Stack & Architectural Rules — Máxima Smoke E-commerce

- **Framework:** Astro v6+ (Static Site Generation with Islands Architecture).
- **Interactivity:** React 19 via `@astrojs/react`.
- **Language:** TypeScript (Strict mode).
- **Styling:** Tailwind CSS v4 via `@tailwindcss/vite`.
- **Component Library:** Shadcn/ui (New York style, manual installation).

## Islands Architecture
- React components are used ONLY when interactivity is required (cart, forms, filters).
- Always use `client:load` for critical interactivity (cart, checkout) or `client:idle` for deferred components.
- Static pages (without JS) must be pure Astro (`.astro` files).
- Product listing pages should maximize static rendering; only interactive elements hydrate.

## E-commerce Stack
- **State Management:** Nano Stores (`nanostores` + `@nanostores/react`) for global cart state across Islands.
- **Headless CMS:** Supabase (preferred) or Sanity.io for product catalog and inventory management.
- **Payment Gateway:** Mercado Pago (primary, PIX/boleto) + Stripe (international cards).
- **Shipping API:** Correios API (ViaCEP for address lookup + Correios SIGEP for rate calculation).
- **Search:** Fuse.js for client-side product search (upgrade to Algolia if catalog > 500 SKUs).

## Directory Structure
- `src/components/ui/`: Shadcn primitives (Button, Input, Card, Badge, Dialog, etc.).
- `src/components/sections/`: Composite page sections (Hero, ProductGrid, Cart, Checkout).
- `src/components/product/`: Product-specific components (ProductCard, ProductQuickView).
- `src/layouts/`: Astro master layouts (storefront, checkout).
- `src/pages/`: Astro routes (index, products, product/[slug], cart, checkout).
- `src/lib/`: Utility functions (`utils.ts`, `cart.ts`, `shipping.ts`).
- `src/stores/`: Nano Stores (cartStore, uiStore).
