import { useState } from "react";
import { Link, useLocation } from "wouter";
import { Menu, X, Phone } from "lucide-react";
import { FaWhatsapp, FaInstagram, FaTiktok } from "react-icons/fa";
import { Button } from "@/components/ui/button";

export function Header() {
  const [location] = useLocation();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navItems = [
    { href: "/", label: "Startseite" },
    { href: "/menu", label: "Speisekarte" },
    { href: "/about", label: "Über Uns" },
    { href: "/contact", label: "Kontakt" },
  ];

  const isActive = (href: string) => {
    if (href === "/" && location === "/") return true;
    if (href !== "/" && location.startsWith(href)) return true;
    return false;
  };

  return (
    <header className="sticky top-0 z-50 bg-gradient-to-r from-ocean to-ocean-dark shadow-lg">
      {/* Top Bar - Social Media & Phone */}
      <div className="border-b border-white/10">
        <div className="container mx-auto px-6 py-2">
          <div className="flex items-center justify-between text-white text-sm">
            <div className="flex items-center gap-4">
              <a
                href="https://wa.me/380956257835"
                target="_blank"
                rel="noopener noreferrer"
                className="hover-elevate p-2 rounded-md transition-all"
                data-testid="link-whatsapp"
                aria-label="WhatsApp"
              >
                <FaWhatsapp className="w-5 h-5" />
              </a>
              <a
                href="https://www.instagram.com/poke_pao"
                target="_blank"
                rel="noopener noreferrer"
                className="hover-elevate p-2 rounded-md transition-all"
                data-testid="link-instagram"
                aria-label="Instagram"
              >
                <FaInstagram className="w-5 h-5" />
              </a>
              <a
                href="https://www.tiktok.com/@poke_pao_hamburg"
                target="_blank"
                rel="noopener noreferrer"
                className="hover-elevate p-2 rounded-md transition-all"
                data-testid="link-tiktok"
                aria-label="TikTok"
              >
                <FaTiktok className="w-5 h-5" />
              </a>
            </div>
            <a
              href="tel:04036939098"
              className="flex items-center gap-2 hover-elevate px-3 py-1 rounded-md font-semibold transition-all"
              data-testid="link-phone"
            >
              <Phone className="w-4 h-4" />
              <span>040 36939098</span>
            </a>
          </div>
        </div>
      </div>

      {/* Main Navigation */}
      <div className="container mx-auto px-6 py-4">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <Link href="/" data-testid="link-home" className="flex items-center">
            <img
              src="https://pokepao.de/assets/images/logo_blue.png"
              alt="PokePao Logo"
              className="h-12 md:h-14 w-auto"
              data-testid="img-logo"
            />
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-8">
            {navItems.map((item) => (
              <Link 
                key={item.href} 
                href={item.href}
                className={`relative font-poppins font-semibold text-white transition-colors hover:text-sunset group ${
                  isActive(item.href) ? "text-sunset" : ""
                }`}
                data-testid={`link-nav-${item.label.toLowerCase().replace(/\s+/g, '-')}`}
              >
                {item.label}
                <span
                  className={`absolute -bottom-1 left-0 h-0.5 bg-sunset transition-all ${
                    isActive(item.href) ? "w-full" : "w-0 group-hover:w-full"
                  }`}
                />
              </Link>
            ))}
          </nav>

          {/* CTA Button & Mobile Menu Toggle */}
          <div className="flex items-center gap-4">
            <Button
              asChild
              className="hidden md:inline-flex bg-sunset hover:bg-sunset-dark text-white font-poppins font-bold rounded-full px-6 py-2 shadow-lg hover:shadow-xl transition-all hover:-translate-y-0.5"
              data-testid="button-order-now"
            >
              <Link href="/menu">
                Jetzt bestellen
              </Link>
            </Button>

            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden p-2 text-white hover-elevate rounded-md"
              data-testid="button-mobile-menu"
              aria-label="Toggle menu"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <div className="md:hidden mt-4 bg-white/95 backdrop-blur-sm rounded-lg p-4 shadow-xl animate-fade-in">
            <nav className="flex flex-col gap-2">
              {navItems.map((item) => (
                <Link 
                  key={item.href} 
                  href={item.href}
                  onClick={() => setMobileMenuOpen(false)}
                  className={`block py-3 px-4 rounded-lg font-poppins font-semibold transition-all ${
                    isActive(item.href)
                      ? "bg-ocean text-white"
                      : "text-foreground hover:bg-accent"
                  }`}
                  data-testid={`link-mobile-${item.label.toLowerCase().replace(/\s+/g, '-')}`}
                >
                  {item.label}
                </Link>
              ))}
              <Button
                asChild
                onClick={() => setMobileMenuOpen(false)}
                className="w-full mt-2 bg-sunset hover:bg-sunset-dark text-white font-poppins font-bold rounded-full py-3"
                data-testid="button-mobile-order"
              >
                <Link href="/menu">
                  Jetzt bestellen
                </Link>
              </Button>
            </nav>
          </div>
        )}
      </div>
    </header>
  );
}
