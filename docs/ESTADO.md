# Estado do Projeto: Site Factory Master
**Fase Atual:** Scaffold Inicial e Configuração de Infraestrutura.
**Última Atualização:** 2026-04-25

## Status da Arquitetura
- [x] Astro v6 + React 19 + Tailwind CSS v4 integrados.
- [x] Shadcn/ui (Radix, Zinc, New York) inicializado manualmente.
- [x] Componentes Base gerados (Button, Input, HeroCapture).
- [x] Roteamento de Contexto (Agentic Docs) implementado.
- [x] TypeScript strict com path alias `@/*` → `./src/*`.
- [x] Dependências core instaladas: `clsx`, `tailwind-merge`, `class-variance-authority`, `lucide-react`, `@radix-ui/react-slot`.

## O que foi feito

### Fase 1 — Scaffold & Infraestrutura
- [x] Projeto Astro v6 inicializado (template minimal)
- [x] React 19 integrado via `@astrojs/react`
- [x] Tailwind CSS v4 configurado via `@tailwindcss/vite`
- [x] Shadcn/ui configurado manualmente (New York, Zinc, CSS Variables)

### Fase 2 — Componentes Base
- [x] `src/lib/utils.ts` — Função `cn()` para merge de classes
- [x] `src/components/ui/button.tsx` — Shadcn Button (6 variants, 4 sizes)
- [x] `src/components/ui/input.tsx` — Shadcn Input
- [x] `src/styles/global.css` — Tokens Shadcn completos (light + dark)

### Fase 3 — Layout & Landing Page
- [x] `src/layouts/Layout.astro` — Master layout com SEO, Inter font, dark mode
- [x] `src/components/sections/HeroCapture.tsx` — Hero premium com captura de email
- [x] `src/pages/index.astro` — Landing page com Island Architecture
- [x] Build de produção validado sem erros

### Fase 4 — Context Routing Architecture
- [x] Diretório `docs/` criado com documentação modular
- [x] `.clinerules` refatorado para Context Router (lazy loading)
- [x] `ESTADO.md` migrado de root para `docs/`

## Arquivos Criados/Modificados
| Arquivo | Status |
|---|---|
| `tsconfig.json` | ✅ Configurado com path aliases |
| `astro.config.mjs` | ✅ React + Tailwind + Vite alias |
| `src/lib/utils.ts` | ✅ Criado |
| `src/styles/global.css` | ✅ Tokens Shadcn completos |
| `src/components/ui/button.tsx` | ✅ Criado |
| `src/components/ui/input.tsx` | ✅ Criado |
| `src/layouts/Layout.astro` | ✅ Criado |
| `src/components/sections/HeroCapture.tsx` | ✅ Criado |
| `src/pages/index.astro` | ✅ Criado |
| `docs/ESTADO.md` | ✅ Migrado e atualizado |
| `docs/01_TECH_STACK.md` | ✅ Criado |
| `docs/02_UI_UX.md` | ✅ Criado |
| `docs/03_DATABASE.md` | ✅ Criado |
| `.clinerules` | ✅ Refatorado para Context Router |

## Tarefas Pendentes
- [ ] Configurar ambiente para Supabase/Headless CMS (Docs 03).
- [ ] Iniciar injeção de novos componentes da biblioteca padrão (Card, Dialog, etc.).
- [ ] Criar seções adicionais (Features, Pricing, Testimonials, Footer).
- [ ] Implementar API de captura de leads (endpoint Astro ou integração externa).
- [ ] Adicionar schema.org / JSON-LD para SEO avançado.
- [ ] Configurar deploy (Vercel / Netlify / Cloudflare Pages).
