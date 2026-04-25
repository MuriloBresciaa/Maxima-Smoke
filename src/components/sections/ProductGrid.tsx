import * as React from "react";
import ProductCard from "@/components/ui/ProductCard";
import type { ProductData } from "@/components/ui/ProductCard";
import type { Product } from "@/lib/supabase";
import { ArrowRight, Package } from "lucide-react";
import { Button } from "@/components/ui/button";

/* ─── DB → UI Adapter ───────────────────────────────────────────
   Maps Supabase 3NF Product (with eagerly joined categories relation)
   to the ProductCard's ProductData shape.
   Guard against null join with safe fallback.
────────────────────────────────────────────────────────────────── */
function toProductData(p: Product): ProductData {
  return {
    id: p.id,
    name: p.name,
    price: p.price,
    imageUrl: p.image_url,
    // Reads from the joined relation: .select('*, categories(name)')
    category: p.categories?.name ?? "Sem categoria",
    inStock: p.stock > 0,
    // These fields don't exist in the DB yet — they'll come from a future
    // product_meta table. Safe undefined fallback for now.
    originalPrice: undefined,
    rating: undefined,
    reviewCount: undefined,
    badge: undefined,
  };
}

/* ─── Props ─── */
interface ProductGridProps {
  initialProducts: Product[];
}

/* ─── Filter Pill ─── */
function FilterPill({
  label,
  active,
  onClick,
}: {
  label: string;
  active: boolean;
  onClick: () => void;
}) {
  return (
    <button
      onClick={onClick}
      className={`px-4 py-1.5 rounded-full text-sm font-medium transition-all duration-200 whitespace-nowrap ${
        active
          ? "bg-primary text-primary-foreground neon-glow"
          : "bg-muted/40 text-muted-foreground hover:bg-muted/70 hover:text-foreground border border-border/30"
      }`}
    >
      {label}
    </button>
  );
}

/* ─── Product Grid Section ─── */
export default function ProductGrid({ initialProducts }: ProductGridProps) {
  const [activeFilter, setActiveFilter] = React.useState("Todos");
  const [visibleCount, setVisibleCount] = React.useState(6);

  // Derive unique category names from the nested join — fully dynamic
  const categories = React.useMemo(
    () => [
      "Todos",
      ...Array.from(
        new Set(
          initialProducts
            .map((p) => p.categories?.name)
            .filter((n): n is string => !!n)
        )
      ),
    ],
    [initialProducts]
  );

  const filtered = React.useMemo(
    () =>
      activeFilter === "Todos"
        ? initialProducts
        : initialProducts.filter(
            (p) => (p.categories?.name ?? "Sem categoria") === activeFilter
          ),
    [initialProducts, activeFilter]
  );

  const visible = filtered.slice(0, visibleCount);

  // Reset visible count when filter changes
  const handleFilterChange = (cat: string) => {
    setActiveFilter(cat);
    setVisibleCount(6);
  };

  return (
    <section
      id="products"
      className="relative py-20 lg:py-28 px-4 sm:px-6 lg:px-8"
    >
      {/* Subtle top separator glow */}
      <div
        className="absolute top-0 left-0 right-0 h-px"
        style={{
          background:
            "linear-gradient(90deg, transparent, hsl(160 84% 39% / 0.3), transparent)",
        }}
      />

      <div className="max-w-7xl mx-auto">
        {/* ── Section Header ── */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-6 mb-10">
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <Package className="w-4 h-4 text-primary" />
              <span className="text-xs font-semibold text-primary uppercase tracking-widest">
                Catálogo
              </span>
            </div>
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-foreground tracking-tight">
              Produtos em Destaque
            </h2>
            <p className="text-sm text-muted-foreground max-w-sm">
              As marcas mais buscadas da tabacaria, agora com entrega para todo o
              Brasil.
            </p>
          </div>

          <Button
            variant="ghost"
            size="sm"
            className="self-start sm:self-auto text-muted-foreground hover:text-primary hover:bg-transparent group"
          >
            <span>Ver todos os produtos</span>
            <ArrowRight className="w-4 h-4 ml-1 transition-transform duration-300 group-hover:translate-x-1" />
          </Button>
        </div>

        {/* ── Category Filters ── */}
        {categories.length > 1 && (
          <div className="flex gap-2 overflow-x-auto pb-2 mb-8 scrollbar-hide">
            {categories.map((cat) => (
              <FilterPill
                key={cat}
                label={cat}
                active={activeFilter === cat}
                onClick={() => handleFilterChange(cat)}
              />
            ))}
          </div>
        )}

        {/* ── No products from DB (show skeleton/empty state) ── */}
        {initialProducts.length === 0 && (
          <div className="flex flex-col items-center justify-center py-24 gap-4">
            <div
              className="flex items-center justify-center w-16 h-16 rounded-2xl"
              style={{
                background: "hsl(240 4% 10%)",
                border: "1px solid hsl(240 4% 16%)",
              }}
            >
              <Package className="w-7 h-7 text-muted-foreground/30" />
            </div>
            <div className="text-center space-y-1">
              <p className="text-sm font-medium text-foreground">
                Catálogo em breve
              </p>
              <p className="text-xs text-muted-foreground">
                Nossos produtos estão sendo cadastrados. Volte em instantes!
              </p>
            </div>
          </div>
        )}

        {/* ── Grid ── */}
        {visible.length > 0 && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {visible.map((product, index) => (
              <div
                key={product.id}
                className="animate-float-up"
                style={{
                  animationDelay: `${index * 80}ms`,
                  animationFillMode: "both",
                }}
              >
                <ProductCard product={toProductData(product)} />
              </div>
            ))}
          </div>
        )}

        {/* ── Empty State (filter yields no results) ── */}
        {initialProducts.length > 0 && filtered.length === 0 && (
          <div className="flex flex-col items-center justify-center py-24 gap-4">
            <Package className="w-12 h-12 text-muted-foreground/30" />
            <p className="text-sm text-muted-foreground">
              Nenhum produto encontrado nesta categoria.
            </p>
          </div>
        )}

        {/* ── Load More ── */}
        {filtered.length > visibleCount && (
          <div className="flex justify-center mt-10">
            <Button
              variant="outline"
              size="lg"
              onClick={() => setVisibleCount((v) => v + 3)}
              className="h-11 px-8 border-border/50 hover:border-primary/50 hover:bg-primary/5 transition-all duration-300"
            >
              Carregar mais produtos
            </Button>
          </div>
        )}
      </div>
    </section>
  );
}
