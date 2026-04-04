"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { MapPin, MousePointer2, Star, Loader2 } from "lucide-react";
import Image from "next/image";
import { portfolioApi, PortfolioProject } from "@/lib/supabase"; // 👈 Conexión a tu BD

// Función inteligente para mantener el diseño "Bento Grid" dinámico
const getGridSpan = (index: number) => {
  const patterns = [
    "md:col-span-2 md:row-span-2", // El 1ro es grande
    "md:col-span-1 md:row-span-1", // El 2do es normal
    "md:col-span-1 md:row-span-2", // El 3ro es vertical
    "md:col-span-1 md:row-span-1", // Normal
    "md:col-span-1 md:row-span-1", // Normal
  ];
  return patterns[index % patterns.length];
};

export function PortfolioSection() {
  const [projects, setProjects] = useState<PortfolioProject[]>([]);
  const [loading, setLoading] = useState(true);

  // 1. EL MOTOR: Busca tus fotos en Supabase apenas entra el cliente
  useEffect(() => {
    const fetchProjects = async () => {
      const { data, error } = await portfolioApi.getProjects();
      if (data && !error) {
        setProjects(data);
      }
      setLoading(false);
    };
    fetchProjects();
  }, []);

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
        
        {/* Header Elegante */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-12 mb-16">
          <div className="max-w-2xl">
            <div className="flex items-center gap-3 mb-4">
              <div className="h-[1px] w-8 bg-[#E85D04]" />
              <span className="text-[10px] font-black uppercase tracking-[0.4em] text-[#E85D04]">Exhibición Técnica</span>
            </div>
            <h2 className="text-4xl md:text-6xl font-heading font-black text-[#1A3A52] tracking-tighter leading-tight">
              Instalaciones Reales <span className="text-[#E85D04]">VILKMET.</span>
            </h2>
            <p className="mt-4 text-sm text-slate-600">
              {loading ? "Cargando proyectos..." : `${projects.length} proyectos ejecutados con precisión milimétrica`}
            </p>
          </div>
          <p className="text-sm md:text-base text-slate-500 font-medium max-w-xs border-l border-slate-200 pl-6 leading-relaxed italic">
            &ldquo;Cada captura es testimonio de nuestra precisión, plomo y escuadra garantizada.&rdquo;
          </p>
        </div>
        
        {/* Grilla Dinámica */}
        {loading ? (
          // Estado de carga elegante
          <div className="flex flex-col items-center justify-center py-20 text-[#1A3A52]">
            <Loader2 className="h-10 w-10 animate-spin mb-4" />
            <p className="text-sm font-bold tracking-widest uppercase">Conectando con Supabase...</p>
          </div>
        ) : projects.length === 0 ? (
          // Mensaje si no hay fotos aún
          <div className="text-center py-20 border-2 border-dashed border-slate-300 rounded-3xl">
            <p className="text-slate-500">Aún no hay proyectos cargados. Ve al panel de Admin para subir el primero.</p>
          </div>
        ) : (
          <motion.div 
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
            className="grid grid-cols-1 md:grid-cols-3 gap-6 auto-rows-[300px]"
          >
            {projects.map((project, index) => {
              const isFeatured = index === 0; // El último trabajo subido siempre es el "Destacado"
              const gridSpan = getGridSpan(index); // Le asigna un tamaño en la grilla

              return (
                <motion.div 
                  key={project.id} 
                  variants={itemVariants}
                  className={`group relative overflow-hidden rounded-3xl bg-slate-100 border border-slate-200/50 transition-all duration-500 ${gridSpan}`}
                >
                  {/* 2. EL MARCO PERFECTO: Imagen Nítida y Encajada */}
                  <div className="absolute inset-0 bg-slate-100 p-4 flex items-center justify-center">
                    <Image 
                      src={project.image_url} 
                      alt={project.title} 
                      fill
                      sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                      className="object-contain transition-transform duration-700 group-hover:scale-105"
                      quality={95}
                      priority={index < 3}
                    />
                  </div>
                  
                  {/* Overlay oscuro */}
                  <div className="absolute inset-0 bg-gradient-to-t from-[#1A3A52]/90 via-[#1A3A52]/20 to-transparent opacity-40 group-hover:opacity-80 transition-opacity duration-300 pointer-events-none" />

                  {/* Etiquetas */}
                  <div className="absolute top-4 left-4 flex flex-col gap-2 z-10 pointer-events-none">
                    {isFeatured && (
                      <div className="px-3 py-1 bg-[#E85D04] rounded-lg shadow-lg flex items-center gap-1">
                        <Star className="h-2 w-2 text-white" />
                        <span className="text-[9px] font-black uppercase tracking-widest text-white">NUEVO</span>
                      </div>
                    )}
                    <div className="px-3 py-1 bg-white/90 backdrop-blur-sm rounded-lg shadow-lg">
                      <span className="text-[9px] font-black uppercase tracking-widest text-[#1A3A52]">REALIDAD</span>
                    </div>
                  </div>

                  {/* Textos y Datos traídos de Supabase */}
                  <div className="absolute inset-x-0 bottom-0 p-6 flex flex-col justify-end min-h-[50%] z-10 pointer-events-none">
                    <div className="flex items-center gap-2 mb-2 text-white/70">
                      <MapPin className="h-3 w-3 text-[#E85D04]" />
                      <span className="text-[9px] font-black uppercase tracking-widest leading-none">{project.location}</span>
                      <span className="text-[8px] text-white/50 font-bold uppercase ml-2">{project.type}</span>
                    </div>
                    <h3 className="text-xl font-heading font-black text-white mb-1 leading-tight tracking-tight">
                      {project.title}
                    </h3>
                    <p className="text-[11px] text-white/50 font-bold uppercase tracking-tight opacity-0 group-hover:opacity-100 transition-opacity duration-300 line-clamp-2">
                      {project.description}
                    </p>
                    
                    <div className="mt-4 flex items-center gap-2 text-[#E85D04] font-black text-[9px] uppercase tracking-widest opacity-0 group-hover:opacity-100 transition-all duration-300">
                      VER DETALLES <MousePointer2 className="h-3 w-3" />
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </motion.div>
        )}

        {/* Botón Inferior */}
        <div className="mt-16 pt-8 border-t border-slate-200 flex flex-col md:flex-row justify-between items-center">
          <div className="text-center md:text-left">
            <p className="text-sm text-slate-600">
              ¿Tienes un proyecto similar? <span className="text-[#E85D04] font-bold">Cotízalo ahora</span> con nuestro cotizador digital.
            </p>
          </div>
          <div className="mt-4 md:mt-0">
            <a 
              href="#cotizador" 
              className="px-6 py-3 bg-[#1A3A52] text-white text-sm font-bold uppercase tracking-widest rounded-2xl hover:bg-[#E85D04] transition-all"
            >
              INICIAR COTIZACIÓN
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}