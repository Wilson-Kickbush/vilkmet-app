import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ShieldCheck, ThermometerSnowflake, Zap, Activity } from "lucide-react";

export function EducationSection() {
  const lineas = [
    {
      title: "Línea Herrero",
      desc: "Eficiencia económica comprobada. Ideal para proyectos de inversión y presupuestos ajustados. Resistente y de mantenimiento casi nulo.",
      icon: <Activity className="h-6 w-6 text-accent" />,
      features: ["Corredizas", "Paño Fijo", "Vidrio Simple"]
    },
    {
      title: "Línea Módena",
      desc: "El estándar de oro en Argentina. Equilibrio perfecto entre solidez técnica y valor accesible para viviendas residenciales.",
      icon: <ShieldCheck className="h-6 w-6 text-accent" />,
      features: ["Alta Hermeticidad", "Cámaras de Agua", "Soporta DVH"]
    },
    {
      title: "A40 Compact",
      desc: "Diseño minimalista coplanar. Perfiles esbeltos que maximizan la entrada de luz sin sacrificar un gramo de resistencia estructural.",
      icon: <Zap className="h-6 w-6 text-accent" />,
      features: ["Estética Coplanar", "Grandes Luces", "DVH Standard"]
    },
    {
      title: "A40 RPT",
      desc: "Aislamiento superior con Ruptura de Puente Térmico (RPT). Ahorra gas y electricidad aislando tu casa del clima exterior.",
      icon: <ThermometerSnowflake className="h-6 w-6 text-accent" />,
      features: ["Ahorro Energético", "Cero Condensación", "Premium"]
    }
  ];

  return (
    <section id="lineas" className="py-24 bg-secondary">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <div className="mx-auto max-w-2xl lg:text-center">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white border-2 border-accent/20 mb-8 shadow-sm">
            <ShieldCheck className="h-4 w-4 text-accent" />
            <span className="text-[10px] font-black uppercase tracking-[0.2em] text-primary">Perfiles ALUAR de Primera & Certificados</span>
          </div>
          <h2 className="text-base font-semibold leading-7 text-accent tracking-widest uppercase">Tecnología en cada perfil</h2>
          <p className="mt-2 text-3xl font-bold tracking-tight text-primary sm:text-4xl font-heading">
            Sistemas que se adaptan a tu exigencia
          </p>
          <p className="mt-4 text-lg leading-8 text-muted-foreground">
            Desde la robustez económica hasta el máximo aislamiento termoacústico, desarrollamos cerramientos a la medida de tu confort utilizando <span className="text-primary font-bold italic">perfiles Aluar de primera calidad con certificación oficial.</span>
          </p>
        </div>
        <div className="mx-auto mt-12 max-w-2xl sm:mt-16 lg:mt-20 lg:max-w-none">
          <dl className="grid max-w-xl grid-cols-1 gap-x-8 gap-y-16 lg:max-w-none lg:grid-cols-4">
            {lineas.map((linea) => (
              <Card key={linea.title} className="flex flex-col border-none shadow-lg hover:shadow-xl transition-shadow bg-background">
                <CardHeader>
                  <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-lg bg-secondary">
                    {linea.icon}
                  </div>
                  <CardTitle className="text-xl font-heading text-primary">{linea.title}</CardTitle>
                </CardHeader>
                <CardContent className="flex flex-col flex-1">
                  <p className="text-base leading-7 text-muted-foreground mb-6 flex-1">
                    {linea.desc}
                  </p>
                  <ul className="space-y-2 mt-auto">
                    {linea.features.map(f => (
                      <li key={f} className="text-sm font-medium text-primary flex items-center">
                        <span className="w-1.5 h-1.5 bg-accent rounded-full mr-2"></span> {f}
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
            ))}
          </dl>
        </div>
      </div>
    </section>
  );
}
