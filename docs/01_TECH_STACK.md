# Tech Stack & Architectural Rules
- **Framework:** Astro v6+ (Static Site Generation).
- **Interactivity:** React 19 via `@astrojs/react`.
- **Language:** TypeScript (Strict mode).

## Islands Architecture
- React components are used ONLY when interactivity is required.
- Always use `client:load` or `client:idle` when importing React components in `.astro` files.
- Static pages (without JS) must be pure Astro (`.astro` files).

## Directory Structure
- `src/components/ui/`: Shadcn primitives.
- `src/components/sections/`: Composite page sections.
- `src/layouts/`: Astro master layouts.
- `src/pages/`: Astro routes.
- `src/lib/`: Utility functions (e.g., `utils.ts` with `cn()`).
