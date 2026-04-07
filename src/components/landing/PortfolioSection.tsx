"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { MapPin, ArrowRight, X } from "lucide-react";
import Image from "next/image";
import { Button } from "@/components/ui/button";

// Datos de ejemplo para el portfolio
const projects = [
  {
    id: 1,
    title: "Ventanal DVH Premium",
    location: "Canning, Buenos Aires",
    category: "Residencial",
    image: "https://images.unsplash.com/photo-1505691938895-1758d7eaa511?q=80&w=2070&auto=format&fit=crop",
    description: "Instalación de aberturas Serie Modena con Doble Vidriado Hermético para máxima eficiencia térmica."
  },
  {
    id: 2,
    title: "Fachada Comercial A40",
    location: "Puerto Madero, CABA",
    category: "Comercial",
    image: "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?q=80&w=2070&auto=format&fit=crop",
    description: "Sistema de alta prestación A40 anodizado natural para locales de alto tránsito."
  },
  {
    id: 3,
    title: "Puerta Balcón Minimalista",
    location: "Nordelta, Tigre",
    category: "Residencial",
    image: "https://images.unsplash.com/photo-1600607687920-4e2a09cf159d?q=80&w=2070&auto=format&fit=crop",
    description: "Cierre hermético y perfiles ultra delgados para integrar el interior con la terraza."
  }
];

export function PortfolioSection() {
  const [selectedId, setSelectedId] = useState<number | null>(null);

  const selectedProject = projects.find(p => p.id === selectedId);

  // Función para bajar al cotizador suavemente
  const scrollToCotizador = () => {
    const element = document.getElementById('sistema-cotizador');
    if (element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  return (
    <section id="galeria" className="py-24 bg-white">
      <div className="container mx-auto px-6">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-6">
          <div>
            <h2 className="text-4xl font-heading font-black text-[#1A3A52] uppercase tracking-tighter sm:text-5xl">
              Instalaciones <span className="text-[#E85D04]">Reales.</span>
            </h2>
            <p className="text-gray-500 mt-4 max-w-xl font-medium">
              Explore nuestros últimos proyectos ejecutados con sistemas Aluar de alta prestación. Calidad certificada en obra.
            </p>
          </div>
          
          <div className="flex flex-col sm:flex-row items-center gap-4 bg-slate-50 p-4 rounded-2xl border border-slate-100">
            <p className="text-sm font-bold text-[#1A3A52]">¿Tienes un proyecto similar?</p>
            {/* BOTÓN REPARADO */}
            <Button 
              onClick={scrollToCotizador}
              className="bg-[#1A3A52] hover:bg-[#E85D04] text-white font-black uppercase text-[10px] tracking-widest px-6 h-12 rounded-xl transition-all w-full sm:w-auto"
            >
              INICIAR COTIZACIÓN
            </Button>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {projects.map((project) => (
            <motion.div
              key={project.id}
              layoutId={`card-${project.id}`}
              onClick={() => setSelectedId(project.id)}
              className="group relative cursor-pointer overflow-hidden rounded-[2rem] bg-slate-200 aspect-[4/5]"
              whileHover={{ y: -10 }}
            >
              <Image
                src={project.image}
                alt={project.title}
                fill
                className="object-cover transition-transform duration-500 group-hover:scale-110"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#1A3A52] via-transparent to-transparent opacity-80" />
              
              <div className="absolute bottom-0 left-0 right-0 p-8 text-white">
                <div className="flex items-center gap-2 mb-2">
                  <MapPin className="h-3 w-3 text-[#E85D04]" />
                  <span className="text-[10px] font-black uppercase tracking-widest text-white/70">{project.location}</span>
                </div>
                <h3 className="text-2xl font-black uppercase tracking-tighter leading-tight">{project.title}</h3>
                <div className="mt-4 flex items-center gap-2 text-[#E85D04] font-black text-[10px] uppercase tracking-widest opacity-0 group-hover:opacity-100 transition-opacity">
                  Ver Detalles <ArrowRight className="h-3 w-3" />
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        <AnimatePresence>
          {selectedId && selectedProject && (
            <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6">
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                onClick={() => setSelectedId(null)}
                className="absolute inset-0 bg-[#1A3A52]/90 backdrop-blur-md"
              />
              
              <motion.div
                layoutId={`card-${selectedId}`}
                className="relative w-full max-w-4xl bg-white rounded-[3rem] overflow-hidden shadow-2xl"
              >
                <button 
                  onClick={() => setSelectedId(null)}
                  className="absolute top-6 right-6 z-10 bg-white/20 hover:bg-white/40 p-3 rounded-full backdrop-blur-md transition-colors"
                >
                  <X className="h-6 w-6 text-white" />
                </button>

                <div className="grid md:grid-cols-2">
                  <div className="relative h-64 md:h-auto">
                    <Image
                      src={selectedProject.image}
                      alt={selectedProject.title}
                      fill
                      className="object-cover"
                    />
                  </div>
                  <div className="p-8 md:p-12 flex flex-col justify-center">
                    <span className="text-[#E85D04] font-black uppercase tracking-[0.2em] text-[10px] mb-4 block">Proyecto Finalizado</span>
                    <h3 className="text-4xl font-black text-[#1A3A52] uppercase tracking-tighter leading-none mb-6">
                      {selectedProject.title}
                    </h3>
                    <div className="flex items-center gap-2 mb-8">
                      <MapPin className="h-4 w-4 text-slate-400" />
                      <span className="text-slate-500 font-bold">{selectedProject.location}</span>
                    </div>
                    <p className="text-gray-600 leading-relaxed text-lg mb-10">
                      {selectedProject.description}
                    </p>
                    {/* BOTÓN INTERNO DE LA FOTO REPARADO TAMBIÉN */}
                    <Button 
                      onClick={() => {
                        setSelectedId(null);
                        setTimeout(scrollToCotizador, 300);
                      }}
                      className="w-full h-16 rounded-2xl bg-[#E85D04] hover:bg-[#1A3A52] text-white font-black uppercase text-xs tracking-widest transition-all"
                    >
                      COTIZAR SISTEMA SIMILAR
                    </Button>
                  </div>
                </div>
              </motion.div>
            </div>
          )}
        </AnimatePresence>
      </div>
    </section>
  );
}