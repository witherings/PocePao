import { ReservationForm } from "@/components/ReservationForm";
import { useQuery } from "@tanstack/react-query";

export default function Reservierung() {
  // Fetch reservierung page content from database
  const { data: reservierungContent } = useQuery({
    queryKey: ["/api/static-content", "reservierung", { locale: "de" }],
    queryFn: async () => {
      const response = await fetch("/api/static-content/reservierung?locale=de");
      if (!response.ok) return null;
      return response.json();
    },
  });

  const title = reservierungContent?.title || "Tisch reservieren";
  const subtitle = reservierungContent?.subtitle || "Sichere dir deinen Platz bei uns";

  return (
    <div>
      {/* Breadcrumb / Page Header */}
      <div className="bg-gradient-to-r from-ocean to-ocean-dark text-white py-12 md:py-16">
        <div className="container mx-auto px-4 md:px-6 flex flex-col items-center justify-center text-center">
          <h1 className="font-poppins text-4xl md:text-5xl lg:text-6xl font-bold mb-3 w-full" data-testid="text-page-title">
            {title}
          </h1>
          {subtitle && (
            <p className="font-lato text-lg md:text-xl text-white/80 max-w-xl leading-relaxed">
              {subtitle}
            </p>
          )}
        </div>
      </div>

      {/* Reservation Form Section */}
      <section className="py-6 md:py-16">
        <div className="container mx-auto px-6">
          <ReservationForm />
        </div>
      </section>
    </div>
  );
}
