import { Heart, Users, Award, Leaf } from "lucide-react";
import { Card } from "@/components/ui/card";
import { useQuery } from "@tanstack/react-query";

interface PageImage {
  id: string;
  page: string;
  url: string;
  filename: string;
  alt?: string;
  order: number;
  uploadedAt: string;
}

export default function About() {
  const { data: content } = useQuery({
    queryKey: ["/api/static-content", "about", { locale: "de" }],
    queryFn: async () => {
      const response = await fetch("/api/static-content/about?locale=de");
      if (!response.ok) return null;
      return response.json();
    },
  });

  const { data: pageImages = [] } = useQuery<PageImage[]>({
    queryKey: ["/api/page-images/ueber-uns"],
  });

  const title = content?.title || "Über Uns";
  const subtitle = content?.subtitle || "Unsere Geschichte und Leidenschaft";
  const image = pageImages.length > 0 ? pageImages[0].url : (content?.image || "/images/vitamins-bowl.png");
  const paragraphs = content?.content?.split('\n\n').filter((p: string) => p.trim()) || [
    "Bei PokePao bringen wir die authentische hawaiianische Poke Bowl-Kultur nach Hamburg. Unsere Reise begann mit der Leidenschaft für frische, gesunde und unglaublich leckere Bowls.",
    "Jede Bowl wird mit Liebe und Sorgfalt zubereitet. Wir verwenden nur die frischesten Zutaten und folgen traditionellen Rezepten, die wir mit modernen Geschmacksnoten verfeinern.",
    "Heute sind wir stolz darauf, als eine der besten Poke Bowl Restaurants in Deutschland anerkannt zu sein. Aber für uns zählt vor allem eins: dass jeder Gast mit einem Lächeln unser Restaurant verlässt."
  ];

  return (
    <div>
      {/* Breadcrumb / Page Header */}
      <div className="bg-gradient-to-r from-ocean to-ocean-dark text-white pt-12 pb-6 md:py-10">
        <div className="container mx-auto px-6 text-center">
          <h1 className="font-poppins text-2xl md:text-3xl font-bold mb-2" data-testid="text-page-title">
            {title}
          </h1>
          <p className="font-lato text-sm md:text-base opacity-90" data-testid="text-page-subtitle">
            {subtitle}
          </p>
        </div>
      </div>

      {/* About Content */}
      <section className="py-16 md:py-24">
        <div className="container mx-auto px-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center mb-16">
            <div>
              <img
                src={image}
                alt="Fresh Poke Bowl"
                loading="lazy"
                className="rounded-2xl shadow-2xl w-full h-auto"
                data-testid="img-about-hero"
              />
            </div>
            <div>
              <h2 className="font-poppins text-3xl md:text-4xl font-bold text-ocean mb-6" data-testid="text-story-title">
                Unsere Geschichte
              </h2>
              <div className="space-y-4 font-lato text-muted-foreground">
                {paragraphs.map((p: string, idx: number) => (
                  <p key={idx} data-testid={`text-story-p${idx + 1}`}>
                    {p}
                  </p>
                ))}
              </div>
            </div>
          </div>

          {/* Values Section */}
          <div className="mb-16">
            <h2 className="font-poppins text-3xl md:text-4xl font-bold text-ocean mb-12 text-center" data-testid="text-values-title">
              Unsere Werte
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
              <Card className="p-6 text-center hover:shadow-xl transition-all duration-300 hover:-translate-y-1" data-testid="card-value-quality">
                <div className="bg-ocean/10 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Award className="w-8 h-8 text-ocean" />
                </div>
                <h3 className="font-poppins font-bold text-xl text-ocean mb-2">Qualität</h3>
                <p className="font-lato text-sm text-muted-foreground">
                  Nur die besten Zutaten kommen in unsere Bowls
                </p>
              </Card>

              <Card className="p-6 text-center hover:shadow-xl transition-all duration-300 hover:-translate-y-1" data-testid="card-value-fresh">
                <div className="bg-ocean/10 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Leaf className="w-8 h-8 text-ocean" />
                </div>
                <h3 className="font-poppins font-bold text-xl text-ocean mb-2">Frische</h3>
                <p className="font-lato text-sm text-muted-foreground">
                  Täglich frisch zubereitet, direkt vor deinen Augen
                </p>
              </Card>

              <Card className="p-6 text-center hover:shadow-xl transition-all duration-300 hover:-translate-y-1" data-testid="card-value-passion">
                <div className="bg-ocean/10 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Heart className="w-8 h-8 text-ocean" />
                </div>
                <h3 className="font-poppins font-bold text-xl text-ocean mb-2">Leidenschaft</h3>
                <p className="font-lato text-sm text-muted-foreground">
                  Mit Herz und Seele bei jedem einzelnen Gericht
                </p>
              </Card>

              <Card className="p-6 text-center hover:shadow-xl transition-all duration-300 hover:-translate-y-1" data-testid="card-value-community">
                <div className="bg-ocean/10 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Users className="w-8 h-8 text-ocean" />
                </div>
                <h3 className="font-poppins font-bold text-xl text-ocean mb-2">Gemeinschaft</h3>
                <p className="font-lato text-sm text-muted-foreground">
                  Wir sind mehr als ein Restaurant – wir sind Familie
                </p>
              </Card>
            </div>
          </div>

          {/* Awards Section */}
          <div className="bg-gradient-to-r from-ocean/5 to-sunset/5 rounded-2xl p-8 md:p-12 text-center">
            <div className="flex justify-center mb-6">
              <div className="bg-gold/20 p-6 rounded-full">
                <Award className="w-16 h-16 text-gold" />
              </div>
            </div>
            <h2 className="font-poppins text-2xl md:text-3xl font-bold text-ocean mb-4" data-testid="text-award-title">
              Deutschlands Beste Poke Bowl 2024
            </h2>
            <p className="font-lato text-lg text-muted-foreground max-w-2xl mx-auto" data-testid="text-award-description">
              Wir sind stolz und dankbar für diese Auszeichnung. Sie motiviert uns, jeden Tag unser Bestes zu geben und euch mit köstlichen, frischen Poke Bowls zu verwöhnen.
            </p>
          </div>
        </div>
      </section>
    </div>
  );
}
