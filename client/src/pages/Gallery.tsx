import { Gallery3D } from "@/components/Gallery3D";

export default function Gallery() {
  return (
    <div>
      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-ocean to-sunset py-16 md:py-24">
        <div className="container mx-auto px-6 text-center text-white">
          <h1 className="font-poppins text-3xl md:text-5xl lg:text-6xl font-bold mb-4">
            Galerie
          </h1>
          <p className="font-lato text-lg md:text-xl max-w-2xl mx-auto">
            Tauche ein in die bunte Welt unserer frischen Poke Bowls
          </p>
        </div>
      </section>

      {/* Gallery Section */}
      <section className="py-12 md:py-24">
        <div className="container mx-auto px-6">
          <Gallery3D />
        </div>
      </section>
    </div>
  );
}
