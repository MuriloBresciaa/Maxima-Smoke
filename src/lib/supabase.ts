import { createClient } from "@supabase/supabase-js";

/* ─── Environment Variables ─── */
const supabaseUrl = import.meta.env.PUBLIC_SUPABASE_URL as string;
const supabaseAnonKey = import.meta.env.PUBLIC_SUPABASE_ANON_KEY as string;

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error(
    "[Supabase] Missing PUBLIC_SUPABASE_URL or PUBLIC_SUPABASE_ANON_KEY in .env"
  );
}

/* ─── Client ─── */
export const supabase = createClient(supabaseUrl, supabaseAnonKey);

/* ─── Database Types (3NF) ──────────────────────────────────────
   Reflects the relational join: products ←→ categories
   Query: .select('*, categories(name)')
────────────────────────────────────────────────────────────────── */

/** Raw row from the `categories` table (joined via FK). */
export interface Category {
  id?: string;    // uuid, primary key
  name: string;   // varchar(100) UNIQUE NOT NULL
  slug?: string;  // varchar(100) UNIQUE (optional for future routing)
}

/**
 * Matches the `products` table with the `categories` relation eagerly joined.
 * Supabase returns the FK relation as a nested object when using
 * `.select('*, categories(name)')`.
 *
 * Note: `categories` may be `null` if the FK is unset or the row is orphaned —
 * always guard with `product.categories?.name ?? 'Sem categoria'`.
 */
export interface Product {
  id: string;                      // uuid, primary key
  name: string;                    // varchar(255) NOT NULL
  description: string;             // text
  price: number;                   // numeric(10,2) NOT NULL
  image_url: string;               // text
  category_id: string;             // uuid FK → categories.id
  categories: { name: string } | null; // eagerly joined via FK
  stock: number;                   // integer DEFAULT 0
  is_active: boolean;              // boolean DEFAULT true
  created_at?: string;             // timestamptz (auto-managed)
}

/* ─── Query Helpers ─── */

/**
 * Fetches all active products with their category name eagerly joined.
 * Runs at build time in Astro frontmatter (SSG) — zero client JS.
 * Falls back to [] on any error so the build always succeeds.
 */
export async function fetchActiveProducts(): Promise<Product[]> {
  const { data, error } = await supabase
    .from("products")
    .select("*, categories(name)")
    .eq("is_active", true)
    .order("created_at", { ascending: false });

  if (error) {
    console.error("[Supabase] Failed to fetch products:", error.message);
    return [];
  }

  return (data as Product[]) ?? [];
}
