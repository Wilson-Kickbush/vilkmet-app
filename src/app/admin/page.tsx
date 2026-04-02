import { prisma } from "@/lib/prisma";
import { format } from "date-fns";
import { es } from "date-fns/locale";
import { Phone, Clock, LayoutTemplate, Trash2, CheckCircle2, TrendingUp, Users, DollarSign, MessageSquare, ShieldCheck } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { updateLeadStatus, updateLeadNotes, deleteLead } from "./acciones";

// Forzar renderizado dinámico para ver cambios en tiempo real
export const dynamic = "force-dynamic";

export default async function AdminDashboard() {
  // 1. Obtención segura de datos y parámetros
  const leads = await prisma.lead.findMany({
    include: { quotes: true },
    orderBy: { fechaAlta: "desc" }
  }) || [];

  const params = await prisma.systemParameter.findMany() || [];
  const getParam = (key: string, def: number) => {
    const p = params.find(item => item.clave === key);
    return p ? p.valor : def;
  };

  // Parámetros comerciales para cálculo de rentabilidad
  const structureMargin = getParam("gastos_administrativos", 5);
  const totalLeads = leads.length;
  
  // 2. Cálculos Financieros Blindados
  const pipelineValue = leads.reduce((acc, lead) => {
    const leadQuotesTotal = (lead.quotes || []).reduce((qAcc, q) => qAcc + (Number(q.precioFinal) || 0), 0);
    return acc + leadQuotesTotal;
  }, 0);

  // Valor neto estimado (restando margen de gastos operativos)
  const netValue = pipelineValue * (1 - (structureMargin / 100));

  const conversionRate = totalLeads > 0 
    ? (leads.filter(l => l.status === "VENDIDO").length / totalLeads) * 100 
    : 0;

  return (
    <div className="space-y-8 pb-20">
      {/* Header Visual Elite - Consola de Comando */}
      <div className="relative p-8 rounded-[2rem] bg-primary overflow-hidden shadow-2xl border border-white/10">
        <div className="absolute inset-0 opacity-10 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')]"></div>
        <div className="relative z-10 flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
          <div>
            <div className="flex items-center gap-3 mb-2">
               <ShieldCheck className="w-5 h-5 text-[#E85D04]" />
               <span className="text-[10px] font-black uppercase tracking-widest text-white/40">VILKMET Security System Activo</span>
            </div>
            <h2 className="text-4xl font-heading font-black text-white tracking-widest uppercase">
              Embudo <span className="text-[#E85D04]">Estratégico</span>
            </h2>
            <p className="text-blue-100/60 font-medium">Panel de gestión de proyectos de alta categoría.</p>
          </div>
          <div className="bg-white/10 backdrop-blur-md border border-white/20 px-6 py-4 rounded-2xl">
               <span className="text-[10px] font-black uppercase tracking-widest text-white/50 block mb-1">Última Sincronización</span>
               <span className="text-lg font-bold text-white uppercase">
                 {(() => {
                   try { return format(new Date(), "PP", { locale: es }); } 
                   catch { return "SINCRO PENDIENTE"; }
                 })()}
               </span>
          </div>
        </div>

        {/* Status Dashboard Grid */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mt-10 relative z-10">
          <Card className="bg-white/5 border-white/10 backdrop-blur-sm border-none shadow-none">
            <CardHeader className="pb-1">
              <span className="text-[9px] font-black uppercase tracking-widest text-white/40 flex items-center gap-2">
                <Users className="w-3 h-3" /> Prospectos
              </span>
            </CardHeader>
            <CardContent>
              <span className="text-3xl font-heading font-black text-white">{totalLeads}</span>
            </CardContent>
          </Card>
          
          <Card className="bg-white/5 border-white/10 backdrop-blur-sm border-none shadow-none">
            <CardHeader className="pb-1">
              <span className="text-[9px] font-black uppercase tracking-widest text-white/40 flex items-center gap-2">
                <DollarSign className="w-3 h-3 text-[#E85D04]" /> Pipeline Bruto
              </span>
            </CardHeader>
            <CardContent>
              <span className="text-3xl font-heading font-black text-white">
                ${pipelineValue.toLocaleString("es-AR")}
              </span>
            </CardContent>
          </Card>

          <Card className="bg-white/10 border-[#E85D04]/30 backdrop-blur-sm border-none shadow-xl">
            <CardHeader className="pb-1">
              <span className="text-[9px] font-black uppercase tracking-widest text-[#E85D04] flex items-center gap-2">
                <TrendingUp className="w-3 h-3" /> Utilidad Proyectada
              </span>
            </CardHeader>
            <CardContent>
              <span className="text-3xl font-heading font-black text-white">
                ${netValue.toLocaleString("es-AR")}
              </span>
            </CardContent>
          </Card>

          <Card className="bg-white/5 border-white/10 backdrop-blur-sm border-none shadow-none">
            <CardHeader className="pb-1">
              <span className="text-[9px] font-black uppercase tracking-widest text-white/40 flex items-center gap-2">
                <CheckCircle2 className="w-3 h-3 text-green-400" /> Tasa de Cierre
              </span>
            </CardHeader>
            <CardContent>
              <span className="text-3xl font-heading font-black text-white">
                {conversionRate.toFixed(1)}%
              </span>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Listado de Prospectos Activos */}
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-8">
        {leads.length === 0 ? (
          <div className="col-span-full text-center py-24 bg-white rounded-[3rem] border-2 border-dashed border-slate-100 shadow-inner">
             <div className="bg-slate-50 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6">
                <Users className="w-10 h-10 text-slate-200" />
             </div>
             <h3 className="text-2xl font-heading font-black text-primary uppercase">Sin actividad comercial hoy</h3>
             <p className="text-muted-foreground mt-2 font-medium">Los presupuestos entrarán automáticamente en esta consola.</p>
          </div>
        ) : (
          leads.map(lead => (
            <LeadManagementCard key={lead.id} lead={lead} />
          ))
        )}
      </div>
    </div>
  );
}

function LeadManagementCard({ lead }: { lead: any }) {
  return (
    <Card className="rounded-[3rem] overflow-hidden border-none shadow-xl hover:shadow-2xl transition-all duration-500 group bg-white">
      <CardHeader className="p-10 border-b relative">
        {/* Status Ribbon Elite */}
        <div className={`absolute top-0 right-0 px-8 py-3 rounded-bl-3xl font-black text-[10px] uppercase tracking-widest shadow-lg ${
          lead.status === "VENDIDO" ? "bg-green-500 text-white" :
          lead.status === "PERDIDO" ? "bg-red-500 text-white" :
          lead.status === "PRESUPUESTADO" ? "bg-[#1A3A52] text-white" :
          "bg-[#E85D04] text-white"
        }`}>
          {lead.status || "NUEVO"}
        </div>

        <div className="flex justify-between items-start pr-20">
          <div>
            <h4 className="text-3xl font-heading font-black text-primary uppercase leading-tight mb-2 tracking-tight">
                {lead.nombre}
            </h4>
            <div className="flex items-center gap-2 text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground/50">
               <Clock className="w-3 h-3 text-[#E85D04]" /> 
               {(() => {
                 try { return format(new Date(lead.fechaAlta), "PPP", { locale: es }); }
                 catch { return "Fecha no registrada"; }
               })()}
            </div>
          </div>

          <form action={async () => { "use server"; await deleteLead(lead.id); }}>
            <button className="p-4 text-slate-200 hover:text-red-500 hover:bg-red-50 transition-all rounded-2xl group-hover:scale-110">
              <Trash2 className="w-6 h-6" />
            </button>
          </form>
        </div>

        <div className="flex flex-wrap gap-4 mt-8">
          <a 
            href={`https://wa.me/${lead.whatsapp.replace(/\D/g, '')}?text=Hola%20${lead.nombre},%20vimos%20tu%20cotización%20en%20VILKMET...`} 
            target="_blank" 
            className="flex items-center gap-3 px-8 py-4 bg-green-50 text-green-600 rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-green-100 transition-colors border border-green-200 shadow-sm"
          >
            <Phone className="w-4 h-4" /> Enviar WhatsApp
          </a>
          <div className="flex-1 min-w-[200px]">
             <LeadStatusSelector leadId={lead.id} currentStatus={lead.status} />
          </div>
        </div>
      </CardHeader>

      <CardContent className="p-10 bg-slate-50/50 space-y-8">
        {/* Detalle de Cotizaciones */}
        <div className="space-y-4">
           <h5 className="text-[10px] font-black uppercase tracking-[0.2em] text-primary/30 flex items-center gap-2">
             <LayoutTemplate className="w-3 h-3" /> Memoria Descriptiva
           </h5>
           {(lead.quotes || []).map((quote: any) => (
             <div key={quote.id} className="bg-white border-2 border-white p-8 rounded-[2.5rem] shadow-sm hover:shadow-md transition-shadow">
                <div className="flex justify-between items-center border-b border-slate-50 pb-6 mb-6">
                   <div className="space-y-1">
                      <span className="text-[9px] font-black bg-[#1A3A52]/10 text-[#1A3A52] px-3 py-1 rounded-full uppercase tracking-widest">{quote.linea}</span>
                      <p className="font-heading font-black text-primary text-xl uppercase tracking-tighter">{quote.tipologia}</p>
                   </div>
                   <div className="text-right">
                      <span className="text-xs font-black text-slate-300 block mb-1">Inversión Sugerida</span>
                      <span className="text-3xl font-heading font-black text-[#E85D04] tracking-tighter">
                         ${(Number(quote.precioFinal) || 0).toLocaleString("es-AR")}
                      </span>
                   </div>
                </div>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-[9px] font-black uppercase tracking-[0.1em] text-muted-foreground/60">
                   <div className="space-y-2">
                      <span className="text-accent/40 block">Dimensión</span>
                      <span className="text-primary text-[11px] font-black">{quote.ancho} x {quote.alto} MM</span>
                   </div>
                   <div className="space-y-2">
                      <span className="text-accent/40 block">Perfilería</span>
                      <span className="text-primary text-[11px] font-black">{quote.color}</span>
                   </div>
                   <div className="space-y-2">
                      <span className="text-accent/40 block">Acristalamiento</span>
                      <span className="text-primary text-[11px] font-black">{quote.acristalamiento}</span>
                   </div>
                   <div className="space-y-2 text-right">
                      <span className="text-accent/40 block">Código</span>
                      <span className="text-primary font-mono">{quote.id.split('-')[0]}</span>
                   </div>
                </div>
             </div>
           ))}
        </div>

        {/* Seguimiento de Wilson */}
        <div className="pt-6 border-t border-slate-200/50">
           <h5 className="text-[10px] font-black uppercase tracking-[0.2em] text-primary/30 flex items-center gap-2 mb-4">
             <MessageSquare className="w-3 h-3" /> Bitácora de Gestión
           </h5>
           <LeadNotesInput leadId={lead.id} initialNotes={lead.adminNotes || ""} />
        </div>
      </CardContent>
    </Card>
  );
}

// Subcomponentes del Dashboard
async function LeadStatusSelector({ leadId, currentStatus }: { leadId: string, currentStatus: string }) {
  return (
    <form action={async (formData) => { "use server"; await updateLeadStatus(leadId, formData.get("status") as string); }}>
      <select 
        name="status"
        defaultValue={currentStatus || "NUEVO"}
        onChange={(e) => e.target.form?.requestSubmit()}
        className="w-full bg-white border-2 border-slate-100 px-6 py-4 rounded-2xl text-[11px] font-black uppercase tracking-widest text-primary focus:border-[#1A3A52] outline-none appearance-none transition-all cursor-pointer shadow-sm"
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

async function LeadNotesInput({ leadId, initialNotes }: { leadId: string, initialNotes: string }) {
  return (
    <form action={async (formData) => { "use server"; await updateLeadNotes(leadId, formData.get("notes") as string); }} className="relative group">
      <textarea 
        name="notes"
        defaultValue={initialNotes}
        placeholder="Añade notas sobre el despacho, materiales o contacto..."
        className="w-full bg-white border-2 border-slate-100 p-6 rounded-[2rem] text-sm text-primary/70 focus:border-[#E85D04]/30 outline-none transition-all placeholder:text-slate-200 min-h-[120px] resize-none pr-14 shadow-inner"
      />
      <button className="absolute bottom-6 right-6 p-3 bg-slate-50 text-slate-300 hover:text-[#E85D04] hover:bg-[#E85D04]/10 rounded-xl transition-all opacity-0 group-focus-within:opacity-100">
        <CheckCircle2 className="w-5 h-5" />
      </button>
    </form>
  );
}
