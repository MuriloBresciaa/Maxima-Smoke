/* ─── WhatsApp Order Generator — Máxima Smoke ─── */

import type { CartItem } from "@/store/cartStore";
import { formatPrice } from "@/store/cartStore";
import type { AddressData } from "@/lib/cep";

export interface OrderAddress extends Partial<AddressData> {
  number: string;
  complement?: string;
}

const WHATSAPP_NUMBER = "5519989894956"; // Format: country code + DDD + number (no +)

/**
 * Generates a pre-filled WhatsApp message link for the order.
 */
export function generateWhatsAppLink(
  cartItems: CartItem[],
  cartTotal: number,
  addressData: OrderAddress
): string {
  const greeting = getGreeting();

  // ─── Items block ───
  const itemLines = cartItems
    .map(
      (item) =>
        `  • ${item.name} (x${item.quantity}) — ${formatPrice(item.price * item.quantity)}`
    )
    .join("\n");

  // ─── Address block ───
  const street = addressData.logradouro
    ? `${addressData.logradouro}, ${addressData.number}`
    : `Número: ${addressData.number}`;
  const complement = addressData.complement
    ? ` — ${addressData.complement}`
    : "";
  const neighborhood = addressData.bairro ? `${addressData.bairro}` : "";
  const city = addressData.localidade
    ? `${addressData.localidade}/${addressData.uf}`
    : "";
  const cepFormatted = addressData.cep
    ? `CEP: ${addressData.cep.replace(/(\d{5})(\d{3})/, "$1-$2")}`
    : "";

  const message = [
    `${greeting} Gostaria de fazer um pedido na *Máxima Smoke*! 🚬✨`,
    ``,
    `━━━━━━━━━━━━━━━━━━━━━`,
    `🛒 *MEUS ITENS*`,
    `━━━━━━━━━━━━━━━━━━━━━`,
    itemLines,
    ``,
    `━━━━━━━━━━━━━━━━━━━━━`,
    `💰 *TOTAL DO PEDIDO*`,
    `━━━━━━━━━━━━━━━━━━━━━`,
    `  ${formatPrice(cartTotal)}`,
    ``,
    `━━━━━━━━━━━━━━━━━━━━━`,
    `📦 *ENDEREÇO DE ENTREGA*`,
    `━━━━━━━━━━━━━━━━━━━━━`,
    `  ${street}${complement}`,
    neighborhood && `  ${neighborhood}`,
    city && `  ${city}`,
    cepFormatted && `  ${cepFormatted}`,
    ``,
    `Aguardo confirmação e informações de pagamento! 🙏`,
  ]
    .filter((line) => line !== false && line !== "")
    .join("\n");

  const encoded = encodeURIComponent(message);
  return `https://wa.me/${WHATSAPP_NUMBER}?text=${encoded}`;
}

/* ─── Helpers ─── */
function getGreeting(): string {
  const hour = new Date().getHours();
  if (hour >= 6 && hour < 12) return "Bom dia!";
  if (hour >= 12 && hour < 18) return "Boa tarde!";
  return "Boa noite!";
}
