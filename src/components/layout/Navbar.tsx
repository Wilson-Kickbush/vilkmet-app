"use client";

import Link from "next/link";
import { Button, buttonVariants } from "@/components/ui/button";
import { Menu } from "lucide-react";

export function Navbar() {
  return (
    <header className="sticky top-0 z-50 w-full border-b border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container mx-auto flex h-20 items-center justify-between px-4">
        <Link href="/" className="flex items-center gap-2">
          <div className="flex h-12 w-16 items-center justify-center border-2 border-primary text-xl font-bold font-heading text-primary bg-background">
            V<span className="text-accent mx-1">|</span>K
          </div>
          <div className="hidden md:flex flex-col ml-2">
            <span className="font-heading font-bold text-lg text-primary tracking-widest leading-none">VILKMET</span>
            <span className="text-[10px] text-muted-foreground uppercase tracking-wider">Aberturas de Autor</span>
          </div>
        </Link>
        
        <nav className="hidden md:flex gap-8 items-center text-sm font-medium">
          <Link href="#lineas" className="text-foreground/80 hover:text-primary transition-colors">Líneas de Producto</Link>
          <Link href="#galeria" className="text-foreground/80 hover:text-primary transition-colors">Portafolio</Link>
          <Link href="#cotizador" className="text-foreground/80 hover:text-primary transition-colors">Cotizador Online</Link>
        </nav>

        <div className="flex items-center gap-4">
          <Link 
            href="#cotizador" 
            className={buttonVariants({ className: "hidden sm:inline-flex bg-accent hover:bg-accent/90 text-white shadow-lg shadow-accent/20" })}
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
  );
}
