import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { Trophy } from "lucide-react";

export function Hero() {
  return (
    <section className="relative h-[80vh] min-h-[500px] flex items-center justify-center text-center text-white px-6 overflow-hidden">
      {/* Dark Overlay */}
      <div className="absolute inset-0 bg-gradient-to-br from-ocean/80 via-ocean-dark/70 to-sunset/60 z-10" />

      {/* Animated Background - Rotating Circles */}
      <div className="absolute inset-0 flex items-center justify-center">
        {/* Ring 1 - Outer, slowest */}
        <div className="absolute animate-rotate-slow">
          <div className="relative w-[800px] h-[800px]">
            {[...Array(12)].map((_, i) => {
              const angle = (i * 360) / 12;
              const isPokebal = i % 2 === 0;
              return (
                <div
                  key={`ring1-${i}`}
                  className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2"
                  style={{
                    transform: `rotate(${angle}deg) translateY(-400px)`,
                  }}
                >
                  {isPokebal ? (
                    <div className="w-12 h-12 rounded-full bg-white border-4 border-foreground/20 flex items-center justify-center shadow-xl">
                      <div className="w-5 h-5 rounded-full bg-sunset"></div>
                    </div>
                  ) : (
                    <div className="w-14 h-14 rounded-full bg-gradient-to-br from-ocean to-ocean-dark shadow-xl flex items-center justify-center border-2 border-white/30">
                      <div className="text-2xl">🍜</div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* Ring 2 - Middle, medium speed */}
        <div className="absolute animate-rotate-medium">
          <div className="relative w-[600px] h-[600px]">
            {[...Array(10)].map((_, i) => {
              const angle = (i * 360) / 10;
              const isBowl = i % 2 === 1;
              return (
                <div
                  key={`ring2-${i}`}
                  className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2"
                  style={{
                    transform: `rotate(${angle}deg) translateY(-300px)`,
                  }}
                >
                  {isBowl ? (
                    <div className="w-12 h-12 rounded-full bg-gradient-to-br from-sunset to-gold shadow-xl flex items-center justify-center border-2 border-white/30">
                      <div className="text-xl">🥗</div>
                    </div>
                  ) : (
                    <div className="w-10 h-10 rounded-full bg-white border-4 border-foreground/20 flex items-center justify-center shadow-xl">
                      <div className="w-4 h-4 rounded-full bg-ocean"></div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* Ring 3 - Inner, fastest */}
        <div className="absolute animate-rotate-fast">
          <div className="relative w-[400px] h-[400px]">
            {[...Array(8)].map((_, i) => {
              const angle = (i * 360) / 8;
              const isPokebal = i % 2 === 0;
              return (
                <div
                  key={`ring3-${i}`}
                  className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2"
                  style={{
                    transform: `rotate(${angle}deg) translateY(-200px)`,
                  }}
                >
                  {isPokebal ? (
                    <div className="w-8 h-8 rounded-full bg-white border-3 border-foreground/20 flex items-center justify-center shadow-lg">
                      <div className="w-3 h-3 rounded-full bg-gold"></div>
                    </div>
                  ) : (
                    <div className="w-10 h-10 rounded-full bg-gradient-to-br from-ocean-dark to-ocean shadow-lg flex items-center justify-center border-2 border-white/30">
                      <div className="text-lg">🍲</div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* Ring 4 - Very outer ring, very slow, opposite direction */}
        <div className="absolute animate-rotate-reverse-slow">
          <div className="relative w-[1000px] h-[1000px]">
            {[...Array(16)].map((_, i) => {
              const angle = (i * 360) / 16;
              const type = i % 4;
              return (
                <div
                  key={`ring4-${i}`}
                  className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2"
                  style={{
                    transform: `rotate(${angle}deg) translateY(-500px)`,
                  }}
                >
                  {type === 0 && (
                    <div className="w-10 h-10 rounded-full bg-white border-3 border-foreground/15 flex items-center justify-center shadow-lg opacity-70">
                      <div className="w-4 h-4 rounded-full bg-ocean-dark"></div>
                    </div>
                  )}
                  {type === 1 && (
                    <div className="w-11 h-11 rounded-full bg-gradient-to-br from-gold to-sunset shadow-lg flex items-center justify-center border-2 border-white/20 opacity-70">
                      <div className="text-lg">🍱</div>
                    </div>
                  )}
                  {type === 2 && (
                    <div className="w-9 h-9 rounded-full bg-white border-3 border-foreground/15 flex items-center justify-center shadow-lg opacity-70">
                      <div className="w-4 h-4 rounded-full bg-sunset"></div>
                    </div>
                  )}
                  {type === 3 && (
                    <div className="w-12 h-12 rounded-full bg-gradient-to-br from-ocean to-sunset shadow-lg flex items-center justify-center border-2 border-white/20 opacity-70">
                      <div className="text-xl">🥙</div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="relative z-20 max-w-4xl mx-auto">
        {/* Award Badge */}
        <div
          className="inline-flex items-center gap-2 bg-white/90 backdrop-blur-md rounded-full px-6 py-3 mb-6 shadow-xl animate-fade-in"
          data-testid="badge-award"
        >
          <Trophy className="w-6 h-6 text-gold" />
          <span className="font-poppins font-semibold text-ocean">
            Deutschlands Beste Poke Bowl 2024
          </span>
        </div>

        {/* Headline */}
        <h1
          className="font-poppins text-4xl md:text-6xl lg:text-7xl font-bold leading-tight mb-6 animate-fade-in"
          style={{ textShadow: "2px 2px 8px rgba(0,0,0,0.7)" }}
          data-testid="text-hero-title"
        >
          Dein Kurzurlaub in der Schüssel.
        </h1>

        {/* Subheading */}
        <p
          className="font-lato text-lg md:text-xl lg:text-2xl max-w-2xl mx-auto mb-8 animate-fade-in"
          style={{ textShadow: "1px 1px 4px rgba(0,0,0,0.7)", animationDelay: "0.1s" }}
          data-testid="text-hero-subtitle"
        >
          Frische, Geschmack und Hawaii-Feeling direkt in Hamburg. Gönn dir das Beste.
        </p>

        {/* CTA Button */}
        <Link href="/menu">
          <Button
            size="lg"
            className="bg-sunset hover:bg-sunset-dark text-white font-poppins font-bold rounded-full px-10 py-6 text-lg tracking-wide uppercase shadow-2xl hover:shadow-sunset/50 transition-all hover:-translate-y-1 animate-fade-in"
            style={{ animationDelay: "0.2s" }}
            data-testid="button-hero-cta"
          >
            Jetzt bestellen
          </Button>
        </Link>
      </div>
    </section>
  );
}
