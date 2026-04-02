"use client";

import { ArrowRight, Calculator, Headphones, Home, Scaling } from "lucide-react";
import Link from "next/link";
import { motion } from "framer-motion";

export function HeroSection() {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2,
        delayChildren: 0.3
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: { duration: 0.8 }
    }
  };

  return (
    <section className="relative min-h-[80vh] flex items-center overflow-hidden bg-[#1A3A52] pt-4 pb-16 sm:pt-8 sm:pb-24">
      {/* Background Architectural Effects */}
      <div className="absolute inset-x-0 -top-40 -z-10 transform-gpu overflow-hidden blur-3xl sm:-top-80">
        <div 
          className="relative left-[calc(50%-11rem)] aspect-[1155/678] w-[36.125rem] -translate-x-1/2 rotate-[30deg] bg-gradient-to-tr from-[#E85D04]/20 to-[#1A3A52] opacity-40 sm:left-[calc(50%-30rem)] sm:w-[72.1875rem]" 
          style={{ clipPath: "polygon(74.1% 44.1%, 100% 61.6%, 97.5% 26.9%, 85.5% 0.1%, 80.7% 2%, 72.5% 32.5%, 60.2% 62.4%, 52.4% 68.1%, 47.5% 58.3%, 45.2% 34.5%, 27.5% 76.7%, 0.1% 64.9%, 17.9% 100%, 27.6% 76.8%, 76.1% 97.7%, 74.1% 44.1%)" }} 
        />
      </div>
      
      {/* Subtle Radial Gradient Glow */}
      <div className="absolute top-0 right-0 -translate-y-1/2 translate-x-1/4 w-[600px] h-[600px] bg-[#E85D04]/5 rounded-full blur-[120px] pointer-events-none" />

      <div className="container mx-auto px-6 lg:px-8 relative z-10">
        <motion.div 
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="mx-auto max-w-5xl text-center"
        >
          {/* Headline Monumental y Directo */}
          <motion.h1 variants={itemVariants} className="text-5xl font-heading font-black text-white sm:text-[5.5rem] tracking-tight leading-[0.95] mb-6 uppercase">
            ABERTURAS A MEDIDA <br />
            <span className="text-[#E85D04] text-4xl sm:text-[4.6rem]">PARA INMUEBLES DE CATEGORÍA.</span>
          </motion.h1>

          {/* Subheader: Autoridad Técnica */}
          <motion.p variants={itemVariants} className="mt-6 text-xl sm:text-2xl leading-relaxed text-blue-100/80 max-w-4xl mx-auto font-medium">
             Evite los errores de cálculo y las cotizaciones engañosas. Díganos qué medidas necesita y le armaremos un <span className="text-white font-black italic">plan exacto de aberturas de aluminio ALUAR certificado</span> para garantizar estética y aislamiento acústico.
          </motion.p>
          
          <motion.div variants={itemVariants} className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-6">
              <Link 
                href="/#sistema-cotizador" 
                className="group relative flex items-center justify-center gap-4 bg-[#E85D04] hover:bg-[#F96D0C] text-white px-8 sm:px-12 py-6 rounded-2xl font-black uppercase text-xs sm:text-sm tracking-[0.2em] transition-all duration-300 shadow-2xl shadow-orange-500/40 hover:-translate-y-1 active:scale-95"
              >
                <div className="absolute inset-0 rounded-2xl bg-white/20 opacity-0 group-hover:opacity-100 transition-opacity blur-xl" />
                <Calculator className="h-5 w-5 transition-transform group-hover:scale-110" />
                <span className="relative">Calcule su Presupuesto en 2 Minutos</span>
                <ArrowRight className="h-5 w-5 transition-transform group-hover:translate-x-2" />
              </Link>
            <Link href="#galeria" className="text-xs font-black uppercase tracking-[0.2em] text-white/40 hover:text-white transition-colors group">
              VER INSTALACIONES REALES <span aria-hidden="true" className="inline-block group-hover:translate-x-1 transition-transform ml-2">→</span>
            </Link>
          </motion.div>

          {/* Concrete Benefits (Heath Brothers: Concrete is better than Abstract) */}
          <motion.div variants={itemVariants} className="mt-20 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 max-w-4xl mx-auto">
             <div className="p-6 rounded-3xl bg-white/5 border border-white/5 backdrop-blur-xl flex flex-col items-center gap-3 group hover:bg-white/10 transition-colors">
                <Headphones className="h-8 w-8 text-[#E85D04]" />
                <div className="text-center">
                  <h4 className="text-white font-black text-[11px] uppercase tracking-widest mb-1">Aislamiento Absoluto</h4>
                  <p className="text-white/70 text-[11px] font-bold uppercase tracking-tight">Dígale adiós al ruido exterior</p>
                </div>
             </div>
             <div className="p-6 rounded-3xl bg-white/5 border border-white/5 backdrop-blur-xl flex flex-col items-center gap-3 group hover:bg-white/10 transition-colors">
                <Home className="h-8 w-8 text-[#E85D04]" />
                <div className="text-center">
                  <h4 className="text-white font-black text-[11px] uppercase tracking-widest mb-1">Valorización del Inmueble</h4>
                  <p className="text-white/70 text-[11px] font-bold uppercase tracking-tight">Blinde su inversión inmobiliaria</p>
                </div>
             </div>
             <div className="p-6 rounded-3xl bg-white/5 border border-white/5 backdrop-blur-xl flex flex-col items-center gap-3 group hover:bg-white/10 transition-colors sm:col-span-2 lg:col-span-1">
                <Scaling className="h-8 w-8 text-[#E85D04]" />
                <div className="text-center">
                  <h4 className="text-white font-black text-[11px] uppercase tracking-widest mb-1">Plan Exacto 4 Pasos</h4>
                  <p className="text-white/70 text-[11px] font-bold uppercase tracking-tight">Sin errores de cálculo ni demoras</p>
                </div>
             </div>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}
