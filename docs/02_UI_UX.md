# UI/UX & Design System
- **CSS Engine:** Tailwind CSS v4 via `@tailwindcss/vite`.
- **Component Library:** Shadcn/ui (New York style, Zinc base, CSS Variables).

## Shadcn/ui Rules
- Imports always use the `@/` alias mapping to `./src/`.
- New components must be created manually (do not use `shadcn add` via CLI in Astro).
- Strictly follow the New York style definitions.

## Styling & Tokens
- All color tokens are defined in `src/styles/global.css`.
- Dark theme is the default (apply `class="dark"` to `<html>`).
- Use Shadcn CSS variables (`--background`, `--foreground`). Never use hardcoded colors.

## Performance
- Images must use WebP and `loading="lazy"`.
- Fonts via Google Fonts with `preconnect`.
- Target: Lighthouse 95+.
