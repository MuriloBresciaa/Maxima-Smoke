import * as React from "react";
import { useStore } from "@nanostores/react";
import {
  cartCount,
  cartTotal,
  cartList,
  addCartItem,
  removeCartItem,
  clearCartItem,
  clearCart,
  formatPrice,
} from "@/store/cartStore";
import { Button } from "@/components/ui/button";
import CheckoutModal from "@/components/sections/CheckoutModal";
import {
  ShoppingCart,
  X,
  Plus,
  Minus,
  Trash2,
  ArrowRight,
  ShoppingBag,
} from "lucide-react";

/* ─── Cart Drawer ─── */
function CartDrawer({
  onClose,
  onCheckout,
}: {
  onClose: () => void;
  onCheckout: () => void;
}) {
  const items = useStore(cartList);
  const total = useStore(cartTotal);
  const count = useStore(cartCount);

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40"
        onClick={onClose}
        aria-hidden="true"
      />

      {/* Drawer */}
      <div
        className="fixed right-0 top-0 bottom-0 w-full max-w-sm z-50 flex flex-col"
        style={{
          background:
            "linear-gradient(180deg, hsl(240 5% 8%) 0%, hsl(240 6% 4%) 100%)",
          borderLeft: "1px solid hsl(240 4% 14%)",
          boxShadow: "-20px 0 60px hsl(0 0% 0% / 0.5)",
        }}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-5 border-b border-border/30">
          <div className="flex items-center gap-3">
            <ShoppingBag className="w-5 h-5 text-primary" />
            <h2 className="text-base font-semibold text-foreground">
              Seu Carrinho
            </h2>
            {count > 0 && (
              <span className="flex items-center justify-center w-5 h-5 rounded-full bg-primary text-primary-foreground text-xs font-bold">
                {count}
              </span>
            )}
          </div>
          <button
            onClick={onClose}
            aria-label="Fechar carrinho"
            className="flex items-center justify-center w-8 h-8 rounded-lg text-muted-foreground hover:text-foreground hover:bg-muted/50 transition-colors duration-200"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Items */}
        <div className="flex-1 overflow-y-auto px-6 py-4 space-y-3">
          {items.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full gap-4 py-16">
              <div className="flex items-center justify-center w-16 h-16 rounded-2xl bg-muted/30 border border-border/30">
                <ShoppingCart className="w-7 h-7 text-muted-foreground" />
              </div>
              <div className="text-center space-y-1">
                <p className="text-sm font-medium text-foreground">
                  Carrinho vazio
                </p>
                <p className="text-xs text-muted-foreground">
                  Adicione produtos para continuar
                </p>
              </div>
            </div>
          ) : (
            items.map((item) => (
              <div
                key={item.id}
                className="flex items-center gap-4 p-3 rounded-xl bg-card/60 border border-border/20 hover:border-border/40 transition-all duration-200"
              >
                {/* Product Image */}
                <div
                  className="w-14 h-14 rounded-lg flex-shrink-0 flex items-center justify-center overflow-hidden"
                  style={{
                    background:
                      "linear-gradient(135deg, hsl(240 4% 14%) 0%, hsl(240 5% 10%) 100%)",
                    border: "1px solid hsl(240 4% 18%)",
                  }}
                >
                  {item.imageUrl ? (
                    <img
                      src={item.imageUrl}
                      alt={item.name}
                      className="w-full h-full object-cover"
                      loading="lazy"
                    />
                  ) : (
                    <ShoppingBag className="w-5 h-5 text-muted-foreground/50" />
                  )}
                </div>

                {/* Info */}
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-foreground truncate">
                    {item.name}
                  </p>
                  <p className="text-xs text-muted-foreground mt-0.5">
                    {item.category}
                  </p>
                  <p className="text-sm font-semibold text-primary mt-1">
                    {formatPrice(item.price * item.quantity)}
                  </p>
                </div>

                {/* Quantity Controls */}
                <div className="flex flex-col items-center gap-1.5">
                  <button
                    onClick={() => addCartItem(item)}
                    aria-label={`Aumentar quantidade de ${item.name}`}
                    className="flex items-center justify-center w-6 h-6 rounded-md bg-muted/60 hover:bg-primary/20 hover:text-primary transition-colors duration-200 text-muted-foreground"
                  >
                    <Plus className="w-3 h-3" />
                  </button>
                  <span className="text-sm font-bold text-foreground w-6 text-center">
                    {item.quantity}
                  </span>
                  <button
                    onClick={() => removeCartItem(item.id)}
                    aria-label={`Diminuir quantidade de ${item.name}`}
                    className="flex items-center justify-center w-6 h-6 rounded-md bg-muted/60 hover:bg-destructive/20 hover:text-destructive transition-colors duration-200 text-muted-foreground"
                  >
                    <Minus className="w-3 h-3" />
                  </button>
                </div>

                {/* Remove */}
                <button
                  onClick={() => clearCartItem(item.id)}
                  aria-label={`Remover ${item.name} do carrinho`}
                  className="flex items-center justify-center w-7 h-7 rounded-lg text-muted-foreground hover:text-destructive hover:bg-destructive/10 transition-colors duration-200"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
            ))
          )}
        </div>

        {/* Footer */}
        {items.length > 0 && (
          <div className="px-6 py-5 border-t border-border/30 space-y-4">
            {/* Subtotal */}
            <div className="flex items-center justify-between">
              <span className="text-sm text-muted-foreground">Subtotal</span>
              <span className="text-base font-bold text-foreground">
                {formatPrice(total)}
              </span>
            </div>
            <p className="text-xs text-muted-foreground">
              Frete calculado no checkout via Correios
            </p>

            {/* Actions */}
            <div className="space-y-2">
              <Button
                id="cart-checkout-btn"
                size="lg"
                onClick={onCheckout}
                className="w-full h-12 text-sm font-semibold neon-glow hover:neon-glow-strong transition-all duration-300"
              >
                <span>Finalizar Compra</span>
                <ArrowRight className="w-4 h-4 ml-1" />
              </Button>
              <button
                onClick={clearCart}
                className="w-full text-xs text-muted-foreground hover:text-destructive transition-colors duration-200 py-1"
              >
                Limpar carrinho
              </button>
            </div>
          </div>
        )}
      </div>
    </>
  );
}

/* ─── Floating Cart Button ─── */
export default function CartWidget() {
  const count = useStore(cartCount);
  const total = useStore(cartTotal);
  const [isDrawerOpen, setIsDrawerOpen] = React.useState(false);
  const [isCheckoutOpen, setIsCheckoutOpen] = React.useState(false);
  const [prevCount, setPrevCount] = React.useState(count);
  const [bump, setBump] = React.useState(false);

  // Animate badge on item add
  React.useEffect(() => {
    if (count > prevCount) {
      setBump(true);
      const t = setTimeout(() => setBump(false), 400);
      return () => clearTimeout(t);
    }
    setPrevCount(count);
  }, [count]);

  const handleCheckout = () => {
    setIsDrawerOpen(false);
    // Small delay to let drawer close smoothly before modal opens
    setTimeout(() => setIsCheckoutOpen(true), 150);
  };

  return (
    <>
      {/* Floating Button */}
      <button
        id="cart-widget-btn"
        onClick={() => setIsDrawerOpen(true)}
        aria-label={`Abrir carrinho — ${count} itens — ${formatPrice(total)}`}
        className="fixed bottom-6 right-6 z-30 flex items-center gap-3 h-14 px-5 rounded-2xl shadow-2xl transition-all duration-300 hover:scale-105 group"
        style={{
          background:
            "linear-gradient(135deg, hsl(240 5% 10%) 0%, hsl(240 6% 7%) 100%)",
          border: "1px solid hsl(240 4% 20%)",
          boxShadow:
            "0 8px 32px hsl(0 0% 0% / 0.4), inset 0 1px 0 hsl(0 0% 100% / 0.05)",
        }}
      >
        {/* Icon + Badge */}
        <div className="relative">
          <ShoppingCart
            className="w-5 h-5 text-foreground group-hover:text-primary transition-colors duration-300"
          />
          {count > 0 && (
            <span
              className={`absolute -top-2.5 -right-2.5 flex items-center justify-center min-w-[18px] h-[18px] px-1 rounded-full bg-primary text-primary-foreground text-[10px] font-bold transition-transform duration-200 ${
                bump ? "scale-125" : "scale-100"
              }`}
            >
              {count > 99 ? "99+" : count}
            </span>
          )}
        </div>

        {/* Label */}
        {count > 0 ? (
          <div className="text-left">
            <p className="text-xs text-muted-foreground leading-none mb-0.5">
              Meu carrinho
            </p>
            <p className="text-sm font-bold text-foreground leading-none">
              {formatPrice(total)}
            </p>
          </div>
        ) : (
          <span className="text-sm font-medium text-muted-foreground group-hover:text-foreground transition-colors duration-300">
            Carrinho
          </span>
        )}
      </button>

      {/* Cart Drawer */}
      {isDrawerOpen && (
        <CartDrawer
          onClose={() => setIsDrawerOpen(false)}
          onCheckout={handleCheckout}
        />
      )}

      {/* Checkout Modal */}
      <CheckoutModal
        isOpen={isCheckoutOpen}
        onClose={() => setIsCheckoutOpen(false)}
      />
    </>
  );
}
