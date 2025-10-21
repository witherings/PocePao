import { Link } from "wouter";
import { FaWhatsapp, FaInstagram, FaTiktok } from "react-icons/fa";
import { Phone, Mail, MapPin, Clock } from "lucide-react";

export function Footer() {
  return (
    <footer className="bg-[hsl(210,40%,20%)] text-white">
      <div className="container mx-auto px-6 py-16">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Quick Links */}
          <div>
            <h3 className="font-poppins font-bold text-xl mb-4 text-white">
              Quick Links
            </h3>
            <nav className="flex flex-col gap-2">
              <Link 
                href="/"
                className="text-gray-300 hover:text-sunset transition-colors"
                data-testid="link-footer-home"
              >
                Startseite
              </Link>
              <Link 
                href="/menu"
                className="text-gray-300 hover:text-sunset transition-colors"
                data-testid="link-footer-menu"
              >
                Speisekarte
              </Link>
              <Link 
                href="/about"
                className="text-gray-300 hover:text-sunset transition-colors"
                data-testid="link-footer-about"
              >
                Über Uns
              </Link>
              <Link 
                href="/contact"
                className="text-gray-300 hover:text-sunset transition-colors"
                data-testid="link-footer-contact"
              >
                Kontakt
              </Link>
            </nav>
          </div>

          {/* Contact Info */}
          <div>
            <h3 className="font-poppins font-bold text-xl mb-4 text-white">
              Kontakt
            </h3>
            <div className="flex flex-col gap-3 text-gray-300">
              <a
                href="tel:04036939098"
                className="flex items-center gap-2 hover:text-sunset transition-colors"
                data-testid="link-footer-phone"
              >
                <Phone className="w-4 h-4 flex-shrink-0" />
                <span>040 36939098</span>
              </a>
              <div className="flex items-start gap-2">
                <MapPin className="w-4 h-4 flex-shrink-0 mt-1" />
                <span data-testid="text-address">
                  Fuhlsbüttler Straße 328<br />Hamburg
                </span>
              </div>
            </div>
          </div>

          {/* Opening Hours */}
          <div>
            <h3 className="font-poppins font-bold text-xl mb-4 text-white">
              Öffnungszeiten
            </h3>
            <div className="flex flex-col gap-2 text-gray-300">
              <div className="flex items-start gap-2">
                <Clock className="w-4 h-4 flex-shrink-0 mt-1" />
                <div data-testid="text-hours">
                  <p>Mo-So: 11:15 - 21:00</p>
                </div>
              </div>
            </div>
          </div>

          {/* Social Media */}
          <div>
            <h3 className="font-poppins font-bold text-xl mb-4 text-white">
              Folgen Sie uns
            </h3>
            <div className="flex gap-4">
              <a
                href="https://wa.me/380956257835"
                target="_blank"
                rel="noopener noreferrer"
                className="bg-white/10 hover:bg-sunset p-3 rounded-full transition-all hover:-translate-y-1"
                data-testid="link-footer-whatsapp"
                aria-label="WhatsApp"
              >
                <FaWhatsapp className="w-6 h-6" />
              </a>
              <a
                href="https://www.instagram.com/poke_pao"
                target="_blank"
                rel="noopener noreferrer"
                className="bg-white/10 hover:bg-sunset p-3 rounded-full transition-all hover:-translate-y-1"
                data-testid="link-footer-instagram"
                aria-label="Instagram"
              >
                <FaInstagram className="w-6 h-6" />
              </a>
              <a
                href="https://www.tiktok.com/@poke_pao_hamburg"
                target="_blank"
                rel="noopener noreferrer"
                className="bg-white/10 hover:bg-sunset p-3 rounded-full transition-all hover:-translate-y-1"
                data-testid="link-footer-tiktok"
                aria-label="TikTok"
              >
                <FaTiktok className="w-6 h-6" />
              </a>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="mt-12 pt-8 border-t border-white/10 text-center text-gray-400 text-sm">
          <p data-testid="text-copyright">
            © {new Date().getFullYear()} PokePao. Alle Rechte vorbehalten.
          </p>
        </div>
      </div>
    </footer>
  );
}
