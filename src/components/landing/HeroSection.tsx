"use client";

import { Button } from "@/components/ui/button";
import { ArrowRight, CheckCircle2, ShieldCheck, Zap } from "lucide-react";
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
      transition: { duration: 0.8, ease: "easeOut" }
    }
  };

  return (
    <section className="relative min-h-[90vh] flex items-center overflow-hidden bg-[#1A3A52] pt-20 pb-20 sm:pt-32 sm:pb-32">
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
          className="mx-auto max-w-4xl text-center"
        >
          {/* Subheader / Tagline */}
          <motion.div variants={itemVariants} className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/5 border border-white/10 backdrop-blur-md mb-8">
            <Zap className="h-4 w-4 text-[#E85D04]" />
            <span className="text-[10px] font-black uppercase tracking-[0.2em] text-white/60">Liderazgo en Ingeniería Térmica</span>
          </motion.div>

          {/* Main Title Architecture */}
          <motion.h1 variants={itemVariants} className="text-5xl font-heading font-black text-white sm:text-8xl tracking-tight leading-[0.9] mb-8">
            INGENIERIA EN ALUMINIO.<br />
            <span className="text-[#E85D04] italic">ABERTURAS DE AUTOR.</span>
          </motion.h1>

          <motion.p variants={itemVariants} className="mt-8 text-xl leading-relaxed text-blue-100/70 max-w-2xl mx-auto font-medium">
             Consolide su proyecto con perfiles <span className="text-white font-bold">Aluar</span> de alta gama. 
             Precisión milimétrica y aislamiento acústico para inmuebles de categoría.
          </motion.p>
          
          <motion.div variants={itemVariants} className="mt-12 flex flex-col sm:flex-row items-center justify-center gap-6">
            <Button size="lg" asChild className="h-16 px-10 bg-[#E85D04] hover:bg-[#F96D0C] text-white font-black uppercase text-xs tracking-widest rounded-2xl shadow-2xl shadow-orange-500/20 active:scale-95 transition-all">
              <Link href="#cotizador">
                INICIAR PRESUPUESTO ONLINE <ArrowRight className="ml-3 h-4 w-4" />
              </Link>
            </Button>
            <Link href="#proyectos" className="text-xs font-black uppercase tracking-[0.2em] text-white/40 hover:text-white transition-colors group">
              VER GALERÍA TÉCNICA <span aria-hidden="true" className="inline-block group-hover:translate-x-1 transition-transform ml-2">→</span>
            </Link>
          </motion.div>

          {/* Trust Indicators / Glassmorphism Cards */}
          <motion.div variants={itemVariants} className="mt-20 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 max-w-4xl mx-auto">
             <div className="p-6 rounded-3xl bg-white/5 border border-white/5 backdrop-blur-xl flex flex-col items-center gap-3 group hover:bg-white/10 transition-colors">
                <CheckCircle2 className="h-8 w-8 text-[#E85D04]" />
                <div className="text-center">
                  <h4 className="text-white font-black text-[10px] uppercase tracking-widest mb-1">Calidad Certificada</h4>
                  <p className="text-white/40 text-[9px] font-bold uppercase tracking-tight">Extrusión 100% Primera Calidad</p>
                </div>
             </div>
             <div className="p-6 rounded-3xl bg-white/5 border border-white/5 backdrop-blur-xl flex flex-col items-center gap-3 group hover:bg-white/10 transition-colors">
                <ShieldCheck className="h-8 w-8 text-[#E85D04]" />
                <div className="text-center">
                  <h4 className="text-white font-black text-[10px] uppercase tracking-widest mb-1">Garantía Real</h4>
                  <p className="text-white/40 text-[9px] font-bold uppercase tracking-tight">2 años de respaldo estructural</p>
                </div>
             </div>
             <div className="p-6 rounded-3xl bg-white/5 border border-white/5 backdrop-blur-xl flex flex-col items-center gap-3 group hover:bg-white/10 transition-colors sm:col-span-2 lg:col-span-1">
                <Zap className="h-8 w-8 text-[#E85D04]" />
                <div className="text-center">
                  <h4 className="text-white font-black text-[10px] uppercase tracking-widest mb-1">Entrega Prime</h4>
                  <p className="text-white/40 text-[9px] font-bold uppercase tracking-tight">Logística propia y montaje</p>
                </div>
             </div>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}
