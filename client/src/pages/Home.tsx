import { Link } from "wouter";
import { Hero } from "@/components/Hero";
import { Gallery3D } from "@/components/Gallery3D";
import { ReservationForm } from "@/components/ReservationForm";
import { Truck, ShoppingBag, Calendar } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";

export default function Home() {
  return (
    <div>
      <Hero />

      {/* Order Options Section */}
      <section id="order-options" className="py-16 md:py-24 bg-muted">
        <div className="container mx-auto px-6">
          <div className="text-center mb-12">
            <h2 className="font-poppins text-3xl md:text-4xl lg:text-5xl font-bold text-ocean mb-4" data-testid="text-section-title">
              Wähle dein Erlebnis
            </h2>
            <p className="font-lato text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto" data-testid="text-section-subtitle">
              Ob schnell geliefert, zum Mitnehmen oder gemütlich bei uns – Frische ist garantiert.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Delivery Card */}
              <Card className="relative p-8 rounded-2xl shadow-md hover:shadow-lg transition-all duration-300 border-2 border-transparent hover:border-ocean/20" data-testid="card-delivery">
              {/* 10% Rabatt Badge */}
              <div className="absolute -top-4 left-1/2 -translate-x-1/2">
                <span className="bg-destructive text-white font-poppins font-bold text-sm rounded-full px-4 py-1.5 shadow-lg" data-testid="badge-discount">
                  10% RABATT
                </span>
              </div>

              <div className="flex flex-col items-center text-center">
                <div className="bg-ocean/10 p-4 rounded-full mb-6">
                  <Truck className="w-12 h-12 text-ocean" />
                </div>
                <h3 className="font-poppins text-2xl font-bold text-ocean mb-3" data-testid="text-delivery-title">
                  Lieferung
                </h3>
                <p className="font-lato text-muted-foreground mb-6" data-testid="text-delivery-description">
                  Bestell über Lieferando, Wolt oder Uber Eats und spare 10% bei deiner Online-Bestellung!
                </p>
                <Button
                  asChild
                  variant="outline"
                  className="font-poppins font-bold rounded-full px-6 py-3 border-2 border-ocean text-ocean hover:bg-ocean hover:text-white transition-all"
                  data-testid="button-delivery"
                >
                  <a href="https://www.lieferando.de/speisekarte/poke-pao" target="_blank" rel="noopener noreferrer">
                    Lieferando & Co.
                  </a>
                </Button>
              </div>
            </Card>

            {/* Pickup Card */}
              <Card className="p-8 rounded-2xl shadow-md hover:shadow-lg transition-all duration-300 border-2 border-transparent hover:border-ocean/20" data-testid="card-pickup">
              <div className="flex flex-col items-center text-center">
                <div className="bg-ocean/10 p-4 rounded-full mb-6">
                  <ShoppingBag className="w-12 h-12 text-ocean" />
                </div>
                <h3 className="font-poppins text-2xl font-bold text-ocean mb-3" data-testid="text-pickup-title">
                  Speisekarte & Abholung
                </h3>
                <p className="font-lato text-muted-foreground mb-6" data-testid="text-pickup-description">
                  Online vorbestellen, ohne Wartezeit abholen. Perfekt für die Mittagspause!
                </p>
                <Button
                  asChild
                  className="font-poppins font-bold rounded-full px-6 py-3 bg-sunset hover:bg-sunset-dark text-white shadow-lg hover:shadow-xl transition-all"
                  data-testid="button-pickup"
                >
                  <Link href="/menu">Speisekarte ansehen</Link>
                </Button>
              </div>
            </Card>

            {/* Reservation Card */}
              <Card className="p-8 rounded-2xl shadow-md hover:shadow-lg transition-all duration-300 border-2 border-transparent hover:border-ocean/20" data-testid="card-reservation">
              <div className="flex flex-col items-center text-center">
                <div className="bg-ocean/10 p-4 rounded-full mb-6">
                  <Calendar className="w-12 h-12 text-ocean" />
                </div>
                <h3 className="font-poppins text-2xl font-bold text-ocean mb-3" data-testid="text-reservation-title">
                  Vor Ort genießen
                </h3>
                <p className="font-lato text-muted-foreground mb-6" data-testid="text-reservation-description">
                  Besuche uns direkt im Restaurant und genieße deine Poke Bowl in gemütlicher Atmosphäre!
                </p>
                <Button
                  asChild
                  variant="outline"
                  className="font-poppins font-bold rounded-full px-6 py-3 border-2 border-ocean text-ocean hover:bg-ocean hover:text-white transition-all"
                  data-testid="button-reservation"
                >
                  <Link href="/contact">Zu unseren Infos</Link>
                </Button>
              </div>
            </Card>
          </div>
        </div>
      </section>

      {/* Why Choose Us Section */}
      <section className="py-16 md:py-24">
        <div className="container mx-auto px-6">
          <div className="text-center mb-12">
            <h2 className="font-poppins text-3xl md:text-4xl font-bold text-ocean mb-4" data-testid="text-why-title">
              Warum PokePao?
            </h2>
            <p className="font-lato text-lg text-muted-foreground max-w-2xl mx-auto" data-testid="text-why-subtitle">
              Was uns besonders macht
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-4xl mx-auto">
            <div className="text-center" data-testid="feature-fresh">
              <div className="text-5xl mb-4">🌊</div>
              <h3 className="font-poppins font-bold text-xl text-ocean mb-2">Immer frisch</h3>
              <p className="font-lato text-muted-foreground">Täglich frische Zutaten, direkt vom Markt</p>
            </div>
            <div className="text-center" data-testid="feature-authentic">
              <div className="text-5xl mb-4">🏝️</div>
              <h3 className="font-poppins font-bold text-xl text-ocean mb-2">Authentisch hawaiianisch</h3>
              <p className="font-lato text-muted-foreground">Traditionelle Rezepte mit modernem Twist</p>
            </div>
            <div className="text-center" data-testid="feature-quality">
              <div className="text-5xl mb-4">⭐</div>
              <h3 className="font-poppins font-bold text-xl text-ocean mb-2">Beste Qualität</h3>
              <p className="font-lato text-muted-foreground">Ausgezeichnet als Deutschlands beste Poke Bowl</p>
            </div>
          </div>
        </div>
      </section>

      {/* Reservation Section */}
      <section className="py-16 md:py-24">
        <div className="container mx-auto px-6">
          <div className="text-center mb-12">
            <h2 className="font-poppins text-3xl md:text-4xl font-bold text-ocean mb-4" data-testid="text-reservation-section-title">
              Tisch reservieren
            </h2>
            <p className="font-lato text-lg text-muted-foreground max-w-2xl mx-auto" data-testid="text-reservation-section-subtitle">
              Sichere dir deinen Platz bei uns
            </p>
          </div>
          <div>
            <ReservationForm />
          </div>
        </div>
      </section>

      {/* 3D Gallery Section */}
      <Gallery3D />
    </div>
  );
}
