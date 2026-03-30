export function PortfolioSection() {
  const images = [
    { src: "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80", span: "row-span-2 col-span-2", alt: "Cerramiento A40 RPT Moderno" },
    { src: "https://images.unsplash.com/photo-1600566753086-00f18efc2291?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80", span: "col-span-1", alt: "Ventanal Módena" },
    { src: "https://images.unsplash.com/photo-1628003632940-d6215b3c533f?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80", span: "row-span-2 col-span-1", alt: "Puerta de Abrir" },
    { src: "https://images.unsplash.com/photo-1513694203232-719a280e022f?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80", span: "col-span-1", alt: "DVH en línea Herrero" },
    { src: "https://images.unsplash.com/photo-1545042746-8dd336ebaf9a?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80", span: "col-span-2", alt: "Galería exterior con aberturas" },
  ];

  return (
    <section id="galeria" className="py-24 bg-background">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <div className="mx-auto max-w-2xl text-center">
          <h2 className="text-3xl font-bold tracking-tight text-primary sm:text-4xl font-heading">Portafolio Fotográfico</h2>
          <p className="mt-2 text-lg leading-8 text-muted-foreground">
            Instalaciones reales. Precisión, plomo y escuadra garantizada por <span className="text-accent font-semibold">VILKMET</span>.
          </p>
        </div>
        
        <div className="mt-16 sm:mt-20">
          {/* MASONRY GRID MOCKUP EN CSS GRID */}
          <div className="grid grid-cols-2 md:grid-cols-3 grid-rows-none md:grid-rows-4 gap-4 auto-rows-[200px]">
            {images.map((img, i) => (
              <div key={i} className={`relative overflow-hidden rounded-xl bg-muted ${img.span} group`}>
                <img 
                  src={img.src} 
                  alt={img.alt} 
                  className="absolute inset-0 h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-primary/80 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end p-6">
                  <span className="text-white font-semibold font-heading">{img.alt}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
