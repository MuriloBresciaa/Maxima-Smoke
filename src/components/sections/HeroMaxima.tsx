import * as React from "react";
import { Button } from "@/components/ui/button";
import {
  Truck,
  ShieldCheck,
  Star,
  ArrowRight,
  MapPin,
  Clock,
  Flame,
} from "lucide-react";

/* ─── Smoke Particle (pure CSS ambient effect) ─── */
function SmokeParticle({ delay, x, size }: { delay: number; x: number; size: number }) {
  return (
    <div
      className="absolute rounded-full pointer-events-none"
      style={{
        bottom: "10%",
        left: `${x}%`,
        width: `${size}px`,
        height: `${size}px`,
        background:
          "radial-gradient(circle, hsl(160 84% 39% / 0.08) 0%, transparent 70%)",
        animation: `smoke-float ${6 + Math.random() * 6}s ease-in-out infinite`,
        animationDelay: `${delay}s`,
      }}
    />
  );
}

/* ─── Trust Badge ─── */
function TrustBadge({
  icon: Icon,
  title,
  subtitle,
}: {
  icon: React.ElementType;
  title: string;
  subtitle: string;
}) {
  return (
    <div className="flex items-center gap-3 group">
      <div className="flex items-center justify-center w-10 h-10 rounded-lg bg-primary/10 border border-primary/20 group-hover:neon-glow transition-all duration-300">
        <Icon className="w-5 h-5 text-primary" />
      </div>
      <div>
        <p className="text-sm font-semibold text-foreground">{title}</p>
        <p className="text-xs text-muted-foreground">{subtitle}</p>
      </div>
    </div>
  );
}

/* ─── Main Hero Component ─── */
export default function HeroMaxima() {
  const [isVisible, setIsVisible] = React.useState(false);

  React.useEffect(() => {
    // Stagger entrance animation
    const timer = setTimeout(() => setIsVisible(true), 100);
    return () => clearTimeout(timer);
  }, []);

  return (
    <section
      id="hero"
      className="relative min-h-screen flex items-center justify-center overflow-hidden"
    >
      {/* ── Ambient Background Effects ── */}
      <div className="absolute inset-0 smoke-gradient" />
      <div className="absolute inset-0 smoke-gradient-radial" />

      {/* Smoke Particles */}
      <div className="absolute inset-0 overflow-hidden">
        <SmokeParticle delay={0} x={15} size={120} />
        <SmokeParticle delay={2} x={45} size={180} />
        <SmokeParticle delay={4} x={75} size={140} />
        <SmokeParticle delay={1} x={30} size={100} />
        <SmokeParticle delay={3} x={60} size={160} />
        <SmokeParticle delay={5} x={85} size={110} />
      </div>

      {/* Grid overlay for industrial texture */}
      <div
        className="absolute inset-0 opacity-[0.03]"
        style={{
          backgroundImage: `linear-gradient(hsl(0 0% 100% / 0.1) 1px, transparent 1px),
                            linear-gradient(90deg, hsl(0 0% 100% / 0.1) 1px, transparent 1px)`,
          backgroundSize: "60px 60px",
        }}
      />

      {/* ── Content ── */}
      <div className="relative z-10 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 lg:py-0">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">
          {/* ── Left Column — Copy ── */}
          <div
            className={`space-y-8 transition-all duration-1000 ${
              isVisible
                ? "opacity-100 translate-y-0"
                : "opacity-0 translate-y-8"
            }`}
          >
            {/* Badge */}
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-primary/30 bg-primary/5 text-primary text-xs font-medium tracking-wide uppercase">
              <Flame className="w-3.5 h-3.5 animate-neon-pulse" />
              <span>Novidade — Entrega para Todo o Brasil</span>
            </div>

            {/* Headline */}
            <div className="space-y-4">
              <h1 className="text-4xl sm:text-5xl lg:text-6xl xl:text-7xl font-bold tracking-tight leading-[1.08]">
                <span className="text-foreground">A Melhor Tabacaria</span>
                <br />
                <span className="text-foreground">do </span>
                <span className="text-primary neon-text-glow">Cambuí</span>
                <span className="text-foreground">,</span>
                <br />
                <span className="text-muted-foreground text-3xl sm:text-4xl lg:text-5xl xl:text-5xl font-medium">
                  Agora no Brasil Inteiro.
                </span>
              </h1>
            </div>

            {/* Subheadline */}
            <p className="text-base sm:text-lg text-muted-foreground max-w-lg leading-relaxed">
              Sedas, tabaco premium, narguile, essências e acessórios das{" "}
              <span className="text-foreground font-medium">melhores marcas do mundo</span>,
              entregues na sua porta com a qualidade que só quem é referência há
              anos no Cambuí pode garantir.
            </p>

            {/* CTAs */}
            <div className="flex flex-col sm:flex-row gap-4">
              <Button
                size="lg"
                className="group relative h-12 px-8 text-base font-semibold neon-glow hover:neon-glow-strong transition-all duration-300 hover:scale-[1.02]"
              >
                <span>Ver Catálogo</span>
                <ArrowRight className="w-4 h-4 ml-1 transition-transform duration-300 group-hover:translate-x-1" />
              </Button>
              <Button
                variant="outline"
                size="lg"
                className="h-12 px-8 text-base font-medium border-border/50 hover:border-primary/50 hover:bg-primary/5 transition-all duration-300"
              >
                <MapPin className="w-4 h-4 mr-2" />
                <span>Visitar Loja Física</span>
              </Button>
            </div>

            {/* Trust Signals */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-4 border-t border-border/30">
              <TrustBadge
                icon={Truck}
                title="Envio Nacional"
                subtitle="PAC & SEDEX via Correios"
              />
              <TrustBadge
                icon={ShieldCheck}
                title="Marcas Premium"
                subtitle="RAW, Adalya, Ziggy & +"
              />
              <TrustBadge
                icon={Star}
                title="Referência Local"
                subtitle="Nota 4.9 no Google"
              />
            </div>
          </div>

          {/* ── Right Column — Visual ── */}
          <div
            className={`relative flex items-center justify-center transition-all duration-1000 delay-300 ${
              isVisible
                ? "opacity-100 translate-y-0"
                : "opacity-0 translate-y-8"
            }`}
          >
            {/* Neon Glow Circle Background */}
            <div className="absolute w-[400px] h-[400px] lg:w-[500px] lg:h-[500px] rounded-full bg-primary/5 blur-3xl animate-neon-pulse" />
            <div className="absolute w-[300px] h-[300px] lg:w-[380px] lg:h-[380px] rounded-full border border-primary/10" />
            <div className="absolute w-[340px] h-[340px] lg:w-[430px] lg:h-[430px] rounded-full border border-primary/5" />

            {/* Product Showcase Card */}
            <div className="relative z-10 w-full max-w-md">
              <div className="relative rounded-2xl border border-border/30 bg-card/80 backdrop-blur-xl p-8 space-y-6 hover:border-primary/20 transition-all duration-500">
                {/* Ambient glow on card */}
                <div className="absolute -inset-px rounded-2xl bg-gradient-to-b from-primary/10 via-transparent to-transparent opacity-0 hover:opacity-100 transition-opacity duration-500 pointer-events-none" />

                {/* Store Info */}
                <div className="relative space-y-4">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-xl bg-primary/10 border border-primary/20 flex items-center justify-center">
                      <Flame className="w-6 h-6 text-primary" />
                    </div>
                    <div>
                      <h2 className="text-lg font-bold text-foreground tracking-tight">
                        Máxima Smoke
                      </h2>
                      <p className="text-xs text-muted-foreground">
                        Tabacaria Premium — Cambuí
                      </p>
                    </div>
                  </div>

                  {/* Stats Grid */}
                  <div className="grid grid-cols-2 gap-3">
                    <div className="rounded-xl bg-muted/50 border border-border/30 p-3 text-center hover:bg-muted/70 transition-colors duration-300">
                      <p className="text-2xl font-bold text-primary">500+</p>
                      <p className="text-xs text-muted-foreground mt-0.5">
                        Produtos
                      </p>
                    </div>
                    <div className="rounded-xl bg-muted/50 border border-border/30 p-3 text-center hover:bg-muted/70 transition-colors duration-300">
                      <p className="text-2xl font-bold text-primary">4.9</p>
                      <p className="text-xs text-muted-foreground mt-0.5">
                        ★ Google
                      </p>
                    </div>
                    <div className="rounded-xl bg-muted/50 border border-border/30 p-3 text-center hover:bg-muted/70 transition-colors duration-300">
                      <p className="text-2xl font-bold text-foreground">50+</p>
                      <p className="text-xs text-muted-foreground mt-0.5">
                        Marcas
                      </p>
                    </div>
                    <div className="rounded-xl bg-muted/50 border border-border/30 p-3 text-center hover:bg-muted/70 transition-colors duration-300">
                      <p className="text-2xl font-bold text-foreground">
                        5570+
                      </p>
                      <p className="text-xs text-muted-foreground mt-0.5">
                        Cidades
                      </p>
                    </div>
                  </div>

                  {/* Location + Hours */}
                  <div className="space-y-2 pt-2">
                    <div className="flex items-center gap-2 text-xs text-muted-foreground">
                      <MapPin className="w-3.5 h-3.5 text-primary/70 shrink-0" />
                      <span>R. Padre Almeida, 280 — Cambuí, Campinas/SP</span>
                    </div>
                    <div className="flex items-center gap-2 text-xs text-muted-foreground">
                      <Clock className="w-3.5 h-3.5 text-primary/70 shrink-0" />
                      <span>
                        Seg–Qui até 00h · Sex–Sáb até{" "}
                        <span className="text-primary font-semibold">
                          04:00 AM
                        </span>
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ── Bottom Gradient Fade ── */}
      <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-background to-transparent" />
    </section>
  );
}
