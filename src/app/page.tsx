"use client";
import Link from "next/link";
import { Navbar } from "@/components/layout/Navbar";
import { HeroSection } from "@/components/landing/HeroSection";
import { EducationSection } from "@/components/landing/EducationSection";
import { PortfolioSection } from "@/components/landing/PortfolioSection";
import { CotizadorDynamic } from "@/components/cotizador/CotizadorDynamic";
import { VilkmetLogo } from "@/components/ui/VilkmetLogo";
import { Mail, Phone, MapPin } from "lucide-react";

export default function Home() {
  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      
      <main className="flex-1">
        <HeroSection />
        <EducationSection />
        <PortfolioSection />
        
        <section id="cotizador" className="py-24 bg-secondary/50">
          <div className="mx-auto max-w-7xl px-6 lg:px-8">
            <div className="mx-auto max-w-2xl text-center mb-12">
              <h2 className="text-3xl font-bold tracking-tight text-primary sm:text-4xl font-heading">Cotizador Paramétrico Online</h2>
              <p className="mt-2 text-lg text-muted-foreground">
                Selecciona tu línea, ingresa las medidas y obtén un presupuesto preliminar instantáneo.
              </p>
            </div>
            
            <div className="bg-background rounded-2xl shadow-2xl p-6 lg:p-10 border border-border mt-8">
              <CotizadorDynamic />
            </div>
          </div>
        </section>
      </main>

      <footer className="bg-[#1A3A52] text-white py-20 border-t border-white/5">
        <div className="container mx-auto px-6 max-w-7xl">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-16 items-start">
            {/* 1. Identidad */}
            <div className="space-y-6">
              <VilkmetLogo variant="horizontal" theme="dark" height={60} />
              <p className="text-white/50 text-sm leading-relaxed max-w-sm">
                Expertos en carpintería de aluminio de alta gama. 
                Soluciones a medida con perfiles Aluar para proyectos residenciales y corporativos de excelencia.
              </p>
            </div>

            {/* 2. Contacto Oficial */}
            <div className="space-y-6">
              <h4 className="text-[#E85D04] font-black uppercase tracking-widest text-xs">Contacto Oficial</h4>
              <ul className="space-y-4">
                <li>
                  <a href="mailto:ventas@vilkmet.com" className="flex items-center gap-3 text-white/80 hover:text-white transition-colors group">
                    <Mail className="h-5 w-5 text-[#E85D04]" />
                    <span>ventas@vilkmet.com</span>
                  </a>
                </li>
                <li>
                  <a href="tel:5491150960796" className="flex items-center gap-3 text-white/80 hover:text-white transition-colors">
                    <Phone className="h-5 w-5 text-[#E85D04]" />
                    <span>11-5096-0796</span>
                  </a>
                </li>
                <li className="flex items-start gap-3 text-white/60">
                  <MapPin className="h-5 w-5 text-[#E85D04] shrink-0" />
                  <span className="text-sm">Cosquín 963, Ingeniero Budge,<br/>Lomas de Zamora, Buenos Aires.</span>
                </li>
              </ul>
            </div>

            {/* 3. Navegación Rápida */}
            <div className="space-y-6">
              <h4 className="text-[#E85D04] font-black uppercase tracking-widest text-xs">Accesos</h4>
              <div className="grid grid-cols-1 gap-3">
                <Link href="#lineas" className="text-white/60 hover:text-white text-sm transition-colors w-fit">Líneas de Producto</Link>
                <Link href="#galeria" className="text-white/60 hover:text-white text-sm transition-colors w-fit">Portafolio</Link>
                <Link href="#cotizador" className="text-white/60 hover:text-white text-sm transition-colors w-fit font-bold">Cotizador Online</Link>
              </div>
            </div>
          </div>

          <div className="mt-20 pt-8 border-t border-white/10 flex flex-col md:flex-row justify-between items-center gap-6">
            <p className="text-[10px] text-white/30 uppercase tracking-[0.2em]">
              © {new Date().getFullYear()} VILKMET - Aberturas de Autor. Todos los derechos reservados.
            </p>
            <div className="flex gap-6 text-[10px] text-white/30 uppercase tracking-widest font-bold">
              <span className="hover:text-[#E85D04] cursor-pointer transition-colors">Privacidad</span>
              <span className="hover:text-[#E85D04] cursor-pointer transition-colors">Términos</span>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
