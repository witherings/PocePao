import { Link } from "wouter";
import { Hero } from "@/components/Hero";
import { Gallery3D } from "@/components/Gallery3D";
import { Truck, ShoppingBag, Calendar } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { useQuery } from "@tanstack/react-query";

export default function Home() {
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

  const orderTitle = contentData.orderTitle || "Wähle dein Erlebnis";
  const orderSubtitle = contentData.orderSubtitle || "Ob schnell geliefert, zum Mitnehmen oder gemütlich bei uns – Frische ist garantiert.";
  const deliveryTitle = contentData.deliveryTitle || "Lieferung";
  const deliveryDesc = contentData.deliveryDesc || "Bestell online und spare 10%!";
  const pickupTitle = contentData.pickupTitle || "Speisekarte & Abholung";
  const pickupDesc = contentData.pickupDesc || "Online vorbestellen, ohne Wartezeit abholen.";
  const reservationTitle = contentData.reservationTitle || "Vor Ort genießen";
  const reservationDesc = contentData.reservationDesc || "Genieße deine Bowl in gemütlicher Atmosphäre!";

  return (
    <div>
      <Hero />

      {/* Order Options Section */}
      <section id="order-options" className="py-12 md:py-24 bg-muted">
        <div className="container mx-auto px-6">
          <div className="text-center mb-8 md:mb-12">
            <h2 className="font-poppins text-2xl md:text-4xl lg:text-5xl font-bold text-ocean mb-2 md:mb-4" data-testid="text-section-title">
              {orderTitle}
            </h2>
            <p className="font-lato text-base md:text-lg lg:text-xl text-muted-foreground max-w-2xl mx-auto" data-testid="text-section-subtitle">
              {orderSubtitle}
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-6 lg:gap-8">
            {/* Delivery Card */}
              <Card className="relative p-4 md:p-6 lg:p-8 rounded-2xl shadow-md hover:shadow-lg transition-all duration-300 border-2 border-transparent hover:border-ocean/20" data-testid="card-delivery">
              {/* 10% Rabatt Badge */}
              <div className="absolute -top-4 left-1/2 -translate-x-1/2">
                <span className="bg-destructive text-white font-poppins font-bold text-xs sm:text-sm rounded-full px-3 sm:px-4 py-1.5 shadow-lg" data-testid="badge-discount">
                  10% RABATT
                </span>
              </div>

              <div className="flex flex-col items-center text-center">
                <div className="bg-ocean/10 p-3 md:p-4 rounded-full mb-3 md:mb-4 lg:mb-6">
                  <Truck className="w-8 h-8 md:w-10 md:h-10 lg:w-12 lg:h-12 text-ocean" />
                </div>
                <h3 className="font-poppins text-lg md:text-xl lg:text-2xl font-bold text-ocean mb-2 md:mb-3" data-testid="text-delivery-title">
                  {deliveryTitle}
                </h3>
                <p className="font-lato text-xs md:text-sm lg:text-base text-muted-foreground mb-3 md:mb-4 lg:mb-6 line-clamp-3" data-testid="text-delivery-description">
                  {deliveryDesc}
                </p>
                <Button
                  asChild
                  variant="outline"
                  className="font-poppins font-bold rounded-full px-6 min-h-[48px] border-2 border-ocean text-ocean hover:bg-ocean hover:text-white transition-all w-full sm:w-auto"
                  data-testid="button-delivery"
                >
                  <a href="https://www.lieferando.de/speisekarte/poke-pao" target="_blank" rel="noopener noreferrer">
                    Lieferando & Co.
                  </a>
                </Button>
              </div>
            </Card>

            {/* Pickup Card */}
              <Card className="p-4 md:p-6 lg:p-8 rounded-2xl shadow-md hover:shadow-lg transition-all duration-300 border-2 border-transparent hover:border-ocean/20" data-testid="card-pickup">
              <div className="flex flex-col items-center text-center">
                <div className="bg-ocean/10 p-3 md:p-4 rounded-full mb-3 md:mb-4 lg:mb-6">
                  <ShoppingBag className="w-8 h-8 md:w-10 md:h-10 lg:w-12 lg:h-12 text-ocean" />
                </div>
                <h3 className="font-poppins text-lg md:text-xl lg:text-2xl font-bold text-ocean mb-2 md:mb-3" data-testid="text-pickup-title">
                  {pickupTitle}
                </h3>
                <p className="font-lato text-xs md:text-sm lg:text-base text-muted-foreground mb-3 md:mb-4 lg:mb-6 line-clamp-3" data-testid="text-pickup-description">
                  {pickupDesc}
                </p>
                <Button
                  asChild
                  className="font-poppins font-bold rounded-full px-6 min-h-[48px] bg-sunset hover:bg-sunset-dark text-white shadow-lg hover:shadow-xl transition-all w-full sm:w-auto"
                  data-testid="button-pickup"
                >
                  <Link href="/menu">Speisekarte ansehen</Link>
                </Button>
              </div>
            </Card>

            {/* Reservation Card */}
              <Card className="p-4 md:p-6 lg:p-8 rounded-2xl shadow-md hover:shadow-lg transition-all duration-300 border-2 border-transparent hover:border-ocean/20" data-testid="card-reservation">
              <div className="flex flex-col items-center text-center">
                <div className="bg-ocean/10 p-3 md:p-4 rounded-full mb-3 md:mb-4 lg:mb-6">
                  <Calendar className="w-8 h-8 md:w-10 md:h-10 lg:w-12 lg:h-12 text-ocean" />
                </div>
                <h3 className="font-poppins text-lg md:text-xl lg:text-2xl font-bold text-ocean mb-2 md:mb-3" data-testid="text-reservation-title">
                  {reservationTitle}
                </h3>
                <p className="font-lato text-xs md:text-sm lg:text-base text-muted-foreground mb-3 md:mb-4 lg:mb-6 line-clamp-3" data-testid="text-reservation-description">
                  {reservationDesc}
                </p>
                <Button
                  asChild
                  variant="outline"
                  className="font-poppins font-bold rounded-full px-4 md:px-6 min-h-[48px] border-2 border-ocean text-ocean hover:bg-ocean hover:text-white transition-all w-full sm:w-auto text-sm md:text-base"
                  data-testid="button-reservation"
                >
                  <Link href="/reservierung">Tisch reservieren</Link>
                </Button>
              </div>
            </Card>
          </div>
        </div>
      </section>

      {/* 3D Gallery Section */}
      <Gallery3D />
    </div>
  );
}
