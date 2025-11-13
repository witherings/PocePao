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
          className="absolute bottom-4 right-4 text-gray-600 hover:text-gray-400 text-xs opacity-30 hover:opacity-60 transition-opacity"
          title="Admin"
        >
          •
        </Link>
      </div>
    </footer>
  );
}
