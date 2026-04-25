import { map, computed } from "nanostores";

/* ─── Types ─── */
export interface CartItem {
  id: string;
  name: string;
  price: number;
  quantity: number;
  imageUrl: string;
  category: string;
}

export type CartMap = Record<string, CartItem>;

/* ─── Core Store ─── */
// Map atom: keyed by product id for O(1) lookups and deduplication
export const cartItems = map<CartMap>({});

/* ─── Computed Values ─── */
export const cartCount = computed(cartItems, (items) =>
  Object.values(items).reduce((sum, item) => sum + item.quantity, 0)
);

export const cartTotal = computed(cartItems, (items) =>
  Object.values(items).reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  )
);

export const cartList = computed(cartItems, (items) =>
  Object.values(items)
);

/* ─── Actions ─── */
export function addCartItem(
  product: Omit<CartItem, "quantity"> & { quantity?: number }
): void {
  const current = cartItems.get();
  const existing = current[product.id];

  if (existing) {
    // Increment quantity if already in cart
    cartItems.setKey(product.id, {
      ...existing,
      quantity: existing.quantity + (product.quantity ?? 1),
    });
  } else {
    // Add new item
    cartItems.setKey(product.id, {
      ...product,
      quantity: product.quantity ?? 1,
    });
  }
}

export function removeCartItem(id: string): void {
  const current = cartItems.get();
  const existing = current[id];

  if (!existing) return;

  if (existing.quantity > 1) {
    // Decrement quantity
    cartItems.setKey(id, {
      ...existing,
      quantity: existing.quantity - 1,
    });
  } else {
    // Remove from map entirely
    const updated = { ...cartItems.get() };
    delete updated[id];
    cartItems.set(updated);
  }
}

export function clearCartItem(id: string): void {
  const updated = { ...cartItems.get() };
  delete updated[id];
  cartItems.set(updated);
}

export function clearCart(): void {
  cartItems.set({});
}

/* ─── Formatter ─── */
export function formatPrice(value: number): string {
  return new Intl.NumberFormat("pt-BR", {
    style: "currency",
    currency: "BRL",
  }).format(value);
}
