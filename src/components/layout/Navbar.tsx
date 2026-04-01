"use client";

import Link from "next/link";
import { Button, buttonVariants } from "@/components/ui/button";
import { Menu, MapPin, Mail, Phone, MessageCircle } from "lucide-react";

export function Navbar() {
  // Función para que el logo vuelva hacia arriba suavemente
  const handleScrollToTop = (e: React.MouseEvent<HTMLAnchorElement>) => {
    if (window.location.pathname === '/') {
      e.preventDefault();
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  return (
    <>
      {/* 1. TOP BAR PREMIUM (Datos de Contacto) */}
      <div className="hidden lg:flex w-full bg-primary text-primary-foreground py-2 text-xs font-medium border-b border-primary/20">
        <div className="container mx-auto flex justify-between items-center px-4">
          <div className="flex items-center gap-6">
            <div className="flex items-center gap-2">
              <MapPin className="h-3.5 w-3.5 text-accent" />
              <span>Cosquín 963, Ingeniero Budge, Lomas de Zamora</span>
            </div>
            <div className="flex items-center gap-2">
              <Mail className="h-3.5 w-3.5 text-accent" />
              <a href="mailto:ventas@vilkmet.com" className="hover:text-accent transition-colors">
                ventas@vilkmet.com
              </a>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Phone className="h-3.5 w-3.5 text-accent" />
            <a href="https://wa.me/5491150960796" target="_blank" rel="noreferrer" className="hover:text-accent transition-colors font-bold tracking-wider">
              11-5096-0796
            </a>
          </div>
        </div>
      </div>

      {/* 2. NAVBAR PRINCIPAL */}
      <header className="sticky top-0 z-50 w-full border-b border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 shadow-sm">
        <div className="container mx-auto flex h-20 items-center justify-between px-4">
          
          {/* Logo con Scroll To Top */}
          <Link href="/" onClick={handleScrollToTop} className="flex items-center gap-2 group">
            <div className="flex h-12 w-16 items-center justify-center border-2 border-primary text-xl font-bold font-heading text-primary bg-background group-hover:border-accent transition-colors">
              V<span className="text-accent mx-1">|</span>K
            </div>
            <div className="hidden md:flex flex-col ml-2">
              <span className="font-heading font-bold text-lg text-primary tracking-widest leading-none group-hover:text-accent transition-colors">VILKMET</span>
              <span className="text-[10px] text-muted-foreground uppercase tracking-wider">Aberturas de Autor</span>
            </div>
          </Link>
          
          <nav className="hidden md:flex gap-8 items-center text-sm font-medium">
            <Link href="#lineas" className="text-foreground/80 hover:text-primary hover:font-bold transition-all">Líneas de Producto</Link>
            <Link href="#galeria" className="text-foreground/80 hover:text-primary hover:font-bold transition-all">Portafolio</Link>
            <Link href="#cotizador" className="text-foreground/80 hover:text-primary hover:font-bold transition-all">Cotizador Online</Link>
          </nav>

          <div className="flex items-center gap-4">
            <Link 
              href="#cotizador" 
              className={buttonVariants({ className: "hidden sm:inline-flex bg-accent hover:bg-accent/90 text-white shadow-lg shadow-accent/20 transition-all hover:scale-105" })}
            >
              Obtener Presupuesto
            </Link>
            <Button variant="ghost" size="icon" className="md:hidden">
              <Menu className="h-6 w-6 text-primary" />
              <span className="sr-only">Toggle menu</span>
            </Button>
          </div>
        </div>
      </header>

      {/* 3. BOTÓN FLOTANTE DE WHATSAPP GLOBAL */}
      <a
        href="https://wa.me/5491150960796"
        target="_blank"
        rel="noreferrer"
        className="fixed bottom-6 right-6 z-50 flex h-14 w-14 items-center justify-center rounded-full bg-[#25D366] text-white shadow-lg shadow-black/20 hover:scale-110 hover:shadow-xl transition-all duration-300 group"
        aria-label="Contactar por WhatsApp"
      >
        <MessageCircle className="h-7 w-7" />
        {/* Tooltip chiquito que aparece al pasar el mouse */}
        <span className="absolute -top-10 right-0 w-max opacity-0 group-hover:opacity-100 transition-opacity bg-background border border-border text-foreground text-xs px-2 py-1 rounded shadow-sm">
          ¡Chateá con Ventas!
        </span>
      </a>
    </>
  );
}