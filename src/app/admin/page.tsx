import { prisma } from "@/lib/prisma";
import { Phone, Users, DollarSign, MessageSquare, TrendingUp, Trash2 } from "lucide-react";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { deleteLead, cleanOldAbandonedCarts } from "./acciones";
import { StatusSelector, NotesInput } from "./ClientComponents";

// Tipado estricto para evitar fallos de renderizado
interface QuoteItem {
  id: string;
  tipo: string;
  linea: string;
  tipologia: string;
  ancho: number;
  alto: number;
  color: string;
  acristalamiento: string;
  subtotal: number;
}

interface Quote {
  id: string;
  linea: string;
  tipologia: string;
  precioFinal: number | string;
  ancho: number;
  alto: number;
  color: string;
  acristalamiento: string;
  items: QuoteItem[];
}

interface Lead {
  id: string;
  nombre: string;
  whatsapp: string;
  status: string | null;
  adminNotes: string | null;
  fechaAlta: Date;
  quotes: Quote[];
}

export const dynamic = "force-dynamic";

export default async function AdminDashboard() {
  let leads: Lead[] = [];
  let params: any[] = [];
  let pipelineValue = 0;
  let netValue = 0;
  let totalLeads = 0;
  let errorMsg: string | null = null;

  try {
    const rawLeads = await prisma.lead.findMany({
      include: { quotes: { include: { items: true } } },
      orderBy: { fechaAlta: "desc" }
    });
    
    leads = (rawLeads as unknown as Lead[]) || [];
    params = await prisma.systemParameter.findMany() || [];
    
    const getParam = (key: string, def: number) => {
      const p = params.find(item => item.clave === key);
      return p ? Number(p.valor) : def;
    };

    const structureMargin = getParam("gastos_administrativos", 5);
    totalLeads = leads.length;
    
    pipelineValue = leads.reduce((acc, lead) => {
      const leadQuotesTotal = (lead.quotes || []).reduce((qAcc, q) => qAcc + (Number(q.precioFinal) || 0), 0);
      return acc + leadQuotesTotal;
    }, 0);

    netValue = pipelineValue * (1 - (structureMargin / 100));

  } catch (err: any) {
    errorMsg = err?.message || "Fallo en la lectura de datos";
  }

  if (errorMsg) {
    return (
      <div className="p-8 bg-red-50 rounded-2xl border border-red-100">
        <h2 className="text-red-800 font-semibold text-lg leading-none">Consola en Mantenimiento</h2>
        <p className="text-red-600 text-sm mt-2">{errorMsg}</p>
        <a href="/admin/debug" className="mt-4 inline-block text-blue-700 underline text-sm">Acceder a Diagnóstico</a>
      </div>
    );
  }

  return (
    <div className="space-y-8 pb-20">
      <div className="relative p-8 rounded-2xl bg-gradient-to-br from-blue-900 via-blue-800 to-blue-700 overflow-hidden shadow-2xl border border-blue-600/30">
        <div className="relative z-10 flex flex-col md:flex-row justify-between items-start md:items-center gap-6 text-white text-center md:text-left">
          <div>
            <h2 className="text-2xl font-bold tracking-tight leading-none">
              Embudo <span className="text-orange-300">Estratégico</span>
            </h2>
            <p className="text-sm text-blue-200 mt-2">VILKMET Elite v1.2</p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-10 relative z-10">
          <StatCard title="Prospectos" value={totalLeads.toString()} icon={<Users className="w-5 h-5 text-blue-300" />} />
          <StatCard title="Pipeline Bruto" value={`$${pipelineValue.toLocaleString("es-AR")}`} icon={<DollarSign className="w-5 h-5 text-orange-300" />} />
          <StatCard title="Utilidad Proyectada" value={`$${netValue.toLocaleString("es-AR")}`} icon={<TrendingUp className="w-5 h-5 text-emerald-300" />} highlight />
        </div>
        <div className="mt-8 text-right">
          <form action={async () => {
            "use server";
            const result = await cleanOldAbandonedCarts();
            if (result.success) {
              // Revalidación automática por revalidatePath en la acción
            }
          }}>
            <button
              type="submit"
              className="inline-flex items-center gap-2 px-4 py-2 bg-white/20 hover:bg-white/30 text-white text-sm font-semibold rounded-lg border border-white/30 transition-colors"
            >
              <Trash2 className="w-4 h-4" />
              Limpiar Carritos Viejos (+30 días)
            </button>
          </form>
        </div>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-2 gap-8">
        {leads.length > 0 ? (
          leads.map(lead => (
            <LeadManagementCard key={lead.id} lead={lead} />
          ))
        ) : (
          <div className="col-span-full text-center py-16 bg-white rounded-2xl border border-slate-200 text-slate-400">
            No hay prospectos activos registrados.
          </div>
        )}
      </div>
    </div>
  );
}

function StatCard({ title, value, icon, highlight = false }: { title: string, value: string, icon: React.ReactNode, highlight?: boolean }) {
  return (
    <Card className={`${highlight ? "bg-gradient-to-br from-orange-500 to-orange-600" : "bg-white/10 backdrop-blur-sm border-white/20"} text-white border shadow-lg`}>
      <CardHeader className="pb-2">
        <div className="flex items-center gap-3">
          <div className={`p-2 rounded-lg ${highlight ? "bg-white/30" : "bg-white/10"}`}>
            {icon}
          </div>
          <span className={`text-xs font-semibold uppercase tracking-wide ${highlight ? "text-white" : "text-blue-100"}`}>{title}</span>
        </div>
      </CardHeader>
      <CardContent>
        <span className="text-3xl font-bold tracking-tight">{value}</span>
      </CardContent>
    </Card>
  );
}

function LeadManagementCard({ lead }: { lead: Lead }) {
  const leadIdShort = lead.id.toString().split("-")[0] || "---";
  
  // Mapeo de colores para el estado
  const statusColors: Record<string, string> = {
    NUEVO: "bg-blue-100 text-blue-800",
    CONTACTADO: "bg-amber-100 text-amber-800",
    PRESUPUESTADO: "bg-purple-100 text-purple-800",
    VENDIDO: "bg-emerald-100 text-emerald-800",
    PERDIDO: "bg-red-100 text-red-800",
    ABANDONADO_PRECOZ: "bg-orange-100 text-orange-800",
    PENDIENTE_CONTACTO: "bg-yellow-100 text-yellow-800",
  };
  const statusClass = statusColors[lead.status || "NUEVO"] || "bg-slate-100 text-slate-800";

  return (
    <Card className="rounded-2xl overflow-hidden border border-slate-200 shadow-md hover:shadow-lg transition-all duration-300 bg-white p-6">
      {/* Encabezado */}
      <div className="flex justify-between items-start mb-6">
        <div>
          <h4 className="text-xl font-bold text-slate-900">{lead.nombre || "Sin Nombre"}</h4>
          <span className="text-xs font-semibold text-slate-500 uppercase tracking-wide">
            REF: {leadIdShort} • {new Date(lead.fechaAlta).toLocaleDateString("es-AR")}
          </span>
        </div>
        <div className={`px-3 py-1 rounded-full text-xs font-semibold uppercase tracking-tight ${statusClass}`}>
          {lead.status || "NUEVO"}
        </div>
      </div>

      {/* Acciones */}
      <div className="flex flex-wrap items-center gap-3 mb-6">
        <a
          href={`https://wa.me/${lead.whatsapp?.replace(/\D/g, "")}`}
          target="_blank"
          className="inline-flex items-center gap-2 px-4 py-2 bg-white border border-emerald-200 text-emerald-700 rounded-lg text-sm font-semibold hover:bg-emerald-50 transition-colors"
        >
          <Phone className="w-4 h-4" />
          WhatsApp
        </a>
        <div className="flex-1 min-w-[200px]">
          <StatusSelector leadId={lead.id} currentStatus={lead.status || ""} />
        </div>
        <form action={async () => { "use server"; await deleteLead(lead.id); }}>
          <button
            type="submit"
            className="p-2 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
            aria-label="Eliminar prospecto"
          >
            <Trash2 className="w-5 h-5" />
          </button>
        </form>
      </div>

      {/* Cotizaciones */}
      <div className="space-y-3 mb-6">
        <h5 className="text-xs font-semibold uppercase tracking-wide text-slate-500">Cotizaciones asociadas</h5>
        {(lead.quotes || []).map((quote) => (
          <div key={quote.id} className="bg-slate-50/70 p-4 rounded-xl border border-slate-100 space-y-2">
            <div className="flex justify-between items-center">
              <span className="font-bold text-blue-700 text-lg">
                ${(Number(quote.precioFinal) || 0).toLocaleString("es-AR")}
              </span>
            </div>
            {(quote.items || []).length > 0 ? (
              <div className="space-y-1">
                {quote.items.map((item) => {
                  const tipo = item.tipo === 'puerta' ? 'Puerta' : 'Ventana';
                  const medidas = `${(item.ancho / 1000).toFixed(2)} × ${(item.alto / 1000).toFixed(2)}m`;
                  const vidrio = item.acristalamiento === 'dvh' ? 'DVH 4-9-4' : item.acristalamiento.toUpperCase();
                  return (
                    <div key={item.id} className="text-xs text-slate-700">
                      <span className="font-semibold">1x</span> {tipo} {item.tipologia} {item.linea} ({medidas}) - {item.color} - {vidrio}
                    </div>
                  );
                })}
              </div>
            ) : (
              <div className="text-xs text-slate-500">No hay detalles de items</div>
            )}
          </div>
        ))}
      </div>

      {/* Notas */}
      <div className="pt-5 border-t border-slate-100">
        <h5 className="text-xs font-semibold uppercase tracking-wide text-slate-500 flex items-center gap-2 mb-3">
          <MessageSquare className="w-4 h-4" />
          Notas de seguimiento
        </h5>
        <NotesInput leadId={lead.id} initialNotes={lead.adminNotes || ""} />
      </div>
    </Card>
  );
}
