import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ArrowRight, Sparkles, Zap, Shield } from "lucide-react";

export default function HeroCapture() {
  const [email, setEmail] = useState("");
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim()) return;

    setIsLoading(true);
    // Simula envio — substituir pela API real
    await new Promise((resolve) => setTimeout(resolve, 1200));
    setIsLoading(false);
    setIsSubmitted(true);
  };

  return (
    <section className="relative flex min-h-screen flex-col items-center justify-center overflow-hidden px-4 py-20">
      {/* ── Background Effects ── */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        {/* Radial gradient glow */}
        <div className="absolute left-1/2 top-0 h-[600px] w-[900px] -translate-x-1/2 -translate-y-1/3 rounded-full bg-gradient-to-b from-violet-600/20 via-indigo-500/10 to-transparent blur-3xl" />
        {/* Grid pattern */}
        <div
          className="absolute inset-0 opacity-[0.03]"
          style={{
            backgroundImage: `linear-gradient(rgba(255,255,255,0.1) 1px, transparent 1px),
                              linear-gradient(90deg, rgba(255,255,255,0.1) 1px, transparent 1px)`,
            backgroundSize: "64px 64px",
          }}
        />
        {/* Floating orbs */}
        <div className="absolute right-[15%] top-[20%] h-72 w-72 rounded-full bg-fuchsia-600/10 blur-3xl animate-pulse" />
        <div className="absolute bottom-[15%] left-[10%] h-56 w-56 rounded-full bg-cyan-500/10 blur-3xl animate-pulse [animation-delay:1s]" />
      </div>

      {/* ── Content ── */}
      <div className="relative z-10 mx-auto flex max-w-4xl flex-col items-center text-center">
        {/* Badge */}
        <div className="mb-8 inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-4 py-1.5 text-sm text-zinc-400 backdrop-blur-sm transition-colors hover:border-white/20 hover:text-zinc-300">
          <Sparkles className="h-3.5 w-3.5 text-violet-400" />
          <span>Site Factory — Produção em Escala</span>
        </div>

        {/* Headline */}
        <h1 className="text-4xl font-bold tracking-tight sm:text-5xl md:text-6xl lg:text-7xl">
          <span className="block text-transparent bg-clip-text bg-gradient-to-b from-white to-zinc-400">
            Sites que Convertem.
          </span>
          <span className="mt-2 block text-transparent bg-clip-text bg-gradient-to-r from-violet-400 via-fuchsia-400 to-cyan-400">
            Entregues como Produto.
          </span>
        </h1>

        {/* Subheadline */}
        <p className="mt-6 max-w-2xl text-lg leading-relaxed text-zinc-400 sm:text-xl">
          Landing pages de alta performance, construídas com stack moderna e
          otimizadas para{" "}
          <span className="text-zinc-200 font-medium">SEO</span>,{" "}
          <span className="text-zinc-200 font-medium">velocidade</span> e{" "}
          <span className="text-zinc-200 font-medium">conversão</span>.
          Do briefing ao deploy em tempo recorde.
        </p>

        {/* ── CTA Form ── */}
        {!isSubmitted ? (
          <form
            onSubmit={handleSubmit}
            className="mt-10 flex w-full max-w-md flex-col gap-3 sm:flex-row"
          >
            <Input
              type="email"
              placeholder="seu@email.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="h-12 border-white/10 bg-white/5 text-base text-white placeholder:text-zinc-500 focus-visible:ring-violet-500/50 sm:flex-1"
              aria-label="Endereço de e-mail"
            />
            <Button
              type="submit"
              disabled={isLoading}
              size="lg"
              className="h-12 gap-2 bg-gradient-to-r from-violet-600 to-fuchsia-600 text-white shadow-lg shadow-violet-600/25 transition-all hover:shadow-xl hover:shadow-violet-600/30 hover:from-violet-500 hover:to-fuchsia-500 disabled:opacity-70"
            >
              {isLoading ? (
                <span className="flex items-center gap-2">
                  <svg
                    className="h-4 w-4 animate-spin"
                    viewBox="0 0 24 24"
                    fill="none"
                  >
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                    />
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
                    />
                  </svg>
                  Enviando...
                </span>
              ) : (
                <>
                  Quero Começar
                  <ArrowRight className="h-4 w-4" />
                </>
              )}
            </Button>
          </form>
        ) : (
          <div className="mt-10 flex items-center gap-3 rounded-xl border border-emerald-500/20 bg-emerald-500/10 px-6 py-4 text-emerald-400 backdrop-blur-sm">
            <svg
              className="h-5 w-5 shrink-0"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={2}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M5 13l4 4L19 7"
              />
            </svg>
            <span className="text-sm font-medium">
              Perfeito! Entraremos em contato em breve.
            </span>
          </div>
        )}

        {/* ── Trust Signals ── */}
        <div className="mt-12 grid grid-cols-1 gap-4 sm:grid-cols-3">
          {[
            {
              icon: Zap,
              title: "Deploy em 48h",
              desc: "Da aprovação ao ar em tempo recorde",
            },
            {
              icon: Shield,
              title: "Lighthouse 95+",
              desc: "Performance, SEO e acessibilidade",
            },
            {
              icon: Sparkles,
              title: "Stack Premium",
              desc: "Astro, React, Tailwind & TypeScript",
            },
          ].map(({ icon: Icon, title, desc }) => (
            <div
              key={title}
              className="group flex flex-col items-center gap-2 rounded-xl border border-white/5 bg-white/[0.02] px-6 py-5 backdrop-blur-sm transition-all duration-300 hover:border-white/10 hover:bg-white/[0.04]"
            >
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-gradient-to-br from-violet-600/20 to-fuchsia-600/20 text-violet-400 transition-transform duration-300 group-hover:scale-110">
                <Icon className="h-5 w-5" />
              </div>
              <h3 className="text-sm font-semibold text-zinc-200">{title}</h3>
              <p className="text-xs text-zinc-500">{desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
