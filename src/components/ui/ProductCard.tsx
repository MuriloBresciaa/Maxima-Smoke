import * as React from "react";
import { addCartItem, formatPrice } from "@/store/cartStore";
import type { CartItem } from "@/store/cartStore";
import { Button } from "@/components/ui/button";
import { ShoppingCart, Check, Star, Package } from "lucide-react";

export type ProductData = Omit<CartItem, "quantity"> & {
  originalPrice?: number;
  rating?: number;
  reviewCount?: number;
  badge?: string;
  inStock?: boolean;
};

interface ProductCardProps {
  product: ProductData;
}

export default function ProductCard({ product }: ProductCardProps) {
  const [added, setAdded] = React.useState(false);
  const [isHovered, setIsHovered] = React.useState(false);

  const discount =
    product.originalPrice && product.originalPrice > product.price
      ? Math.round(
          ((product.originalPrice - product.price) / product.originalPrice) *
            100
        )
      : null;

  function handleAdd() {
    addCartItem({
      id: product.id,
      name: product.name,
      price: product.price,
      imageUrl: product.imageUrl,
      category: product.category,
    });

    setAdded(true);
    setTimeout(() => setAdded(false), 1800);
  }

  return (
    <article
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      className="group relative flex flex-col rounded-2xl border transition-all duration-300"
      style={{
        background:
          "linear-gradient(180deg, hsl(240 5% 8%) 0%, hsl(240 6% 5%) 100%)",
        borderColor: isHovered
          ? "hsl(160 84% 39% / 0.25)"
          : "hsl(240 4% 14%)",
        boxShadow: isHovered
          ? "0 0 0 1px hsl(160 84% 39% / 0.15), 0 20px 40px hsl(0 0% 0% / 0.3)"
          : "0 4px 24px hsl(0 0% 0% / 0.2)",
        transform: isHovered ? "translateY(-4px)" : "translateY(0)",
      }}
    >
      {/* ── Image Zone ── */}
      <div
        className="relative overflow-hidden rounded-t-2xl"
        style={{ aspectRatio: "4 / 3" }}
      >
        {/* Placeholder gradient background */}
        <div
          className="absolute inset-0"
          style={{
            background:
              "linear-gradient(135deg, hsl(240 4% 12%) 0%, hsl(240 5% 8%) 60%, hsl(160 84% 39% / 0.04) 100%)",
          }}
        />

        {/* Product image or icon placeholder */}
        {product.imageUrl ? (
          <img
            src={product.imageUrl}
            alt={product.name}
            loading="lazy"
            className="absolute inset-0 w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
          />
        ) : (
          <div className="absolute inset-0 flex items-center justify-center">
            <Package className="w-16 h-16 text-muted-foreground/20 transition-transform duration-500 group-hover:scale-110" />
          </div>
        )}

        {/* Ambient glow overlay on hover */}
        <div
          className="absolute inset-0 transition-opacity duration-500 pointer-events-none"
          style={{
            background:
              "radial-gradient(ellipse at 50% 120%, hsl(160 84% 39% / 0.08) 0%, transparent 70%)",
            opacity: isHovered ? 1 : 0,
          }}
        />

        {/* Badge */}
        {product.badge && (
          <div className="absolute top-3 left-3">
            <span className="inline-flex items-center px-2.5 py-1 rounded-full bg-primary text-primary-foreground text-xs font-semibold tracking-wide shadow-lg">
              {product.badge}
            </span>
          </div>
        )}

        {/* Discount badge */}
        {discount && (
          <div className="absolute top-3 right-3">
            <span className="inline-flex items-center px-2.5 py-1 rounded-full bg-destructive/80 text-white text-xs font-bold">
              -{discount}%
            </span>
          </div>
        )}

        {/* Out of stock overlay */}
        {product.inStock === false && (
          <div className="absolute inset-0 flex items-center justify-center bg-background/70 backdrop-blur-sm">
            <span className="px-4 py-2 rounded-full bg-muted text-muted-foreground text-xs font-semibold border border-border">
              Sem Estoque
            </span>
          </div>
        )}
      </div>

      {/* ── Content ── */}
      <div className="flex flex-col flex-1 p-4 gap-3">
        {/* Category */}
        <p className="text-xs text-muted-foreground font-medium uppercase tracking-widest">
          {product.category}
        </p>

        {/* Name */}
        <h3 className="text-sm font-semibold text-foreground leading-snug line-clamp-2 group-hover:text-primary transition-colors duration-300">
          {product.name}
        </h3>

        {/* Rating */}
        {product.rating !== undefined && (
          <div className="flex items-center gap-1.5">
            <div className="flex items-center gap-0.5">
              {[...Array(5)].map((_, i) => (
                <Star
                  key={i}
                  className={`w-3 h-3 ${
                    i < Math.floor(product.rating!)
                      ? "text-primary fill-primary"
                      : "text-muted-foreground/30"
                  }`}
                />
              ))}
            </div>
            {product.reviewCount !== undefined && (
              <span className="text-xs text-muted-foreground">
                ({product.reviewCount})
              </span>
            )}
          </div>
        )}

        {/* Spacer */}
        <div className="flex-1" />

        {/* Price Row */}
        <div className="flex items-end justify-between mt-auto">
          <div>
            {product.originalPrice && (
              <p className="text-xs text-muted-foreground line-through">
                {formatPrice(product.originalPrice)}
              </p>
            )}
            <p className="text-xl font-bold text-foreground">
              {formatPrice(product.price)}
            </p>
          </div>
        </div>

        {/* Add to Cart Button */}
        <Button
          size="sm"
          variant={added ? "default" : "default"}
          onClick={handleAdd}
          disabled={product.inStock === false}
          aria-label={`Adicionar ${product.name} ao carrinho`}
          className={`w-full h-10 text-sm font-semibold transition-all duration-300 ${
            added
              ? "bg-primary/80 neon-glow"
              : "neon-glow hover:neon-glow-strong hover:scale-[1.02]"
          }`}
        >
          {added ? (
            <>
              <Check className="w-4 h-4 mr-1.5" />
              <span>Adicionado!</span>
            </>
          ) : (
            <>
              <ShoppingCart className="w-4 h-4 mr-1.5" />
              <span>Adicionar</span>
            </>
          )}
        </Button>
      </div>
    </article>
  );
}
