import { Button } from "@/components/ui/button";
import { ArrowDown, CheckCircle2 } from "lucide-react";
import Link from "next/link";
import * as motion from "framer-motion/client";

export function HeroSection() {
  return (
    <section className="relative overflow-hidden bg-background pt-24 pb-32 sm:pt-32 sm:pb-40">
      <div className="absolute inset-x-0 -top-40 -z-10 transform-gpu overflow-hidden blur-3xl sm:-top-80">
        <div className="relative left-[calc(50%-11rem)] aspect-[1155/678] w-[36.125rem] -translate-x-1/2 rotate-[30deg] bg-gradient-to-tr from-primary to-accent opacity-20 sm:left-[calc(50%-30rem)] sm:w-[72.1875rem]" style={{ clipPath: "polygon(74.1% 44.1%, 100% 61.6%, 97.5% 26.9%, 85.5% 0.1%, 80.7% 2%, 72.5% 32.5%, 60.2% 62.4%, 52.4% 68.1%, 47.5% 58.3%, 45.2% 34.5%, 27.5% 76.7%, 0.1% 64.9%, 17.9% 100%, 27.6% 76.8%, 76.1% 97.7%, 74.1% 44.1%)" }} />
      </div>

      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <div className="mx-auto max-w-2xl text-center">
          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="text-4xl font-bold tracking-tight text-primary sm:text-6xl font-heading"
          >
            ABERTURAS QUE <span className="text-accent underline decoration-4 underline-offset-8">PROTEGEN</span><br/>Y EMBELLECEN TU ESPACIO
          </motion.h1>
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="mt-6 text-lg leading-8 text-muted-foreground"
          >
            Años de experiencia transformando espacios y refaccionando inmuebles. Perfiles Aluar y accesorios importados para máxima durabilidad técnica y estética premium.
          </motion.p>
          
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.4 }}
            className="mt-10 flex items-center justify-center gap-x-6"
          >
            <Button size="lg" className="bg-accent hover:bg-accent/90 text-white font-semibold text-base py-6 px-8 shadow-xl shadow-accent/20 transition-all hover:scale-105">
              <Link href="#cotizador">Obtener Presupuesto Dinámico</Link>
            </Button>
            <Link href="#galeria" className="text-sm font-semibold leading-6 text-foreground hover:text-primary transition-colors gap-2 flex items-center group">
              Ver proyectos <span aria-hidden="true" className="group-hover:translate-x-1 transition-transform">→</span>
            </Link>
          </motion.div>

          <div className="mt-14 max-w-lg mx-auto grid grid-cols-2 gap-x-8 gap-y-6 sm:grid-cols-2 lg:max-w-none">
             <div className="flex gap-x-3 text-sm leading-6 justify-center">
                <CheckCircle2 className="h-6 w-5 flex-none text-accent" />
                <span className="text-muted-foreground whitespace-nowrap">Extrusión 100% Primera Calidad</span>
             </div>
             <div className="flex gap-x-3 text-sm leading-6 justify-center">
                <CheckCircle2 className="h-6 w-5 flex-none text-accent" />
                <span className="text-muted-foreground whitespace-nowrap">Aislamiento Térmico y Acústico</span>
             </div>
          </div>
        </div>
      </div>
    </section>
  );
}
