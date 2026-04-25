import * as React from "react";
import { useStore } from "@nanostores/react";
import {
  cartList,
  cartTotal,
  clearCart,
  formatPrice,
} from "@/store/cartStore";
import type { CartItem } from "@/store/cartStore";
import { fetchAddressByCep } from "@/lib/cep";
import type { AddressData } from "@/lib/cep";
import { generateWhatsAppLink } from "@/lib/order";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  X,
  MapPin,
  CheckCircle2,
  Loader2,
  MessageCircle,
  ShoppingBag,
  AlertCircle,
} from "lucide-react";

/* ─── Types ─── */
interface CheckoutModalProps {
  isOpen: boolean;
  onClose: () => void;
}

interface AddressFormState {
  cep: string;
  street: string;
  neighborhood: string;
  city: string;
  state: string;
  number: string;
  complement: string;
}

type CepStatus = "idle" | "loading" | "success" | "error";

const INITIAL_ADDRESS: AddressFormState = {
  cep: "",
  street: "",
  neighborhood: "",
  city: "",
  state: "",
  number: "",
  complement: "",
};

/* ─── CheckoutModal Component ─── */
export default function CheckoutModal({ isOpen, onClose }: CheckoutModalProps) {
  const items = useStore(cartList) as CartItem[];
  const total = useStore(cartTotal) as number;

  const [address, setAddress] = React.useState<AddressFormState>(INITIAL_ADDRESS);
  const [cepStatus, setCepStatus] = React.useState<CepStatus>("idle");
  const [cepError, setCepError] = React.useState<string>("");
  const [isSubmitting, setIsSubmitting] = React.useState(false);
  const [orderSent, setOrderSent] = React.useState(false);

  const numberInputRef = React.useRef<HTMLInputElement>(null);

  // Reset state when modal opens
  React.useEffect(() => {
    if (isOpen) {
      setAddress(INITIAL_ADDRESS);
      setCepStatus("idle");
      setCepError("");
      setOrderSent(false);
    }
  }, [isOpen]);

  // Lock body scroll while modal is open
  React.useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [isOpen]);

  // ─── CEP auto-fetch ───
  const handleCepLookup = React.useCallback(async (rawCep: string) => {
    const digits = rawCep.replace(/\D/g, "");
    if (digits.length !== 8) return;

    setCepStatus("loading");
    setCepError("");

    const { data, error } = await fetchAddressByCep(digits);

    if (error || !data) {
      setCepStatus("error");
      setCepError(error ?? "CEP inválido.");
      setAddress((prev) => ({
        ...prev,
        street: "",
        neighborhood: "",
        city: "",
        state: "",
      }));
      return;
    }

    setCepStatus("success");
    setAddress((prev) => ({
      ...prev,
      street: data.logradouro ?? "",
      neighborhood: data.bairro ?? "",
      city: data.localidade ?? "",
      state: data.uf ?? "",
    }));

    // Auto-focus number field after CEP resolves
    setTimeout(() => numberInputRef.current?.focus(), 100);
  }, []);

  const handleCepChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let v = e.target.value.replace(/\D/g, "");
    if (v.length > 8) v = v.slice(0, 8);
    // Format as XXXXX-XXX
    const formatted = v.length > 5 ? `${v.slice(0, 5)}-${v.slice(5)}` : v;
    setAddress((prev) => ({ ...prev, cep: formatted }));

    // Trigger lookup when complete
    if (v.length === 8) handleCepLookup(v);
  };

  // ─── Form submit ───
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!address.number.trim()) return;

    setIsSubmitting(true);

    const addressData = {
      cep: address.cep,
      logradouro: address.street,
      bairro: address.neighborhood,
      localidade: address.city,
      uf: address.state,
      number: address.number,
      complement: address.complement || undefined,
      // required by AddressData interface (stub values)
      complemento: address.complement ?? "",
      ibge: "",
      gia: "",
      ddd: "",
      siafi: "",
    };

    const link = generateWhatsAppLink(items, total, addressData);

    // Small delay for UX
    await new Promise((r) => setTimeout(r, 400));

    window.open(link, "_blank", "noopener,noreferrer");
    setOrderSent(true);
    clearCart();
    setIsSubmitting(false);
  };

  if (!isOpen) return null;

  const canSubmit =
    cepStatus === "success" && address.number.trim().length > 0 && !isSubmitting;

  return (
    <>
      {/* ─── Backdrop ─── */}
      <div
        className="fixed inset-0 z-[60] bg-black/70 backdrop-blur-md"
        onClick={onClose}
        aria-hidden="true"
      />

      {/* ─── Modal Panel ─── */}
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="checkout-modal-title"
        className="fixed inset-0 z-[70] flex items-center justify-center p-4"
      >
        <div
          className="relative w-full max-w-md max-h-[90vh] overflow-y-auto rounded-2xl flex flex-col"
          style={{
            background:
              "linear-gradient(180deg, hsl(240 6% 9%) 0%, hsl(240 6% 5%) 100%)",
            border: "1px solid hsl(240 4% 16%)",
            boxShadow:
              "0 32px 80px hsl(0 0% 0% / 0.6), 0 0 0 1px hsl(0 0% 100% / 0.03)",
          }}
          onClick={(e) => e.stopPropagation()}
        >
          {/* ─── Header ─── */}
          <div
            className="flex items-center justify-between px-6 py-5 sticky top-0 z-10"
            style={{
              background: "hsl(240 6% 9%)",
              borderBottom: "1px solid hsl(240 4% 14%)",
            }}
          >
            <div className="flex items-center gap-3">
              <div
                className="flex items-center justify-center w-9 h-9 rounded-xl"
                style={{
                  background:
                    "linear-gradient(135deg, hsl(160 84% 39% / 0.15) 0%, hsl(160 84% 39% / 0.05) 100%)",
                  border: "1px solid hsl(160 84% 39% / 0.25)",
                }}
              >
                <MapPin className="w-4 h-4 text-emerald-400" />
              </div>
              <div>
                <h2
                  id="checkout-modal-title"
                  className="text-base font-semibold text-foreground leading-tight"
                >
                  Finalizar Pedido
                </h2>
                <p className="text-xs text-muted-foreground mt-0.5">
                  Informe o endereço de entrega
                </p>
              </div>
            </div>
            <button
              onClick={onClose}
              aria-label="Fechar checkout"
              className="flex items-center justify-center w-8 h-8 rounded-lg text-muted-foreground hover:text-foreground hover:bg-muted/50 transition-colors duration-200"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* ─── Content ─── */}
          <div className="flex-1 px-6 py-6">
            {orderSent ? (
              /* ─── Success State ─── */
              <div className="flex flex-col items-center justify-center gap-5 py-10 text-center">
                <div
                  className="flex items-center justify-center w-20 h-20 rounded-full"
                  style={{
                    background:
                      "linear-gradient(135deg, hsl(160 84% 39% / 0.15) 0%, hsl(160 84% 39% / 0.05) 100%)",
                    border: "1px solid hsl(160 84% 39% / 0.3)",
                    boxShadow: "0 0 30px hsl(160 84% 39% / 0.15)",
                  }}
                >
                  <CheckCircle2 className="w-9 h-9 text-emerald-400" />
                </div>
                <div className="space-y-2">
                  <h3 className="text-lg font-bold text-foreground">
                    Pedido Enviado! 🎉
                  </h3>
                  <p className="text-sm text-muted-foreground max-w-xs">
                    Seu pedido foi encaminhado para o nosso WhatsApp. Em breve
                    nossa equipe entrará em contato para confirmar o pagamento e
                    prazo de entrega.
                  </p>
                </div>
                <button
                  onClick={onClose}
                  className="text-sm font-medium text-emerald-400 hover:text-emerald-300 transition-colors duration-200"
                >
                  Fechar
                </button>
              </div>
            ) : (
              /* ─── Checkout Form ─── */
              <form onSubmit={handleSubmit} className="space-y-5" noValidate>
                {/* Order Summary */}
                <div
                  className="rounded-xl p-4 space-y-2"
                  style={{
                    background: "hsl(240 5% 7%)",
                    border: "1px solid hsl(240 4% 14%)",
                  }}
                >
                  <div className="flex items-center gap-2 mb-3">
                    <ShoppingBag className="w-4 h-4 text-emerald-400" />
                    <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                      Resumo do Pedido
                    </span>
                  </div>
                  <div className="space-y-1.5">
                    {items.map((item) => (
                      <div
                        key={item.id}
                        className="flex justify-between items-center text-sm"
                      >
                        <span className="text-muted-foreground truncate max-w-[200px]">
                          {item.name}{" "}
                          <span className="text-muted-foreground/50">
                            ×{item.quantity}
                          </span>
                        </span>
                        <span className="text-foreground font-medium flex-shrink-0 ml-2">
                          {formatPrice(item.price * item.quantity)}
                        </span>
                      </div>
                    ))}
                  </div>
                  <div
                    className="flex justify-between items-center pt-2 mt-2"
                    style={{ borderTop: "1px solid hsl(240 4% 14%)" }}
                  >
                    <span className="text-sm font-semibold text-foreground">
                      Total
                    </span>
                    <span
                      className="text-base font-bold"
                      style={{
                        color: "hsl(160 84% 47%)",
                        textShadow: "0 0 12px hsl(160 84% 47% / 0.4)",
                      }}
                    >
                      {formatPrice(total)}
                    </span>
                  </div>
                </div>

                {/* ─── CEP ─── */}
                <div className="space-y-1.5">
                  <label
                    htmlFor="checkout-cep"
                    className="text-xs font-semibold text-muted-foreground uppercase tracking-wider"
                  >
                    CEP *
                  </label>
                  <div className="relative">
                    <Input
                      id="checkout-cep"
                      type="text"
                      inputMode="numeric"
                      placeholder="00000-000"
                      value={address.cep}
                      onChange={handleCepChange}
                      maxLength={9}
                      autoComplete="postal-code"
                      className="pr-10 bg-transparent border-border/40 focus:border-emerald-500/60 focus:ring-0 placeholder:text-muted-foreground/40 transition-colors duration-200"
                      style={{
                        background: "hsl(240 5% 7%)",
                      }}
                      aria-describedby={
                        cepError ? "cep-error" : undefined
                      }
                      aria-invalid={cepStatus === "error"}
                    />
                    {/* Status icon */}
                    <div className="absolute right-3 top-1/2 -translate-y-1/2">
                      {cepStatus === "loading" && (
                        <Loader2 className="w-4 h-4 text-muted-foreground animate-spin" />
                      )}
                      {cepStatus === "success" && (
                        <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                      )}
                      {cepStatus === "error" && (
                        <AlertCircle className="w-4 h-4 text-destructive" />
                      )}
                    </div>
                  </div>
                  {cepError && (
                    <p
                      id="cep-error"
                      role="alert"
                      className="text-xs text-destructive flex items-center gap-1.5 mt-1"
                    >
                      <AlertCircle className="w-3 h-3 flex-shrink-0" />
                      {cepError}
                    </p>
                  )}
                  <a
                    href="https://buscacepinter.correios.com.br/"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-xs text-muted-foreground/60 hover:text-emerald-400 transition-colors duration-200"
                  >
                    Não sei meu CEP →
                  </a>
                </div>

                {/* ─── Auto-filled address fields ─── */}
                <div className="grid grid-cols-2 gap-3">
                  <div className="col-span-2 space-y-1.5">
                    <label
                      htmlFor="checkout-street"
                      className="text-xs font-semibold text-muted-foreground uppercase tracking-wider"
                    >
                      Rua / Logradouro
                    </label>
                    <Input
                      id="checkout-street"
                      type="text"
                      value={address.street}
                      readOnly
                      tabIndex={-1}
                      placeholder="Preenchido automaticamente"
                      className="bg-transparent border-border/20 text-muted-foreground cursor-not-allowed placeholder:text-muted-foreground/30"
                      style={{ background: "hsl(240 5% 6%)" }}
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label
                      htmlFor="checkout-neighborhood"
                      className="text-xs font-semibold text-muted-foreground uppercase tracking-wider"
                    >
                      Bairro
                    </label>
                    <Input
                      id="checkout-neighborhood"
                      type="text"
                      value={address.neighborhood}
                      readOnly
                      tabIndex={-1}
                      placeholder="—"
                      className="bg-transparent border-border/20 text-muted-foreground cursor-not-allowed placeholder:text-muted-foreground/30"
                      style={{ background: "hsl(240 5% 6%)" }}
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label
                      htmlFor="checkout-city"
                      className="text-xs font-semibold text-muted-foreground uppercase tracking-wider"
                    >
                      Cidade / UF
                    </label>
                    <Input
                      id="checkout-city"
                      type="text"
                      value={
                        address.city && address.state
                          ? `${address.city} / ${address.state}`
                          : address.city || ""
                      }
                      readOnly
                      tabIndex={-1}
                      placeholder="—"
                      className="bg-transparent border-border/20 text-muted-foreground cursor-not-allowed placeholder:text-muted-foreground/30"
                      style={{ background: "hsl(240 5% 6%)" }}
                    />
                  </div>
                </div>

                {/* ─── Number + Complement ─── */}
                <div className="grid grid-cols-5 gap-3">
                  <div className="col-span-2 space-y-1.5">
                    <label
                      htmlFor="checkout-number"
                      className="text-xs font-semibold text-muted-foreground uppercase tracking-wider"
                    >
                      Número *
                    </label>
                    <Input
                      id="checkout-number"
                      ref={numberInputRef}
                      type="text"
                      inputMode="numeric"
                      placeholder="Ex: 42"
                      value={address.number}
                      onChange={(e) =>
                        setAddress((prev) => ({
                          ...prev,
                          number: e.target.value,
                        }))
                      }
                      required
                      autoComplete="address-line2"
                      className="bg-transparent border-border/40 focus:border-emerald-500/60 focus:ring-0 placeholder:text-muted-foreground/40 transition-colors duration-200"
                      style={{ background: "hsl(240 5% 7%)" }}
                    />
                  </div>

                  <div className="col-span-3 space-y-1.5">
                    <label
                      htmlFor="checkout-complement"
                      className="text-xs font-semibold text-muted-foreground uppercase tracking-wider"
                    >
                      Complemento
                    </label>
                    <Input
                      id="checkout-complement"
                      type="text"
                      placeholder="Apto, bloco, etc."
                      value={address.complement}
                      onChange={(e) =>
                        setAddress((prev) => ({
                          ...prev,
                          complement: e.target.value,
                        }))
                      }
                      autoComplete="address-line3"
                      className="bg-transparent border-border/40 focus:border-emerald-500/60 focus:ring-0 placeholder:text-muted-foreground/40 transition-colors duration-200"
                      style={{ background: "hsl(240 5% 7%)" }}
                    />
                  </div>
                </div>

                {/* ─── Shipping note ─── */}
                <p className="text-xs text-muted-foreground/60 text-center leading-relaxed">
                  O frete será calculado e confirmado via WhatsApp antes do
                  pagamento. ✅
                </p>

                {/* ─── CTA Button ─── */}
                <Button
                  type="submit"
                  size="lg"
                  disabled={!canSubmit}
                  className="w-full h-14 text-sm font-bold gap-2.5 rounded-xl transition-all duration-300 relative overflow-hidden group"
                  style={
                    canSubmit
                      ? {
                          background:
                            "linear-gradient(135deg, hsl(160 84% 35%) 0%, hsl(160 90% 28%) 100%)",
                          boxShadow:
                            "0 0 24px hsl(160 84% 39% / 0.4), 0 8px 24px hsl(0 0% 0% / 0.3)",
                          border: "1px solid hsl(160 84% 47% / 0.4)",
                          color: "white",
                        }
                      : {
                          background: "hsl(240 4% 14%)",
                          border: "1px solid hsl(240 4% 18%)",
                          color: "hsl(240 4% 45%)",
                          cursor: "not-allowed",
                          boxShadow: "none",
                        }
                  }
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      <span>Preparando pedido...</span>
                    </>
                  ) : (
                    <>
                      <MessageCircle className="w-5 h-5" />
                      <span>Finalizar Pedido via WhatsApp</span>
                    </>
                  )}
                  {/* Shimmer */}
                  {canSubmit && (
                    <span
                      className="absolute inset-0 -translate-x-full group-hover:translate-x-full transition-transform duration-700"
                      style={{
                        background:
                          "linear-gradient(90deg, transparent, hsl(0 0% 100% / 0.06), transparent)",
                      }}
                    />
                  )}
                </Button>
              </form>
            )}
          </div>
        </div>
      </div>
    </>
  );
}
