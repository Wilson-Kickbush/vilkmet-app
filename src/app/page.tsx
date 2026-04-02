"use client";
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
        
        <section id="cotizador" className="py-24 bg-white scroll-mt-24 relative overflow-hidden">
          {/* Sutil efecto de fondo arquitectónico */}
          <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-slate-200 to-transparent" />
          
          <div className="container mx-auto px-6 lg:px-8 relative z-10">
            <div className="max-w-4xl mx-auto text-center mb-12">
              <div className="flex items-center justify-center gap-3 mb-6">
                <div className="h-[1px] w-12 bg-[#E85D04]" />
                <span className="text-[10px] font-black uppercase tracking-[0.4em] text-[#E85D04]">Cotizador a Medida</span>
                <div className="h-[1px] w-12 bg-[#E85D04]" />
              </div>
              
              <h2 className="text-4xl md:text-6xl font-heading font-black text-[#1A3A52] tracking-tighter leading-[1.1] mb-6 uppercase">
                PROTEJA SU <br />
                <span className="text-[#E85D04]">INVERSIÓN.</span>
              </h2>
              
              <p className="text-lg md:text-xl text-slate-900/80 font-bold max-w-2xl mx-auto leading-relaxed">
                Evite los costosos errores de cálculo en su obra. Configure sus aberturas aquí y obtenga un <span className="text-[#E85D04] font-black italic">plan de inversión exacto</span>, sin sorpresas ni sobrecostos ocultos.
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

            {/* 3. Garantía y Respaldo (Estratégico) */}
            <div className="space-y-6">
              <h4 className="text-[#E85D04] font-black uppercase tracking-widest text-xs">Garantía y Respaldo</h4>
              <div className="space-y-4">
                <p className="text-white/50 text-xs leading-relaxed">
                  Para su tranquilidad, cada proyecto se formaliza mediante un <span className="text-white/80 font-bold">Contrato de Locación de Obra</span>. 
                  Otorgamos una <span className="text-white/80 font-bold">Garantía Contractual de 2 años</span> sobre materiales y cerramientos, superando el plazo legal y bajo normativas de Defensa del Consumidor.
                </p>
                <div className="flex gap-3">
                  <div className="bg-white/5 p-2 rounded-lg border border-white/10 text-[10px] uppercase font-bold tracking-tighter">Perfiles Aluar</div>
                  <div className="bg-white/5 p-2 rounded-lg border border-white/10 text-[10px] uppercase font-bold tracking-tighter">Herrajes Premium</div>
                </div>
              </div>
            </div>
          </div>

          <div className="mt-20 pt-8 border-t border-white/10 flex flex-col md:flex-row justify-between items-center gap-6 text-center md:text-left">
            <p className="text-[10px] text-white/30 uppercase tracking-[0.2em]">
              © {new Date().getFullYear()} VILKMET | Ingeniería en Aberturas de Autor. Todos los derechos reservados.
            </p>
            <div className="flex gap-8 text-[10px] text-white/30 uppercase tracking-widest font-bold">
              <span className="hover:text-[#E85D04] cursor-pointer transition-colors">Defensa del Consumidor</span>
              <span className="hover:text-[#E85D04] cursor-pointer transition-colors">Términos y condiciones</span>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
