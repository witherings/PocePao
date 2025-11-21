import { Button } from "@/components/ui/button";
import { Trophy } from "lucide-react";
import { useState, useEffect, useCallback } from "react";
import useEmblaCarousel from "embla-carousel-react";
import Autoplay from "embla-carousel-autoplay";
import { useQuery } from "@tanstack/react-query";
import { type GalleryImage } from "@shared/schema";

export function Hero() {
  const [emblaRef, emblaApi] = useEmblaCarousel(
    { loop: true },
    [Autoplay({ delay: 5000, stopOnInteraction: false })]
  );
  const [selectedIndex, setSelectedIndex] = useState(0);

  // Fetch header slider images from database
  const { data: allImages = [] } = useQuery<GalleryImage[]>({
    queryKey: ["/api/gallery"],
  });

  // Filter only header images for the slider
  const heroImages = allImages.filter(img => img.type === "header");

  // Fallback to default images if no header images exist
  const FALLBACK_HERO_IMAGES = [
    "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=1920&h=1080&fit=crop&q=80",
    "https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=1920&h=1080&fit=crop&q=80",
    "https://images.unsplash.com/photo-1498837167922-ddd27525d352?w=1920&h=1080&fit=crop&q=80",
  ];

  const displayImages = heroImages.length > 0 ? heroImages : FALLBACK_HERO_IMAGES.map((url, idx) => ({
    id: `fallback-${idx}`,
    url,
    filename: `fallback-${idx}`,
    type: "header" as const,
    createdAt: new Date().toISOString(),
  }));

  // Fetch home page content from database
  const { data: homeContent } = useQuery({
    queryKey: ["/api/static-content", "home", { locale: "de" }],
    queryFn: async () => {
      const response = await fetch("/api/static-content/home?locale=de");
      if (!response.ok) return null;
      return response.json();
    },
  });

  // Parse content or use defaults
  const contentData = homeContent?.content ? 
    (typeof homeContent.content === 'string' ? JSON.parse(homeContent.content) : homeContent.content) 
    : {};

  const heroTitle = contentData.heroTitle || "Dein Kurzurlaub in der Schüssel.";
  const heroSubtitle = contentData.heroSubtitle || "Frische, Geschmack und Hawaii-Feeling direkt in Hamburg. Gönn dir das Beste.";
  const awardTitle = contentData.awardTitle || "Deutschlands Beste Poke Bowl 2024";

  const onSelect = useCallback(() => {
    if (!emblaApi) return;
    setSelectedIndex(emblaApi.selectedScrollSnap());
  }, [emblaApi]);

  useEffect(() => {
    if (!emblaApi) return;
    onSelect();
    emblaApi.on("select", onSelect);
    return () => {
      emblaApi.off("select", onSelect);
    };
  }, [emblaApi, onSelect]);

  return (
    <section className="relative h-[calc(100vh-110px)] h-[calc(100dvh-110px)] overflow-hidden">
      {/* Carousel */}
      <div className="embla absolute inset-0" ref={emblaRef}>
        <div className="embla__container h-full flex">
          {displayImages.map((image, index) => (
            <div key={image.id || index} className="embla__slide flex-[0_0_100%] relative">
              <img
                src={image.url}
                alt={image.filename || `PokePao Bowl ${index + 1}`}
                className="w-full h-full object-cover"
              />
              {/* Dark gradient overlay for better text readability */}
              <div className="absolute inset-0 bg-gradient-to-br from-ocean/80 via-ocean-dark/70 to-sunset/60" />
            </div>
          ))}
        </div>
      </div>

      {/* Carousel Dots */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 z-30 flex gap-2">
        {displayImages.map((_, index) => (
          <button
            key={index}
            disabled={!emblaApi}
            className={`w-2 h-2 rounded-full transition-all ${
              index === selectedIndex
                ? "bg-white w-8"
                : "bg-white/50 hover:bg-white/75"
            } ${!emblaApi ? 'cursor-not-allowed opacity-50' : 'cursor-pointer'}`}
            onClick={() => emblaApi?.scrollTo(index)}
            aria-label={`Go to slide ${index + 1}`}
          />
        ))}
      </div>

      {/* Animated floating shapes overlay (subtle) */}
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none z-10 opacity-30">
        {/* Subtle floating shapes - much less prominent than before */}
        <div className="absolute animate-rotate-slow hidden md:block">
          <div className="relative w-[600px] h-[600px]">
            {[...Array(6)].map((_, i) => {
              const angle = (i * 360) / 6;
              return (
                <div
                  key={`shape-${i}`}
                  className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2"
                  style={{
                    transform: `rotate(${angle}deg) translateY(-300px)`,
                  }}
                >
                  <div className="w-8 h-8 rounded-full bg-white/20 backdrop-blur-sm shadow-lg"></div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="absolute inset-0 flex items-center justify-center z-20">
        <div className="max-w-4xl mx-auto px-6 text-center text-white">
          {/* Award Badge */}
          <div
            className="inline-flex items-center gap-2 bg-white/90 backdrop-blur-md rounded-full px-4 md:px-6 py-2 md:py-3 mb-4 md:mb-6 shadow-xl animate-fade-in"
            data-testid="badge-award"
          >
            <Trophy className="w-4 h-4 md:w-6 md:h-6 text-gold" />
            <span className="font-poppins font-semibold text-ocean text-xs md:text-base">
              {awardTitle}
            </span>
          </div>

          {/* Headline */}
          <h1
            className="font-poppins text-3xl sm:text-4xl md:text-6xl lg:text-7xl font-bold leading-tight mb-4 md:mb-6 animate-fade-in"
            style={{ textShadow: "2px 2px 8px rgba(0,0,0,0.7)" }}
            data-testid="text-hero-title"
          >
            {heroTitle}
          </h1>

          {/* Subheading */}
          <p
            className="font-lato text-base md:text-lg lg:text-2xl max-w-2xl mx-auto mb-6 md:mb-8 animate-fade-in"
            style={{ textShadow: "1px 1px 4px rgba(0,0,0,0.7)", animationDelay: "0.1s" }}
            data-testid="text-hero-subtitle"
          >
            {heroSubtitle}
          </p>

          {/* CTA Button */}
          <Button
            size="lg"
            onClick={() => {
              const orderSection = document.getElementById('order-options');
              if (orderSection) {
                orderSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
              }
            }}
            className="bg-sunset hover:bg-sunset-dark text-white font-poppins font-bold rounded-full px-8 md:px-10 py-4 md:py-6 text-base md:text-lg tracking-wide uppercase shadow-2xl hover:shadow-sunset/50 transition-all hover:-translate-y-1 animate-fade-in"
            style={{ animationDelay: "0.2s" }}
            data-testid="button-hero-cta"
          >
            Jetzt bestellen
          </Button>
        </div>
      </div>
    </section>
  );
}
