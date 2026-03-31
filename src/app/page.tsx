"use client";
import { Navbar } from "@/components/layout/Navbar";
import { HeroSection } from "@/components/landing/HeroSection";
import { EducationSection } from "@/components/landing/EducationSection";
import { PortfolioSection } from "@/components/landing/PortfolioSection";
import { CotizadorDynamic } from "@/components/cotizador/CotizadorDynamic";

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

      <footer className="bg-primary text-primary-foreground py-12">
        <div className="container mx-auto px-6 text-center">
          <p className="font-heading font-bold text-2xl tracking-widest text-[#FFFFFF]">VILKMET</p>
          <p className="text-primary-foreground/60 text-sm mt-4">
            Ingeniería en Aluminio y Acero <br/> Aberturas que protegen y embellecen tu espacio.
          </p>
          <div className="mt-8 border-t border-primary-foreground/20 pt-8 text-xs text-primary-foreground/40">
            © {new Date().getFullYear()} VILKMET. Todos los derechos reservados.
          </div>
        </div>
      </footer>
    </div>
  );
}
