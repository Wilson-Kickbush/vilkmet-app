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
      transition: { staggerChildren: 0.15 }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 30, scale: 0.95 },
    visible: { 
      opacity: 1, 
      y: 0, 
      scale: 1,
      transition: { duration: 0.6, ease: "easeOut" }
    }
  };

  return (
    <section id="galeria" className="py-32 bg-[#F8FAFC] overflow-hidden">
      <div className="container mx-auto px-6 lg:px-8">
        {/* Header de Exhibición */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-8 mb-20">
          <div className="max-w-3xl">
            <div className="flex items-center gap-3 mb-6">
              <div className="h-[2px] w-12 bg-[#E85D04]" />
              <span className="text-xs font-black uppercase tracking-[0.3em] text-[#E85D04]">Exhibición Técnica</span>
            </div>
            <h2 className="text-6xl md:text-8xl font-heading font-black text-[#1A3A52] tracking-tighter leading-[0.85]">
              INSTALACIONES <br />
              REALES <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#1A3A52]/20 to-[#1A3A52]/60">VILKMET.</span>
            </h2>
          </div>
          <p className="text-base md:text-lg text-slate-500 font-medium max-w-sm border-l-2 border-slate-200 pl-8 leading-relaxed italic">
            &ldquo;Cada captura es testimonio de nuestra precisión, plomo y escuadra garantizada por contrato.&rdquo;
          </p>
        </div>
        
        {/* Bento Grid Exhibit */}
        <motion.div 
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          className="grid grid-cols-1 md:grid-cols-3 gap-8 auto-rows-[350px]"
        >
          {projects.map((project, i) => (
            <motion.div 
              key={i} 
              variants={itemVariants}
              className={`group relative overflow-hidden rounded-[3rem] bg-white border border-slate-100 shadow-sm hover:shadow-3xl transition-all duration-700 ${project.span}`}
            >
              {/* Imagen con Optimización de Nitidez */}
              <img 
                src={project.src} 
                alt={project.title} 
                className="absolute inset-0 h-full w-full object-cover object-top transition-transform duration-1000 group-hover:scale-105 will-change-transform"
                loading="lazy"
              />
              
              {/* Overlay Gradiente */}
              <div className="absolute inset-0 bg-gradient-to-t from-[#1A3A52] via-[#1A3A52]/20 to-transparent opacity-60 group-hover:opacity-90 transition-opacity duration-500" />

              {/* Badge si es obra real */}
              {project.badge && (
                <div className="absolute top-6 left-6 px-4 py-1.5 bg-[#E85D04] rounded-full flex items-center gap-2 shadow-lg shadow-orange-500/20">
                  <Camera className="h-3 w-3 text-white" />
                  <span className="text-[10px] font-black uppercase tracking-widest text-white">{project.badge}</span>
                </div>
              )}

              {/* Contenido flotante */}
              <div className="absolute inset-x-0 bottom-0 p-8 transform translate-y-4 group-hover:translate-y-0 transition-transform duration-500">
                <div className="flex items-center gap-2 mb-3 text-white/50">
                  <MapPin className="h-3 w-3 text-[#E85D04]" />
                  <span className="text-[10px] font-black uppercase tracking-widest">{project.location}</span>
                </div>
                <h3 className="text-2xl font-heading font-black text-white mb-2 leading-tight">
                  {project.title}
                </h3>
                <p className="text-xs text-white/60 font-medium opacity-0 group-hover:opacity-100 transition-opacity duration-500 delay-100">
                  {project.desc}
                </p>
                
                <div className="mt-6 flex items-center gap-2 text-[#E85D04] font-black text-[10px] uppercase tracking-widest opacity-0 group-hover:opacity-100 translate-y-4 group-hover:translate-y-0 transition-all duration-500 delay-200">
                  Ver Detalles Técnicos <MousePointer2 className="h-3 w-3" />
                </div>
              </div>
            </motion.div>
          ))}
        </motion.div>

        {/* CTA Inferior para cierre de brecha narrativa */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          className="mt-20 flex flex-col items-center justify-center p-12 rounded-[5rem] bg-[#1A3A52] text-center relative overflow-hidden"
        >
          <div className="absolute top-0 right-0 -translate-y-1/2 translate-x-1/4 w-[400px] h-[400px] bg-[#E85D04]/10 rounded-full blur-[100px]" />
          <h4 className="text-3xl text-white font-heading font-black mb-6">¿Desea una obra con este nivel de terminación?</h4>
          <Link 
            href="/#cotizador" 
            className="px-12 h-16 bg-[#E85D04] hover:bg-[#F96D0C] text-white rounded-full flex items-center justify-center font-black uppercase text-xs tracking-widest transition-all shadow-xl shadow-orange-500/20 active:scale-95"
          >
            SÍ, QUIERO MI PRESUPUESTO PERSONALIZADO
          </Link>
        </motion.div>
      </div>
    </section>
  );
}
