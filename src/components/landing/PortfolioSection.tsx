"use client";

import { motion } from "framer-motion";
import { Camera, MapPin, MousePointer2 } from "lucide-react";
import Link from "next/link";

export function PortfolioSection() {
  const projects = [
    { 
      src: "/projects/obra-real-1.jpg", 
      title: "Puerta Balcón Serie Premium", 
      location: "Lomas de Zamora", 
      desc: "Instalación real: Hermeticidad y acabado blanco nieve.",
      span: "md:col-span-2 md:row-span-2",
      badge: "Obra Destacada"
    },
    { 
      src: "https://images.unsplash.com/photo-1600566753086-00f18efc2291?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80", 
      title: "Ventanal de Paño Fijo", 
      location: "San Isidro", 
      desc: "Máxima entrada de luz con perfiles mínimos.",
      span: "md:col-span-1 md:row-span-1" 
    },
    { 
      src: "https://images.unsplash.com/photo-1628003632940-d6215b3c533f?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80", 
      title: "Acceso T4 Pivotante", 
      location: "Nordelta", 
      desc: "Ingeniería de autor en aperturas principales.",
      span: "md:col-span-1 md:row-span-2" 
    },
    { 
      src: "https://images.unsplash.com/photo-1513694203232-719a280e022f?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80", 
      title: "Residencia con DVH", 
      location: "Canning", 
      desc: "Eficiencia térmica de última generación.",
      span: "md:col-span-1 md:row-span-1" 
    },
    { 
      src: "https://images.unsplash.com/photo-1545042746-8dd336ebaf9a?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80", 
      title: "Galería de Cristal", 
      location: "Vicente López", 
      desc: "Integración perfecta con el exterior.",
      span: "md:col-span-1 md:row-span-1" 
    },
  ];

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.1 }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { 
      opacity: 1, 
      y: 0, 
      transition: { duration: 0.5 }
    }
  };

  return (
    <section id="galeria" className="py-24 bg-[#F8FAFC]">
      <div className="container mx-auto px-6 lg:px-8">
        {/* Header Elegante y Ordenado */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-12 mb-16">
          <div className="max-w-2xl">
            <div className="flex items-center gap-3 mb-4">
              <div className="h-[1px] w-8 bg-[#E85D04]" />
              <span className="text-[10px] font-black uppercase tracking-[0.4em] text-[#E85D04]">Exhibición Técnica</span>
            </div>
            <h2 className="text-4xl md:text-6xl font-heading font-black text-[#1A3A52] tracking-tighter leading-tight">
              Instalaciones Reales <span className="text-[#E85D04]">VILKMET.</span>
            </h2>
          </div>
          <p className="text-sm md:text-base text-slate-500 font-medium max-w-xs border-l border-slate-200 pl-6 leading-relaxed italic">
            &ldquo;Cada captura es testimonio de nuestra precisión, plomo y escuadra garantizada.&rdquo;
          </p>
        </div>
        
        {/* Bento Grid Refinado */}
        <motion.div 
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          className="grid grid-cols-1 md:grid-cols-3 gap-6 auto-rows-[300px]"
        >
          {projects.map((project, i) => (
            <motion.div 
              key={i} 
              variants={itemVariants}
              className={`group relative overflow-hidden rounded-3xl bg-slate-100 border border-slate-200/50 transition-all duration-500 ${project.span}`}
            >
              {/* Imagen */}
              <img 
                src={project.src} 
                alt={project.title} 
                className="absolute inset-0 h-full w-full object-cover object-top transition-transform duration-700 group-hover:scale-105"
                loading="lazy"
              />
              
              {/* Overlay suave para legibilidad */}
              <div className="absolute inset-0 bg-gradient-to-t from-[#1A3A52]/90 via-[#1A3A52]/20 to-transparent opacity-40 group-hover:opacity-70 transition-opacity duration-300" />

              {/* Badge Obra Destacada */}
              {project.badge && (
                <div className="absolute top-4 left-4 px-3 py-1 bg-[#E85D04] rounded-lg shadow-lg">
                  <span className="text-[9px] font-black uppercase tracking-widest text-white">{project.badge}</span>
                </div>
              )}

              {/* Contenido Texto con Distribución Mejorada */}
              <div className="absolute inset-x-0 bottom-0 p-6 flex flex-col justify-end min-h-[50%]">
                <div className="flex items-center gap-2 mb-2 text-white/70">
                  <MapPin className="h-3 w-3 text-[#E85D04]" />
                  <span className="text-[9px] font-black uppercase tracking-widest leading-none">{project.location}</span>
                </div>
                <h3 className="text-xl font-heading font-black text-white mb-1 leading-tight tracking-tight">
                  {project.title}
                </h3>
                <p className="text-[11px] text-white/50 font-bold uppercase tracking-tight opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                  {project.desc}
                </p>
                
                <div className="mt-4 flex items-center gap-2 text-[#E85D04] font-black text-[9px] uppercase tracking-widest opacity-0 group-hover:opacity-100 transition-all duration-300">
                  FICHA TÉCNICA <MousePointer2 className="h-3 w-3" />
                </div>
              </div>
            </motion.div>
          ))}
        </motion.div>

        {/* CTA con Diseño Sobrio */}
        <motion.div 
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          className="mt-16 flex flex-col items-center gap-6"
        >
          <div className="h-px w-24 bg-slate-200" />
          <Link 
            href="/#cotizador" 
            className="flex items-center gap-4 text-[#1A3A52] hover:text-[#E85D04] transition-colors"
          >
            <span className="text-xs font-black uppercase tracking-[0.3em]">Iniciar nueva cotización</span>
            <div className="h-10 w-10 rounded-full border border-slate-200 flex items-center justify-center hover:border-[#E85D04] transition-colors">
              <Camera className="h-4 w-4" />
            </div>
          </Link>
        </motion.div>
      </div>
    </section>
  );
}
