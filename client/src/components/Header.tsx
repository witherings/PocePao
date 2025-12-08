import { useState } from "react";
import { Link, useLocation } from "wouter";
import { Menu, X, Phone } from "lucide-react";
import { FaWhatsapp, FaInstagram, FaTiktok } from "react-icons/fa";
import { Button } from "@/components/ui/button";
import { useScrollDirection } from "@/hooks/useScrollDirection";
import { useIsMobile } from "@/hooks/use-mobile";

export function Header() {
  const [location, navigate] = useLocation();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { isVisible, isAtTop } = useScrollDirection();
  const isMobile = useIsMobile();

  const navItems = [
    { href: "/", label: "Startseite" },
    { href: "/menu", label: "Speisekarte" },
    { href: "/about", label: "Über Uns" },
    { href: "/reservierung", label: "Reservierung" },
    { href: "/contact", label: "Kontakt" },
  ];

  const isActive = (href: string) => {
    if (href === "/" && location === "/") return true;
    if (href !== "/" && location.startsWith(href)) return true;
    return false;
  };

  const headerClasses = isMobile 
    ? `fixed top-0 left-0 right-0 z-50 bg-gradient-to-r from-ocean to-ocean-dark transition-transform duration-300 ${
        isVisible || mobileMenuOpen ? 'translate-y-0' : '-translate-y-full'
      } ${!isAtTop ? 'shadow-[0_4px_20px_rgba(0,0,0,0.3)]' : 'shadow-[0_8px_30px_rgba(0,0,0,0.4)]'}`
    : "sticky top-0 z-50 bg-gradient-to-r from-ocean to-ocean-dark shadow-[0_8px_30px_rgba(0,0,0,0.4)]";

  return (
    <>
      {isMobile && <div className="h-[88px]" />}
      <header className={headerClasses}>
      {/* Blue background extension above header */}
      <div className="absolute -top-96 left-0 right-0 h-96 bg-gradient-to-r from-ocean to-ocean-dark pointer-events-none" />
      
      {/* Top Bar - Social Media & Phone */}
      <div className="border-b border-white/10">
        <div className="container mx-auto px-4 sm:px-6 py-1.5 sm:py-2">
          <div className="flex items-center justify-between text-white text-xs sm:text-sm">
            <div className="flex items-center gap-2 sm:gap-4">
              <a
                href="https://wa.me/380956257835"
                target="_blank"
                rel="noopener noreferrer"
                className="hover-elevate p-2 sm:p-2 min-w-[44px] min-h-[44px] flex items-center justify-center rounded-md transition-all"
                data-testid="link-whatsapp"
                aria-label="WhatsApp"
              >
                <FaWhatsapp className="w-5 h-5" />
              </a>
              <a
                href="https://www.instagram.com/poke_pao"
                target="_blank"
                rel="noopener noreferrer"
                className="hover-elevate p-2 sm:p-2 min-w-[44px] min-h-[44px] flex items-center justify-center rounded-md transition-all"
                data-testid="link-instagram"
                aria-label="Instagram"
              >
                <FaInstagram className="w-5 h-5" />
              </a>
              <a
                href="https://www.tiktok.com/@poke_pao_hamburg"
                target="_blank"
                rel="noopener noreferrer"
                className="hover-elevate p-2 sm:p-2 min-w-[44px] min-h-[44px] flex items-center justify-center rounded-md transition-all"
                data-testid="link-tiktok"
                aria-label="TikTok"
              >
                <FaTiktok className="w-5 h-5" />
              </a>
            </div>
            <a
              href="tel:04036939098"
              className="flex items-center gap-1 sm:gap-2 hover-elevate px-2 sm:px-3 py-1 min-h-[44px] rounded-md font-semibold transition-all text-xs sm:text-sm"
              data-testid="link-phone"
            >
              <Phone className="w-4 h-4" />
              <span className="hidden sm:inline">040 36939098</span>
              <span className="sm:hidden">Anrufen</span>
            </a>
          </div>
        </div>
      </div>

      {/* Main Navigation */}
      <div className="container mx-auto px-4 sm:px-6 py-2 sm:py-3 md:py-4">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <Link href="/" data-testid="link-home" className="flex items-center min-h-[44px]">
            <img
              src="https://pokepao.de/assets/images/logo_blue.png"
              alt="PokePao Logo"
              className="h-8 sm:h-10 md:h-12 lg:h-14 w-auto"
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
              onClick={() => {
                const handleScroll = () => {
                  const orderSection = document.getElementById('order-options');
                  if (orderSection) {
                    orderSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
                  }
                };

                if (location === '/') {
                  // Already on home - scroll directly
                  handleScroll();
                } else {
                  // Navigate to home and scroll after render
                  navigate('/');
                  setTimeout(handleScroll, 300);
                }
              }}
              className="hidden md:inline-flex bg-sunset hover:bg-sunset-dark text-white font-poppins font-bold rounded-full px-6 py-2 shadow-lg hover:shadow-xl transition-all hover:-translate-y-0.5"
              data-testid="button-order-now"
            >
              Jetzt bestellen
            </Button>

            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden p-2 text-white hover-elevate rounded-md min-w-[48px] min-h-[48px] flex items-center justify-center relative z-10"
              data-testid="button-mobile-menu"
              aria-label="Toggle menu"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <div className="md:hidden mt-2 sm:mt-4 bg-white/95 backdrop-blur-sm rounded-lg p-3 sm:p-4 shadow-xl animate-fade-in">
            <nav className="flex flex-col gap-1.5 sm:gap-2">
              {navItems.map((item) => (
                <Link 
                  key={item.href} 
                  href={item.href}
                  onClick={() => setMobileMenuOpen(false)}
                  className={`block py-3 sm:py-4 px-3 sm:px-4 min-h-[48px] sm:min-h-[52px] rounded-lg font-poppins font-semibold transition-all text-sm sm:text-base ${
                    isActive(item.href)
                      ? "bg-ocean text-white"
                      : "text-foreground hover:bg-accent"
                  }`}
                  data-testid={`link-mobile-${item.label.toLowerCase().replace(/\s+/g, '-')}`}
                >
                  {item.label}
                </Link>
              ))}
            </nav>
          </div>
        )}
      </div>
    </header>
    </>
  );
}
