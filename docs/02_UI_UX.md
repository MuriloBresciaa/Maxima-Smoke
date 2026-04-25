# UI/UX & Design System — Máxima Smoke

## Brand Identity
- **Aesthetic:** Premium Smoke Shop. Industrial/underground vibe with neon accents.
- **Mood:** Dark, sleek, high-conversion. The interface should feel like a premium lounge, not a generic webstore.
- **Typography:** Inter (400, 500, 600, 700) — clean, modern, legible.

## Color System
- **CSS Engine:** Tailwind CSS v4 via `@tailwindcss/vite`.
- **Component Library:** Shadcn/ui (New York style, Zinc base, CSS Variables).

### Core Palette (Dark Mode ONLY — No Light Theme)
| Token | Value (HSL) | Usage |
|---|---|---|
| `--background` | `240 6% 4%` (zinc-950) | Page background |
| `--foreground` | `0 0% 95%` | Primary text |
| `--card` | `240 5% 7%` | Card surfaces |
| `--primary` | `160 84% 39%` | **Neon Emerald** — CTAs, links, brand accent |
| `--primary-foreground` | `0 0% 2%` | Text on primary |
| `--accent` | `160 84% 39%` | Matches primary for brand consistency |
| `--muted` | `240 4% 14%` | Subtle backgrounds |
| `--muted-foreground` | `240 5% 55%` | Secondary text |
| `--border` | `240 4% 14%` | Borders |
| `--ring` | `160 84% 39%` | Focus rings (emerald) |
| `--destructive` | `0 63% 31%` | Error states |

### Extended Brand Colors (Custom Tokens)
- `--neon-glow`: `160 84% 39%` — Used for `box-shadow` glow effects on CTAs.
- `--smoke-gradient-start`: `240 6% 4%` — Gradient start (page bg).
- `--smoke-gradient-end`: `240 6% 10%` — Gradient end (subtle lift).

## Shadcn/ui Rules
- Imports always use the `@/` alias mapping to `./src/`.
- New components must be created manually (do not use `shadcn add` via CLI in Astro).
- Strictly follow the New York style definitions.

## Styling & Tokens
- All color tokens defined in `src/styles/global.css`.
- **Dark mode is the ONLY theme** — `class="dark"` is permanently on `<html>`.
- Use Shadcn CSS variables. Never use hardcoded colors.
- Neon emerald glow (`box-shadow: 0 0 20px hsl(160 84% 39% / 0.3)`) on primary CTAs.

## Micro-Interactions & Animations
- All interactive elements must have `transition-all duration-300`.
- CTAs: hover scale (`scale-[1.02]`) + enhanced glow.
- Cards: hover lift (`-translate-y-1`) + border glow.
- Smoke particle/ambient effects on Hero (CSS-only preferred, canvas fallback).

## Performance
- Images must use WebP and `loading="lazy"`.
- Fonts via Google Fonts with `preconnect`.
- Target: Lighthouse 95+ (Performance, Accessibility, SEO).
- Prioritize above-the-fold content loading.
