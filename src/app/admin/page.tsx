import { PrismaClient } from "@prisma/client";
import { format } from "date-fns";
import { es } from "date-fns/locale";
import { Phone, Mail, Clock, LayoutTemplate } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const prisma = new PrismaClient({ accelerateUrl: process.env.DATABASE_URL || "prisma://dummy.com/?api_key=123" } as any);

// Revalidate on every request since it's an admin dashboard
export const dynamic = "force-dynamic";

export default function AdminDashboard() {
  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center">
        <div>
          <h2 className="text-3xl font-heading font-bold text-primary">Embudo de Ventas</h2>
          <p className="text-muted-foreground mt-1">Gestión de prospectos (leads) ingresados vía cotizador web.</p>
        </div>
      </div>

      <div className="grid gap-6">
        <LeadList />
      </div>
    </div>
  );
}

async function LeadList() {
  const leads = await prisma.lead.findMany({
    include: { quotes: true },
    orderBy: { fechaAlta: "desc" }
  });

  if (leads.length === 0) {
    return (
      <div className="text-center py-20 bg-white rounded-xl border border-dashed">
        <h3 className="text-xl font-medium text-muted-foreground">Aún no hay cotizaciones</h3>
        <p className="text-sm mt-2 text-muted-foreground/60">Los leads aparecerán aquí automáticamente.</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
      {leads.map(lead => (
        <Card key={lead.id} className="hover:shadow-lg transition-shadow border-t-4 border-t-accent">
          <CardHeader className="pb-3 border-b bg-secondary/30">
            <div className="flex justify-between items-start">
              <div>
                <CardTitle className="text-lg font-bold text-primary uppercase">{lead.nombre}</CardTitle>
                <div className="text-xs text-muted-foreground flex items-center gap-1 mt-1">
                  <Clock className="w-3 h-3" />
                  {format(new Date(lead.fechaAlta), "PPP 'a las' HH:mm", { locale: es })}
                </div>
              </div>
            </div>
            <div className="flex flex-col gap-2 mt-4 text-sm font-medium">
              <a href={`https://wa.me/${lead.whatsapp.replace(/\D/g, '')}?text=Hola%20${lead.nombre},%20somos%20de%20Vilkmet.%20Recibimos%20tu%20cotización.`} target="_blank" rel="noreferrer" className="flex items-center gap-2 text-accent hover:underline">
                <Phone className="w-4 h-4" /> {lead.whatsapp}
              </a>
              {lead.email && (
                <a href={`mailto:${lead.email}`} className="flex items-center gap-2 text-primary hover:underline">
                  <Mail className="w-4 h-4" /> {lead.email}
                </a>
              )}
            </div>
          </CardHeader>
          <CardContent className="pt-4 bg-white space-y-4">
            {lead.quotes.map(quote => (
              <div key={quote.id} className="bg-slate-50 border p-3 rounded-lg">
                <div className="flex justify-between font-bold text-primary border-b pb-2 mb-2 text-sm">
                  <span className="flex items-center gap-2"><LayoutTemplate className="w-4 h-4 text-accent"/> {quote.linea}</span>
                  <span className="text-lg">${quote.precioFinal.toLocaleString("es-AR")}</span>
                </div>
                <div className="grid grid-cols-2 gap-2 text-xs text-muted-foreground mt-2">
                  <div><strong>Tipología:</strong> <span className="capitalize">{quote.tipologia}</span></div>
                  <div><strong>Color:</strong> <span className="capitalize">{quote.color}</span></div>
                  <div><strong>Medidas:</strong> {quote.ancho} x {quote.alto} mm</div>
                  <div><strong>Vidrio:</strong> <span className="uppercase">{quote.acristalamiento}</span></div>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
