import { prisma } from "@/lib/prisma";
import { Phone, Clock, LayoutTemplate, Trash2, CheckCircle2, TrendingUp, Users, DollarSign, MessageSquare } from "lucide-react";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { updateLeadStatus, updateLeadNotes, deleteLead } from "./acciones";

// Tipado estricto para evitar fallos de renderizado
interface Quote {
  id: string;
  linea: string;
  tipologia: string;
  precioFinal: number | string;
  ancho: number;
  alto: number;
  color: string;
  acristalamiento: string;
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
    // 1. Obtención de datos
    const rawLeads = await prisma.lead.findMany({
      include: { quotes: true },
      orderBy: { fechaAlta: "desc" }
    });
    
    leads = (rawLeads as unknown as Lead[]) || [];
    params = await prisma.systemParameter.findMany() || [];
    
    // 2. Procesamiento de Lógica fuera del JSX
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

  // Si hubo un error catastrófico, mostramos una interfaz de emergencia limpia
  if (errorMsg) {
    return (
      <div className="p-10 bg-red-50 rounded-3xl border border-red-200">
        <h2 className="text-red-800 font-bold uppercase">Consola en Mantenimiento Ténico</h2>
        <p className="text-red-600 text-sm mt-2">{errorMsg}</p>
        <a href="/admin/debug" className="mt-4 inline-block text-blue-500 underline text-xs">Ver diagnóstico técnico</a>
      </div>
    );
  }

  return (
    <div className="space-y-8 pb-20">
      {/* Header Visual Elite */}
      <div className="relative p-8 rounded-[2rem] bg-[#1A3A52] overflow-hidden shadow-2xl border border-white/10">
        <div className="relative z-10 flex flex-col md:flex-row justify-between items-start md:items-center gap-6 text-white">
          <div>
            <h2 className="text-3xl font-black uppercase tracking-widest leading-none">
              Embudo <span className="text-[#E85D04]">Estratégico</span>
            </h2>
            <p className="opacity-40 text-[10px] font-bold mt-2 uppercase tracking-[0.2em]">VILKMET Management Elite v1.2</p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-10 relative z-10">
          <StatCard title="Prospectos" value={totalLeads.toString()} icon={<Users className="w-3 h-3" />} />
          <StatCard title="Pipeline Bruto" value={`$${pipelineValue.toLocaleString("es-AR")}`} icon={<DollarSign className="w-3 h-3 text-[#E85D04]" />} />
          <StatCard title="Utilidad Proyectada" value={`$${netValue.toLocaleString("es-AR")}`} icon={<TrendingUp className="w-3 h-3 text-green-400" />} highlight />
        </div>
      </div>

      {/* Listado de Prospectos corregido */}
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-8">
        {leads.length > 0 ? (
          leads.map(lead => (
            <LeadManagementCard key={lead.id} lead={lead} />
          ))
        ) : (
          <div className="col-span-full text-center py-20 bg-white rounded-[3rem] border border-slate-100">
            <p className="text-slate-400 font-bold uppercase text-xs tracking-widest">Sin actividad comercial hoy</p>
          </div>
        )}
      </div>
    </div>
  );
}

function StatCard({ title, value, icon, highlight = false }: { title: string, value: string, icon: React.ReactNode, highlight?: boolean }) {
  return (
    <Card className={`${highlight ? "bg-[#E85D04]" : "bg-white/5"} border-none text-white shadow-lg`}>
      <CardHeader className="pb-1">
        <div className="flex items-center gap-2">
          {icon}
          <span className={`text-[9px] font-black uppercase tracking-widest ${highlight ? "opacity-100" : "opacity-40"}`}>{title}</span>
        </div>
      </CardHeader>
      <CardContent>
        <span className="text-3xl font-black">{value}</span>
      </CardContent>
    </Card>
  );
}

function LeadManagementCard({ lead }: { lead: Lead }) {
  const leadIdShort = lead.id.toString().split("-")[0] || "---";

  return (
    <Card className="rounded-[2.5rem] overflow-hidden border-none shadow-xl bg-white p-8 hover:shadow-2xl transition-all duration-300">
      <div className="flex justify-between items-start mb-6">
        <div>
          <h4 className="text-2xl font-black text-[#1A3A52] uppercase tracking-tight">{lead.nombre || "Sin Nombre"}</h4>
          <span className="text-[10px] font-black text-slate-300 uppercase tracking-widest">Ref: {leadIdShort}</span>
        </div>
        <div className="bg-[#1A3A52] text-white px-4 py-1 rounded-full text-[10px] font-black uppercase">
          {lead.status || "NUEVO"}
        </div>
      </div>

      <div className="flex flex-wrap gap-3 mb-8">
        <a 
          href={`https://wa.me/${lead.whatsapp?.replace(/\D/g, "")}`} 
          target="_blank" 
          className="flex items-center gap-2 px-6 py-3 bg-green-50 text-green-600 rounded-xl text-[10px] font-black uppercase border border-green-100"
        >
          <Phone className="w-4 h-4" /> WhatsApp
        </a>
        <div className="flex-1">
          <StatusSelector leadId={lead.id} currentStatus={lead.status || ""} />
        </div>
      </div>

      <div className="space-y-4">
        {(lead.quotes || []).map((quote) => (
          <div key={quote.id} className="bg-slate-50 p-6 rounded-2xl border border-slate-100">
            <div className="flex justify-between items-center">
              <div className="space-y-1">
                <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest">{quote.linea}</span>
                <p className="font-black text-primary uppercase text-sm">{quote.tipologia}</p>
              </div>
              <span className="font-black text-[#E85D04] text-lg">
                ${Number(quote.precioFinal || 0).toLocaleString("es-AR")}
              </span>
            </div>
          </div>
        ))}
      </div>

      <div className="mt-8 pt-6 border-t border-slate-50">
        <h5 className="text-[9px] font-black uppercase tracking-widest text-slate-300 flex items-center gap-2 mb-4">
          <MessageSquare className="w-3 h-3" /> Notas de Gestión
        </h5>
        <NotesInput leadId={lead.id} initialNotes={lead.adminNotes || ""} />
      </div>
    </Card>
  );
}

async function StatusSelector({ leadId, currentStatus }: { leadId: string, currentStatus: string }) {
  return (
    <form action={async (formData) => { "use server"; await updateLeadStatus(leadId, formData.get("status") as string); }}>
      <select 
        name="status"
        defaultValue={currentStatus || "NUEVO"}
        onChange={(e) => e.target.form?.requestSubmit()}
        className="w-full bg-slate-50 border-none px-6 py-3 rounded-xl text-[10px] font-black uppercase text-[#1A3A52] outline-none cursor-pointer"
      >
        <option value="NUEVO">NUEVO</option>
        <option value="CONTACTADO">CONTACTADO</option>
        <option value="PRESUPUESTADO">PRESUPUESTADO</option>
        <option value="VENDIDO">🏆 VENDIDO</option>
        <option value="PERDIDO">⚠️ PERDIDO</option>
      </select>
    </form>
  );
}

async function NotesInput({ leadId, initialNotes }: { leadId: string, initialNotes: string }) {
  return (
    <form action={async (formData) => { "use server"; await updateLeadNotes(leadId, formData.get("notes") as string); }}>
      <textarea 
        name="notes"
        defaultValue={initialNotes}
        placeholder="Añadir notas..."
        onBlur={(e) => e.target.form?.requestSubmit()}
        className="w-full bg-slate-50 border-none p-4 rounded-xl text-sm text-primary/70 focus:ring-1 ring-[#1A3A52]/10 outline-none resize-none min-h-[80px]"
      />
    </form>
  );
}
