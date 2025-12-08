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
      <div className="bg-gradient-to-r from-ocean to-ocean-dark text-white py-8 md:py-12">
        <div className="container mx-auto px-4 md:px-6 text-center">
          <h1 className="font-poppins text-2xl md:text-3xl font-bold" data-testid="text-page-title">
            {title}
          </h1>
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
