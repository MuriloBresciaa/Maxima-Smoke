# Estado do Projeto: Máxima Smoke E-commerce
**Fase Atual:** Fase 5 — Supabase 3NF Refatoração concluída (Products ↔ Categories).
**Última Atualização:** 2026-04-25

## Sobre o Projeto
- **Negócio:** Tabacaria física premium em Campinas/SP (R. Padre Almeida, 280 — Cambuí).
- **Horário:** Até 04:00 AM nos fins de semana.
- **Objetivo Digital:** Expandir de vendas locais para **E-commerce Nacional**.
- **Proposta de Valor:** "A Melhor Tabacaria do Cambuí, Agora no Brasil Inteiro."

## Status da Arquitetura
- [x] Astro v6 + React 19 + Tailwind CSS v4 integrados.
- [x] Shadcn/ui (Radix, Zinc, New York) inicializado manualmente.
- [x] Componentes Base gerados (Button, Input).
- [x] Roteamento de Contexto (Agentic Docs) implementado.
- [x] TypeScript strict com path alias `@/*` → `./src/*`.
- [x] Identidade visual Máxima Smoke (dark zinc-950 + emerald neon).
- [x] Hero Section (HeroMaxima) — Conversão Nacional.
- [x] **Nano Stores Cart** — `nanostores` + `@nanostores/react` instalados e configurados.
- [x] **Cart Store** — `src/store/cartStore.ts` com map atom, computed (count, total, list), e actions (add, remove, clear).
- [x] **CartWidget** — Floating button com badge animado e cart drawer completo.
- [x] **ProductCard** — Card premium com hover glow, rating, badge, "Adicionado!" animation.
- [x] **ProductGrid** — Grid responsiva com 6 produtos mock, filtros por categoria.
- [x] **CheckoutModal** — Modal com CEP auto-fill (ViaCEP), resumo do pedido, formulário de endereço e CTA WhatsApp.
- [x] **CEP Integration** — `src/lib/cep.ts` via ViaCEP API com tratamento de erros completo.
- [x] **WhatsApp Order Generator** — `src/lib/order.ts` com mensagem formatada + link `wa.me`.
- [x] **Supabase Client** — `src/lib/supabase.ts` com `Product` + `Category` types (3NF), `fetchActiveProducts()` com `.select('*, categories(name)')`.
- [x] **ProductGrid Refatorado** — Adapter `toProductData()` lê `p.categories?.name`; filtros derivados do join; 3 estados de UI.
- [x] **SQL Schema 3NF** — `docs/SUPABASE_SCHEMA.sql` com tabela `categories`, FK em `products`, RLS em ambas, seed via slug.
- [ ] Aplicar `SUPABASE_SCHEMA.sql` no Supabase Dashboard (pré-requisito para produtos aparecerem).
- [ ] Adicionar imagens WebP dos produtos no Supabase Storage e atualizar `image_url`.
- [ ] Correios API — Calculadora de frete com cotação real PAC/SEDEX.
- [ ] Payment Gateway (Mercado Pago / Stripe).

## O que foi feito

### Fase 1 — Scaffold & Infraestrutura (herdado do Site Factory)
- [x] Astro v6, React 19, Tailwind CSS v4, Shadcn/ui

### Fase 2 — Identidade Máxima Smoke
- [x] Design tokens, Layout SEO, HeroMaxima.tsx

### Fase 3 — State Management & E-commerce Core
- [x] `nanostores` + `@nanostores/react` instalados
- [x] `src/store/cartStore.ts`:
  - `cartItems` — map atom (keyed by product id)
  - `cartCount`, `cartTotal`, `cartList` — computed atoms
  - `addCartItem(product)` — adiciona ou incrementa quantidade
  - `removeCartItem(id)` — decrementa ou remove
  - `clearCartItem(id)` — remove completamente
  - `clearCart()` — esvazia o carrinho
  - `formatPrice(value)` — formata em BRL
- [x] `src/components/ui/CartWidget.tsx`:
  - FAB fixo bottom-right com badge animado (bump animation ao adicionar)
  - Exibe total price e item count
  - Cart drawer completo com: lista de itens, quantity controls (+/-), remove, subtotal, CTA "Finalizar Compra", "Limpar carrinho"
- [x] `src/components/ui/ProductCard.tsx`:
  - Hover lift + emerald border glow
  - Image zone com gradient fallback + Package icon
  - Badges (categoria, desconto, estoque), star ratings
  - "Adicionar → Adicionado! ✓" state animation
  - Direto integrado com `addCartItem()`
- [x] `src/components/sections/ProductGrid.tsx`:
  - 6 produtos mock reais da tabacaria (Ignite, Zomo, RAW, Bem Bolado, Adalya, Amsterdamer)
  - Filter pills por categoria (animadas)
  - Staggered entrance animations
  - Load more / Empty state
- [x] `src/pages/index.astro` — HeroMaxima + ProductGrid + CartWidget integrados

## Arquivos Criados/Modificados
| Arquivo | Status |
|---|---|
| `.clinerules` | ✅ Context Router Máxima Smoke |
| `docs/ESTADO.md` | ✅ Atualizado (Fase 4) |
| `docs/01_TECH_STACK.md` | ✅ Stack e-commerce |
| `docs/02_UI_UX.md` | ✅ Brand identity |
| `docs/03_DATABASE.md` | ✅ Backend architecture |
| `src/styles/global.css` | ✅ Tokens + neon glow utilities + animations |
| `src/layouts/Layout.astro` | ✅ SEO Máxima Smoke |
| `src/store/cartStore.ts` | ✅ Nano Stores cart |
| `src/lib/cep.ts` | ✅ **[NOVO]** ViaCEP integration + error handling |
| `src/lib/order.ts` | ✅ **[NOVO]** WhatsApp order generator |
| `src/components/ui/CartWidget.tsx` | ✅ FAB + drawer + CheckoutModal integration |
| `src/components/sections/CheckoutModal.tsx` | ✅ **[NOVO]** CEP form + WhatsApp CTA |
| `src/components/ui/ProductCard.tsx` | ✅ Premium card |
| `src/components/sections/HeroMaxima.tsx` | ✅ Hero Nacional |
| `src/components/sections/ProductGrid.tsx` | ✅ Grid + filtros |
| `src/pages/index.astro` | ✅ Integração completa |

## Próximo Milestone
**Fase 5 — Catálogo Real & Payment Gateway:** Conectar o catálogo de produtos a uma fonte de dados real (Supabase), integrar cotação de frete (MelhorEnvio / Correios SIGEP) e implementar gateway de pagamento (Mercado Pago Checkout Bricks com PIX).

### Tarefas Concretas (Próxima Sessão)
- [ ] Configurar Supabase: tabela `products` + Storage para imagens WebP.
- [ ] Criar `src/lib/supabase.ts` — cliente Supabase + queries.
- [ ] Substituir mock products no `ProductGrid.tsx` por dados reais.
- [ ] Criar `src/lib/shipping.ts` — cotação PAC/SEDEX via MelhorEnvio API.
- [ ] Adicionar calculadora de frete ao `CheckoutModal.tsx`.
- [ ] Integrar Mercado Pago Checkout Bricks (PIX + cartão) como fase final.
