import { Link } from "wouter";
import { Home, ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function NotFound() {
  return (
    <div className="min-h-[60vh] flex items-center justify-center px-6">
      <div className="text-center max-w-md">
        <div className="mb-8">
          <h1 className="font-poppins text-9xl font-bold text-ocean mb-4" data-testid="text-404">
            404
          </h1>
          <h2 className="font-poppins text-3xl font-bold text-foreground mb-4" data-testid="text-not-found-title">
            Seite nicht gefunden
          </h2>
          <p className="font-lato text-lg text-muted-foreground" data-testid="text-not-found-description">
            Oops! Die Seite, die du suchst, existiert nicht oder wurde verschoben.
          </p>
        </div>

        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Button
            onClick={() => window.history.back()}
            variant="outline"
            className="font-poppins font-bold border-2"
            data-testid="button-go-back"
          >
            <ArrowLeft className="w-5 h-5 mr-2" />
            Zurück
          </Button>
          <Button
            asChild
            className="bg-sunset hover:bg-sunset-dark text-white font-poppins font-bold"
            data-testid="button-go-home"
          >
            <Link href="/">
              <Home className="w-5 h-5 mr-2" />
              Zur Startseite
            </Link>
          </Button>
        </div>
      </div>
    </div>
  );
}
