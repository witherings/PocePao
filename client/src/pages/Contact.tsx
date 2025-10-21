import { Phone, MapPin, Clock, Star } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

export default function Contact() {
  return (
    <div>
      {/* Breadcrumb / Page Header */}
      <div className="bg-gradient-to-r from-ocean to-ocean-dark text-white py-16">
        <div className="container mx-auto px-6 text-center">
          <h1 className="font-poppins text-4xl md:text-5xl font-bold mb-4" data-testid="text-page-title">
            Kontakt
          </h1>
          <p className="font-lato text-lg md:text-xl opacity-90" data-testid="text-page-subtitle">
            Wir freuen uns auf deinen Besuch!
          </p>
        </div>
      </div>

      {/* Contact Content */}
      <section className="py-16 md:py-24">
        <div className="container mx-auto px-6">
          {/* Contact Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-16">
            <Card className="p-6 hover:shadow-xl transition-all duration-300 hover:-translate-y-1" data-testid="card-phone">
              <div className="flex items-start gap-4">
                <div className="bg-ocean/10 p-3 rounded-full flex-shrink-0">
                  <Phone className="w-6 h-6 text-ocean" />
                </div>
                <div>
                  <h3 className="font-poppins font-bold text-lg text-ocean mb-2">Telefon</h3>
                  <a
                    href="tel:04036939098"
                    className="font-lato text-muted-foreground hover:text-ocean transition-colors"
                    data-testid="link-phone"
                  >
                    040 36939098
                  </a>
                </div>
              </div>
            </Card>

            <Card className="p-6 hover:shadow-xl transition-all duration-300 hover:-translate-y-1" data-testid="card-address">
              <div className="flex items-start gap-4">
                <div className="bg-ocean/10 p-3 rounded-full flex-shrink-0">
                  <MapPin className="w-6 h-6 text-ocean" />
                </div>
                <div>
                  <h3 className="font-poppins font-bold text-lg text-ocean mb-2">Adresse</h3>
                  <p className="font-lato text-muted-foreground" data-testid="text-address">
                    Fuhlsbüttler Straße 328<br />
                    Hamburg
                  </p>
                </div>
              </div>
            </Card>

            <Card className="p-6 hover:shadow-xl transition-all duration-300 hover:-translate-y-1" data-testid="card-hours">
              <div className="flex items-start gap-4">
                <div className="bg-ocean/10 p-3 rounded-full flex-shrink-0">
                  <Clock className="w-6 h-6 text-ocean" />
                </div>
                <div>
                  <h3 className="font-poppins font-bold text-lg text-ocean mb-2">Öffnungszeiten</h3>
                  <div className="font-lato text-muted-foreground space-y-1" data-testid="text-hours">
                    <p>Mo-So: 11:15 - 21:00</p>
                  </div>
                </div>
              </div>
            </Card>
          </div>

          {/* Map Section */}
          <div className="mb-16">
            <h2 className="font-poppins text-3xl md:text-4xl font-bold text-ocean mb-8 text-center" data-testid="text-map-title">
              So findest du uns
            </h2>
            <div className="rounded-2xl overflow-hidden shadow-2xl h-[400px] md:h-[500px]">
              <iframe
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d2368.0789244563674!2d10.006686176819165!3d53.60771095646801!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x47b18f1b7f8e8e8d%3A0x1234567890abcdef!2sFuhlsb%C3%BCttler%20Stra%C3%9Fe%20328%2C%20Hamburg!5e0!3m2!1sde!2sde!4v1234567890123!5m2!1sde!2sde"
                width="100%"
                height="100%"
                style={{ border: 0 }}
                allowFullScreen
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                title="PokePao Location Map"
                data-testid="iframe-map"
              />
            </div>
          </div>

          {/* Reviews Section */}
          <div className="mb-16">
            <h2 className="font-poppins text-3xl md:text-4xl font-bold text-ocean mb-4 text-center" data-testid="text-reviews-title">
              Was unsere Gäste sagen
            </h2>
            <p className="text-center text-muted-foreground mb-8 font-lato" data-testid="text-reviews-subtitle">
              Echte Bewertungen von echten Genießern.
            </p>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
              {/* Review 1 */}
              <Card className="p-6" data-testid="card-review-1">
                <div className="flex gap-1 mb-3">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <Star key={star} className="w-5 h-5 fill-sunset text-sunset" />
                  ))}
                </div>
                <p className="font-lato text-muted-foreground italic mb-4" data-testid="text-review-1">
                  "Super lecker und frisch zubereitet. Die Auswahl ist riesig und das Personal sehr freundlich. Absolute Empfehlung!"
                </p>
                <p className="font-poppins font-bold text-ocean" data-testid="text-reviewer-1">- Jennifer L.</p>
              </Card>

              {/* Review 2 */}
              <Card className="p-6" data-testid="card-review-2">
                <div className="flex gap-1 mb-3">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <Star key={star} className="w-5 h-5 fill-sunset text-sunset" />
                  ))}
                </div>
                <p className="font-lato text-muted-foreground italic mb-4" data-testid="text-review-2">
                  "Beste Poke Bowl in Hamburg! Die Zutaten sind immer frisch, die Saucen sind der Hammer und die Portionen machen satt. Wir kommen immer wieder gerne."
                </p>
                <p className="font-poppins font-bold text-ocean" data-testid="text-reviewer-2">- Max R.</p>
              </Card>

              {/* Review 3 */}
              <Card className="p-6" data-testid="card-review-3">
                <div className="flex gap-1 mb-3">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <Star key={star} className="w-5 h-5 fill-sunset text-sunset" />
                  ))}
                </div>
                <p className="font-lato text-muted-foreground italic mb-4" data-testid="text-review-3">
                  "Ein kleines Stück Hawaii in Barmbek. Alles wird mit Liebe gemacht, das schmeckt man einfach. Der Laden ist klein aber fein."
                </p>
                <p className="font-poppins font-bold text-ocean" data-testid="text-reviewer-3">- David S.</p>
              </Card>
            </div>

            <div className="text-center">
              <Button
                asChild
                variant="outline"
                className="font-poppins font-bold rounded-full px-8 py-6 border-2 border-ocean text-ocean hover:bg-ocean hover:text-white"
                data-testid="button-more-reviews"
              >
                <a 
                  href="https://www.google.com/maps/place/Pok%C3%A9+Pao+%E2%80%93+Frische+Pok%C3%A9+Bowls+%26+gesundes+Caf%C3%A9+in+Hamburg+(Barmbek)/@53.600353,10.0413782,17z/data=!4m8!3m7!1s0x47b189f7f4a00893:0xea8636b5afc20ba1!8m2!3d53.600353!4d10.0413782!9m1!1b1!16s%2Fg%2F11s990jl7w?entry=ttu&g_ep=EgoyMDI1MTAwOC4wIKXMDSoASAFQAw%3D%3D"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  Mehr auf Google Maps lesen
                </a>
              </Button>
            </div>
          </div>

          {/* How to Reach Us */}
          <div className="bg-muted rounded-2xl p-8 md:p-12">
            <h2 className="font-poppins text-2xl md:text-3xl font-bold text-ocean mb-6 text-center" data-testid="text-directions-title">
              Anfahrt
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
              <div data-testid="directions-public">
                <h3 className="font-poppins font-bold text-xl text-ocean mb-3">Öffentliche Verkehrsmittel</h3>
                <p className="font-lato text-muted-foreground">
                  U-Bahn: U1 bis Ohlsdorf<br />
                  Bus: Linie 23, 26, 179<br />
                  Nur 5 Minuten Fußweg von der Station
                </p>
              </div>
              <div data-testid="directions-car">
                <h3 className="font-poppins font-bold text-xl text-ocean mb-3">Mit dem Auto</h3>
                <p className="font-lato text-muted-foreground">
                  Parkplätze in der Nähe verfügbar<br />
                  Gut erreichbar über die A7<br />
                  Kostenlose Parkplätze in den Seitenstraßen
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
