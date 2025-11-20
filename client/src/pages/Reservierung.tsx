import { ReservationForm } from "@/components/ReservationForm";

export default function Reservierung() {
  return (
    <div>
      {/* Breadcrumb / Page Header */}
      <div className="bg-gradient-to-r from-ocean to-ocean-dark text-white py-6">
        <div className="container mx-auto px-6 text-center">
          <h1 className="font-poppins text-2xl md:text-3xl font-bold mb-2" data-testid="text-page-title">
            Tisch reservieren
          </h1>
          <p className="font-lato text-sm md:text-base opacity-90" data-testid="text-page-subtitle">
            Sichere dir deinen Platz bei uns
          </p>
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
