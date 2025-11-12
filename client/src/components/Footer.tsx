export function Footer() {
  return (
    <footer className="bg-[hsl(210,40%,20%)] text-white">
      <div className="container mx-auto px-6 py-6 text-center">
        <p className="text-gray-400 text-sm" data-testid="text-copyright">
          © {new Date().getFullYear()} PokePao. Alle Rechte vorbehalten.
        </p>
      </div>
    </footer>
  );
}
