import { useState } from "react";
import { Link, useLocation } from "wouter";
import { Rocket, ShoppingCart, Menu, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useQuery } from "@tanstack/react-query";
import { CartItem } from "@/lib/types";

interface NavigationProps {
  onCartClick: () => void;
  sessionId: string;
}

export default function Navigation({ onCartClick, sessionId }: NavigationProps) {
  const [location] = useLocation();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const { data: cartItems = [] } = useQuery<CartItem[]>({
    queryKey: ['/api/cart', sessionId],
  });

  const navLinks = [
    { href: "/", label: "Home" },
    { href: "/exclusive", label: "Planet Exclusives" },
    { href: "/compare", label: "Compare Prices" },
  ];

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 cosmic-bg border-b cosmic-border">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center space-x-4">
            <Rocket className="text-cyan-400 text-2xl" />
            <h1 className="text-xl font-bold space-font">Cosmic Delivery</h1>
          </div>
          
          <div className="hidden md:flex items-center space-x-6">
            {navLinks.map((link) => (
              <Link key={link.href} href={link.href}>
                <a className={`text-slate-300 hover:text-cyan-400 transition-colors duration-300 ${
                  location === link.href ? 'text-cyan-400' : ''
                }`}>
                  {link.label}
                </a>
              </Link>
            ))}
            <Button
              onClick={onCartClick}
              variant="outline"
              className="cosmic-bg cosmic-border hover:bg-cyan-400/20 relative"
            >
              <ShoppingCart className="w-4 h-4 mr-2" />
              Cart
              {cartItems.length > 0 && (
                <span className="absolute -top-2 -right-2 bg-orange-500 text-white text-xs rounded-full px-2 py-1 min-w-[1.5rem] h-6 flex items-center justify-center">
                  {cartItems.length}
                </span>
              )}
            </Button>
          </div>

          <Button
            variant="ghost"
            size="sm"
            className="md:hidden text-slate-300"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          >
            {isMobileMenuOpen ? <X /> : <Menu />}
          </Button>
        </div>
      </div>

      {/* Mobile Menu */}
      {isMobileMenuOpen && (
        <div className="md:hidden cosmic-bg border-t cosmic-border">
          <div className="px-4 py-4 space-y-4">
            {navLinks.map((link) => (
              <Link key={link.href} href={link.href}>
                <a 
                  className={`block text-slate-300 hover:text-cyan-400 transition-colors ${
                    location === link.href ? 'text-cyan-400' : ''
                  }`}
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  {link.label}
                </a>
              </Link>
            ))}
            <Button
              onClick={() => {
                onCartClick();
                setIsMobileMenuOpen(false);
              }}
              variant="outline"
              className="w-full cosmic-bg cosmic-border hover:bg-cyan-400/20"
            >
              <ShoppingCart className="w-4 h-4 mr-2" />
              Cart ({cartItems.length})
            </Button>
          </div>
        </div>
      )}
    </nav>
  );
}
