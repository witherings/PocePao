import { Link } from "wouter";

export function Footer() {
  return (
    <footer className="bg-[hsl(210,40%,20%)] text-white">
      <div className="container mx-auto px-6 py-6 text-center relative">
        <p className="text-gray-400 text-sm" data-testid="text-copyright">
          © {new Date().getFullYear()} PokePao. Alle Rechte vorbehalten.
        </p>
        <Link 
          href="/admin/login"
          className="absolute bottom-4 right-4 text-gray-500 hover:text-gray-300 text-sm opacity-50 hover:opacity-100 transition-all duration-200"
          title="Admin Panel"
          aria-label="Admin Panel"
        >
          •
        </Link>
      </div>
    </footer>
  );
}
