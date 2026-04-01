"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { Button, buttonVariants } from "@/components/ui/button";
import { VilkmetLogo } from "@/components/ui/VilkmetLogo";
import { Menu, X, Mail, Phone, MapPin, ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";

export function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const pathname = usePathname();

  // Escucha del scroll para animar el header
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Función para scroll suave al inicio
  const scrollToTop = (e: React.MouseEvent) => {
    if (pathname === "/") {
      e.preventDefault();
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  const navLinks = [
    { name: "Líneas de Producto", href: "#lineas" },
    { name: "Portafolio", href: "#galeria" },
    { name: "Cotizador Online", href: "#cotizador" },
  ];

  return (
    <header
      className={cn(
        "sticky top-0 z-50 w-full transition-all duration-500 ease-in-out",
        isScrolled 
          ? "bg-[#1A3A52]/95 backdrop-blur-lg py-2 shadow-[0_10px_30px_rgba(0,0,0,0.2)]" 
          : "bg-[#1A3A52] py-4"
      )}
    >
      <div className="container mx-auto px-4 md:px-10 max-w-7xl">
          <div className="flex items-center justify-between">
            {/* 1. LOGO & BRAND (Más grande e impactante) */}
            <Link 
              href="/" 
              onClick={scrollToTop}
              className="relative z-10 block transition-transform duration-300 hover:scale-105 active:scale-95"
            >
              <VilkmetLogo 
                variant="horizontal" 
                theme="dark"
                width={isScrolled ? 240 : 312}
                height={isScrolled ? 60 : 78} 
                className="transition-all duration-500 drop-shadow-md"
              />
            </Link>

            {/* 2. DESKTOP NAVIGATION (Links en blanco/naranja) */}
            <nav className="hidden xl:flex items-center gap-2">
              {navLinks.map((link) => (
                <Link
                  key={link.name}
                  href={link.href}
                  className="relative px-5 py-2 text-sm font-bold text-white/80 hover:text-white transition-colors group"
                >
                  {link.name}
                  <span className="absolute bottom-0 left-5 right-5 h-0.5 bg-[#E85D04] scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-left" />
                </Link>
              ))}
            </nav>

            {/* 3. CONTACT & CTA (En bloque premium) */}
            <div className="flex items-center gap-4 lg:gap-8">
              {/* Info de contacto con Iconos Naranja */}
              <div className="hidden lg:flex flex-col items-end border-r border-white/20 pr-8">
                <a 
                  href="tel:1150960796" 
                  className="flex items-center gap-2 text-base font-black text-white hover:text-[#E85D04] transition-colors tracking-tight"
                >
                  <Phone className="h-4 w-4 text-[#E85D04]" />
                  11-5096-0796
                </a>
                <span className="text-[9px] text-white/50 uppercase font-bold tracking-[0.2em] mt-1 flex items-center gap-1">
                  <MapPin className="h-3 w-3 text-[#E85D04]" /> BUENOS AIRES, ARG
                </span>
              </div>

              {/* Botón CTA Naranja (Color de Marca) */}
              <Link
                href="#cotizador"
                className={cn(
                  buttonVariants({ size: "lg" }),
                  "relative hidden sm:flex bg-[#E85D04] hover:bg-[#E85D04]/90 text-white font-black px-8 py-7 rounded-xl overflow-hidden group transition-all duration-300 shadow-xl shadow-orange-950/20"
                )}
              >
                <span className="relative z-10 flex items-center gap-2 text-sm uppercase tracking-wider">
                  Cotizar Ahora <ChevronRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
                </span>
                <div className="absolute inset-0 bg-white/10 translate-y-full group-hover:translate-y-0 transition-transform duration-300" />
              </Link>

              {/* Menú Mobile Trigger */}
              <Button
                variant="ghost"
                size="icon"
                className="xl:hidden text-white h-12 w-12 rounded-xl hover:bg-white/10"
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              >
                {mobileMenuOpen ? <X className="h-7 w-7" /> : <Menu className="h-7 w-7" />}
              </Button>
            </div>
          </div>
        </div>

        <AnimatePresence>
          {mobileMenuOpen && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.3 }}
              className="xl:hidden bg-[#1A3A52] border-t border-white/10"
            >
              <div className="px-6 py-8 space-y-6">
                <div className="grid grid-cols-1 gap-4">
                  {navLinks.map((link) => (
                    <Link
                      key={link.name}
                      href={link.href}
                      onClick={() => setMobileMenuOpen(false)}
                      className="text-lg font-bold text-white flex items-center justify-between p-5 bg-white/5 rounded-2xl hover:bg-white/10 transition-colors border border-white/5"
                    >
                      {link.name}
                      <ChevronRight className="h-5 w-5 text-[#E85D04]" />
                    </Link>
                  ))}
                </div>
                
                <div className="pt-8 border-t border-white/10 flex flex-col gap-6">
                  <a href="tel:5491150960796" className="flex items-center gap-4 bg-[#E85D04] p-5 rounded-2xl text-white font-black justify-center shadow-lg shadow-orange-900/20">
                    <Phone className="h-6 w-6" />
                    LLAMAR: 11-5096-0796
                  </a>
                  <div className="flex flex-col gap-4 px-2">
                    <div className="flex items-center gap-4 text-white/70 text-sm">
                      <MapPin className="h-5 w-5 text-[#E85D04]" />
                      <span>Cosquín 963, Lomas de Zamora</span>
                    </div>
                    <a href="mailto:ventas@vilkmet.com" className="flex items-center gap-4 text-white/70 text-sm">
                      <Mail className="h-5 w-5 text-[#E85D04]" />
                      <span>ventas@vilkmet.com</span>
                    </a>
                  </div>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
    </header>
  );
}